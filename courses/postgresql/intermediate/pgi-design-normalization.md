# Module: Schema design & normalization

**Track:** Intermediate · **Module ID:** `pgi-design-normalization`

## Overview

This module aligns with the training library topic **Schema design & normalization**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Functional dependencies and redundancy
- 1NF–3NF in practical terms
- Denormalization tradeoffs for read-heavy patterns
- Naming, documentation, and migration mindset

---

## Lesson 1: Functional dependencies and redundancy pain

- Identify **functional dependencies** (`A → B`): when knowing column `A` determines `B`; redundant storage of `B` without dependency discipline causes **update anomalies**.
- Draw **minimal** table sets from user stories before typing `CREATE TABLE`; ask “which facts change independently?” to find split points.
- Prerequisites: comfort with **SELECT/JOIN** from basics so you can validate proposed splits with queries.

## Lesson 2: 1NF through 3NF in practical terms

- **Happy path**: enforce **1NF** (atomic scalar domains, no repeating groups in one row); **2NF** (no partial dependency of non-key attributes on part of a composite key); **3NF** (no transitive dependency of non-key attributes on other non-key attributes).
- Use **ERD** or text dependency lists; PostgreSQL does not enforce normal forms—you enforce them in design reviews.
- Checkpoints: every non-key column depends on **the whole key**, nothing but the key—say it aloud like a pledge.

## Lesson 3: Denormalization, read patterns, and migrations

- Pitfalls: premature **wide** tables to “save joins” while doubling write cost and cache pressure; **materialized** aggregates without refresh strategy.
- Denormalize only with **documented invariants** (triggers, generated columns, or batch jobs) keeping derived columns honest.
- Rollback mindset: **expand-contract** migrations—add new tables/columns, dual-write, backfill, then drop old—avoid destructive one-step renames on busy systems without planning.

## Lesson 4: Naming, documentation, and design handoff

- **Done** when table and column names read consistently; **comments** (`COMMENT ON`) capture domain meaning migrations cannot express.
- Publish **dictionary** of money fields (`numeric`), units, and time zones; link to API field mapping.
- Handoff: schedule **joins & subqueries** module to validate model with realistic workloads.

---

## Key takeaways

- **Normalization reduces contradiction**—duplicated facts eventually disagree with each other and with auditors.
- **3NF is a default**, not a religion—denormalize with eyes open and maintenance budget attached.
- **Migrations are part of the data model**—design them with the same rigor as schema diagrams.

---

## Quiz

1. **Third normal form (3NF)** roughly means:  
   A) Every table must have exactly two columns  
   B) Non-key attributes depend on the key, the whole key, and nothing but the key—no transitive dependencies  
   C) JSON columns are forbidden  

2. A **functional dependency** `customer_id → email` suggests:  
   A) Multiple emails per `customer_id` without restriction  
   B) For each `customer_id` value, at most one `email` value is intended in a properly constrained design  
   C) `email` should be the primary key always  

3. **First normal form (1NF)** violations often look like:  
   A) Repeating groups or non-atomic values stuffed into a single column  
   B) Too many indexes  
   C) Foreign keys only  

4. **Denormalization** is most defensible when:  
   A) You have not measured read vs. write cost  
   B) You document invariants and have a plan (triggers, jobs, or generated columns) to keep derived data correct  
   C) You want maximum joins always  

5. **Expand-contract** migrations help because:  
   A) They delete data faster  
   B) They allow backward-compatible rollout and safer rollback when reshaping busy tables  
   C) They remove the need for backups  

---

## Answer key

1. **B** · 2. **B** · 3. **A** · 4. **B** · 5. **B**
