# Module: VACUUM, MVCC & bloat

**Track:** Advanced · **Module ID:** `pga-vacuum-bloat`

## Overview

This module aligns with the training library topic **VACUUM, MVCC & bloat**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- How MVCC creates dead tuples
- VACUUM, autovacuum tuning signals
- Visibility map and index-only scans
- Monitoring table/index bloat and reclaim strategies

---

## Lesson 1: MVCC, dead tuples, and why VACUUM exists

- PostgreSQL **MVCC** keeps old row versions until no transaction can see them; **`VACUUM`** marks space reusable and updates visibility maps—without it, tables **bloat** and **transaction id wraparound** risks grow.
- **`autovacuum`** is not optional hygiene—it is core capacity planning; tune thresholds when you have large churn tables.
- Prerequisites: read **`pg_stat_user_tables`** (`n_dead_tup`, `last_autovacuum`), `pg_class.reltuples` awareness, and maintenance windows for heavier jobs.

## Lesson 2: autovacuum signals and manual intervention

- **Happy path**: raise **`autovacuum_vacuum_scale_factor`** down or `autovacuum_vacuum_threshold` per-table for hot tables; use **`VACUUM (ANALYZE)`** after bulk loads; schedule **`VACUUM FULL`** only as last resort with lock awareness.
- Watch **wraparound** dashboards (`datfrozenxid` age); aggressive long transactions block cleanup—kill or fix app patterns first.
- Checkpoints: dead tuple ratio drops after runs; autovacuum workers not perpetually behind in logs.

## Lesson 3: Visibility map and index-only scans

- Pitfalls: assuming **index-only scans** without verifying heap fetches are actually skipped—visibility map bits must be set; **hot updates** patterns can surprise you.
- **Bloat** in indexes may need **`REINDEX`** strategies (`CONCURRENTLY` when available) separate from heap vacuum decisions.
- Rollback: undo bad per-table autovacuum settings causing thrash; document `VACUUM FULL` downtime when used.

## Lesson 4: Monitoring and handoff to ops

- **Done** when Grafana (or equivalent) charts **dead tuples**, **autovacuum duration**, and **xid age** per critical table; alerts page before emergency `VACUUM FREEZE`.
- Document **long transaction** offenders from `pg_stat_activity`.
- Handoff: link runbook for **emergency vacuum** vs. **root-cause app fix** decision tree.

---

## Key takeaways

- **Dead tuples are debt**—autovacuum is the compounding interest payment schedule; skip payments and the database forecloses with bloat or wraparound risk.
- **`VACUUM FULL` is surgery**—locks and rewrites; use only when cheaper paths failed.
- **Long transactions are vacuum’s enemy**—fix apps, not only knobs.

---

## Quiz

1. Under MVCC, **`VACUUM`** primarily helps by:  
   A) Encrypting data at rest automatically  
   B) Reclaiming dead row space for reuse and maintaining visibility information for the planner  
   C) Creating new indexes automatically  

2. **`autovacuum`** should be tuned when:  
   A) Tables never change  
   B) High-churn tables accumulate dead tuples faster than default thresholds clean them  
   C) You want to disable all background maintenance  

3. **`VACUUM FULL`**:  
   A) Is always safe online without locks  
   B) Rewrites the table and takes stronger locks—plan maintenance windows  
   C) Replaces `ANALYZE`  

4. **Transaction ID wraparound** risk is mitigated by:  
   A) Ignoring vacuum completely  
   B) Healthy autovacuum progress and avoiding extremely long-lived transactions that block freezing  
   C) Deleting WAL files manually  

5. **Index-only scans** can use the visibility map to avoid heap hits when:  
   A) Pages are all-visible per visibility map bits for the relevant ranges  
   B) Indexes do not exist  
   C) `seq_page_cost` is zero  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **A**
