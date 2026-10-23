import assert from "node:assert/strict";
import test from "node:test";
import {
  cleanCsvRows,
  parseCsv,
  readBoardTasks,
  serializeCsv,
  spreadsheetSafeCell,
} from "./demo-utils";

test("CSV parsing preserves escaped quotes, embedded commas, newlines, empty fields, and BOM", () => {
  assert.deepEqual(
    parseCsv(
      '\uFEFFName,Notes,Empty\r\n"Ada, A.","Said ""hello""\nand left",\r\n',
    ),
    [
      ["Name", "Notes", "Empty"],
      ["Ada, A.", 'Said "hello"\nand left', ""],
    ],
  );
  assert.deepEqual(parseCsv(","), [["", ""]]);
  assert.deepEqual(parseCsv('""'), [[""]]);
  assert.deepEqual(parseCsv(""), []);
});

test("CSV rejects malformed quoting and enforces bounded browser work", () => {
  assert.throws(() => parseCsv('a,"unfinished'), /closing double quote/);
  assert.throws(() => parseCsv('a,b"c'), /Unexpected quote/);
  assert.throws(() => parseCsv('"a"oops,b'), /Unexpected text/);
  assert.throws(() => parseCsv("x".repeat(120_001)), /120,000/);
  assert.throws(() => parseCsv(Array(51).fill("x").join(",")), /50 columns/);
  assert.throws(
    () => parseCsv(Array(2_001).fill("x").join("\n")),
    /2,000 rows/,
  );
});

test("CSV cleanup preserves headers and treats duplicate rows as complete cell arrays", () => {
  const result = cleanCsvRows(
    [
      [" Name ", "Role"],
      ["Ada ", "Developer"],
      [" ", ""],
      ["Ada", "Developer"],
      ["Name", "Role"],
    ],
    {
      trimCells: true,
      removeBlankRows: true,
      removeDuplicates: true,
      hasHeader: true,
    },
  );
  assert.deepEqual(result, {
    rows: [
      ["Name", "Role"],
      ["Ada", "Developer"],
      ["Name", "Role"],
    ],
    blanksRemoved: 1,
    duplicatesRemoved: 1,
  });
  assert.deepEqual(
    cleanCsvRows(
      [
        ["a,b", "c"],
        ["a", "b,c"],
      ],
      {
        trimCells: false,
        removeBlankRows: false,
        removeDuplicates: true,
        hasHeader: false,
      },
    ).rows,
    [
      ["a,b", "c"],
      ["a", "b,c"],
    ],
  );
});

test("CSV serialization round-trips quotes, commas, line breaks, and ragged rows", () => {
  const rows = [
    ["Title", "Notes"],
    ['A "quote"', "Line 1\r\nLine 2"],
    ["comma,value", ""],
    ["Only one field"],
  ];
  assert.deepEqual(parseCsv(serializeCsv(rows)), rows);
  assert.deepEqual(parseCsv(serializeCsv([[""], ["x"], [""]])), [
    [""],
    ["x"],
    [""],
  ]);
});

test("spreadsheet text protection handles whitespace-prefixed formulas and negative numbers", () => {
  for (const input of [
    "=SUM(A1:A2)",
    " +1",
    "-42",
    "@name",
    "\t=1",
    "\rfoo",
    "\nbar",
  ]) {
    assert.equal(spreadsheetSafeCell(input), `'${input}`);
  }
  assert.equal(spreadsheetSafeCell("Ordinary text"), "Ordinary text");
  assert.equal(spreadsheetSafeCell("42"), "42");
  assert.equal(spreadsheetSafeCell("'=1"), "'=1");
});

test("saved task boards reject corrupt shapes and duplicate IDs without trusting stored HTML", () => {
  const task = {
    id: "one",
    title: "<b>Literal text</b>",
    detail: "A task",
    priority: "high",
    completed: false,
  };
  assert.deepEqual(readBoardTasks(JSON.stringify([task])), [task]);
  assert.deepEqual(readBoardTasks("[]"), []);
  assert.equal(readBoardTasks("not json"), null);
  assert.equal(readBoardTasks(JSON.stringify([task, task])), null);
  assert.equal(
    readBoardTasks(JSON.stringify([{ ...task, completed: "false" }])),
    null,
  );
  assert.equal(readBoardTasks(JSON.stringify([{ ...task, title: " " }])), null);
  assert.equal(
    readBoardTasks(JSON.stringify([{ ...task, priority: "urgent" }])),
    null,
  );
});
