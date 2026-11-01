# Website build and playground checks — November 1, 2026

This release keeps the current portfolio design, contact flows, Google Analytics event collection, SEO pages, and mbioTraders showcase unchanged.

## Fixed source and test problems

1. `src/components/analytics-tracker.tsx`: the IntersectionObserver cleanup now checks for an available observer, resolving the TS18047 nullable observer type error.
2. `src/lib/challenges.ts`: the generated `count-multiples-2` fixture previously used input 16 and incorrectly expected seven multiples of two. The corrected generated between-case input is `divisor * 7 + 1`. All five reference implementations remain unchanged.
3. `tests/runner.test.ts`: the readiness test now expects `configured: true` for the existing default Judge0 CE endpoint, and separately verifies `configured: false` for an invalid custom endpoint. This is configuration readiness, **not** an actual provider health check.
4. `tests/challenges.test.ts`: add a regression that compares every generated multiples fixture to its mathematical count.

## External account configuration

`npm run build:ready` now accepts **missing** WhatsApp, Paystack and TikTok settings as visible build warnings, while invalid supplied settings still fail. The website's existing validation keeps unconfigured links disabled; it does not create imaginary destinations.

`npm run check:config` is still the **strict** pre-publish check for the actual configured URLs and WhatsApp destination. `npm run build:strict` performs that check and then builds.

To turn on all features supply your own settings via `.env.local` (local development) and Vercel Environment Variables (deployment):

```dotenv
WHATSAPP_NUMBER=YOUR_REAL_INTERNATIONAL_DIGITS
NEXT_PUBLIC_PAYSTACK_PAYMENT_URL=https://paystack.com/pay/YOUR_REAL_PAGE
NEXT_PUBLIC_TIKTOK_URL=https://www.tiktok.com/@YOUR_REAL_HANDLE
NEXT_PUBLIC_GA_ID=G-YOURMEASUREMENTID
```

These are **examples, not working destinations**. Do not publish the literal placeholders. An active `WHATSAPP_USERNAME` is an alternative to the phone number.

## Local verification commands

```bash
npm ci
npm run check
npm test
npm run build:ready
npm run dev
```

For the strict launch check, run `npm run check:config` after setting real values. Never store credentials in `.env.production`.

## Verification limits

The delivery environment could not restore the full npm dependency tree, so it could not run a Next.js production build or full project TypeScript check. Source parsing, 28 independent static/Analytics/SEO checks, 520 compiled/interpreted code-reference cases across five languages, and ZIP integrity were verified. Run the commands above on your computer for final confirmation.
