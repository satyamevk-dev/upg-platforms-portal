# Module: Troubleshooting & support handoff

**Track:** Avaya AOC · **Module ID:** `aoc-troubleshoot`

## Overview

This module aligns with the training library topic **Troubleshooting & support handoff**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Top failure modes and first-response checks
- Correlating user reports with platform telemetry
- Vendor support: required data and severity guidelines
- Knowledge base and runbook hygiene

---

## Lesson 1: Triage—user story versus platform incident

- Capture **first facts**: client **build**, OS, network path (VPN, office, guest Wi-Fi), exact **error text**, wall-clock time in the user’s timezone, and whether **one** person or **many** are affected.
- Bucket the symptom early—**AOC policy**, **directory or sync**, **client**, **network or SBC**, or **integration**—using evidence, not guesses, so you do not burn hours in the wrong subsystem.
- Prerequisites: read-only AOC admin for quick user and space lookup, access to internal **status** or health boards, and a short script help desk can read to users for correlation ID capture.

## Lesson 2: Correlation with telemetry and admin views

- **Happy path**: locate the user in AOC → verify **account state**, **license**, and recent **policy** changes in the incident window → pull matching **server-side** errors → extend to **gateway**, **SBC**, or **middleware** logs only when the symptom crosses that boundary.
- Use a **pair comparison**: one working and one failing user with similar **group** and **policy** sets to isolate deltas quickly.
- Checkpoints: timelines align within documented **clock skew** tolerance; you can state a one-sentence **hypothesis** before the next configuration change.

## Lesson 3: Vendor engagement, severity, and evidence hygiene

- Pitfalls: incorrect **severity** tier; missing **version** matrix; pasting **passwords** or long-lived **tokens** into tickets; runbooks that reference retired menu paths.
- Constraints: contractual **response** targets, **data residency** rules for uploads, and internal approval before **remote hands** or vendor screen-share on production.
- Discipline: if the last change might have caused the issue, **undo that single change** first when safe; otherwise collect evidence only until root cause is proven—avoid thrashing many knobs.

## Lesson 4: Closure, knowledge base, and runbook refresh

- **Done** when root cause has a named **owner**, fix or **workaround** is in production with validation, and affected users receive plain-language **status** (including ETA if fix is still pending).
- Publish or update a **KB** article: symptoms, first checks, resolution steps, and **escalation** path; link any new **monitoring** alert added to catch recurrence early.
- Handoff: update the **runbook** with verified steps, “**last tested**” date, and verifier; schedule a **drill** or backlog item if the incident exposed a systemic gap (missing backup test, missing alert, unclear ownership).

---

## Key takeaways

- **Triage with evidence**—who, how many, when, and which client path—before you reconfigure identity, AOC policy, or the network; guessing burns the incident clock.
- **Pair users and correlate IDs** across admin views, server logs, and integrations so the shortest hypothesis wins instead of the loudest voice in the bridge.
- **Close the loop in the knowledge base:** update runbooks and KB articles with verified steps, last-tested dates, and severity guidance so the next incident costs less.

---

## Quiz

1. On a **user-reported outage**, triage should usually start by:  
   A) Changing random platform knobs until something moves  
   B) Confirming scope, time window, geography or app version, and whether the issue is widespread  
   C) Opening a vendor ticket with no reproduction data  

2. **Correlating** a user report with platform telemetry means:  
   A) Ignoring server-side errors if the client “looks fine”  
   B) Aligning user identifiers, error codes, regions, and timestamps with backend traces and logs  
   C) Asking every user to reinstall before checking service health  

3. **Severity** when engaging vendor support should reflect:  
   A) Always choosing the lowest tier to avoid attention  
   B) Business impact, number of affected users, and whether a workaround exists, per vendor definitions  
   C) Always choosing the highest severity to get faster initial response regardless of impact  

4. Data you should **not** paste into vendor or public chats includes:  
   A) Redacted correlation IDs and approximate timestamps  
   B) Plaintext passwords, long-lived secrets, or unredacted PII  
   C) A concise list of affected tenant IDs when policy allows  

5. **Runbook hygiene** after a resolved incident means:  
   A) Update the runbook with verified steps, owners, and links while details are fresh  
   B) Delete runbooks so incidents cannot repeat  
   C) Leave documentation unchanged to preserve “original intent”  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **A**
