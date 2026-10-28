# MbioTrade landing page — Mbiopeter portfolio v2.3

This standalone portfolio showcases the real MbioTrade application without embedding its trading code or requesting broker credentials. All **Launch** links go to `https://mbiotrade.vercel.app/` and open in a separate tab.

## What's new in v2.3

- **Public Projects** replaces the standalone MbioTrade top navigation tab. Desktop hover/click dropdown and mobile expandable accordion show MbioTrade; both are driven by `src/data/public-projects.ts`. A new `/public-projects/` directory supports future app launches.
- `/mbiotrade/` has been expanded with a four-screen feature tour, more detailed product capabilities, deeper trend-strategy explanations, broker-sync diagram, background-worker section, FAQs, and multiple pathways to the live app.
- All design changes use existing light/dark color variables and scoped styles in `src/styles/mbiotrade.css` and `src/styles/public-projects.css`.
- Homepage MbioTrade feature, `/projects/` demos, services, tutorials, Monaco editor, social links, contact, theme controls and integrations are retained.

## What's illustrated (not live)

The chart and product-tour visuals show *examples*, not live Deriv candles, signals, balances, orders, or worker status. This landing page makes no API calls for trading. The supported account modes, contract handling and worker conditions described on the page are features of the **separate** MbioTrade application, not features this portfolio can execute.

## Add another app

See [`docs/PUBLIC-PROJECTS.md`](PUBLIC-PROJECTS.md). Add a single entry to `src/data/public-projects.ts` plus a dedicated `src/app/<slug>/page.tsx`. The menu, directory and sitemap derive from the registry.

## Run

```bash
npm ci
npm run test:mbiotrade
npm run check
npm run build
npm run dev
```

Then test `/public-projects/`, `/mbiotrade/`, mobile navigation, feature-tour buttons and FAQs. No new environment variables are needed for the portfolio showcase. See `docs/DEPLOYMENT.md` for original environment/configuration requirements and Vercel instructions.
