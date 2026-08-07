import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { z } from "zod";
import { SiteLayout } from "@/components/SiteLayout";
import { blogPosts, type BlogPost } from "@/lib/site-data";

const CATEGORIES = ["All", "Campaign", "Story", "Press Release", "Publication"] as const;
type Category = (typeof CATEGORIES)[number];

const searchSchema = z.object({
  category: z.enum(CATEGORIES).optional().catch(undefined),
});

export const Route = createFileRoute("/blogs")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Blogs — Stories, Campaigns & Reports | Mirani Foundation" },
      {
        name: "description",
        content:
          "Latest campaigns, stories, press releases and publications from Mirani Foundation.",
      },
      { property: "og:title", content: "Blogs — Mirani Foundation" },
      { property: "og:url", content: "/blogs" },
    ],
    links: [{ rel: "canonical", href: "/blogs" }],
  }),
  component: BlogsPage,
});

function BlogsPage() {
  const { category } = Route.useSearch();
  const active: Category = category ?? "All";

  const list = useMemo(() => {
    const posts =
      active === "All"
        ? blogPosts
        : blogPosts.filter((p) => p.category === active);
    return [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [active]);

  return (
    <SiteLayout>
      <section className="bg-cream section-y">
        <div className="container-mirani max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-on-light dark:text-brand cb:text-secondary">
            Journal
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-ink">
            Stories & Updates
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Campaigns from the field, first-person stories from our community,
            press releases, and research publications — all in one place.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-mirani">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Link
                key={c}
                to="/blogs"
                search={c === "All" ? {} : { category: c }}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors min-h-[44px] inline-flex items-center ${
                  active === c
                    ? "bg-brand-ink text-brand-ink-foreground border-brand-ink"
                    : "bg-card text-ink border-border hover:border-ink"
                }`}
              >
                {c}
              </Link>
            ))}
          </div>

          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {list.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>

          {list.length === 0 && (
            <p className="mt-10 text-center text-muted-foreground">
              No posts in this category yet.
            </p>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      to="/blogs/$slug"
      params={{ slug: post.slug }}
      className="group rounded-2xl overflow-hidden bg-card border border-border hover:border-ink transition-colors flex flex-col"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center gap-3 text-xs">
          <span className="bg-brand/10 text-brand-on-light dark:text-brand cb:text-brand font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full">
            {post.category}
          </span>
          <time className="text-muted-foreground">
            {new Date(post.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </time>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-ink leading-snug group-hover:text-brand-on-light dark:group-hover:text-brand cb:group-hover:text-secondary transition-colors">
          {post.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground flex-1">{post.excerpt}</p>
      </div>
    </Link>
  );
}
