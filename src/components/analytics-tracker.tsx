"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  classifyLink,
  reachedScrollMilestones,
  safeAnalyticsLabel,
  trackEvent,
} from "@/lib/analytics";

function getContext(element: Element): string {
  const region = element.closest<HTMLElement>("[data-analytics-section], section[id], main[id], nav[aria-label], header");
  if (!region) return "page";
  if (region.dataset?.analyticsSection) return safeAnalyticsLabel(region.dataset.analyticsSection) || "section";
  if (region.id && /^[a-zA-Z][a-zA-Z0-9_-]{0,70}$/.test(region.id)) return region.id;
  if (region.tagName === "NAV") return "navigation";
  if (region.tagName === "HEADER") return "header";
  return "page";
}

/**
 * One delegated listener per event type for the whole site. No form input,
 * button text, raw query strings or typed playground code are ever collected.
 */
export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const pagePath = pathname || "/";
    const pageTitle = document.title.slice(0, 100);
    const basic = { page_path: pagePath };
    trackEvent("route_view", { ...basic, page_title: pageTitle });

    const sentDepths = new Set<number>();
    const startedForms = new Set<string>();
    let frame = 0;
    let lastScrolled = false;
    let viewingSince = performance.now();

    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const el = event.target.closest<HTMLElement>("a, button, summary, [role='button'], [role='tab']");
      if (!el || el.closest("[data-analytics-ignore]") || el.getAttribute("aria-disabled") === "true" || (el instanceof HTMLButtonElement && el.disabled)) return;
      const tag = el.tagName.toLowerCase();
      const group = getContext(el);
      const label = safeAnalyticsLabel(el.dataset.analyticsLabel);
      const type = el.getAttribute("role") === "tab" ? "tab" : tag;
      const extra: Record<string, string> = {};
      if (label) extra.element_label = label;
      if (el instanceof HTMLAnchorElement) {
        const link = classifyLink(el.href, window.location.origin);
        extra.link_type = link.kind;
        if (link.path) extra.link_path = link.path;
        if (link.domain) extra.link_domain = link.domain;
        if (link.kind === "outbound") trackEvent("outbound_link", { ...basic, section_name: group, link_domain: link.domain || "external" });
        if (link.kind === "download" || el.hasAttribute("download")) {
          trackEvent("resource_download", { ...basic, section_name: group, file_path: link.path || "download" });
        }
      }
      trackEvent("ui_click", { ...basic, section_name: group, element_type: type, ...extra });
      // Only static, hand-authored event names can be specified in markup.
      if (el.dataset.analyticsEvent && /^[a-z][a-z0-9_]{0,39}$/.test(el.dataset.analyticsEvent)) {
        trackEvent(el.dataset.analyticsEvent, { ...basic, section_name: group, ...(label ? { item_name: label } : {}) });
      }
    };

    const onFocusIn = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return;
      const form = event.target.closest<HTMLFormElement>("form[data-analytics-form]");
      if (!form) return;
      const name = safeAnalyticsLabel(form.dataset.analyticsForm);
      if (!name || startedForms.has(name)) return;
      startedForms.add(name);
      trackEvent("form_start", { ...basic, form_name: name });
    };

    const onChange = (event: Event) => {
      const element = event.target;
      if (!(element instanceof HTMLElement) || element.closest("[data-analytics-ignore]")) return;
      let kind: string | null = null;
      if (element instanceof HTMLSelectElement) kind = "select";
      else if (element instanceof HTMLInputElement && ["checkbox", "radio", "range"].includes(element.type)) kind = element.type;
      if (kind) trackEvent("ui_change", { ...basic, section_name: getContext(element), control_type: kind });
    };

    const onToggle = (event: Event) => {
      const el = event.target;
      if (!(el instanceof HTMLDetailsElement) || !el.open || !el.classList.contains("mbio-faq-item")) return;
      const items = Array.from(el.parentElement?.querySelectorAll(":scope > details.mbio-faq-item") || []);
      trackEvent("mbiotraders_faq_open", { ...basic, question_number: items.indexOf(el) + 1 });
    };

    const onSubmit = (event: Event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement)) return;
      const name = safeAnalyticsLabel(form.dataset.analyticsForm);
      if (name) trackEvent("form_submit_intent", { ...basic, form_name: name });
    };

    const measureScroll = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (!lastScrolled || max <= 0) return;
      const percent = Math.min(100, Math.max(0, Math.floor((window.scrollY / max) * 100)));
      for (const milestone of reachedScrollMilestones(percent, sentDepths)) {
        sentDepths.add(milestone);
        trackEvent("scroll_depth", { ...basic, percent_scrolled: milestone });
      }
    };
    const onScroll = () => {
      if (window.scrollY <= 0) return;
      lastScrolled = true;
      if (!frame) frame = requestAnimationFrame(measureScroll);
    };

    const sections = document.querySelectorAll<HTMLElement>("main section[id], main [data-analytics-section]");
    const viewed = new Set<string>();
    const observer = typeof IntersectionObserver !== "undefined"
      ? new IntersectionObserver((entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const node = entry.target as HTMLElement;
            const section = safeAnalyticsLabel(node.dataset.analyticsSection) || safeAnalyticsLabel(node.id);
            if (!section || viewed.has(section)) continue;
            viewed.add(section);
            trackEvent("section_view", { ...basic, section_name: section });
            observer.unobserve(node);
          }
        }, { threshold: 0.12 })
      : null;
    sections.forEach((element) => observer?.observe(element));

    const recordEngagement = () => {
      const elapsed = Math.round((performance.now() - viewingSince) / 1000);
      viewingSince = performance.now();
      if (elapsed >= 5) trackEvent("page_engagement", { ...basic, engaged_seconds: Math.min(elapsed, 3600) });
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") recordEngagement();
      else viewingSince = performance.now();
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("focusin", onFocusIn, true);
    document.addEventListener("submit", onSubmit, true);
    document.addEventListener("change", onChange, true);
    document.addEventListener("toggle", onToggle, true);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      recordEngagement();
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("focusin", onFocusIn, true);
      document.removeEventListener("submit", onSubmit, true);
      document.removeEventListener("change", onChange, true);
      document.removeEventListener("toggle", onToggle, true);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("scroll", onScroll);
      observer?.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, [pathname]);
  return null;
}
