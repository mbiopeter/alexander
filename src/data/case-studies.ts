export type BuildDecision = {
  title: string;
  detail: string;
};

export type CaseStudy = {
  heading: string;
  goal: string;
  approach: string;
  scope: string;
  decisions: BuildDecision[];
  walkthrough: { action: string; result: string }[];
  edgeCases: string[];
  limitations: string[];
  nextStep: string;
  serviceSlug: string;
  serviceLabel: string;
  sourceFiles: string[];
};

export const caseStudies: Record<string, CaseStudy> = {
  focusboard: {
    heading: "Make the next step easy to find.",
    goal:
      "A small personal project can still become a messy list. Focusboard gives that list a little structure: a clear task, an optional note, a priority, and a visible sense of what is done.",
    approach:
      "The interface keeps tasks in React state and saves the board in this browser. You can try the whole interaction without creating an account, then return to the same board on this device when browser storage is available.",
    scope: "Task editing · search and filters · local persistence",
    decisions: [
      {
        title: "Start working before signing up",
        detail:
          "Local storage keeps the first interaction simple. It also creates a clear boundary: this is a personal board on one browser, with no account, shared database, or device sync. Storage warnings explain when changes will only last for the current visit.",
      },
      {
        title: "Check what comes back from storage",
        detail:
          "Saved data is validated before it becomes the board. The reader checks task fields, priorities, completion values, unique IDs, and the 100-task limit. An empty saved board stays empty; invalid data gets a recovery message instead of being treated as a valid task list.",
      },
      {
        title: "Keep the state easy to understand",
        detail:
          "Search and completion filters are derived from the same task list. Editing keeps the task’s identity and completion state. Adding a task clears filters so the new item is visible, and replacing the board with sample tasks asks for confirmation.",
      },
    ],
    walkthrough: [
      {
        action: "Add a task and a short note",
        result: "Give it a priority, then search for a word in either the title or note.",
      },
      {
        action: "Mark it done, then refine it",
        result: "The completion count changes. Editing its wording keeps it completed.",
      },
      {
        action: "Refresh this page",
        result: "The board returns when this browser allows local storage. Nothing is synced to another device.",
      },
    ],
    edgeCases: [
      "An empty title produces a focused validation message.",
      "Invalid saved boards and repeated task IDs are rejected by the storage reader.",
      "The board distinguishes an empty saved list from a first visit with sample tasks.",
      "A blocked or full storage area produces a visible saving notice.",
    ],
    limitations: [
      "Up to 100 tasks, with an 80-character title and a 280-character note per task.",
      "Clearing browser data removes the board. There are no accounts, backups, shared boards, or cross-device sync.",
    ],
    nextStep:
      "For a team workflow, the next step would be agreed ownership and permissions, then a backend with persistent records and a deliberate sync strategy.",
    serviceSlug: "custom-software",
    serviceLabel: "Explore custom software",
    sourceFiles: [
      "src/components/projects/focusboard.tsx",
      "src/lib/demo-utils.ts",
      "src/lib/demo-utils.test.ts",
    ],
  },
  "django-api-lab": {
    heading: "Make an API response something you can explore.",
    goal:
      "Status codes and query parameters are easier to understand when you can change an input and inspect the result. This lab turns a small task API into a guided, repeatable learning example.",
    approach:
      "A TypeScript function simulates GET responses from four local sample tasks. The interface shows the requested path, status, and JSON together. A separate Django REST Framework sketch explains one way a real list and detail API could begin.",
    scope: "API concepts · input validation · a browser simulation",
    decisions: [
      {
        title: "Keep the example easy to inspect",
        detail:
          "Local sample data makes the responses repeatable and removes server setup from the lesson. The page explicitly identifies itself as a simulation: it sends no API request and runs no Python server. The short loading delay illustrates a request state rather than measuring network time.",
      },
      {
        title: "Show errors as part of the API",
        detail:
          "The list endpoint accepts search, completed, and limit. Unknown parameters, invalid Boolean values, and limits outside 1–50 return a simulated 400 with a useful field message. A missing task returns 404 instead of an empty success response.",
      },
      {
        title: "Make the response contract visible",
        detail:
          "The count describes all matching tasks before the limit is applied. The results array contains the returned subset. The Django sketch is kept separate because real routing, settings, models, and query validation would still need to be implemented.",
      },
    ],
    walkthrough: [
      {
        action: "Try completed=false&limit=1",
        result: "The response counts two matching tasks and returns one result.",
      },
      {
        action: "Change the limit to zero",
        result: "The lab returns a simulated 400 with an explanation of the accepted range.",
      },
      {
        action: "Choose the missing task endpoint",
        result: "The response becomes 404 and explains that the task could not be found.",
      },
    ],
    edgeCases: [
      "A search with no matches returns count: 0 and an empty results array.",
      "Unknown query keys and completed values other than true or false produce a 400 response.",
      "A limit must contain whole-number digits and be between 1 and 50.",
      "Query controls are disabled on detail endpoints, where this lesson does not use filters.",
    ],
    limitations: [
      "This is a frontend learning demo, not a deployed Django backend or a production API.",
      "The example covers GET requests to a small fixed dataset. It does not implement authentication, writes, pagination links, or a database.",
    ],
    nextStep:
      "A production version would start with the actual data model and access rules, then implement and test the response contract in Django rather than simulating it in the browser.",
    serviceSlug: "python-django",
    serviceLabel: "Explore Python & Django development",
    sourceFiles: ["src/components/projects/django-api-lab.tsx"],
  },
  "data-tidy": {
    heading: "Show what changed before downloading the result.",
    goal:
      "Small CSV files often need a few practical fixes: extra spaces, blank rows, or duplicated records. Data Tidy makes those choices visible and lets you inspect the result before exporting it.",
    approach:
      "The browser parses the pasted text, applies the selected cleanup rules, and creates the download locally. The preview and counts update as the input changes. The CSV text is not uploaded by this tool.",
    scope: "CSV parsing · explicit cleanup rules · local export",
    decisions: [
      {
        title: "Parse fields before cleaning rows",
        detail:
          "A CSV field can contain a comma, an escaped quote, or a line break. The parser tracks quoted fields rather than splitting every line on commas. It handles a byte-order mark and common line endings, and explains malformed quotes instead of guessing at their meaning.",
      },
      {
        title: "Let the user choose the transformation",
        detail:
          "Trimming, blank-row removal, and duplicate removal are separate controls. Duplicate checks compare complete row arrays, and a selected header is kept separate from the data. Rows with unequal widths are shown with padding in the preview while the download preserves their actual fields.",
      },
      {
        title: "Make export behaviour explicit",
        detail:
          "Optional spreadsheet text protection prefixes formula-like cells with an apostrophe and reports how many cells change. It also affects negative-number text, so the toggle matters. The download correctly quotes special fields and includes all cleaned rows, not just the preview.",
      },
    ],
    walkthrough: [
      {
        action: "Start with the sample CSV",
        result: "Keep the header, trim cells, and compare the blank-row and duplicate counts.",
      },
      {
        action: "Include a quoted value with a comma",
        result: "A value such as “Mina, Jr.” stays in one field rather than becoming two columns.",
      },
      {
        action: "Review the preview and export",
        result: "The download includes every cleaned row. Check the text-protection option before opening it in a spreadsheet.",
      },
    ],
    edgeCases: [
      "Quoted commas, doubled quotes, embedded line breaks, empty fields, and CR/LF line endings.",
      "Malformed or unclosed quotes, with a useful parsing message instead of a partial export.",
      "Header-only files, duplicate data matching a header, and rows with different field counts.",
      "Formula markers preceded by whitespace and negative-number text during protected export.",
    ],
    limitations: [
      "Comma-separated text only, with limits of 120,000 characters, 2,000 parsed rows, and 50 columns per row.",
      "The preview shows at most ten data rows. This tool does not import Excel workbooks, infer data types, merge near-duplicates, or save your input between visits.",
    ],
    nextStep:
      "For a repeated business workflow, agree the data rules first. The same sequence—validate, transform, inspect, export—could then become an automated process with a record of each run.",
    serviceSlug: "python-automation",
    serviceLabel: "Explore Python automation",
    sourceFiles: [
      "src/components/projects/data-tidy.tsx",
      "src/lib/demo-utils.ts",
      "src/lib/demo-utils.test.ts",
    ],
  },
};

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies[slug];
}
