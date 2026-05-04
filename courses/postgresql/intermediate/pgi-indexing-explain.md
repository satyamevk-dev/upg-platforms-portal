# Module: Indexing & EXPLAIN basics

**Track:** Intermediate · **Module ID:** `pgi-indexing-explain`

## Overview

This module aligns with the training library topic **Indexing & EXPLAIN basics**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- B-tree indexes and when they help
- Composite index column order
- EXPLAIN and EXPLAIN ANALYZE — reading plans at a high level
- Statistics and when plans go stale

---

## Lesson 1: B-tree indexes and when they help

- **B-tree** is the default index type for equality and range predicates on scalar types; know when **GIN**, **GiST**, or **BRIN** are better (full text, geo, very large append-only fact tables)—but default OLTP paths start with B-tree.
- Indexes speed **read** filters and some joins at the cost of **write** amplification and **storage**; measure hot queries before indexing every column “just in case.”
- Prerequisites: ability to read simple **`EXPLAIN`** output; `pg_stat_statements` or logs listing top queries.

## Lesson 2: Composite index column order

- **Happy path**: order columns by **selectivity** and **query shape**—leading prefix must match leftmost predicates (`WHERE a = ? AND b > ?` wants `(a,b)` not `(b,a)` unless separate queries justify different indexes).
- Use **`INCLUDE`** columns for covering indexes when you want payload columns without polluting sortable key order.
- Checkpoints: `EXPLAIN` shows **Index Scan** or **Bitmap Index Scan** instead of sequential scan on realistic data volumes after `ANALYZE`.

## Lesson 3: EXPLAIN vs. EXPLAIN ANALYZE and stale statistics

- Pitfalls: trusting **`EXPLAIN`** costs on empty dev tables; ignoring **buffer** hits vs. reads; missing **`ANALYZE`** after bulk load causing bad row estimates.
- `EXPLAIN (ANALYZE, BUFFERS)` is heavier—run off-hours on production-like snapshots when safe.
- Rollback: **drop index concurrently** if an index hurt more than helped; document decision in migration notes.

## Lesson 4: Index design handoff

- **Done** when each new index has **rationale comment** in migration (query id or ticket link) and **write impact** acknowledged.
- Document **autovacuum**/`ANALYZE` expectations after large data changes affecting plans.
- Handoff: point to **query tuning** advanced module for cost-model depth.

---

## Key takeaways

- **Index column order is not alphabetical**—it is query-shape driven; wrong order creates expensive ornaments.
- **`EXPLAIN` lies on empty data**—test plans on realistic cardinality or use production-sampled stats.
- **Every index is a contract to maintain** on every insert/update/delete—pay the write tax consciously.

---

## Quiz

1. A **B-tree** index is generally best for:  
   A) Only full-text search on arbitrary language documents  
   B) Equality and range predicates on common scalar types in OLTP workloads  
   C) Storing JSON documents without structure  

2. For `WHERE status = 'open' AND created_at > $1`, a composite index often starts with:  
   A) `created_at` only regardless of `status`  
   B) Columns matching equality predicates first (`status`) then range columns (`created_at`) when that matches the workload  
   C) Random column order  

3. **`EXPLAIN ANALYZE`** differs from **`EXPLAIN`** mainly because it:  
   A) Never executes the query  
   B) Executes the query and reports actual timings and row counts (use with care on mutating or heavy statements)  
   C) Only lists table names  

4. **Stale statistics** after a large bulk load can cause:  
   A) Perfect plans always  
   B) Poor row estimates and suboptimal plans until `ANALYZE` refreshes stats  
   C) Automatic index deletion  

5. **`CREATE INDEX CONCURRENTLY`** is preferred in production because:  
   A) It never touches the table  
   B) It avoids long blocking writes compared to a standard index build on busy tables (with tradeoffs documented in manual)  
   C) It disables indexes  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B**
