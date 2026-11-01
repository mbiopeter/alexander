# Google Analytics 4 event tracking and search indexing

This release keeps every original page, UI layout, project and playground feature. The analytics integration is **for the Mbiopeter portfolio (`mbiopeter.co.ke`)**. The separately hosted `traders.mbiopeter.co.ke` application must have its own GA4 configuration if you also want to record activity *inside that app*; clicks from this portfolio to mbioTraders are tracked here.

## 1. Connect your existing GA4 Measurement ID

In **Google Analytics → Admin → Data streams → your Web stream**, copy the public Measurement ID (`G-XXXXXXXXXX`). It is a public identifier, not an API secret.

**Local:** copy `.env.example` to `.env.local`, then set:

```dotenv
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_SITE_URL=https://mbiopeter.co.ke
# Optional, only if you want local tests to appear in Analytics:
NEXT_PUBLIC_GA_TRACK_LOCAL=true
```

**Vercel:** Project → Settings → Environment Variables → add `NEXT_PUBLIC_GA_ID` (your real ID), `NEXT_PUBLIC_SITE_URL=https://mbiopeter.co.ke`, and optionally `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`. Add to the Production deployment and **redeploy**: `NEXT_PUBLIC_*` values are compiled into the client build. Do not put a GA4 API secret or service-account JSON in public variables. The old `NEXT_PUBLIC_GA_MEASUREMENT_ID` is supported as an alternative; set only one.

The Google tag loads once in `src/app/layout.tsx` only when a valid Measurement ID is available. No ID means the site still works, with analytics safely disabled. `npm ci` also runs the existing Monaco asset-copy script, which restores local editor assets on each clean install. Local development does not send events unless `NEXT_PUBLIC_GA_TRACK_LOCAL=true`.

## 2. Event taxonomy

The reusable entry point is `trackEvent(eventName, params)` in `src/lib/analytics.ts`. The central listener is `src/components/analytics-tracker.tsx` and is mounted once in the root layout. This covers all routes (including client-side navigation). GA4's automatic `page_view` measures pageviews; turn on **Enhanced measurement → Page changes based on browser history events**. The separate `route_view` event is for the custom funnel and is not another `page_view`.

| Event name | Fires when | Useful event parameters |
| --- | --- | --- |
| `route_view` | A portfolio route opens | `page_path`, `page_title` |
| `ui_click` | A link, button, summary, or accessible tab is activated | `page_path`, `section_name`, `element_type`, `link_type`, `link_path` or `link_domain` |
| `ui_change` | A dropdown, checkbox, radio or slider changes | `section_name`, `control_type` (not selected contents) |
| `outbound_link` | An external website link is clicked | `link_domain`, `section_name` |
| `resource_download` | A local download link is clicked | `file_path`, `section_name` |
| `scroll_depth` | Visitor scrolls through 25, 50, 75, 90, or 100% | `percent_scrolled`, `page_path` |
| `section_view` | An identified page section enters view | `section_name`, `page_path` |
| `page_engagement` | Visitor changes page or background state after 5+ seconds | `engaged_seconds`, `page_path` |
| `form_start`, `form_submit_intent` | User interacts with an instrumented form | `form_name` |
| `contact_brief_invalid`, `contact_brief_ready`, `contact_brief_copy`, `contact_brief_clear` | Contact form steps | status, number of invalid fields; **never the form fields** |
| `contact_channel_open`, `destination_open`, `destination_unavailable` | WhatsApp, email or another destination chosen | `channel` or `destination` |
| `project_filter`, `project_filter_reset`, `project_search_used` | Project explorer activity | filter, results count, **search length band only** |
| `theme_changed` | Light, dark, device mode selected | `theme` |
| `playground_challenge_select`, `playground_run_start`, `playground_run_complete` | Coding exercise actions | safe challenge ID, language, result, counts; **never source code** |
| `quiz_start`, `quiz_complete` | Theory quiz activity | `question_count`, `percent_score` |
| `mbiotraders_launch`, `mbiotraders_explore`, `mbiotraders_guide_download`, `mbiotraders_tour`, `mbiotraders_tour_tab`, `mbiotraders_faq_open` | Trading-project landing page interactions | static item label, tab ID or question index |

**Add any new event** anywhere in a client component:

```tsx
import { trackEvent } from "@/lib/analytics";

trackEvent("pricing_cta_click", { page_section: "services", plan_name: "standard" });
```

Or give a server-rendered link/button **static**, authored attributes and the delegated tracker will do it without creating a client component:

```tsx
<a href="/hire/" data-analytics-event="hire_cta_click" data-analytics-label="hero_hire">Hire me</a>
```

GA4 event names are lowercase with underscores, maximum 40 characters. Avoid sending personal details, email addresses, phone numbers, messages, code, or URL query strings. Click tracking records static labels if explicitly annotated, otherwise only element type and page/section context. The search field reports query *length bands*, never search text. Scroll thresholds fire only once per page visit, not on every scrolling pixel. Links may also be measured by GA4 Enhanced Measurement; this website uses distinct custom event names (`outbound_link`, `resource_download`) to avoid duplicating standard `click` and `file_download` names.

## 3. View reports and define custom dimensions

In **GA4 → Reports → Realtime**, open the site on another browser and perform an action. Use **Admin → DebugView** (enable DebugView using Google's Tag Assistant or Debugger; you can also temporarily set `debug_mode` in events if you maintain the code). Events may take time to appear in standard reports.

For event parameters such as `section_name`, `element_type`, `percent_scrolled`, `tab_name`, `filter_category`, `page_path` and `link_domain` to appear in custom explorations, register them in **Admin → Custom definitions → Create custom dimension**, scope **Event**, with the exact parameter name. Event counts are visible without registering each parameter. Create a **key event** for goals such as `contact_channel_open`, `mbiotraders_launch`, or `mbiotraders_guide_download` if they represent meaningful outcomes.

On `/privacy/`, visitors can disable analytics for their device. The preference is applied *before the Google tag loads* on subsequent page loads. Google Analytics can be blocked by browser privacy tools and ad blockers, so event counts are not a complete census. The app never claims to know events from visitors who opt out or block tracking. In jurisdictions requiring *prior opt-in*, add a consent-management solution and Google Consent Mode before enabling the GA4 tag; an opt-out preference alone is not sufficient everywhere.

## 4. Search indexing / SEO

- Public pages have a canonical URL based on `NEXT_PUBLIC_SITE_URL` (default `https://mbiopeter.co.ke`), page-specific titles/descriptions and Open Graph/Twitter preview metadata.
- `/mbiotrade/` has updated Gold/forex/Bitcoin metadata, a 1200×630 image, FAQ and SoftwareApplication JSON-LD, and breadcrumb structured data.
- `src/app/sitemap.ts` generates `https://mbiopeter.co.ke/sitemap.xml`, including the public trading page, dynamic services, notes and project URLs, with duplicates removed.
- `src/app/robots.ts` exposes `https://mbiopeter.co.ke/robots.txt` with a sitemap pointer and blocks only `/api/` (not CSS/JS assets needed for rendering).
- Google Search Console verification meta tag can be configured via the public `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` variable (the **content** string from the verification meta tag, not the entire HTML tag).

**Submit once after deployment:** Google Search Console → Add/verify `https://mbiopeter.co.ke/` or Domain property → Sitemaps → `sitemap.xml` → URL Inspection for `/mbiotrade/` and the home page → Request indexing if needed. Check the **Pages indexing** report and fix any canonical, redirect or 404 errors. Search engines choose what to index; a sitemap and metadata **help discovery but cannot guarantee indexing**. Avoid indexing preview domains under separate canonical origins.

## 5. Check locally

```bash
npm ci
npm run check
npm test
npm run test:mbiotrade
npm run test:analytics
npm run build
npm run dev
```

Visit `http://localhost:3000/mbiotrade/` and `/privacy/`. `npm run test:analytics` tests event contracts and presence of SEO integrations. For actual GA network verification, set `NEXT_PUBLIC_GA_TRACK_LOCAL=true`, use your ID, allow analytics in privacy preferences, and check GA4 Realtime / Tag Assistant. A local test result does not prove that Google's servers received live events.
