# Mbiopeter — developer, creator & coding playground · 2.3.0

Your multipage portfolio, practical learning space, and coding playground. Built with Next.js, React, TypeScript and Tailwind CSS. Version 2.3.0 keeps the existing green/ink design, six service pages, three interactive projects, mini lessons, enquiry form, Paystack support, social links and theme controls, with clearer project evidence and more useful learning and contact flows.

The playground is available at **`/playground/`** and on genuinely missing pages. The site now runs with a **Next.js server** because code execution and the private WhatsApp redirect use API routes. Static `out/` hosting is no longer the deployment mode.

## Quick start

Use **Node.js 22 or newer**. From the extracted `alexander` folder:

```bash
npm ci
npm run setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). `npm ci` also installs the locally hosted Monaco editor assets. `npm run setup` creates `.env.local` only if one does not exist.

The playground uses the public Judge0 CE community endpoint by default, so **Run tests works without an API key**. You can still provide your own compatible Judge0 endpoint and optional server-side authentication later. Set `NEXT_PUBLIC_SITE_URL` when you know the final HTTPS origin so canonical and social-sharing URLs are complete.

The ZIP contains source, original assets, a dependency lockfile, tests and documentation. Installed dependencies and build output are excluded. Keep `.env.local` private; it is already excluded by `.gitignore`.

## What is new in 2.1.0

- **Project build notes:** Focusboard, Django API Lab and Data Tidy each explain the goal, implementation decisions, edge cases, limitations, and a practical next step. Their demos remain interactive.
- **Source downloads:** each project offers a ZIP with its actual component and relevant helpers/tests, a README, and a checksum manifest. These are focused source extracts, not standalone installed apps.
- **Clearer portfolio paths:** the hero links to the project gallery; project cards link to demos and build notes; service pages connect practical scenarios to relevant demos and deliberately chosen related services.
- **A more useful About page:** the page connects the building and teaching approach to work visitors can inspect. Optional profile, CV and email links appear only when valid settings are supplied.
- **Notes and resources:** `/notes/` contains three short notes on debugging, CSV handling and learning, plus a downloadable project-brief checklist. Learn connects explanations to relevant practice.
- **Contact drafts:** the enquiry form keeps a validated draft in this tab's session storage, offers a confirmed clear action, and can open an email draft when a public contact email is configured. Preview and copy remain available.
- **A clearer playground:** the normal route has its own welcome; genuine missing pages retain the 404 detour. Mobile challenge selection, focus mode, draft-replacement undo, deep links, connection retry and whole-practice backup/restore make practice easier to pick up again.
- **Sharing assets:** the three projects, Playground and Notes have matching PNG/SVG share cards. Public metadata uses them when the final site origin is configured.

See [UPDATE_NOTES.md](UPDATE_NOTES.md) for the change summary and [docs/VERIFICATION.md](docs/VERIFICATION.md) for verification evidence and remaining integration limits.

## Playground features

- **A full 404 playground:** the missing-page response keeps its HTTP 404 status and gives visitors useful practice alongside recovery links.
- **A regular playground route:** `/playground/` has a normal welcome and is linked from navigation, the footer and Learn. It does not display 404 artwork.
- **Keyboard access:** `Ctrl + .` opens the playground; `Cmd + .` also works. The shortcut leaves form fields and code editors alone and does not interrupt an already open playground.
- **Five languages:** Python, JavaScript, Java, C and C++.
- **Two learning sections:** Theory contains 100 multiple-choice questions; Practice contains 100+ coding challenges across Python, JavaScript, Java, C and C++. Each new section test randomly selects 10 questions with an easy/medium/hard mix.
- **A VS Code-style editor:** self-hosted Monaco, syntax highlighting, separate drafts, plain-text fallback and `Ctrl/Cmd + Enter` to run.
- **Real grading with scores:** the server sends code to the free Judge0 CE community service by default and compares actual results with server-owned expected outputs. Every run reports passed cases and a percentage score; service errors are not graded as wrong answers.
- **Collected answers:** passing solutions are saved in the visitor’s browser with language, date and guided/independent labels. They can be reopened, copied, removed or exported as JSON. Viewing a solution alone does not mark an exercise complete.
- **Whole-practice backups:** export drafts, saved solutions, selection and reference-reveal history. Import is validated locally before a review step. Merge keeps existing work on conflicts; replacing all local practice requires explicit confirmation. Imported pass records are not re-executed or independently verified.
- **Safer editing:** resetting to a starter, loading a reference, or opening a saved answer offers one-step undo until the next edit or exercise switch. Oversized edits are rejected with a notice, keeping the previous accepted draft.
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
| `NEXT_PUBLIC_LINKEDIN_URL`         | Optional public LinkedIn profile URL.                                                       |
| `NEXT_PUBLIC_CONTACT_EMAIL`        | Optional public email address; enables a mailto draft in the visitor's chosen email app.     |
| `NEXT_PUBLIC_CV_URL`               | Optional HTTPS document URL or local PDF path such as `/files/cv.pdf`.                       |
| `NEXT_PUBLIC_SITE_URL`             | Recommended final HTTPS site origin for canonical links, sharing metadata and sitemap.      |

`npm run check:config` requires a valid WhatsApp destination, Paystack page and TikTok profile. It validates optional settings when supplied and checks that a configured local CV PDF exists in `public/`. Optional email, LinkedIn and CV controls are hidden when missing or invalid; a supplied invalid setting is still reported by the launch check. The check does not verify account ownership, deliver messages, charge payments or test a remote provider.

### WhatsApp usernames and privacy

The contact flow uses `/api/contact/whatsapp/`, which resolves the destination on the server. Browser configuration contains only an availability flag, not the phone number. Set:

```dotenv
WHATSAPP_USERNAME=your_active_whatsapp_username
```

Use a username actually activated in your WhatsApp account; a display name, unrelated social handle or reserved name is not sufficient. An optional leading `@` is accepted. Verify the link with your own account, including any username-key prompt it uses.

Until a username is configured, `WHATSAPP_NUMBER` preserves the existing contact flow. A number-based redirect still reveals the number when someone opens the chat; server-side storage alone does not make that link anonymous. In username mode, the link uses the username. People who already have your number saved can still see it in WhatsApp.

All WhatsApp buttons and service-specific enquiries use the same contact helper. The Hire form validates the brief and provides a preview and copy fallback if a messaging app does not preserve its prefilled text. The visitor reviews and sends the draft in WhatsApp or their configured email app; opening a draft does not send an enquiry or confirm delivery.

### Enquiry draft storage and optional email

The form saves known, bounded fields in `sessionStorage` under `alexender-contact:brief:v1`. It restores them on refresh and return visits within the same tab/session. A new service-page link can preselect its service without clearing the rest of the brief. This is local browser storage, not a server submission or account history. Storage restrictions produce a visible notice and leave the copy option available.

**Clear draft** asks for confirmation before removing the fields and saved brief. Closing or clearing the browser session can remove it. Configure `NEXT_PUBLIC_CONTACT_EMAIL` with a real address you own to enable the email option; no address is invented or supplied by default.

Legacy `NEXT_PUBLIC_WHATSAPP_NUMBER` and `NEXT_PUBLIC_WHATSAPP_USERNAME` are supported for migration, but prefer the private keys and remove the old values. An invalid configured username fails closed instead of unexpectedly exposing the fallback number.

### Paystack support

The coffee actions still open your hosted Paystack payment page. Configure the recipient, currency and variable-amount option in Paystack, then copy the clean page URL into `NEXT_PUBLIC_PAYSTACK_PAYMENT_URL`. No Paystack secret key, payment SDK or transaction API is needed. The website does not collect card details or treat a click as proof of payment.

## Pages and existing functionality

| Route                          | Content                                                                                            |
| ------------------------------ | -------------------------------------------------------------------------------------------------- |
| `/`                            | Introduction, service highlights, project/build-note links and creator sections.                   |
| `/services/`                   | Six development services.                                                                          |
| `/services/web-development/`   | Websites and web applications.                                                                     |
| `/services/python-django/`     | Python, Django and API development.                                                                |
| `/services/custom-software/`   | Workflow-specific tools and applications.                                                          |
| `/services/python-automation/` | Automation for data, files and reports.                                                            |
| `/services/debugging/`         | Diagnosis, fixes and code review.                                                                  |
| `/services/maintenance/`       | Maintenance and improvements.                                                                      |
| `/public-projects/`            | Directory of independently deployed apps, starting with mbioTraders.                              |
| `/mbiotrade/`                  | Detailed mbioTraders landing page with interactive illustrative feature tour.                     |
| `/projects/`                   | Searchable and filterable project examples.                                                        |
| `/projects/focusboard/`        | Task board, local persistence, detailed build notes and downloadable source.                        |
| `/projects/django-api-lab/`    | Labelled API simulation, build decisions and downloadable source.                                  |
| `/projects/data-tidy/`         | Browser CSV cleanup, build notes and downloadable source.                                          |
| `/learn/`                      | Existing React, debugging, Tailwind, Python and Django mini lessons, plus the new playground link. |
| `/playground/`                 | Full five-language coding practice.                                                                |
| `/about/`                      | Developer and creator introduction.                                                                |
| `/notes/`                      | Practical notes and the project-brief checklist.                                                    |
| `/notes/a-useful-bug-report/`   | A small, reproducible debugging workflow.                                                           |
| `/notes/csv-beyond-a-comma/`    | CSV quoting, cleanup choices and previewing results.                                                |
| `/notes/one-concept-one-experiment/` | A learning routine linked to a Playground exercise.                                           |
| `/hire/`                       | Project enquiry form; service links still preselect `?service=<slug>`.                             |
| `/support/`                    | Optional support through the hosted Paystack page.                                                 |
| `/privacy/`                    | Updated explanation of local storage, code execution and contact links.                            |
| Any missing page               | The 404 playground with recovery navigation.                                                       |

The original project examples remain examples, not invented client work. Focusboard and playground drafts/answers are saved locally, without accounts or cloud sync. Data Tidy processes CSV in the browser. Django API Lab and the Learn page’s Python/Django examples remain clearly described simulations or illustrated examples; the separate coding playground performs real execution through the free default runner, or a custom compatible runner when configured.

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
| `npm run assets:sources` | Refresh the three source ZIPs from an explicit file allowlist; needs Python 3 only when regenerating. |
| `npm run assets:social` | Regenerate the included PNG/SVG share cards using the installed Node dependencies.           |
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
- `src/lib/contact-draft.ts`, `src/hooks/use-contact-draft.ts`: enquiry validation and session draft storage.
- `src/lib/whatsapp.ts` and `src/app/api/contact/whatsapp/route.ts`: private contact resolution.
- `src/data/services.ts`, `src/data/projects.ts`: original service/project content.
- `src/data/case-studies.ts`: project build notes and source-file descriptions.
- `src/data/notes.ts`: practical notes, references and next-step links.
- `public/resources/project-brief.txt`: downloadable project-brief checklist.
- `scripts/export-project-sources.py`, `scripts/generate-share-cards.mjs`: repeatable download and social-asset generation.
- `src/app/globals.css`, `src/context/theme-context.tsx`: original design and shared theme.

## References

- [Next.js deployment](https://nextjs.org/docs/app/getting-started/deploying)
- [Judge0 API](https://ce.judge0.com/)
- [Monaco Editor](https://github.com/microsoft/monaco-editor)
- [WhatsApp username contact links](https://faq.whatsapp.com/1561101675623754/)
- [WhatsApp username privacy](https://faq.whatsapp.com/658755553162769/)
- [WhatsApp click to chat](https://faq.whatsapp.com/5913398998672934)
- [Paystack Payment Pages](https://support.paystack.com/en/articles/2132546)

## Featured public project: mbioTraders

The portfolio now features **[mbioTraders](/mbiotrade/)**, a standalone market-signal dashboard launched at **https://traders.mbiopeter.co.ke/**. It is **signals only**: charts, a technical-strength gauge, multi-timeframe momentum and audible setup alerts. It does **not** place orders or connect to trading accounts.

The updated project page uses the supplied dashboard design as a clearly labelled illustrative preview, with an interactive four-section product tour. Home, Projects and Public Projects remain connected to one official live URL in `src/data/public-projects.ts`.

The site-wide **dark theme** now uses mbioTraders-inspired navy/emerald colors. The original light mode, services, interactive demos, coding playground, contact forms, WhatsApp/Paystack features, and navigation are retained.

Read `docs/MBIOTRADE-LANDING.md` and `docs/PUBLIC-PROJECTS.md` for instructions. The portfolio is hosted at **https://mbiopeter.co.ke**; this is not the same deployment as mbioTraders.

## Current update — mbioTraders showcase and dark theme

- Professional launch page, full screenshot preview, interactive product-tour crops and accurate signal-only copy.
- Dark-theme navbar, buttons, cards and code illustration use emerald accents on navy surfaces.
- Official launch URL updated to `https://traders.mbiopeter.co.ke/` everywhere it is configured.
- Original website pages and functionality remain in the complete source archive.
