import { createFileRoute } from "@tanstack/react-router";
import {
  TurnstileVerificationError,
  verifyTurnstileToken,
} from "@/lib/server/turnstile";
import {
  appendContactSubmissionToSheet,
  isContactSheetConfigured,
  SheetNotConfiguredError,
} from "@/lib/server/contact-sheets";

/**
 * POST /api/contact
 *
 * Minimal, production-ready endpoint for the contact/volunteer form.
 * Flow: validate request -> verify Turnstile -> persist to the volunteer
 * or query Google Sheet (see GOOGLE_SHEET_CONTACT_SETUP.md) -> respond.
 *
 * This file lives under src/routes because TanStack Start's server routes
 * are file-based, exactly like the page routes already in this folder —
 * a Vercel-style `api/contact.ts` at the repo root would never be invoked,
 * since this app's single server entry (src/server.ts -> src/start.ts) is
 * what TanStack Start's router dispatches through, not Vercel's function
 * runtime. The route path is derived from the filename: `api.contact.ts`
 * resolves to `/api/contact`, keeping the same public URL the frontend
 * would expect from the original plan.
 */

/** Shape of the JSON body the contact form is expected to send. */
interface ContactRequestBody {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  message?: string;
  mode?: "volunteer" | "query";
  turnstileToken?: string;
}

/** Structured success response. */
interface ContactSuccessResponse {
  success: true;
  message: string;
}

/** Structured error response. */
interface ContactErrorResponse {
  success: false;
  error: string;
  fieldErrors?: Record<string, string>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[6-9]\d{9}$/;

function jsonResponse(
  body: ContactSuccessResponse | ContactErrorResponse,
  status: number,
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function methodNotAllowed() {
  return new Response(
    JSON.stringify({ success: false, error: "Method not allowed." }),
    {
      status: 405,
      headers: { "Content-Type": "application/json", Allow: "POST" },
    },
  );
}

function validate(body: ContactRequestBody): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!body.name?.trim()) errors.name = "Name is required.";
  if (!body.email || !EMAIL_RE.test(body.email))
    errors.email = "A valid email is required.";
  if (!body.phone || !PHONE_RE.test(body.phone))
    errors.phone = "A valid 10-digit Indian phone number is required.";
  if (!body.location?.trim()) errors.location = "Location is required.";
  if (!body.message?.trim()) errors.message = "Message is required.";
  if (!body.turnstileToken)
    errors.turnstileToken = "Turnstile verification token is missing.";
  return errors;
}

async function handleContactSubmission(request: Request): Promise<Response> {
  try {
    // 1. Parse JSON
    let body: ContactRequestBody;
    try {
      body = (await request.json()) as ContactRequestBody;
    } catch {
      return jsonResponse(
        { success: false, error: "Request body must be valid JSON." },
        400,
      );
    }

    // 2. Validate required fields
    const fieldErrors = validate(body);
    if (Object.keys(fieldErrors).length > 0) {
      return jsonResponse(
        { success: false, error: "Validation failed.", fieldErrors },
        400,
      );
    }

    // 2b. Confirm the destination sheet for this submission mode is
    // configured before doing the (slower, external) Turnstile check.
    const kind = body.mode === "volunteer" ? "volunteer" : "query";
    if (!isContactSheetConfigured(kind)) {
      const envVar =
        kind === "volunteer"
          ? "VOLUNTEER_SHEET_WEBHOOK_URL"
          : "QUERY_SHEET_WEBHOOK_URL";
      return jsonResponse(
        {
          success: false,
          error: `Google Sheet isn't connected yet. Set ${envVar} in the environment (see GOOGLE_SHEET_CONTACT_SETUP.md) before accepting ${kind} submissions.`,
        },
        501,
      );
    }

    // 3. Verify Turnstile
    const clientIp =
      request.headers.get("cf-connecting-ip") ??
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      undefined;

    try {
      await verifyTurnstileToken(body.turnstileToken!, clientIp);
    } catch (error) {
      if (error instanceof TurnstileVerificationError) {
        console.error(
          "Turnstile verification failed:",
          error.message,
          error.errorCodes,
        );
        return jsonResponse(
          {
            success: false,
            error: "Verification failed. Please retry the challenge.",
          },
          403,
        );
      }
      throw error;
    }

    // 4. Persist to the volunteer or query Google Sheet (separate sheets so
    // the two streams can be triaged independently). See
    // GOOGLE_SHEET_CONTACT_SETUP.md for how the sheets/webhooks are set up.
    // TODO(notifications): send an email/Slack alert to the team on new submissions.
    try {
      await appendContactSubmissionToSheet(kind, {
        name: body.name!.trim(),
        email: body.email!.trim(),
        phone: body.phone!.trim(),
        location: body.location!.trim(),
        message: body.message!.trim(),
      });
    } catch (error) {
      const message =
        error instanceof SheetNotConfiguredError
          ? error.message
          : `Failed to save your ${kind} submission: ${error instanceof Error ? error.message : String(error)}`;
      console.error(message);
      return jsonResponse({ success: false, error: message }, 502);
    }

    // 5. Success response
    return jsonResponse(
      { success: true, message: "Thanks — your message has been received." },
      200,
    );
  } catch (error) {
    // Catch-all for anything unexpected (config/network errors, bugs above, etc).
    console.error("Unhandled error in /api/contact:", error);
    return jsonResponse(
      { success: false, error: "Internal server error." },
      500,
    );
  }
}

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => handleContactSubmission(request),

      // Explicitly reject non-POST methods with a clear status + Allow header.
      GET: async () => methodNotAllowed(),
      PUT: async () => methodNotAllowed(),
      PATCH: async () => methodNotAllowed(),
      DELETE: async () => methodNotAllowed(),
    },
  },
});
