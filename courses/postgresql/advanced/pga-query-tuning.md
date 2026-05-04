# Module: Query tuning & planner depth

**Track:** Advanced · **Module ID:** `pga-query-tuning`

## Overview

This module aligns with the training library topic **Query tuning & planner depth**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Cost model intuition: seq scan vs. index scan vs. bitmap
- When indexes hurt: write amplification, bloat
- Extended statistics and planner hints (judgment, not defaults)
- Parallel query and work_mem tradeoffs

---

## Lesson 1: Seq scan vs. index scan vs. bitmap index scan

- Read **`EXPLAIN (ANALYZE, BUFFERS)`** plans: **Seq Scan** reads the whole heap; **Index Scan** walks the B-tree then fetches heap tuples; **Bitmap Index Scan** collects TID ranges then visits heap in batches—good for moderate selectivity.
- **Cost** numbers are arbitrary units—compare alternatives in the same plan, not across servers blindly.
- Prerequisites: statistics healthy (`ANALYZE`), `pg_stat_statements` for finding top offenders, and a safe clone of production-ish data.

## Lesson 2: When indexes hurt and write amplification

- **Happy path**: measure **write** throughput and **index size** before adding covering indexes to hot tables; watch **bloat** and **autovacuum** lag after index-heavy migrations.
- Understand **partial indexes** to shrink write/read tax when predicates are stable (`WHERE status = 'active'`).
- Checkpoints: `INSERT`/`UPDATE` benchmarks within acceptable regression envelope; duplicate indexes removed.

## Lesson 3: Extended statistics, hints, parallel query, work_mem

- Pitfalls: **`SET enable_seqscan = off`** as a permanent “fix”; cranking **`work_mem`** globally until the OS swaps; parallel workers saturating CPU while latency spikes.
- Use **`CREATE STATISTICS`** for correlated columns the planner underestimates; treat **`pg_hint_plan`**-style hints as last resort with owner and expiry date.
- Rollback: revert hint session settings; drop harmful indexes concurrently after validation.

## Lesson 4: Tuning case handoff

- **Done** when each merged tuning PR links **before/after** plan snippets, wall time, and resource metrics; **SLO** impact noted.
- Document **maintenance_work_mem** vs. **work_mem** usage contexts separately from query tuning knobs.
- Handoff: feed recurring patterns into **lint rules** or **ORM** guidelines so the same bug is not tuned weekly.

---

## Key takeaways

- **Plans tell stories about cardinality**—fix stats and query shape before fighting the cost model with hints.
- **Indexes are not free**—each one taxes every write and vacuum cycle touching that table.
- **`work_mem` is a memory lever**, not a magic faster button—raise per session or subplan, not blindly globally.

---

## Quiz

1. A **bitmap index scan** often appears when:  
   A) The planner never uses indexes  
   B) Combining moderate selectivity index predicates into TID batches before heap fetches can be cheaper than naive index probes  
   C) Only sequential scans are allowed  

2. **Extended statistics** (`CREATE STATISTICS`) help when:  
   A) Columns are completely independent always  
   B) Correlated columns cause bad row estimates that confuse the planner  
   C) You want to disable `ANALYZE`  

3. Raising **`work_mem`** too high globally can:  
   A) Always improve every query with no risk  
   B) Increase memory pressure and risk spills or OS swapping when many queries sort/hash concurrently  
   C) Disable parallel query  

4. **`EXPLAIN` costs** are best used to:  
   A) Compare alternative plans on the same server snapshot, not as absolute real-world milliseconds  
   B) Replace `EXPLAIN ANALYZE` always  
   C) Prove queries need no indexes  

5. **Planner hints** (where available) should be treated as:  
   A) The first tool for every slow query  
   B) Last-resort debt with owners, justification, and retirement criteria when underlying stats or schema are fixed  
   C) Unsupported by PostgreSQL entirely  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **A** · 5. **B**
