# Module: Backup, PITR & disaster recovery

**Track:** Advanced · **Module ID:** `pga-backup-recovery`

## Overview

This module aligns with the training library topic **Backup, PITR & disaster recovery**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Logical backups (pg_dump) vs. physical (base backup/WAL)
- Continuous archiving and point-in-time recovery concepts
- Restore drills and runbook hygiene
- Encryption and off-site retention expectations

---

## Lesson 1: Logical (`pg_dump`) vs. physical backups

- **`pg_dump`/`pg_dumpall`** produce SQL or custom-format logical exports—great for portability, smaller subsets, and version upgrades with caveats; **physical base backup + WAL archiving** underpins **PITR** and large-database RTO targets.
- Logical dumps may **miss** certain globals unless scripted; physical backups require **WAL continuity** from backup start LSN.
- Prerequisites: encrypted object store or tape policy, **retention** matrix per compliance class, and restore lab hardware.

## Lesson 2: Continuous archiving and PITR concepts

- **Happy path**: enable **`archive_mode`**, ship WAL segments to immutable storage with **checksum** verification; practice **restore** to a point in time on a clone weekly or monthly.
- Document **`restore_command`** / cloud equivalents; test **promote** after restore in isolated VPC.
- Checkpoints: RPO measured in minutes of WAL loss acceptable vs. cost; **GPG** or KMS encryption validated end-to-end.

## Lesson 3: Restore drills and runbook hygiene

- Pitfalls: backups nobody can decrypt; **orphaned** partial base backups; **PITR** targets forgetting **timezone**; **extensions** missing on restore host.
- Automate **restore verification** queries (`SELECT count(*)`, checksum spot tests) post-restore job.
- Rollback: if drill fails, freeze feature work on storage layer until green—treat failed drill as sev-2 incident.

## Lesson 4: DR handoff and vendor SLAs

- **Done** when **runbook** lists RPO/RTO tested values, owner roster, and **communication** tree; regulators get evidence of drill cadence.
- Document **off-site** distance and immutability (object lock) for ransomware resilience.
- Handoff: tie **replication** topology to backup strategy (standby promotion vs. restore from cold).

---

## Key takeaways

- **Untested backups are Schrodinger backups**—restore drills are the measurement that collapses the wavefunction.
- **WAL is the timeline** for PITR—gaps mean unrecoverable minutes.
- **Logical and physical** solve different problems—know which one your RPO/RTO actually requires.

---

## Quiz

1. **Point-in-time recovery (PITR)** typically requires:  
   A) Only a single `pg_dump` file from last year  
   B) A consistent base backup plus continuous WAL archive (or equivalent) to replay to a target time or LSN  
   C) Disabling WAL  

2. **`pg_dump`** is especially well suited for:  
   A) Zero-downtime multi-terabyte instant failover alone  
   B) Portable logical exports, subset restores, and many migration workflows  
   C) Replacing all physical backups always  

3. **WAL archiving** is important because:  
   A) It slows down writes with no benefit  
   B) It enables replay for replication and PITR when configured with retention and monitoring  
   C) It removes the need for `VACUUM`  

4. A **restore drill** should validate:  
   A) Only that backup files exist on disk  
   B) End-to-end restore steps, extension presence, credentials, and application smoke queries on recovered data  
   C) Only file sizes  

5. Encrypting backups at rest/off-site primarily protects against:  
   A) Faster queries  
   B) Theft or compromise of backup media exposing sensitive data  
   C) Index bloat  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B**
