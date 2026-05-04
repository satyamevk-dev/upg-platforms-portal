# Module: Self-service & internal platforms

**Track:** Platform tools & automation · **Module ID:** `aocpta-selfservice`

## Overview

This module aligns with the training library topic **Self-service & internal platforms**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Service catalog patterns for common AOC requests
- Approval workflows and least-privilege execution roles
- ChatOps / ticketing integration for automation triggers
- Measuring adoption and toil reduction

---

## Lesson 1: Service catalog patterns for AOC requests

- Model recurring asks—**sandbox tenant**, **webhook registration**, **cert renewal**, **integration enablement**—as **catalog items** with standardized inputs, default risk tier, and estimated fulfillment time instead of free-text tickets only.
- Each item should declare **dependencies** (for example IdP group membership) and **verification** steps the requester can self-check before submit.
- Prerequisites: CMDB or **service** ownership data, RBAC mapping between catalog roles and AOC admin scopes, and a non-prod template tenant for safe automation trials.

## Lesson 2: Approvals and least-privilege execution roles

- **Happy path**: requester opens item → **manager** or **application owner** approves per policy → **pipeline** identity with **narrow** API scopes executes change → audit record links ticket, approver, and correlation ID.
- Separate **requester**, **approver**, and **executor** principals so no single account can both approve and apply high-risk changes alone where policy forbids it.
- Checkpoints: failed automation still writes structured **failure** reason; approvers see **diff** or plan output, not opaque “success” booleans only.

## Lesson 3: ChatOps and ticketing as automation triggers

- Pitfalls: chat commands without **authn** mapping to real users; **idempotency** gaps when someone spams “/provision” three times; **PII** pasted into channels triggering bots.
- Constraints: rate limits on **Slack** or **Teams** webhooks; change freeze windows; SOX-style **segregation** rules blocking self-merge of prod changes.
- Rollback: `/undo` or reopen ticket triggers compensating automation only when vendor APIs support safe reversal—otherwise attach human runbook.

## Lesson 4: Adoption, toil metrics, and continuous improvement

- **Done** when catalog shows **adoption** (requests per week), **median time to fulfill**, and **reopen rate** after automation; teams set quarterly **toil reduction** targets with leadership visibility.
- Survey power users for **top three** friction items; feed them into backlog ahead of new shiny integrations.
- Handoff: publish **FAQ** for “when not to use automation” (novel architecture, regulatory exception) to prevent shadow ops outside the platform.

---

## Key takeaways

- **Catalog + pipeline + audit** turns one-off hero scripts into a governable internal product for AOC operations.
- **Split request, approve, and execute identities** so convenience never collapses separation of duties your auditors expect.
- **Measure adoption and reopened tickets**—if automation does not reduce toil or errors, iterate on UX and guardrails, not blame requesters.

---

## Quiz

1. A **service catalog** item for AOC automation should typically include:  
   A) Only a blank text box with no defaults  
   B) Standard inputs, risk tier, dependencies, and verification steps the requester can validate  
   C) Direct production admin credentials for convenience  

2. Separating **approver** and **executor** roles mainly supports:  
   A) Faster unapproved changes  
   B) Segregation of duties and safer high-risk changes executed by narrow automation identities  
   C) Removing audit logs  

3. **ChatOps** triggers are safest when:  
   A) Anyone in any public channel can run destructive commands  
   B) Commands map to authenticated users, idempotent actions, and the same policy gates as the web catalog  
   C) They bypass ticketing entirely for all production work  

4. Measuring **toil reduction** after launching self-service should look at:  
   A) Only the number of lines of code written  
   B) Median fulfillment time, reopen rate, and manual escalations compared to baseline  
   C) Disabling all metrics to save cost  

5. Execution identities for automation should:  
   A) Always use a shared tenant super-admin password  
   B) Use least-privilege service principals or roles scoped to the catalog item’s actions  
   C) Rotate randomly without documentation  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B**
