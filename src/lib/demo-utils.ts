export const CSV_MAX_CHARACTERS = 120_000;
export const CSV_MAX_ROWS = 2_000;
export const CSV_MAX_COLUMNS = 50;

export function parseCsv(source: string): string[][] {
  if (source.length > CSV_MAX_CHARACTERS) {
    throw new Error(
      "Please use a CSV of 120,000 characters or fewer for this browser demo.",
    );
  }
  const input = source.replace(/^\uFEFF/, "");
  if (!input) return [];
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  let quoteClosed = false;

  const finishCell = () => {
    row.push(cell);
    if (row.length > CSV_MAX_COLUMNS) {
      throw new Error("This demo supports up to 50 columns per row.");
    }
    cell = "";
    quoteClosed = false;
  };
  const finishRow = () => {
    finishCell();
    rows.push(row);
    if (rows.length > CSV_MAX_ROWS) {
      throw new Error(
        "This demo supports up to 2,000 rows. Try a smaller CSV.",
      );
    }
    row = [];
  };

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    if (quoted) {
      if (char === '"') {
        if (input[index + 1] === '"') {
          cell += '"';
          index += 1;
        } else {
          quoted = false;
          quoteClosed = true;
        }
      } else {
        cell += char;
      }
      continue;
    }

    if (char === ",") {
      finishCell();
    } else if (char === "\n" || char === "\r") {
      finishRow();
      if (char === "\r" && input[index + 1] === "\n") index += 1;
    } else if (quoteClosed) {
      if (char !== " " && char !== "\t") {
        throw new Error(
          `Unexpected text after a closing quote near character ${index + 1}. Add a comma between fields.`,
        );
      }
    } else if (char === '"') {
      if (cell.length !== 0) {
        throw new Error(
          `Unexpected quote near character ${index + 1}. Put quotes around the whole field and double any quotes inside it.`,
        );
      }
      quoted = true;
    } else {
      cell += char;
    }
  }

  if (quoted)
    throw new Error(
      "A quoted field is still open. Add its closing double quote.",
    );
  if (cell.length > 0 || row.length > 0 || quoteClosed) finishRow();
  return rows;
}

export type CsvCleanOptions = {
  trimCells: boolean;
  removeBlankRows: boolean;
  removeDuplicates: boolean;
  hasHeader: boolean;
};

export function cleanCsvRows(rows: string[][], options: CsvCleanOptions) {
  let blanksRemoved = 0;
  let duplicatesRemoved = 0;
  const seen = new Set<string>();
  const cleaned: string[][] = [];

  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index].map((cell) =>
      options.trimCells ? cell.trim() : cell,
    );
    if (options.removeBlankRows && row.every((cell) => cell.trim() === "")) {
      blanksRemoved += 1;
      continue;
    }
    const isHeader = options.hasHeader && cleaned.length === 0;
    const signature = JSON.stringify(row);
    if (!isHeader && options.removeDuplicates && seen.has(signature)) {
      duplicatesRemoved += 1;
      continue;
    }
    if (!isHeader) seen.add(signature);
    cleaned.push(row);
  }
  return { rows: cleaned, blanksRemoved, duplicatesRemoved };
}

export function spreadsheetSafeCell(value: string): string {
  return /^[\t\r\n]/.test(value) || /^\s*[=+\-@]/.test(value)
    ? `'${value}`
    : value;
}

export function serializeCsv(rows: string[][]): string {
  return rows
    .map((row) =>
      row
        .map((cell) =>
          /[",\r\n]/.test(cell) || (row.length === 1 && cell === "")
            ? `"${cell.replace(/"/g, '""')}"`
            : cell,
        )
        .join(","),
    )
    .join("\r\n");
}

export type BoardTask = {
  id: string;
  title: string;
  detail: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
};

export function readBoardTasks(value: string): BoardTask[] | null {
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed) || parsed.length > 100) return null;
    const ids = new Set<string>();
    for (const task of parsed) {
      if (!task || typeof task !== "object" || Array.isArray(task)) return null;
      if (
        typeof task.id !== "string" ||
        !task.id ||
        task.id.length > 100 ||
        ids.has(task.id)
      )
        return null;
      if (
        typeof task.title !== "string" ||
        !task.title.trim() ||
        task.title.length > 80
      )
        return null;
      if (typeof task.detail !== "string" || task.detail.length > 280)
        return null;
      if (
        !["low", "medium", "high"].includes(task.priority) ||
        typeof task.completed !== "boolean"
      )
        return null;
      ids.add(task.id);
    }
    return parsed as BoardTask[];
  } catch {
    return null;
  }
}
