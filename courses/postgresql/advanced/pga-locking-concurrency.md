# Module: Locking, deadlocks & concurrency

**Track:** Advanced · **Module ID:** `pga-locking-concurrency`

## Overview

This module aligns with the training library topic **Locking, deadlocks & concurrency**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Lock types relevant to DDL and DML
- advisory locks and application patterns
- Deadlock detection and mitigation
- Hot-row contention patterns and mitigations

---

## Lesson 1: Row-level locks vs. DDL locks

- **`ACCESS EXCLUSIVE`** on DDL blocks almost everything—schedule migrations accordingly; row-level **`FOR UPDATE`** / **`FOR SHARE`** locks serialize writers and readers on touched keys.
- Use **`LOCK TABLE`** only with extreme prejudice and timeouts; prefer **predicate locks** understanding via `pg_locks` when debugging.
- Prerequisites: transactions module; two sessions reproducing `blocked_transaction` in `pg_stat_activity`.

## Lesson 2: Advisory locks for application-level mutual exclusion

- **Happy path**: `pg_advisory_lock(hashtext('job:'||tenant_id))` coordinates cron workers; pair with **try** variants or timeouts to avoid global deadlocks.
- Namespace **64-bit** keys to avoid collisions across teams—document key registry in repo.
- Checkpoints: jobs never double-run migrations; locks released on session end—use functions that `EXCEPTION` handle cleanup.

## Lesson 3: Deadlocks, hot rows, and mitigation

- Pitfalls: **consistent lock order** violations causing deadlocks; **hot counters** updated every request; **`SELECT ... FOR UPDATE SKIP LOCKED`** forgotten when work-queue pattern fits.
- Mitigate hot rows with **sharded counters**, **`INSERT` event streams**, or **`UNLOGGED` staging** patterns appropriate to durability needs—not one-size-fits-all.
- Rollback: apps catch **`40P01`** deadlock detected and **retry** with jitter; log **statement** fingerprints to find offenders.

## Lesson 4: Concurrency runbook handoff

- **Done** when top wait events (`pg_stat_activity.wait_event`) have dashboards; deadlock rate tracked; **lock_timeout** set on risky sessions per policy.
- Document **ORM** behaviors that hold locks across network calls—ban them in style guide.
- Handoff: link to **replication** module when read scaling reduces write contention pressure.

---

## Key takeaways

- **Deadlocks mean the app lost a lock ordering game**—retry helps once; pattern fixes help permanently.
- **Advisory locks are powerful foot-guns**—centralize key allocation and timeouts.
- **Hot row contention is a schema/workload problem**—indexes alone rarely cure counter stampedes.

---

## Quiz

1. PostgreSQL **deadlocks** are detected by:  
   A) Manual DBA inspection only  
   B) The server when it finds a cycle of lock waits and aborts one transaction (`SQLSTATE 40P01`)  
   C) Disabling locks entirely  

2. **`pg_advisory_lock`** is typically used for:  
   A) Replacing foreign keys  
   B) Application-level mutual exclusion between sessions using agreed integer keys  
   C) Encrypting connections  

3. A common mitigation for **hot row** counter updates is:  
   A) Always storing counters only in application memory with no persistence  
   B) Sharding updates across multiple rows or using append-only event counts with periodic rollup when appropriate  
   C) Setting `lock_timeout` to zero always  

4. **`FOR UPDATE SKIP LOCKED`** is useful when:  
   A) You need queue workers to grab the next available rows without blocking on locked rows  
   B) You never want indexes  
   C) You want to disable MVCC  

5. **`LOCK TABLE ... ACCESS EXCLUSIVE`** during DDL is risky on busy systems because:  
   A) It never takes locks  
   B) It blocks many operations against that table for the lock’s duration—plan maintenance windows  
   C) It only affects sequences  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **A** · 5. **B**
