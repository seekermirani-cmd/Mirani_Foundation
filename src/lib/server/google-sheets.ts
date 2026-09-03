/**
 * Server-only helper for persisting blog posts to a Google Sheet.
 *
 * There's still no traditional database wired up for this project, but a
 * Google Sheet makes a perfectly good "for now" datastore: a tiny Google
 * Apps Script deployed as a Web App exposes doPost (append a row) and
 * doGet (return all rows as JSON), and this module just calls that URL.
 *
 * Setup (see /docs/google-sheet-blog-setup — or the setup guide shared
 * alongside this change):
 *   1. Create a Google Sheet, paste the provided Apps Script into
 *      Extensions > Apps Script.
 *   2. Deploy it as a Web App ("Execute as: Me", "Who has access: Anyone
 *      with the link") and copy the resulting URL.
 *   3. Set BLOG_SHEET_WEBHOOK_URL (and optionally BLOG_SHEET_WEBHOOK_SECRET,
 *      matching the SHEET_SECRET script property) in the environment.
 *
 * This module must only ever be imported from server code.
 */

import type { BlogPost } from "@/lib/site-data";

export class SheetNotConfiguredError extends Error {
  constructor() {
    super(
      "Google Sheet isn't connected yet. Set BLOG_SHEET_WEBHOOK_URL in the environment (see the setup guide) before publishing.",
    );
    this.name = "SheetNotConfiguredError";
  }
}

function getWebhookUrl(): string | undefined {
  return process.env.BLOG_SHEET_WEBHOOK_URL?.trim() || undefined;
}

function getWebhookSecret(): string | undefined {
  return process.env.BLOG_SHEET_WEBHOOK_SECRET?.trim() || undefined;
}

export function isSheetConfigured(): boolean {
  return Boolean(getWebhookUrl());
}

/** Appends a new post row to the sheet. Throws on any failure. */
export async function appendBlogPostToSheet(post: BlogPost): Promise<void> {
  const url = getWebhookUrl();
  if (!url) throw new SheetNotConfiguredError();

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: getWebhookSecret(), ...post }),
    });
  } catch (error) {
    throw new Error(
      `Couldn't reach the Google Sheet webhook: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  if (!response.ok) {
    throw new Error(`Google Sheet webhook responded with HTTP ${response.status}.`);
  }

  const data = (await response.json().catch(() => null)) as {
    success?: boolean;
    error?: string;
  } | null;
  if (!data?.success) {
    throw new Error(data?.error ?? "Google Sheet webhook did not confirm the write.");
  }
}

/** Deletes one post row from the sheet by slug. Throws on any failure. */
export async function deleteBlogPostFromSheet(slug: string): Promise<void> {
  const url = getWebhookUrl();
  if (!url) throw new SheetNotConfiguredError();

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: getWebhookSecret(), action: "delete", slug }),
    });
  } catch (error) {
    throw new Error(
      `Couldn't reach the Google Sheet webhook: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  if (!response.ok) {
    throw new Error(`Google Sheet webhook responded with HTTP ${response.status}.`);
  }

  const data = (await response.json().catch(() => null)) as {
    success?: boolean;
    error?: string;
  } | null;
  if (!data?.success) {
    throw new Error(data?.error ?? "Google Sheet webhook did not confirm the deletion.");
  }
}

/** Fetches all posts currently stored in the sheet, oldest failures swallowed to []. */
export async function fetchBlogPostsFromSheet(): Promise<BlogPost[]> {
  const url = getWebhookUrl();
  if (!url) return [];

  const requestUrl = new URL(url);
  const secret = getWebhookSecret();
  if (secret) requestUrl.searchParams.set("secret", secret);

  let response: Response;
  try {
    response = await fetch(requestUrl.toString());
  } catch (error) {
    console.error("Failed to reach Google Sheet webhook:", error);
    return [];
  }

  if (!response.ok) {
    console.error(`Google Sheet webhook responded with HTTP ${response.status}.`);
    return [];
  }

  const data = (await response.json().catch(() => null)) as {
    success?: boolean;
    posts?: unknown;
  } | null;

  if (!data?.success || !Array.isArray(data.posts)) return [];

  return data.posts.filter(isValidBlogPostRow);
}

function isValidBlogPostRow(row: unknown): row is BlogPost {
  if (!row || typeof row !== "object") return false;
  const r = row as Record<string, unknown>;
  return (
    typeof r.slug === "string" &&
    r.slug.length > 0 &&
    typeof r.title === "string" &&
    typeof r.excerpt === "string" &&
    typeof r.content === "string" &&
    typeof r.category === "string" &&
    typeof r.date === "string" &&
    typeof r.image === "string"
  );
}
