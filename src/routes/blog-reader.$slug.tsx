import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { blogPosts, type BlogPost } from "@/lib/site-data";
import { BLOG_IMAGE_PLACEHOLDER, fetchAllBlogPosts } from "@/lib/blog-store";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { isRichTextHtml, sanitizeRichTextHtml } from "@/lib/rich-text";

export const Route = createFileRoute("/blog-reader/$slug")({
  loader: ({ params }) => {
    const post = blogPosts.find((p) => p.slug === params.slug) ?? null;
    return { post };
  },
  head: ({ loaderData }) => ({
    meta: loaderData?.post
      ? [
          { title: `${loaderData.post.title} - Mirani Foundation` },
          { name: "description", content: loaderData.post.excerpt },
          { property: "og:title", content: loaderData.post.title },
          { property: "og:description", content: loaderData.post.excerpt },
          { property: "og:type", content: "article" },
          { property: "og:url", content: `/blog-reader/${loaderData.post.slug}` },
        ]
      : [],
    links: loaderData?.post
      ? [{ rel: "canonical", href: `/blog-reader/${loaderData.post.slug}` }]
      : [],
  }),
  component: BlogReaderPage,
});

function PostImage({ post }: { post: BlogPost }) {
  if (post.image === BLOG_IMAGE_PLACEHOLDER) {
    return <ImagePlaceholder className="h-full w-full" />;
  }

  return <img src={post.image} alt={post.title} className="h-full w-full object-cover" />;
}

function BlogContent({ content }: { content: string }) {
  if (isRichTextHtml(content)) {
    return (
      <div
        className="rich-text-content max-w-none text-ink leading-relaxed"
        dangerouslySetInnerHTML={{ __html: sanitizeRichTextHtml(content) }}
      />
    );
  }

  return (
    <div className="rich-text-content max-w-none text-ink leading-relaxed">
      {content.split("\n\n").map((para, i) => (
        <p key={i}>{para}</p>
      ))}
    </div>
  );
}

function BlogReaderPage() {
  const params = Route.useParams();
  const { post: staticPost } = Route.useLoaderData();
  const [post, setPost] = useState<BlogPost | null>(staticPost);
  const [checkedStore, setCheckedStore] = useState(Boolean(staticPost));

  useEffect(() => {
    if (staticPost) return;

    let cancelled = false;
    fetchAllBlogPosts().then((posts) => {
      if (cancelled) return;
      setPost(posts.find((p) => p.slug === params.slug) ?? null);
      setCheckedStore(true);
    });

    return () => {
      cancelled = true;
    };
  }, [params.slug, staticPost]);

  if (!post) {
    return checkedStore ? (
      <SiteLayout>
        <main className="container-mirani section-y max-w-3xl text-center">
          <h1 className="text-3xl font-bold text-ink">Blog not found</h1>
          <a href="/blogs" className="mt-5 inline-flex btn-ink btn-ink-hover">
            Back to blogs
          </a>
        </main>
      </SiteLayout>
    ) : null;
  }

  return (
    <SiteLayout>
      <article>
        <header className="bg-cream section-y">
          <div className="container-mirani max-w-3xl">
            <a
              href="/blogs"
              className="text-sm font-semibold text-brand-on-light dark:text-brand cb:text-secondary"
            >
              Back to blogs
            </a>
            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-brand-on-light dark:text-brand cb:text-secondary">
              {post.category}
            </p>
            <h1 className="mt-3 text-4xl md:text-5xl font-bold text-ink leading-tight">
              {post.title}
            </h1>
            <time className="mt-4 block text-sm text-muted-foreground">
              {new Date(post.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          </div>
        </header>

        <div className="container-mirani max-w-3xl section-y">
          <div className="aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-card">
            <PostImage post={post} />
          </div>
          <p className="mt-8 text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>
          <div className="mt-8">
            <BlogContent content={post.content} />
          </div>
        </div>
      </article>
    </SiteLayout>
  );
}
