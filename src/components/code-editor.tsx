"use client";

import Editor, {
  loader,
  type BeforeMount,
  type OnMount,
} from "@monaco-editor/react";
import {
  Component,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import type { IDisposable, editor as MonacoEditor } from "monaco-editor";

import type { LanguageId } from "@/lib/challenges";

export type CodeLanguage = LanguageId;

export type CodeEditorProps = {
  value: string;
  onChange: (value: string) => boolean;
  language: CodeLanguage;
  theme: "light" | "dark";
  filename: string;
  onRun: () => void;
  disabled?: boolean;
  documentId?: string;
  editorBasePath?: string;
};

const labels: Record<CodeLanguage, string> = {
  python: "Python",
  javascript: "JavaScript",
  java: "Java",
  c: "C",
  cpp: "C++",
};

const badges: Record<CodeLanguage, string> = {
  python: "PY",
  javascript: "JS",
  java: "JA",
  c: "C",
  cpp: "C++",
};

const defineEditorThemes: BeforeMount = (monaco) => {
  monaco.editor.defineTheme("alexender-light", {
    base: "vs",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#FFFFFF",
      "editor.foreground": "#1D2621",
      "editorLineNumber.foreground": "#7C8879",
      "editorLineNumber.activeForeground": "#3A632C",
      "editor.lineHighlightBackground": "#F0F2EB",
      "editor.selectionBackground": "#D3F76B66",
      "editorCursor.foreground": "#3A632C",
      "editorGutter.background": "#FFFFFF",
    },
  });
  monaco.editor.defineTheme("alexender-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {
      "editor.background": "#191F1B",
      "editor.foreground": "#EDF1E8",
      "editorLineNumber.foreground": "#82907D",
      "editorLineNumber.activeForeground": "#D3F76B",
      "editor.lineHighlightBackground": "#202920",
      "editor.selectionBackground": "#52683499",
      "editorCursor.foreground": "#D3F76B",
      "editorGutter.background": "#191F1B",
    },
  });
};

class EditorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function CodeEditor({
  value,
  onChange,
  language,
  theme,
  filename,
  onRun,
  disabled = false,
  documentId = "practice",
  editorBasePath = "/monaco/vs",
}: CodeEditorProps) {
  const [loadState, setLoadState] = useState<"loading" | "ready" | "failed">(
    "loading",
  );
  const [simpleMode, setSimpleMode] = useState(false);
  const [cursor, setCursor] = useState({ line: 1, column: 1 });
  const instructionsId = useId();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const editorRef = useRef<MonacoEditor.IStandaloneCodeEditor | null>(null);
  const acceptedValueRef = useRef(value);
  const revertingRejectedEdit = useRef(false);
  acceptedValueRef.current = value;
  const runRef = useRef(onRun);
  const disabledRef = useRef(disabled);
  const disposablesRef = useRef<IDisposable[]>([]);
  const restoreSelectionRef = useRef<{
    start: number;
    end: number;
    focused: boolean;
  } | null>(null);

  useEffect(() => {
    runRef.current = onRun;
    disabledRef.current = disabled;
  }, [onRun, disabled]);

  useEffect(() => {
    let active = true;
    let settled = false;
    setLoadState("loading");
    let assetRoot: URL;
    try {
      assetRoot = new URL(editorBasePath, window.location.origin);
    } catch {
      setLoadState("failed");
      return;
    }
    if (assetRoot.origin !== window.location.origin) {
      setLoadState("failed");
      return;
    }
    loader.config({ paths: { vs: assetRoot.href.replace(/\/+$/, "") } });
    const timeout = window.setTimeout(() => {
      if (!active || settled) return;
      settled = true;
      setLoadState("failed");
    }, 12_000);

    loader.init().then(
      () => {
        if (!active || settled) return;
        settled = true;
        window.clearTimeout(timeout);
        const textarea = textareaRef.current;
        if (textarea) {
          restoreSelectionRef.current = {
            start: textarea.selectionStart,
            end: textarea.selectionEnd,
            focused: document.activeElement === textarea,
          };
        }
        setLoadState("ready");
      },
      () => {
        if (!active || settled) return;
        settled = true;
        window.clearTimeout(timeout);
        setLoadState("failed");
      },
    );

    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [editorBasePath]);

  useEffect(
    () => () => {
      for (const disposable of disposablesRef.current) disposable.dispose();
      disposablesRef.current = [];
      editorRef.current = null;
    },
    [],
  );

  const onMount = useCallback<OnMount>((editor, monaco) => {
    editorRef.current = editor;
    for (const disposable of disposablesRef.current) disposable.dispose();
    const runAction = editor.addAction({
      id: "detour.run-code",
      label: "Run challenge tests",
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: () => {
        if (!disabledRef.current) runRef.current();
      },
    });
    const cursorListener = editor.onDidChangeCursorPosition(({ position }) => {
      setCursor({ line: position.lineNumber, column: position.column });
    });
    disposablesRef.current = [runAction, cursorListener];

    const pendingSelection = restoreSelectionRef.current;
    const model = editor.getModel();
    if (pendingSelection?.focused && model) {
      const start = model.getPositionAt(pendingSelection.start);
      const end = model.getPositionAt(pendingSelection.end);
      editor.setSelection(
        new monaco.Selection(
          start.lineNumber,
          start.column,
          end.lineNumber,
          end.column,
        ),
      );
      editor.focus();
    }
    restoreSelectionRef.current = null;
    const position = editor.getPosition();
    setCursor({
      line: position?.lineNumber ?? 1,
      column: position?.column ?? 1,
    });
  }, []);

  const handleFallbackShortcut = (
    event: KeyboardEvent<HTMLTextAreaElement>,
  ) => {
    if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
      if (!disabled) onRun();
    }
  };

  const fallback = (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(event) => {
        const next = event.target.value;
        if (onChange(next)) acceptedValueRef.current = next;
        else event.target.value = acceptedValueRef.current;
      }}
      onKeyDown={handleFallbackShortcut}
      onSelect={(event) => {
        const beforeCursor = value
          .slice(0, event.currentTarget.selectionStart)
          .split("\n");
        setCursor({
          line: beforeCursor.length,
          column: beforeCursor.at(-1)!.length + 1,
        });
      }}
      aria-label={`${labels[language]} code editor`}
      aria-describedby={instructionsId}
      aria-disabled={disabled}
      readOnly={disabled}
      spellCheck={false}
      autoCapitalize="off"
      autoCorrect="off"
      wrap="off"
      className="h-full w-full resize-none border-0 bg-(--pg-panel) p-5 font-mono text-[13px] leading-6 text-(--pg-fg) outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-(--pg-accent) sm:text-sm"
    />
  );

  const useMonaco = loadState === "ready" && !simpleMode;
  const modelId = `${encodeURIComponent(documentId)}/${language}/${encodeURIComponent(filename)}`;

  return (
    <section
      aria-label={`${labels[language]} source editor`}
      className="min-w-0 overflow-hidden rounded-2xl border border-(--pg-border) bg-(--pg-panel) shadow-sm">

      <header className="flex min-h-[50px] items-center justify-between gap-2 border-b border-(--pg-border) bg-(--pg-soft) px-3 sm:px-4">

        <div className="flex min-w-0 items-center gap-3">

          <div
            className="hidden items-center gap-1.5 sm:flex"
            aria-hidden="true">

            <span className="h-2 w-2 rounded-full bg-rose-400/80" />
            <span className="h-2 w-2 rounded-full bg-amber-400/80" />
            <span className="h-2 w-2 rounded-full bg-emerald-400/80" />

          </div>
          <div className="flex min-w-0 items-center gap-2 border-b-2 border-(--pg-accent) py-3">
            <span
              className="text-[10px] font-bold text-(--pg-accent)"
              aria-hidden="true">
              {badges[language]}
            </span>
            <span className="truncate font-mono text-xs text-(--pg-fg)">
              {filename}
            </span>
            
          </div>

        </div>
        {loadState === "ready" && (
          <button
            type="button"
            onClick={() => setSimpleMode((current) => !current)}
            className="min-h-[40px] shrink-0 rounded-md px-2 text-[11px] text-(--pg-muted) hover:text-(--pg-fg) focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--pg-accent)">
            {simpleMode ? "Use syntax editor" : "Use plain editor"}
          </button>
        )}
      </header>

      {loadState !== "ready" && (
        <p
          role="status"
          className="border-b border-(--pg-border) bg-(--pg-soft) px-4 py-2 text-xs leading-5 text-(--pg-muted)">
          {loadState === "loading"
            ? "Loading syntax highlighting. You can already write below."
            : "Syntax highlighting is unavailable. You can still edit and run your code below."}
        </p>
      )}

      <div className="h-[360px] min-w-0 sm:h-[410px]">
        {useMonaco ? (
          <EditorBoundary onError={() => setLoadState("failed")}>

            <Editor
              key={modelId}
              height="100%"
              language={language === "c" ? "cpp" : language}
              theme={theme === "dark" ? "alexender-dark" : "alexender-light"}
              beforeMount={defineEditorThemes}
              path={`file:///detour/${modelId}`}
              value={value}
              onChange={(nextValue) => {
                if (revertingRejectedEdit.current) return;
                const next = nextValue ?? "";
                if (onChange(next)) {
                  acceptedValueRef.current = next;
                  return;
                }
                const editor = editorRef.current;
                if (!editor || editor.getValue() === acceptedValueRef.current) return;
                revertingRejectedEdit.current = true;
                try {
                  editor.setValue(acceptedValueRef.current);
                } finally {
                  revertingRejectedEdit.current = false;
                }
              }}
              onMount={onMount}
              loading={fallback}
              keepCurrentModel={false}
              options={{
                ariaLabel: `${labels[language]} code editor. Control or Command plus Enter runs tests. Control+M, or Control+Shift+M on Mac, lets Tab move focus out of the editor.`,
                accessibilitySupport: "auto",
                readOnly: disabled,
                domReadOnly: disabled,
                automaticLayout: true,
                minimap: { enabled: false },
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                fontSize: 14,
                lineHeight: 24,
                tabSize: 4,
                insertSpaces: true,
                detectIndentation: false,
                lineNumbers: "on",
                lineNumbersMinChars: 3,
                glyphMargin: false,
                folding: true,
                scrollBeyondLastLine: false,
                smoothScrolling: false,
                cursorBlinking: "solid",
                cursorSmoothCaretAnimation: "off",
                wordWrap: "on",
                padding: { top: 18, bottom: 18 },
                overviewRulerLanes: 0,
                renderLineHighlight: "line",
                scrollbar: { alwaysConsumeMouseWheel: false },
                stickyScroll: { enabled: false },
              }}
            />
          </EditorBoundary>
        ) : (
          fallback
        )}
      </div>
      <footer className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-(--pg-border) bg-(--pg-soft) px-4 py-2 font-mono text-[10px] text-(--pg-muted)">

        <span>
          Ln {cursor.line}, Col {cursor.column}
        </span>
        <span>{labels[language]} · UTF-8 · Spaces: 4</span>

      </footer>
      <p
        id={instructionsId}
        className="border-t border-(--pg-border) px-4 py-2.5 text-[11px] leading-5 text-(--pg-muted)">
        <span className="font-medium text-(--pg-fg)">
          Ctrl / ⌘ + Enter
        </span>{" "}
        to run.
        {useMonaco
          ? " To let Tab leave the editor, use Ctrl+M (Ctrl+Shift+M on Mac)."
          : " Tab moves to the next control."}
      </p>

    </section>
  );
}
