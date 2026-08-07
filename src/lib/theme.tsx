import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark" | "cb";

const STORAGE_KEY = "mirani-theme";
const THEMES: Theme[] = ["light", "dark", "cb"];

function applyThemeClass(theme: Theme) {
  const root = document.documentElement;
  root.classList.remove("light", "dark", "cb");
  root.classList.add(theme);

  // Trigger a brief cross-fade across every themed surface.
  document.body.classList.add("theme-fade");
  window.clearTimeout((applyThemeClass as { _t?: number })._t);
  (applyThemeClass as { _t?: number })._t = window.setTimeout(() => {
    document.body.classList.remove("theme-fade");
  }, 500);
}

function getSystemTheme(): Theme {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored && THEMES.includes(stored)) return stored;
  return getSystemTheme();
}

/**
 * Inline script string — inject into <head> before hydration so the
 * correct theme class is present on <html> before first paint (no FOUC).
 */
export const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem('${STORAGE_KEY}');
    var theme = (stored === 'light' || stored === 'dark' || stored === 'cb')
      ? stored
      : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.add(theme);
  } catch (e) {}
})();
`;

type ThemeContextValue = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  cycleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme());
  const [hasStoredPreference, setHasStoredPreference] = useState(
    () => typeof window !== "undefined" && !!window.localStorage.getItem(STORAGE_KEY),
  );

  // Keep the DOM class in sync (covers the case where SSR/hydration
  // already applied a class via THEME_INIT_SCRIPT — this just confirms it).
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark", "cb");
    document.documentElement.classList.add(theme);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Follow system preference live, until the user makes an explicit choice.
  useEffect(() => {
    if (hasStoredPreference) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => {
      const next = e.matches ? "dark" : "light";
      setThemeState(next);
      applyThemeClass(next);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [hasStoredPreference]);

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t);
    setHasStoredPreference(true);
    window.localStorage.setItem(STORAGE_KEY, t);
    applyThemeClass(t);
  }, []);

  const cycleTheme = useCallback(() => {
    setThemeState((current) => {
      const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
      setHasStoredPreference(true);
      window.localStorage.setItem(STORAGE_KEY, next);
      applyThemeClass(next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ theme, setTheme, cycleTheme }), [theme, setTheme, cycleTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}
