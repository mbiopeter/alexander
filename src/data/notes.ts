export type Note = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  readingTime: string;
  sections: { title: string; body: string; checklist?: string[]; code?: string }[];
  next: { label: string; href: string };
  references: { label: string; href: string }[];
};

export const notes: Note[] = [
  {
    slug: "a-useful-bug-report",
    title: "A useful bug report starts small.",
    category: "DEBUGGING",
    readingTime: "3 minute read",
    summary: "Turn “it does not work” into a small, repeatable problem you can investigate.",
    sections: [
      {
        title: "Describe the gap",
        body: "Write down what you expected and what happened instead. Include the exact steps and the smallest input that still produces the problem. A screenshot is useful for a layout issue; an error message and its location are more useful for an exception.",
        checklist: ["What action triggers the problem?", "What should happen?", "What actually happens?", "Which browser, language or framework version are you using?"],
      },
      {
        title: "Change one thing",
        body: "Start from a repeatable example. Read the error location and inspect the values involved before changing the code. Make one focused change, try the original example again, and then check a nearby edge case. This makes it easier to explain why the fix works.",
        code: "Expected: an empty name shows a friendly greeting.\nActual: the page throws when the profile is missing.\nSteps: open the page without a saved profile.\nCheck next: a name containing only spaces.",
      },
      {
        title: "Leave a useful handover",
        body: "A short note should connect the cause, the change and the check. If the bug could return, keep a small regression test for its behaviour. Remove credentials and private customer data before sharing the example with someone else.",
      },
    ],
    next: { label: "Explore the debugging service", href: "/services/debugging/" },
    references: [{ label: "MDN: Troubleshooting JavaScript", href: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/What_went_wrong" }],
  },
  {
    slug: "csv-beyond-a-comma",
    title: "A CSV row is more than a comma.",
    category: "DATA & AUTOMATION",
    readingTime: "3 minute read",
    summary: "Why quoted fields, empty values and a preview matter when you clean a spreadsheet export.",
    sections: [
      {
        title: "Notice what a field can contain",
        body: "A quoted CSV field can contain a comma or a line break. An embedded double quote is represented by two double quotes. Splitting every line on commas loses that structure. The small example below has three fields, even though the quoted company name contains a comma.",
        code: 'name,company,city\nAda,"Research, Design & Code",Nairobi',
      },
      {
        title: "Make cleaning a deliberate choice",
        body: "Trimming spaces and removing duplicate rows may be helpful, but they change data. First identify the columns, inspect a few rows, and decide what the output should mean. A blank field can be meaningful; avoid replacing every missing value with a guess.",
        checklist: ["Keep a copy of the original input.", "Choose the cleanup operations you need.", "Compare row counts and a few representative records.", "Preview the result before downloading it."],
      },
      {
        title: "Try the complete workflow",
        body: "Data Tidy lets you paste a sample or open a CSV, choose cleanup options, inspect the output and download it. Processing happens in your browser. Its case study explains the implementation and the boundaries of this small demonstration.",
      },
    ],
    next: { label: "Try Data Tidy", href: "/projects/data-tidy/" },
    references: [{ label: "RFC 4180: CSV format and quoting", href: "https://www.rfc-editor.org/rfc/rfc4180" }],
  },
  {
    slug: "one-concept-one-experiment",
    title: "One concept. One experiment.",
    category: "LEARNING",
    readingTime: "2 minute read",
    summary: "A simple routine for turning a short explanation into something you can use yourself.",
    sections: [
      {
        title: "Predict before you run",
        body: "Read a short program and write down the output you expect. Choose one input that makes its behaviour easy to follow. If the actual result differs, look for the first step where your prediction and the program disagree.",
        code: "values = [2, 4, 6]\ntotal = 0\nfor value in values:\n    total += value\nprint(total)",
      },
      {
        title: "Try the boundary",
        body: "Once the ordinary case makes sense, change one thing. Try zero, a negative number, a repeated value or an empty input when the exercise allows it. Follow the stated input format: a useful test should check the problem the program is meant to solve.",
        checklist: ["Predict the result.", "Run one small example.", "Explain any difference.", "Try a relevant edge case.", "Write the idea again without looking at the solution."],
      },
      {
        title: "Keep the next step small",
        body: "The Playground keeps a separate draft for each language and challenge. Hints can help when you are stuck, and saved answers distinguish guided attempts. Start with adding two numbers, then move to a new exercise when you can explain your solution.",
      },
    ],
    next: { label: "Practise adding two numbers", href: "/playground/?language=python&challenge=sum-two" },
    references: [{ label: "Python tutorial: Control flow", href: "https://docs.python.org/3/tutorial/controlflow.html" }],
  },
];

export function getNote(slug: string) {
  return notes.find((note) => note.slug === slug);
}
