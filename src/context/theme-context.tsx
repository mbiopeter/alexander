"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  isTheme,
  resolveTheme,
  THEME_STORAGE_KEY,
  type ResolvedTheme,
  type Theme,
} from "../lib/theme";

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  mounted: boolean;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function applyTheme(theme: ResolvedTheme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");
  const [mounted, setMounted] = useState(false);
  const preference = useRef<Theme>("system");

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const readPreference = (): Theme => {
      try {
        const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
        return isTheme(saved) ? saved : "system";
      } catch {
        return "system";
      }
    };

    const sync = (nextTheme: Theme) => {
      preference.current = nextTheme;
      setThemeState(nextTheme);
      const resolved = resolveTheme(nextTheme, media.matches);
      setResolvedTheme(resolved);
      applyTheme(resolved);
    };

    sync(readPreference());
    setMounted(true);

    const onDeviceChange = () => {
      if (preference.current === "system") sync("system");
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === THEME_STORAGE_KEY || event.key === null) {
        sync(readPreference());
      }
    };

    media.addEventListener("change", onDeviceChange);
    window.addEventListener("storage", onStorage);
    return () => {
      media.removeEventListener("change", onDeviceChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const setTheme = useCallback((nextTheme: Theme) => {
    preference.current = nextTheme;
    setThemeState(nextTheme);
    const resolved = resolveTheme(
      nextTheme,
      window.matchMedia("(prefers-color-scheme: dark)").matches,
    );
    setResolvedTheme(resolved);
    applyTheme(resolved);
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    } catch {

    }
  }, []);

  const value = useMemo(
    () => ({ theme, resolvedTheme, mounted, setTheme }),
    [theme, resolvedTheme, mounted, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
