import assert from "node:assert/strict";
import test from "node:test";
import { THEORY_QUESTIONS, pickTheoryQuestions } from "../src/lib/theory-questions";

test("theory bank contains 100 unique mixed-difficulty questions", () => {
  assert.ok(THEORY_QUESTIONS.length >= 100);
  assert.equal(new Set(THEORY_QUESTIONS.map((item) => item.id)).size, THEORY_QUESTIONS.length);
  for (const question of THEORY_QUESTIONS) {
    assert.equal(question.options.length, 4);
    assert.ok(question.answer >= 0 && question.answer < 4);
    assert.ok(question.explanation.trim());
  }
});

test("theory test selects 10 unique questions with a 4/3/3 difficulty mix", () => {
  const session = pickTheoryQuestions(10, () => 0.37);
  assert.equal(session.length, 10);
  assert.equal(new Set(session.map((item) => item.id)).size, 10);
  assert.deepEqual(
    ["Easy", "Medium", "Hard"].map((difficulty) => session.filter((item) => item.difficulty === difficulty).length),
    [4, 3, 3],
  );
});
