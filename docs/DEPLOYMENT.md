# Deploy Alexender with the coding playground

This version uses the Next.js server runtime. Existing portfolio routes are still prerendered where possible; the code runner and private WhatsApp redirect are dynamic API routes. `output: "export"` and static `out/` hosting have been removed.

## 1. Prepare

Use Node.js 22 or newer:

```bash
npm ci
npm run setup
```

The supplied `.env.local` is retained from your upload, with the WhatsApp number migrated to a private setting. `setup` will not overwrite it. For another environment, use `.env.example` as a template. Never place that private configuration in `public/` or commit it to a public repository.

Configure your real values:

- `WHATSAPP_USERNAME` for an active username, or `WHATSAPP_NUMBER` for the fallback.
- `NEXT_PUBLIC_PAYSTACK_PAYMENT_URL`, `NEXT_PUBLIC_TIKTOK_URL` and optional `NEXT_PUBLIC_GITHUB_URL`.
- `NEXT_PUBLIC_SITE_URL` for your final HTTPS origin.
- `JUDGE0_BASE_URL` and exactly one supported authentication variable for code execution.

Read [PLAYGROUND.md](PLAYGROUND.md) for provider-specific authentication and optional language IDs. The uploaded runner URL is a placeholder; it cannot execute code. No paid execution account is provisioned by this project.

Contact availability is derived during the build and exposed only as a boolean. Supply WhatsApp settings during both build and runtime. Public URLs and metadata also require a rebuild after changes. Runner secrets stay server-side and must be available at runtime.

## 2. Verify and build

```bash
npm run check
npm test
npm run build:ready
npm start
```

`build:ready` validates the original contact/support/social requirements, then builds. It does not call the remote execution service. The playground reports whether runner configuration is present; this is not a provider-health or credit-balance check.

`npm run build` remains available to preview with unconfigured optional features. `npm start` and `npm run preview` serve the `.next` production build, normally on port 3000. For example:

```bash
npm run preview -- --hostname 127.0.0.1 --port 3001
```

## 3. Hosting

### Vercel

Import the project using the **Next.js** framework preset. The included `vercel.json` uses `npm ci` and `npm run build:ready`, with the default Next.js output directory. Remove any old dashboard override that publishes `out` or selects the “Other” framework.

Set the environment variables for the intended Preview/Production environments, including the server-only runner credentials and WhatsApp settings. Redeploy after configuration changes. The runner route declares a 60-second maximum duration; your platform plan must allow the request to remain active for its execution deadline.

### Netlify

Use Netlify’s **Next.js runtime** with repository-based builds. The included `netlify.toml` specifies `npm run build:ready`, publish directory `.next`, and Node 22. Remove old static-export overrides. A drag-and-drop upload of static HTML will not provide the API routes.

Supply private values to the function runtime as well as the build. Check the platform’s actual synchronous-function duration for your plan: the code runner can wait up to 45 seconds, and host limits must support that. If your plan terminates requests earlier, use a suitable Node host or adapt the runner to queued jobs and polling.

### Node hosting

Build and run the project with its production dependencies, `.next` output and `public` assets available:

```bash
npm ci
npm run build:ready
npm start
```

Set `PORT` as needed and place the Node service behind your host’s HTTPS proxy. Do not run learner programs directly in the web server; the implementation sends them to the configured execution service. For a reverse proxy that changes the request origin, set `PLAYGROUND_ORIGIN` to your public HTTPS origin.

### Static-only hosting

This package is not a static export. Cloudflare Pages static HTML export, GitHub Pages or an `out/` upload cannot supply the execution and contact routes. Use a supported Next.js server deployment or provide equivalent separately hosted APIs before choosing static hosting. No untested Workers adapter is included.

## 4. Check your actual account integrations

After deployment:

1. Visit `/playground/`, use the navigation link and `Ctrl + .`, and try a deliberately missing URL.
2. Confirm a correct and an incorrect solution against your configured execution service. Check compiler errors and time limits too.
3. Check all five language versions are enabled on your provider.
4. Check the WhatsApp destination belongs to you and the form draft arrives. If using a username, verify it is active, test any username-key prompt, and try the message-copy fallback.
5. Check your Paystack recipient and payment-page configuration. No payment is necessary to inspect the destination.
6. Refresh service and project detail pages directly; check the Hire service preselection.
7. Switch Light, Dark and Device themes on desktop and mobile. Check the editor follows the site preference.
8. Confirm drafts and collected answers survive reload in the same browser.

For public traffic, the built-in runner limiter is per Node process, not a global account quota. Configure provider spending/usage controls and use a shared limiter or job queue when scaling across processes. See PLAYGROUND.md for exact limits. Username-based contact links do not imply that existing WhatsApp contacts lose access to a number they already saved.

## Troubleshooting

| Symptom                                           | Check                                                                                                                                                        |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Run is disabled                                   | Set a real service URL and one valid authentication method; placeholder domains are treated as unconfigured.                                                 |
| Runner says configured but fails                  | Check provider availability, credits, authentication, batch support and active language versions. No incorrect-answer mark is assigned for service failures. |
| Runner API returns 404                            | Deploy with the Next.js runtime. The route must remain at `src/app/api/playground/run/route.ts`.                                                             |
| API reports an origin error                       | Check the public host/proxy mapping and optional `PLAYGROUND_ORIGIN`.                                                                                        |
| Monaco falls back to plain text                   | Run `npm run setup:editor`; ensure `/monaco/vs/loader.js` and worker assets are served from this origin.                                                     |
| Contact buttons are unavailable                   | Run `npm run check:config`, supply server settings at build/runtime and rebuild.                                                                             |
| Username mode fails                               | Use an active WhatsApp username, not a display name or reservation; check username-key requirements.                                                         |
| Phone still appears after opening a fallback link | This is inherent to number-based `wa.me` links. Configure an active username to stop using that destination.                                                 |
| Build fails on external links                     | The launch check requires WhatsApp, Paystack and TikTok. `npm run build` can preview an unconfigured site.                                                   |
| Old static instructions fail                      | Use `npm start` with the production `.next` build; do not upload an `out/` folder.                                                                           |

The site is configured for a domain root. A subfolder deployment requires coordinated base-path changes to the original portfolio links, contact route and editor assets; it is not configured by this package.
