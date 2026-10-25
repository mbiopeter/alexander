export type LanguageId = "python" | "javascript" | "java" | "c" | "cpp";

export interface LanguageOption {
  id: LanguageId;
  label: string;
  editorLanguage: string;
  filename: string;
}

export interface TestCase {
  id: string;
  label: string;
  input: string;
  expected: string;
}

export interface Challenge {
  id: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  summary: string;
  prompt: string;
  inputFormat: string;
  outputFormat: string;
  constraints: string[];
  hints: string[];
  explanation: string;
  tests: TestCase[];
  starter: Record<LanguageId, string>;
  solution: Record<LanguageId, string>;
}

export const LANGUAGES: readonly LanguageOption[] = [
  {
    id: "python",
    label: "Python",
    editorLanguage: "python",
    filename: "main.py",
  },
  {
    id: "javascript",
    label: "JavaScript",
    editorLanguage: "javascript",
    filename: "main.js",
  },
  {
    id: "java",
    label: "Java",
    editorLanguage: "java",
    filename: "Main.java",
  },
  {
    id: "c",
    label: "C",
    editorLanguage: "c",
    filename: "main.c",
  },
  {
    id: "cpp",
    label: "C++",
    editorLanguage: "cpp",
    filename: "main.cpp",
  },
];

function indent(body: string, spaces: number): string {
  return body
    .trim()
    .split("\n")
    .map((line) => " ".repeat(spaces) + line)
    .join("\n");
}

function python(body: string): string {
  return `import sys\n\nraw = sys.stdin.read()\n\n${body.trim()}\n`;
}

function javascript(body: string): string {
  return `const fs = require("fs");\nconst raw = fs.readFileSync(0, "utf8");\n\n${body.trim()}\n`;
}

function java(body: string): string {
  return `import java.util.*;

public class Main {
    public static void main(String[] args) {
        Scanner input = new Scanner(System.in);
${indent(body, 8)}
    }
}
`;
}

function c(body: string): string {
  return `#include <stdio.h>
#include <string.h>
#include <ctype.h>

int main(void) {
${indent(body, 4)}
    return 0;
}
`;
}

function cpp(body: string): string {
  return `#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <cctype>
using namespace std;

int main() {
${indent(body, 4)}
    return 0;
}
`;
}

const BASE_CHALLENGES: readonly Challenge[] = [
  {
    id: "sum-two",
    title: "A warm-up: add two numbers",
    difficulty: "Easy",
    summary: "Read two integers and print their sum.",
    prompt:
      "Two integers arrive on standard input. Add them and print the result. Print only the number, without a label or an input prompt.",
    inputFormat: "One line containing two space-separated integers, a and b.",
    outputFormat: "One integer: a + b.",
    constraints: ["−1,000,000 ≤ a, b ≤ 1,000,000"],
    hints: [
      "The starter already reads the two numbers.",
      "Replace the placeholder output with the sum of a and b.",
    ],
    explanation:
      "Read both integers, add them, and print the result. This takes constant time and constant extra space.",
    tests: [
      {
        id: "sample",
        label: "Two positive numbers",
        input: "5 7\n",
        expected: "12",
      },
      {
        id: "negative",
        label: "Mixed signs",
        input: "-8 3\n",
        expected: "-5",
      },
      {
        id: "zero",
        label: "Both zero",
        input: "0 0\n",
        expected: "0",
      },
      {
        id: "limits",
        label: "Opposite limits",
        input: "1000000 -1000000\n",
        expected: "0",
      },
    ],
    starter: {
      python: python(
        `a, b = map(int, raw.split())\n# TODO: print the sum of a and b.\nprint(0)`,
      ),
      javascript: javascript(
        `const [a, b] = raw.trim().split(/\\s+/).map(Number);\n// TODO: print the sum of a and b.\nconsole.log(0);`,
      ),
      java: java(
        `int a = input.nextInt();\nint b = input.nextInt();\n// TODO: print the sum of a and b.\nSystem.out.println(0);`,
      ),
      c: c(
        `int a, b;\nif (scanf("%d %d", &a, &b) != 2) return 0;\n// TODO: print the sum of a and b.\nprintf("0\\n");`,
      ),
      cpp: cpp(
        `int a, b;\ncin >> a >> b;\n// TODO: print the sum of a and b.\ncout << 0 << '\\n';`,
      ),
    },
    solution: {
      python: python(`a, b = map(int, raw.split())\nprint(a + b)`),
      javascript: javascript(
        `const [a, b] = raw.trim().split(/\\s+/).map(Number);\nconsole.log(a + b);`,
      ),
      java: java(
        `int a = input.nextInt();\nint b = input.nextInt();\nSystem.out.println(a + b);`,
      ),
      c: c(
        `int a, b;\nif (scanf("%d %d", &a, &b) != 2) return 0;\nprintf("%d\\n", a + b);`,
      ),
      cpp: cpp(`int a, b;\ncin >> a >> b;\ncout << a + b << '\\n';`),
    },
  },
  {
    id: "palindrome",
    title: "Mirror, mirror",
    difficulty: "Easy",
    summary: "Check whether a word reads the same backwards.",
    prompt:
      "Print true if the input word is a palindrome, otherwise print false. An empty string and a single letter both count as palindromes. The line ending is not part of the word.",
    inputFormat: "One line of lowercase English letters. The line may be empty.",
    outputFormat: "Exactly true or false, in lowercase.",
    constraints: [
      "0 ≤ word length ≤ 200",
      "Only the letters a–z appear in the word.",
    ],
    hints: [
      "Compare the first letter with the last, then move towards the middle.",
      "If any mirrored pair differs, the word is not a palindrome.",
    ],
    explanation:
      "Compare mirrored characters, stopping at the first mismatch. A two-pointer solution takes linear time and constant extra space. Reversing a copy is another straightforward solution.",
    tests: [
      {
        id: "sample",
        label: "A familiar palindrome",
        input: "racecar\n",
        expected: "true",
      },
      {
        id: "mismatch",
        label: "An inner mismatch",
        input: "abca\n",
        expected: "false",
      },
      {
        id: "empty",
        label: "Empty word",
        input: "\n",
        expected: "true",
      },
      {
        id: "single",
        label: "One letter",
        input: "z\n",
        expected: "true",
      },
    ],
    starter: {
      python: python(
        `word = raw.rstrip("\\r\\n")\n# TODO: check whether word is a palindrome.\nprint("false")`,
      ),
      javascript: javascript(
        `const word = raw.replace(/[\\r\\n]+$/, "");\n// TODO: check whether word is a palindrome.\nconsole.log("false");`,
      ),
      java: java(
        `String word = input.hasNextLine() ? input.nextLine() : "";\n// TODO: check whether word is a palindrome.\nSystem.out.println("false");`,
      ),
      c: c(
        `char word[202] = "";\nif (!fgets(word, sizeof(word), stdin)) word[0] = '\\0';\nword[strcspn(word, "\\r\\n")] = '\\0';\n// TODO: check whether word is a palindrome.\nprintf("false\\n");`,
      ),
      cpp: cpp(
        `string word;\ngetline(cin, word);\nif (!word.empty() && word.back() == '\\r') word.pop_back();\n// TODO: check whether word is a palindrome.\ncout << "false\\n";`,
      ),
    },
    solution: {
      python: python(
        `word = raw.rstrip("\\r\\n")\nprint("true" if word == word[::-1] else "false")`,
      ),
      javascript: javascript(
        `const word = raw.replace(/[\\r\\n]+$/, "");\nconst reversed = word.split("").reverse().join("");\nconsole.log(word === reversed ? "true" : "false");`,
      ),
      java: java(
        `String word = input.hasNextLine() ? input.nextLine() : "";\nString reversed = new StringBuilder(word).reverse().toString();\nSystem.out.println(word.equals(reversed) ? "true" : "false");`,
      ),
      c: c(
        `char word[202] = "";
if (!fgets(word, sizeof(word), stdin)) word[0] = '\\0';
word[strcspn(word, "\\r\\n")] = '\\0';

int length = (int)strlen(word);
int palindrome = 1;

for (int i = 0; i < length / 2; i++) {
    if (word[i] != word[length - 1 - i]) {
        palindrome = 0;
        break;
    }
}

printf("%s\\n", palindrome ? "true" : "false");`,
      ),
      cpp: cpp(
        `string word;
getline(cin, word);
if (!word.empty() && word.back() == '\\r') word.pop_back();

string reversed = word;
reverse(reversed.begin(), reversed.end());

cout << (word == reversed ? "true" : "false") << '\\n';`,
      ),
    },
  },
  {
    id: "count-vowels",
    title: "Find your vowels",
    difficulty: "Easy",
    summary: "Count vowels without being distracted by case or punctuation.",
    prompt:
      "Count every occurrence of a, e, i, o, and u in the input line. Uppercase vowels count too. Ignore consonants, spaces, numbers, and punctuation. The letter y is not a vowel for this task.",
    inputFormat: "One line of ASCII text. The line may be empty.",
    outputFormat: "One integer: the number of vowels.",
    constraints: [
      "0 ≤ line length ≤ 200",
      "Input contains printable ASCII characters and a line ending.",
    ],
    hints: [
      "Convert each character to lowercase before checking it.",
      "Increase a counter whenever a character belongs to aeiou.",
    ],
    explanation:
      "Scan the text once and count characters in the vowel set after converting them to lowercase. This takes linear time and constant extra space.",
    tests: [
      {
        id: "sample",
        label: "A short greeting",
        input: "Hello, World!\n",
        expected: "3",
      },
      {
        id: "mixed-case",
        label: "Mixed-case vowels",
        input: "AEIOU aeIou\n",
        expected: "10",
      },
      {
        id: "none",
        label: "No vowels",
        input: "rhythm 123!\n",
        expected: "0",
      },
      {
        id: "empty",
        label: "Empty line",
        input: "\n",
        expected: "0",
      },
    ],
    starter: {
      python: python(
        `text = raw.rstrip("\\r\\n")\n# TODO: count the vowels in text.\nprint(0)`,
      ),
      javascript: javascript(
        `const text = raw.replace(/[\\r\\n]+$/, "");\n// TODO: count the vowels in text.\nconsole.log(0);`,
      ),
      java: java(
        `String text = input.hasNextLine() ? input.nextLine() : "";\n// TODO: count the vowels in text.\nSystem.out.println(0);`,
      ),
      c: c(
        `char text[202] = "";\nif (!fgets(text, sizeof(text), stdin)) text[0] = '\\0';\n// TODO: count the vowels in text.\nprintf("0\\n");`,
      ),
      cpp: cpp(
        `string text;\ngetline(cin, text);\n// TODO: count the vowels in text.\ncout << 0 << '\\n';`,
      ),
    },
    solution: {
      python: python(
        `text = raw.rstrip("\\r\\n")\ncount = sum(1 for character in text.lower() if character in "aeiou")\nprint(count)`,
      ),
      javascript: javascript(
        `const text = raw.replace(/[\\r\\n]+$/, "");
let count = 0;

for (const character of text.toLowerCase()) {
  if ("aeiou".includes(character)) count++;
}

console.log(count);`,
      ),
      java: java(
        `String text = input.hasNextLine() ? input.nextLine() : "";
int count = 0;

for (char character : text.toLowerCase(Locale.ROOT).toCharArray()) {
    if ("aeiou".indexOf(character) >= 0) count++;
}

System.out.println(count);`,
      ),
      c: c(
        `char text[202] = "";
if (!fgets(text, sizeof(text), stdin)) text[0] = '\\0';

int count = 0;

for (int i = 0; text[i] != '\\0'; i++) {
    char character = (char)tolower((unsigned char)text[i]);
    if (strchr("aeiou", character) != NULL) count++;
}

printf("%d\\n", count);`,
      ),
      cpp: cpp(
        `string text;
getline(cin, text);

int count = 0;
const string vowels = "aeiou";

for (unsigned char character : text) {
    char lower = static_cast<char>(tolower(character));
    if (vowels.find(lower) != string::npos) count++;
}

cout << count << '\\n';`,
      ),
    },
  },
  {
    id: "maximum-array",
    title: "The biggest number wins",
    difficulty: "Easy",
    summary: "Find the largest number, even when every number is negative.",
    prompt:
      "Read a non-empty list of integers and print its maximum value. A maximum can be negative, and the largest value can appear more than once.",
    inputFormat:
      "The first line contains n. The second line contains n space-separated integers.",
    outputFormat: "One integer: the maximum value in the list.",
    constraints: [
      "1 ≤ n ≤ 100",
      "Each value is between −1,000,000 and 1,000,000.",
    ],
    hints: [
      "Start with the first element as your current maximum.",
      "Starting at zero fails when every number is negative.",
    ],
    explanation:
      "Start with the first value and keep the largest value seen while scanning the rest. This takes linear time.",
    tests: [
      {
        id: "sample",
        label: "Mixed order",
        input: "5\n3 9 2 7 4\n",
        expected: "9",
      },
      {
        id: "negative",
        label: "All negative",
        input: "4\n-8 -3 -12 -5\n",
        expected: "-3",
      },
      {
        id: "single",
        label: "One number",
        input: "1\n-42\n",
        expected: "-42",
      },
      {
        id: "repeated",
        label: "Repeated maximum",
        input: "5\n7 7 7 -2 7\n",
        expected: "7",
      },
    ],
    starter: {
      python: python(
        `tokens = list(map(int, raw.split()))\nn = tokens[0]\nvalues = tokens[1:1 + n]\n# TODO: print the largest value.\nprint(0)`,
      ),
      javascript: javascript(
        `const tokens = raw.trim().split(/\\s+/).map(Number);\nconst n = tokens[0];\nconst values = tokens.slice(1, 1 + n);\n// TODO: print the largest value.\nconsole.log(0);`,
      ),
      java: java(
        `int n = input.nextInt();\nint[] values = new int[n];\nfor (int i = 0; i < n; i++) values[i] = input.nextInt();\n// TODO: print the largest value.\nSystem.out.println(0);`,
      ),
      c: c(
        `int n;\nif (scanf("%d", &n) != 1) return 0;\nint values[100];\nfor (int i = 0; i < n; i++) {\n    if (scanf("%d", &values[i]) != 1) return 0;\n}\n// TODO: print the largest value.\nprintf("0\\n");`,
      ),
      cpp: cpp(
        `int n;\ncin >> n;\nvector<int> values(n);\nfor (int &value : values) cin >> value;\n// TODO: print the largest value.\ncout << 0 << '\\n';`,
      ),
    },
    solution: {
      python: python(
        `tokens = list(map(int, raw.split()))\nn = tokens[0]\nvalues = tokens[1:1 + n]\nprint(max(values))`,
      ),
      javascript: javascript(
        `const tokens = raw.trim().split(/\\s+/).map(Number);
const n = tokens[0];
const values = tokens.slice(1, 1 + n);

let maximum = values[0];

for (const value of values) {
  if (value > maximum) maximum = value;
}

console.log(maximum);`,
      ),
      java: java(
        `int n = input.nextInt();
int maximum = input.nextInt();

for (int i = 1; i < n; i++) {
    maximum = Math.max(maximum, input.nextInt());
}

System.out.println(maximum);`,
      ),
      c: c(
        `int n, maximum;
if (scanf("%d", &n) != 1) return 0;
if (scanf("%d", &maximum) != 1) return 0;

for (int i = 1; i < n; i++) {
    int value;
    if (scanf("%d", &value) != 1) return 0;
    if (value > maximum) maximum = value;
}

printf("%d\\n", maximum);`,
      ),
      cpp: cpp(
        `int n;
cin >> n;

int maximum;
cin >> maximum;

for (int i = 1; i < n; i++) {
    int value;
    cin >> value;
    maximum = max(maximum, value);
}

cout << maximum << '\\n';`,
      ),
    },
  },
  {
    id: "fizzbuzz",
    title: "A tiny FizzBuzz detour",
    difficulty: "Medium",
    summary: "Combine two divisibility rules in the right order.",
    prompt:
      "Print the numbers from 1 through n, one per line. Replace multiples of 3 with Fizz, multiples of 5 with Buzz, and multiples of both with FizzBuzz.",
    inputFormat: "One integer n.",
    outputFormat:
      "Exactly n lines, following the FizzBuzz rules. Match the capitalization.",
    constraints: ["1 ≤ n ≤ 30"],
    hints: [
      "Use the remainder operator to check divisibility.",
      "Check the combined case before checking 3 or 5 separately.",
    ],
    explanation:
      "Visit every number from 1 to n. Check divisibility by 15 first, followed by 3 and 5. This takes linear time.",
    tests: [
      {
        id: "sample",
        label: "First five lines",
        input: "5\n",
        expected: "1\n2\nFizz\n4\nBuzz",
      },
      {
        id: "single",
        label: "Smallest input",
        input: "1\n",
        expected: "1",
      },
      {
        id: "combined",
        label: "First FizzBuzz",
        input: "15\n",
        expected:
          "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz",
      },
      {
        id: "after-combined",
        label: "Continue after FizzBuzz",
        input: "16\n",
        expected:
          "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n16",
      },
    ],
    starter: {
      python: python(
        `n = int(raw.strip())\n# TODO: print the FizzBuzz sequence.\nprint(0)`,
      ),
      javascript: javascript(
        `const n = Number(raw.trim());\n// TODO: print the FizzBuzz sequence.\nconsole.log(0);`,
      ),
      java: java(
        `int n = input.nextInt();\n// TODO: print the FizzBuzz sequence.\nSystem.out.println(0);`,
      ),
      c: c(
        `int n;\nif (scanf("%d", &n) != 1) return 0;\n// TODO: print the FizzBuzz sequence.\nprintf("0\\n");`,
      ),
      cpp: cpp(
        `int n;\ncin >> n;\n// TODO: print the FizzBuzz sequence.\ncout << 0 << '\\n';`,
      ),
    },
    solution: {
      python: python(
        `n = int(raw.strip())

for number in range(1, n + 1):
    if number % 15 == 0:
        print("FizzBuzz")
    elif number % 3 == 0:
        print("Fizz")
    elif number % 5 == 0:
        print("Buzz")
    else:
        print(number)`,
      ),
      javascript: javascript(
        `const n = Number(raw.trim());

for (let number = 1; number <= n; number++) {
  if (number % 15 === 0) console.log("FizzBuzz");
  else if (number % 3 === 0) console.log("Fizz");
  else if (number % 5 === 0) console.log("Buzz");
  else console.log(number);
}`,
      ),
      java: java(
        `int n = input.nextInt();

for (int number = 1; number <= n; number++) {
    if (number % 15 == 0) System.out.println("FizzBuzz");
    else if (number % 3 == 0) System.out.println("Fizz");
    else if (number % 5 == 0) System.out.println("Buzz");
    else System.out.println(number);
}`,
      ),
      c: c(
        `int n;
if (scanf("%d", &n) != 1) return 0;

for (int number = 1; number <= n; number++) {
    if (number % 15 == 0) printf("FizzBuzz\\n");
    else if (number % 3 == 0) printf("Fizz\\n");
    else if (number % 5 == 0) printf("Buzz\\n");
    else printf("%d\\n", number);
}`,
      ),
      cpp: cpp(
        `int n;
cin >> n;

for (int number = 1; number <= n; number++) {
    if (number % 15 == 0) cout << "FizzBuzz\\n";
    else if (number % 3 == 0) cout << "Fizz\\n";
    else if (number % 5 == 0) cout << "Buzz\\n";
    else cout << number << '\\n';
}`,
      ),
    },
  },
  {
    id: "factorial",
    title: "Multiply your way home",
    difficulty: "Easy",
    summary: "Build a factorial and handle zero correctly.",
    prompt:
      "The factorial n! is the product of all integers from 1 to n. By definition, 0! = 1. Read n and print n! as an integer.",
    inputFormat: "One non-negative integer n.",
    outputFormat: "One integer: n factorial.",
    constraints: [
      "0 ≤ n ≤ 12",
      "Every expected answer fits in a signed 32-bit integer.",
    ],
    hints: [
      "Start your running product at 1.",
      "Multiply by the integers from 2 through n.",
    ],
    explanation:
      "Initialize the product to 1. Multiply by each integer from 2 through n. For 0 and 1, the loop does not run and the result remains 1.",
    tests: [
      {
        id: "sample",
        label: "Five factorial",
        input: "5\n",
        expected: "120",
      },
      {
        id: "zero",
        label: "Zero factorial",
        input: "0\n",
        expected: "1",
      },
      {
        id: "one",
        label: "One factorial",
        input: "1\n",
        expected: "1",
      },
      {
        id: "limit",
        label: "Largest permitted input",
        input: "12\n",
        expected: "479001600",
      },
    ],
    starter: {
      python: python(
        `n = int(raw.strip())\n# TODO: calculate n factorial.\nprint(0)`,
      ),
      javascript: javascript(
        `const n = Number(raw.trim());\n// TODO: calculate n factorial.\nconsole.log(0);`,
      ),
      java: java(
        `int n = input.nextInt();\n// TODO: calculate n factorial.\nSystem.out.println(0);`,
      ),
      c: c(
        `int n;\nif (scanf("%d", &n) != 1) return 0;\n// TODO: calculate n factorial.\nprintf("0\\n");`,
      ),
      cpp: cpp(
        `int n;\ncin >> n;\n// TODO: calculate n factorial.\ncout << 0 << '\\n';`,
      ),
    },
    solution: {
      python: python(
        `n = int(raw.strip())\nresult = 1\nfor number in range(2, n + 1):\n    result *= number\nprint(result)`,
      ),
      javascript: javascript(
        `const n = Number(raw.trim());\nlet result = 1;\nfor (let number = 2; number <= n; number++) {\n  result *= number;\n}\nconsole.log(result);`,
      ),
      java: java(
        `int n = input.nextInt();\nlong result = 1;\nfor (int number = 2; number <= n; number++) {\n    result *= number;\n}\nSystem.out.println(result);`,
      ),
      c: c(
        `int n;\nif (scanf("%d", &n) != 1) return 0;\nlong long result = 1;\nfor (int number = 2; number <= n; number++) {\n    result *= number;\n}\nprintf("%lld\\n", result);`,
      ),
      cpp: cpp(
        `int n;\ncin >> n;\nlong long result = 1;\nfor (int number = 2; number <= n; number++) {\n    result *= number;\n}\ncout << result << '\\n';`,
      ),
    },
  },
];


function generatedTests(values: Array<[string, string, string]>): TestCase[] {
  return values.map(([id, input, expected], index) => ({
    id,
    label: `Check ${index + 1}`,
    input,
    expected,
  }));
}

function makeAffineChallenge(index: number): Challenge {
  const factor = 2 + (index % 5);
  const offset = index - 4;
  const transform = (n: number) => n * factor + offset;
  return {
    id: `affine-${index + 1}`,
    title: `Number transformer ${index + 1}`,
    difficulty: "Easy",
    summary: `Apply ×${factor} and then ${offset >= 0 ? "+" : "−"}${Math.abs(offset)}.`,
    prompt: `Read one integer n. Multiply it by ${factor}, then ${offset >= 0 ? "add" : "subtract"} ${Math.abs(offset)}, and print the result.`,
    inputFormat: "One integer n.",
    outputFormat: "One integer: the transformed value.",
    constraints: ["−1,000 ≤ n ≤ 1,000"],
    hints: ["Read n first.", "Apply multiplication before the final offset."],
    explanation: `Compute n × ${factor} ${offset >= 0 ? "+" : "−"} ${Math.abs(offset)} directly.`,
    tests: generatedTests([
      ["positive", "7\n", String(transform(7))],
      ["zero", "0\n", String(transform(0))],
      ["negative", "-6\n", String(transform(-6))],
      ["larger", "123\n", String(transform(123))],
    ]),
    starter: {
      python: python(`n = int(raw.strip())\n# TODO: apply the requested transformation.\nprint(0)`),
      javascript: javascript(`const n = Number(raw.trim());\n// TODO: apply the requested transformation.\nconsole.log(0);`),
      java: java(`int n = input.nextInt();\n// TODO: apply the requested transformation.\nSystem.out.println(0);`),
      c: c(`int n;\nif (scanf("%d", &n) != 1) return 0;\n// TODO: apply the requested transformation.\nprintf("0\\n");`),
      cpp: cpp(`int n;\ncin >> n;\n// TODO: apply the requested transformation.\ncout << 0 << '\\n';`),
    },
    solution: {
      python: python(`n = int(raw.strip())\nprint(n * ${factor} + (${offset}))`),
      javascript: javascript(`const n = Number(raw.trim());\nconsole.log(n * ${factor} + (${offset}));`),
      java: java(`int n = input.nextInt();\nSystem.out.println(n * ${factor} + (${offset}));`),
      c: c(`int n;\nif (scanf("%d", &n) != 1) return 0;\nprintf("%d\\n", n * ${factor} + (${offset}));`),
      cpp: cpp(`int n;\ncin >> n;\ncout << n * ${factor} + (${offset}) << '\\n';`),
    },
  };
}

function makeDivisibleChallenge(index: number): Challenge {
  const divisor = index + 2;
  const expected = (n: number) => (n % divisor === 0 ? "yes" : "no");
  return {
    id: `divisible-${divisor}`,
    title: `Divisible by ${divisor}?`,
    difficulty: "Easy",
    summary: `Check whether one integer is divisible by ${divisor}.`,
    prompt: `Read one integer n. Print yes if n is divisible by ${divisor}; otherwise print no. Use lowercase exactly.`,
    inputFormat: "One integer n.",
    outputFormat: "Exactly yes or no.",
    constraints: ["−1,000,000 ≤ n ≤ 1,000,000"],
    hints: ["Use the remainder operator.", `A remainder of zero means divisible by ${divisor}.`],
    explanation: `Check n % ${divisor}. Zero means the division has no remainder.`,
    tests: generatedTests([
      ["multiple", `${divisor * 4}\n`, expected(divisor * 4)],
      ["not-multiple", `${divisor * 4 + 1}\n`, expected(divisor * 4 + 1)],
      ["zero", "0\n", "yes"],
      ["negative", `${-divisor * 3}\n`, "yes"],
    ]),
    starter: {
      python: python(`n = int(raw.strip())\n# TODO: print yes or no.\nprint("no")`),
      javascript: javascript(`const n = Number(raw.trim());\n// TODO: print yes or no.\nconsole.log("no");`),
      java: java(`int n = input.nextInt();\n// TODO: print yes or no.\nSystem.out.println("no");`),
      c: c(`int n;\nif (scanf("%d", &n) != 1) return 0;\n// TODO: print yes or no.\nprintf("no\\n");`),
      cpp: cpp(`int n;\ncin >> n;\n// TODO: print yes or no.\ncout << "no\\n";`),
    },
    solution: {
      python: python(`n = int(raw.strip())\nprint("yes" if n % ${divisor} == 0 else "no")`),
      javascript: javascript(`const n = Number(raw.trim());\nconsole.log(n % ${divisor} === 0 ? "yes" : "no");`),
      java: java(`int n = input.nextInt();\nSystem.out.println(n % ${divisor} == 0 ? "yes" : "no");`),
      c: c(`int n;\nif (scanf("%d", &n) != 1) return 0;\nprintf("%s\\n", n % ${divisor} == 0 ? "yes" : "no");`),
      cpp: cpp(`int n;\ncin >> n;\ncout << (n % ${divisor} == 0 ? "yes" : "no") << '\\n';`),
    },
  };
}

function makeCountMultiplesChallenge(index: number): Challenge {
  const divisor = index + 2;
  return {
    id: `count-multiples-${divisor}`,
    title: `Count multiples of ${divisor}`,
    difficulty: "Easy",
    summary: `Count multiples of ${divisor} from 1 through n.`,
    prompt: `Read a positive integer n. Print how many integers from 1 through n are divisible by ${divisor}.`,
    inputFormat: "One positive integer n.",
    outputFormat: "One integer count.",
    constraints: ["1 ≤ n ≤ 1,000,000"],
    hints: ["You do not need to loop over every number.", `Integer division by ${divisor} gives the count.`],
    explanation: `There is one multiple of ${divisor} for every complete block of ${divisor}, so the answer is floor(n / ${divisor}).`,
    tests: generatedTests([
      ["small", `${divisor - 1}\n`, "0"],
      ["exact", `${divisor * 5}\n`, "5"],
      ["between", `${divisor * 7 + 2}\n`, "7"],
      ["large", "999\n", String(Math.floor(999 / divisor))],
    ]),
    starter: {
      python: python(`n = int(raw.strip())\n# TODO: count the multiples.\nprint(0)`),
      javascript: javascript(`const n = Number(raw.trim());\n// TODO: count the multiples.\nconsole.log(0);`),
      java: java(`int n = input.nextInt();\n// TODO: count the multiples.\nSystem.out.println(0);`),
      c: c(`int n;\nif (scanf("%d", &n) != 1) return 0;\n// TODO: count the multiples.\nprintf("0\\n");`),
      cpp: cpp(`int n;\ncin >> n;\n// TODO: count the multiples.\ncout << 0 << '\\n';`),
    },
    solution: {
      python: python(`n = int(raw.strip())\nprint(n // ${divisor})`),
      javascript: javascript(`const n = Number(raw.trim());\nconsole.log(Math.floor(n / ${divisor}));`),
      java: java(`int n = input.nextInt();\nSystem.out.println(n / ${divisor});`),
      c: c(`int n;\nif (scanf("%d", &n) != 1) return 0;\nprintf("%d\\n", n / ${divisor});`),
      cpp: cpp(`int n;\ncin >> n;\ncout << n / ${divisor} << '\\n';`),
    },
  };
}

function makeDigitSumChallenge(index: number): Challenge {
  const label = index + 1;
  return {
    id: `digit-sum-${label}`,
    title: `Digit sum drill ${label}`,
    difficulty: "Medium",
    summary: "Add all decimal digits of a non-negative integer.",
    prompt: "Read one non-negative integer n and print the sum of its decimal digits. For n = 0, print 0.",
    inputFormat: "One integer n.",
    outputFormat: "One integer: the digit sum.",
    constraints: ["0 ≤ n ≤ 2,000,000,000"],
    hints: ["Repeatedly use remainder 10 to take the final digit.", "Integer-divide by 10 to remove the final digit."],
    explanation: "Repeatedly add n % 10 and replace n with floor(n / 10) until no digits remain.",
    tests: generatedTests([
      ["sample", "12345\n", "15"],
      ["zero", "0\n", "0"],
      ["zeros-inside", "1002003\n", "6"],
      ["large", `${987654320 + index}\n`, String(String(987654320 + index).split("").reduce((sum, d) => sum + Number(d), 0))],
    ]),
    starter: {
      python: python(`n = int(raw.strip())\n# TODO: add the digits.\nprint(0)`),
      javascript: javascript(`let n = Number(raw.trim());\n// TODO: add the digits.\nconsole.log(0);`),
      java: java(`int n = input.nextInt();\n// TODO: add the digits.\nSystem.out.println(0);`),
      c: c(`int n;\nif (scanf("%d", &n) != 1) return 0;\n// TODO: add the digits.\nprintf("0\\n");`),
      cpp: cpp(`int n;\ncin >> n;\n// TODO: add the digits.\ncout << 0 << '\\n';`),
    },
    solution: {
      python: python(`n = int(raw.strip())\ntotal = 0\nwhile n > 0:\n    total += n % 10\n    n //= 10\nprint(total)`),
      javascript: javascript(`let n = Number(raw.trim());\nlet total = 0;\nwhile (n > 0) { total += n % 10; n = Math.floor(n / 10); }\nconsole.log(total);`),
      java: java(`int n = input.nextInt();\nint total = 0;\nwhile (n > 0) { total += n % 10; n /= 10; }\nSystem.out.println(total);`),
      c: c(`int n;\nif (scanf("%d", &n) != 1) return 0;\nint total = 0;\nwhile (n > 0) { total += n % 10; n /= 10; }\nprintf("%d\\n", total);`),
      cpp: cpp(`int n;\ncin >> n;\nint total = 0;\nwhile (n > 0) { total += n % 10; n /= 10; }\ncout << total << '\\n';`),
    },
  };
}

function makeGcdChallenge(index: number): Challenge {
  const label = index + 1;
  const gcd = (a: number, b: number) => { while (b) [a, b] = [b, a % b]; return a; };
  const a = 84 + index * 6;
  const b = 30 + index * 3;
  return {
    id: `gcd-${label}`,
    title: `Greatest common divisor ${label}`,
    difficulty: "Medium",
    summary: "Find the greatest common divisor of two positive integers.",
    prompt: "Read two positive integers a and b. Print their greatest common divisor using the Euclidean algorithm or another correct method.",
    inputFormat: "Two positive integers a and b.",
    outputFormat: "One positive integer: gcd(a, b).",
    constraints: ["1 ≤ a, b ≤ 1,000,000,000"],
    hints: ["Replace (a, b) with (b, a % b).", "Stop when b becomes zero."],
    explanation: "The Euclidean algorithm repeatedly replaces the pair with the divisor and remainder until the remainder is zero.",
    tests: generatedTests([
      ["sample", "48 18\n", "6"],
      ["coprime", "35 64\n", "1"],
      ["same", "77 77\n", "77"],
      ["variant", `${a} ${b}\n`, String(gcd(a, b))],
    ]),
    starter: {
      python: python(`a, b = map(int, raw.split())\n# TODO: print gcd(a, b).\nprint(1)`),
      javascript: javascript(`let [a, b] = raw.trim().split(/\\s+/).map(Number);\n// TODO: print gcd(a, b).\nconsole.log(1);`),
      java: java(`int a = input.nextInt();\nint b = input.nextInt();\n// TODO: print gcd(a, b).\nSystem.out.println(1);`),
      c: c(`int a, b;\nif (scanf("%d %d", &a, &b) != 2) return 0;\n// TODO: print gcd(a, b).\nprintf("1\\n");`),
      cpp: cpp(`int a, b;\ncin >> a >> b;\n// TODO: print gcd(a, b).\ncout << 1 << '\\n';`),
    },
    solution: {
      python: python(`a, b = map(int, raw.split())\nwhile b:\n    a, b = b, a % b\nprint(a)`),
      javascript: javascript(`let [a, b] = raw.trim().split(/\\s+/).map(Number);\nwhile (b !== 0) { const next = a % b; a = b; b = next; }\nconsole.log(a);`),
      java: java(`int a = input.nextInt();\nint b = input.nextInt();\nwhile (b != 0) { int next = a % b; a = b; b = next; }\nSystem.out.println(a);`),
      c: c(`int a, b;\nif (scanf("%d %d", &a, &b) != 2) return 0;\nwhile (b != 0) { int next = a % b; a = b; b = next; }\nprintf("%d\\n", a);`),
      cpp: cpp(`int a, b;\ncin >> a >> b;\nwhile (b != 0) { int next = a % b; a = b; b = next; }\ncout << a << '\\n';`),
    },
  };
}

function makeThresholdChallenge(index: number): Challenge {
  const threshold = index + 1;
  const count = (values: number[]) => values.filter((value) => value >= threshold).length;
  const values = [index - 2, threshold, threshold + 4, -3, threshold - 1, threshold + 10];
  return {
    id: `threshold-${threshold}`,
    title: `Count values ≥ ${threshold}`,
    difficulty: "Medium",
    summary: `Count list values that are at least ${threshold}.`,
    prompt: `Read n followed by n integers. Print how many of those values are greater than or equal to ${threshold}.`,
    inputFormat: "First integer n, followed by n integers separated by whitespace.",
    outputFormat: "One integer count.",
    constraints: ["1 ≤ n ≤ 200", "Each value is between −1,000,000 and 1,000,000."],
    hints: ["Scan each value once.", `Increase the counter when value >= ${threshold}.`],
    explanation: "A single pass is enough: test every value against the threshold and count matches.",
    tests: generatedTests([
      ["sample", `6\n${values.join(" ")}\n`, String(count(values))],
      ["none", "4\n-9 -8 -7 -6\n", "0"],
      ["all", `3\n${threshold} ${threshold + 1} ${threshold + 2}\n`, "3"],
      ["mixed", `5\n${threshold - 1} ${threshold} ${threshold + 1} 0 ${threshold + 20}\n`, String([threshold - 1, threshold, threshold + 1, 0, threshold + 20].filter((v) => v >= threshold).length)],
    ]),
    starter: {
      python: python(`tokens = list(map(int, raw.split()))\nn = tokens[0]\nvalues = tokens[1:1+n]\n# TODO: count matching values.\nprint(0)`),
      javascript: javascript(`const tokens = raw.trim().split(/\\s+/).map(Number);\nconst n = tokens[0];\nconst values = tokens.slice(1, 1 + n);\n// TODO: count matching values.\nconsole.log(0);`),
      java: java(`int n = input.nextInt();\nint count = 0;\nfor (int i = 0; i < n; i++) { int value = input.nextInt(); /* TODO */ }\nSystem.out.println(count);`),
      c: c(`int n;\nif (scanf("%d", &n) != 1) return 0;\nint count = 0;\nfor (int i = 0; i < n; i++) { int value; scanf("%d", &value); /* TODO */ }\nprintf("%d\\n", count);`),
      cpp: cpp(`int n;\ncin >> n;\nint count = 0;\nfor (int i = 0; i < n; i++) { int value; cin >> value; /* TODO */ }\ncout << count << '\\n';`),
    },
    solution: {
      python: python(`tokens = list(map(int, raw.split()))\nn = tokens[0]\nvalues = tokens[1:1+n]\nprint(sum(1 for value in values if value >= ${threshold}))`),
      javascript: javascript(`const tokens = raw.trim().split(/\\s+/).map(Number);\nconst n = tokens[0];\nconst values = tokens.slice(1, 1 + n);\nconsole.log(values.filter((value) => value >= ${threshold}).length);`),
      java: java(`int n = input.nextInt();\nint count = 0;\nfor (int i = 0; i < n; i++) { int value = input.nextInt(); if (value >= ${threshold}) count++; }\nSystem.out.println(count);`),
      c: c(`int n;\nif (scanf("%d", &n) != 1) return 0;\nint count = 0;\nfor (int i = 0; i < n; i++) { int value; if (scanf("%d", &value) != 1) return 0; if (value >= ${threshold}) count++; }\nprintf("%d\\n", count);`),
      cpp: cpp(`int n;\ncin >> n;\nint count = 0;\nfor (int i = 0; i < n; i++) { int value; cin >> value; if (value >= ${threshold}) count++; }\ncout << count << '\\n';`),
    },
  };
}

function makeFibonacciChallenge(index: number): Challenge {
  return {
    id: `fibonacci-${index + 1}`,
    title: `Fibonacci checkpoint ${index + 1}`,
    difficulty: "Hard",
    summary: "Compute the nth Fibonacci number iteratively.",
    prompt: "Read n and print F(n), where F(0)=0, F(1)=1, and F(n)=F(n−1)+F(n−2).",
    inputFormat: "One integer n.",
    outputFormat: "One integer F(n).",
    constraints: ["0 ≤ n ≤ 40"],
    hints: ["Keep only the previous two values.", "Handle n=0 naturally by starting from 0 and 1."],
    explanation: "Advance a pair (a,b) from (0,1) exactly n times; a becomes F(n).",
    tests: generatedTests([["zero","0\n","0"],["one","1\n","1"],["ten","10\n","55"],["twenty","20\n","6765"]]),
    starter: {
      python: python(`n = int(raw.strip())\n# TODO: compute F(n).\nprint(0)`),
      javascript: javascript(`const n = Number(raw.trim());\n// TODO: compute F(n).\nconsole.log(0);`),
      java: java(`int n = input.nextInt();\n// TODO: compute F(n).\nSystem.out.println(0);`),
      c: c(`int n;\nif (scanf("%d", &n) != 1) return 0;\n// TODO: compute F(n).\nprintf("0\\n");`),
      cpp: cpp(`int n;\ncin >> n;\n// TODO: compute F(n).\ncout << 0 << '\\n';`),
    },
    solution: {
      python: python(`n = int(raw.strip())\na, b = 0, 1\nfor _ in range(n):\n    a, b = b, a + b\nprint(a)`),
      javascript: javascript(`const n = Number(raw.trim());\nlet a = 0, b = 1;\nfor (let i = 0; i < n; i++) [a, b] = [b, a + b];\nconsole.log(a);`),
      java: java(`int n = input.nextInt();\nlong a = 0, b = 1;\nfor (int i = 0; i < n; i++) { long next = a + b; a = b; b = next; }\nSystem.out.println(a);`),
      c: c(`int n;\nif (scanf("%d", &n) != 1) return 0;\nlong long a = 0, b = 1;\nfor (int i = 0; i < n; i++) { long long next = a + b; a = b; b = next; }\nprintf("%lld\\n", a);`),
      cpp: cpp(`int n;\ncin >> n;\nlong long a = 0, b = 1;\nfor (int i = 0; i < n; i++) { long long next = a + b; a = b; b = next; }\ncout << a << '\\n';`),
    },
  };
}

function makePrimeChallenge(index: number): Challenge {
  return {
    id: `prime-${index + 1}`,
    title: `Prime check ${index + 1}`,
    difficulty: "Hard",
    summary: "Decide whether a positive integer is prime.",
    prompt: "Read n. Print true if n is prime and false otherwise. Numbers smaller than 2 are not prime.",
    inputFormat: "One integer n.",
    outputFormat: "Exactly true or false in lowercase.",
    constraints: ["0 ≤ n ≤ 2,000,000,000"],
    hints: ["Try divisors only while d*d <= n.", "Stop at the first divisor."],
    explanation: "A composite number has a factor no larger than its square root, so checking divisors up to sqrt(n) is sufficient.",
    tests: generatedTests([["small-prime","2\n","true"],["one","1\n","false"],["composite","221\n","false"],["prime","9973\n","true"]]),
    starter: {
      python: python(`n = int(raw.strip())\n# TODO: determine primality.\nprint("false")`),
      javascript: javascript(`const n = Number(raw.trim());\n// TODO: determine primality.\nconsole.log("false");`),
      java: java(`int n = input.nextInt();\n// TODO: determine primality.\nSystem.out.println("false");`),
      c: c(`int n;\nif (scanf("%d", &n) != 1) return 0;\n// TODO: determine primality.\nprintf("false\\n");`),
      cpp: cpp(`int n;\ncin >> n;\n// TODO: determine primality.\ncout << "false\\n";`),
    },
    solution: {
      python: python(`n = int(raw.strip())\nprime = n >= 2\nd = 2\nwhile prime and d * d <= n:\n    if n % d == 0:\n        prime = False\n    d += 1\nprint("true" if prime else "false")`),
      javascript: javascript(`const n = Number(raw.trim());\nlet prime = n >= 2;\nfor (let d = 2; prime && d * d <= n; d++) if (n % d === 0) prime = false;\nconsole.log(prime ? "true" : "false");`),
      java: java(`int n = input.nextInt();\nboolean prime = n >= 2;\nfor (int d = 2; prime && (long)d * d <= n; d++) if (n % d == 0) prime = false;\nSystem.out.println(prime ? "true" : "false");`),
      c: c(`int n;\nif (scanf("%d", &n) != 1) return 0;\nint prime = n >= 2;\nfor (int d = 2; prime && (long long)d * d <= n; d++) if (n % d == 0) prime = 0;\nprintf("%s\\n", prime ? "true" : "false");`),
      cpp: cpp(`int n;\ncin >> n;\nbool prime = n >= 2;\nfor (int d = 2; prime && 1LL * d * d <= n; d++) if (n % d == 0) prime = false;\ncout << (prime ? "true" : "false") << '\\n';`),
    },
  };
}

function makeSecondLargestChallenge(index: number): Challenge {
  return {
    id: `second-largest-${index + 1}`,
    title: `Second distinct maximum ${index + 1}`,
    difficulty: "Hard",
    summary: "Find the second-largest distinct value.",
    prompt: "Read n and n integers. Print the second-largest distinct value. If fewer than two distinct values exist, print NONE.",
    inputFormat: "First line n; second line n integers.",
    outputFormat: "The second-largest distinct integer, or NONE.",
    constraints: ["1 ≤ n ≤ 200", "Values fit in a 32-bit signed integer."],
    hints: ["Track the largest and second-largest distinct values.", "Ignore values equal to the current largest."],
    explanation: "A single pass can maintain the two best distinct values without sorting the whole list.",
    tests: generatedTests([["sample","5\n4 9 2 9 7\n","7"],["all-same","4\n3 3 3 3\n","NONE"],["negative","5\n-8 -2 -5 -2 -9\n","-5"],["two","2\n10 1\n","1"]]),
    starter: {
      python: python(`tokens = list(map(int, raw.split()))\nvalues = tokens[1:1+tokens[0]]\n# TODO: find the second distinct maximum.\nprint("NONE")`),
      javascript: javascript(`const tokens = raw.trim().split(/\\s+/).map(Number);\nconst values = tokens.slice(1, 1 + tokens[0]);\n// TODO: find the second distinct maximum.\nconsole.log("NONE");`),
      java: java(`int n = input.nextInt();\nint[] values = new int[n];\nfor (int i = 0; i < n; i++) values[i] = input.nextInt();\n// TODO: find the second distinct maximum.\nSystem.out.println("NONE");`),
      c: c(`int n;\nif (scanf("%d", &n) != 1) return 0;\nint values[200];\nfor (int i = 0; i < n; i++) scanf("%d", &values[i]);\n// TODO: find the second distinct maximum.\nprintf("NONE\\n");`),
      cpp: cpp(`int n;\ncin >> n;\nvector<int> values(n);\nfor (int &value : values) cin >> value;\n// TODO: find the second distinct maximum.\ncout << "NONE\\n";`),
    },
    solution: {
      python: python(`tokens = list(map(int, raw.split()))\nvalues = tokens[1:1+tokens[0]]\nunique = sorted(set(values), reverse=True)\nprint(unique[1] if len(unique) >= 2 else "NONE")`),
      javascript: javascript(`const tokens = raw.trim().split(/\\s+/).map(Number);\nconst values = tokens.slice(1, 1 + tokens[0]);\nconst unique = [...new Set(values)].sort((a, b) => b - a);\nconsole.log(unique.length >= 2 ? unique[1] : "NONE");`),
      java: java(`int n = input.nextInt();\nInteger first = null, second = null;\nfor (int i = 0; i < n; i++) { int v = input.nextInt(); if (first == null || v > first) { if (first == null || v != first) second = first; first = v; } else if (v != first && (second == null || v > second)) second = v; }\nSystem.out.println(second == null ? "NONE" : second);`),
      c: c(`int n;\nif (scanf("%d", &n) != 1) return 0;\nint first = 0, second = 0, has_first = 0, has_second = 0;\nfor (int i = 0; i < n; i++) { int v; scanf("%d", &v); if (!has_first || v > first) { if (!has_first || v != first) { if (has_first) { second = first; has_second = 1; } first = v; has_first = 1; } } else if (v != first && (!has_second || v > second)) { second = v; has_second = 1; } }\nif (has_second) printf("%d\\n", second); else printf("NONE\\n");`),
      cpp: cpp(`int n;\ncin >> n;\nbool hasFirst = false, hasSecond = false;\nint first = 0, second = 0;\nfor (int i = 0; i < n; i++) { int v; cin >> v; if (!hasFirst || v > first) { if (!hasFirst || v != first) { if (hasFirst) { second = first; hasSecond = true; } first = v; hasFirst = true; } } else if (v != first && (!hasSecond || v > second)) { second = v; hasSecond = true; } }\nif (hasSecond) cout << second << '\\n'; else cout << "NONE\\n";`),
    },
  };
}

function makeRotateChallenge(index: number): Challenge {
  return {
    id: `rotate-right-${index + 1}`,
    title: `Rotate right ${index + 1}`,
    difficulty: "Hard",
    summary: "Rotate a list to the right by k positions.",
    prompt: "Read n and k, followed by n integers. Rotate the list to the right by k positions and print the result space-separated. k may be larger than n.",
    inputFormat: "First line n k; second line n integers.",
    outputFormat: "The rotated values on one line, separated by single spaces.",
    constraints: ["1 ≤ n ≤ 200", "0 ≤ k ≤ 1,000,000"],
    hints: ["Reduce k using k % n.", "The final k elements move to the front."],
    explanation: "Normalize k, split before the final k elements, then concatenate the suffix with the prefix.",
    tests: generatedTests([["sample","5 2\n1 2 3 4 5\n","4 5 1 2 3"],["zero","4 0\n7 8 9 10\n","7 8 9 10"],["large-k","3 8\n1 2 3\n","2 3 1"],["single","1 999\n42\n","42"]]),
    starter: {
      python: python(`tokens = list(map(int, raw.split()))\nn, k = tokens[0], tokens[1]\nvalues = tokens[2:2+n]\n# TODO: rotate the list.\nprint(*values)`),
      javascript: javascript(`const tokens = raw.trim().split(/\\s+/).map(Number);\nconst n = tokens[0], k = tokens[1];\nconst values = tokens.slice(2, 2 + n);\n// TODO: rotate the list.\nconsole.log(values.join(" "));`),
      java: java(`int n = input.nextInt();\nint k = input.nextInt();\nint[] values = new int[n];\nfor (int i = 0; i < n; i++) values[i] = input.nextInt();\n// TODO: rotate the list.\nfor (int i = 0; i < n; i++) { if (i > 0) System.out.print(" "); System.out.print(values[i]); }\nSystem.out.println();`),
      c: c(`int n, k;\nif (scanf("%d %d", &n, &k) != 2) return 0;\nint values[200];\nfor (int i = 0; i < n; i++) scanf("%d", &values[i]);\n// TODO: rotate the list.\nfor (int i = 0; i < n; i++) printf("%s%d", i ? " " : "", values[i]);\nprintf("\\n");`),
      cpp: cpp(`int n, k;\ncin >> n >> k;\nvector<int> values(n);\nfor (int &value : values) cin >> value;\n// TODO: rotate the list.\nfor (int i = 0; i < n; i++) cout << (i ? " " : "") << values[i];\ncout << '\\n';`),
    },
    solution: {
      python: python(`tokens = list(map(int, raw.split()))\nn, k = tokens[0], tokens[1]\nvalues = tokens[2:2+n]\nk %= n\nrotated = values[-k:] + values[:-k] if k else values\nprint(*rotated)`),
      javascript: javascript(`const tokens = raw.trim().split(/\\s+/).map(Number);\nconst n = tokens[0];\nlet k = tokens[1] % n;\nconst values = tokens.slice(2, 2 + n);\nconst rotated = k ? values.slice(n - k).concat(values.slice(0, n - k)) : values;\nconsole.log(rotated.join(" "));`),
      java: java(`int n = input.nextInt();\nint k = input.nextInt() % n;\nint[] values = new int[n];\nfor (int i = 0; i < n; i++) values[i] = input.nextInt();\nfor (int i = 0; i < n; i++) { int source = (i - k + n) % n; if (i > 0) System.out.print(" "); System.out.print(values[source]); }\nSystem.out.println();`),
      c: c(`int n, k;\nif (scanf("%d %d", &n, &k) != 2) return 0;\nk %= n;\nint values[200];\nfor (int i = 0; i < n; i++) scanf("%d", &values[i]);\nfor (int i = 0; i < n; i++) { int source = (i - k + n) % n; printf("%s%d", i ? " " : "", values[source]); }\nprintf("\\n");`),
      cpp: cpp(`int n, k;\ncin >> n >> k;\nk %= n;\nvector<int> values(n);\nfor (int &value : values) cin >> value;\nfor (int i = 0; i < n; i++) { int source = (i - k + n) % n; cout << (i ? " " : "") << values[source]; }\ncout << '\\n';`),
    },
  };
}

const GENERATED_CHALLENGES: readonly Challenge[] = [
  ...Array.from({ length: 10 }, (_, index) => makeAffineChallenge(index)),
  ...Array.from({ length: 10 }, (_, index) => makeDivisibleChallenge(index)),
  ...Array.from({ length: 10 }, (_, index) => makeCountMultiplesChallenge(index)),
  ...Array.from({ length: 10 }, (_, index) => makeDigitSumChallenge(index)),
  ...Array.from({ length: 10 }, (_, index) => makeGcdChallenge(index)),
  ...Array.from({ length: 10 }, (_, index) => makeThresholdChallenge(index)),
  ...Array.from({ length: 10 }, (_, index) => makeFibonacciChallenge(index)),
  ...Array.from({ length: 10 }, (_, index) => makePrimeChallenge(index)),
  ...Array.from({ length: 10 }, (_, index) => makeSecondLargestChallenge(index)),
  ...Array.from({ length: 10 }, (_, index) => makeRotateChallenge(index)),
];

export const CHALLENGES: readonly Challenge[] = [
  ...BASE_CHALLENGES,
  ...GENERATED_CHALLENGES,
];

function shuffled<T>(items: readonly T[], random: () => number): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index--) {
    const swap = Math.floor(random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

export function pickPracticeChallenges(
  count = 10,
  preferredId?: string,
  random: () => number = Math.random,
): Challenge[] {
  const requested = Math.max(1, Math.min(count, CHALLENGES.length));
  const base = Math.floor(requested / 3);
  const remainder = requested % 3;
  const quotas: Record<Challenge["difficulty"], number> = {
    Easy: base + (remainder > 0 ? 1 : 0),
    Medium: base + (remainder > 1 ? 1 : 0),
    Hard: base,
  };

  const selected: Challenge[] = [];
  const preferred = preferredId ? getChallenge(preferredId) : undefined;
  if (preferred) {
    selected.push(preferred);
    quotas[preferred.difficulty] = Math.max(0, quotas[preferred.difficulty] - 1);
  }

  for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
    const pool = CHALLENGES.filter(
      (challenge) => challenge.difficulty === difficulty && challenge.id !== preferred?.id,
    );
    selected.push(...shuffled(pool, random).slice(0, quotas[difficulty]));
  }

  if (selected.length < requested) {
    const used = new Set(selected.map((challenge) => challenge.id));
    selected.push(
      ...shuffled(CHALLENGES.filter((challenge) => !used.has(challenge.id)), random).slice(
        0,
        requested - selected.length,
      ),
    );
  }

  return shuffled(selected, random).slice(0, requested);
}

export function isLanguageId(value: unknown): value is LanguageId {
  return (
    typeof value === "string" &&
    LANGUAGES.some((language) => language.id === value)
  );
}

export function getLanguage(id: string): LanguageOption | undefined {
  return LANGUAGES.find((language) => language.id === id);
}

export function getChallenge(id: string): Challenge | undefined {
  return CHALLENGES.find((challenge) => challenge.id === id);
}