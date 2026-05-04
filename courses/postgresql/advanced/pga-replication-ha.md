# Module: Replication & high availability

**Track:** Advanced · **Module ID:** `pga-replication-ha`

## Overview

This module aligns with the training library topic **Replication & high availability**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Physical streaming replication architecture
- Synchronous vs. asynchronous tradeoffs
- Failover, split-brain awareness, and RPO/RTO language
- Read replicas and lag monitoring

---

## Lesson 1: Physical streaming replication architecture

- **Primary** writes WAL; **standby** replays WAL via streaming (and optionally archive fetch); understand **slot** retention and **`wal_keep_size`** tradeoffs vs. archive completeness.
- **Replication roles** (`replication` flag) are sensitive—protect with TLS, cert auth, and network ACLs.
- Prerequisites: base backup tooling (`pg_basebackup`), monitoring of **`pg_stat_replication`**, and PATRONI/orchestrator awareness if used.

## Lesson 2: Synchronous vs. asynchronous replicas

- **Happy path**: async replicas maximize throughput but allow **RPO > 0** on primary loss; sync replicas tighten RPO at latency cost—pick per criticality tier, not globally by accident.
- **`synchronous_commit = remote_apply`** vs. `on` semantics differ by version—read your exact major’s docs once and pin the decision in ADR.
- Checkpoints: measured **replay lag** (`write_lag`, `flush_lag`, `replay_lag`) within SLO under peak WAL generation.

## Lesson 3: Failover, split-brain, and read replica routing

- Pitfalls: **two primaries** after network partition without fencing; apps **sticky** to dead primary; **read-your-writes** broken when load balancing reads to async replicas immediately after write.
- Use **connection pools** with health checks; **VIP** or DNS TTL strategies documented with **TTL** low enough for RTO but not flapping.
- Rollback: rehearse **controlled switchover** quarterly; keep **promote** runbook with exact command order for your stack.

## Lesson 4: HA documentation handoff

- **Done** when **RPO/RTO** numbers in SLA match actual replication topology; **failover** game day notes archived.
- Document **bootstrap** of new replica from encrypted base backup; **pitr** references tie to backup module.
- Handoff: link **backup/recovery** module for WAL continuity expectations.

---

## Key takeaways

- **Async vs. sync is a business continuity contract**, not a checkbox—document RPO per data class.
- **Split-brain prevention belongs in automation**—human “who is primary?” bridges at 3 a.m. fail audits.
- **Read replica lag is user-visible**—route reads with lag awareness or accept stale reads explicitly.

---

## Quiz

1. **Physical streaming replication** sends:  
   A) Only SQL text between nodes  
   B) WAL records from primary to standby for replay  
   C) Only full table dumps hourly  

2. **Synchronous replication** compared to asynchronous generally:  
   A) Always has zero latency cost  
   B) Tightens durability/RPO bounds on commit at potential latency cost  
   C) Disables WAL  

3. **Replication lag** metrics matter because:  
   A) They are decorative  
   B) Async replicas may serve stale reads and affect failover catch-up time  
   C) They remove the need for backups  

4. **Split-brain** risk in HA clusters refers to:  
   A) Two nodes both believing they are writable primary without safe coordination  
   B) Normal single-primary operation  
   C) Only DNS caching  

5. **`pg_stat_replication`** on the primary shows:  
   A) Only table bloat  
   B) Connected standbys and lag-related fields for monitoring  
   C) Only autovacuum workers  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **A** · 5. **B**
