import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import logo from "@/assets/mirani-logo.png";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MagneticButton } from "@/components/MagneticButton";
import { useAdminAuth } from "@/lib/admin-auth";
import { ShieldCheck } from "lucide-react";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/blogs", label: "Blogs" },
  { to: "/gallery", label: "Gallery" },
  { to: "/reports", label: "Reports" },
  { to: "/contact", label: "Contact" },
];

function AdminNavLink({ onNavigate }: { onNavigate?: () => void }) {
  const { ready, authenticated } = useAdminAuth();
  if (!ready) return null;

  return (
    <Link
      to={authenticated ? "/admin/blogs/new" : "/admin/login"}
      onClick={onNavigate}
      className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md text-muted-foreground hover:text-ink transition-colors"
      title={authenticated ? "Add a new blog post" : "Admin login"}
    >
      <ShieldCheck className="h-4 w-4" />
      {authenticated ? "Add Blog" : "Admin"}
    </Link>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { location } = useRouterState();
  const pathname = location.pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname.startsWith(to));

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 glass-header ${
        scrolled ? "border-border/60 shadow-sm glass-header-scrolled" : "border-transparent"
      }`}
    >
      <div
        className={`container-mirani flex items-center justify-between gap-4 transition-all duration-300 ${
          scrolled ? "h-16" : "h-20"
        }`}
      >
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src={logo} alt="Mirani Foundation" className="h-9 w-auto" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive(item.to)
                  ? "text-brand-on-light dark:text-brand cb:text-brand"
                  : "text-ink hover:text-brand-on-light dark:hover:text-brand cb:hover:text-brand"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <AdminNavLink />
          <ThemeToggle />
          <MagneticButton>
            <Link to="/donate" className="btn-ink btn-ink-hover">
              Donate
            </Link>
          </MagneticButton>
          <MagneticButton>
            <a
              href="https://miranifoundation.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-brand btn-brand-hover"
            >
              Mirani USA
            </a>
          </MagneticButton>
        </div>

        <div className="flex lg:hidden items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle menu"
            className="relative inline-flex items-center justify-center w-11 h-11 rounded-md text-ink hover:bg-black/5 dark:hover:bg-white/10"
            onClick={() => setOpen((v) => !v)}
          >
            <span
              aria-hidden
              className="absolute block h-0.5 w-5 bg-current transition-all duration-300"
              style={{
                transform: open ? "rotate(45deg) translateY(0)" : "translateY(-5px)",
              }}
            />
            <span
              aria-hidden
              className="absolute block h-0.5 w-5 bg-current transition-all duration-200"
              style={{ opacity: open ? 0 : 1 }}
            />
            <span
              aria-hidden
              className="absolute block h-0.5 w-5 bg-current transition-all duration-300"
              style={{
                transform: open ? "rotate(-45deg) translateY(0)" : "translateY(5px)",
              }}
            />
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-border glass-header-scrolled">
          <div className="container-mirani py-4 flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`py-3 text-base font-medium ${
                  isActive(item.to)
                    ? "text-brand-on-light dark:text-brand cb:text-brand"
                    : "text-ink"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-3">
              <AdminNavLink onNavigate={() => setOpen(false)} />
              <Link to="/donate" onClick={() => setOpen(false)} className="btn-ink btn-ink-hover">
                Donate
              </Link>
              <a
                href="https://miranifoundation.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brand btn-brand-hover"
              >
                Mirani USA
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
