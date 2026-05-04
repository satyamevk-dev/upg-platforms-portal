# Module: Operations, monitoring & backup

**Track:** Avaya AOC · **Module ID:** `aoc-ops`

## Overview

This module aligns with the training library topic **Operations, monitoring & backup**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Health indicators, alerts, and escalation paths
- Log collection, tracing, and support bundles
- Backup/restore expectations and DR drills
- Patching, upgrades, and maintenance modes

---

## Lesson 1: Health indicators and the operator’s first five minutes

- Open the **service health**, **status dashboard**, or equivalent monitoring described for your AOC deployment; know which **degraded** signals warrant a ticket versus an immediate **page**.
- Map **alert routing**—email, chat channel, or paging—and the **acknowledgment** SLA your operations team uses so noise does not hide real outages.
- Prerequisites: read-only monitoring credentials, **time-synced** jump hosts or bastions, and the published **maintenance** or status URL customers might check before calling support.

## Lesson 2: Logs, traces, and support bundles

- **Happy path**: reproduce a trivial lab defect → generate a **support bundle** or diagnostic export exactly as Avaya prescribes for your product line → open an internal ticket with **UTC timestamps**, affected **tenant IDs**, and user **correlation** identifiers when available.
- Practice **redaction**: strip **secrets** and unnecessary **PII** before any upload leaves your boundary; keep enough context that engineering can still reproduce.
- Checkpoints: bundle completes under vendor **size** limits; log window covers incident start **minus** warm-up margin; you captured **build numbers** for AOC components involved.

## Lesson 3: Backup, restore, and DR drills

- Pitfalls: backups that never undergo a **full restore test**; **RPO/RTO** numbers that exist only on slides; upgrades without the **snapshot** or backup checkpoint the vendor recommends.
- Constraints: **geo-residency** for backup storage, **encryption at rest** keys managed by KMS, and **maintenance mode** behavior that may block sign-in or media during the window.
- Rollback: documented **point-in-time restore** for configuration or policy stores; rehearse **failback** after a DR invocation so the team does not fear testing.

## Lesson 4: Patching, upgrades, and post-change sign-off

- **Done** when a standard **post-upgrade smoke** passes: admin login, directory **sync probe**, representative **message or call** test, and return of **monitoring** baselines for the agreed soak period.
- Document **from–to versions**, applied **schema** or migration steps, any **manual** CLI or API steps executed in the window, and deferred follow-ups with owners and dates.
- Handoff: update the change record with “**known follow-ups**” and schedule a short **retrospective** if the window exposed missing automation or unclear ownership.

---

## Key takeaways

- **Tune alerts to owners and thresholds** so real degradation pages someone who can act; unfocused paging trains everyone to ignore the channel.
- **Support bundles win cases** when they include the right time window, build numbers, and redaction discipline—volume without relevance slows every party.
- **A backup you have never restored is a hope, not a plan**—schedule restore drills and DR exercises on the same calendar as patching, not only at audit time.

---

## Quiz

1. **Health indicators** in operations dashboards are most valuable when they:  
   A) Replace all structured logging  
   B) Summarize whether core services are within expected SLO-style thresholds  
   C) Are decorative and unrelated to alerts  

2. A **support bundle** submitted to a vendor should ideally include:  
   A) Only a single screenshot of the login banner  
   B) Relevant logs, traces, configuration excerpts, and timestamps scoped to the incident  
   C) Every full database dump without redaction  

3. A **backup/restore drill** primarily validates that:  
   A) Restores succeed in a controlled test, not merely that backup jobs report “success”  
   B) Tape labels match a color scheme  
   C) Passwords are rotated every fifteen minutes  

4. **Patching during a maintenance window** should be paired with:  
   A) Surprise changes during peak traffic to shorten communication  
   B) A change plan, verification steps, and a known rollback or mitigation path  
   C) Disabling backups to speed the upgrade  

5. To reduce **alert fatigue**, teams should:  
   A) Page every metric to every engineer continuously  
   B) Tune thresholds, deduplicate correlated alerts, and route ownership to on-call roles  
   C) Silence all alerts to reduce email volume  

---

## Answer key

1. **B** · 2. **B** · 3. **A** · 4. **B** · 5. **B**
