import { useEffect, useState } from "react";
import { blogPosts as staticBlogPosts, type BlogPost } from "@/lib/site-data";

/**
 * Client-side access to admin-created blog posts.
 *
 * These posts are persisted server-side in a Google Sheet (see
 * `src/lib/server/google-sheets.ts` and `src/routes/api.blogs.ts`) rather
 * than a traditional database — a "for now" datastore that's shared across
 * every visitor and admin, unlike the browser-local approach this used to
 * use. `/api/blogs` is the single source of truth for sheet-backed posts;
 * this module just fetches from and posts to it.
 *
 * TODO(persistence): if/when a real database is added, swap the fetch
 * calls below for that backend — the shape of everything here should stay
 * the same.
 */

/** Sentinel stored in `image` for posts created without a real photo yet. */
export const BLOG_IMAGE_PLACEHOLDER = "__placeholder__";

export type NewBlogPostInput = {
  title: string;
  excerpt: string;
  content: string;
  category: BlogPost["category"];
  date: string;
  image?: string;
};

/** Creates a new blog post via the API (which appends it to the Google Sheet). */
export async function addBlogPost(input: NewBlogPostInput): Promise<BlogPost> {
  const res = await fetch("/api/blogs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  let data: { success?: boolean; post?: BlogPost; error?: string } = {};
  try {
    data = await res.json();
  } catch {
    // fall through to the generic error below
  }

  if (!res.ok || !data.success || !data.post) {
    throw new Error(data.error ?? "Failed to publish the post. Please try again.");
  }

  return data.post;
}

/** Fetches admin-created posts from the sheet. */
export async function fetchAdminBlogPosts(): Promise<BlogPost[]> {
  const res = await fetch("/api/blogs");
  const data = (await res.json().catch(() => null)) as {
    success?: boolean;
    posts?: BlogPost[];
    error?: string;
  } | null;

  if (!res.ok || !data?.success || !Array.isArray(data.posts)) {
    throw new Error(data?.error ?? "Failed to load admin-created posts.");
  }

  return data.posts;
}

/** Public pages keep working with built-in posts even when the sheet is unavailable. */
async function fetchSheetPosts(): Promise<BlogPost[]> {
  try {
    return await fetchAdminBlogPosts();
  } catch {
    return [];
  }
}

/** Deletes an admin-created blog post from the shared Google Sheet. */
export async function deleteBlogPost(slug: string): Promise<void> {
  const res = await fetch(`/api/blogs?slug=${encodeURIComponent(slug)}`, {
    method: "DELETE",
  });

  let data: { success?: boolean; error?: string } = {};
  try {
    data = await res.json();
  } catch {
    // fall through to the generic error below
  }

  if (!res.ok || !data.success) {
    throw new Error(data.error ?? "Failed to delete the post. Please try again.");
  }
}

/** All blog posts — the built-in ones plus any sheet-backed ones, newest sheet posts first. */
export async function fetchAllBlogPosts(): Promise<BlogPost[]> {
  const sheetPosts = await fetchSheetPosts();
  return [...sheetPosts, ...staticBlogPosts];
}

/** React hook: loads the combined post list (static + sheet) once on mount. */
export function useBlogPosts(): BlogPost[] {
  const [posts, setPosts] = useState<BlogPost[]>(staticBlogPosts);

  useEffect(() => {
    let cancelled = false;
    fetchAllBlogPosts().then((all) => {
      if (!cancelled) setPosts(all);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return posts;
}
