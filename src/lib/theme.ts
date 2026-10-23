export type Theme = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";
export const THEME_STORAGE_KEY = "alexender-theme";

export function isTheme(value: unknown): value is Theme {
  return value === "system" || value === "light" || value === "dark";
}

export function resolveTheme(
  theme: Theme,
  systemPrefersDark: boolean,
): ResolvedTheme {
  return theme === "system" ? (systemPrefersDark ? "dark" : "light") : theme;
}

/** Run in <head> before paint. Static text only; no user content is injected. */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t!=='light'&&t!=='dark'&&t!=='system')t='system';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;r.dataset.theme=d?'dark':'light';r.classList.toggle('dark',d);r.style.colorScheme=d?'dark':'light';}catch(e){var d=window.matchMedia('(prefers-color-scheme: dark)').matches;var r=document.documentElement;r.dataset.theme=d?'dark':'light';r.classList.toggle('dark',d);r.style.colorScheme=d?'dark':'light';}})();`;
