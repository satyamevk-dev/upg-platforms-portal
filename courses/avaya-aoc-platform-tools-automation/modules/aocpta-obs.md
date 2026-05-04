# Module: Observability as code

**Track:** Platform tools & automation · **Module ID:** `aocpta-obs`

## Overview

This module aligns with the training library topic **Observability as code**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Dashboards, alerts, and SLO definitions in repo
- Synthetic checks for critical admin journeys
- Log/metric/trace correlation for AOC services
- Runbooks linked from alert annotations

---

## Lesson 1: Observability as code in the repo

- Store **dashboard JSON**, **alert rules**, and **SLO** definitions beside application or platform code; require PR review for changes that widen burn-rate windows or drop critical panels.
- Tag metrics with **tenant**, **region**, **build**, and **deployment** labels so AOC incidents can be sliced without ad-hoc PromQL heroics at 3 a.m.
- Prerequisites: metrics backend (**Prometheus**, cloud vendor, or Avaya-exposed metrics gateway), log aggregation, and trace collector agreed as standard.

## Lesson 2: Synthetics for critical admin journeys

- **Happy path**: synthetic **logs in** to admin portal (headless browser or API token flow) → verifies **directory sync** probe or **health** tile → emits pass/fail to same alerting stack as production SLOs.
- Keep synthetic **credentials** in vault with rotation; isolate them to a **non-customer** tenant where possible.
- Checkpoints: failing synthetic opens ticket with **screenshot** or HAR redacted; success correlates with real user reports during incidents.

## Lesson 3: Correlating logs, metrics, and traces for AOC services

- Pitfalls: **cardinality explosion** from unbounded labels; missing **trace** context propagation through your automation workers; **log** volume drowning signal.
- Constraints: retention cost caps; **PII** scrubbing rules; cross-region **clock skew** breaking correlation if NTP ignored.
- Rollback: feature-flag **new** high-cardinality label off; revert dashboard merge if it doubled query cost.

## Lesson 4: Runbooks linked from alert annotations

- **Done** when every **page-level** alert includes **runbook URL**, **dashboard deep link**, and **primary** on-call rotation name in annotations or incident template.
- Document which **signals** are **symptom** vs. **cause** (for example saturation vs. error rate) to stop mis-routing bridges.
- Handoff: quarterly **game day** updates runbook **last verified** timestamps after synthetic or chaos exercises.

---

## Key takeaways

- **Dashboards and alerts in Git** turn tribal knowledge into reviewable, revertible changes—treat them like production code.
- **Synthetics** on admin journeys catch “API green but UI broken” classes of failures before executives do.
- **Correlation IDs** propagated from automation through AOC APIs into logs and traces shrink MTTR more than new dashboards alone.

---

## Quiz

1. Defining **SLOs** alongside dashboards in version control mainly helps:  
   A) Guarantee zero incidents  
   B) Make error budgets, alerting thresholds, and reviewer expectations explicit and auditable  
   C) Remove the need for on-call  

2. **Synthetic checks** for admin flows are valuable because they:  
   A) Replace all unit tests  
   B) Continuously validate critical user journeys from outside the app, catching auth or UI regressions early  
   C) Only run once per year  

3. **Metric labels** should be chosen to balance:  
   A) Maximum cardinality on every user ID forever  
   B) Useful dimensions (region, build, tenant class) without exploding storage and query cost  
   C) No labels to save bytes  

4. Linking **runbooks** directly in alert annotations helps on-call because:  
   A) It removes the need to think during incidents  
   B) It provides immediate context, first checks, and escalation paths without searching wiki  
   C) It disables paging  

5. **Distributed tracing** across automation and AOC backends is most useful when:  
   A) Spans are never propagated  
   B) Correlation IDs flow through workers, gateways, and vendor APIs so latency splits are visible end to end  
   C) Traces are sampled to zero in production  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B**
