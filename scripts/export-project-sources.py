#!/usr/bin/env python3
"""Refresh the three public source downloads using an explicit file allowlist.

Run from any directory: python3 scripts/export-project-sources.py
Only Python's standard library is needed. These ZIPs are committed public assets;
the deployed Next.js server does not need Python or run this script.
"""

from hashlib import sha256
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile, ZipInfo


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "downloads"
PROJECTS = {
    "focusboard": {
        "title": "Focusboard",
        "component": "Focusboard",
        "files": [
            "src/components/projects/focusboard.tsx",
            "src/lib/demo-utils.ts",
            "src/lib/demo-utils.test.ts",
        ],
        "notes": (
            "A React task board with editing, priorities, completion, search, "
            "filters, and validated local-storage persistence. It stores up to "
            "100 tasks in one browser. It has no accounts, backend, or cloud sync."
        ),
    },
    "django-api-lab": {
        "title": "Django API Lab",
        "component": "DjangoApiLab",
        "files": ["src/components/projects/django-api-lab.tsx"],
        "notes": (
            "A TypeScript browser simulation of a small read-only task API. "
            "It illustrates JSON, status codes, query filters, and validation. "
            "It does not run Python, send API requests, or connect to a database. "
            "The Python sketch in the component is explanatory; a real Django "
            "project would also need its model, routing, settings, and validation."
        ),
    },
    "data-tidy": {
        "title": "Data Tidy",
        "component": "DataTidy",
        "files": [
            "src/components/projects/data-tidy.tsx",
            "src/lib/demo-utils.ts",
            "src/lib/demo-utils.test.ts",
        ],
        "notes": (
            "A browser CSV tool for parsing, trimming, blank-row removal, "
            "deduplication, preview, and local download. The parser supports "
            "quoted commas, escaped quotes, and embedded newlines. Inputs are "
            "limited to 120,000 characters, 2,000 parsed rows, and 50 columns. "
            "The optional spreadsheet text protection changes formula-like "
            "cells, including negative-number text, by prefixing an apostrophe."
        ),
    },
}


def build_readme(slug: str, project: dict) -> bytes:
    file_list = "\n".join(f"- `{name}`" for name in project["files"])
    helper_note = (
        "The shared helper module contains both the board reader and the CSV "
        "utilities; it is preserved exactly as used by the portfolio."
        if "src/lib/demo-utils.ts" in project["files"]
        else "The request simulator and explanatory Python sketch are both "
        "contained in the included component."
    )
    tests = (
        "The helper test file uses Node's built-in test runner and TypeScript. "
        "From the full portfolio with dependencies installed, run "
        "`node --import tsx --test src/lib/demo-utils.test.ts`. It covers "
        "CSV parsing, cleanup and serialization, spreadsheet text protection, "
        "and the saved-board data reader. It is not an end-to-end UI test suite."
        if "src/lib/demo-utils.test.ts" in project["files"]
        else "Use the demo to inspect list, detail, invalid-query, and missing-task "
        "responses. This source extract does not include an automated test suite."
    )
    return f"""# {project['title']} — source extract

These are the actual implementation files used by the {project['title']} demo
on Mbiopeter's portfolio. The download is for reading the code and adapting the
component within a suitable React project. It is not a standalone application
or a published npm package.

## What the demo does

{project['notes']}

## Included source

{file_list}

`MANIFEST.sha256` records a SHA-256 checksum for each included file and this guide.
{helper_note}

## Using the component

The original site uses Next.js, React, TypeScript, Tailwind CSS, and lucide-react.
The component is a client component and uses browser APIs. The import alias
`@/` points to `src/` in the portfolio's TypeScript configuration.

Copy the files into a React/TypeScript project with matching dependencies and
an equivalent alias, then import and render `{project['component']}`. Adapt the
styles to your application. The component uses Tailwind utility classes, shared
`.button` variants, and design variables such as `--bg`, `--surface`,
`--surface-soft`, `--text`, `--muted`, `--line`, `--green`, and `--accent`.
Those site-wide styles and the application shell are not included in this
focused source extract. Browser storage and downloads should be exercised in
the browser, rather than during server rendering.

## Checking behaviour

{tests}

The build notes on `/projects/{slug}/#behind-the-build` describe decisions,
manual examples to explore, current limitations, and a possible next step.
These are demonstration projects; no client outcomes or performance results
are claimed by this source download.

## Refreshing the download

From the complete portfolio source, run:

```sh
python3 scripts/export-project-sources.py
```

The script uses an explicit allowlist. Environment files, contact settings,
credentials, dependencies, and build output are never part of these downloads.
The generated ZIPs are static assets; Python is not needed by the deployed site.
""".encode("utf-8")


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for slug, project in PROJECTS.items():
        contents = {
            name: (ROOT / name).read_bytes()
            for name in project["files"]
        }
        contents["README.md"] = build_readme(slug, project)
        contents["MANIFEST.sha256"] = (
            "\n".join(
                f"{sha256(data).hexdigest()}  {name}"
                for name, data in sorted(contents.items())
            ) + "\n"
        ).encode("utf-8")
        destination = OUTPUT / f"{slug}-source.zip"
        with ZipFile(destination, "w", compression=ZIP_DEFLATED) as archive:
            for name, data in sorted(contents.items()):
                # A fixed archive timestamp makes refreshes reproducible.
                entry = ZipInfo(f"{slug}-source/{name}", (2024, 1, 1, 0, 0, 0))
                entry.compress_type = ZIP_DEFLATED
                entry.external_attr = 0o644 << 16
                archive.writestr(entry, data)
        print(f"Created {destination.relative_to(ROOT)} ({destination.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
