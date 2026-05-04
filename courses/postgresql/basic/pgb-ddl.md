# Module: DDL: tables, types & constraints

**Track:** Basic · **Module ID:** `pgb-ddl`

## Overview

This module aligns with the training library topic **DDL: tables, types & constraints**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- CREATE TABLE and common PostgreSQL data types
- NULL semantics and DEFAULT
- PRIMARY KEY, UNIQUE, NOT NULL, CHECK (intro)
- ALTER TABLE: add/drop column awareness

---

## Lesson 1: CREATE TABLE and PostgreSQL data types

- Choose **types** deliberately: `text` vs. `varchar(n)`, `integer` vs. `bigint`, `timestamptz` vs. `timestamp` (prefer **timestamptz** for real-world wall times), and when `numeric(p,s)` beats floating point for money.
- Understand **NULL**: unknown value, not zero or empty string; pair with **NOT NULL** and **DEFAULT** when the domain forbids missing data.
- Prerequisites: scratch database, migration tool or plain SQL files in repo, and agreement on **naming conventions** (snake_case vs. camelCase quoted identifiers—pick one and stay consistent).

## Lesson 2: Constraints that protect every client

- **Happy path**: add **PRIMARY KEY** or **UNIQUE**, **NOT NULL** on required columns, **CHECK** for cross-column rules (for example `end_date >= start_date`), and **FOREIGN KEY** when another module covers relationships in depth.
- Use **DEFERRABLE** only when you understand transaction boundaries—default immediate constraints catch bugs earlier.
- Checkpoints: `\d table` in `psql` lists constraints; inserting violating rows fails fast with clear error messages.

## Lesson 3: ALTER TABLE and operational reality

- Pitfalls: **expensive** rewrites when changing certain types or adding volatile defaults on huge tables; **exclusive** locks blocking writes during some operations.
- Prefer **additive** migrations first (`ADD COLUMN` nullable, backfill, then tighten) on large production tables to avoid long locks.
- Rollback: keep **down migration** or revert SQL reviewed with the same care as `UP`; test on a copy of production statistics if possible.

## Lesson 4: DDL review and handoff

- **Done** when DDL lives in versioned migrations with **review checklist** (types, nullability, defaults, indexes deferred to indexing module if appropriate).
- Document **search_path** assumptions and any **extension** prerequisites (`CREATE EXTENSION` order).
- Handoff: link to style guide and example migration PR that the team treats as canonical.

---

## Key takeaways

- **Types and constraints are API contracts**—applications, reports, and ETL all inherit them.
- **NULL and DEFAULT** semantics prevent silent corruption; encode business rules where they cannot be bypassed.
- **Online DDL** discipline (add-then-backfill-then-enforce) keeps large-table changes boring instead of outage-shaped.

---

## Quiz

1. In PostgreSQL, **`timestamptz`** is generally preferred over **`timestamp` without time zone** when storing real-world event times because:  
   A) It uses less disk space always  
   B) It stores an absolute instant and respects session time zone for display  
   C) It disables indexes  

2. A **`CHECK`** constraint is used to:  
   A) Automatically create foreign keys  
   B) Enforce boolean or range rules on row data beyond simple type validity  
   C) Replace the need for any application validation  

3. **`NULL`** in SQL means approximately:  
   A) Zero  
   B) Unknown or missing value—test with `IS NULL`, not `= NULL`  
   C) Empty string always  

4. Adding a **new column** to a very large table safely often starts with:  
   A) `NOT NULL` without default on day one always  
   B) Nullable column or a constant default that does not rewrite the whole heap, then backfill, then tighten constraints in phases  
   C) Dropping the table  

5. **`PRIMARY KEY`** on a table:  
   A) Allows duplicate key values  
   B) Uniquely identifies rows and implies a unique index in PostgreSQL  
   C) Forbids any other indexes  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B**
