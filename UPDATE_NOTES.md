# Mbiopeter 2.1.0 — update notes

This update builds on the existing portfolio design and features. The green/ink
palette, light/dark/device themes, six services, interactive demos, mini lessons,
coding challenges, WhatsApp contact and Paystack support remain in place.

## Portfolio and content

- Each project now has **Behind the build** notes covering the goal, approach,
  decisions, edge cases, current boundaries and a sensible next step.
- **Source ZIPs** contain the actual demo implementation files, relevant shared
  helpers/tests, a README and a checksum manifest. They are focused source
  extracts for inspection and adaptation, not standalone applications.
- The hero offers a quieter path to the project gallery. Cards link separately
  to demos and build notes, with more readable metadata and refined preview
  spacing. The homepage Playground button opens the correct route.
- Service pages include practical scenarios, relevant demo connections and
  deliberately selected related services. The Django API Lab remains clearly
  identified as a browser simulation.
- About connects the building and teaching approach to examples on the site.
  Optional GitHub, LinkedIn, CV and email links use validated configuration.
- **Notes & resources** adds three short articles on debugging, CSV handling and
  learning, alongside a downloadable project-brief checklist. Learn links to
  relevant practice and resources.
- Matching project, Playground and Notes share cards are included. Public
  sharing and canonical URLs need the final site origin configured at build time.

No client work, testimonials, experience history, results, response-time
promises or availability claims have been invented to fill these sections.

## Coding practice

- `/playground/` has a normal welcome. Genuinely missing pages retain the 404
  detour and recovery links.
- A compact mobile exercise selector brings the active challenge closer to the
  editor. Focus mode hides the surrounding shell and provides an explicit exit.
- Resetting a starter, loading a reference, or opening a saved answer offers
  **Undo replacement** until the next manual edit or exercise switch.
- Oversized edits are rejected with a notice while preserving the previous
  accepted draft. The local limit is 32,768 UTF-16 code units; execution keeps
  its separate 32,768-byte UTF-8 limit.
- **Full practice backup/restore** includes unfinished drafts, saved answers,
  current selection and reference-reveal history. Imports are checked locally
  before review. Merge keeps this browser's work on conflicts; replacement
  requires an explicit acknowledgement and action. Imported pass records are
  not rerun or independently verified.
- Valid exercise links use `?language=python&challenge=sum-two`. Unknown values
  are ignored. **Check connection** repeats the local configuration check; it
  does not verify provider credentials, health or credit balance.

## Enquiries and optional links

The enquiry form now saves its validated draft in this tab's `sessionStorage`,
restores it on refresh, and asks for confirmation before clearing it. Service
preselection keeps the rest of the brief. A visible notice and copy fallback
remain available if browser storage is blocked.

`NEXT_PUBLIC_CONTACT_EMAIL` enables an email draft option. The website opens
the chosen messaging/email app; the visitor decides when to send. There is no
server email service or delivery confirmation. `NEXT_PUBLIC_LINKEDIN_URL` and
`NEXT_PUBLIC_CV_URL` enable optional profile/document links. Missing or invalid
values are hidden, while the launch check reports invalid supplied settings.

## Setup and maintenance

The supplied `.env.local` is preserved. Its runner base URL, runner auth token,
and public site origin are blank. Set a real execution provider to enable code
runs and the final HTTPS origin for complete public metadata. No provider
account, credentials, contact email, LinkedIn profile or CV has been fabricated.

Node.js 22 or newer and a Next.js server deployment are still required. The
runner and WhatsApp redirect use API routes; this is not an `out/` static export.

The generated source downloads and share cards are included. Refresh them after
changing their underlying content with:

```bash
npm run assets:sources
npm run assets:social
```

Only source-ZIP regeneration needs Python 3; the deployed application does not.
See [README.md](README.md) for setup and routes,
[docs/PLAYGROUND.md](docs/PLAYGROUND.md) for practice/runner behaviour, and
[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for hosting configuration.

Current verification evidence and integration limits are recorded in
[docs/VERIFICATION.md](docs/VERIFICATION.md).

## Mbiopeter playground upgrade

- Renamed visible site branding from Alexender to **Mbiopeter**, including metadata, navigation/footer branding, icons and social/share artwork.
- Added a **Theory** playground section with a bank of 100 multiple-choice questions. Every test randomly selects 10 questions with a 4 Easy / 3 Medium / 3 Hard mix and reports a final score plus explanations.
- Expanded **Practice** to 106 coding challenges while keeping the existing editor, hints, reference solutions, saved drafts, backups and five-language workflow. Every practice session randomly selects 10 challenges with the same mixed-difficulty balance.
- Practice now shows a session score and every code run reports passed test cases plus a percentage score.
- The code runner defaults to the public Judge0 CE community endpoint, so no API key is required. Optional custom Judge0 endpoints and authentication remain supported.
