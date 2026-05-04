# Module: Messaging & collaboration policies

**Track:** Avaya AOC · **Module ID:** `aoc-messaging`

## Overview

This module aligns with the training library topic **Messaging & collaboration policies**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Spaces, channels, and retention policies
- Compliance: legal hold, eDiscovery hooks, and archiving
- External federation and guest access controls
- Client rollout: supported endpoints and feature flags

---

## Lesson 1: Spaces, channels, and policy attachment points

- Map how your Avaya suite names **spaces**, **channels** (or threads), and **teams**: where **retention** policies bind, where **guest** access is granted, and which **client** surfaces (desktop, mobile, web) support each admin-controlled feature.
- Relate messaging objects to **compliance**: which areas are **regulated** vs. informal; where **legal hold** or **eDiscovery** hooks live in admin UI versus separate archive or discovery tools referenced by Avaya docs.
- Prerequisites: a sandbox tenant, a clearly labeled test space, and a named compliance contact before you simulate hold or retention in lab.

## Lesson 2: Retention, hold, and federation

- **Happy path**: apply a **retention** rule to a test space → create disposable messages or files → confirm **expiration or archival** behavior after the lab-safe window → exercise **legal hold** only in non-production and verify destructive deletes are blocked where documented.
- Tighten **federation** or external-domain rules using **allowlists** instead of “trust the internet”; document partner domains and escalation when a new partner is onboarded.
- Checkpoints: compliance or admin **report** shows expected flags; external participants see the correct **identity banner** or disclaimer if your product surfaces one.

## Lesson 3: Guest access, sharing, and client rollout risk

- Pitfalls: **permanent** guests with standing elevated rights; **link sprawl** for anonymous joins; **client version skew** after enabling a new codec, screen-share, or policy pack without a phased rollout.
- Constraints: **data residency** for media or attachments, minimum **client builds** in policy, and regulatory bans on certain **cross-border** federation patterns.
- Rollback: revoke guest invites; disable a new federation rule; roll a **feature flag** or policy cohort back to the prior setting while you investigate client crashes.

## Lesson 4: Handoff to compliance and frontline support

- **Done** when retention and hold behavior is validated on a **written test matrix** signed by compliance for your industry pattern (use your org’s template; keep evidence in the change record).
- Document internal **policy IDs**, **space naming** standards, and the exact **invitation URL** pattern users will see so help desk scripts stay accurate.
- Handoff: separate FAQ entries for “**content disappeared**” (retention) vs. “**cannot invite guest**” (policy or federation) with first-line checks for each.

---

## Key takeaways

- **Scope retention and legal hold** to the right spaces or channels—mis-attached policy is a compliance and eDiscovery risk, not a minor UI mistake.
- **Federation and guests** deserve allowlists, time-bound invites, and least-privilege scopes; open-by-default sharing does not age well in regulated enterprises.
- **Phase client and feature rollouts** so minimum versions, flags, and media policies move together—otherwise “platform down” is often version skew in disguise.

---

## Quiz

1. A **retention policy** on spaces or channels primarily governs:  
   A) How long content remains available before deletion, archival, or other lifecycle rules apply  
   B) CPU clock speed on user laptops  
   C) DNS caching for external web sites only  

2. **Legal hold** in a collaboration context most often means:  
   A) Accelerate deletion to free storage  
   B) Preserve relevant content and block destructive actions until legal or compliance clears  
   C) Disable encryption for faster search  

3. **External federation** controls should be designed to:  
   A) Allow every unknown domain by default for speed  
   B) Explicitly allow trusted partners and capabilities, with logging and review  
   C) Hide all message metadata from compliance teams  

4. **Guest access** is least risky when implemented as:  
   A) A permanent shared guest login with tenant admin rights  
   B) Time-bound invitations with least-privilege scopes and clear ownership  
   C) One shared password posted in a public channel  

5. For **client rollout** with feature flags, a sensible approach is:  
   A) Pilot with a small cohort, validate support matrix, then broaden  
   B) Enable every experimental flag for all users on day one  
   C) Skip documentation because the client auto-updates  

---

## Answer key

1. **A** · 2. **B** · 3. **B** · 4. **B** · 5. **A**
