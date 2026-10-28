# Public Projects — Alexander / Mbiopeter v2.3

The existing **Projects** page (`/projects/`) remains the gallery of interactive portfolio demos. **Public Projects** is now a separate top-level navigation dropdown for independently deployed applications.

## New navigation

- **Desktop:** hover over or click **Public Projects** to show a dropdown. Press Escape or click elsewhere to dismiss it. Keyboard focus can move through the links.
- **Phone / tablet:** open the mobile navigation, then tap **Public Projects** to expand the app list.
- **Directory page:** `/public-projects/` lists every public application. The header dropdown includes a **View all public projects** link.
- **Footer:** also links to the public-project directory.
- **Current application:** MbioTrade (`/mbiotrade/`) links to its separate deployment at `https://mbiotrade.vercel.app/`.

## Add another public app

Edit one registry only:

`src/data/public-projects.ts`

Add a second object to `publicProjects`:

```ts
{
  slug: "your-app",
  name: "Your App",
  category: "Product category",
  description: "What the app helps people do.",
  href: "/your-app/",
  liveUrl: "https://your-public-app.example/",
  status: "Live",
}
```

Create `src/app/your-app/page.tsx` for its own portfolio landing page. Then the desktop/mobile dropdown, `/public-projects/` directory, and sitemap will automatically include the new project. The directory renders a generic visual for non-MbioTrade items until a dedicated visual is added. Only add truthful live URLs and use accurate status labels.

## Enhanced MbioTrade showcase

The `/mbiotrade/` page now has:

- A richer hero with the illustrative chart and launch links.
- A four-screen interactive product tour: **Position chart, Trend-first signals, Risk controls, Cross-device sync**.
- Detailed feature cards and six market strategy explanations with starting chart timeframes.
- A Deriv-account sync diagram and optional worker explanation.
- A guided three-step workflow, expand/collapse FAQs, and responsible trading information.
- In-page section navigation and theme-responsive desktop/mobile styling.

Every demonstration is illustrative; this portfolio website does not handle Deriv API tokens, broker account data, or real orders. Automatic trading requires an independently running worker on the real trading platform. Avoid saying any strategy guarantees or proves profits.

## Start and verify

From the `alexander` directory:

```bash
npm ci
npm run test:mbiotrade
npm run check
npm run build
npm run dev
```

Check `/`, `/projects/`, `/public-projects/`, and `/mbiotrade/` on mobile and desktop. Hover/click Public Projects, press Escape, inspect the mobile accordion, switch feature-tour panels, expand FAQ answers, test light/dark themes, and verify the launch buttons open the separate live app.

If a fresh clone lacks generated Monaco editor assets, `npm ci` runs `scripts/copy-monaco.mjs` to reconstruct the required public Monaco resources. No new portfolio environment variables are needed for the landing page.

## Deploy to Vercel

Push this **portfolio** project to its GitHub repository and deploy it with the Next.js preset, root directory set to the `alexander` folder if the repo contains that folder, or `./` if the repository root is the extracted `alexander` folder. The product showcase has no background trading capability; the separately hosted MbioTrade app keeps its own credentials, worker and domain. Configure existing portfolio environment variables as described in `docs/DEPLOYMENT.md`.
