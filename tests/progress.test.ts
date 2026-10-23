import test from "node:test";
import assert from "node:assert/strict";
import {
  answerKey,
  collectAnswer,
  emptyProgress,
  readProgress,
} from "../src/lib/progress";

test("corrupted or future storage does not crash or introduce unknown challenges", () => {
  assert.deepEqual(readProgress("{broken"), emptyProgress());
  assert.deepEqual(readProgress('{"version":2}'), emptyProgress());
  const state = readProgress(
    JSON.stringify({
      version: 1,
      language: "ruby",
      challengeId: "fake",
      drafts: { "python:sum-two": "print(3)", "python:fake": "bad" },
      answers: [],
    }),
  );
  assert.equal(state.language, "python");
  assert.deepEqual(state.drafts, { "python:sum-two": "print(3)" });
});

test("language drafts and empty edits survive round trips independently", () => {
  const state = emptyProgress();
  state.drafts[answerKey("python", "sum-two")] = "";
  state.drafts[answerKey("javascript", "sum-two")] = "console.log(12)";
  assert.deepEqual(readProgress(JSON.stringify(state)).drafts, state.drafts);
});

test("a failed result never enters the collection and solved pairs replace only themselves", () => {
  const base = emptyProgress();
  const answer = {
    language: "python" as const,
    challengeId: "sum-two",
    sourceCode: "print(a+b)",
    savedAt: new Date(0).toISOString(),
    passed: 4,
    total: 4,
    guided: false,
  };
  assert.equal(collectAnswer(base, { ...answer, passed: 3 }).answers.length, 0);
  const first = collectAnswer(base, answer);
  const second = collectAnswer(first, {
    ...answer,
    language: "javascript",
    sourceCode: "console.log(a+b)",
  });
  const third = collectAnswer(second, {
    ...answer,
    sourceCode: "print(b+a)",
    guided: true,
  });
  assert.equal(third.answers.length, 2);
  assert.equal(
    third.answers.find((a) => a.language === "python")?.guided,
    true,
  );
  assert.equal(
    third.answers.find((a) => a.language === "javascript")?.sourceCode,
    "console.log(a+b)",
  );
});

test("revealing a solution is persisted but does not mark an exercise solved", () => {
  const state = emptyProgress();
  state.revealed = ["python:sum-two"];
  const restored = readProgress(JSON.stringify(state));
  assert.deepEqual(restored.revealed, ["python:sum-two"]);
  assert.deepEqual(restored.answers, []);
});
