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
  difficulty: "Easy" | "Medium";
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

export const CHALLENGES: readonly Challenge[] = [
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