import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { contactInfo } from "@/lib/site-data";
import { CheckCircle2, Landmark } from "lucide-react";

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title: "Donate — Mirani Foundation" },
      { name: "description", content: "Support our work in health, education and social justice via direct bank transfer." },
      { property: "og:title", content: "Donate to Mirani Foundation" },
      { property: "og:url", content: "/donate" },
    ],
    links: [{ rel: "canonical", href: "/donate" }],
  }),
  component: DonatePage,
});

function DonatePage() {
  return (
    <SiteLayout>
      <section className="bg-cream section-y">
        <div className="container-mirani grid lg:grid-cols-[1.1fr_1fr] gap-10 items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-on-light dark:text-brand cb:text-secondary">
              Donate
            </p>
            <h1 className="mt-3 text-4xl md:text-5xl font-bold text-ink leading-tight">
              Your gift becomes a medical camp, a classroom, a courtroom.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Every rupee is tracked and reported. Every donor receives a receipt. Every donation is 80G tax-exempt.
            </p>
            <ul className="mt-8 space-y-3 text-ink">
              {[
                "₹500 pays for one health checkup camp slot",
                "₹2,500 keeps a Learning Lamps scholar in school for a month",
                "₹5,000 funds a full women's legal literacy workshop",
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-on-light dark:text-brand cb:text-secondary mt-0.5 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl bg-card border border-border p-8 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand/15 text-brand-on-light dark:text-brand cb:text-brand flex items-center justify-center">
                <Landmark className="h-5 w-5" />
              </div>
              <h2 className="text-2xl font-bold text-ink">Bank transfer details</h2>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Transfer directly to our bank account using the details below.
            </p>
            <div className="mt-6 rounded-xl bg-cream border border-border p-5 text-sm space-y-2">
              <p className="text-muted-foreground uppercase text-xs font-semibold tracking-wider">
                Bank details
              </p>
              <p>
                <span className="text-muted-foreground">Account name:</span>{" "}
                <span className="text-ink font-medium">{contactInfo.bank.accountName}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Account number:</span>{" "}
                <span className="text-ink font-medium">{contactInfo.bank.accountNumber}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Account type:</span>{" "}
                <span className="text-ink font-medium">{contactInfo.bank.accountType}</span>
              </p>
              <p>
                <span className="text-muted-foreground">IFSC:</span>{" "}
                <span className="text-ink font-medium">{contactInfo.bank.ifsc}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Bank:</span>{" "}
                <span className="text-ink font-medium">{contactInfo.bank.bankName}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Branch address:</span>{" "}
                <span className="text-ink font-medium">{contactInfo.bank.branchAddress}</span>
              </p>
            </div>
            <p className="mt-5 flex items-center gap-1.5 text-xs text-muted-foreground justify-center">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" /> Online payment gateway will be available soon · 80G tax-exempt
            </p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
