# Module: Partitioning, JSONB & extensions

**Track:** Advanced · **Module ID:** `pga-advanced-features`

## Overview

This module aligns with the training library topic **Partitioning, JSONB & extensions**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Declarative partitioning strategies and pruning
- JSON/JSONB: indexing (GIN), query patterns, pitfalls
- Full-text search overview (tsvector, GIN)
- Trusted extensions and upgrade implications

---

## Lesson 1: Declarative partitioning and pruning

- Choose **RANGE**, **LIST**, or **HASH** strategies based on access patterns; ensure **partition key** matches common `WHERE` clauses so **partition pruning** works—`EXPLAIN` should show only relevant child scans.
- Default **`PARTITION BY`** constraints must align with **FK** limitations (PostgreSQL evolves here—read your major version notes before modeling parent/child FK across partitions).
- Prerequisites: maintenance window for **ATTACH/DETACH** operations on large data; monitoring child table bloat individually.

## Lesson 2: JSONB, GIN indexes, and query patterns

- **Happy path**: store semi-structured payloads in **`jsonb`** with validated schema at app edge; add **`GIN`** indexes for containment/`jsonb_path_ops` patterns you actually query—avoid indexing everything “just in case.”
- Use **`->`/`->>`** operators deliberately; understand **statistics** limitations on nested paths—sometimes materialize hot fields into typed columns.
- Checkpoints: queries avoid **Seq Scan** on huge JSONB heaps when indexed paths are selective; `jsonb_typeof` guards in CHECK constraints where helpful.

## Lesson 3: Full-text search (`tsvector`, `GIN`) and extensions

- Pitfalls: **language** config mismatches; **stemming** surprises for SKU searches; **reindex** downtime when `pg_trgm` or FTS indexes huge—use **`CONCURRENTLY`** where supported.
- **`CREATE EXTENSION`** in production requires **allowlist** governance—who approves new C libraries in the cluster?
- Rollback: extension version pinned in IaC; downgrade path documented if upgrade breaks planner stats.

## Lesson 4: Advanced features review handoff

- **Done** when ADR captures why **partitioning** or **JSONB** was chosen vs. normalized tables; load tests attached.
- Document **VACUUM**/`ANALYZE` expectations for partitioned tables and JSONB-heavy tables separately.
- Handoff: security review for **extensions** and any **`SECURITY DEFINER`** helpers used alongside new types.

---

## Key takeaways

- **Partitioning is not magic performance dust**—wrong partition key yields more complexity with no pruning win.
- **JSONB trades schema flexibility for operator and statistics complexity**—typed columns still win for hot relational access paths.
- **Extensions are supply-chain**—treat them like deploying new binaries onto the database host.

---

## Quiz

1. **Partition pruning** in PostgreSQL requires queries to:  
   A) Never mention the partition key  
   B) Constrain the partition key in ways the planner can prove to eliminate irrelevant partitions  
   C) Always scan all partitions  

2. **`jsonb` vs. `json`** in PostgreSQL typically means:  
   A) They are identical types  
   B) `jsonb` stores a binary decomposed format efficient for indexing and many operators  
   C) `jsonb` cannot be indexed  

3. A **GIN** index is commonly used for:  
   A) Only B-tree equality lookups  
   B) Full-text search (`tsvector`) and many `jsonb` containment queries  
   C) Blocking writes entirely  

4. **`CREATE EXTENSION`** in managed or regulated environments should be:  
   A) Allowed for any user without review  
   B) Governed with allowlists, version pinning, and security review of native code trust implications  
   C) Impossible  

5. **Declarative partitioning** helps operations when:  
   A) It matches retention and archival patterns (drop/detach old partitions) and query filters align for pruning  
   B) It always removes need for indexes  
   C) It disables constraints  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **A**
