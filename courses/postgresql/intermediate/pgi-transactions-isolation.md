# Module: Transactions & isolation

**Track:** Intermediate · **Module ID:** `pgi-transactions-isolation`

## Overview

This module aligns with the training library topic **Transactions & isolation**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- ACID and why transactions matter
- BEGIN, COMMIT, ROLLBACK; savepoints (awareness)
- Read committed vs. repeatable read (PostgreSQL defaults)
- Anomalies: dirty read, non-repeatable read, phantom (conceptual)

---

## Lesson 1: ACID, BEGIN, COMMIT, ROLLBACK

- **Atomicity**: all statements in a transaction succeed or none persist; **Consistency**: constraints hold after commit; **Isolation**: concurrent transactions do not read each other’s partial effects against their guarantees; **Durability**: committed writes survive crashes (WAL).
- Practice explicit **`BEGIN` … `COMMIT`/`ROLLBACK`** in scripts; know your driver’s **autocommit** default—ORMs may wrap shorter units than you think.
- Prerequisites: DML comfort; two `psql` sessions to reproduce blocking and isolation demos safely in a scratch DB.

## Lesson 2: Read committed vs. repeatable read in PostgreSQL

- **Happy path**: default **`READ COMMITTED`** sees newly committed rows on each statement boundary—great for most OLTP; use **`REPEATABLE READ`** or **`SERIALIZABLE`** when reports or financial transfers need stable snapshots.
- Understand **non-repeatable read** and **phantom** risks at a conceptual level; observe them with concurrent updates in lab.
- Checkpoints: same `SELECT` twice in `REPEATABLE READ` shows stable snapshot; serialization failures (`40001`) handled with retry in app when using `SERIALIZABLE`.

## Lesson 3: Savepoints, long transactions, and lock pain

- Pitfalls: holding transactions open across **user think time**; forgetting **`ROLLBACK TO SAVEPOINT`** error handling patterns; mixing DDL (often implicit commit) mid-transaction unexpectedly.
- **`LOCK TABLE`** or heavy `UPDATE` without index support can block peers—pair concurrency lessons with indexing basics.
- Rollback: applications implement **idempotent** retries for serialization failures; cap transaction duration with timeouts where supported.

## Lesson 4: Isolation documentation handoff

- **Done** when services document **default isolation** per endpoint, retry policy for `40001`, and forbidden patterns (long interactive transactions).
- Link ORM **session** configuration to actual SQL emitted in logs during tests.
- Handoff: point to **locking & concurrency** advanced module for deadlock and hot-row drills.

---

## Key takeaways

- **Isolation level is a product choice**, not only a database default—document what each API relies on.
- **Short transactions** are fast transactions; long ones are lock magnets.
- **Serialization failures are normal** at `SERIALIZABLE`—plan retries instead of blaming Postgres.

---

## Quiz

1. **`ROLLBACK`** ends a transaction by:  
   A) Persisting all changes made since `BEGIN`  
   B) Discarding uncommitted changes from the current transaction  
   C) Deleting the database  

2. PostgreSQL’s default transaction isolation for new transactions is typically:  
   A) `SERIALIZABLE`  
   B) `READ COMMITTED`  
   C) `READ UNCOMMITTED`  

3. A **phantom read** (conceptually) involves:  
   A) Reading the same row twice with identical results always  
   B) Another transaction inserting or deleting rows that match your query predicate between your reads  
   C) Only checksum errors  

4. **`SAVEPOINT`** allows:  
   A) Marking a point so `ROLLBACK TO SAVEPOINT` can undo work after that point while keeping the outer transaction open  
   B) Skipping all constraints  
   C) Automatic infinite retries  

5. Using **`SERIALIZABLE`** isolation may require applications to:  
   A) Never handle errors  
   B) Retry transactions that fail with serialization failures (`SQLSTATE 40001`) when business logic allows  
   C) Disable indexes  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **A** · 5. **B**
