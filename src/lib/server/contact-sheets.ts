/**
 * Server-only helpers for persisting Contact page submissions to Google
 * Sheets — one sheet for volunteer sign-ups, a separate one for general
 * queries, so the two can be triaged independently.
 *
 * Same "no database" pattern as blog posts (see google-sheets.ts): each
 * sheet gets a small Apps Script Web App deployed against it, and this
 * module just POSTs to that URL.
 *
 * Setup: see GOOGLE_SHEET_CONTACT_SETUP.md.
 *   - google-apps-script/Code.Volunteer.gs — paste into the volunteer sheet
 *   - google-apps-script/Code.Query.gs      — paste into the query sheet
 *
 * This module must only ever be imported from server code.
 */

export type ContactSubmissionKind = "volunteer" | "query";

export interface ContactSubmission {
  name: string;
  email: string;
  phone: string;
  location: string;
  message: string;
}

const ENV_VARS: Record<ContactSubmissionKind, { url: string; secret: string }> = {
  volunteer: { url: "VOLUNTEER_SHEET_WEBHOOK_URL", secret: "VOLUNTEER_SHEET_WEBHOOK_SECRET" },
  query: { url: "QUERY_SHEET_WEBHOOK_URL", secret: "QUERY_SHEET_WEBHOOK_SECRET" },
};

export class SheetNotConfiguredError extends Error {
  constructor(kind: ContactSubmissionKind) {
    super(
      `Google Sheet isn't connected yet for ${kind} submissions. Set ${ENV_VARS[kind].url} in the environment (see GOOGLE_SHEET_CONTACT_SETUP.md) before accepting submissions.`,
    );
    this.name = "SheetNotConfiguredError";
  }
}

function getWebhookUrl(kind: ContactSubmissionKind): string | undefined {
  return process.env[ENV_VARS[kind].url]?.trim() || undefined;
}

function getWebhookSecret(kind: ContactSubmissionKind): string | undefined {
  return process.env[ENV_VARS[kind].secret]?.trim() || undefined;
}

export function isContactSheetConfigured(kind: ContactSubmissionKind): boolean {
  return Boolean(getWebhookUrl(kind));
}

/** Appends one submission row to the relevant sheet. Throws on any failure. */
export async function appendContactSubmissionToSheet(
  kind: ContactSubmissionKind,
  submission: ContactSubmission,
): Promise<void> {
  const url = getWebhookUrl(kind);
  if (!url) throw new SheetNotConfiguredError(kind);

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: getWebhookSecret(kind), ...submission }),
    });
  } catch (error) {
    throw new Error(
      `Couldn't reach the ${kind} Google Sheet webhook: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  if (!response.ok) {
    throw new Error(`${kind} Google Sheet webhook responded with HTTP ${response.status}.`);
  }

  const data = (await response.json().catch(() => null)) as {
    success?: boolean;
    error?: string;
  } | null;
  if (!data?.success) {
    throw new Error(data?.error ?? `${kind} Google Sheet webhook did not confirm the write.`);
  }
}
