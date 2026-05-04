# Module: Directory, users & groups

**Track:** Avaya AOC · **Module ID:** `aoc-directory`

## Overview

This module aligns with the training library topic **Directory, users & groups**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- User lifecycle: create, modify, disable, and templates
- Groups, nested membership, and attribute mapping
- Directory sync and identity provider integration patterns
- Password policies and MFA considerations

---

## Lesson 1: Directory objects and identity flow

- Relate **AOC directory** screens to your authoritative **IdP** (for example Azure AD or Okta): which attributes are mastered in the IdP, which are display-only in AOC, and whether sync is **scheduled** or near-real-time per Avaya integration guidance.
- Terms to internalize: **person** vs. **user account**, **group** vs. **role-like** group, **provisioning template**, **disabled** vs. **deleted**, and **external** identities used for partners or guests.
- Prerequisites: a read-only IdP security group, two lab users (one federated, one local if supported), and a written **attribute mapping** table for at least one downstream service.

## Lesson 2: User lifecycle and group modeling

- **Happy path**: create or sync a user from a **template** → assign **groups** that model job function → wait through the documented **sync latency** → verify the user sees expected **licenses**, **spaces**, or calling features in a client.
- Practice **modify** vs. **disable** for leavers; confirm your org’s rule for **resource ownership** transfer (spaces, call queues, delegated mailboxes) before any delete.
- Checkpoints: nested group expansion matches IdP expectations in AOC or sync logs; a second admin can independently verify the same membership without manual cache hacks.

## Lesson 3: Sync conflicts, passwords, and MFA

- Pitfalls: edit wars between **console** edits and **IdP** updates; duplicate **UPN or email** keys; mass **lockouts** after aggressive password policy tightening; MFA gaps on **emergency** accounts.
- Constraints: **ImmutableId** (or equivalent anchor attributes) and other directory linking keys are difficult to repoint safely once bound, **legal hold** accounts that must not be deleted, and guest lifecycles that differ from employees.
- Rollback: revert a mistaken **attribute map** or sync rule from saved config; prefer **disable** over hard-delete until retention and ownership checks pass.

## Lesson 4: Verification before production directory change

- **Done** when a **pilot cohort** shows correct licenses and memberships **after** the documented sync window, with no unexpected **privilege elevation** in messaging or admin roles.
- Document **sync schedule**, connector **service account** names, **attribute map** version, and who may grant **tenant admin** or equivalent high roles.
- Handoff: add a help-desk triage snippet distinguishing “**directory or sync**” vs. “**client or network**” for sign-in failures, with the first three checks for each path.

---

## Key takeaways

- **Treat the IdP as authoritative** for identity attributes unless you have a written, reviewed exception—console edits that fight sync create hard-to-close tickets.
- **Disable before delete** preserves audit chains, ownership, and rollback options; hard-delete is a last step after legal and app-owner sign-off.
- **Pilot and wait:** directory and sync changes need a cohort plus the full documented latency window before you trust org-wide behavior.

---

## Quiz

1. For an employee exit, **disabling** an account before hard deletion is often preferred because:  
   A) It preserves object ownership, audit references, and reversibility while removing access  
   B) It automatically deletes every mailbox with no backup  
   C) It grants the account to the employee’s manager with the same password  

2. **Nested groups** are commonly used to:  
   A) Model role-like access via membership chains, often mirrored from an IdP  
   B) Remove the need for any group at all  
   C) Guarantee every user belongs to exactly one global “EveryoneAdmin” group  

3. When **directory sync** disagrees with manual edits, a typical governance rule is:  
   A) Always overwrite the IdP from the console without review  
   B) Treat the IdP as the source of truth for identity attributes unless documented exceptions apply  
   C) Ignore timestamps and merge attributes at random  

4. **MFA for privileged administrators** is best described as:  
   A) Optional only when using public Wi-Fi  
   B) Strongly recommended or required by policy because admin sessions are high impact  
   C) A replacement for unique per-user accounts  

5. Rolling out a **stricter password policy** safely usually includes:  
   A) Communicating the change, staging enforcement, and validating lockout thresholds to avoid mass outages  
   B) Setting minimum length to one character for usability  
   C) Reusing the last fifty passwords to reduce help-desk load  

---

## Answer key

1. **A** · 2. **A** · 3. **B** · 4. **B** · 5. **A**
