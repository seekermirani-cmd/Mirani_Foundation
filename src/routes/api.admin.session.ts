import { createFileRoute } from "@tanstack/react-router";
import { readSessionCookie, verifyAdminSessionToken } from "@/lib/server/admin-auth";

/** GET /api/admin/session — reports whether the current request is an authenticated admin. */

async function handleSession(request: Request): Promise<Response> {
  const token = readSessionCookie(request);
  const authenticated = await verifyAdminSessionToken(token);
  return new Response(JSON.stringify({ authenticated }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export const Route = createFileRoute("/api/admin/session")({
  server: {
    handlers: {
      GET: async ({ request }) => handleSession(request),
    },
  },
});
