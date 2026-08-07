/**
 * Cloudflare Turnstile server-side verification helper.
 *
 * This module talks to Cloudflare's Siteverify API to confirm that a token
 * produced by the Turnstile widget on the client is genuine. It must only
 * ever be imported from server-side code (server routes, server functions).
 * The secret key never leaves this module.
 */

const SITEVERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Raw shape of Cloudflare's siteverify response. */
interface TurnstileSiteverifyResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  "error-codes"?: string[];
  action?: string;
  cdata?: string;
}

/** Normalized result returned to callers. */
export interface TurnstileVerificationResult {
  success: boolean;
  challengeTimestamp?: string;
  hostname?: string;
  errorCodes: string[];
}

/** Thrown when a token fails verification or the request itself fails. */
export class TurnstileVerificationError extends Error {
  errorCodes: string[];

  constructor(message: string, errorCodes: string[] = []) {
    super(message);
    this.name = "TurnstileVerificationError";
    this.errorCodes = errorCodes;
  }
}

/**
 * Verifies a Turnstile token against Cloudflare's Siteverify API.
 *
 * @param token - The `cf-turnstile-response` token submitted by the client widget.
 * @param remoteIp - Optional client IP, improves Cloudflare's fraud signal.
 * @throws {TurnstileVerificationError} If the token is missing, invalid, expired,
 *         already used, or the Siteverify request itself fails.
 */
export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string,
): Promise<TurnstileVerificationResult> {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    // Fail loudly in server logs — this is a deployment/config problem, not a user error.
    throw new TurnstileVerificationError(
      "TURNSTILE_SECRET_KEY is not configured on the server.",
    );
  }

  if (!token || typeof token !== "string") {
    throw new TurnstileVerificationError("Missing Turnstile token.", [
      "missing-input-response",
    ]);
  }

  const body = new URLSearchParams();
  body.set("secret", secretKey);
  body.set("response", token);
  if (remoteIp) body.set("remoteip", remoteIp);

  let response: Response;
  try {
    response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
  } catch (error) {
    throw new TurnstileVerificationError(
      `Failed to reach Cloudflare Siteverify API: ${error instanceof Error ? error.message : String(error)}`,
    );
  }

  if (!response.ok) {
    throw new TurnstileVerificationError(
      `Siteverify API responded with HTTP ${response.status}.`,
    );
  }

  const data = (await response.json()) as TurnstileSiteverifyResponse;

  if (!data.success) {
    throw new TurnstileVerificationError(
      "Turnstile verification failed.",
      data["error-codes"] ?? [],
    );
  }

  return {
    success: true,
    challengeTimestamp: data.challenge_ts,
    hostname: data.hostname,
    errorCodes: [],
  };
}
