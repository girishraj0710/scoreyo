#!/usr/bin/env tsx
/**
 * GATE-CS Seeding - Batch 2
 * Additional 60+ questions to reach 200+ total
 */
import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";

// Load environment variables
const envFile = readFileSync(join(process.cwd(), ".env.local"), "utf-8");
envFile.split("\n").forEach((line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    const [, key, value] = match;
    process.env[key.trim()] = value.trim().replace(/^["']|["']$/g, "");
  }
});

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const batch2Questions = [
  // Computer Organization & Architecture (15 questions)
  {
    topic: "Cache Memory",
    question: "A 4-way set associative cache has 128 sets and a block size of 64 bytes. What is the total cache size?",
    options: ["16 KB", "32 KB", "64 KB", "128 KB"],
    correctAnswer: 1,
    explanation: "Total size = Ways × Sets × Block size = 4 × 128 × 64 bytes = 32,768 bytes = 32 KB",
    difficulty: "medium",
  },
  {
    topic: "Pipelining",
    question: "A 5-stage pipeline has stage delays of 100ns, 120ns, 80ns, 90ns, 110ns. What is the pipeline clock period?",
    options: ["80 ns", "100 ns", "120 ns", "500 ns"],
    correctAnswer: 2,
    explanation: "Pipeline clock period is determined by the slowest stage = max(100, 120, 80, 90, 110) = 120 ns",
    difficulty: "medium",
  },
  {
    topic: "Memory Hierarchy",
    question: "Which memory type has the fastest access time?",
    options: ["Cache", "Main Memory", "Hard Disk", "Registers"],
    correctAnswer: 3,
    explanation: "Registers are located inside the CPU and have the fastest access time (< 1 ns), followed by cache, main memory, and disk storage.",
    difficulty: "easy",
  },
  {
    topic: "Instruction Set Architecture",
    question: "In a 32-bit RISC architecture, what is the maximum addressable memory if byte addressing is used?",
    options: ["2 GB", "4 GB", "8 GB", "16 GB"],
    correctAnswer: 1,
    explanation: "With 32-bit addressing and byte addressing, maximum addressable memory = 2³² bytes = 4 GB",
    difficulty: "easy",
  },
  {
    topic: "Pipelining Hazards",
    question: "What type of hazard occurs when an instruction depends on the result of a previous instruction?",
    options: ["Structural hazard", "Data hazard", "Control hazard", "Cache hazard"],
    correctAnswer: 1,
    explanation: "Data hazards (RAW - Read After Write) occur when an instruction needs data from a previous instruction that hasn't completed execution.",
    difficulty: "easy",
  },
  {
    topic: "Cache Mapping",
    question: "In direct-mapped cache, if a memory address maps to an occupied cache line, what happens?",
    options: ["Block allocation", "Cache miss", "Line replacement", "Split allocation"],
    correctAnswer: 2,
    explanation: "In direct-mapped cache, each memory block maps to exactly one cache line. If occupied, the old block is replaced (conflict miss).",
    difficulty: "medium",
  },
  {
    topic: "Virtual Memory",
    question: "Page table entries typically contain a valid/invalid bit. What does the invalid bit indicate?",
    options: ["Page is on disk", "Page is corrupted", "Page is read-only", "Page is shared"],
    correctAnswer: 0,
    explanation: "Invalid bit indicates the page is not currently in physical memory (either on disk or never allocated).",
    difficulty: "easy",
  },
  {
    topic: "Boolean Algebra",
    question: "Simplify: A'B + AB' + AB",
    options: ["A + B", "AB", "A'B'", "A ⊕ B"],
    correctAnswer: 0,
    explanation: "A'B + AB' + AB = A'B + AB' + AB = A'B + B(A' + A) = A'B + B = B(A' + 1) = B + AB' = B + A(B' + B) = B + A = A + B",
    difficulty: "medium",
  },
  {
    topic: "Number Systems",
    question: "What is the 2's complement representation of -5 in 8-bit binary?",
    options: ["10000101", "11111011", "00000101", "01111011"],
    correctAnswer: 1,
    explanation: "5 in binary = 00000101. 1's complement = 11111010. Add 1: 11111011 (2's complement of -5)",
    difficulty: "easy",
  },
  {
    topic: "Logic Gates",
    question: "Which gate combination is equivalent to a NAND gate?",
    options: ["OR followed by NOT", "AND followed by NOT", "NOR followed by NOT", "XOR followed by NOT"],
    correctAnswer: 1,
    explanation: "NAND = NOT(AND). It outputs 0 only when all inputs are 1, otherwise outputs 1.",
    difficulty: "easy",
  },
  {
    topic: "DMA",
    question: "What is the main advantage of Direct Memory Access (DMA)?",
    options: ["Faster CPU", "More memory", "CPU-free data transfer", "Better graphics"],
    correctAnswer: 2,
    explanation: "DMA allows peripheral devices to transfer data directly to/from memory without CPU intervention, freeing the CPU for other tasks.",
    difficulty: "easy",
  },
  {
    topic: "Interrupt Handling",
    question: "What happens when a higher priority interrupt arrives while servicing a lower priority interrupt?",
    options: ["Ignored", "Queued", "Preempts current ISR", "Causes error"],
    correctAnswer: 2,
    explanation: "In nested interrupt systems, higher priority interrupts can preempt (interrupt) the ISR of lower priority interrupts.",
    difficulty: "medium",
  },
  {
    topic: "Addressing Modes",
    question: "In which addressing mode is the operand part of the instruction itself?",
    options: ["Direct", "Indirect", "Immediate", "Register"],
    correctAnswer: 2,
    explanation: "Immediate addressing mode has the actual operand value embedded in the instruction itself (e.g., MOV AX, 5).",
    difficulty: "easy",
  },
  {
    topic: "Flynn's Taxonomy",
    question: "What does SIMD stand for in computer architecture?",
    options: ["Single Instruction Multiple Data", "Single Input Multiple Devices", "Serial Instruction Memory Device", "Synchronized Internal Memory Drive"],
    correctAnswer: 0,
    explanation: "SIMD = Single Instruction Multiple Data. One instruction operates on multiple data elements simultaneously (vector processing).",
    difficulty: "easy",
  },
  {
    topic: "Amdahl's Law",
    question: "If 30% of a program can be parallelized and the rest is serial, what is the maximum speedup with infinite processors?",
    options: ["1.43", "2.0", "3.33", "10.0"],
    correctAnswer: 0,
    explanation: "Using Amdahl's Law: Speedup = 1 / ((1 - P) + P/S) = 1 / (0.7 + 0.3/∞) = 1 / 0.7 ≈ 1.43",
    difficulty: "hard",
  },

  // Theory of Computation (15 questions)
  {
    topic: "Regular Languages",
    question: "Which of the following languages is NOT regular?",
    options: ["a*b*", "{a^n b^n | n ≥ 0}", "(a+b)*", "a*b+c*"],
    correctAnswer: 1,
    explanation: "{a^n b^n | n ≥ 0} requires counting/memory beyond finite states (context-free language). Regular languages cannot match equal counts.",
    difficulty: "easy",
  },
  {
    topic: "Finite Automata",
    question: "A DFA with n states can recognize at most how many distinct strings of length k?",
    options: ["n^k", "k^n", "2^k", "nk"],
    correctAnswer: 2,
    explanation: "For any DFA, the number of distinct strings of length k over an alphabet of size 2 is 2^k (independent of number of states).",
    difficulty: "medium",
  },
  {
    topic: "Context-Free Grammars",
    question: "Which form of grammar has productions like A → aB or A → a?",
    options: ["Chomsky Normal Form", "Right Linear", "Left Linear", "Greibach Normal Form"],
    correctAnswer: 1,
    explanation: "Right linear grammars have productions A → aB or A → a (terminal followed by optional non-terminal). These generate regular languages.",
    difficulty: "medium",
  },
  {
    topic: "Pumping Lemma",
    question: "The pumping lemma is used to prove that a language is:",
    options: ["Regular", "Context-free", "NOT regular", "NOT context-free"],
    correctAnswer: 2,
    explanation: "Pumping lemma is a necessary condition for regularity. It's used to prove a language is NOT regular by showing it violates the lemma.",
    difficulty: "easy",
  },
  {
    topic: "Turing Machines",
    question: "What is the halting problem?",
    options: ["Finding loop termination", "Determining if a TM halts on given input", "Stopping infinite recursion", "Debugging runtime errors"],
    correctAnswer: 1,
    explanation: "The halting problem asks whether a Turing machine will halt on a given input. Alan Turing proved this is undecidable.",
    difficulty: "easy",
  },
  {
    topic: "Chomsky Hierarchy",
    question: "Which type of automaton recognizes context-free languages?",
    options: ["Finite Automaton", "Pushdown Automaton", "Linear Bounded Automaton", "Turing Machine"],
    correctAnswer: 1,
    explanation: "Pushdown Automata (PDA) with a stack can recognize context-free languages. FAs are too weak, TMs are more powerful.",
    difficulty: "easy",
  },
  {
    topic: "NFA to DFA",
    question: "An NFA with n states can be converted to a DFA with at most how many states?",
    options: ["n", "n²", "2^n", "n!"],
    correctAnswer: 2,
    explanation: "DFA states represent subsets of NFA states. Maximum = power set size = 2^n (though practical conversions often use fewer).",
    difficulty: "medium",
  },
  {
    topic: "Closure Properties",
    question: "Regular languages are closed under which operation?",
    options: ["Union", "Intersection", "Complement", "All of these"],
    correctAnswer: 3,
    explanation: "Regular languages are closed under union, intersection, complement, concatenation, and Kleene star (all regular operations).",
    difficulty: "easy",
  },
  {
    topic: "Decidability",
    question: "Which problem is decidable?",
    options: ["Halting problem", "Post Correspondence Problem", "Membership in DFA", "Equivalence of two CFGs"],
    correctAnswer: 2,
    explanation: "Membership in DFA is decidable (can check if DFA accepts a string). Halting and PCP are undecidable. CFG equivalence is undecidable.",
    difficulty: "medium",
  },
  {
    topic: "Parse Trees",
    question: "What does an ambiguous grammar have?",
    options: ["No parse trees", "Multiple parse trees for some string", "Single parse tree", "No derivations"],
    correctAnswer: 1,
    explanation: "An ambiguous grammar can produce multiple distinct parse trees (leftmost derivations) for at least one string in the language.",
    difficulty: "easy",
  },
  {
    topic: "Regular Expressions",
    question: "What does the regular expression (a+b)*abb match?",
    options: ["Strings ending with abb", "Strings containing abb", "Strings starting with abb", "Only 'abb'"],
    correctAnswer: 0,
    explanation: "(a+b)* matches any sequence of a's and b's, followed by mandatory 'abb' at the end. So strings must end with 'abb'.",
    difficulty: "easy",
  },
  {
    topic: "Minimization",
    question: "What is the purpose of DFA minimization?",
    options: ["Remove unreachable states", "Merge equivalent states", "Convert NFA to DFA", "Optimize parsing"],
    correctAnswer: 1,
    explanation: "DFA minimization merges equivalent states (states that behave identically) to produce the smallest equivalent DFA.",
    difficulty: "easy",
  },
  {
    topic: "CYK Algorithm",
    question: "Which grammar form is required for the CYK parsing algorithm?",
    options: ["Any CFG", "Chomsky Normal Form", "Greibach Normal Form", "Regular grammar"],
    correctAnswer: 1,
    explanation: "CYK algorithm requires grammar in Chomsky Normal Form (CNF): productions are A → BC or A → a.",
    difficulty: "medium",
  },
  {
    topic: "Rice's Theorem",
    question: "Rice's theorem states that all non-trivial properties of Turing-recognizable languages are:",
    options: ["Decidable", "Undecidable", "Regular", "Context-free"],
    correctAnswer: 1,
    explanation: "Rice's theorem proves that any non-trivial semantic property of Turing-recognizable languages is undecidable.",
    difficulty: "hard",
  },
  {
    topic: "Lambda Calculus",
    question: "What does the lambda term λx.x represent?",
    options: ["Identity function", "Constant function", "Successor function", "Zero"],
    correctAnswer: 0,
    explanation: "λx.x is the identity function that returns its input unchanged (like f(x) = x).",
    difficulty: "easy",
  },

  // Advanced Algorithms (15 questions)
  {
    topic: "NP-Completeness",
    question: "If any NP-complete problem is solved in polynomial time, then:",
    options: ["P = NP", "P ≠ NP", "NP = NP-Hard", "No conclusion"],
    correctAnswer: 0,
    explanation: "If one NP-complete problem is in P, all NP problems can be reduced to it in poly-time, proving P = NP.",
    difficulty: "medium",
  },
  {
    topic: "Approximation Algorithms",
    question: "For the vertex cover problem, what is the approximation ratio of the 2-approximation algorithm?",
    options: ["1", "2", "log n", "n"],
    correctAnswer: 1,
    explanation: "The greedy matching-based vertex cover algorithm is a 2-approximation: it produces a solution at most twice the optimal size.",
    difficulty: "medium",
  },
  {
    topic: "String Matching",
    question: "What is the time complexity of the KMP string matching algorithm?",
    options: ["O(n²)", "O(nm)", "O(n + m)", "O(m log n)"],
    correctAnswer: 2,
    explanation: "KMP preprocesses pattern in O(m) and searches text in O(n), total O(n + m) where n = text length, m = pattern length.",
    difficulty: "easy",
  },
  {
    topic: "Network Flow",
    question: "What does the max-flow min-cut theorem state?",
    options: ["Max flow = Min cut capacity", "Max flow > Min cut", "Max flow < Min cut", "No relation"],
    correctAnswer: 0,
    explanation: "The max-flow min-cut theorem states that the maximum flow value equals the minimum cut capacity in a network.",
    difficulty: "easy",
  },
  {
    topic: "Backtracking",
    question: "Which problem is typically solved using backtracking?",
    options: ["Shortest path", "N-Queens", "Minimum spanning tree", "Binary search"],
    correctAnswer: 1,
    explanation: "N-Queens problem uses backtracking to place queens on a chessboard such that no two queens attack each other.",
    difficulty: "easy",
  },
  {
    topic: "Branch and Bound",
    question: "Branch and bound is primarily used for:",
    options: ["Sorting", "Searching", "Optimization problems", "Graph traversal"],
    correctAnswer: 2,
    explanation: "Branch and bound is used for optimization problems (TSP, knapsack) by systematically exploring solution space with bounding.",
    difficulty: "easy",
  },
  {
    topic: "Randomized Algorithms",
    question: "QuickSort with random pivot selection has expected time complexity:",
    options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
    correctAnswer: 0,
    explanation: "Randomized QuickSort has expected time complexity O(n log n) regardless of input, avoiding worst-case O(n²) on sorted data.",
    difficulty: "easy",
  },
  {
    topic: "Amortized Analysis",
    question: "In dynamic array doubling, what is the amortized cost per insertion?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctAnswer: 0,
    explanation: "Though occasional resize costs O(n), over n insertions total cost is O(n), giving amortized O(1) per insertion.",
    difficulty: "medium",
  },
  {
    topic: "Segment Trees",
    question: "What is the time complexity for range query in a segment tree?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: 1,
    explanation: "Segment tree supports range queries (sum, min, max) in O(log n) time by traversing at most 2 log n nodes.",
    difficulty: "easy",
  },
  {
    topic: "Trie",
    question: "What is the time complexity to insert a string of length k in a trie?",
    options: ["O(1)", "O(k)", "O(n)", "O(k log n)"],
    correctAnswer: 1,
    explanation: "Inserting a string of length k in a trie requires traversing/creating k nodes, one per character: O(k).",
    difficulty: "easy",
  },
  {
    topic: "Topological Sort",
    question: "Topological sorting is possible for:",
    options: ["Any graph", "Directed Acyclic Graphs", "Undirected graphs", "Cyclic graphs"],
    correctAnswer: 1,
    explanation: "Topological sort is only defined for Directed Acyclic Graphs (DAGs) - linear ordering where u→v implies u appears before v.",
    difficulty: "easy",
  },
  {
    topic: "Strongly Connected Components",
    question: "Which algorithm finds strongly connected components in linear time?",
    options: ["Dijkstra's", "Prim's", "Kosaraju's", "Kruskal's"],
    correctAnswer: 2,
    explanation: "Kosaraju's algorithm finds strongly connected components in O(V + E) using two DFS passes.",
    difficulty: "medium",
  },
  {
    topic: "Articulation Points",
    question: "An articulation point in a graph is:",
    options: ["Highest degree vertex", "Vertex whose removal increases components", "Root of DFS tree", "Bridge endpoint"],
    correctAnswer: 1,
    explanation: "Articulation point (cut vertex) is a vertex whose removal increases the number of connected components.",
    difficulty: "easy",
  },
  {
    topic: "Matrix Chain Multiplication",
    question: "Matrix chain multiplication is optimally solved using:",
    options: ["Greedy approach", "Dynamic programming", "Divide and conquer", "Backtracking"],
    correctAnswer: 1,
    explanation: "Matrix chain multiplication uses DP to find optimal parenthesization minimizing scalar multiplications: O(n³) time.",
    difficulty: "easy",
  },
  {
    topic: "Edit Distance",
    question: "The edit distance between 'CAT' and 'DOG' (allowing insert/delete/replace) is:",
    options: ["1", "2", "3", "4"],
    correctAnswer: 2,
    explanation: "CAT → DOG requires 3 replacements: C→D, A→O, T→G. Edit distance = 3 (computed via DP).",
    difficulty: "medium",
  },

  // Advanced DBMS (15 questions)
  {
    topic: "ACID Properties",
    question: "Which ACID property ensures that database remains in consistent state before and after transaction?",
    options: ["Atomicity", "Consistency", "Isolation", "Durability"],
    correctAnswer: 1,
    explanation: "Consistency ensures database transitions from one valid state to another, maintaining all defined rules and constraints.",
    difficulty: "easy",
  },
  {
    topic: "Isolation Levels",
    question: "Which isolation level allows dirty reads?",
    options: ["Read Uncommitted", "Read Committed", "Repeatable Read", "Serializable"],
    correctAnswer: 0,
    explanation: "Read Uncommitted is the lowest isolation level, allowing dirty reads (reading uncommitted changes from other transactions).",
    difficulty: "easy",
  },
  {
    topic: "2-Phase Locking",
    question: "In strict 2PL, when are exclusive locks released?",
    options: ["Immediately after use", "At commit/abort", "During growing phase", "During shrinking phase"],
    correctAnswer: 1,
    explanation: "Strict 2-Phase Locking holds all exclusive locks until transaction commit/abort to prevent cascading rollbacks.",
    difficulty: "medium",
  },
  {
    topic: "B+ Trees",
    question: "In B+ trees, all data records are stored in:",
    options: ["Root node", "Internal nodes", "Leaf nodes", "All nodes"],
    correctAnswer: 2,
    explanation: "B+ trees store all data records in leaf nodes. Internal nodes only store keys for navigation. Leaves are linked for range queries.",
    difficulty: "easy",
  },
  {
    topic: "Query Optimization",
    question: "Which join algorithm is most efficient for small tables that fit in memory?",
    options: ["Nested Loop Join", "Hash Join", "Sort-Merge Join", "Index Join"],
    correctAnswer: 1,
    explanation: "Hash join is most efficient for small-to-medium tables in memory: O(n + m) time, building hash table on smaller relation.",
    difficulty: "medium",
  },
  {
    topic: "Concurrency Control",
    question: "Timestamp ordering protocol resolves conflicts by:",
    options: ["Locking records", "Comparing transaction timestamps", "Using semaphores", "Rolling back all"],
    correctAnswer: 1,
    explanation: "Timestamp ordering assigns timestamps to transactions and enforces serializability by comparing read/write timestamps.",
    difficulty: "easy",
  },
  {
    topic: "Recovery",
    question: "In WAL (Write-Ahead Logging), what is written to log before database update?",
    options: ["Old value only", "New value only", "Both old and new values", "Transaction ID only"],
    correctAnswer: 2,
    explanation: "WAL writes both before-image (old value for undo) and after-image (new value for redo) to log before updating database.",
    difficulty: "medium",
  },
  {
    topic: "BCNF",
    question: "A relation is in BCNF if for every functional dependency X → Y:",
    options: ["X is a superkey", "Y is prime", "X → Y is trivial", "Both A and C"],
    correctAnswer: 3,
    explanation: "BCNF requires that for every non-trivial FD X → Y, X must be a superkey (stricter than 3NF).",
    difficulty: "medium",
  },
  {
    topic: "Distributed Databases",
    question: "Two-phase commit protocol is used for:",
    options: ["Query optimization", "Atomic commit in distributed systems", "Data replication", "Load balancing"],
    correctAnswer: 1,
    explanation: "2PC ensures atomic commit across multiple nodes: coordinator asks all participants to prepare, then commits if all agree.",
    difficulty: "easy",
  },
  {
    topic: "NoSQL",
    question: "Which NoSQL database model uses key-value pairs?",
    options: ["MongoDB", "Redis", "Neo4j", "Cassandra"],
    correctAnswer: 1,
    explanation: "Redis is a key-value store (in-memory cache). MongoDB is document store, Neo4j is graph, Cassandra is wide-column.",
    difficulty: "easy",
  },
  {
    topic: "OLAP vs OLTP",
    question: "OLAP systems are optimized for:",
    options: ["Transaction processing", "Analytical queries", "Concurrent updates", "Low latency writes"],
    correctAnswer: 1,
    explanation: "OLAP (Online Analytical Processing) is optimized for complex analytical queries, aggregations, and data warehousing.",
    difficulty: "easy",
  },
  {
    topic: "Sharding",
    question: "Horizontal sharding means:",
    options: ["Splitting columns", "Splitting rows across servers", "Adding more CPUs", "Vertical partitioning"],
    correctAnswer: 1,
    explanation: "Horizontal sharding (partitioning) splits rows across multiple database servers based on shard key.",
    difficulty: "easy",
  },
  {
    topic: "CAP Theorem",
    question: "CAP theorem states a distributed system can provide at most how many of Consistency, Availability, Partition tolerance?",
    options: ["1", "2", "3", "0"],
    correctAnswer: 1,
    explanation: "CAP theorem states distributed systems can guarantee at most 2 of 3: Consistency, Availability, Partition tolerance.",
    difficulty: "easy",
  },
  {
    topic: "Materialized Views",
    question: "What is the main advantage of materialized views?",
    options: ["Less storage", "Faster query performance", "Easier updates", "No maintenance"],
    correctAnswer: 1,
    explanation: "Materialized views pre-compute and store query results, significantly speeding up query performance at cost of storage and staleness.",
    difficulty: "easy",
  },
  {
    topic: "Denormalization",
    question: "When is denormalization typically used?",
    options: ["To eliminate redundancy", "To improve write performance", "To improve read performance", "To enforce constraints"],
    correctAnswer: 2,
    explanation: "Denormalization introduces redundancy to improve read performance by reducing joins, trading off write complexity and storage.",
    difficulty: "easy",
  },
];

async function seedBatch2() {
  console.log("=".repeat(70));
  console.log("🚀 GATE-CS SEEDING - BATCH 2");
  console.log("=".repeat(70));

  // Count existing questions
  const beforeCount = await db.execute({
    sql: "SELECT COUNT(*) as count FROM exam_questions WHERE exam_id = 'gate-cs'",
  });
  console.log(`\n📊 Current GATE-CS questions: ${beforeCount.rows[0].count}`);

  let inserted = 0;
  let skipped = 0;

  for (const q of batch2Questions) {
    try {
      // Check for duplicate
      const existing = await db.execute({
        sql: `SELECT id FROM exam_questions
              WHERE exam_id = 'gate-cs'
              AND subject_id = 'gate-cs'
              AND question = ?`,
        args: [q.question],
      });

      if (existing.rows.length > 0) {
        skipped++;
        continue;
      }

      // Insert question
      await db.execute({
        sql: `INSERT INTO exam_questions
              (exam_id, subject_id, topic, question, options, correct_answer,
               explanation, difficulty, source)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          "gate-cs",
          "gate-cs",
          q.topic,
          q.question,
          JSON.stringify(q.options),
          q.correctAnswer,
          q.explanation,
          q.difficulty,
          "verified",
        ],
      });
      inserted++;
    } catch (err) {
      console.error(`Failed to insert question: ${q.topic}`, err);
    }
  }

  // Final count
  const afterCount = await db.execute({
    sql: "SELECT COUNT(*) as count FROM exam_questions WHERE exam_id = 'gate-cs'",
  });

  console.log("\n✅ Batch 2 Seeding Complete!");
  console.log(`   Before:  ${beforeCount.rows[0].count} questions`);
  console.log(`   Inserted: ${inserted} questions`);
  console.log(`   Skipped:  ${skipped} duplicates`);
  console.log(`   After:   ${afterCount.rows[0].count} questions`);

  // Topic breakdown
  const topicStats = await db.execute({
    sql: `SELECT topic, COUNT(*) as count
          FROM exam_questions
          WHERE exam_id = 'gate-cs'
          GROUP BY topic
          ORDER BY count DESC, topic`,
  });

  console.log("\n📋 Topic Breakdown:");
  topicStats.rows.forEach((row: any) => {
    console.log(`   ${row.topic.padEnd(40)} ${row.count} Q`);
  });

  console.log("\n" + "=".repeat(70));
}

seedBatch2()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Batch 2 seeding failed:", err);
    process.exit(1);
  });
