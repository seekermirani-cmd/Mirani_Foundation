import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, ShieldCheck } from "lucide-react";
import { contactInfo } from "@/lib/site-data";
import { useAdminAuth } from "@/lib/admin-auth";

function FooterAdminLink() {
  const { ready, authenticated } = useAdminAuth();
  if (!ready) return null;

  return (
    <Link
      to={authenticated ? "/admin/blogs/new" : "/admin/login"}
      className="inline-flex items-center gap-1.5 text-[11px] text-brand-ink-foreground/35 transition-colors hover:text-brand-ink-foreground/70"
      title={authenticated ? "Add a new blog post" : "Admin login"}
      aria-label={authenticated ? "Add a new blog post" : "Admin login"}
    >
      <ShieldCheck className="h-3.5 w-3.5" />
      <span>{authenticated ? "Add Blog" : "Admin"}</span>
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-brand-ink text-brand-ink-foreground/85">
      <div className="container-mirani py-16 grid gap-12 md:grid-cols-3">
        <div>
          <h3 className="text-2xl font-bold">
            <span className="text-brand">Mirani</span> Foundation
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-brand-ink-foreground/70 max-w-sm">
            A grassroots NGO working across health, education and social justice — walking alongside
            the communities we serve, not in front of them.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-ink-foreground">
            Quick Links
          </h4>
          <ul className="mt-5 space-y-3 text-sm">
            {[
              { to: "/about", label: "About Us" },
              { to: "/blogs", label: "Blogs" },
              { to: "/gallery", label: "Gallery" },
              { to: "/reports", label: "Reports" },
              { to: "/donate", label: "Donate" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-brand transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-ink-foreground">
            Contact
          </h4>
          <ul className="mt-5 space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <Mail className="h-4 w-4 mt-0.5 text-brand shrink-0" />
              <a href={`mailto:${contactInfo.email}`} className="hover:text-brand">
                {contactInfo.email}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="h-4 w-4 mt-0.5 text-brand shrink-0" />
              <a href={`tel:${contactInfo.phone.replace(/\s/g, "")}`} className="hover:text-brand">
                {contactInfo.phone}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MapPin className="h-4 w-4 mt-0.5 text-brand shrink-0" />
              <a
                href={contactInfo.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-ink-foreground/70 hover:text-brand transition-colors"
              >
                {contactInfo.address}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-ink-foreground/10">
        <div className="container-mirani py-6 text-xs text-brand-ink-foreground/60 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3">
          <span>© {new Date().getFullYear()} Mirani Foundation. All rights reserved.</span>
          <FooterAdminLink />
        </div>
      </div>
    </footer>
  );
}
