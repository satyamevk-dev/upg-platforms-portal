import type { LinuxTopic } from "./linux-topic";

export const postgresqlIntermediateLibrary: LinuxTopic[] = [
  {
    id: "pgi-design-normalization",
    major: "Schema design & normalization",
    minors: [
      "Functional dependencies and redundancy",
      "1NF–3NF in practical terms",
      "Denormalization tradeoffs for read-heavy patterns",
      "Naming, documentation, and migration mindset",
    ],
  },
  {
    id: "pgi-joins-subqueries",
    major: "JOINs & subqueries",
    minors: [
      "INNER, LEFT, RIGHT, FULL — when each applies",
      "JOIN conditions vs. filter predicates",
      "Correlated vs. uncorrelated subqueries",
      "EXISTS vs. IN — performance intuition",
    ],
  },
  {
    id: "pgi-aggregates-windows",
    major: "Aggregates, GROUP BY & window functions",
    minors: [
      "GROUP BY, HAVING, and common aggregates",
      "Filtering aggregates vs. row-level filters",
      "Window functions: PARTITION BY, ORDER BY frames (intro)",
      "Common pitfalls: accidental duplicate rows",
    ],
  },
  {
    id: "pgi-indexing-explain",
    major: "Indexing & EXPLAIN basics",
    minors: [
      "B-tree indexes and when they help",
      "Composite index column order",
      "EXPLAIN and EXPLAIN ANALYZE — reading plans at a high level",
      "Statistics and when plans go stale",
    ],
  },
  {
    id: "pgi-transactions-isolation",
    major: "Transactions & isolation",
    minors: [
      "ACID and why transactions matter",
      "BEGIN, COMMIT, ROLLBACK; savepoints (awareness)",
      "Read committed vs. repeatable read (PostgreSQL defaults)",
      "Anomalies: dirty read, non-repeatable read, phantom (conceptual)",
    ],
  },
  {
    id: "pgi-views-security",
    major: "Views, roles & object privileges",
    minors: [
      "Views for abstraction and simpler grants",
      "Roles, membership, and least privilege",
      "GRANT/REVOKE on tables and sequences",
      "Row-level security awareness",
    ],
  },
];
