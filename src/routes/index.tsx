import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { TextReveal } from "@/components/TextReveal";
import { CursorSpotlight } from "@/components/CursorSpotlight";
import { MagneticButton } from "@/components/MagneticButton";
import { useParallax } from "@/hooks/use-parallax";
import { heroSlides, impactStats, campaigns, pillars, galleryImages } from "@/lib/site-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mirani Foundation — Health, Education, Social Justice" },
      {
        name: "description",
        content: "Grassroots NGO championing health, education, and social justice across India.",
      },
      { property: "og:title", content: "Mirani Foundation" },
      {
        property: "og:description",
        content: "Grassroots NGO championing health, education, and social justice across India.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <SiteLayout>
      <Hero />
      <Impact />
      <CampaignsPreview />
      <AboutPreview />
      <GalleryPreview />
    </SiteLayout>
  );
}

function Hero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const { ref: parallaxRef, offset } = useParallax<HTMLDivElement>(70);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % heroSlides.length), 5000);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <section
      ref={parallaxRef}
      className="relative isolate overflow-hidden bg-brand-ink"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <CursorSpotlight />
      <div className="relative h-[78vh] min-h-[520px] max-h-[760px] w-full">
        {heroSlides.map((slide, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === i ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={idx !== i}
          >
            <img
              key={`img-${idx}-${i === idx}`}
              src={slide.image}
              alt=""
              className={`h-full w-full object-cover ${idx === i ? "ken-burns" : ""}`}
              loading={idx === 0 ? "eager" : "lazy"}
              decoding={idx === 0 ? "sync" : "async"}
              fetchPriority={idx === 0 ? "high" : "low"}
              style={{ transform: `translateY(${offset * 0.4}px) scale(1.08)` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/20" />
          </div>
        ))}

        <div
          className="container-mirani relative z-10 flex h-full flex-col justify-center"
          style={{ transform: `translateY(${offset * -0.5}px)` }}
        >
          <div className="max-w-2xl text-white">
            <span className="inline-block text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              {heroSlides[i].eyebrow}
            </span>
            <h1
              key={`t-${i}`}
              className="mt-4 text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05]"
            >
              <TextReveal text={heroSlides[i].title} stagger={40} />
            </h1>
            <p key={`s-${i}`} className="mt-6 text-lg text-white/85 max-w-xl fade-up">
              {heroSlides[i].subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <MagneticButton>
                <Link to={heroSlides[i].cta.href} className="btn-brand btn-brand-hover">
                  {heroSlides[i].cta.label} <ArrowRight className="h-4 w-4" />
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link
                  to="/donate"
                  className="btn-outline-ink btn-outline-ink-hover !text-white !border-white/70 hover:!bg-white hover:!text-brand-ink"
                >
                  Donate now
                </Link>
              </MagneticButton>
            </div>
          </div>
        </div>

        <div className="absolute bottom-6 inset-x-0 z-10 flex items-center justify-center gap-4">
          <button
            aria-label="Previous slide"
            onClick={() => setI((v) => (v - 1 + heroSlides.length) % heroSlides.length)}
            className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => setI(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === i ? "w-10 bg-brand" : "w-2 bg-white/60"
                }`}
              />
            ))}
          </div>
          <button
            aria-label="Next slide"
            onClick={() => setI((v) => (v + 1) % heroSlides.length)}
            className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

function Impact() {
  return (
    <section className="relative bg-cream section-y overflow-hidden">
      <div className="blob w-72 h-72 -top-10 -left-10" aria-hidden />
      <div
        className="blob w-96 h-96 bottom-0 right-0"
        style={{ animationDelay: "-8s" }}
        aria-hidden
      />
      <div className="container-mirani relative">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-on-light dark:text-brand cb:text-secondary">
            Our impact
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-ink">
            <TextReveal text="11 years, many stories. One shared belief of being helpful." />
          </h2>
        </Reveal>
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
          {impactStats.map((s, idx) => (
            <Reveal
              key={s.label}
              delay={idx * 100}
              className="glass-card glass-card-border rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <CountUp
                value={s.value}
                suffix={s.suffix}
                className="text-4xl md:text-5xl font-bold text-ink tabular-nums"
              />
              <div className="mt-2 text-sm font-medium text-muted-foreground">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CampaignsPreview() {
  return (
    <section className="section-y bg-background">
      <div className="container-mirani">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-on-light dark:text-brand cb:text-secondary">
              Campaigns
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">
              <TextReveal text="Where your support is going right now." />
            </h2>
          </div>
          <Link
            to="/blogs"
            search={{ category: "Campaign" }}
            className="text-sm font-semibold text-ink hover:text-brand-on-light dark:hover:text-brand cb:hover:text-secondary inline-flex items-center gap-1"
          >
            View all campaigns <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {campaigns.map((c, idx) => (
            <Reveal
              key={c.slug}
              as="article"
              delay={idx * 120}
              className="group relative rounded-2xl overflow-hidden bg-brand-ink text-brand-ink-foreground flex flex-col transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              <CursorSpotlight />
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={c.image}
                  alt={c.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="absolute top-4 left-4 bg-brand text-brand-ink text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
                  {c.category}
                </span>
              </div>
              <div className="relative p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-semibold">{c.title}</h3>
                <p className="mt-3 text-sm text-brand-ink-foreground/70 flex-1">{c.excerpt}</p>
                <a
                  href={`/blog-reader/${c.slug}`}
                  className="mt-5 inline-flex items-center gap-1 text-brand font-semibold text-sm group/link"
                >
                  Read more
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutPreview() {
  return (
    <section className="relative section-y bg-cream overflow-hidden">
      <div className="blob w-80 h-80 top-1/3 -right-16" aria-hidden />
      <div className="container-mirani relative">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-on-light dark:text-brand cb:text-secondary">
            About us
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold text-ink">
            <TextReveal text="Three pillars. One mission." />
          </h2>
          <p className="mt-4 text-muted-foreground">
            At Mirani Foundation, we champion Health, Education, and Social Justice — working hand
            in hand with communities to create lasting change, one act of care at a time.
          </p>
        </Reveal>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {pillars.map((p, idx) => (
            <Reveal
              key={p.title}
              delay={idx * 120}
              className="glass-card glass-card-border rounded-2xl overflow-hidden group transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={p.image}
                  alt={p.title}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="relative p-6">
                <h3 className="text-xl font-semibold text-ink">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.short}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10">
          <MagneticButton>
            <Link to="/about" className="btn-ink btn-ink-hover">
              Learn more about us <ArrowRight className="h-4 w-4" />
            </Link>
          </MagneticButton>
        </Reveal>
      </div>
    </section>
  );
}

function GalleryPreview() {
  return (
    <section className="section-y bg-background">
      <div className="container-mirani">
        <Reveal className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-on-light dark:text-brand cb:text-secondary">
              Gallery
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">
              <TextReveal text="Moments from the field." />
            </h2>
          </div>
          <Link
            to="/gallery"
            className="text-sm font-semibold text-ink hover:text-brand-on-light dark:hover:text-brand cb:hover:text-secondary inline-flex items-center gap-1"
          >
            View all photos <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.slice(0, 6).map((g, i) => (
            <Reveal
              key={i}
              delay={i * 80}
              y={30}
              className="relative aspect-square overflow-hidden rounded-xl group"
            >
              <img
                src={g.src}
                alt={g.caption}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                <p className="text-white text-sm font-medium translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  {g.caption}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
