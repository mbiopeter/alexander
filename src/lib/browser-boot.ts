export type SiteBrowserBootstrapOptions = {
  analyticsId: string | null;
  analyticsOptOutKey: string;
  structuredProfile: Record<string, unknown> | null;
};

type GoogleTagWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

const GOOGLE_TAG_ID = "mbiopeter-google-tag";
const STRUCTURED_DATA_ID = "mbiopeter-structured-data";

export function initializeSiteBrowser(options: SiteBrowserBootstrapOptions): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  if (options.structuredProfile && !document.getElementById(STRUCTURED_DATA_ID)) {
    const dataScript = document.createElement("script");
    dataScript.id = STRUCTURED_DATA_ID;
    dataScript.type = "application/ld+json";
    dataScript.textContent = JSON.stringify(options.structuredProfile).replace(/</g, "\\u003c");
    document.head.appendChild(dataScript);
  }

  const id = options.analyticsId;
  if (!id || !/^G-[A-Z0-9]{6,30}$/i.test(id)) return;

  let optedOut = false;
  try {
    optedOut = window.localStorage.getItem(options.analyticsOptOutKey) === "true";
  } catch {
    optedOut = false;
  }
  Reflect.set(window, `ga-disable-${id}`, optedOut);

  const siteWindow = window as GoogleTagWindow;
  if (!Array.isArray(siteWindow.dataLayer)) siteWindow.dataLayer = [];
  if (typeof siteWindow.gtag !== "function") {
    siteWindow.gtag = (...args: unknown[]) => {
      siteWindow.dataLayer?.push(args);
    };
  }

  if (document.getElementById(GOOGLE_TAG_ID)) return;

  siteWindow.gtag("js", new Date());
  siteWindow.gtag("config", id, { send_page_view: false });

  const tag = document.createElement("script");
  tag.id = GOOGLE_TAG_ID;
  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(tag);
}
