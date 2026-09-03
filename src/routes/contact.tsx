import { ClientOnly, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { SiteLayout } from "@/components/SiteLayout";
import { contactInfo } from "@/lib/site-data";
import { Mail, Phone, MapPin, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Mirani Foundation" },
      {
        name: "description",
        content: "Get in touch, volunteer, or donate directly to Mirani Foundation.",
      },
      { property: "og:title", content: "Contact — Mirani Foundation" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <SiteLayout>
      <section className="bg-cream section-y">
        <div className="container-mirani max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-on-light dark:text-brand cb:text-secondary">
            Get in touch
          </p>
          <h1 className="mt-3 text-4xl md:text-5xl font-bold text-ink">
            We'd love to hear from you.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Donate, volunteer, or just say hello — every message reaches a real person on our team.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-mirani grid lg:grid-cols-2 gap-8">
          <DonationCard />
          <ContactVolunteerCard />
        </div>
      </section>

      <section className="section-y bg-cream">
        <div className="container-mirani grid lg:grid-cols-2 gap-10 items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-on-light dark:text-brand cb:text-secondary">
              Find us
            </p>
            <h2 className="mt-3 text-3xl font-bold text-ink">Reach out or drop in.</h2>
            <ul className="mt-6 space-y-4 text-ink">
              <li className="flex gap-3">
                <Phone className="h-5 w-5 text-brand-on-light dark:text-brand cb:text-secondary mt-0.5" />
                <a
                  href={`tel:${contactInfo.phone.replace(/\s/g, "")}`}
                  className="hover:text-brand-on-light dark:hover:text-brand cb:hover:text-secondary"
                >
                  {contactInfo.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="h-5 w-5 text-brand-on-light dark:text-brand cb:text-secondary mt-0.5" />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="hover:text-brand-on-light dark:hover:text-brand cb:hover:text-secondary"
                >
                  {contactInfo.email}
                </a>
              </li>
              <li className="flex gap-3">
                <MapPin className="h-5 w-5 text-brand-on-light dark:text-brand cb:text-secondary mt-0.5" />
                <a
                  href={contactInfo.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-on-light dark:hover:text-brand cb:hover:text-secondary"
                >
                  {contactInfo.address}
                </a>
              </li>
            </ul>
          </div>
          <div className="aspect-video rounded-2xl overflow-hidden border border-border bg-card">
            <iframe
              title="Mirani Foundation location"
              src={contactInfo.mapEmbed}
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

function DonationCard() {
  return (
    <div className="rounded-2xl bg-brand-ink text-brand-ink-foreground p-8">
      <h2 className="text-2xl font-bold">Donate directly</h2>
      <p className="mt-2 text-sm text-brand-ink-foreground/70">
        Transfer directly to our bank account using the details below.
      </p>
      <div className="mt-6 rounded-xl bg-brand-ink-foreground/5 border border-brand-ink-foreground/15 p-5 text-sm space-y-1">
        <p className="text-brand-ink-foreground/60 uppercase text-xs font-semibold tracking-wider">
          Bank details
        </p>
        <p>
          <span className="text-brand-ink-foreground/60">Account name:</span>{" "}
          {contactInfo.bank.accountName}
        </p>
        <p>
          <span className="text-brand-ink-foreground/60">Account number:</span>{" "}
          {contactInfo.bank.accountNumber}
        </p>
        <p>
          <span className="text-brand-ink-foreground/60">Account type:</span>{" "}
          {contactInfo.bank.accountType}
        </p>
        <p>
          <span className="text-brand-ink-foreground/60">IFSC:</span> {contactInfo.bank.ifsc}
        </p>
        <p>
          <span className="text-brand-ink-foreground/60">Bank:</span> {contactInfo.bank.bankName}
        </p>
        <p>
          <span className="text-brand-ink-foreground/60">Branch address:</span>{" "}
          {contactInfo.bank.branchAddress}
        </p>
      </div>

      <p className="mt-5 text-xs text-brand-ink-foreground/60 text-center">
        Online payment gateway will be available soon. · 80G tax-exempt receipt on request
      </p>
    </div>
  );
}

function ContactVolunteerCard() {
  const [mode, setMode] = useState<"volunteer" | "query">("volunteer");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [captchaToken, setCaptchaToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = (f.get("name") as string) || "";
    const email = (f.get("email") as string) || "";
    const phone = (f.get("phone") as string) || "";
    const location = (f.get("location") as string) || "";
    const message = (f.get("message") as string) || "";

    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email";
    if (!/^[6-9]\d{9}$/.test(phone)) errs.phone = "Enter a valid 10-digit Indian number";
    if (!location.trim()) errs.location = "Location is required";
    if (!message.trim()) errs.message = "Please leave a message";
    if (!captchaToken) errs.captcha = "Please verify that you are human.";
    setErrors(errs);
    setServerError("");
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          location,
          message,
          mode,
          // Backend expects `turnstileToken` — matches src/routes/api.contact.ts.
          turnstileToken: captchaToken,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
      } else {
        setServerError(data.error || "Something went wrong. Please try again.");
        setCaptchaToken("");
      }
    } catch {
      setServerError("Network error. Please check your connection and try again.");
      setCaptchaToken("");
    } finally {
      setSubmitting(false);
    }
  }

  const cls = (k: string) =>
    `w-full rounded-lg border bg-card px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 ${
      errors[k] ? "border-destructive" : "border-border focus:border-brand"
    }`;

  return (
    <div className="rounded-2xl bg-card border border-border p-8">
      <h2 className="text-2xl font-bold text-ink">Volunteer or send a query</h2>
      <p className="mt-2 text-sm text-muted-foreground">Choose what you'd like to do below.</p>

      <div className="mt-5 inline-flex rounded-full border border-border bg-cream p-1">
        {(["volunteer", "query"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              if (m === mode) return;
              setMode(m);
              setSubmitted(false);
              setErrors({});
              setServerError("");
              setCaptchaToken("");
            }}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              mode === m ? "bg-brand-ink text-brand-ink-foreground" : "text-ink"
            }`}
          >
            {m === "volunteer" ? "Sign up as volunteer" : "Send a query"}
          </button>
        ))}
      </div>

      {submitted ? (
        <p className="mt-6 rounded-lg bg-brand/10 text-ink p-4 text-sm">
          Thank you! Your {mode === "volunteer" ? "application" : "message"} has been received.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4" noValidate>
          <div>
            <input name="name" placeholder="Full name" className={cls("name")} />
            {errors.name && (
              <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {errors.name}
              </p>
            )}
          </div>
          <div>
            <input name="email" type="email" placeholder="Email" className={cls("email")} />
            {errors.email && (
              <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <input
              name="phone"
              type="tel"
              placeholder="Phone (10 digits)"
              className={cls("phone")}
            />
            {errors.phone && (
              <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {errors.phone}
              </p>
            )}
          </div>
          <div>
            <input
              name="location"
              placeholder="Location (city, state)"
              className={cls("location")}
            />
            {errors.location && (
              <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {errors.location}
              </p>
            )}
            <p className="mt-1 text-[11px] text-muted-foreground">
              We use Google Places to help you pick a real location.
            </p>
          </div>
          <div>
            <textarea
              name="message"
              rows={4}
              placeholder={
                mode === "volunteer" ? "Tell us about your area of interest" : "Your message"
              }
              className={cls("message")}
            />
            {errors.message && (
              <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {errors.message}
              </p>
            )}
          </div>
          <div>
            <ClientOnly
              fallback={
                <div
                  className="h-[65px] w-[300px] max-w-full rounded-md border border-border bg-cream animate-pulse"
                  aria-hidden
                />
              }
            >
              <Turnstile
                siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY as string}
                onSuccess={(token) => {
                  setCaptchaToken(token);
                  setErrors((prev) => {
                    const { captcha, ...rest } = prev;
                    return rest;
                  });
                }}
                onExpire={() => setCaptchaToken("")}
                onError={() => setCaptchaToken("")}
              />
            </ClientOnly>
            {errors.captcha && (
              <p className="mt-1 flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {errors.captcha}
              </p>
            )}
          </div>
          {serverError && (
            <p className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {serverError}
            </p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="btn-ink btn-ink-hover w-full disabled:opacity-60"
          >
            {submitting
              ? "Submitting..."
              : mode === "volunteer"
                ? "Submit volunteer application"
                : "Send message"}
          </button>
        </form>
      )}
    </div>
  );
}
