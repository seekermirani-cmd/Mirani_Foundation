import { createFileRoute } from "@tanstack/react-router";
import {
  adminSessionCookie,
  createAdminSessionToken,
  isCorrectAdminPassword,
} from "@/lib/server/admin-auth";

/**
 * POST /api/admin/login
 *
 * Checks the submitted password against ADMIN_PASSWORD (see
 * src/lib/server/admin-auth.ts) and, on success, sets an httpOnly signed
 * session cookie so the admin stays logged in across page loads.
 */

interface LoginRequestBody {
  password?: string;
}

function jsonResponse(body: Record<string, unknown>, status: number, headers?: HeadersInit) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

async function handleLogin(request: Request): Promise<Response> {
  let body: LoginRequestBody;
  try {
    body = (await request.json()) as LoginRequestBody;
  } catch {
    return jsonResponse({ success: false, error: "Request body must be valid JSON." }, 400);
  }

  if (!body.password) {
    return jsonResponse({ success: false, error: "Password is required." }, 400);
  }

  if (!isCorrectAdminPassword(body.password)) {
    return jsonResponse({ success: false, error: "Incorrect password." }, 401);
  }

  const token = await createAdminSessionToken();
  return jsonResponse({ success: true }, 200, { "Set-Cookie": adminSessionCookie(token) });
}

export const Route = createFileRoute("/api/admin/login")({
  server: {
    handlers: {
      POST: async ({ request }) => handleLogin(request),
    },
  },
});
