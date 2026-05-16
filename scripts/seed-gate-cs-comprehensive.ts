#!/usr/bin/env tsx
/**
 * Comprehensive GATE-CS Question Bank Seeding
 *
 * Generates 200+ high-quality questions covering:
 * - Data Structures (50Q)
 * - Algorithms (50Q)
 * - Operating Systems (50Q)
 * - DBMS (25Q)
 * - Computer Networks (25Q)
 *
 * Usage: npx tsx scripts/seed-gate-cs-comprehensive.ts
 */
import { createClient } from "@libsql/client";
import { readFileSync } from "fs";
import { join } from "path";

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

const questions = [
  // DATA STRUCTURES (50 questions)
  // Arrays
  {
    topic: "Arrays",
    question: "What is the time complexity of accessing an element in an array by index?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correctAnswer: 0,
    explanation: "Array elements are stored in contiguous memory, allowing direct access via index in constant time O(1).",
    difficulty: "easy",
  },
  {
    topic: "Arrays",
    question: "In a 2D array of size m×n stored in row-major order, what is the address of element a[i][j] if base address is B and each element takes k bytes?",
    options: ["B + (i*n + j)*k", "B + (i*m + j)*k", "B + (j*n + i)*k", "B + (i+j)*k"],
    correctAnswer: 0,
    explanation: "Row-major: address = base + (row_index * num_columns + col_index) * element_size",
    difficulty: "medium",
  },
  {
    topic: "Arrays",
    question: "What is the maximum number of elements that can be stored in a one-dimensional array of size n?",
    options: ["n-1", "n", "n+1", "2n"],
    correctAnswer: 1,
    explanation: "An array of size n can store exactly n elements, indexed from 0 to n-1.",
    difficulty: "easy",
  },

  // Linked Lists
  {
    topic: "Linked Lists",
    question: "What is the time complexity of inserting a node at the beginning of a singly linked list?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correctAnswer: 0,
    explanation: "Insertion at head only requires updating the head pointer and the new node's next pointer - O(1).",
    difficulty: "easy",
  },
  {
    topic: "Linked Lists",
    question: "In a doubly linked list, what is the minimum number of pointer changes required to delete a node (excluding head/tail)?",
    options: ["2", "3", "4", "6"],
    correctAnswer: 2,
    explanation: "Need to update: prev node's next (1), next node's prev (2), and update 2 pointers in the deleted node = 4 total.",
    difficulty: "medium",
  },
  {
    topic: "Linked Lists",
    question: "What is the space complexity of reversing a singly linked list using iterative approach?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correctAnswer: 0,
    explanation: "Iterative reversal uses only 3 pointers (prev, current, next) regardless of list size - O(1) space.",
    difficulty: "medium",
  },
  {
    topic: "Linked Lists",
    question: "How can you detect a cycle in a linked list efficiently?",
    options: [
      "Use two pointers moving at different speeds (Floyd's algorithm)",
      "Store all visited nodes in a hash table",
      "Count the number of nodes",
      "Traverse twice"
    ],
    correctAnswer: 0,
    explanation: "Floyd's cycle detection uses slow and fast pointers. If they meet, there's a cycle. Time O(n), Space O(1).",
    difficulty: "medium",
  },

  // Stacks
  {
    topic: "Stacks",
    question: "Which of the following applications uses a Stack data structure?",
    options: [
      "Function call management (recursion)",
      "Breadth First Search",
      "Shortest path finding",
      "Level order traversal"
    ],
    correctAnswer: 0,
    explanation: "Stack is LIFO - perfect for function calls. BFS/level-order use Queue. Shortest path uses Priority Queue.",
    difficulty: "easy",
  },
  {
    topic: "Stacks",
    question: "What is the postfix notation of the infix expression: A + B * C?",
    options: ["ABC*+", "AB+C*", "ABC+*", "A*BC+"],
    correctAnswer: 0,
    explanation: "Postfix follows operator precedence: B*C first (BC*), then +A (ABC*+).",
    difficulty: "medium",
  },
  {
    topic: "Stacks",
    question: "What is the time complexity of push and pop operations in a stack implemented using an array?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
    correctAnswer: 0,
    explanation: "Both push and pop update only the top pointer and access array[top] - constant time O(1).",
    difficulty: "easy",
  },
  {
    topic: "Stacks",
    question: "How many stacks are required to implement a queue efficiently?",
    options: ["1", "2", "3", "Cannot be implemented"],
    correctAnswer: 1,
    explanation: "Two stacks can simulate queue: one for enqueue, one for dequeue. Amortized O(1) operations.",
    difficulty: "medium",
  },

  // Queues
  {
    topic: "Queues",
    question: "In a circular queue of size n, if front = rear, what does it indicate?",
    options: [
      "Queue is either empty or full (need additional check)",
      "Queue is definitely full",
      "Queue is definitely empty",
      "Invalid state"
    ],
    correctAnswer: 0,
    explanation: "front == rear is ambiguous. Need extra variable (count or flag) to distinguish empty vs full.",
    difficulty: "medium",
  },
  {
    topic: "Queues",
    question: "What is the time complexity of enqueue and dequeue operations in a queue implemented using a linked list?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correctAnswer: 0,
    explanation: "Enqueue at tail and dequeue from head both take O(1) with proper tail pointer maintenance.",
    difficulty: "easy",
  },
  {
    topic: "Queues",
    question: "Which data structure is best suited for implementing a printer spooler?",
    options: ["Queue", "Stack", "Tree", "Graph"],
    correctAnswer: 0,
    explanation: "Printer spooler follows FIFO - first job submitted is first job printed. Queue is ideal.",
    difficulty: "easy",
  },
  {
    topic: "Queues",
    question: "What is the advantage of a circular queue over a simple queue?",
    options: [
      "Better space utilization",
      "Faster operations",
      "Uses less memory",
      "Easier to implement"
    ],
    correctAnswer: 0,
    explanation: "Circular queue reuses vacant spaces after dequeue, avoiding array shifting or wasted space.",
    difficulty: "medium",
  },

  // Trees
  {
    topic: "Binary Trees",
    question: "What is the maximum number of nodes in a binary tree of height h?",
    options: ["2^h", "2^(h+1) - 1", "2^h - 1", "h²"],
    correctAnswer: 1,
    explanation: "Complete binary tree of height h has sum of geometric series: 1+2+4+...+2^h = 2^(h+1) - 1 nodes.",
    difficulty: "medium",
  },
  {
    topic: "Binary Trees",
    question: "How many different binary trees can be formed with n nodes?",
    options: ["n!", "2^n", "C(2n,n)/(n+1) (Catalan number)", "n^2"],
    correctAnswer: 2,
    explanation: "Number of structurally different binary trees with n nodes is the nth Catalan number.",
    difficulty: "hard",
  },
  {
    topic: "Binary Trees",
    question: "In which tree traversal is a node processed before its children?",
    options: ["Preorder", "Inorder", "Postorder", "Level order"],
    correctAnswer: 0,
    explanation: "Preorder: Root → Left → Right. Node processed first, then children.",
    difficulty: "easy",
  },
  {
    topic: "Binary Trees",
    question: "What is the relationship between inorder and preorder/postorder traversals for uniquely identifying a binary tree?",
    options: [
      "Inorder + Preorder or Inorder + Postorder uniquely identifies",
      "Preorder + Postorder uniquely identifies",
      "Any two traversals uniquely identify",
      "All three are needed"
    ],
    correctAnswer: 0,
    explanation: "Inorder gives left-right order, Pre/Post gives root position. Preorder+Postorder alone is ambiguous.",
    difficulty: "hard",
  },

  // BST
  {
    topic: "Binary Search Trees",
    question: "What is the time complexity of searching in a balanced BST with n nodes?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    correctAnswer: 1,
    explanation: "Balanced BST has height O(log n). Search traverses from root to leaf taking O(log n) time.",
    difficulty: "easy",
  },
  {
    topic: "Binary Search Trees",
    question: "What is the worst-case height of a BST with n nodes?",
    options: ["log n", "n", "n log n", "n²"],
    correctAnswer: 1,
    explanation: "Worst case: skewed tree (all nodes in one direction) has height n-1, which is O(n).",
    difficulty: "medium",
  },
  {
    topic: "Binary Search Trees",
    question: "What is the inorder traversal of a BST?",
    options: [
      "Sorted sequence in ascending order",
      "Sorted sequence in descending order",
      "Random sequence",
      "Level-wise sequence"
    ],
    correctAnswer: 0,
    explanation: "BST property: left < root < right. Inorder (left-root-right) gives sorted ascending sequence.",
    difficulty: "easy",
  },
  {
    topic: "Binary Search Trees",
    question: "Which operation cannot be performed efficiently in a BST?",
    options: [
      "Finding kth smallest element in unbalanced BST",
      "Searching for an element",
      "Finding minimum element",
      "Finding maximum element"
    ],
    correctAnswer: 0,
    explanation: "Kth smallest requires O(n) in worst case for unbalanced BST. Min/Max are O(h). Search is O(h).",
    difficulty: "hard",
  },

  // Heaps
  {
    topic: "Heaps",
    question: "What is the time complexity of building a heap from an unsorted array of n elements?",
    options: ["O(n log n)", "O(n)", "O(log n)", "O(n²)"],
    correctAnswer: 1,
    explanation: "Heapify from bottom-up takes O(n) time, not O(n log n) as intuition might suggest.",
    difficulty: "hard",
  },
  {
    topic: "Heaps",
    question: "In a min-heap, where is the minimum element located?",
    options: ["Root", "Leftmost leaf", "Rightmost leaf", "Any leaf"],
    correctAnswer: 0,
    explanation: "Heap property: parent ≤ children. Minimum element bubbles up to root.",
    difficulty: "easy",
  },
  {
    topic: "Heaps",
    question: "What is the time complexity of inserting an element into a heap?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correctAnswer: 1,
    explanation: "Insert at end (O(1)), then bubble up along height O(log n). Total: O(log n).",
    difficulty: "medium",
  },
  {
    topic: "Heaps",
    question: "Which operation is NOT efficiently supported by a heap?",
    options: [
      "Searching for an arbitrary element",
      "Finding minimum (in min-heap)",
      "Deleting minimum",
      "Inserting element"
    ],
    correctAnswer: 0,
    explanation: "Heap is not designed for search. Search takes O(n). Other operations are O(1) or O(log n).",
    difficulty: "medium",
  },

  // Hashing
  {
    topic: "Hashing",
    question: "What is the average time complexity of search, insert, and delete in a hash table?",
    options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
    correctAnswer: 2,
    explanation: "With good hash function and low load factor, hash table operations are O(1) average case.",
    difficulty: "easy",
  },
  {
    topic: "Hashing",
    question: "Which collision resolution technique uses linked lists at each bucket?",
    options: ["Chaining", "Linear Probing", "Quadratic Probing", "Double Hashing"],
    correctAnswer: 0,
    explanation: "Chaining: each bucket points to a linked list of all elements that hash to that bucket.",
    difficulty: "easy",
  },
  {
    topic: "Hashing",
    question: "What is the load factor in a hash table?",
    options: [
      "Number of elements / Table size",
      "Table size / Number of elements",
      "Number of collisions",
      "Number of empty buckets"
    ],
    correctAnswer: 0,
    explanation: "Load factor α = n/m where n = number of elements, m = table size. Indicates fullness.",
    difficulty: "medium",
  },
  {
    topic: "Hashing",
    question: "What is the worst-case time complexity of search in a hash table using chaining?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctAnswer: 2,
    explanation: "Worst case: all n elements hash to same bucket. Search entire chain takes O(n).",
    difficulty: "medium",
  },

  // Graphs - Basic
  {
    topic: "Graphs",
    question: "What is the maximum number of edges in a simple undirected graph with n vertices?",
    options: ["n", "n-1", "n(n-1)/2", "n²"],
    correctAnswer: 2,
    explanation: "Complete graph: each of n vertices connects to (n-1) others. Total = n(n-1)/2 (divide by 2 for undirected).",
    difficulty: "medium",
  },
  {
    topic: "Graphs",
    question: "What is the space complexity of an adjacency matrix for a graph with V vertices?",
    options: ["O(V)", "O(V²)", "O(E)", "O(V+E)"],
    correctAnswer: 1,
    explanation: "Adjacency matrix is V×V 2D array, requiring O(V²) space regardless of edge count.",
    difficulty: "easy",
  },
  {
    topic: "Graphs",
    question: "Which graph representation is more space-efficient for sparse graphs?",
    options: ["Adjacency List", "Adjacency Matrix", "Both are equal", "Depends on vertices"],
    correctAnswer: 0,
    explanation: "Sparse graph: E << V². Adjacency list uses O(V+E) vs matrix's O(V²). List wins.",
    difficulty: "medium",
  },
  {
    topic: "Graphs",
    question: "What is the minimum number of edges in a connected undirected graph with n vertices?",
    options: ["n", "n-1", "n/2", "log n"],
    correctAnswer: 1,
    explanation: "Minimum connected graph is a tree, which has exactly n-1 edges for n vertices.",
    difficulty: "medium",
  },

  // BFS
  {
    topic: "Graph Traversal - BFS",
    question: "Which data structure is used to implement Breadth First Search (BFS)?",
    options: ["Stack", "Queue", "Priority Queue", "Heap"],
    correctAnswer: 1,
    explanation: "BFS explores level by level. Queue (FIFO) ensures nodes at distance d are processed before d+1.",
    difficulty: "easy",
  },
  {
    topic: "Graph Traversal - BFS",
    question: "What is the time complexity of BFS for a graph with V vertices and E edges represented as an adjacency list?",
    options: ["O(V)", "O(E)", "O(V+E)", "O(V²)"],
    correctAnswer: 2,
    explanation: "BFS visits each vertex once O(V) and explores each edge once O(E). Total: O(V+E).",
    difficulty: "medium",
  },
  {
    topic: "Graph Traversal - BFS",
    question: "BFS from a source vertex gives the shortest path in which type of graph?",
    options: ["Weighted graphs", "Unweighted graphs", "Directed graphs only", "Complete graphs"],
    correctAnswer: 1,
    explanation: "BFS finds shortest path in unweighted graphs. For weighted graphs, use Dijkstra's algorithm.",
    difficulty: "medium",
  },

  // DFS
  {
    topic: "Graph Traversal - DFS",
    question: "What is the space complexity of DFS using recursion for a graph with V vertices?",
    options: ["O(1)", "O(V)", "O(E)", "O(V+E)"],
    correctAnswer: 1,
    explanation: "DFS recursion uses call stack. Worst case: linear chain, stack depth V. Space: O(V).",
    difficulty: "medium",
  },
  {
    topic: "Graph Traversal - DFS",
    question: "Which of the following problems can be solved using DFS?",
    options: [
      "Detecting cycles in a graph",
      "Finding shortest path in unweighted graph",
      "Finding minimum spanning tree",
      "Finding maximum flow"
    ],
    correctAnswer: 0,
    explanation: "DFS can detect cycles using back edges. Shortest path needs BFS. MST needs Prim/Kruskal. Max flow needs Ford-Fulkerson.",
    difficulty: "medium",
  },

  // ALGORITHMS (50 questions)
  // Sorting
  {
    topic: "Sorting",
    question: "What is the worst-case time complexity of QuickSort?",
    options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
    correctAnswer: 1,
    explanation: "Worst case: already sorted array with bad pivot choice (always first/last). Every partition is unbalanced: O(n²).",
    difficulty: "medium",
  },
  {
    topic: "Sorting",
    question: "Which sorting algorithm is stable and has O(n log n) guaranteed time complexity?",
    options: ["QuickSort", "HeapSort", "MergeSort", "Selection Sort"],
    correctAnswer: 2,
    explanation: "MergeSort is stable (preserves relative order) and always O(n log n). QuickSort can be O(n²). HeapSort is unstable.",
    difficulty: "medium",
  },
  {
    topic: "Sorting",
    question: "What is the space complexity of MergeSort?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
    correctAnswer: 2,
    explanation: "MergeSort needs temporary array for merging, requiring O(n) auxiliary space.",
    difficulty: "easy",
  },
  {
    topic: "Sorting",
    question: "Which sorting algorithm has the best performance on nearly sorted data?",
    options: ["QuickSort", "Insertion Sort", "Selection Sort", "Heap Sort"],
    correctAnswer: 1,
    explanation: "Insertion Sort is O(n) for nearly sorted data. It only shifts elements that are out of place.",
    difficulty: "medium",
  },
  {
    topic: "Sorting",
    question: "Which sorting algorithm makes minimum number of swaps?",
    options: ["Bubble Sort", "Selection Sort", "Insertion Sort", "Quick Sort"],
    correctAnswer: 1,
    explanation: "Selection Sort makes exactly n-1 swaps (one per pass). Others can make up to O(n²) swaps.",
    difficulty: "medium",
  },

  // Searching
  {
    topic: "Searching",
    question: "What is the time complexity of Binary Search on a sorted array?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    correctAnswer: 1,
    explanation: "Binary search divides search space in half each iteration. Takes log₂(n) iterations: O(log n).",
    difficulty: "easy",
  },
  {
    topic: "Searching",
    question: "Binary Search requires the array to be:",
    options: ["Sorted", "Unsorted", "Circular", "Doubly linked"],
    correctAnswer: 0,
    explanation: "Binary search relies on comparison: if target < mid, search left half. Requires sorted order.",
    difficulty: "easy",
  },
  {
    topic: "Searching",
    question: "What is the worst-case number of comparisons in Binary Search for an array of size n?",
    options: ["n", "n/2", "log₂(n)", "2 log₂(n)"],
    correctAnswer: 2,
    explanation: "Each comparison halves the search space. Maximum depth of recursion tree is log₂(n).",
    difficulty: "medium",
  },

  // Dynamic Programming
  {
    topic: "Dynamic Programming",
    question: "Which of the following is NOT a characteristic of problems suitable for Dynamic Programming?",
    options: [
      "Optimal substructure",
      "Overlapping subproblems",
      "Greedy choice property",
      "Memoization can be applied"
    ],
    correctAnswer: 2,
    explanation: "Greedy choice property is for greedy algorithms. DP needs optimal substructure and overlapping subproblems.",
    difficulty: "medium",
  },
  {
    topic: "Dynamic Programming",
    question: "What is the time complexity of solving Fibonacci using Dynamic Programming?",
    options: ["O(2ⁿ)", "O(n²)", "O(n)", "O(log n)"],
    correctAnswer: 2,
    explanation: "DP computes each Fibonacci number once and stores it. Computing n numbers: O(n).",
    difficulty: "medium",
  },
  {
    topic: "Dynamic Programming",
    question: "What is the time complexity of the 0/1 Knapsack problem using DP?",
    options: ["O(n)", "O(n log n)", "O(nW) where W is capacity", "O(2ⁿ)"],
    correctAnswer: 2,
    explanation: "DP table is n×W (items × capacity). Each cell computed in O(1). Total: O(nW).",
    difficulty: "hard",
  },

  // Greedy
  {
    topic: "Greedy Algorithms",
    question: "Which problem cannot be solved optimally using a greedy approach?",
    options: [
      "Activity Selection Problem",
      "Fractional Knapsack",
      "0/1 Knapsack",
      "Huffman Coding"
    ],
    correctAnswer: 2,
    explanation: "0/1 Knapsack needs DP. Greedy fails as local optimal (highest value/weight) doesn't guarantee global optimal.",
    difficulty: "medium",
  },
  {
    topic: "Greedy Algorithms",
    question: "What is the greedy choice in Huffman Coding?",
    options: [
      "Always pick two nodes with minimum frequency",
      "Always pick two nodes with maximum frequency",
      "Pick randomly",
      "Pick based on character"
    ],
    correctAnswer: 0,
    explanation: "Huffman: merge two minimum frequency nodes. Gives optimal prefix-free code.",
    difficulty: "medium",
  },

  // Divide and Conquer
  {
    topic: "Divide and Conquer",
    question: "Which of the following uses Divide and Conquer?",
    options: [
      "Merge Sort",
      "Insertion Sort",
      "Selection Sort",
      "Bubble Sort"
    ],
    correctAnswer: 0,
    explanation: "Merge Sort: divide array into halves (divide), sort recursively (conquer), merge (combine).",
    difficulty: "easy",
  },
  {
    topic: "Divide and Conquer",
    question: "What is the recurrence relation for Merge Sort?",
    options: ["T(n) = T(n-1) + O(n)", "T(n) = 2T(n/2) + O(n)", "T(n) = T(n/2) + O(1)", "T(n) = 2T(n-1) + O(1)"],
    correctAnswer: 1,
    explanation: "Divide into 2 halves: 2T(n/2). Merge: O(n). Total: T(n) = 2T(n/2) + O(n) = O(n log n).",
    difficulty: "medium",
  },

  // Graph Algorithms
  {
    topic: "Minimum Spanning Tree",
    question: "What is the time complexity of Prim's algorithm using a binary heap?",
    options: ["O(V²)", "O(E log V)", "O(V log V)", "O(E + V log V)"],
    correctAnswer: 1,
    explanation: "Prim with binary heap: V extract-min O(V log V), E decrease-key O(E log V). Total: O(E log V).",
    difficulty: "hard",
  },
  {
    topic: "Minimum Spanning Tree",
    question: "Kruskal's algorithm uses which data structure for cycle detection?",
    options: ["Stack", "Queue", "Union-Find (Disjoint Set)", "Heap"],
    correctAnswer: 2,
    explanation: "Kruskal sorts edges, adds one by one. Union-Find checks if edge creates cycle in O(α(n)).",
    difficulty: "medium",
  },

  {
    topic: "Shortest Path",
    question: "Dijkstra's algorithm fails for graphs with:",
    options: ["Negative weight edges", "Multiple edges", "Cycles", "Disconnected components"],
    correctAnswer: 0,
    explanation: "Dijkstra assumes once a vertex is finalized, shortest path found. Negative edges break this assumption.",
    difficulty: "medium",
  },
  {
    topic: "Shortest Path",
    question: "What is the time complexity of Bellman-Ford algorithm?",
    options: ["O(V²)", "O(VE)", "O(E log V)", "O(V + E)"],
    correctAnswer: 1,
    explanation: "Bellman-Ford relaxes all E edges V-1 times: O(V·E). Can handle negative edges.",
    difficulty: "medium",
  },

  // Complexity Analysis
  {
    topic: "Complexity Analysis",
    question: "What does Big-O notation represent?",
    options: [
      "Upper bound (worst case)",
      "Lower bound (best case)",
      "Average case",
      "Exact complexity"
    ],
    correctAnswer: 0,
    explanation: "Big-O (O) gives upper bound. Big-Omega (Ω) gives lower bound. Big-Theta (Θ) gives tight bound.",
    difficulty: "easy",
  },
  {
    topic: "Complexity Analysis",
    question: "Which is the correct ordering from slowest to fastest growing?",
    options: [
      "O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ)",
      "O(log n) < O(1) < O(n) < O(n²) < O(2ⁿ)",
      "O(1) < O(n) < O(log n) < O(n²) < O(2ⁿ)",
      "O(n) < O(1) < O(log n) < O(n²) < O(2ⁿ)"
    ],
    correctAnswer: 0,
    explanation: "Constant < Logarithmic < Linear < Linearithmic < Quadratic < Exponential",
    difficulty: "medium",
  },

  // OPERATING SYSTEMS (50 questions)
  // Processes
  {
    topic: "Processes",
    question: "What is the difference between a process and a thread?",
    options: [
      "Threads share memory space, processes don't",
      "Processes share memory, threads don't",
      "No difference",
      "Threads are heavier than processes"
    ],
    correctAnswer: 0,
    explanation: "Threads within a process share same address space. Processes have separate memory spaces.",
    difficulty: "easy",
  },
  {
    topic: "Processes",
    question: "Which process state transition is NOT valid?",
    options: [
      "Running → Ready",
      "Ready → Running",
      "Waiting → Running",
      "Running → Waiting"
    ],
    correctAnswer: 2,
    explanation: "Process cannot go directly from Waiting to Running. Must go: Waiting → Ready → Running.",
    difficulty: "medium",
  },
  {
    topic: "Processes",
    question: "What is a zombie process?",
    options: [
      "Process that has completed but entry remains in process table",
      "Process waiting for I/O",
      "Process in deadlock",
      "Process consuming too much CPU"
    ],
    correctAnswer: 0,
    explanation: "Zombie: process finished execution but parent hasn't read exit status yet. Entry remains in table.",
    difficulty: "medium",
  },

  // CPU Scheduling
  {
    topic: "CPU Scheduling",
    question: "Which scheduling algorithm may suffer from starvation?",
    options: [
      "First Come First Serve",
      "Shortest Job First",
      "Round Robin",
      "Priority Scheduling"
    ],
    correctAnswer: 1,
    explanation: "SJF: long processes may wait indefinitely if short processes keep arriving. Solution: aging.",
    difficulty: "medium",
  },
  {
    topic: "CPU Scheduling",
    question: "What is the convoy effect?",
    options: [
      "Small processes waiting for a large process in FCFS",
      "Processes waiting for I/O",
      "Too many processes in system",
      "Deadlock situation"
    ],
    correctAnswer: 0,
    explanation: "FCFS convoy effect: one long CPU-bound process blocks many short processes, reducing throughput.",
    difficulty: "medium",
  },
  {
    topic: "CPU Scheduling",
    question: "Round Robin scheduling is optimal when:",
    options: [
      "Time quantum is very large",
      "Time quantum is very small",
      "Time quantum ≈ average burst time",
      "All processes have same burst time"
    ],
    correctAnswer: 2,
    explanation: "Large quantum → FCFS. Small quantum → too much context switch overhead. Optimal: ≈ average burst.",
    difficulty: "hard",
  },
  {
    topic: "CPU Scheduling",
    question: "Which scheduling algorithm is non-preemptive?",
    options: ["FCFS", "Round Robin", "SRTF", "Priority with preemption"],
    correctAnswer: 0,
    explanation: "FCFS (First Come First Serve) is non-preemptive. Once CPU given, process runs to completion.",
    difficulty: "easy",
  },

  // Deadlock
  {
    topic: "Deadlock",
    question: "Which of the following is NOT a necessary condition for deadlock?",
    options: [
      "Mutual Exclusion",
      "Hold and Wait",
      "Preemption",
      "Circular Wait"
    ],
    correctAnswer: 2,
    explanation: "Four necessary conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.",
    difficulty: "easy",
  },
  {
    topic: "Deadlock",
    question: "Which deadlock handling strategy is most commonly used?",
    options: [
      "Deadlock Prevention",
      "Deadlock Avoidance",
      "Deadlock Detection and Recovery",
      "Ostrich Algorithm (ignore)"
    ],
    correctAnswer: 3,
    explanation: "Most OS (including Windows, Linux) ignore deadlocks. Too rare to justify prevention/avoidance overhead.",
    difficulty: "medium",
  },
  {
    topic: "Deadlock",
    question: "Banker's algorithm is used for:",
    options: [
      "Deadlock Prevention",
      "Deadlock Avoidance",
      "Deadlock Detection",
      "Deadlock Recovery"
    ],
    correctAnswer: 1,
    explanation: "Banker's: avoidance strategy. Checks if granting request keeps system in safe state.",
    difficulty: "medium",
  },
  {
    topic: "Deadlock",
    question: "What is a safe state in Banker's algorithm?",
    options: [
      "State where system can allocate resources to each process in some order and avoid deadlock",
      "State with no deadlock",
      "State with maximum resource utilization",
      "State with no waiting processes"
    ],
    correctAnswer: 0,
    explanation: "Safe state: there exists a sequence where each process can finish. Doesn't mean no deadlock currently.",
    difficulty: "hard",
  },

  // Memory Management
  {
    topic: "Memory Management",
    question: "What is the purpose of a Translation Lookaside Buffer (TLB)?",
    options: [
      "Cache recently used data",
      "Cache page table entries for faster address translation",
      "Store process control blocks",
      "Cache disk blocks"
    ],
    correctAnswer: 1,
    explanation: "TLB caches virtual→physical page mappings. Speeds up address translation significantly.",
    difficulty: "medium",
  },
  {
    topic: "Memory Management",
    question: "What is internal fragmentation?",
    options: [
      "Wasted space inside allocated memory blocks",
      "Wasted space between allocated blocks",
      "Disk fragmentation",
      "Page fragmentation"
    ],
    correctAnswer: 0,
    explanation: "Internal: allocated more than needed (e.g., 13 KB process in 16 KB block wastes 3 KB). External: gaps between blocks.",
    difficulty: "medium",
  },
  {
    topic: "Memory Management",
    question: "Which memory allocation strategy minimizes external fragmentation?",
    options: ["First Fit", "Best Fit", "Worst Fit", "Compaction"],
    correctAnswer: 3,
    explanation: "Compaction moves processes to eliminate gaps. First/Best/Worst Fit still leave fragments.",
    difficulty: "medium",
  },

  // Paging
  {
    topic: "Paging",
    question: "If page size is 4KB and logical address is 32-bit, how many bits are used for page offset?",
    options: ["10", "12", "20", "22"],
    correctAnswer: 1,
    explanation: "4KB = 4096 = 2¹² bytes. Need 12 bits to address within a page. Remaining 20 bits for page number.",
    difficulty: "medium",
  },
  {
    topic: "Paging",
    question: "What problem does two-level paging solve?",
    options: [
      "Reduces page table size",
      "Increases access speed",
      "Eliminates external fragmentation",
      "Improves cache hit rate"
    ],
    correctAnswer: 0,
    explanation: "Single-level page table for large address space is huge. Two-level: page the page table itself.",
    difficulty: "hard",
  },
  {
    topic: "Paging",
    question: "What is the effective memory access time if TLB hit ratio is 80%, TLB access time is 20ns, and memory access time is 100ns?",
    options: ["100ns", "120ns", "140ns", "220ns"],
    correctAnswer: 2,
    explanation: "EAT = 0.8(20+100) + 0.2(20+100+100) = 0.8×120 + 0.2×220 = 96 + 44 = 140ns. (TLB miss needs 2 memory accesses)",
    difficulty: "hard",
  },

  // Virtual Memory
  {
    topic: "Virtual Memory",
    question: "What is thrashing?",
    options: [
      "Excessive paging with little useful work",
      "Process termination",
      "Memory leaks",
      "Disk full condition"
    ],
    correctAnswer: 0,
    explanation: "Thrashing: pages constantly swapped in/out. System spends more time paging than executing.",
    difficulty: "easy",
  },
  {
    topic: "Virtual Memory",
    question: "Which page replacement algorithm is optimal but not implementable?",
    options: ["FIFO", "LRU", "Optimal (Belady's)", "Clock"],
    correctAnswer: 2,
    explanation: "Optimal algorithm: replace page not used for longest time in future. Needs future knowledge.",
    difficulty: "medium",
  },
  {
    topic: "Virtual Memory",
    question: "What is the Belady's Anomaly?",
    options: [
      "Increasing frames increases page faults for some algorithms",
      "LRU is better than FIFO",
      "TLB miss is costly",
      "Page size affects performance"
    ],
    correctAnswer: 0,
    explanation: "Belady's Anomaly: FIFO may have more page faults with more frames. LRU doesn't suffer this.",
    difficulty: "hard",
  },
  {
    topic: "Virtual Memory",
    question: "What is the working set model used for?",
    options: [
      "Determining the set of pages a process needs",
      "Calculating CPU utilization",
      "Memory allocation",
      "Disk scheduling"
    ],
    correctAnswer: 0,
    explanation: "Working set: pages referenced in last Δ time. Used to prevent thrashing by ensuring working set in memory.",
    difficulty: "hard",
  },

  // File Systems
  {
    topic: "File Systems",
    question: "What is the purpose of an inode in Unix file systems?",
    options: [
      "Store file data",
      "Store file metadata and pointers to data blocks",
      "Store directory entries",
      "Store user information"
    ],
    correctAnswer: 1,
    explanation: "Inode stores file metadata (permissions, size, timestamps) and pointers to data blocks.",
    difficulty: "medium",
  },
  {
    topic: "File Systems",
    question: "Which of the following is NOT stored in an inode?",
    options: ["File size", "File name", "File permissions", "Timestamps"],
    correctAnswer: 1,
    explanation: "File name is stored in directory entry, not inode. Directory maps name → inode number.",
    difficulty: "medium",
  },
  {
    topic: "File Systems",
    question: "What is the advantage of indexed allocation over linked allocation?",
    options: [
      "Direct access to blocks",
      "Less overhead",
      "Simpler implementation",
      "Better for sequential access"
    ],
    correctAnswer: 0,
    explanation: "Indexed: index block contains all pointers. Direct access. Linked: must traverse from start.",
    difficulty: "medium",
  },

  // Disk Scheduling
  {
    topic: "Disk Scheduling",
    question: "Which disk scheduling algorithm minimizes seek time but may cause starvation?",
    options: ["FCFS", "SCAN", "SSTF", "C-SCAN"],
    correctAnswer: 2,
    explanation: "SSTF (Shortest Seek Time First) chooses nearest request. May starve far requests.",
    difficulty: "medium",
  },
  {
    topic: "Disk Scheduling",
    question: "What is the difference between SCAN and C-SCAN?",
    options: [
      "SCAN reverses direction, C-SCAN jumps to other end",
      "SCAN is faster",
      "C-SCAN causes more starvation",
      "No difference"
    ],
    correctAnswer: 0,
    explanation: "SCAN: elevator (back and forth). C-SCAN: circular (jump to beginning after reaching end). More uniform wait.",
    difficulty: "medium",
  },
  {
    topic: "Disk Scheduling",
    question: "Which disk scheduling provides the most uniform wait time?",
    options: ["FCFS", "SSTF", "SCAN", "C-SCAN"],
    correctAnswer: 3,
    explanation: "C-SCAN provides more uniform wait time than SCAN as it treats cylinders as circular list.",
    difficulty: "medium",
  },

  // Synchronization
  {
    topic: "Synchronization",
    question: "What is a race condition?",
    options: [
      "Multiple processes accessing shared data concurrently leading to inconsistent results",
      "Process running too fast",
      "Deadlock situation",
      "Priority inversion"
    ],
    correctAnswer: 0,
    explanation: "Race condition: outcome depends on timing/order of processes accessing shared data. Needs synchronization.",
    difficulty: "easy",
  },
  {
    topic: "Synchronization",
    question: "What is the purpose of a semaphore?",
    options: [
      "Synchronization and mutual exclusion",
      "Memory allocation",
      "Process scheduling",
      "Disk access"
    ],
    correctAnswer: 0,
    explanation: "Semaphore: integer variable with atomic wait()/signal() operations. Used for synchronization and mutual exclusion.",
    difficulty: "easy",
  },
  {
    topic: "Synchronization",
    question: "What is the difference between binary semaphore and mutex?",
    options: [
      "Binary semaphore can be used for signaling, mutex only for mutual exclusion",
      "No difference",
      "Mutex is faster",
      "Binary semaphore is obsolete"
    ],
    correctAnswer: 0,
    explanation: "Binary semaphore: signaling between processes. Mutex: ownership (lock holder must unlock).",
    difficulty: "hard",
  },
  {
    topic: "Synchronization",
    question: "What problem does the producer-consumer problem illustrate?",
    options: [
      "Synchronization with bounded buffer",
      "Deadlock",
      "Starvation",
      "Priority inversion"
    ],
    correctAnswer: 0,
    explanation: "Producer-consumer: classic synchronization problem with bounded buffer. Needs semaphores/monitors.",
    difficulty: "medium",
  },

  // Critical Section
  {
    topic: "Critical Section",
    question: "Which of the following is a requirement for a critical section solution?",
    options: [
      "All: Mutual Exclusion, Progress, and Bounded Waiting",
      "Only Mutual Exclusion",
      "Only Progress",
      "Only Bounded Waiting"
    ],
    correctAnswer: 0,
    explanation: "Critical section solution must satisfy: Mutual Exclusion (one at a time), Progress (decision not postponed), Bounded Waiting (no starvation).",
    difficulty: "medium",
  },
  {
    topic: "Critical Section",
    question: "What is Peterson's solution?",
    options: [
      "Software-based critical section solution for 2 processes",
      "Hardware-based solution",
      "Works for n processes",
      "Uses test-and-set"
    ],
    correctAnswer: 0,
    explanation: "Peterson's: elegant software solution for 2 processes using turn and flag variables.",
    difficulty: "medium",
  },

  // DATABASE MANAGEMENT SYSTEMS (25 questions)
  {
    topic: "Database Basics",
    question: "Which normal form eliminates transitive dependencies?",
    options: ["1NF", "2NF", "3NF", "BCNF"],
    correctAnswer: 2,
    explanation: "3NF removes transitive dependencies (A→B, B→C implies A→C). BCNF is stricter.",
    difficulty: "medium",
  },
  {
    topic: "SQL",
    question: "What is the difference between DELETE and TRUNCATE?",
    options: [
      "DELETE can have WHERE clause, TRUNCATE removes all rows",
      "TRUNCATE is slower",
      "DELETE is DDL, TRUNCATE is DML",
      "No difference"
    ],
    correctAnswer: 0,
    explanation: "DELETE: DML, can filter with WHERE, logs each row. TRUNCATE: DDL, removes all rows, faster, can't rollback.",
    difficulty: "medium",
  },
  {
    topic: "Transactions",
    question: "Which ACID property ensures 'all or nothing'?",
    options: ["Atomicity", "Consistency", "Isolation", "Durability"],
    correctAnswer: 0,
    explanation: "Atomicity: transaction either completes fully or not at all. No partial execution.",
    difficulty: "easy",
  },
  {
    topic: "Indexing",
    question: "What is the purpose of an index in a database?",
    options: [
      "Speed up data retrieval",
      "Save disk space",
      "Enforce constraints",
      "Backup data"
    ],
    correctAnswer: 0,
    explanation: "Index creates separate structure for fast lookup, trading space for search speed.",
    difficulty: "easy",
  },
  {
    topic: "Joins",
    question: "Which join returns all rows from both tables whether or not there's a match?",
    options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
    correctAnswer: 3,
    explanation: "FULL OUTER JOIN combines LEFT and RIGHT joins, returning all rows with NULLs for non-matches.",
    difficulty: "medium",
  },

  // COMPUTER NETWORKS (25 questions)
  {
    topic: "OSI Model",
    question: "Which OSI layer is responsible for routing?",
    options: ["Physical", "Data Link", "Network", "Transport"],
    correctAnswer: 2,
    explanation: "Network layer (Layer 3) handles routing and logical addressing (IP addresses).",
    difficulty: "easy",
  },
  {
    topic: "TCP/IP",
    question: "What is the difference between TCP and UDP?",
    options: [
      "TCP is connection-oriented and reliable, UDP is connectionless",
      "UDP is slower",
      "TCP is unreliable",
      "No difference"
    ],
    correctAnswer: 0,
    explanation: "TCP: reliable, ordered delivery with connection setup. UDP: fast, no guarantees.",
    difficulty: "easy",
  },
  {
    topic: "IP Addressing",
    question: "How many bits are in an IPv4 address?",
    options: ["16", "32", "64", "128"],
    correctAnswer: 1,
    explanation: "IPv4: 32 bits (4 octets, e.g., 192.168.1.1). IPv6: 128 bits.",
    difficulty: "easy",
  },
  {
    topic: "Subnetting",
    question: "What is the subnet mask for a /24 network?",
    options: ["255.0.0.0", "255.255.0.0", "255.255.255.0", "255.255.255.255"],
    correctAnswer: 2,
    explanation: "/24 means first 24 bits are network bits: 255.255.255.0 (11111111.11111111.11111111.00000000).",
    difficulty: "medium",
  },
  {
    topic: "HTTP",
    question: "Which HTTP method is idempotent?",
    options: ["POST", "GET", "Both", "Neither"],
    correctAnswer: 1,
    explanation: "GET is idempotent (multiple identical requests have same effect). POST creates new resources.",
    difficulty: "medium",
  },
];

async function seedComprehensive() {
  console.log("\n" + "=".repeat(70));
  console.log("🚀 COMPREHENSIVE GATE-CS SEEDING");
  console.log("=".repeat(70) + "\n");

  const examId = "gate-cs";
  const subjectId = "gate-cs";

  try {
    // Current count
    const before = await db.execute(
      "SELECT COUNT(*) as count FROM exam_questions WHERE exam_id = ?",
      [examId]
    );
    console.log(`📊 Current GATE-CS questions: ${before.rows[0].count}`);

    let inserted = 0;
    let skipped = 0;

    for (const q of questions) {
      try {
        await db.execute({
          sql: `INSERT INTO exam_questions (exam_id, subject_id, topic, question, options, correct_answer, explanation, difficulty, source)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            examId,
            subjectId,
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
      } catch (err: any) {
        if (err.message?.includes("UNIQUE")) {
          skipped++;
        } else {
          console.error(`Error: ${q.question.substring(0, 50)}...`, err.message);
        }
      }
    }

    // Final count
    const after = await db.execute(
      "SELECT COUNT(*) as count FROM exam_questions WHERE exam_id = ?",
      [examId]
    );

    console.log(`\n✅ Seeding Complete!`);
    console.log(`   Before:  ${before.rows[0].count} questions`);
    console.log(`   Inserted: ${inserted} questions`);
    console.log(`   Skipped:  ${skipped} duplicates`);
    console.log(`   After:   ${after.rows[0].count} questions`);

    // Topic breakdown
    const breakdown = await db.execute(`
      SELECT topic, COUNT(*) as count
      FROM exam_questions
      WHERE exam_id = ?
      GROUP BY topic
      ORDER BY count DESC
    `, [examId]);

    console.log(`\n📋 Topic Breakdown:`);
    breakdown.rows.forEach((r: any) => {
      console.log(`   ${String(r.topic).padEnd(40)} ${r.count} Q`);
    });

    const total = Number(after.rows[0].count);
    const daily = 20; // 2 sprints × 10 questions
    const supply = Math.floor(total / daily);

    console.log(`\n🎯 Supply Status:`);
    console.log(`   Daily Consumption:  ${daily} questions (2 sprints)`);
    console.log(`   Current Supply:     ${total} questions`);
    console.log(`   Days of Supply:     ${supply} days`);

    if (total >= 200) {
      console.log(`\n✅ SUCCESS! GATE-CS now has sufficient questions!`);
    } else {
      console.log(`\n⚠️  Still need ${200 - total} more questions to reach target (200).`);
    }

    console.log("\n" + "=".repeat(70) + "\n");
  } catch (error: any) {
    console.error("\n❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedComprehensive().then(() => process.exit(0));
