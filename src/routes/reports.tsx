import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { reports } from "@/lib/site-data";
import { Download, FileText, FileSpreadsheet, FileType2 } from "lucide-react";

const TYPES = ["All", "PDF", "Excel", "Word"] as const;

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Mirani Foundation" },
      { name: "description", content: "Download our annual reports, financial statements and research briefs." },
      { property: "og:title", content: "Reports — Mirani Foundation" },
      { property: "og:url", content: "/reports" },
    ],
    links: [{ rel: "canonical", href: "/reports" }],
  }),
  component: ReportsPage,
});

const iconFor = (t: string) =>
  t === "Excel" ? FileSpreadsheet : t === "Word" ? FileType2 : FileText;

function ReportsPage() {
  const [type, setType] = useState<(typeof TYPES)[number]>("All");

  const list = useMemo(() => {
    const filtered = type === "All" ? reports : reports.filter((r) => r.type === type);
    return [...filtered].sort((a, b) => b.year - a.year);
  }, [type]);

  return (
    <SiteLayout>
      <section className="bg-cream section-y">
        <div className="container-mirani max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-on-light dark:text-brand cb:text-secondary">
            Transparency
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-ink">Reports & Publications</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Every rupee, every program, every year — accounted for and downloadable.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-mirani">
          <div className="flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors min-h-[44px] ${
                  type === t
                    ? "bg-brand-ink text-brand-ink-foreground border-brand-ink"
                    : "bg-card text-ink border-border hover:border-ink"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-3">
            {list.map((r) => {
              const Icon = iconFor(r.type);
              return (
                <div
                  key={r.title}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card p-5 hover:border-ink transition-colors"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-lg bg-brand/10 text-brand-on-light dark:text-brand cb:text-brand flex items-center justify-center shrink-0">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-ink truncate">{r.title}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {r.year} · {r.type} · {r.size}
                      </p>
                    </div>
                  </div>
                  <a href={r.href} download className="btn-brand btn-brand-hover shrink-0">
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Download</span>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
