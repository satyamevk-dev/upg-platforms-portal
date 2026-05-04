# Module: Writing data: INSERT, UPDATE, DELETE

**Track:** Basic · **Module ID:** `pgb-dml`

## Overview

This module aligns with the training library topic **Writing data: INSERT, UPDATE, DELETE**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- INSERT: single row and multi-row forms
- UPDATE and DELETE with WHERE — avoiding full-table mistakes
- RETURNING clause basics
- Safe habits in shared environments (transactions preview)

---

## Lesson 1: INSERT—single row, multi-row, and defaults

- Use explicit **column lists** in `INSERT INTO ... (cols) VALUES ...` so table reorderings do not break app code; multi-row `VALUES (...), (...)` reduces round trips in migrations and batch jobs.
- Respect **`DEFAULT`**, **`GENERATED`** columns, and triggers that populate derived fields—`RETURNING` helps you read what actually landed.
- Prerequisites: understanding of **PRIMARY KEY** uniqueness and any **NOT NULL** constraints from the DDL module.

## Lesson 2: UPDATE and DELETE—WHERE is not optional

- **Happy path**: write the **`WHERE`** clause first in a scratch buffer, run `SELECT` with the same predicate to count rows, then wrap in `BEGIN`…`COMMIT` for production changes when policy allows.
- Learn **`RETURNING *`** to capture old/new values for audit logs or outbox patterns without a second round trip.
- Checkpoints: `UPDATE` row count matches expectation; **foreign keys** block deletes that would orphan children when configured to do so.

## Lesson 3: Transactions preview and shared environments

- Pitfalls: **autocommit** surprises from GUI clients; long open transactions holding locks during lunch; `DELETE` without `WHERE` on shared dev databases (recover from backup and embarrassment).
- Use **`ROLLBACK`** drills in lower environments; pair `UPDATE`/`DELETE` with **`LIMIT`** only when paired with keys—`LIMIT` without `ORDER BY` is not a safe semantic filter.
- Rollback: keep **idempotent** scripts (safe to re-run) when backfilling data; document **lock** expectations for large updates.

## Lesson 4: DML review and handoff

- **Done** when destructive scripts require **two-person** review or CI dry-run against anonymized snapshots for your org’s policy.
- Document **batch size** and **sleep** strategy when throttling writes to avoid replica lag spikes.
- Handoff: link to **transactions & isolation** module next for correctness under concurrency.

---

## Key takeaways

- **`WHERE` is the seatbelt** on `UPDATE` and `DELETE`—verify with `SELECT` first.
- **`RETURNING`** turns DML into an API for downstream systems without extra queries.
- **Transactions** are coming—practice `BEGIN`/`COMMIT`/`ROLLBACK` habits before production load.

---

## Quiz

1. **`INSERT ... RETURNING`** is useful to:  
   A) Skip writing any values  
   B) Retrieve generated keys or defaulted columns after the insert in one round trip  
   C) Delete rows automatically  

2. Before running a destructive **`UPDATE`**, a safe habit is:  
   A) Run it in production first to see what happens  
   B) Validate the same predicate with a `SELECT` count or sample in the same environment tier  
   C) Remove all indexes  

3. Multi-row **`INSERT ... VALUES (...), (...)`** primarily helps with:  
   A) Avoiding SQL altogether  
   B) Reducing round trips and clearer batch loads compared to many single-row statements  
   C) Disabling constraints  

4. In PostgreSQL, forgetting **`WHERE`** on **`DELETE`** in a shared dev database:  
   A) Is always harmless  
   B) Can delete every row in the table—treat as a serious foot-gun  
   C) Is impossible  

5. Wrapping exploratory writes in **`BEGIN` ... `ROLLBACK`** (where appropriate) helps:  
   A) Automatically commit at disconnect always  
   B) Practice changes safely in a transaction you discard when unsure  
   C) Disable all constraints  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B**
