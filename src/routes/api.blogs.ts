import { createFileRoute } from "@tanstack/react-router";
import { readSessionCookie, verifyAdminSessionToken } from "@/lib/server/admin-auth";
import {
  appendBlogPostToSheet,
  deleteBlogPostFromSheet,
  fetchBlogPostsFromSheet,
  isSheetConfigured,
  SheetNotConfiguredError,
} from "@/lib/server/google-sheets";
import { blogPosts as staticBlogPosts, type BlogPost } from "@/lib/site-data";

/**
 * GET  /api/blogs — returns admin-created posts from the Google Sheet.
 * POST /api/blogs — appends a new post to the Google Sheet (admin-only).
 * DELETE /api/blogs?slug=... — deletes one admin-created post (admin-only).
 */

const CATEGORIES: BlogPost["category"][] = ["Campaign", "Story", "Press Release", "Publication"];
const IMAGE_PLACEHOLDER = "__placeholder__";

interface NewPostRequestBody {
  title?: string;
  excerpt?: string;
  content?: string;
  category?: string;
  date?: string;
  image?: string;
}

function jsonResponse(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "post"
  );
}

async function requireAdmin(request: Request): Promise<boolean> {
  const token = readSessionCookie(request);
  return verifyAdminSessionToken(token);
}

async function handleGet(): Promise<Response> {
  const posts = await fetchBlogPostsFromSheet();
  return jsonResponse({ success: true, posts }, 200);
}

async function handlePost(request: Request): Promise<Response> {
  if (!(await requireAdmin(request))) {
    return jsonResponse({ success: false, error: "Unauthorized." }, 401);
  }

  if (!isSheetConfigured()) {
    return jsonResponse(
      {
        success: false,
        error:
          "Google Sheet isn't connected yet. Set BLOG_SHEET_WEBHOOK_URL in the environment (see the setup guide) before publishing.",
      },
      501,
    );
  }

  let body: NewPostRequestBody;
  try {
    body = (await request.json()) as NewPostRequestBody;
  } catch {
    return jsonResponse({ success: false, error: "Request body must be valid JSON." }, 400);
  }

  const errors: Record<string, string> = {};
  if (!body.title?.trim()) errors.title = "Title is required.";
  if (!body.excerpt?.trim()) errors.excerpt = "Excerpt is required.";
  if (!body.content?.trim()) errors.content = "Content is required.";
  if (!body.category || !CATEGORIES.includes(body.category as BlogPost["category"])) {
    errors.category = "A valid category is required.";
  }
  if (!body.date?.trim()) errors.date = "Date is required.";
  if (Object.keys(errors).length > 0) {
    return jsonResponse({ success: false, error: "Validation failed.", fieldErrors: errors }, 400);
  }

  // Dedupe the slug against both the static posts and whatever's already
  // in the sheet, so two posts never collide on the same URL.
  const existing = await fetchBlogPostsFromSheet();
  const existingSlugs = new Set([...staticBlogPosts, ...existing].map((p) => p.slug));
  const base = slugify(body.title!);
  let slug = base;
  let suffix = 2;
  while (existingSlugs.has(slug)) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }

  const post: BlogPost = {
    slug,
    title: body.title!.trim(),
    excerpt: body.excerpt!.trim(),
    content: body.content!.trim(),
    category: body.category as BlogPost["category"],
    date: body.date!.trim(),
    image: body.image?.trim() || IMAGE_PLACEHOLDER,
  };

  try {
    await appendBlogPostToSheet(post);
  } catch (error) {
    const message =
      error instanceof SheetNotConfiguredError
        ? error.message
        : `Failed to save to the Google Sheet: ${error instanceof Error ? error.message : String(error)}`;
    console.error(message);
    return jsonResponse({ success: false, error: message }, 502);
  }

  return jsonResponse({ success: true, post }, 200);
}

async function handleDelete(request: Request): Promise<Response> {
  if (!(await requireAdmin(request))) {
    return jsonResponse({ success: false, error: "Unauthorized." }, 401);
  }

  if (!isSheetConfigured()) {
    return jsonResponse(
      {
        success: false,
        error:
          "Google Sheet isn't connected yet. Set BLOG_SHEET_WEBHOOK_URL in the environment before deleting posts.",
      },
      501,
    );
  }

  const slug = new URL(request.url).searchParams.get("slug")?.trim();
  if (!slug) {
    return jsonResponse({ success: false, error: "A post slug is required." }, 400);
  }

  try {
    await deleteBlogPostFromSheet(slug);
  } catch (error) {
    const message =
      error instanceof SheetNotConfiguredError
        ? error.message
        : `Failed to delete from the Google Sheet: ${error instanceof Error ? error.message : String(error)}`;
    console.error(message);
    return jsonResponse({ success: false, error: message }, 502);
  }

  return jsonResponse({ success: true }, 200);
}

export const Route = createFileRoute("/api/blogs")({
  server: {
    handlers: {
      GET: async () => handleGet(),
      POST: async ({ request }) => handlePost(request),
      DELETE: async ({ request }) => handleDelete(request),
    },
  },
});
