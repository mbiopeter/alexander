# mbioTraders portfolio landing — Mbiopeter dark-theme refresh

The portfolio at **https://mbiopeter.co.ke** introduces the separate **signal-only** web application **https://traders.mbiopeter.co.ke**.

## What's included

- Redesigned `/mbiotrade/` project page with a two-column hero and optimized, user-supplied dashboard screenshot. The screenshot is **illustrative**: its gauges, prices, trades and statistics must not be presented as current market information.
- Accessible, interactive four-tab product tour highlighting the chart, market-strength gauge, timeframe alignment, and signal setup. The screenshots are still visual examples; no live market calls are made from the portfolio.
- Updated six-instrument overview, six selectable timeframes, the 3/5/7-day higher-timeframe concept, sound alerts, market-data limitations, and signal-only FAQs.
- Updated homepage and Projects-page featured mbioTraders showcase; reused across `/public-projects/`.
- Every launch link comes from `src/data/public-projects.ts` and opens **https://traders.mbiopeter.co.ke/** with `target="_blank"` and `rel="noopener noreferrer"`.
- All existing services, contact flows, WhatsApp, Paystack, tutorials, coding playground, interactive demos, Public Projects dropdown, and themes remain in the project.

## Design and theme

`src/app/globals.css` now gives the **dark theme** navy surfaces, emerald-green accent controls and teal borders based on the mbioTraders dashboard. **Light mode** retains its previous neutral/lime design. Shared feature graphics and legacy portfolio illustration accents receive scoped dark-theme refinements.

`src/styles/mbiotrade.css` is self-contained for the product showcase, homepage/project featured blocks and the portfolio's image preview. Original image assets remain in `public/`; added optimized assets are in `public/images/`.

## SEO

The product route has page-specific title, description, Open Graph screenshot card and canonical metadata. The root production canonical is **https://mbiopeter.co.ke**, overridden by `NEXT_PUBLIC_SITE_URL`. Do not set the app's subdomain as the portfolio's canonical URL.

## Develop and deploy

```bash
npm ci
npm run test:mbiotrade
npm run check
npm run build
npm run dev
```

In Vercel, deploy the **portfolio repository** (not the mbioTraders app), and set `NEXT_PUBLIC_SITE_URL=https://mbiopeter.co.ke` in Production. Existing contact/payment environment configuration remains unchanged. Do not upload personal `.env.local` or private API credentials. Test light and dark modes, desktop hover and mobile accordion, page interactions, and launch URL after deployment.
