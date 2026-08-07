import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { blogPosts, type BlogPost } from "@/lib/site-data";
import { ArrowLeft } from "lucide-react";

const CLOSING_NOTE: Record<BlogPost["category"], string> = {
  Campaign:
    "Every campaign like this one runs on people who show up. If you'd like to be part of the next one, join us on the donate page — or drop us a line.",
  Story:
    "Stories like this are why we do this work. If it moved you, consider supporting what comes next on our donate page — or say hello.",
  "Press Release":
    "For more on our ongoing partnerships and programs, visit the donate page to support our work — or get in touch.",
  Publication:
    "If this research resonates with you, you can support further work like it on our donate page — or reach out to learn more.",
};

export const Route = createFileRoute("/blogs/$slug")({
  loader: ({ params }) => {
    const post = blogPosts.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.post.title} — Mirani Foundation` },
          { name: "description", content: loaderData.post.excerpt },
          { property: "og:title", content: loaderData.post.title },
          { property: "og:description", content: loaderData.post.excerpt },
          { property: "og:type", content: "article" },
          { property: "og:url", content: `/blogs/${loaderData.post.slug}` },
        ]
      : [],
    links: loaderData
      ? [{ rel: "canonical", href: `/blogs/${loaderData.post.slug}` }]
      : [],
  }),
  component: BlogDetailPage,
  notFoundComponent: () => (
    <SiteLayout>
      <div className="container-mirani section-y text-center">
        <h1 className="text-3xl font-bold">Post not found</h1>
        <Link to="/blogs" className="mt-4 inline-block btn-ink btn-ink-hover">
          Back to blogs
        </Link>
      </div>
    </SiteLayout>
  ),
  errorComponent: ({ error, reset }) => (
    <SiteLayout>
      <div className="container-mirani section-y text-center">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground text-sm">{error.message}</p>
        <button onClick={reset} className="mt-4 btn-ink btn-ink-hover">
          Try again
        </button>
      </div>
    </SiteLayout>
  ),
});

function BlogDetailPage() {
  const { post } = Route.useLoaderData();
  const more = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);

  return (
    <SiteLayout>
      <article>
        <div className="relative h-[50vh] min-h-[360px] w-full">
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <div className="container-mirani absolute inset-x-0 bottom-0 pb-12 text-white">
            <span className="inline-block bg-brand text-brand-ink text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
              {post.category}
            </span>
            <h1 className="mt-4 text-3xl md:text-5xl font-bold max-w-4xl">{post.title}</h1>
            <time className="mt-3 block text-sm text-white/80">
              {new Date(post.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          </div>
        </div>

        <div className="container-mirani max-w-3xl section-y">
          <p className="text-lg text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>
          <div className="mt-8 prose prose-lg max-w-none text-ink leading-relaxed">
            {post.content.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>

          <div className="mt-10 rounded-2xl bg-cream border border-border p-6 text-sm text-muted-foreground">
            {CLOSING_NOTE[post.category]}
          </div>

          <div className="mt-12 flex gap-4">
            <Link to="/blogs" className="btn-outline-ink btn-outline-ink-hover">
              <ArrowLeft className="h-4 w-4" /> All posts
            </Link>
            <Link to="/donate" className="btn-brand btn-brand-hover">
              Support this work
            </Link>
          </div>
        </div>
      </article>

      <section className="section-y bg-cream">
        <div className="container-mirani">
          <h2 className="text-2xl md:text-3xl font-bold text-ink">More stories</h2>
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {more.map((p) => (
              <Link
                key={p.slug}
                to="/blogs/$slug"
                params={{ slug: p.slug }}
                className="group rounded-2xl overflow-hidden bg-card border border-border"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="p-5">
                  <span className="text-xs font-semibold uppercase tracking-wider text-brand-on-light dark:text-brand cb:text-secondary">
                    {p.category}
                  </span>
                  <h3 className="mt-2 font-semibold text-ink group-hover:text-brand-on-light dark:group-hover:text-brand cb:group-hover:text-secondary">{p.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
