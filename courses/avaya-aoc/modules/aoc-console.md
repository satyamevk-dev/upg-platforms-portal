# Module: Console access & navigation

**Track:** Avaya AOC · **Module ID:** `aoc-console`

## Overview

This module aligns with the training library topic **Console access & navigation**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Login, session management, and supported browsers
- Dashboards, global search, and context menus
- Working with lists, filters, and bulk actions
- Audit trails and export basics

---

## Lesson 1: Access, session, and browser readiness

- Use **privileged** administrator accounts only from managed workstations; confirm **supported browsers**, TLS versions, and any smart-card or SSO requirements from Avaya release notes for your AOC train.
- Understand **session timeout**, idle lock, and how **MFA** or federated sign-in affects re-authentication when you step away mid-task or open multiple admin tabs.
- Prerequisites: approved **break-glass** procedure, organizational rules for admin credential storage, and a non-production tenant where you can explore menus without customer impact.

## Lesson 2: Dashboards, search, and day-one admin motion

- **Happy path**: sign in → orient on the **dashboard** or landing summary → use **global search** to open a known test user or resource → open a **list** view and apply a simple filter → use a **context menu** action your role allows (prefer read-only first).
- Practice low-risk actions: column layout, **saved** or bookmarked views if available, and opening detail panes without mutating production data.
- Checkpoints: you can find a target object without hunting every sidebar; actions you expect are visible—missing actions usually mean **insufficient role scope**, not a product bug.

## Lesson 3: Lists, filters, and bulk-change discipline

- Pitfalls: **bulk** edits applied to the wrong rows after a mis-set filter; **pagination** hiding excluded items; copying configuration between tenants without remapping **IDs** or integration endpoints.
- Constraints: export **size** or **rate** limits, maximum rows per bulk job, and internal audit rules that require a second approver for certain changes.
- Safe practice: capture “before” **exports** or screenshots for wide edits; pilot on a **small cohort** before org-wide policy applies; use confirmation dialogs deliberately instead of muscle memory.

## Lesson 4: Audit trails and evidence for operations

- **Done** when you can retrieve **who, when, and what** for a controlled test change and, if required by policy, tie it to **session** or source IP metadata shown in your audit UI.
- Document **deep links** to frequently used admin views, naming conventions for **saved filters**, and whether exports land in browser download, secure mail, or a SIEM feed.
- Handoff: brief security note listing which human and **automation** accounts touch AOC regularly and how **separation of duties** is enforced in your change process.

---

## Key takeaways

- **Session and browser discipline** (supported clients, SSO/MFA, timeouts) keeps admin work reproducible and avoids “it worked on my laptop” production surprises.
- **Search and scoped lists** are the fast safe path; **bulk** power always deserves an extra verification pass on the visible row set, not muscle memory.
- **Audit trails are operational data:** design changes so who/when/what is captured by default—your future self, security, and support will all need it.

---

## Quiz

1. After policy changes that affect sign-in (for example MFA or password rules), **session behavior** matters because:  
   A) Browsers never cache credentials  
   B) Existing sessions may keep prior rules until users re-authenticate or sessions expire per policy  
   C) HTTPS is disabled automatically  

2. **Global search** in the admin console is most appropriate for:  
   A) Purging audit history in bulk  
   B) Quickly locating users, resources, or settings without drilling every menu  
   C) Turning off least-privilege enforcement  

3. When using **filters and bulk actions** on a large list, the safest pattern is:  
   A) Assume the filter is always correct without scanning the result set  
   B) Confirm the visible rows match intent, then use confirmations or dry-run where offered  
   C) Apply bulk delete to “all pages” without reviewing  

4. **Audit trails** are most useful for operations when they capture:  
   A) Who changed what, when, and from which administrative context  
   B) End-user desktop wallpaper choices  
   C) Unrelated marketing campaign metrics  

5. For **supported browsers**, administrators should:  
   A) Follow vendor documentation for supported versions and hardening guidance  
   B) Standardize on unsupported nightly builds for all production tasks  
   C) Disable TLS to improve legacy plugin compatibility  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **A** · 5. **A**
