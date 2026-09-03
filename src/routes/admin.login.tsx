import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";
import { SiteLayout } from "@/components/SiteLayout";
import { useAdminAuth } from "@/lib/admin-auth";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertCircle, Lock } from "lucide-react";

const searchSchema = z.object({
  redirect: z.string().optional().catch(undefined),
});

export const Route = createFileRoute("/admin/login")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [{ title: "Admin Login — Mirani Foundation" }],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const { redirect } = useSearch({ from: "/admin/login" });
  const navigate = useNavigate();
  const { ready, authenticated, login } = useAdminAuth();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Already logged in? Skip straight past the login form.
  useEffect(() => {
    if (ready && authenticated) {
      navigate({ to: redirect || "/admin/blogs/new" });
    }
  }, [ready, authenticated, redirect, navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const result = await login(password);
    setSubmitting(false);
    if (result) {
      setError(result);
      return;
    }
    navigate({ to: redirect || "/admin/blogs/new" });
  }

  return (
    <SiteLayout>
      <section className="section-y">
        <div className="container-mirani max-w-md">
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand/10">
              <Lock className="h-5 w-5 text-brand-on-light dark:text-brand cb:text-brand" />
            </div>
            <h1 className="mt-4 text-2xl font-bold text-ink">Admin login</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Sign in to add new blog posts to the site.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoFocus
                />
              </div>

              {error && (
                <p className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 shrink-0" /> {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-ink btn-ink-hover w-full justify-center disabled:opacity-60"
              >
                {submitting ? "Signing in…" : "Sign in"}
              </button>
            </form>

            <Link
              to="/blogs"
              className="mt-6 block text-center text-sm text-muted-foreground hover:text-ink"
            >
              Back to blogs
            </Link>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
