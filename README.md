# Alexender — developer, creator & coding playground

Your multipage portfolio with the 404 coding playground integrated into its existing design. Built with Next.js, React, TypeScript and Tailwind CSS. The original portfolio, six service pages, three interactive projects, mini lessons, hire form, Paystack support, social links and theme controls remain in place.

The playground is available at **`/playground/`** and on genuinely missing pages. The site now runs with a **Next.js server** because code execution and the private WhatsApp redirect use API routes. Static `out/` hosting is no longer the deployment mode.

## Quick start

Use **Node.js 22 or newer**. From the extracted `alexender-site` folder:

```bash
npm ci
npm run setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). `npm ci` also installs the locally hosted Monaco editor assets. `npm run setup` creates `.env.local` only if one does not exist.

This delivery preserves the `.env.local` settings supplied in your upload. The WhatsApp phone setting has been moved to the private `WHATSAPP_NUMBER` key. Your uploaded execution URL uses a documentation placeholder domain: replace it and the corresponding authentication value with a real Judge0 service before using Run. The editor, hints, solutions and local drafts work without a connected runner.

The ZIP contains source, original assets, a dependency lockfile, tests and documentation. Installed dependencies and build output are excluded. Keep `.env.local` private; it is already excluded by `.gitignore`.

## What was integrated

- **A full 404 playground:** the missing-page response keeps its HTTP 404 status and gives visitors useful practice alongside recovery links.
- **A regular playground route:** `/playground/` is linked in desktop/mobile navigation, the footer and the Learn page.
- **Keyboard access:** `Ctrl + .` opens the playground; `Cmd + .` also works. The shortcut leaves form fields and code editors alone and does not interrupt an already open playground.
- **Five languages:** Python, JavaScript, Java, C and C++.
- **Six challenges:** add two numbers, palindrome, vowel count, array maximum, FizzBuzz and factorial. Each language has starters and reference solutions; each challenge has four published test cases.
- **A VS Code-style editor:** self-hosted Monaco, syntax highlighting, separate drafts, plain-text fallback and `Ctrl/Cmd + Enter` to run.
- **Real grading:** the server sends code to a configured Judge0 execution service and compares actual results with server-owned expected outputs. Service errors are not graded as wrong answers.
- **Collected answers:** passing solutions are saved in the visitor’s browser with language, date and guided/independent labels. They can be reopened, copied, removed or exported as JSON. Viewing a solution alone does not mark an exercise complete.
- **One theme:** the original Light, Dark and Device preference controls the entire site, including the editor. The playground uses the existing green/ink palette, fonts, header and footer.
- **Motion controls:** the illustration can be paused and follows reduced-motion preferences.

See [docs/PLAYGROUND.md](docs/PLAYGROUND.md) for runner setup, test behavior and operational limits.

## Contact and public settings

Edit `.env.local` locally and configure equivalent values on your host. Restart development after changes; rebuild when changing the availability of contact links or public metadata.

| Setting                            | Purpose                                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------------------------- |
| `WHATSAPP_USERNAME`                | Your **active WhatsApp username**, when available. Takes priority over the number.          |
| `WHATSAPP_NUMBER`                  | Existing fallback contact, international digits only; no `+`, spaces or local trunk prefix. |
| `NEXT_PUBLIC_PAYSTACK_PAYMENT_URL` | Your own hosted Paystack payment page, such as `https://paystack.com/pay/your-page`.        |
| `NEXT_PUBLIC_TIKTOK_URL`           | Your exact public TikTok profile URL.                                                       |
| `NEXT_PUBLIC_GITHUB_URL`           | Optional GitHub profile URL.                                                                |
| `NEXT_PUBLIC_SITE_URL`             | Recommended final HTTPS site origin for canonical links, sharing metadata and sitemap.      |

`npm run check:config` requires a valid WhatsApp destination, Paystack page and TikTok profile. It validates optional URLs when supplied. It does not verify ownership or send messages or payments.

### WhatsApp usernames and privacy

The contact flow uses `/api/contact/whatsapp/`, which resolves the destination on the server. Browser configuration contains only an availability flag, not the phone number. Set:

```dotenv
WHATSAPP_USERNAME=your_active_whatsapp_username
```

Use the username actually activated in WhatsApp; a display name, unrelated social handle or reserved name is not sufficient. An optional leading `@` is accepted. Username availability is rolling out, and contacts may need your username key if you have enabled one.

Until a username is configured, `WHATSAPP_NUMBER` preserves the existing contact flow. A number-based redirect still reveals the number when someone opens the chat; server-side storage alone does not make that link anonymous. In username mode, the link uses the username. People who already have your number saved can still see it in WhatsApp.

All existing WhatsApp buttons and service-specific enquiries use the same contact helper. The Hire form retains validation and its message draft, with an added preview and Copy message fallback if a WhatsApp version does not carry the prefilled text through a username link. Visitors still choose when to send the message.

Legacy `NEXT_PUBLIC_WHATSAPP_NUMBER` and `NEXT_PUBLIC_WHATSAPP_USERNAME` are supported for migration, but prefer the private keys and remove the old values. An invalid configured username fails closed instead of unexpectedly exposing the fallback number.

### Paystack support

The coffee actions still open your hosted Paystack payment page. Configure the recipient, currency and variable-amount option in Paystack, then copy the clean page URL into `NEXT_PUBLIC_PAYSTACK_PAYMENT_URL`. No Paystack secret key, payment SDK or transaction API is needed. The website does not collect card details or treat a click as proof of payment.

## Pages and existing functionality

| Route                          | Content                                                                                            |
| ------------------------------ | -------------------------------------------------------------------------------------------------- |
| `/`                            | Original introduction, service highlights, project and creator sections.                           |
| `/services/`                   | Six development services.                                                                          |
| `/services/web-development/`   | Websites and web applications.                                                                     |
| `/services/python-django/`     | Python, Django and API development.                                                                |
| `/services/custom-software/`   | Workflow-specific tools and applications.                                                          |
| `/services/python-automation/` | Automation for data, files and reports.                                                            |
| `/services/debugging/`         | Diagnosis, fixes and code review.                                                                  |
| `/services/maintenance/`       | Maintenance and improvements.                                                                      |
| `/projects/`                   | Searchable and filterable project examples.                                                        |
| `/projects/focusboard/`        | Task creation, editing, completion, filtering and local persistence.                               |
| `/projects/django-api-lab/`    | Labelled browser simulation of API requests and responses.                                         |
| `/projects/data-tidy/`         | In-browser CSV parsing, cleanup and download.                                                      |
| `/learn/`                      | Existing React, debugging, Tailwind, Python and Django mini lessons, plus the new playground link. |
| `/playground/`                 | Full five-language coding practice.                                                                |
| `/about/`                      | Developer and creator introduction.                                                                |
| `/hire/`                       | Project enquiry form; service links still preselect `?service=<slug>`.                             |
| `/support/`                    | Optional support through the hosted Paystack page.                                                 |
| `/privacy/`                    | Updated explanation of local storage, code execution and contact links.                            |
| Any missing page               | The 404 playground with recovery navigation.                                                       |

The original project examples remain examples, not invented client work. Focusboard and playground drafts/answers are saved locally, without accounts or cloud sync. Data Tidy processes CSV in the browser. Django API Lab and the Learn page’s Python/Django examples remain clearly described simulations or illustrated examples; the separate coding playground performs real execution only when Run is connected.

## Commands

| Command                | Purpose                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------ |
| `npm ci`               | Install exact locked dependencies and copy local editor assets.                            |
| `npm run setup`        | Create the configuration file without overwriting existing settings.                       |
| `npm run dev`          | Start local development.                                                                   |
| `npm run check`        | Check TypeScript.                                                                          |
| `npm test`             | Run original portfolio, WhatsApp and playground tests.                                     |
| `npm run check:config` | Validate contact, support and social configuration.                                        |
| `npm run setup:editor` | Recopy local Monaco assets if necessary.                                                   |
| `npm run build`        | Build the production Next.js app.                                                          |
| `npm run build:ready`  | Validate contact configuration, then build.                                                |
| `npm start`            | Run the production build.                                                                  |
| `npm run preview`      | Alias-style wrapper for the production Next.js server, supporting preview host/port flags. |

The reference-solution checks use available Python, Node, Java, C and C++ toolchains. Missing optional language toolchains are reported as skipped test checks; those compilers are not needed on the deployed Next.js host because learner execution happens at the configured service.

## Build and deploy

```bash
npm run check
npm test
npm run build:ready
npm start
```

Use Vercel’s Next.js preset, Netlify’s Next.js runtime, or a Node host. The included deployment configurations are updated for runtime API routes. **Do not deploy this version by uploading an `out/` directory.** See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for configuration, execution-service limits and troubleshooting.

## Where to customize

- `src/components/site-shell.tsx`: shared navigation, footer and global shortcut.
- `src/app/learn/page.tsx`: existing lessons and the new practice link.
- `src/components/training-playground.tsx`: practice workflow and collected answers.
- `src/components/code-editor.tsx`: Monaco integration and fallback.
- `src/styles/playground.css`: scoped styles inheriting the original palette.
- `src/lib/challenges.ts`: questions, starters, reference solutions and test cases.
- `src/lib/runner.ts` and `src/app/api/playground/run/route.ts`: execution and grading.
- `src/lib/progress.ts`: validated browser persistence.
- `src/lib/whatsapp.ts` and `src/app/api/contact/whatsapp/route.ts`: private contact resolution.
- `src/data/services.ts`, `src/data/projects.ts`: original service/project content.
- `src/app/globals.css`, `src/context/theme-context.tsx`: original design and shared theme.

## References

- [Next.js deployment](https://nextjs.org/docs/app/getting-started/deploying)
- [Judge0 API](https://ce.judge0.com/)
- [Monaco Editor](https://github.com/microsoft/monaco-editor)
- [WhatsApp username contact links](https://faq.whatsapp.com/1561101675623754/)
- [WhatsApp username privacy](https://faq.whatsapp.com/658755553162769/)
- [WhatsApp click to chat](https://faq.whatsapp.com/5913398998672934)
- [Paystack Payment Pages](https://support.paystack.com/en/articles/2132546)
