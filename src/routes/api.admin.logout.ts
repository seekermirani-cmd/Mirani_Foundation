import { createFileRoute } from "@tanstack/react-router";
import { clearAdminSessionCookie } from "@/lib/server/admin-auth";

/** POST /api/admin/logout — clears the admin session cookie. */

async function handleLogout(): Promise<Response> {
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": clearAdminSessionCookie(),
    },
  });
}

export const Route = createFileRoute("/api/admin/logout")({
  server: {
    handlers: {
      POST: async () => handleLogout(),
    },
  },
});
