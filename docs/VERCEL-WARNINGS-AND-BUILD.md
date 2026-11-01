# Vercel build warnings and release verification

The package keeps the same website design, routes, features, Google Analytics event tracking, and SEO implementation as the supplied `mbiopeter.zip`.

## Fixes bundled in this ZIP

- **Production canonical origin:** `.env.production` contains only the public origin `NEXT_PUBLIC_SITE_URL=https://mbiopeter.co.ke`. It is deliberately tracked (`.gitignore` allows this one file) and can be overridden by a Vercel environment variable or `.env.local`. Never put credentials or private contact details in `.env.production`.
- **Install-script approval:** `package.json` includes `allowScripts: { "esbuild@0.28.2": true }` for the exact esbuild release in `package-lock.json`. This explicitly approves the one package named in the npm warning without approving all install scripts or weakening npm checks.
- **Project layout:** All application files belong inside one top-level `mbiopeter/` folder in the distribution. On GitHub, put the *contents* of that folder at the repository root, or point Vercel's Root Directory to `mbiopeter` if committing the containing folder.

## Warnings that are not build failures

`npm warn Unknown env config "cache-dir"` is commonly caused by `npm_config_cache_dir` injected by the Vercel build environment. It is not configured in the project's `.npmrc` and cannot reliably be removed by changing the website source. The platform can continue to show the warning when npm starts. Do not disable npm security checks to silence it.

`14 packages are looking for funding` is informational, not an error.

The pasted build output stops after `▲ Next.js ... (webpack)`; it does not establish whether compilation succeeded. Check the *end* of the Vercel build log for a definitive result.

## GA4 and SEO after deployment

Your Measurement ID is not included here (it was not provided). Set `NEXT_PUBLIC_GA_ID=G-...` in **Vercel Project > Settings > Environment Variables** and redeploy. The existing analytics events, `/sitemap.xml`, canonical links and tracking controls are preserved. Confirm your live pages and event collection in Google Analytics DebugView/Realtime and verify your site in Google Search Console.

## Local checks

```bash
cd mbiopeter
npm ci
npm run check
npm test
npm run build:ready
```

`npm run build:ready` warns if WhatsApp, TikTok or Paystack are not configured and leaves their controls unavailable; invalid supplied destinations still fail. To verify all destinations before publishing, use `npm run check:config` or `npm run build:strict` with your real settings. The package does not invent or replace any of those values.

Start the site with `npm run dev` (development) or `npm start` after a production build. Node.js 22 or newer is required by the existing project configuration.
