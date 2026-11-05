"use client";

import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import type { CodeEditorProps } from "@/components/code-editor";

type EditorComponent = ComponentType<CodeEditorProps>;

export default function EditorLoader(props: CodeEditorProps) {
  const [Editor, setEditor] = useState<EditorComponent | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    import("@/components/code-editor").then(
      (module) => {
        if (!active) return;
        const component = module.default;
        if (typeof component === "function") {
          setEditor(() => component);
        } else {
          setFailed(true);
        }
      },
      () => { if (active) setFailed(true); },
    );
    return () => { active = false; };
  }, []);

  if (Editor) return <Editor {...props} />;

  if (failed) {
    return (
      <section aria-label="Plain code editor" className="overflow-hidden rounded-xl border border-(--pg-border) bg-(--pg-panel)">
        <p role="status" className="px-4 pt-3 text-xs text-(--pg-muted)">
          The rich editor could not load. You can still edit and run your code below.
        </p>
        <label className="block px-4 py-2 text-sm font-semibold" htmlFor="editor-fallback-text">
          {props.filename}
        </label>
        <textarea
          id="editor-fallback-text"
          className="h-80 w-full resize-y border-y border-(--pg-border) bg-(--pg-panel) p-4 font-mono text-sm text-(--pg-fg)"
          aria-label={`${props.filename} source code`}
          value={props.value}
          onChange={(event) => props.onChange(event.target.value)}
          spellCheck={false}
          disabled={props.disabled}
        />
        <div className="flex justify-end p-3">
          <button type="button" className="rounded-lg bg-(--pg-accent) px-4 py-2 text-sm font-semibold text-(--pg-bg)" disabled={props.disabled} onClick={props.onRun}>
            Run code
          </button>
        </div>
      </section>
    );
  }

  return (
    <div role="status" aria-live="polite" className="grid h-120 place-items-center rounded-2xl border border-(--pg-border) bg-(--pg-panel) text-sm text-(--pg-muted)">
      Preparing your workspace…
    </div>
  );
}
