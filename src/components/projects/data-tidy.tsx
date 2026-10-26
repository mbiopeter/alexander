"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  Check,
  Download,
  FileSpreadsheet,
  RotateCcw,
  ShieldCheck,
  X,
} from "lucide-react";
import {
  cleanCsvRows,
  CSV_MAX_CHARACTERS,
  parseCsv,
  serializeCsv,
  spreadsheetSafeCell,
  type CsvCleanOptions,
} from "@/lib/demo-utils";

const sample =
  'Name, Role, City\nAda , Developer ,Nairobi\nSam,Designer, Accra\n\nAda ,Developer,Nairobi\n"Mina, Jr.", Creator,Lagos\n';

export function DataTidy() {
  const [input, setInput] = useState(sample);
  const [options, setOptions] = useState<CsvCleanOptions>({
    trimCells: true,
    removeBlankRows: true,
    removeDuplicates: true,
    hasHeader: true,
  });
  const [safeForSpreadsheets, setSafeForSpreadsheets] = useState(true);
  const [downloadMessage, setDownloadMessage] = useState("");
  const [confirmSample, setConfirmSample] = useState(false);
  const downloadUrl = useRef<string | null>(null);
  const id = useId();

  useEffect(
    () => () => {
      if (downloadUrl.current) URL.revokeObjectURL(downloadUrl.current);
    },
    [],
  );

  const result = useMemo(() => {
    try {
      const parsed = parseCsv(input);
      const cleaned = cleanCsvRows(parsed, options);
      const rows = safeForSpreadsheets
        ? cleaned.rows.map((row) => row.map(spreadsheetSafeCell))
        : cleaned.rows;
      const protectedCells = safeForSpreadsheets
        ? cleaned.rows.reduce(
            (total, row) =>
              total +
              row.filter((cell) => spreadsheetSafeCell(cell) !== cell).length,
            0,
          )
        : 0;
      return {
        rows,
        blanksRemoved: cleaned.blanksRemoved,
        duplicatesRemoved: cleaned.duplicatesRemoved,
        inputRows: parsed.length,
        protectedCells,
        error: "",
      };
    } catch (error) {
      return {
        rows: [] as string[][],
        blanksRemoved: 0,
        duplicatesRemoved: 0,
        inputRows: 0,
        protectedCells: 0,
        error:
          error instanceof Error
            ? error.message
            : "This CSV could not be read. Check its commas and quotes.",
      };
    }
  }, [input, options, safeForSpreadsheets]);

  const hasHeader = options.hasHeader && result.rows.length > 0;
  const bodyRows = hasHeader ? result.rows.slice(1) : result.rows;
  const columns = result.rows.reduce(
    (max, row) => Math.max(max, row.length),
    0,
  );
  const header = hasHeader
    ? result.rows[0]
    : Array.from({ length: columns }, (_, index) => `Column ${index + 1}`);
  const varyingWidths = result.rows.some(
    (row) => row.length !== result.rows[0]?.length,
  );

  function changeOption(key: keyof CsvCleanOptions, value: boolean) {
    setOptions((current) => ({ ...current, [key]: value }));
    setDownloadMessage("");
  }

  function downloadCsv() {
    if (result.error || !result.rows.length) return;
    if (downloadUrl.current) URL.revokeObjectURL(downloadUrl.current);
    const blob = new Blob(["\uFEFF", serializeCsv(result.rows)], {
      type: "text/csv;charset=utf-8",
    });
    downloadUrl.current = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl.current;
    link.download = "data-tidy-cleaned.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    setDownloadMessage(
      "Your cleaned CSV is ready. Check your browser’s downloads.",
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-(--line) bg-(--surface)">

      <div className="flex flex-col justify-between gap-4 border-b border-(--line) bg-(--surface-soft) p-5 sm:p-7 md:flex-row md:items-center">

        <div>

          <p className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-(--green)">
            <FileSpreadsheet size={15} /> A SMALL TOOL FOR MESSY DATA
          </p>
          <h2 className="!mb-0 !text-2xl !tracking-tight">
            Clean it up. Keep it yours.
          </h2>
        </div>
        <span className="inline-flex items-center gap-2 text-xs text-(--muted)">
          <ShieldCheck size={15} />
          Processed in your browser
        </span>

      </div>
      <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-[.85fr_1.15fr]">

        <div>

          <div className="mb-3 flex items-center justify-between gap-3">

            <label htmlFor={`${id}-csv`} className="text-sm font-semibold">
              Paste your CSV
            </label>
            <button
              type="button"
              className="flex min-h-9 items-center gap-1.5 rounded-md px-2 text-xs text-(--muted)"
              onClick={() => {
                setInput("");
                setDownloadMessage("");
              }}>
              <X size={13} />
              Clear
            </button>

          </div>
          <textarea
            id={`${id}-csv`}
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
              setDownloadMessage("");
            }}
            maxLength={CSV_MAX_CHARACTERS}
            rows={12}
            spellCheck={false}
            className="min-h-64 w-full resize-y rounded-xl border border-(--line) bg-(--surface-soft) p-4 font-mono text-xs leading-relaxed text-(--text) focus-visible:outline-(--green)"
            placeholder={"Name,Role,City\nAda,Developer,Nairobi"}
            aria-describedby={`${id}-csv-help${result.error ? ` ${id}-csv-error` : ""}`}
            aria-invalid={Boolean(result.error)}/>
          <p
            id={`${id}-csv-help`}
            className="mb-0 mt-2 text-[11px] leading-relaxed text-(--muted)">
            Comma-separated CSV, including quoted fields and line breaks. Up to
            2,000 rows, 50 columns, and 120,000 characters. Your text is not
            uploaded or saved.
          </p>
          <fieldset className="mt-6">

            <legend className="mb-3 text-xs font-semibold">
              Choose your cleanup
            </legend>
            <div className="space-y-3">
              {(
                [
                  {
                    key: "hasHeader",
                    label: "The first row contains column headings",
                  },
                  { key: "trimCells", label: "Trim spaces around each value" },
                  { key: "removeBlankRows", label: "Remove blank rows" },
                  {
                    key: "removeDuplicates",
                    label: "Remove duplicate data rows",
                  },
                ] as const
              ).map(({ key, label }) => (
                <label
                  key={key}
                  className="flex items-center gap-3 text-xs leading-relaxed">
                  <input
                    type="checkbox"
                    checked={options[key]}
                    onChange={(event) =>
                      changeOption(key, event.target.checked)
                    }
                    className="h-4 w-4 accent-(--green)"
                  />
                  {label}
                </label>
              ))}
            </div>

          </fieldset>
          <label className="mt-6 flex items-start gap-3 rounded-xl border border-(--line) bg-(--surface-soft) p-4 text-xs leading-relaxed">

            <input
              type="checkbox"
              checked={safeForSpreadsheets}
              onChange={(event) => {
                setSafeForSpreadsheets(event.target.checked);
                setDownloadMessage("");
              }}
              className="mt-0.5 h-4 w-4 shrink-0 accent-(--green)"/>
            <span>

              <strong className="block font-medium">
                Treat possible formulas as text
              </strong>
              <span className="mt-1 block text-(--muted)">
                Adds an apostrophe to values a spreadsheet might interpret as a
                formula. This includes negative numbers. The preview shows the
                exported values.
              </span>

            </span>

          </label>
          <div className="mt-5">

            <button
              type="button"
              onClick={() => setConfirmSample(true)}
              className="inline-flex min-h-10 items-center gap-2 text-xs font-medium text-(--muted) hover:text-(--text)">
              <RotateCcw size={14} />
              Load the sample CSV
            </button>
            {confirmSample && (
              <div className="mt-2 rounded-xl border border-(--line) p-4">

                <p className="mb-3 text-xs leading-relaxed">
                  Replace the text above with the sample CSV?
                </p>
                <div className="flex flex-wrap gap-2">

                  <button
                    type="button"
                    onClick={() => {
                      setInput(sample);
                      setConfirmSample(false);
                      setDownloadMessage("");
                    }}
                    className="rounded-lg bg-(--text) px-3 py-2 text-xs text-(--bg)">
                    Load sample
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmSample(false)}
                    className="rounded-lg border border-(--line) px-3 py-2 text-xs">
                    Keep my data
                  </button>

                </div>

              </div>
            )}
          </div>

        </div>
        <div className="min-w-0">

          <div className="mb-5 grid grid-cols-3 gap-2" aria-live="polite">
            {[
              { value: bodyRows.length, label: "Data rows ready" },
              { value: result.blanksRemoved, label: "Blank rows removed" },
              { value: result.duplicatesRemoved, label: "Duplicates removed" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="rounded-xl border border-(--line) bg-(--surface-soft) p-3 text-center sm:p-4">
                <strong className="mb-1 block text-xl font-semibold">
                  {result.error ? "—" : value.toLocaleString("en-US")}
                </strong>
                <span className="block text-[10px] leading-relaxed text-(--muted)">
                  {label}
                </span>

              </div>
            ))}
          </div>
          <div className="overflow-hidden rounded-xl border border-(--line)">

            <div className="flex items-center justify-between gap-3 border-b border-(--line) bg-(--surface-soft) px-4 py-3">

              <h3 className="mb-0 text-xs font-semibold">Cleaned preview</h3>
              <span className="text-[10px] text-(--muted)">
                Updates as you edit
              </span>

            </div>
            {result.error ? (
              <p
                id={`${id}-csv-error`}
                role="alert"
                className="m-4 rounded-lg border border-(--line) p-4 text-xs leading-relaxed">
                {result.error}
              </p>
            ) : !result.rows.length ? (
              <div className="p-10 text-center">

                <FileSpreadsheet
                  size={27}
                  className="mx-auto mb-3 text-(--muted)"/>
                <p className="mb-0 text-sm text-(--muted)">
                  Paste a CSV to see a cleaner version here.
                </p>

              </div>
            ) : (
              <div className="max-h-[420px] overflow-auto">

                <table className="w-full border-collapse text-left text-xs">

                  <caption className="sr-only">
                    Cleaned CSV preview showing up to ten data rows
                  </caption>
                  <thead className="bg-(--surface-soft)">

                    <tr>
                      {Array.from({ length: columns }, (_, index) => (
                        <th
                          key={index}
                          scope="col"
                          className="max-w-52 border-b border-(--line) px-4 py-3 font-semibold [overflow-wrap:anywhere]">
                          {header[index] ||
                            (hasHeader
                              ? `Untitled ${index + 1}`
                              : `Column ${index + 1}`)}
                        </th>
                      ))}
                    </tr>

                  </thead>
                  <tbody>
                    {bodyRows.slice(0, 10).map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        className="border-b border-(--line) last:border-0">
                        {Array.from({ length: columns }, (_, cellIndex) => (
                          <td
                            key={cellIndex}
                            className="max-w-52 whitespace-pre-wrap px-4 py-3 leading-relaxed text-(--muted) [overflow-wrap:anywhere]">
                            {row[cellIndex] ?? ""}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>

                </table>

              </div>
            )}
          </div>
          {!result.error && result.rows.length > 0 && (
            <p className="mb-0 mt-3 text-[11px] leading-relaxed text-(--muted)">
              {bodyRows.length > 10
                ? `Showing the first 10 of ${bodyRows.length} data rows. The download includes all rows.`
                : `Showing all ${bodyRows.length} data ${bodyRows.length === 1 ? "row" : "rows"}.`}
              {hasHeader
                ? " The header is included in your download."
                : " Column labels above are for the preview only."}
            </p>
          )}
          {varyingWidths && (
            <p className="mt-3 rounded-lg bg-(--surface-soft) p-3 text-[11px] leading-relaxed text-(--muted)">
              Some rows have different column counts. The preview pads empty
              cells for display; the download preserves each row’s actual
              fields.
            </p>
          )}
          {result.protectedCells > 0 && (
            <p className="mt-3 flex gap-2 text-[11px] leading-relaxed text-(--muted)">
              <ShieldCheck size={14} className="mt-0.5 shrink-0" />
              {result.protectedCells}{" "}
              {result.protectedCells === 1
                ? "cell will be treated"
                : "cells will be treated"}{" "}
              as text in the exported CSV.
            </p>
          )}
          <button
            type="button"
            onClick={downloadCsv}
            disabled={Boolean(result.error) || !result.rows.length}
            className="button button-primary mt-6">
            <Download size={16} />
            Download cleaned CSV
          </button>
          <p
            className="mb-0 mt-3 min-h-5 text-xs leading-relaxed text-(--muted)"
            role="status">
            {downloadMessage && (
              <>
                <Check size={14} className="mr-1 inline" />
                {downloadMessage}
              </>
            )}
          </p>

        </div>

      </div>
      
    </div>
  );
}
