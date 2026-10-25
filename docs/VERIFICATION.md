# Version 2.1.0 verification

Prepared on 24 October 2026 for the updated Mbiopeter source ZIP.

## Automated checks

- `npm run check` passed TypeScript checking.
- `npm test` passed **64 tests**, with zero failures and zero skipped tests.
- `npm run check:config` accepted the retained contact, tutorial and payment
  settings. The optional final site origin remains blank.
- The production Next.js webpack build passed compilation, TypeScript,
  prerendering and build tracing. It includes the new Notes routes and the
  existing dynamic execution/contact APIs.

The tests cover CSV/task-board utilities, theme and destination validation,
WhatsApp redirect behavior, enquiry draft validation/recovery, Unicode-safe
email encoding, playground persistence, strict backup import, merge/replace
behavior, exercise deep-link validation, draft-size boundaries, execution
provider integration and request/resource limits.

All **30 bundled reference programs** passed their **120 published cases**
across Python, JavaScript, Java, C and C++. All 30 starters compile or run and
remain incomplete exercises. These checks execute trusted bundled programs;
the website does not execute visitor source in a local web-server subprocess.
Provider-integration tests use controlled fixtures, not a live provider.

## Generated-page and download checks

- All **22 generated public HTML pages** have one main landmark and one
  first-level heading.
- Their internal page, resource and fragment links resolve against the
  generated routes and included public assets. API links are excluded from
  this static target check and covered by the route tests.
- All three downloadable project source ZIPs pass archive integrity checks.
  Their checksum manifests match, and their included implementation files are
  byte-for-byte identical to the corresponding files in the full project.
- The source extracts use an explicit allowlist and include no environment or
  contact configuration files.
- The five new 1200 × 630 sharing images and editable SVG sources are included.
  Complete public sharing/canonical URLs require the final site origin.

## Browser review and its limit

The managed browser preview rendered the updated homepage and the regular
Playground welcome with the retained palette, layout and illustrations. The
preview browser blocked development JavaScript assets with
`net::ERR_BLOCKED_BY_CLIENT`, leaving client controls unhydrated in that
environment. Full browser click-through testing, editor interaction checks and
a fresh cross-viewport regression pass therefore remain **unverified for this
release**. The successful production build, static checks and unit/integration
tests above do not substitute for those browser checks.

The build environment also initially suppressed captured compiler subprocess
output. Running the same build in the approved unrestricted process context
resolved that environment issue. TypeScript checking was kept enabled, and no
application configuration was weakened to bypass it.

Before publishing, exercise these flows in a normal local or hosted preview:

1. Check navigation, all three demos, lessons, themes and narrow-screen layouts.
2. Open normal and missing-page Playground views, switch language/challenge,
   enter a draft, refresh, and test focus mode and replacement undo.
3. Export practice, restore a valid backup using merge, and inspect the explicit
   replacement acknowledgement. Reject a malformed backup without losing work.
4. In both editors, attempt an oversized paste after a recognisable valid draft;
   confirm that the old draft remains visible with the limit notice.
5. Fill an enquiry, refresh and follow a new service link, then test the clear
   confirmation and preview/copy actions. Opening a messaging draft is not a
   sent enquiry.

## Preservation and privacy

- All **108 original public asset files** are byte-for-byte preserved.
- The supplied `.env.local` is byte-for-byte preserved.
- A scan of **64 generated HTML/JavaScript browser artifacts** found no
  occurrences of the configured private contact/runner values that were
  present in the supplied environment file.
- The retained service pages, demos, lessons, coding catalogue and theme
  features remain in the source. New case studies distinguish demonstrations
  and simulations from deployed client work.
- The delivery excludes installed dependencies, generated build output,
  compiler caches, temporary review files and screenshots. It includes the
  owner's supplied local configuration; keep that file private as described
  in the README.

## Configuration and external-service limits

The supplied optional Judge0 overrides and `NEXT_PUBLIC_SITE_URL` may be blank.
Real learner execution then uses the public Judge0 CE community endpoint without
an API key. Complete public metadata still needs
the actual HTTPS site origin and a rebuild. Optional email, LinkedIn and CV
links need real values before those controls appear.

No live execution provider was contacted during offline verification, no enquiry or email was sent, no
payment was made, and the website was not published. Account ownership,
messaging-app prefilling, provider quotas/health and hosting timeouts were not
verified. See [PLAYGROUND.md](PLAYGROUND.md) and
[DEPLOYMENT.md](DEPLOYMENT.md) for configuration and runtime limits.
