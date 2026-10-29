# Mbiopeter portfolio — mbioTraders refresh (v2.4.0)

## What changed

- Updated the existing `/mbiotrade/` portfolio route to showcase **mbioTraders** rather than the deprecated broker-trading tool.
- All launch links use **https://traders.mbiopeter.co.ke/**. Change the single registry entry `src/data/public-projects.ts` if the product domain changes in the future.
- The supplied screenshot is packaged as optimized WebP crops in `public/images/` and a social sharing graphic in `public/social/`.
- Rebuilt the project's hero, four-step interactive tour, markets section, features, how-it-works, FAQs, CTA, and the featured project cards on Home, Projects and Public Projects.
- Switched **dark mode** to navy/teal surfaces and emerald-green accents. Original light-mode colors remain as supplied.
- Updated page SEO, canonical domain, Open Graph sharing and project directory description.
- Kept the original site routes, tutorials, source project demos, Monaco playground, services, Paystack, WhatsApp/contact settings, menu, and theme selector.

## Important content note

The screenshots were provided as a visual reference and contain example prices, percentages and results. They are **not live market readings or independent evidence of profitable trading**. The portfolio displays a clear illustration label and never connects to a market API. The separately hosted mbioTraders application supplies its own data and alerts.

## Local installation

1. Extract ZIP. Enter the directory containing `package.json` (typically `alexander/`).
2. Preserve or reapply your existing site environment variables; see `.env.example` and `docs/DEPLOYMENT.md`.
3. Run:

```bash
npm ci
npm run test:mbiotrade
npm run check
npm run build
npm run dev
```

4. Inspect `/`, `/projects/`, `/public-projects/`, `/mbiotrade/`, plus the original Services, Learn, Playground and contact routes.
5. Test dark mode, light mode, mobile menu accordion, desktop Public Projects dropdown, keyboard feature-tour tabs and the live launch URL.

## Deploy to the existing portfolio domain

Push the **portfolio** source to the repository used for `mbiopeter.co.ke`; redeploy it with Vercel's Next.js preset. Set `NEXT_PUBLIC_SITE_URL=https://mbiopeter.co.ke` in Production for canonical/social URLs. Keep your preexisting WhatsApp, Paystack and other settings. **Do not deploy this ZIP to the separate `traders.mbiopeter.co.ke` application repository.**

The product landing uses no new runtime API keys, services or payment integrations.

## Validation performed in this environment

- 12 dependency-free targeted integration tests passed.
- TypeScript/TSX parsing completed without errors on the application's 69 source modules.
- Global, product and public-project CSS parsed with no syntax errors.
- A complete `npm ci`/Next.js build could not run because the npm registry was not reachable from this environment. The first installation will restore Monaco's generated font assets through the existing `postinstall` script.
