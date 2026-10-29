# Public Projects — Mbiopeter

The original **Projects** page (`/projects/`) continues to list three interactive portfolio demos. The separate **Public Projects** menu lists real independently deployed applications, using `src/data/public-projects.ts` as the single source of truth.

## Navigation

- Desktop: hover over or click **Public Projects** to open its dropdown. Press Escape or click elsewhere to dismiss it.
- Mobile: open the main navigation and expand **Public Projects**.
- `/public-projects/` lists registered public apps, linked from the dropdown and footer.
- Currently listed: **mbioTraders**, showcased at `/mbiotrade/` and launched at **https://traders.mbiopeter.co.ke/**.

## Add another app

Add a second object to `publicProjects`:

```ts
{
  slug: "your-app",
  name: "Your App",
  category: "Your category",
  description: "What it does.",
  href: "/your-app/",
  liveUrl: "https://your-public-app.example/",
  status: "Live",
}
```

Create a matching `src/app/your-app/page.tsx` to showcase the product. The menu, public project directory and sitemap update automatically. Until a custom visual exists, the directory displays a generic placeholder for other projects.

## mbioTraders showcase

The redesigned site uses the uploaded dashboard reference as an *illustrative image*, not a fake live feed. It explains signal strength, the Gold/forex instruments, six timeframes, higher-timeframe momentum and audible setup alerts. The live mbioTraders application is signal-only and does not send broker orders.

Run `npm run test:mbiotrade` after updating the registry or showcase; verify the launch URL, all four interactive product-tour tabs, the Public Projects dropdown and accordion, and light/dark theme readability.
