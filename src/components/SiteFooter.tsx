import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";
import { contactInfo } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="bg-brand-ink text-brand-ink-foreground/85">
      <div className="container-mirani py-16 grid gap-12 md:grid-cols-3">
        <div>
          <h3 className="text-2xl font-bold">
            <span className="text-brand">Mirani</span> Foundation
          </h3>
          <p className="mt-4 text-sm leading-relaxed text-brand-ink-foreground/70 max-w-sm">
            A grassroots NGO working across health, education and social justice
            — walking alongside the communities we serve, not in front of them.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-ink-foreground">Quick Links</h4>
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
          <h4 className="text-sm font-semibold uppercase tracking-wider text-brand-ink-foreground">Contact</h4>
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
              <span className="text-brand-ink-foreground/70">{contactInfo.address}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-ink-foreground/10">
        <div className="container-mirani py-6 text-center text-xs text-brand-ink-foreground/60">
          © {new Date().getFullYear()} Mirani Foundation. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
