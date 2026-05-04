# Module: Querying with SELECT

**Track:** Basic · **Module ID:** `pgb-select`

## Overview

This module aligns with the training library topic **Querying with SELECT**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- SELECT list, FROM, WHERE, AND/OR, IN, BETWEEN
- ORDER BY, LIMIT / OFFSET
- DISTINCT and simple expressions
- Comments and readable SQL habits

---

## Lesson 1: SELECT, FROM, and WHERE logic

- Build queries as **pipelines**: `FROM` establishes row sources, `WHERE` filters **before** aggregation, `SELECT` projects columns and expressions—knowing order prevents “why is my HAVING wrong?” confusion later.
- Combine predicates with **AND/OR** and parentheses; use **`IN`**, **`BETWEEN`**, and **`LIKE`** intentionally (`LIKE` can’t use plain B-tree indexes unless patterns are prefix-friendly).
- Prerequisites: sample `orders`/`customers` style tables or use `generate_series` to practice without sensitive data.

## Lesson 2: ORDER BY, LIMIT, OFFSET, DISTINCT

- **Happy path**: stable reports use **`ORDER BY`** with deterministic tie-breakers (add `id`); **pagination** uses `LIMIT`/`OFFSET` for small sets but remember **OFFSET** cost on huge pages—keyset pagination comes later in tuning topics.
- **`DISTINCT`** removes duplicate projection rows—pair with care when joining one-to-many tables or you will hide problems you should fix in joins instead.
- Checkpoints: `EXPLAIN` (intro only) shows sort nodes; `LIMIT` without `ORDER BY` returns an **arbitrary** slice—never rely on it for “latest row” semantics.

## Lesson 3: Readable SQL and safe exploration habits

- Pitfalls: formatting SQL as one unreadable line; **implicit** cross-joins from forgotten `ON`; running unbounded `SELECT *` on production giants.
- Use **`--` and `/* */` comments** to document intent for reviewers; keep **predicates sargable** (avoid wrapping indexed columns in functions in `WHERE` when alternatives exist).
- Rollback mindset: always add **`WHERE`** to exploratory `UPDATE`/`DELETE` drafts—even in transactions, mistakes are cheaper when the predicate is correct.

## Lesson 4: Query review handoff

- **Done** when saved **report queries** live in repo with parameter comments and owners; ad-hoc analyst queries still follow naming conventions.
- Document **timezone** assumptions in comments when using `now()` vs. `timestamptz` literals.
- Handoff: point learners to **DML** module next for mutating data safely.

---

## Key takeaways

- **`WHERE` filters rows; `HAVING` filters groups**—mixing them up is a classic SQL bug; internalize the clause order.
- **`ORDER BY` + `LIMIT`** is the idiomatic “top N per key” starting point before window functions.
- **Readable SQL is operational SQL**—future you is also on-call you.

---

## Quiz

1. **`WHERE`** applies to:  
   A) Only aggregate functions after `GROUP BY`  
   B) Row-level filtering before grouping  
   C) Only `ORDER BY` expressions  

2. To return rows 21–40 after sorting (page size 20), a common pattern is:  
   A) `ORDER BY ... LIMIT 20 OFFSET 20` (understanding OFFSET scan cost at scale)  
   B) `LIMIT 20 OFFSET 40` for the same slice  
   C) `LIMIT` without `ORDER BY` when you need deterministic paging  

3. **`SELECT DISTINCT`** removes:  
   A) All rows  
   B) Duplicate rows in the projected result set  
   C) Indexes from the table  

4. Using **`IN (list)`** is appropriate when:  
   A) You compare a column to a finite set of scalar values  
   B) You always want a cross join  
   C) You must never use indexes  

5. **`ORDER BY` without `LIMIT`** on a large table in psql for exploration:  
   A) Is always free  
   B) May sort the entire result before display—add `LIMIT` during exploratory queries on big data  
   C) Disables sorting  

---

## Answer key

1. **B** · 2. **A** · 3. **B** · 4. **A** · 5. **B**
