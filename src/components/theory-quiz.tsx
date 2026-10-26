"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CircleHelp,
  RotateCcw,
  Sparkles,
  Trophy,
  X,
} from "lucide-react";
import {
  THEORY_QUESTIONS,
  pickTheoryQuestions,
  type TheoryDifficulty,
  type TheoryQuestion,
} from "@/lib/theory-questions";

interface PresentedQuestion extends Omit<TheoryQuestion, "options" | "answer"> {
  options: [string, string, string, string];
  answer: number;
}

function present(question: TheoryQuestion): PresentedQuestion {
  const choices = question.options.map((label, originalIndex) => ({
    label,
    correct: originalIndex === question.answer,
  }));
  for (let index = choices.length - 1; index > 0; index--) {
    const swap = Math.floor(Math.random() * (index + 1));
    [choices[index], choices[swap]] = [choices[swap], choices[index]];
  }
  return {
    ...question,
    options: choices.map((choice) => choice.label) as [string, string, string, string],
    answer: choices.findIndex((choice) => choice.correct),
  };
}

function difficultyClasses(difficulty: TheoryDifficulty) {
  if (difficulty === "Easy") return "bg-(--pg-success-bg) text-(--pg-success)";
  if (difficulty === "Medium") return "bg-(--pg-warning-bg) text-(--pg-warning)";
  return "bg-(--pg-error-bg) text-(--pg-error)";
}

export function TheoryQuiz() {
  const [questions, setQuestions] = useState<PresentedQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [current, setCurrent] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  function startNewQuiz() {
    setQuestions(pickTheoryQuestions(10).map(present));
    setAnswers({});
    setCurrent(0);
    setSubmitted(false);
  }

  useEffect(() => {
    startNewQuiz();
  }, []);

  const answered = Object.keys(answers).length;
  const score = useMemo(
    () =>
      questions.reduce(
        (total, question) => total + (answers[question.id] === question.answer ? 1 : 0),
        0,
      ),
    [answers, questions],
  );
  const percentage = questions.length ? Math.round((score / questions.length) * 100) : 0;
  const difficultyScore = (difficulty: TheoryDifficulty) => {
    const group = questions.filter((question) => question.difficulty === difficulty);
    return {
      correct: group.filter((question) => answers[question.id] === question.answer).length,
      total: group.length,
    };
  };

  if (!questions.length) {
    return (
      <section className="py-10" aria-label="Preparing theory test">

        <div className="rounded-2xl border border-(--pg-border) bg-(--pg-panel) p-8 text-sm text-(--pg-muted)">
          Preparing 10 random theory questions…
        </div>

      </section>
    );
  }

  const question = questions[current];

  return (
    <section className="py-7 md:py-10" aria-labelledby="theory-title">

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">

        <div className="rounded-2xl border border-(--pg-border) bg-(--pg-panel) p-5 sm:p-7">

          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-(--pg-border) pb-5">

            <div>

              <div className="mb-2 flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-(--pg-muted)">
                <span className="rounded-full bg-(--pg-accent-soft) px-2.5 py-1 text-(--pg-accent)">Theory test</span>
                <span>10 selected from {THEORY_QUESTIONS.length} questions</span>
              </div>
              <h1 id="theory-title" className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
                Test what you know.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-(--pg-muted)">
                Every new test mixes easy, medium, and hard questions. Answer all 10, submit once, and your score is shown immediately.
              </p>

            </div>
            <button type="button" onClick={startNewQuiz} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-(--pg-border) px-3 text-xs font-medium text-(--pg-muted) hover:bg-(--pg-soft)">
              <RotateCcw size={13} aria-hidden="true" /> New random 10
            </button>

          </div>

          {!submitted ? (
            <>

              <div className="py-6">

                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

                  <div className="flex items-center gap-2">

                    <span className="font-mono text-xs text-(--pg-muted)">Question {current + 1}/10</span>
                    <span className={`rounded-md px-2 py-1 text-[10px] font-semibold ${difficultyClasses(question.difficulty)}`}>
                      {question.difficulty}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-(--pg-muted)">{question.topic}</span>

                  </div>
                  <span className="text-xs text-(--pg-muted)">{answered}/10 answered</span>

                </div>
                <h2 className="max-w-3xl text-xl font-semibold leading-8 tracking-tight sm:text-2xl">{question.prompt}</h2>
                <div className="mt-6 grid gap-3">

                  {question.options.map((option, index) => {
                    const selected = answers[question.id] === index;
                    return (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => setAnswers((currentAnswers) => ({ ...currentAnswers, [question.id]: index }))}
                        className={`flex min-h-14 items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${selected ? "border-(--pg-accent) bg-(--pg-accent-soft) text-(--pg-fg)" : "border-(--pg-border) bg-(--pg-soft) hover:border-(--pg-accent)"}`}>
                        <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border font-mono text-xs ${selected ? "border-(--pg-accent) bg-(--pg-accent) text-(--pg-accent-ink)" : "border-(--pg-border) text-(--pg-muted)"}`}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        {option}
                      </button>
                    );
                  })}
                </div>

              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-(--pg-border) pt-5">

                <button type="button" disabled={current === 0} onClick={() => setCurrent((value) => Math.max(0, value - 1))} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-xs font-medium text-(--pg-muted) disabled:opacity-40 hover:bg-(--pg-soft)">
                  <ArrowLeft size={13} aria-hidden="true" /> Previous
                </button>
                <div className="flex flex-wrap gap-1.5" aria-label="Question navigation">
                  {questions.map((item, index) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCurrent(index)}
                      aria-label={`Question ${index + 1}${answers[item.id] !== undefined ? ", answered" : ""}`}
                      className={`grid h-8 w-8 place-items-center rounded-lg text-[11px] font-semibold ${current === index ? "bg-(--pg-accent) text-(--pg-accent-ink)" : answers[item.id] !== undefined ? "bg-(--pg-success-bg) text-(--pg-success)" : "bg-(--pg-soft) text-(--pg-muted)"}`}>
                      {index + 1}
                    </button>
                  ))}
                </div>
                {current < questions.length - 1 ? (
                  <button type="button" onClick={() => setCurrent((value) => Math.min(questions.length - 1, value + 1))} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-(--pg-accent) px-4 text-xs font-semibold text-(--pg-accent-ink)">
                    Next <ArrowRight size={13} aria-hidden="true" />
                  </button>
                ) : (
                  <button type="button" disabled={answered !== questions.length} onClick={() => setSubmitted(true)} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-(--pg-accent) px-4 text-xs font-semibold text-(--pg-accent-ink) disabled:cursor-not-allowed disabled:opacity-45">
                    <CheckCircle2 size={14} aria-hidden="true" /> Submit test
                  </button>
                )}
              </div>
              {current === questions.length - 1 && answered !== questions.length && (
                <p className="mt-3 text-right text-xs text-(--pg-muted)">Answer all 10 questions before submitting.</p>
              )}
            </>
          ) : (
            <div className="py-7">

              <div className="rounded-2xl bg-(--pg-accent-soft) p-6 sm:p-8">

                <div className="flex items-start gap-4">

                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-(--pg-accent) text-(--pg-accent-ink)">
                    <Trophy size={23} aria-hidden="true" />
                  </div>
                  <div>

                    <p className="text-xs font-semibold uppercase tracking-widest text-(--pg-accent)">Theory score</p>
                    <h2 className="mt-1 text-4xl font-semibold tracking-tight">{score}/10 <span className="text-xl text-(--pg-muted)">· {percentage}%</span></h2>
                    <p className="mt-2 text-sm leading-6 text-(--pg-muted)">
                      {percentage >= 80 ? "Strong result. Review any missed explanations and try a fresh set." : percentage >= 60 ? "Good progress. Review the missed questions, then try another random set." : "Use the explanations below to spot the gaps, then take a fresh 10-question test."}
                    </p>

                  </div>

                </div>

              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {(["Easy", "Medium", "Hard"] as const).map((difficulty) => {
                  const group = difficultyScore(difficulty);
                  return (
                    <div key={difficulty} className="rounded-xl border border-(--pg-border) bg-(--pg-soft) p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-(--pg-muted)">{difficulty}</p>
                      <p className="mt-2 text-2xl font-semibold">{group.correct}/{group.total}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 space-y-3">
                {questions.map((item, index) => {
                  const selected = answers[item.id];
                  const correct = selected === item.answer;
                  return (
                    <article key={item.id} className="rounded-xl border border-(--pg-border) bg-(--pg-soft) p-4">

                      <div className="flex gap-3">

                        {correct ? <Check size={16} className="mt-0.5 shrink-0 text-(--pg-success)" aria-hidden="true" /> : <X size={16} className="mt-0.5 shrink-0 text-(--pg-error)" aria-hidden="true" />}
                        <div className="min-w-0">

                          <p className="text-sm font-semibold">{index + 1}. {item.prompt}</p>
                          <p className="mt-1 text-xs leading-5 text-(--pg-muted)">
                            Your answer: <strong className="text-(--pg-fg)">{item.options[selected]}</strong>
                            {!correct && <> · Correct: <strong className="text-(--pg-success)">{item.options[item.answer]}</strong></>}
                          </p>
                          <p className="mt-2 text-xs leading-5 text-(--pg-muted)">{item.explanation}</p>

                        </div>

                      </div>

                    </article>
                  );
                })}
              </div>

              <button type="button" onClick={startNewQuiz} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-(--pg-accent) px-5 text-xs font-semibold text-(--pg-accent-ink)">
                <RotateCcw size={14} aria-hidden="true" /> Try another random 10

              </button>

            </div>
          )}
        </div>

        <aside className="rounded-2xl border border-(--pg-border) bg-(--pg-panel) p-5 lg:sticky lg:top-28">

          <div className="flex items-center gap-2">

            <CircleHelp size={17} className="text-(--pg-accent)" aria-hidden="true" />
            <h2 className="text-sm font-semibold">How this test works</h2>

          </div>
          <ul className="mt-4 space-y-3 text-xs leading-5 text-(--pg-muted)">

            <li>• The theory bank contains {THEORY_QUESTIONS.length} multiple-choice questions.</li>
            <li>• Every session randomly selects 10 and mixes easy, medium, and hard questions.</li>
            <li>• Your score is calculated only after all 10 answers are submitted.</li>
            <li>• A new test reshuffles both questions and answer positions.</li>

          </ul>
          <div className="mt-5 rounded-xl bg-(--pg-accent-soft) p-4">

            <div className="flex items-center gap-2 text-(--pg-accent)">
              <Sparkles size={14} aria-hidden="true" />
              <span className="text-[10px] font-semibold uppercase tracking-widest">Current test</span>
            </div>
            <p className="mt-2 text-2xl font-semibold">{submitted ? `${percentage}%` : `${answered}/10`}</p>
            <p className="mt-1 text-xs text-(--pg-muted)">{submitted ? "final score" : "questions answered"}</p>

          </div>

        </aside>

      </div>

    </section>
  );
}
