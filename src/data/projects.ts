export type Project = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  stack: string[];
  kind: "Interactive demo" | "API design demo";
  accent: "green" | "violet" | "orange";
  features: string[];
  sourceDownload: string;
  buildNote: string;
};

export const projects: Project[] = [
  {
    slug: "focusboard",
    title: "Focusboard",
    category: "Frontend",
    summary:
      "A little structure for your next big idea. Plan tasks, track progress, and keep your focus.",
    description:
      "A practical task board built with React state and browser storage. Add a task, make a plan, and pick up where you left off on this device.",
    stack: ["React", "TypeScript", "Local storage"],
    kind: "Interactive demo",
    sourceDownload: "/downloads/focusboard-source.zip",
    buildNote: "Explore the choices behind a task board that remembers your work in this browser.",
    accent: "green",
    features: [
      "Add, edit, complete, and remove tasks",
      "Filter your board and track completion",
      "Keep your tasks on this browser and device",
    ],
  },
  {
    slug: "django-api-lab",
    title: "Django API Lab",
    category: "APIs & Python",
    summary:
      "Make requests, read responses, and see what a well-structured API could look like.",
    description:
      "An interactive guide to a Django REST-style API. Explore GET requests, query parameters, validation, and status codes using a clearly labelled browser simulation.",
    stack: ["API design", "Django concepts", "TypeScript"],
    kind: "API design demo",
    sourceDownload: "/downloads/django-api-lab-source.zip",
    buildNote: "See how a clearly labelled browser simulation makes API behaviour easier to understand.",
    accent: "violet",
    features: [
      "Explore list, detail, and missing-resource responses",
      "Try filters and invalid query parameters",
      "Connect a JSON response to a short Django REST example",
    ],
  },
  {
    slug: "data-tidy",
    title: "Data Tidy",
    category: "Data tools",
    summary:
      "Messy spreadsheet data? Clean a CSV, inspect the changes, and download something useful.",
    description:
      "A small browser tool for everyday CSV cleanup. Trim extra spaces, remove blank rows and duplicates, then preview and download the result without uploading your data.",
    stack: ["TypeScript", "CSV parsing", "Browser APIs"],
    kind: "Interactive demo",
    sourceDownload: "/downloads/data-tidy-source.zip",
    buildNote: "Look inside the parsing, cleanup rules, and export decisions behind this browser tool.",
    accent: "orange",
    features: [
      "Parse quoted fields, commas, and embedded line breaks",
      "Choose your cleanup rules and inspect the result",
      "Download CSV with optional spreadsheet formula protection",
    ],
  },
];
