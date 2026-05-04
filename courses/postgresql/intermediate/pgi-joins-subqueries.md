# Module: JOINs & subqueries

**Track:** Intermediate · **Module ID:** `pgi-joins-subqueries`

## Overview

This module aligns with the training library topic **JOINs & subqueries**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- INNER, LEFT, RIGHT, FULL — when each applies
- JOIN conditions vs. filter predicates
- Correlated vs. uncorrelated subqueries
- EXISTS vs. IN — performance intuition

---

## Lesson 1: INNER vs. OUTER joins—intent and row multiplication

- **`INNER JOIN`** keeps only matches; **`LEFT OUTER`** preserves left rows even without a right match (NULL-filled right columns); **`FULL OUTER`** exposes non-matches on both sides—pick based on required reporting semantics, not habit.
- Every **one-to-many** join multiplies rows; aggregate **after** joins or use `DISTINCT ON`/subqueries deliberately to avoid silent double counting.
- Prerequisites: solid **foreign key** mental model and sample `orders`/`line_items` data.

## Lesson 2: JOIN conditions vs. filter predicates

- **Happy path**: put **join keys** in `ON` for outer joins so optional matches behave correctly; move purely **filter** predicates that do not affect join shape to `WHERE` when semantically appropriate (know the NULL behavior difference for outer joins).
- Use **`USING (col)`** shorthand only when column names truly align; prefer explicit `ON` for clarity in complex graphs.
- Checkpoints: row counts before/after each join hop in exploratory `SELECT` match expectations; `EXPLAIN` shows join order you can read at a high level.

## Lesson 3: Correlated subqueries, EXISTS, and IN intuition

- Pitfalls: **correlated** subqueries executed per outer row without index support; `NOT IN (subquery)` vs. `NULL` surprises—prefer **`NOT EXISTS`** for anti-join patterns.
- `EXISTS` stops at first match—often clearer and planner-friendly versus counting subqueries when you only need a boolean.
- Rollback: when a join query explodes runtime, capture **cardinality estimates** (`EXPLAIN ANALYZE`) before rewriting to CTEs or `LATERAL`.

## Lesson 4: Readable join graphs and review handoff

- **Done** when multi-join queries use **consistent** table aliases and comments mapping to ERD edges; reviewers can trace keys in minutes.
- Document **nullable** foreign keys that change join choice (`LEFT` vs `INNER`).
- Handoff: point to **aggregates & windows** module for grouping after joins.

---

## Key takeaways

- **Outer join shape belongs in `ON`**—moving predicates incorrectly can accidentally turn outer joins into inner joins or filter out NULL legs you needed.
- **Row multiplication is a tax**—always know your cardinalities before `SUM` across joins.
- **`NOT EXISTS` beats `NOT IN`** for anti-joins when NULLs can appear in the candidate set.

---

## Quiz

1. A **`LEFT OUTER JOIN b ...`** result always includes:  
   A) Only rows that matched in both tables  
   B) All rows from the left table, with NULLs in right-side columns when no match exists  
   C) Only unmatched rows from both sides  

2. Row **duplication** after joins most often comes from:  
   A) Using `ORDER BY`  
   B) Joining across one-to-many relationships without aggregating or deduplicating intentionally  
   C) Comments in SQL  

3. For anti-join patterns (“rows with **no** related child”), **`NOT EXISTS`** is often preferred over **`NOT IN (subquery)`** because:  
   A) It is always slower  
   B) `NOT IN` can yield UNKNOWN/NULL-driven surprises when the subquery contains NULLs  
   C) `NOT IN` cannot use indexes  

4. **`EXISTS (SELECT 1 ...)`** typically:  
   A) Must count all matching rows fully  
   B) Stops after finding the first matching row once the planner can implement semijoin semantics  
   C) Requires `GROUP BY`  

5. Putting outer-join **shape** predicates in the wrong clause can:  
   A) Never change results  
   B) Accidentally filter away preserved NULL rows or change join semantics vs. intent  
   C) Disable constraints  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B**
