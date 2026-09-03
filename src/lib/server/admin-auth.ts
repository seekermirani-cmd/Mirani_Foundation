/**
 * Server-only admin authentication helpers.
 *
 * There is no database in this project yet (see the TODO(persistence) notes
 * in `src/routes/api.contact.ts`), so sessions are implemented as a
 * stateless, signed token rather than a server-side session store:
 *
 *   token = "<issuedAtMs>.<base64url(HMAC-SHA256(secret, issuedAtMs))>"
 *
 * The token is handed back as an httpOnly cookie. To verify a request we
 * just recompute the HMAC and compare — no lookup required. This is a
 * reasonable stopgap for a single hardcoded admin credential; if real
 * multi-admin accounts are ever needed, swap this out for a proper
 * session table (e.g. Cloudflare D1/KV) and password hashing.
 *
 * This module must only ever be imported from server code (server routes /
 * server functions) — never from client components.
 */

export const ADMIN_SESSION_COOKIE = "mirani_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

/**
 * Fallback dev-only secret so the login flow works out of the box in local
 * development without extra setup. In production, ALWAYS set the
 * ADMIN_PASSWORD and ADMIN_SESSION_SECRET environment variables — the
 * fallbacks below are intentionally well-known and provide no real security.
 */
const DEV_FALLBACK_PASSWORD = "MiraniAdmin@2024";
const DEV_FALLBACK_SECRET = "mirani-foundation-dev-only-session-secret";

function getAdminPassword(): string {
  return process.env.ADMIN_PASSWORD?.trim() || DEV_FALLBACK_PASSWORD;
}

function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET?.trim() || DEV_FALLBACK_SECRET;
}

function base64UrlEncode(bytes: ArrayBuffer): string {
  const bin = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmacSign(message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return base64UrlEncode(signature);
}

/** Checks a submitted password against the configured admin password. */
export function isCorrectAdminPassword(password: string): boolean {
  return typeof password === "string" && password.length > 0 && password === getAdminPassword();
}

/** Issues a new signed session token, valid for SESSION_TTL_MS. */
export async function createAdminSessionToken(): Promise<string> {
  const issuedAt = Date.now().toString();
  const signature = await hmacSign(issuedAt);
  return `${issuedAt}.${signature}`;
}

/** Verifies a session token's signature and expiry. */
export async function verifyAdminSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [issuedAt, signature] = token.split(".");
  if (!issuedAt || !signature) return false;

  const issuedAtMs = Number(issuedAt);
  if (!Number.isFinite(issuedAtMs)) return false;
  if (Date.now() - issuedAtMs > SESSION_TTL_MS) return false;

  const expected = await hmacSign(issuedAt);
  return expected === signature;
}

export function adminSessionCookie(token: string): string {
  const maxAge = Math.floor(SESSION_TTL_MS / 1000);
  return `${ADMIN_SESSION_COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;
}

export function clearAdminSessionCookie(): string {
  return `${ADMIN_SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

/** Pulls the session cookie value out of a request's Cookie header. */
export function readSessionCookie(request: Request): string | undefined {
  const header = request.headers.get("cookie");
  if (!header) return undefined;
  const match = header
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${ADMIN_SESSION_COOKIE}=`));
  return match?.slice(ADMIN_SESSION_COOKIE.length + 1);
}
