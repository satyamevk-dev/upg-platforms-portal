# Module: Aggregates, GROUP BY & window functions

**Track:** Intermediate · **Module ID:** `pgi-aggregates-windows`

## Overview

This module aligns with the training library topic **Aggregates, GROUP BY & window functions**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- GROUP BY, HAVING, and common aggregates
- Filtering aggregates vs. row-level filters
- Window functions: PARTITION BY, ORDER BY frames (intro)
- Common pitfalls: accidental duplicate rows

---

## Lesson 1: GROUP BY, HAVING, and aggregate semantics

- **`GROUP BY`** defines one output row per distinct group; aggregates (`count`, `sum`, `avg`) summarize within each group—every selected non-aggregated column must appear in `GROUP BY` (or be functionally dependent in PG’s relaxed rule—still be explicit for readers).
- **`HAVING`** filters **groups** after aggregation; **`WHERE`** filters **rows** before—mixing them wrong changes totals silently.
- Prerequisites: joins module comfort; sample sales data with duplicates to expose mistakes.

## Lesson 2: Window functions—PARTITION BY and frames

- **Happy path**: `sum(amount) OVER (PARTITION BY customer_id ORDER BY order_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)` for running totals; use `rank()` vs. `row_number()` consciously for ties.
- Default **frame** for `ORDER BY` in aggregates-within-windows differs from defaults without `ORDER BY`—read docs once, bookmark cheat sheet.
- Checkpoints: window results match a brute-force subquery for a few hand-checked customers.

## Lesson 3: Duplicate rows and accidental fan-out

- Pitfalls: joining before `GROUP BY` causing **fan-out**; using `DISTINCT` to hide modeling bugs; mixing window and aggregate without subquery where SQL disallows.
- `FILTER (WHERE ...)` clause on aggregates clarifies conditional metrics vs. `CASE` inside `sum`.
- Rollback: when dashboard numbers disagree with finance, rebuild query from **base counts** upward with CTEs.

## Lesson 4: Review checklist for analytics SQL

- **Done** when peer review answers: “What is a row?” and “Can a join multiply rows?” for every saved report query.
- Document **timezone** for `date_trunc` and window ordering on timestamptz columns.
- Handoff: point to **indexing & EXPLAIN** module before promoting heavy dashboards to production.

---

## Key takeaways

- **`WHERE` vs. `HAVING`** is the guardrail between row logic and group logic—mixing them up ships wrong KPIs.
- **Windows** express running and ranking patterns without self-join explosion—learn frames once, reuse everywhere.
- **`DISTINCT` is not a substitute** for correct joins or keys—find the fan-out source instead.

---

## Quiz

1. **`HAVING`** filters:  
   A) Rows before any grouping  
   B) Groups after aggregates are computed  
   C) Only indexes  

2. In standard SQL shape, non-aggregated columns in the **`SELECT`** list with **`GROUP BY`** should:  
   A) Never appear in `GROUP BY`  
   B) Appear in `GROUP BY` or be functionally dependent on the grouped keys (PostgreSQL allows functional dependency—still be explicit for clarity)  
   C) Always be wrapped in `MAX` without thought  

3. A **window function** like `row_number() OVER (PARTITION BY department ORDER BY hire_date)` assigns:  
   A) The same number to every row  
   B) Per-department ordered row numbers without collapsing rows to groups  
   C) Only global ordering ignoring partitions  

4. **`FILTER (WHERE condition)`** on an aggregate is useful to:  
   A) Replace `WHERE` entirely  
   B) Compute conditional aggregates (for example `count(*) FILTER (WHERE status = 'paid')`) in one pass  
   C) Delete rows  

5. Accidental **duplicate rows** before aggregation often come from:  
   A) Using `ORDER BY`  
   B) Joins that multiply rows (one-to-many) without adjusting the grain before `GROUP BY`  
   C) Using `LIMIT`  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B**
