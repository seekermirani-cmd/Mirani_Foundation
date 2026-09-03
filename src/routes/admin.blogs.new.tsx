import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { useAdminAuth } from "@/lib/admin-auth";
import {
  addBlogPost,
  BLOG_IMAGE_PLACEHOLDER,
  deleteBlogPost,
  fetchAdminBlogPosts,
} from "@/lib/blog-store";
import type { BlogPost } from "@/lib/site-data";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { RichTextEditor } from "@/components/RichTextEditor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getPlainTextFromRichText } from "@/lib/rich-text";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertCircle, ExternalLink, LogOut, RefreshCw, Trash2 } from "lucide-react";

const CATEGORIES: BlogPost["category"][] = ["Campaign", "Story", "Press Release", "Publication"];

export const Route = createFileRoute("/admin/blogs/new")({
  head: () => ({
    meta: [{ title: "Add Blog Post — Mirani Foundation" }],
  }),
  component: AddBlogPage,
});

function AddBlogPage() {
  const navigate = useNavigate();
  const { ready, authenticated, logout } = useAdminAuth();

  // Gate the page behind admin login once we know the session state.
  useEffect(() => {
    if (ready && !authenticated) {
      navigate({ to: "/admin/login", search: { redirect: "/admin/blogs/new" } });
    }
  }, [ready, authenticated, navigate]);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<BlogPost["category"]>("Story");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [deletingSlug, setDeletingSlug] = useState("");

  const loadPosts = useCallback(async () => {
    setLoadingPosts(true);
    try {
      const sheetPosts = await fetchAdminBlogPosts();
      setPosts([...sheetPosts].sort((a, b) => (a.date < b.date ? 1 : -1)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load admin-created posts.");
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  useEffect(() => {
    if (ready && authenticated) {
      void loadPosts();
    }
  }, [ready, authenticated, loadPosts]);

  if (!ready || !authenticated) {
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setNotice("");

    if (!title.trim() || !excerpt.trim() || !getPlainTextFromRichText(content).trim()) {
      setError("Title, excerpt and content are all required.");
      return;
    }

    setSubmitting(true);
    try {
      const post = await addBlogPost({
        title,
        excerpt,
        content,
        category,
        date,
        image: imageUrl,
      });
      navigate({ to: "/blog-reader/$slug", params: { slug: post.slug } });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish the post.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeletePost(post: BlogPost) {
    const confirmed = window.confirm(
      `Delete "${post.title}"? This removes the post from the shared blog list.`,
    );
    if (!confirmed) return;

    setError("");
    setNotice("");
    setDeletingSlug(post.slug);
    try {
      await deleteBlogPost(post.slug);
      setPosts((current) => current.filter((item) => item.slug !== post.slug));
      setNotice("Blog post deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete the post.");
    } finally {
      setDeletingSlug("");
    }
  }

  async function handleLogout() {
    await logout();
    navigate({ to: "/admin/login" });
  }

  return (
    <SiteLayout>
      <section className="bg-cream section-y">
        <div className="container-mirani max-w-3xl flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-on-light dark:text-brand cb:text-secondary">
              Admin
            </p>
            <h1 className="mt-3 text-4xl font-bold text-ink">Add a blog post</h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Publish a new campaign, story, press release, or publication.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="btn-outline-ink btn-outline-ink-hover shrink-0"
            type="button"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </section>

      <section className="section-y">
        <div className="container-mirani max-w-4xl grid md:grid-cols-[1fr_280px] gap-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. A New Well for Deolali Camp"
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={category}
                  onValueChange={(v) => setCategory(v as BlogPost["category"])}
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="A one- or two-sentence summary shown on the blog list"
                rows={2}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <RichTextEditor
                id="content"
                value={content}
                onChange={setContent}
                placeholder="Write and format the full post"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL (optional)</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Leave blank to use a placeholder for now"
              />
              <p className="text-xs text-muted-foreground">
                No photo yet? Leave this blank — the post will show a placeholder image until one is
                added.
              </p>
            </div>

            {error && (
              <p className="flex items-center gap-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" /> {error}
              </p>
            )}

            {notice && <p className="text-sm font-medium text-brand-on-light">{notice}</p>}

            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="btn-ink btn-ink-hover disabled:opacity-60"
              >
                {submitting ? "Publishing…" : "Publish post"}
              </button>
              <Link to="/blogs" className="btn-outline-ink btn-outline-ink-hover">
                Cancel
              </Link>
            </div>

            <p className="text-xs text-muted-foreground pt-2">
              Posts published here are saved to the connected Google Sheet, so they'll show up for
              every visitor — not just this browser.
            </p>
          </form>

          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-ink mb-2">Preview</p>
              <div className="aspect-[16/10] rounded-xl overflow-hidden border border-border">
                {imageUrl.trim() ? (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <ImagePlaceholder />
                )}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold text-ink">Manage posts</h2>
                  <p className="mt-1 text-xs text-muted-foreground">Delete admin-created posts.</p>
                </div>
                <button
                  type="button"
                  onClick={() => void loadPosts()}
                  disabled={loadingPosts}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-ink disabled:opacity-60"
                  aria-label="Refresh posts"
                  title="Refresh posts"
                >
                  <RefreshCw className={`h-4 w-4 ${loadingPosts ? "animate-spin" : ""}`} />
                </button>
              </div>

              <div className="mt-4 space-y-3">
                {loadingPosts && posts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Loading posts...</p>
                ) : posts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No admin-created posts yet.</p>
                ) : (
                  posts.map((post) => (
                    <div key={post.slug} className="rounded-lg border border-border p-3">
                      <p className="text-sm font-semibold leading-snug text-ink">{post.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {post.category} ·{" "}
                        {new Date(post.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Link
                          to="/blog-reader/$slug"
                          params={{ slug: post.slug }}
                          className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full border border-border px-3 text-xs font-semibold text-ink transition-colors hover:border-ink"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          View
                        </Link>
                        <button
                          type="button"
                          onClick={() => void handleDeletePost(post)}
                          disabled={deletingSlug === post.slug}
                          className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-full border border-destructive/40 px-3 text-xs font-semibold text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground disabled:opacity-60"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          {deletingSlug === post.slug ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

// Re-exported so other modules (e.g. tests) can reach the placeholder
// sentinel through this route if needed.
export { BLOG_IMAGE_PLACEHOLDER };
