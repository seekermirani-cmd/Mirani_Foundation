import { Sun, Moon, Eye } from "lucide-react";
import { useTheme, type Theme } from "@/lib/theme";

const ICONS: Record<Theme, typeof Sun> = {
  light: Sun,
  dark: Moon,
  cb: Eye,
};

const LABELS: Record<Theme, string> = {
  light: "Light mode",
  dark: "Dark mode",
  cb: "Colorblind-safe mode",
};

const NEXT_LABEL: Record<Theme, string> = {
  light: "Switch to dark mode",
  dark: "Switch to colorblind-safe mode",
  cb: "Switch to light mode",
};

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, cycleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={NEXT_LABEL[theme]}
      title={LABELS[theme]}
      className={`relative inline-flex items-center justify-center w-11 h-11 rounded-full text-ink hover:bg-black/5 dark:hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${className}`}
    >
      {(Object.keys(ICONS) as Theme[]).map((t) => {
        const Icon = ICONS[t];
        const active = t === theme;
        return (
          <Icon
            key={t}
            aria-hidden
            className="absolute h-5 w-5 transition-all duration-500"
            style={{
              opacity: active ? 1 : 0,
              transform: active
                ? "rotate(0deg) scale(1)"
                : "rotate(-90deg) scale(0.4)",
            }}
          />
        );
      })}
    </button>
  );
}
