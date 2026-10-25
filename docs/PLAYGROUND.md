# Coding playground

The website has a dedicated playground at `/playground/` with its own normal
welcome. Genuine missing addresses use the same workbench with the 404 detour
heading, artwork and recovery navigation, and retain HTTP 404 status. Both views
share local drafts, saved solutions, and the site's Light, Dark, and Device
theme preference.

## Open and use it

- Choose **Playground** in the main navigation or **Coding playground** in the
  footer.
- Press **Ctrl + .** on Windows/Linux or **Command + .** on macOS while browsing
  the website. The shortcut leaves form fields, editable content, and Monaco's
  own keyboard commands alone. It also leaves an already open playground in place.
- Select a language and a question, edit the starter program, and choose
  **Run tests**. **Ctrl + Enter** / **Command + Enter** runs from the editor.
- Inspect each test's input, expected output, actual output, and any compiler or
  runtime diagnostic. Use hints or reveal the reference solution when needed.
- Passing all four tests adds that source code to **Your solution collection**.
- On smaller screens, choose the exercise from the compact challenge selector.
  The desktop sidebar remains available on wider screens.
- **Focus on coding** hides the surrounding site shell while you practise.
  **Exit focus mode** restores it; this does not change saved work.

The workbench uses Monaco, the editor component used by VS Code. It is a browser
code editor with syntax highlighting, line numbers, and language-specific files;
it does not include VS Code extensions, a terminal, a filesystem, or a debugger.
Monaco assets are served by this site from `/monaco/vs/`. If they cannot load,
the plain editor remains available. Visitors can also switch to the plain editor
manually. Animation can be paused, and reduced-motion preferences are respected.

### Link to a particular exercise

Use the known language and challenge IDs in the URL, for example:

```text
/playground/?language=python&challenge=sum-two
```

Valid parameters select that exercise after local progress has loaded; unknown
values are ignored. Changing the selection updates the regular Playground URL
without clearing other drafts. The true 404 view leaves the missing URL alone.

### Replace a draft without losing your place

Resetting to the starter, choosing **Use in editor** for a reference solution,
or opening a saved answer offers **Undo replacement** when it changes the
draft. Undo restores the previous draft until the next manual edit or exercise
switch. It is a single replacement recovery step, not an unlimited edit history.

Each local draft may contain up to 32,768 JavaScript string characters (UTF-16
code units). An edit above that limit is rejected as a whole, the previously
accepted text remains, and a notice explains the limit. Code execution has a
separate limit of 32,768 UTF-8 bytes, so some non-ASCII programs may reach the
execution limit before the draft limit.

## Included exercises

Every exercise has a starter program, a complete reference program, hints,
input/output requirements, an explanation, and four published test cases for
each of these languages: **Python, JavaScript, Java, C, and C++**.

| Exercise                   | Task                                               | Difficulty |
| -------------------------- | -------------------------------------------------- | ---------- |
| A warm-up: add two numbers | Read two integers and print their sum.             | Easy       |
| Mirror, mirror             | Check whether a word is a palindrome.              | Easy       |
| Find your vowels           | Count vowels regardless of letter case.            | Easy       |
| The biggest number wins    | Find the maximum, including all-negative inputs.   | Easy       |
| A tiny FizzBuzz detour     | Apply the divisibility rules in the correct order. | Medium     |
| Multiply your way home     | Calculate a factorial, including the zero case.    | Easy       |

There are **30 exercise/language combinations** and **120 published checks**
across their reference programs. Programs read standard input and print standard
output. Java uses `public class Main`; JavaScript runs in Node.js. The editor
filenames are `main.py`, `main.js`, `Main.java`, `main.c`, and `main.cpp`.

“Correct” means the submitted program passed the four published cases. This is
a practice tool; the test set is finite and does not prove correctness for every
possible input. Reference answers are intentionally available to learners.

## Local setup

Use Node.js 22 or newer. From the project directory:

```bash
npm ci
npm run setup
npm run dev
```

`npm ci` runs the postinstall script that copies Monaco's installed assets into
`public/monaco/vs/`. If installation scripts were disabled, run:

```bash
npm run setup:editor
```

Open the development URL printed in the terminal, then visit `/playground/`.
Open a deliberately missing URL such as `/a-missing-page/` to inspect the 404
version. Its editor assets and API requests use root-based paths, so they also
work when the missing address has several path segments.

The question list, editor, themes, hints, reference answers, and local drafts
work independently of the execution service. By default, real execution uses the
public Judge0 CE community endpoint with no API key. The optional configuration
below is only needed when you want to use a different compatible service.

## Connect real code execution

Learner programs are sent to a configured **Judge0-compatible execution
service**. The Next.js server submits and polls jobs; the service supplies the
isolated runtimes. The browser and Next.js server do not evaluate learner source
with `eval`, `Function`, or a local subprocess.

Choose a service you control or have access to. It must support:

- `GET /languages`, unless all five language IDs are explicitly configured;
- `POST /submissions/batch?base64_encoded=true`;
- `GET /submissions/batch` with token polling and Base64-encoded results;
- the execution resource limits used by this integration.

No runner variables are required for the default public Judge0 CE endpoint. To
use a custom service, add these **server-only** variables to `.env.local` for
development and to the runtime environment on your host. Authentication is
optional; if your provider requires it, set **at most one** authentication value.

```dotenv
# Optional custom base URL. Blank uses https://ce.judge0.com.
JUDGE0_BASE_URL=

# Option A: a service using X-Auth-Token.
JUDGE0_AUTH_TOKEN=

# Option B: a service using Authorization: Bearer.
JUDGE0_BEARER_TOKEN=

# Option C: a compatible service accessed through RapidAPI.
JUDGE0_RAPIDAPI_KEY=

# Optional for Option C. Defaults to the hostname of JUDGE0_BASE_URL.
# If provided, it must match that hostname exactly.
JUDGE0_RAPIDAPI_HOST=

# Optional JSON map of actual language IDs from your service.
# Leave blank to discover active runtimes automatically.
JUDGE0_LANGUAGE_IDS=

# Optional public website origin when a reverse proxy changes request.url.
# Use only the origin, with the correct scheme, hostname, and port.
PLAYGROUND_ORIGIN=
```

Do not prefix these settings with `NEXT_PUBLIC_`. They are read on the server.
The endpoint requires HTTPS in production. HTTP is accepted only for a
localhost/loopback execution service in development. URLs containing embedded
credentials, a query string, or a fragment are rejected. Documentation
placeholders ending in `.example` or `.invalid`, and `example.com`,
`example.net`, `example.org` or their subdomains, are also rejected. Development
domains ending in `.test` remain supported over HTTPS.

The supplied `JUDGE0_BASE_URL` and authentication values may remain blank. In
that case the app uses `https://ce.judge0.com` with built-in IDs for the five
supported languages. A custom service can override this default and can provide
its own authentication and language IDs when required.

Automatic runtime discovery selects active Python 3, Node.js JavaScript, Java,
C, and C++ entries from the service's language list. It compares version numbers
and prefers GCC entries for C/C++ when available. Discovered IDs are cached for
ten minutes per process. `JUDGE0_LANGUAGE_IDS` can supply a partial or complete
JSON object using the keys `python`, `javascript`, `java`, `c`, and `cpp`, with
positive integer values copied from that service. IDs differ between services;
do not assume IDs from another deployment are valid.

Restart the development server after changing settings. On a hosted deployment,
apply the host's environment update/restart procedure. Then reload the page.
The workbench's **Check connection** action repeats its configuration check
without discarding the current draft.

### What “Runner configured” means

`GET /api/playground/run/` returns only `{ "configured": true }` or
`{ "configured": false }`, with caching disabled. This checks the format and
presence of server configuration. It does **not** contact the provider or verify
credentials, account quota, runtime availability, or service health.
**Check connection** repeats this same local configuration request; it does not
submit code or perform a live provider-health check.

After configuration, run a bundled reference solution to check your actual
provider. Confirm that all four cases pass, then try an incomplete starter to
confirm that failures are reported. A transport problem, bad provider response,
or provider internal error is displayed as a service error; it is never saved as
a passing solution or presented as a completed incorrect attempt.

## API integration and hosting

The route lives at `src/app/api/playground/run/route.ts` and uses the **Node.js**
runtime. The site now needs a Next.js-capable host or a running Node server;
static HTML export cannot serve these dynamic execution and contact routes.
See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions.

The client sends JSON to `/api/playground/run/`:

```json
{
  "language": "python",
  "challengeId": "sum-two",
  "sourceCode": "a, b = map(int, input().split())\nprint(a + b)"
}
```

The API validates the language, known challenge, source size, and content type.
It obtains test inputs and expected outputs from the server's catalogue. The
request cannot select a provider URL, callback URL, compiler command, language
runtime ID, expected answer, or arbitrary test inputs.

For POST requests, the `Origin` header must match the origin of the request URL
or the explicitly configured `PLAYGROUND_ORIGIN`. Requests marked
`Sec-Fetch-Site: cross-site` are also rejected. Browsers send `Origin`
automatically for this JSON POST. If deployment uses an internal proxy hostname,
set `PLAYGROUND_ORIGIN` to the public website origin. This check reduces
cross-site requests; it does not authenticate individual learners.

The website uses `trailingSlash: true`, and the client requests the canonical
`/api/playground/run/` endpoint directly. The normal playground page and actual
404 view call the same route. The default deployment assumes a domain root;
subdirectory hosting requires coordinated Next.js base-path, link, and asset
configuration.

## Execution limits

| Limit                        | Current implementation                                      |
| ---------------------------- | ----------------------------------------------------------- |
| Submitted source             | 32,768 UTF-8 bytes                                          |
| Complete JSON request body   | 49,152 bytes, enforced while reading the stream             |
| Test cases per run           | At most four                                                |
| Submission rate              | Ten run attempts per minute, shared by one server process   |
| Concurrent runs              | Two per server process                                      |
| Complete provider operation  | 45-second deadline                                          |
| Each provider HTTP request   | At most six seconds, also bounded by the remaining deadline |
| Poll interval                | 900 milliseconds                                            |
| Browser request deadline     | 55 seconds                                                  |
| Route duration declaration   | 60 seconds; the host must support the requested duration    |
| Provider JSON response       | At most 2,097,152 bytes                                     |
| Displayed output/diagnostics | First 8,192 UTF-8 bytes of each, with a truncation notice   |

Each provider submission requests two CPU seconds, 0.5 extra CPU seconds, five
wall-clock seconds, 256,000 KB memory, 64,000 KB stack, at most 60 processes or
threads, 64 KB maximum file size, disabled network access, and one execution.
The provider must support and enforce these settings; its deployment policy may
apply additional limits.

Output is compared in full before the display is shortened. CRLF/CR line endings
are normalized to LF, and trailing whitespace at the end of output is ignored.
Leading whitespace, whitespace inside the output, case, and extra printed text
still affect the result. Compiler errors, runtime errors, time limits, and wrong
answers are shown separately.

The per-process limiter shares its budget across visitors and resets when the
process restarts. Multiple instances each have their own budget. Use a shared
rate limiter or host-level quota if the site needs a consistent deployment-wide
limit, and set an appropriate spending quota with the execution provider.

### Cancellation

Cancel, language/question changes, and leaving the workbench abort the browser's
active request. A canceled or stale response cannot be collected under a later
question. The editor is read-only while that run is active, so results refer to
the submitted snapshot.

Cancellation stops waiting and requests cancellation of in-flight transport; it
does not guarantee that already submitted jobs stop on the remote service.
Those jobs may finish and remain billable. The integration never automatically
retries the submission POST, avoiding accidental duplicate job creation.

## Drafts and collected answers

Drafts are stored separately for each language/question pair in browser
`localStorage`, under `detour-playground:progress:v1`. Selection, drafts, revealed
reference state, and collected answers survive refreshes in the same browser
origin. Writes are debounced by 250 milliseconds and flushed when leaving.

A correct run stores its submitted source, language, question, completion time,
test count, and guidance label. There is one collected answer per
language/question pair: another correct submission replaces that saved answer.
A failed run leaves previous correct solutions intact.

Revealing a reference solution marks that pair as guided for future successful
submissions. Revealing, copying, or loading a reference alone does not solve the
exercise. A **Guided** label records use of the reference; **Independent** means
that pair's reference has not been revealed in the saved local progress. These
labels describe local practice history, not a verified assessment.

The collection supports viewing, copying, reopening, removing, and downloading
answers as JSON. Removing a collected answer does not clear the separate draft
or reference-reveal history. The answers-only export is still available. Use
the whole-practice backup below when you want to restore work later.

Storage belongs to the visitor's browser and origin. Clearing site data,
switching browsers/devices/origins, or browser storage restrictions can remove
or prevent persistence. A visible notice appears when a write cannot be saved;
copy code or export a practice backup before leaving. Source sent for execution
also reaches the configured provider; keep credentials and private data out of
practice submissions.

## Back up and restore practice

The backup controls export a local `mbiopeter-practice-backup.json` containing
unfinished drafts, collected answers, the selected exercise and language, and
reference-reveal history. Import reads the selected file in the browser; it
does not upload it or run its code. This is a manual way to move your work
between browsers, with no account or automatic cloud sync.

The file has this versioned shape:

```text
format: "alexender-playground-backup"
version: 1
exportedAt: a date string
progress: { version, language, challengeId, drafts, answers, revealed }
```

Validation rejects malformed JSON, unsupported versions, unknown exercise or
language IDs, invalid dates, duplicate solution/reveal records, oversized
source, and inconsistent pass counts. Files are limited to 8 MiB (8,388,608
bytes), with at most 30 language/exercise pairs. Every imported pass record must
match the published test count for its exercise, but this structural check is
not proof that its code passed. Imported records are not re-executed or
independently verified. An answers-only export is not a full practice backup
and cannot be restored through this importer.

After a valid file is selected, review its draft and saved-solution counts and
choose a restore mode:

- **Merge and keep my current work** is the default. Missing drafts and answers
  are added. When both copies contain the same exercise/language pair, this
  browser's existing draft or answer wins. Its current selection stays, and
  reference-reveal histories are combined.
- **Replace local practice** takes the backup's complete practice state. It
  requires selecting replacement, checking the acknowledgement, and clicking
  the explicit replacement button. Export the current work first if you want
  to retain it separately.

Invalid files leave local practice unchanged. Import and replacement are
disabled during a run. The browser still needs working local storage to retain
the restored state after leaving the page.

## Verification and maintenance

```bash
npm run check
npm test
npm run build
```

The combined suite includes the portfolio's existing validation/demo tests and
the playground's runner, storage, catalogue, reference, and starter tests.
Provider interactions in automated tests are controlled mocks. The offline
catalogue checks execute only the trusted bundled reference/starter programs;
they require Python, Node.js, a Java compiler/runtime, GCC, and G++ for full
coverage. An unavailable language toolchain is reported as a skipped test.
These tests are not a runtime path for visitor-submitted code.

Current verification results and their scope are recorded in
[VERIFICATION.md](VERIFICATION.md). Automated provider tests use controlled
responses and do not establish that a real account is configured or working.
Perform the live provider check after supplying your own configuration.

To add a question, update `src/lib/challenges.ts` with all five starters and
solutions, clear input/output requirements, and up to four tests. Keep existing
IDs stable to preserve saved progress. Review the persistence schema before
changing language or challenge IDs, and run the catalogue tests after modifying
programs or expected outputs.
