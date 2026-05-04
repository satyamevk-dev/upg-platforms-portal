# Module: Deploy & migrate

**Track:** Solution lifecycle · **Module ID:** `aocsl-deploy`

## Overview

This module aligns with the training library topic **Deploy & migrate**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Cutover strategies: big-bang vs. phased
- Migration runbooks: data, users, and traffic
- Hypercare, war-room procedures, and rollback
- Go-live checklist and operational handoff

---

## Lesson 1: Cutover strategy—big bang vs. phased

- Compare **big-bang** (single weekend switch) vs. **phased** (site, business unit, or workload waves); document **decision** with trade-offs: coordination cost vs. prolonged dual-run complexity.
- For each wave, define **entry** and **exit** criteria: traffic percentage, **rollback** trigger metrics, and **customer-visible** comms timing.
- Prerequisites: **build** sign-off complete, **DR** tested at least once on non-prod, and **legal** approval for any data migration touching regulated records.

## Lesson 2: Migration runbooks—data, users, traffic

- **Happy path**: **runbook** sections for **freeze** window, **DNS** or **SBC** cutover, **user** batch enablement, **integration** cutover order, and **verification** commands with expected outputs.
- Assign **runbook owner** per section; use **read-check** aloud in war room for high-risk steps; keep **timer** visible for rollback deadline.
- Checkpoints: **pre-flight** checklist signed; **post-cut** smoke within N minutes; **ticket** volume and **error** dashboards watched continuously.

## Lesson 3: Hypercare, war room, and rollback execution

- Pitfalls: **war room** with no **incident commander**; **rollback** never rehearsed; **integrations** failing silently while voice looks green.
- Staff **hypercare** with vendor TAM, app owners, network, and identity on bridge; rotate scribe and **customer** liaison roles.
- Constraints: **maintenance** window hard stop; **regulatory** blackout dates; **union** rules on after-hours work in some locales.

## Lesson 4: Go-live checklist and operational handoff

- **Done** when **go-live checklist** is fully checked with timestamps, owners, and **known issues** list published to support; **SLO** dashboards live; **on-call** rotation updated.
- Document **final** config version IDs, **DNS TTL** values changed, and **support** escalation matrix including vendor **sev** definitions used during cutover.
- Handoff: first **business day** review scheduled; **Operate** module owns backlog of optimization items deferred during deploy freeze.

---

## Key takeaways

- **Phased vs. big bang** is a risk finance decision—document it so nobody “remembers” a different strategy under pressure.
- **Runbooks with owners and read-backs** beat heroic improvisation when DNS and SBC timers are ticking.
- **Hypercare without a commander** is a chat room, not an incident organization—appoint roles before the bridge opens.

---

## Quiz

1. A **phased** cutover compared to **big bang** usually trades:  
   A) No difference  
   B) Longer dual-run complexity for potentially lower blast radius per wave  
   C) Elimination of all testing  

2. A **migration runbook** should explicitly include:  
   A) Only the lunch order  
   B) Order of operations for data, identities, integrations, traffic, verification, and rollback triggers  
   C) Marketing slogans only  

3. **Hypercare** after go-live means:  
   A) Immediately sending the team on vacation  
   B) Augmented staffing and rapid escalation paths while adoption and integrations stabilize  
   C) Disabling monitoring to reduce noise  

4. **Rollback** during deploy is credible only when:  
   A) It was rehearsed with documented steps, owners, and time limits  
   B) It is invented during the bridge without practice  
   C) It is never considered  

5. A **go-live checklist** handoff to operations should capture:  
   A) Only feelings about the project  
   B) Final config versions, DNS or traffic changes, known issues, on-call updates, and dashboard links  
   C) Deletion of all logs  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **A** · 5. **B**
