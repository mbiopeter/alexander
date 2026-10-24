import test from "node:test";
import assert from "node:assert/strict";
import {
  answerKey,
  collectAnswer,
  emptyProgress,
  readProgress,
  MAX_BACKUP_BYTES,
  MAX_SOURCE_CHARS,
  isDraftWithinLimit,
  parsePracticeBackup,
  restorePractice,
  selectionFromSearch,
  serializePracticeBackup,
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

test("full backups preserve empty drafts, selection, guidance, answers, and answer ordering", () => {
  const state = emptyProgress();
  state.language = "javascript";
  state.challengeId = "palindrome";
  state.drafts = { "python:sum-two": "", "javascript:palindrome": "console.log('YES');" };
  state.revealed = ["python:sum-two"];
  state.answers = ["python", "javascript"].map((language, i) => ({
    language: language as "python" | "javascript",
    challengeId: "sum-two",
    sourceCode: i === 0 ? "print(12)" : "console.log(12)",
    savedAt: new Date(i).toISOString(),
    passed: 4,
    total: 4,
    guided: i === 0,
  }));
  assert.deepEqual(parsePracticeBackup(serializePracticeBackup(state)).progress, state);
  assert.deepEqual(readProgress(JSON.stringify(state)), state);
});

test("backup import rejects malformed, unknown, duplicated, and oversized data without returning partial state", () => {
  const base = JSON.parse(serializePracticeBackup(emptyProgress()));
  assert.throws(() => parsePracticeBackup("{broken"), /valid JSON/);
  assert.throws(() => parsePracticeBackup('{"version":1,"answers":[]}'), /full Alexender practice backup/);
  assert.throws(() => parsePracticeBackup(" ".repeat(MAX_BACKUP_BYTES + 1)), /8 MB/);
  for (const progress of [
    { ...base.progress, language: "ruby" },
    { ...base.progress, challengeId: "unknown" },
    { ...base.progress, drafts: { "python:fake": "print(1)" } },
    { ...base.progress, drafts: { "python:sum-two": "x".repeat(32_769) } },
    { ...base.progress, drafts: { "__proto__": "oops" }, revealed: ["unknown:sum-two"] },
    { ...base.progress, revealed: ["python:sum-two", "python:sum-two"] },
    { ...base.progress, answers: [{ language: "python", challengeId: "sum-two", sourceCode: "print(1)", passed: 1, total: 4, savedAt: new Date(0).toISOString(), guided: false }] },
  ]) {
    assert.throws(() => parsePracticeBackup(JSON.stringify({ ...base, progress })));
  }
});

test("merge preserves this browser's conflicting work while replacement restores only the selected backup", () => {
  const current = emptyProgress();
  current.language = "java";
  current.challengeId = "palindrome";
  current.drafts = { "python:sum-two": "my current work", "java:palindrome": "" };
  const incoming = emptyProgress();
  incoming.drafts = { "python:sum-two": "older work", "javascript:sum-two": "new imported draft" };
  incoming.revealed = ["javascript:sum-two"];
  const merged = restorePractice(current, incoming, "merge");
  assert.equal(merged.language, "java");
  assert.equal(merged.challengeId, "palindrome");
  assert.deepEqual(merged.drafts, {
    "python:sum-two": "my current work",
    "java:palindrome": "",
    "javascript:sum-two": "new imported draft",
  });
  assert.deepEqual(merged.revealed, ["javascript:sum-two"]);
  assert.deepEqual(restorePractice(current, incoming, "replace"), incoming);
  assert.equal(current.drafts["python:sum-two"], "my current work");
  assert.equal(incoming.drafts["python:sum-two"], "older work");
});

test("practice links accept known language/challenge IDs independently and ignore arbitrary input", () => {
  assert.deepEqual(selectionFromSearch("?language=javascript&challenge=palindrome"), { language: "javascript", challengeId: "palindrome" });
  assert.deepEqual(selectionFromSearch("?language=ruby&challenge=sum-two"), { challengeId: "sum-two" });
  assert.deepEqual(selectionFromSearch("?language=python&challenge=unknown"), { language: "python" });
  assert.deepEqual(selectionFromSearch("?language=javascript%3Aalert(1)&challenge=__proto__"), {});
});

test("every accepted boundary draft survives browser storage and a full backup without truncation", () => {
  for (const source of ["", "x".repeat(MAX_SOURCE_CHARS), "😀".repeat(MAX_SOURCE_CHARS / 2)]) {
    assert.equal(isDraftWithinLimit(source), true);
    const state = emptyProgress();
    state.drafts["python:sum-two"] = source;
    assert.equal(readProgress(JSON.stringify(state)).drafts["python:sum-two"], source);
    assert.equal(parsePracticeBackup(serializePracticeBackup(state)).progress.drafts["python:sum-two"], source);
    assert.equal(isDraftWithinLimit(source.padEnd(MAX_SOURCE_CHARS + 1, "x")), false);
  }
  const accepted = "my existing work";
  const attempted = "x".repeat(MAX_SOURCE_CHARS + 1);
  const next = isDraftWithinLimit(attempted) ? attempted : accepted;
  assert.equal(next, accepted);
});
