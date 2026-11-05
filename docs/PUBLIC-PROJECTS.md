# Public Projects — Mbiopeter

The main `/projects/` page continues to list three interactive portfolio demos.
The separate `/public-projects/` directory is reserved for independently deployed applications.

## Current behavior

No standalone applications are currently listed. The directory provides an honest
empty state with a link back to the existing interactive project gallery.
Until at least one application is registered, the Public Projects desktop and
mobile navigation items are hidden, and the empty directory is excluded from the
sitemap and marked `noindex`.

## Add a future public application

Add a verified entry to `src/data/public-projects.ts` with these fields:

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

Create a matching `src/app/your-app/page.tsx` if it needs its own portfolio page.
The directory, desktop/mobile navigation and sitemap then update from the same registry.
Only publish verified URLs and accurate app descriptions. The directory displays a
generic preview until a custom one is deliberately implemented.

Use `npm run test:public-projects` to check registry, navigation, SEO and removal safeguards.
