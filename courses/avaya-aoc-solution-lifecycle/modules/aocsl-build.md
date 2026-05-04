# Module: Build & integrate

**Track:** Solution lifecycle · **Module ID:** `aocsl-build`

## Overview

This module aligns with the training library topic **Build & integrate**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Provisioning automation and configuration baselines
- Directory sync, SSO, and federation setup
- Pilot cohorts, feature flags, and rollback criteria
- Validation test plans and sign-off gates

---

## Lesson 1: Provisioning automation and configuration baselines

- Implement **Infrastructure as Code** or vendor-supported **templates** for AOC dependencies so lab, stage, and prod differ by **parameters**, not hand-tuned snowflakes.
- Define **configuration baselines**: naming, tagging, backup policies, and **minimum** security settings enforced before any tenant is handed to pilots.
- Prerequisites: CI **service accounts** with least privilege, **secrets** in vault, and design-approved **network** diagrams wired to actual subnets.

## Lesson 2: Directory sync, SSO, and federation

- **Happy path**: connect **non-prod** IdP first → validate **attribute mapping** and **group** claims → enable **SSO** test users → expand to **pilot** cohort with documented sync latency.
- Stage **federation** or guest patterns only after internal **security** review; capture **rollback** switch to native auth if federation misbehaves during pilot.
- Checkpoints: **SCIM** or sync job logs show expected deltas; lockout rate monitored; **break-glass** path tested without disabling MFA globally.

## Lesson 3: Pilot cohorts, feature flags, and rollback criteria

- Pitfalls: **pilot** chosen only from IT friends; **flags** toggled in prod without owners; **rollback** undefined when client crashes spike.
- Select pilot users across **regions**, **roles**, and **network** paths; define **success metrics** (login success, call setup, message latency) with thresholds that halt expansion.
- Constraints: **vendor** feature stability, **client** minimum versions, and **support** staffing for hypercare during pilot.

## Lesson 4: Validation test plans and sign-off gates

- **Done** when **test plan** covers functional, security, performance, and **disaster** spot checks; each gate has named **signatory** (apps, security, ops).
- Document **defect** triage: **showstopper** vs. **defer** criteria tied to go-live; attach **evidence** (logs, videos, metrics screenshots) per policy.
- Handoff: **build package** tagged with version matrix (AOC, clients, integrations) ready for Deploy module runbooks.

---

## Key takeaways

- **Baselines and automation first**—if lab was clicked together manually, production will inherit that debt as incidents.
- **Pilots are experiments**, not demos: pick representative users, measure, and define **halt** criteria before you invite the whole company.
- **Sign-off gates** without evidence are theater; attach logs and metrics that prove the system behaved under realistic load.

---

## Quiz

1. **Configuration baselines** before handoff to pilots help:  
   A) Ensure environments share enforceable standards rather than one-off tweaks  
   B) Remove the need for any testing  
   C) Hide security settings from auditors  

2. **SSO and directory** work should typically progress:  
   A) Straight to production for all users on day one  
   B) From non-production validation through mapped attributes and pilot cohorts before broad rollout  
   C) Without documenting attribute mapping  

3. **Feature flags** during build are most valuable when:  
   A) They have no owner and are toggled randomly  
   B) They allow controlled exposure and fast rollback tied to clear metrics  
   C) They are only used after retirement  

4. **Pilot cohorts** should be selected to represent:  
   A) Only one power user in IT  
   B) Mix of roles, regions, and network paths to surface real-world failure modes  
   C) Only executives  

5. A **validation test plan** gate is meaningful when:  
   A) No one signs it  
   B) Named stakeholders sign with evidence that criteria were met or risks explicitly accepted  
   C) Testing is skipped for schedule pressure  

---

## Answer key

1. **A** · 2. **B** · 3. **B** · 4. **B** · 5. **B**
