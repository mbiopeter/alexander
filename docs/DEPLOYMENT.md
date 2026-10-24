# Deploy Alexender 2.1.0

This version uses the Next.js server runtime. Existing portfolio routes are still prerendered where possible; the code runner and private WhatsApp redirect are dynamic API routes. `output: "export"` and static `out/` hosting have been removed.

## 1. Prepare

Use Node.js 22 or newer:

```bash
npm ci
npm run setup
```

The supplied `.env.local` is retained without changes. `setup` will not overwrite it. For another environment, use `.env.example` as a template. Keep private configuration outside `public/` and out of public repositories.

Configure your real values:

- `WHATSAPP_USERNAME` for an active username, or `WHATSAPP_NUMBER` for the fallback.
- `NEXT_PUBLIC_PAYSTACK_PAYMENT_URL`, `NEXT_PUBLIC_TIKTOK_URL` and optional `NEXT_PUBLIC_GITHUB_URL`.
- Optional `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_LINKEDIN_URL` and `NEXT_PUBLIC_CV_URL`; leave any unused value blank.
- `NEXT_PUBLIC_SITE_URL` for your final HTTPS origin.
- `JUDGE0_BASE_URL` and exactly one supported authentication variable for code execution.

Read [PLAYGROUND.md](PLAYGROUND.md) for provider-specific authentication and optional language IDs. The supplied `JUDGE0_BASE_URL` and `JUDGE0_AUTH_TOKEN` are blank, so code execution needs your provider configuration. `NEXT_PUBLIC_SITE_URL` is also blank; set the final HTTPS origin to enable complete canonical, sitemap and sharing URLs. No paid execution account or email-delivery service is provisioned by this project.

Contact availability is derived during the build and exposed only as a boolean. Supply WhatsApp settings during both build and runtime. Public URLs and metadata also require a rebuild after changes. Runner secrets stay server-side and must be available at runtime.

Email, LinkedIn and CV links appear only for valid public settings. The email option opens the visitor's email app with a draft; the website does not send or confirm receipt of email. For a local CV URL such as `/files/cv.pdf`, put the real PDF at `public/files/cv.pdf` before building. The launch check verifies that local file exists. An HTTPS CV URL is format-validated, not downloaded or checked for ownership.

### Included downloads and sharing assets

The delivery includes all three demo source ZIPs, the project-brief text checklist, and PNG/SVG share cards. A normal build serves these files without regeneration. If their source content changes, refresh them before the next build:

```bash
npm run assets:sources
npm run assets:social
```

`assets:sources` uses Python 3 and its standard library only to regenerate ZIPs. It reads an explicit list of demo source files and never includes configuration or credentials. Python is not needed on the deployed server. `assets:social` uses the installed Node dependencies. Keep the generated files under `public/downloads/`, `public/resources/` and `public/social/` in the deployed bundle.

## 2. Verify and build

```bash
npm run check
npm test
npm run build:ready
npm start
```

`build:ready` validates the original contact/support/social requirements plus any supplied optional settings, then builds. It does not call the remote execution service. The playground reports whether runner configuration is present; this is not a provider-health or credit-balance check. Optional email, LinkedIn, CV and site-origin values may be left blank. Invalid supplied values are reported by the configuration check.

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

1. Visit `/playground/`, use the navigation link and `Ctrl + .`, and try a deliberately missing URL. Confirm the normal welcome and 404 detour remain distinct.
2. Confirm a correct and an incorrect solution against your configured execution service. Check compiler errors and time limits too.
3. Check all five language versions are enabled on your provider.
4. Check the WhatsApp destination belongs to you and the form draft arrives. If using a username, verify it is active, test any username-key prompt, and try the message-copy fallback.
5. Check your Paystack recipient and payment-page configuration. No payment is necessary to inspect the destination.
6. Refresh service, project and note detail pages directly. Check the source ZIPs and project-brief download, and the Hire service preselection.
7. Switch Light, Dark and Device themes on desktop and mobile. Check the editor follows the site preference.
8. Confirm practice drafts and collected answers survive reload in the same browser. Export a practice backup and inspect the import review, merge, and explicit replacement controls.
9. On a small screen, try the challenge selector and focus-mode exit. Open a valid `?language=python&challenge=sum-two` link and check the connection retry control without losing the draft.
10. Type an enquiry, refresh the same tab, and confirm its session draft restores. Check the clear confirmation and copy fallback. If email is configured, inspect the recipient and draft in your email app before choosing whether to send it.

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
| Optional email, LinkedIn or CV link is absent      | Set a valid public value and rebuild. Blank or invalid optional values are hidden. A local CV also needs its PDF under `public/`.                            |
| Email draft does not open                         | Configure a default email app or copy the brief. A mailto link does not provide server-side delivery or a receipt.                                           |
| Enquiry draft does not survive refresh            | Check whether this browser permits session storage. Copy the brief if saving is blocked; it is not stored on the server.                                   |
| Practice backup is rejected                       | Choose the full practice backup, not the answers-only export. Unsupported or malformed files leave the current work unchanged.                              |
| Social card or canonical URL is missing           | Set `NEXT_PUBLIC_SITE_URL` to the final HTTPS origin and rebuild. Confirm the included `/social/` assets are deployed.                                      |
| Username mode fails                               | Use an active WhatsApp username, not a display name or reservation; check username-key requirements.                                                         |
| Phone still appears after opening a fallback link | This is inherent to number-based `wa.me` links. Configure an active username to stop using that destination.                                                 |
| Build fails on external links                     | The launch check requires WhatsApp, Paystack and TikTok. `npm run build` can preview an unconfigured site.                                                   |
| Old static instructions fail                      | Use `npm start` with the production `.next` build; do not upload an `out/` folder.                                                                           |

The site is configured for a domain root. A subfolder deployment requires coordinated base-path changes to the original portfolio links, contact route and editor assets; it is not configured by this package.

For completed checks and their limits, see [VERIFICATION.md](VERIFICATION.md).
