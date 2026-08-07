import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { galleryImages, galleryCampaigns } from "@/lib/site-data";
import { X } from "lucide-react";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — Mirani Foundation" },
      { name: "description", content: "Photos from the field, campaign by campaign." },
      { property: "og:title", content: "Gallery — Mirani Foundation" },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const list = useMemo(() => {
    return active === "All"
      ? galleryImages
      : galleryImages.filter((g) => g.campaign === active);
  }, [active]);

  return (
    <SiteLayout>
      <section className="bg-cream section-y">
        <div className="container-mirani max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-on-light dark:text-brand cb:text-secondary">
            Gallery
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-ink">
            Moments from the field.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Every photo here is a real day, a real place, a real person we're
            lucky to work with.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-mirani">
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
            {galleryCampaigns.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-colors min-h-[44px] ${
                  active === c
                    ? "bg-brand-ink text-brand-ink-foreground border-brand-ink"
                    : "bg-card text-ink border-border hover:border-ink"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {list.map((g, i) => (
              <button
                key={i}
                onClick={() => setLightbox(i)}
                className="group relative aspect-square overflow-hidden rounded-xl bg-muted"
              >
                <img
                  src={g.src}
                  alt={g.caption}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-left translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                  <p className="text-white text-xs font-medium truncate">{g.caption}</p>
                  <p className="text-brand text-[10px] uppercase tracking-wider">{g.campaign}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <img
            src={list[lightbox].src}
            alt={list[lightbox].caption}
            className="max-h-[85vh] max-w-full object-contain rounded-lg"
          />
        </div>
      )}
    </SiteLayout>
  );
}
