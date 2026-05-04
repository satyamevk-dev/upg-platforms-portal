# Module: Retire & transition

**Track:** Solution lifecycle · **Module ID:** `aocsl-retire`

## Overview

This module aligns with the training library topic **Retire & transition**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- End-of-life planning and data export/archival
- Decommissioning order: integrations, users, systems
- Knowledge transfer and documentation archive
- Lessons learned and formal project closure

---

## Lesson 1: End-of-life planning, export, and archival

- Start with **legal and compliance**: retention, **holds**, and **export** formats required for mail, messages, recordings, and admin audit logs before any **deletion** talk.
- Build an **export runbook**: tooling, credentials, **chunking** for large tenants, checksum verification, and **offline** storage location with access controls.
- Prerequisites: **custodian** sign-off, **vendor** data portability documentation, and **cost** estimate for long-term archive storage.

## Lesson 2: Decommissioning order—integrations, users, systems

- **Happy path**: disable **inbound** integrations and webhooks → revoke **API** keys and **SSO** trust → **migrate** or **disable** users → drain **traffic** → power down **app** tiers → reclaim **infra** and **DNS**.
- Never delete **identity** anchors while downstream apps still reference them unless runbook explicitly covers **orphan** handling.
- Checkpoints: **zero** active sessions in monitoring; **billing** stopped for retired SKUs; **CMDB** updated to prevent rediscovery as “unknown asset.”

## Lesson 3: Knowledge transfer and documentation archive

- Pitfalls: **wiki** pages left pointing to dead URLs; **runbooks** referencing retired **on-call**; **secrets** still valid for decommissioned systems.
- Move authoritative **docs** to **archive** library with **retention** label; strip **live** links from active portals or mark “retired as of DATE.”
- Constraints: **records** retention mandates longer archive than infra teardown; **union** or customer **contract** notice periods for service end.

## Lesson 4: Lessons learned and formal project closure

- **Done** when **retrospective** captures what to repeat and what to forbid next time; **financial** closure reconciles final invoices vs. forecast.
- Publish **closure memo** to sponsors: systems removed, **support** model ended, **escalation** path for any latent legal request on archived data.
- Handoff: **Operate** team receives “**tombstone**” entry—what existed, why retired, where archive lives, who holds **keys** to cold storage.

---

## Key takeaways

- **Export and legal sign-off before unplug**—deletion without evidence is a career-limiting move in regulated industries.
- **Order of teardown** matters: integrations and credentials first, identities and traffic last, invoices and CMDB after the lights are truly off.
- **Formal closure** with retrospectives and archived knowledge turns a program ending into organizational learning, not amnesia.

---

## Quiz

1. Before decommissioning AOC-related systems, **export and archival** planning should address:  
   A) Only deleting data immediately  
   B) Legal retention, holds, required export formats, and verified checksums or integrity checks  
   C) Ignoring compliance input  

2. A sound **decommissioning order** often starts with:  
   A) Deleting all user accounts first regardless of integrations  
   B) Disabling inbound integrations, revoking credentials, then progressing through users, traffic, and infrastructure  
   C) Random order to save time  

3. **Knowledge archiving** after retirement should:  
   A) Delete all documentation  
   B) Move authoritative docs to a labeled archive, update active portals, and remove or rotate stale secrets  
   C) Leave wiki links broken forever  

4. **Lessons learned** sessions are most valuable when:  
   A) Skipped to move to the next project  
   B) They produce actionable changes to templates, RACI, or technical standards for the next lifecycle  
   C) Only blame individuals  

5. **Formal project closure** should include:  
   A) Ghost systems still billing  
   B) Financial reconciliation, sponsor communication, CMDB tombstone, and archive custody handoff  
   C) No communication to support  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B**
