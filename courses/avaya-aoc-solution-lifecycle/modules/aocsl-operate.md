# Module: Operate & optimize

**Track:** Solution lifecycle · **Module ID:** `aocsl-operate`

## Overview

This module aligns with the training library topic **Operate & optimize**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- SRE-style monitoring, SLOs, and incident response
- Capacity reviews, patching, and lifecycle upgrades
- Continuous improvement backlog and vendor engagement
- Quarterly business reviews and value realization

---

## Lesson 1: SRE-style monitoring, SLOs, and incident response

- Define **SLOs** for admin availability, authentication success, and core user journeys (sign-in, message, call setup); wire **burn-rate** alerts to on-call with **runbook** links.
- Practice **incident response**: roles (commander, comms, scribe), **severity** mapping to vendor support, and **customer** status page policy.
- Prerequisites: **observability** stack from design, **synthetic** checks from Build, and **error budget** policy agreed with product owners.

## Lesson 2: Capacity reviews, patching, and lifecycle upgrades

- **Happy path**: quarterly **capacity** review using usage trends and vendor guidance; **patch** calendar aligned with CAB; **upgrade** dry-run in stage with automated **smoke** suite.
- Track **technical debt** backlog: deferred hardening, outdated clients in the field, integration **version** drift.
- Checkpoints: post-patch **dashboard** green for soak period; **rollback** tag ready; license **reconciliation** after growth spikes.

## Lesson 3: Continuous improvement and vendor engagement

- Pitfalls: **QBR** slides with no metrics; **TAM** engagement only during fires; **feature requests** scattered in email instead of a single **backlog** ranked with business value.
- Run monthly **ops review**: top incidents, action items, and **toil** automation candidates tied to AOC admin pain.
- Constraints: contract **renewal** windows; **budget** for premium support tiers when error budget burns repeatedly.

## Lesson 4: Quarterly business review and value realization

- **Done** when **QBR** deck ties AOC adoption metrics to original **success criteria** from Discover: cost avoided, tickets reduced, MTTR improved—honest about misses.
- Document **value** hypotheses validated or invalidated; feed learnings into **next** roadmap (features, training, integrations).
- Handoff: **Retire** module gets list of legacy systems still consuming budget; **operate** backlog prioritized for next quarter.

---

## Key takeaways

- **SLOs and error budgets** turn “always up” slogans into negotiable trade-offs between reliability and feature velocity.
- **Capacity and patching** are recurring programs, not one-time project tasks—calendar them like finance closes.
- **Vendor QBRs with metrics** beat relationship lunches—they justify renewals and escalate systemic defects with data.

---

## Quiz

1. **SLOs** in the operate phase primarily help teams:  
   A) Remove all monitoring  
   B) Set customer-facing reliability targets and alert on burn rate against error budgets  
   C) Avoid documenting incidents  

2. **Capacity reviews** should use:  
   A) Only gut feel  
   B) Usage trends, license utilization, vendor guidance, and growth forecasts  
   C) Headcount only  

3. A healthy **patching** cadence for AOC platforms typically includes:  
   A) Random unscheduled changes  
   B) CAB-aligned windows, staged rollout, smoke tests, and documented rollback  
   C) Skipping test environments  

4. **Incident response** is more effective when:  
   A) Everyone joins the bridge with no roles  
   B) Roles like incident commander, communications, and scribe are defined and practiced  
   C) Postmortems are forbidden  

5. **QBRs** (quarterly business reviews) with the vendor should emphasize:  
   A) Only anecdotes  
   B) Adoption metrics, open defects, support trends, and value vs. original program goals  
   C) Deleting historical data  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B**
