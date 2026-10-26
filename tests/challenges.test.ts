import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import {
  closeSync,
  mkdtempSync,
  openSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { CHALLENGES, LANGUAGES, pickPracticeChallenges, type LanguageId } from "../src/lib/challenges";

const availability: Record<LanguageId, boolean> = {
  python: spawnSync("python3", ["--version"]).status === 0,
  javascript: true,
  c: spawnSync("gcc", ["--version"]).status === 0,
  cpp: spawnSync("g++", ["--version"]).status === 0,
  java:
    spawnSync("java", ["com.sun.tools.javac.Main", "-version"]).status === 0,
};

function prepareProgram(language: LanguageId, source: string) {
  const directory = mkdtempSync(join(tmpdir(), "detour-reference-"));
  const metadata = LANGUAGES.find((item) => item.id === language)!;
  const sourceFile = join(directory, metadata.filename);
  writeFileSync(sourceFile, source, "utf8");

  let command: string;
  let args: string[];
  try {
    switch (language) {
      case "python":
        command = "python3";
        args = [sourceFile];
        break;
      case "javascript":
        command = process.execPath;
        args = [sourceFile];
        break;
      case "java":
        execFileSync(
          "java",
          ["com.sun.tools.javac.Main", "-d", directory, sourceFile],
          {
            timeout: 20_000,
            maxBuffer: 65_536,
            stdio: ["ignore", "pipe", "pipe"],
          },
        );
        command = "java";
        args = ["-cp", directory, "Main"];
        break;
      case "c":
      case "cpp":
        command = join(directory, "program");
        args = [];
        execFileSync(
          language === "c" ? "gcc" : "g++",
          [
            language === "c" ? "-std=c17" : "-std=c++17",
            "-O2",
            "-Wall",
            "-Wextra",
            "-pedantic",
            sourceFile,
            "-o",
            command,
          ],
          {
            timeout: 20_000,
            maxBuffer: 65_536,
            stdio: ["ignore", "pipe", "pipe"],
          },
        );
        break;
    }
  } catch (error) {
    rmSync(directory, { recursive: true, force: true });
    throw error;
  }

  return {
    run(input: string): string {

      const inputFile = join(directory, "stdin.txt");
      const outputFile = join(directory, "stdout.txt");
      const errorFile = join(directory, "stderr.txt");
      writeFileSync(inputFile, input, "utf8");
      const descriptors: number[] = [];
      try {
        descriptors.push(openSync(inputFile, "r"));
        descriptors.push(openSync(outputFile, "w"));
        descriptors.push(openSync(errorFile, "w"));
        execFileSync(command, args, {
          stdio: descriptors,
          timeout: 5_000,
        });
        const output = readFileSync(outputFile, "utf8");
        assert.ok(
          Buffer.byteLength(output, "utf8") <= 65_536,
          "Reference output exceeded its limit",
        );
        return output.replace(/\r\n/g, "\n").trimEnd();
      } catch (error) {
        if (error instanceof Error && descriptors.length === 3) {
          const diagnostics = readFileSync(errorFile, "utf8")
            .slice(0, 65_536)
            .trim();
          if (diagnostics) error.message += `\n${diagnostics}`;
        }
        throw error;
      } finally {
        descriptors.forEach(closeSync);
      }
    },
    dispose() {
      rmSync(directory, { recursive: true, force: true });
    },
  };
}

test("every listed language has complete exercise materials", () => {
  assert.equal(new Set(LANGUAGES.map((item) => item.id)).size, 5);
  assert.ok(CHALLENGES.length >= 100, "practice bank should contain at least 100 questions");
  assert.equal(
    new Set(CHALLENGES.map((item) => item.id)).size,
    CHALLENGES.length,
  );
  const session = pickPracticeChallenges(10, undefined, () => 0.42);
  assert.equal(session.length, 10);
  assert.equal(new Set(session.map((item) => item.id)).size, 10);
  assert.deepEqual(
    ["Easy", "Medium", "Hard"].map((difficulty) => session.filter((item) => item.difficulty === difficulty).length),
    [4, 3, 3],
  );
  for (const challenge of CHALLENGES) {
    assert.equal(
      new Set(challenge.tests.map((item) => item.id)).size,
      challenge.tests.length,
    );
    assert.ok(challenge.tests.length >= 4);
    assert.ok(
      challenge.prompt && challenge.inputFormat && challenge.outputFormat,
    );
    for (const language of LANGUAGES) {
      assert.ok(challenge.starter[language.id].includes("TODO"));
      assert.ok(challenge.solution[language.id].trim());
    }
  }
});

for (const language of LANGUAGES) {
  test(
    `${language.label} references pass all published cases; starters remain exercises`,
    {
      skip: availability[language.id]
        ? false
        : `${language.label} toolchain is unavailable`,
    },
    () => {
      const executionSample = CHALLENGES.filter(
        (_challenge, index) => index < 6 || (index - 6) % 10 === 0 || (index - 6) % 10 === 9,
      );
      for (const challenge of executionSample) {
        const reference = prepareProgram(
          language.id,
          challenge.solution[language.id],
        );
        try {
          for (const fixture of challenge.tests) {
            assert.equal(
              reference.run(fixture.input),
              fixture.expected,
              `${language.label}: ${challenge.id}/${fixture.id}`,
            );
          }
        } finally {
          reference.dispose();
        }

        const starter = prepareProgram(
          language.id,
          challenge.starter[language.id],
        );
        try {
          const passing = challenge.tests.filter(
            (fixture) => starter.run(fixture.input) === fixture.expected,
          );
          assert.ok(
            passing.length < challenge.tests.length,
            `${language.label}: ${challenge.id} starter must not already solve the task`,
          );
        } finally {
          starter.dispose();
        }
      }
    },
  );
}
