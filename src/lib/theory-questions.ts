export type TheoryDifficulty = "Easy" | "Medium" | "Hard";

export interface TheoryQuestion {
  id: string;
  difficulty: TheoryDifficulty;
  topic: string;
  prompt: string;
  options: readonly [string, string, string, string];
  answer: number;
  explanation: string;
}

type TheorySeed = Omit<TheoryQuestion, "id" | "prompt"> & {
  key: string;
  prompt: string;
  alternatePrompt: string;
};

const THEORY_SEEDS: readonly TheorySeed[] = [
  { key: "boolean", difficulty: "Easy", topic: "Programming basics", prompt: "Which value type normally represents true or false?", alternatePrompt: "A condition needs to store only true or false. Which type best fits?", options: ["Boolean", "String", "Array", "Float"], answer: 0, explanation: "A Boolean represents the two logical states true and false." },
  { key: "variable", difficulty: "Easy", topic: "Programming basics", prompt: "What is the main purpose of a variable?", alternatePrompt: "Why do programs give names to values using variables?", options: ["Store a value code can use", "Compile a project", "Draw a user interface", "Connect a monitor"], answer: 0, explanation: "A variable gives a name to a value so code can read or update it." },
  { key: "loop", difficulty: "Easy", topic: "Programming basics", prompt: "Which control structure repeats a block of code?", alternatePrompt: "You need to run the same logic several times. Which structure should you use?", options: ["Loop", "Comment", "Import", "Class name"], answer: 0, explanation: "Loops repeat work while a condition or sequence requires it." },
  { key: "if", difficulty: "Easy", topic: "Programming basics", prompt: "What is the usual purpose of an if statement?", alternatePrompt: "Which construct lets a program choose code based on a condition?", options: ["Choose code based on a condition", "Create a database table", "Install a package", "Rename a file"], answer: 0, explanation: "An if statement branches based on whether a condition is true." },
  { key: "function", difficulty: "Easy", topic: "Programming basics", prompt: "What is a function?", alternatePrompt: "Which description best matches a function in source code?", options: ["A reusable block of code that can be called", "A color theme", "A database row", "A network cable"], answer: 0, explanation: "Functions package behavior so it can be called with inputs and can return a result." },
  { key: "syntax", difficulty: "Easy", topic: "Programming basics", prompt: "What is a syntax error?", alternatePrompt: "When code breaks the grammar rules of a language, what kind of error is it?", options: ["A language grammar error", "A slow internet connection", "A missing image", "A correct result"], answer: 0, explanation: "Syntax errors happen when code is not written according to the language grammar." },
  { key: "python-def", difficulty: "Easy", topic: "Python", prompt: "Which keyword defines a function in Python?", alternatePrompt: "In Python, which word starts a function definition?", options: ["def", "func", "function", "method"], answer: 0, explanation: "Python uses the def keyword to define a function." },
  { key: "python-none", difficulty: "Easy", topic: "Python", prompt: "Which Python value represents no value?", alternatePrompt: "What is Python's null-like singleton value?", options: ["None", "null", "void", "empty"], answer: 0, explanation: "Python uses None as its null-like singleton value." },
  { key: "python-list", difficulty: "Easy", topic: "Python", prompt: "Which Python collection uses square brackets and keeps items ordered?", alternatePrompt: "Which Python type best fits an ordered sequence written with square brackets?", options: ["list", "dict", "set", "bool"], answer: 0, explanation: "Lists use square brackets and preserve item order." },
  { key: "js-let", difficulty: "Easy", topic: "JavaScript", prompt: "Which keyword declares a block-scoped variable that may be reassigned?", alternatePrompt: "Which JavaScript declaration should you use for a block-scoped binding that can change?", options: ["let", "const", "class", "return"], answer: 0, explanation: "let creates a block-scoped binding that can be reassigned." },
  { key: "js-strict", difficulty: "Easy", topic: "JavaScript", prompt: "What does === compare in JavaScript?", alternatePrompt: "Which statement about JavaScript strict equality is correct?", options: ["Value and type without coercion", "Only variable names", "Only array length", "File permissions"], answer: 0, explanation: "Strict equality compares without type coercion." },
  { key: "html", difficulty: "Easy", topic: "Web", prompt: "What does HTML mainly describe?", alternatePrompt: "Which web technology defines page structure and content?", options: ["The structure and content of a web page", "Only database queries", "Server hardware", "Encryption keys"], answer: 0, explanation: "HTML defines page structure and content." },
  { key: "css", difficulty: "Easy", topic: "Web", prompt: "What does CSS mainly control?", alternatePrompt: "Which web technology is mainly responsible for presentation and layout?", options: ["Presentation and layout", "Database transactions", "CPU instructions", "Git branches"], answer: 0, explanation: "CSS styles how HTML is presented." },
  { key: "http-get", difficulty: "Easy", topic: "HTTP", prompt: "Which HTTP method is normally used to retrieve data?", alternatePrompt: "A client wants to read a resource without intending to change it. Which method is the common choice?", options: ["GET", "POST", "DELETE", "PATCH"], answer: 0, explanation: "GET is normally used to retrieve a representation of a resource." },
  { key: "http-404", difficulty: "Easy", topic: "HTTP", prompt: "Which HTTP status code means Not Found?", alternatePrompt: "A requested page does not exist. Which status code should the server normally return?", options: ["404", "200", "301", "500"], answer: 0, explanation: "HTTP 404 indicates that the requested resource was not found." },
  { key: "git-commit", difficulty: "Easy", topic: "Git", prompt: "What does git commit create?", alternatePrompt: "Which Git action records the staged project state in repository history?", options: ["A saved snapshot in repository history", "A new programming language", "A browser cookie", "A database index"], answer: 0, explanation: "A commit records a snapshot of staged changes and metadata." },
  { key: "sql-select", difficulty: "Easy", topic: "Databases", prompt: "Which SQL command is used to read rows?", alternatePrompt: "You want to retrieve data from a table. Which SQL command do you normally start with?", options: ["SELECT", "INSERT", "UPDATE", "DROP"], answer: 0, explanation: "SELECT retrieves data from tables or views." },

  { key: "scope", difficulty: "Medium", topic: "Programming basics", prompt: "What is variable scope?", alternatePrompt: "What does scope determine for an identifier?", options: ["The region where a name can be accessed", "The size of a monitor", "Network speed", "The number of commits"], answer: 0, explanation: "Scope controls where an identifier is visible and usable." },
  { key: "validation", difficulty: "Medium", topic: "Programming basics", prompt: "Why is input validation important?", alternatePrompt: "What is the best reason to validate external input before using it?", options: ["It handles unexpected input before unsafe assumptions are made", "It makes every algorithm O(1)", "It removes the need for tests", "It encrypts source code"], answer: 0, explanation: "Validation prevents malformed or out-of-range values from reaching logic that assumes valid input." },
  { key: "immutability", difficulty: "Medium", topic: "Programming basics", prompt: "Which statement best describes immutability?", alternatePrompt: "What does it mean when a value is immutable?", options: ["It cannot be changed after creation", "It changes only inside loops", "It is always stored on disk", "It cannot be copied"], answer: 0, explanation: "Immutability means the value itself is not mutated after creation." },
  { key: "python-dict", difficulty: "Medium", topic: "Python", prompt: "Which Python collection stores key-value pairs?", alternatePrompt: "You need to map unique keys to values in Python. Which built-in type fits?", options: ["dict", "tuple", "set", "range"], answer: 0, explanation: "A dict maps keys to values." },
  { key: "python-with", difficulty: "Medium", topic: "Python", prompt: "Why use with open(...) as file in Python?", alternatePrompt: "What important benefit does a file context manager provide in Python?", options: ["It closes the file automatically when the block exits", "It makes the file public", "It converts every line to JSON", "It disables exceptions"], answer: 0, explanation: "The context manager handles cleanup even if an exception occurs." },
  { key: "python-except", difficulty: "Medium", topic: "Python", prompt: "What is the purpose of a try/except block?", alternatePrompt: "Which Python construct lets code respond to selected exceptions?", options: ["Handle exceptions that may occur", "Repeat code forever", "Declare a class", "Import CSS"], answer: 0, explanation: "try/except catches selected exceptions and lets the program respond." },
  { key: "js-map", difficulty: "Medium", topic: "JavaScript", prompt: "What does Array.prototype.map normally return?", alternatePrompt: "You call map on an array with a transform callback. What do you get back?", options: ["A new array containing transformed items", "Only the original length", "A Boolean", "No value"], answer: 0, explanation: "map creates a new array from the callback result for each item." },
  { key: "promise", difficulty: "Medium", topic: "JavaScript", prompt: "What is a Promise used to represent?", alternatePrompt: "Which JavaScript abstraction represents a future asynchronous result or failure?", options: ["A value that may become available asynchronously", "A CSS selector", "A database column", "A compile-time type only"], answer: 0, explanation: "Promises model completion or failure of asynchronous work." },
  { key: "dom", difficulty: "Medium", topic: "Web", prompt: "What is the DOM?", alternatePrompt: "How does browser JavaScript normally see the structure of an HTML document?", options: ["A programmable tree representation of a document", "A database engine", "A Git protocol", "A CPU scheduler"], answer: 0, explanation: "Browsers expose page structure as the Document Object Model." },
  { key: "semantic-html", difficulty: "Medium", topic: "Web", prompt: "Why is semantic HTML useful?", alternatePrompt: "What is a benefit of choosing elements such as nav, main, and article by meaning?", options: ["It communicates meaning to browsers and assistive technology", "It guarantees zero bugs", "It replaces CSS", "It prevents all requests"], answer: 0, explanation: "Semantic elements describe the role of content rather than only its appearance." },
  { key: "cors", difficulty: "Medium", topic: "Web", prompt: "What is CORS mainly concerned with?", alternatePrompt: "Which browser security mechanism controls script access to resources from another origin?", options: ["Cross-origin browser access", "Database sorting", "Git branch naming", "Python imports"], answer: 0, explanation: "CORS is a browser-enforced cross-origin access mechanism." },
  { key: "http-idempotent", difficulty: "Medium", topic: "HTTP", prompt: "What is the important property of an idempotent HTTP operation?", alternatePrompt: "When is an HTTP operation considered idempotent?", options: ["Repeating it has the same intended effect as doing it once", "It must return HTML", "It can never fail", "It always uses POST"], answer: 0, explanation: "Idempotence means repeated identical requests do not create additional intended state changes." },
  { key: "git-branch", difficulty: "Medium", topic: "Git", prompt: "Why create a branch in Git?", alternatePrompt: "What is a common reason to put new work on a separate Git branch?", options: ["Develop changes independently before merging", "Encrypt a repository", "Install Node.js", "Replace every commit"], answer: 0, explanation: "Branches isolate lines of development while sharing repository history." },
  { key: "sql-join", difficulty: "Medium", topic: "Databases", prompt: "What does an SQL JOIN do?", alternatePrompt: "Which SQL feature combines related rows from two or more tables?", options: ["Combines related rows based on a condition", "Deletes indexes", "Encrypts the server", "Creates CSS classes"], answer: 0, explanation: "JOINs relate rows across tables using matching criteria." },
  { key: "db-index", difficulty: "Medium", topic: "Databases", prompt: "Why add an index to a database column?", alternatePrompt: "What is a common trade-off when creating a database index?", options: ["Faster suitable lookups with storage and write overhead", "Every query becomes transactional", "Duplicates disappear automatically", "It replaces all primary keys"], answer: 0, explanation: "Indexes trade storage and maintenance for faster reads on matching access patterns." },
  { key: "sql-injection", difficulty: "Medium", topic: "Security", prompt: "Which approach best prevents SQL injection in normal application queries?", alternatePrompt: "How should application code normally send user values to SQL safely?", options: ["Parameterized queries", "String concatenation", "Hiding the port", "Base64-encoding SQL"], answer: 0, explanation: "Parameterized queries keep data separate from query syntax." },
  { key: "binary-search", difficulty: "Medium", topic: "Algorithms", prompt: "What is binary search's key requirement on an array?", alternatePrompt: "Before using binary search, what must be true about the data order?", options: ["It must be ordered by the search comparison", "It must contain strings only", "It must have length two", "It must be stored in SQL"], answer: 0, explanation: "Binary search relies on sorted order to discard half the search interval each step." },

  { key: "big-o-binary", difficulty: "Hard", topic: "Algorithms", prompt: "What is the worst-case time complexity of binary search on sorted data?", alternatePrompt: "Binary search halves a sorted search interval each step. What complexity follows?", options: ["O(log n)", "O(n)", "O(n log n)", "O(1)"], answer: 0, explanation: "Each comparison halves the remaining search interval." },
  { key: "merge-sort", difficulty: "Hard", topic: "Algorithms", prompt: "Which common comparison sort has O(n log n) worst-case time?", alternatePrompt: "Which standard sorting algorithm keeps O(n log n) worst-case complexity by dividing and merging?", options: ["Merge sort", "Bubble sort", "Insertion sort", "Selection sort"], answer: 0, explanation: "Merge sort performs logarithmic levels of linear-time merging." },
  { key: "memoization", difficulty: "Hard", topic: "Algorithms", prompt: "When is memoization most useful?", alternatePrompt: "Which problem shape benefits most from caching recursive results?", options: ["Overlapping subproblems whose results are reused", "Every call is unrelated", "No function returns a value", "Only string sorting"], answer: 0, explanation: "Caching repeated subproblem results avoids recomputing the same states." },
  { key: "stable-sort", difficulty: "Hard", topic: "Algorithms", prompt: "What distinguishes a stable sorting algorithm?", alternatePrompt: "What ordering guarantee does a stable sort give equal-key records?", options: ["Equal-key elements keep their relative order", "It uses no memory", "It always runs in O(n)", "It requires unique keys"], answer: 0, explanation: "Stability preserves original order among records with equal sort keys." },
  { key: "heap", difficulty: "Hard", topic: "Data structures", prompt: "What does a heap efficiently support?", alternatePrompt: "Which operation pattern makes a binary heap a good priority queue?", options: ["Extreme-priority access with logarithmic insertion/removal", "Constant-time arbitrary search", "Free sorted iteration", "Hash-key lookup"], answer: 0, explanation: "Heaps keep a minimum or maximum at the root and rebalance efficiently." },
  { key: "race", difficulty: "Hard", topic: "Concurrency", prompt: "What is a race condition?", alternatePrompt: "Which bug occurs when concurrent behavior depends on unsafe timing or interleaving?", options: ["Unsafely timing-dependent concurrent behavior", "A loop that runs quickly", "A CSS transition", "A sorted array"], answer: 0, explanation: "A race occurs when shared state can be observed or changed in unsafe interleavings." },
  { key: "deadlock", difficulty: "Hard", topic: "Concurrency", prompt: "What is a deadlock?", alternatePrompt: "What do we call a cycle where tasks wait on resources held by one another and cannot progress?", options: ["Tasks wait on each other so none can progress", "A successful callback", "A database index hit", "A cache refresh"], answer: 0, explanation: "Deadlock occurs when a cycle of waiting prevents progress." },
  { key: "normalization", difficulty: "Hard", topic: "Databases", prompt: "What does database normalization mainly try to reduce?", alternatePrompt: "Why split repeated facts into related tables during normalization?", options: ["Redundant data and update anomalies", "All indexes", "Every foreign key", "Transaction isolation"], answer: 0, explanation: "Normalization structures related facts to reduce duplication and inconsistent updates." },
  { key: "isolation", difficulty: "Hard", topic: "Databases", prompt: "What does transaction isolation address?", alternatePrompt: "Which transaction property controls how concurrent work can observe intermediate changes?", options: ["Visibility and anomalies between concurrent transactions", "Table naming", "HTTP caching", "Source formatting"], answer: 0, explanation: "Isolation levels control anomalies caused by concurrent transaction visibility." },
  { key: "hydration", difficulty: "Hard", topic: "Web", prompt: "What does hydration mean in a server-rendered React application?", alternatePrompt: "After React HTML is rendered on the server, what process attaches client interaction to it?", options: ["Attaching client-side behavior to server-rendered markup", "Compressing CSS", "Creating a database replica", "Converting HTTP to FTP"], answer: 0, explanation: "Hydration reconciles server HTML with client component logic so it becomes interactive." },
  { key: "stale-closure", difficulty: "Hard", topic: "JavaScript", prompt: "What problem can a stale closure cause?", alternatePrompt: "A callback keeps reading a value from an older render. Which concept explains this?", options: ["A callback reads values captured from an older scope", "HTML becomes XML", "SQL automatically rolls back", "A Git branch is deleted"], answer: 0, explanation: "Closures capture bindings from their creation context, which can be stale relative to later state." },
  { key: "etag", difficulty: "Hard", topic: "HTTP", prompt: "Why are cache validators such as ETag useful?", alternatePrompt: "How can an ETag reduce network transfer for unchanged content?", options: ["It enables conditional requests for unchanged content", "It encrypts cookies", "It replaces DNS", "It guarantees zero latency"], answer: 0, explanation: "Validators let clients ask whether a cached representation is still current." },
  { key: "auth", difficulty: "Hard", topic: "Security", prompt: "What is the main difference between authentication and authorization?", alternatePrompt: "Which statement correctly separates identity checking from permission checking?", options: ["Authentication verifies identity; authorization decides permissions", "Authentication encrypts; authorization compresses", "They are always identical", "Authorization happens only in databases"], answer: 0, explanation: "Identity verification and permission decisions are separate concerns." },
  { key: "least-privilege", difficulty: "Hard", topic: "Security", prompt: "What is the principle of least privilege?", alternatePrompt: "Which permission strategy best limits damage if an account is compromised?", options: ["Grant only permissions required for the task", "Give everyone administrator access", "Store secrets in source control", "Disable logging"], answer: 0, explanation: "Limiting permissions reduces the impact of mistakes and compromise." },
  { key: "xss-encoding", difficulty: "Hard", topic: "Security", prompt: "Why is output encoding important when rendering untrusted text into HTML?", alternatePrompt: "What is a key defense when untrusted data must be inserted into an HTML context?", options: ["Prevent data from being interpreted as active markup or script", "Hash passwords", "Improve SQL indexes", "Disable HTTPS"], answer: 0, explanation: "Context-appropriate encoding is a core defense against injection such as XSS." },
  { key: "idempotency", difficulty: "Hard", topic: "Architecture", prompt: "Why is idempotency useful in distributed systems?", alternatePrompt: "Which property lets a client safely retry an uncertain request without duplicating its intended effect?", options: ["Safe retries without applying the same effect multiple times", "Every operation becomes read-only", "All network failures disappear", "Transactions are unnecessary"], answer: 0, explanation: "Idempotent operations can be retried after uncertain failures without duplicating intended side effects." },
];

export const THEORY_QUESTIONS: readonly TheoryQuestion[] = THEORY_SEEDS.flatMap(
  (seed, index) => [
    {
      id: `${seed.difficulty[0].toLowerCase()}-${String(index + 1).padStart(2, "0")}-a`,
      difficulty: seed.difficulty,
      topic: seed.topic,
      prompt: seed.prompt,
      options: seed.options,
      answer: seed.answer,
      explanation: seed.explanation,
    },
    {
      id: `${seed.difficulty[0].toLowerCase()}-${String(index + 1).padStart(2, "0")}-b`,
      difficulty: seed.difficulty,
      topic: seed.topic,
      prompt: seed.alternatePrompt,
      options: seed.options,
      answer: seed.answer,
      explanation: seed.explanation,
    },
  ],
);

function shuffled<T>(items: readonly T[], random: () => number): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index--) {
    const swap = Math.floor(random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

export function pickTheoryQuestions(
  count = 10,
  random: () => number = Math.random,
): TheoryQuestion[] {
  const requested = Math.max(1, Math.min(count, THEORY_QUESTIONS.length));
  const base = Math.floor(requested / 3);
  const remainder = requested % 3;
  const quotas: Record<TheoryDifficulty, number> = {
    Easy: base + (remainder > 0 ? 1 : 0),
    Medium: base + (remainder > 1 ? 1 : 0),
    Hard: base,
  };

  const selected = (["Easy", "Medium", "Hard"] as const).flatMap(
    (difficulty) =>
      shuffled(
        THEORY_QUESTIONS.filter((question) => question.difficulty === difficulty),
        random,
      ).slice(0, quotas[difficulty]),
  );

  return shuffled(selected, random);
}
