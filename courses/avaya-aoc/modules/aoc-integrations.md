# Module: Integrations & APIs

**Track:** Avaya AOC · **Module ID:** `aoc-integrations`

## Overview

This module aligns with the training library topic **Integrations & APIs**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Webhooks, event subscriptions, and rate limits
- REST API authentication and common workflows
- CRM and ticketing integrations (patterns)
- Change windows and backward compatibility

---

## Lesson 1: Webhooks, REST surfaces, and integration boundaries

- Inventory **webhooks**, **event subscriptions**, and **REST** resources your AOC-related services expose; record **base URLs** per environment, **auth** modes (OAuth client credentials, API keys), and which events are **at-least-once** vs. effectively once.
- Define **idempotency** keys or natural keys for your consumers so duplicate deliveries (retries) do not double-provision users or double-charge internal systems.
- Prerequisites: sandbox **credentials** with least scope, updated **TLS trust** if you terminate on a private CA, and a dev instance of CRM or ITSM for safe writes.

## Lesson 2: Read-only integration first, then controlled writes

- **Happy path**: register a low-risk **subscription** in sandbox → verify **signature** or token validation in your worker → perform a read-only CRM lookup from an AOC-related identifier (user or ticket correlation field).
- Add a guarded **write** path (for example create or update ticket) that always forwards a **correlation ID** from the Avaya event payload through to the downstream system logs.
- Checkpoints: **429** handling with **exponential backoff** under load; **dead-letter** queue for poison messages; no secrets in client-side code or public repos.

## Lesson 3: Rate limits, secrets rotation, and API compatibility

- Pitfalls: tight **polling** loops that trip **throttling**; long-lived **shared** secrets in chat; undeclared **JSON schema** drift after an AOC upgrade breaks silent consumers.
- Constraints: vendor **SLA** on webhook delivery latency, maximum **parallel** connections, static **egress IP** requirements, and IP **allowlists** on either side.
- Rollback: disable the subscription or feature flag; **rotate** compromised credentials; pin consumers to a supported prior **API version** while you patch forward if the platform offers versioning.

## Lesson 4: Change windows and integration documentation

- **Done** when the integration **runbook** lists all environment URLs, credential **rotation** owner and calendar, **cutover** checklist for the next AOC upgrade, and monitoring links for error rate and lag.
- Document **field mappings** between Avaya payloads and CRM or ITSM, **webhook endpoint** URLs owned by your team, and on-call for the **middleware** tier—not only the Avaya platform team.
- Handoff: link from your internal CMDB or wiki to the AOC **integrations** configuration screen and to the repository that owns the consumer service.

---

## Key takeaways

- **Design for at-least-once delivery:** idempotent handlers, exponential backoff on **429**, and a **dead-letter** path beat “hope the webhook fires once.”
- **Secrets live in vaults** with rotation owners and calendars—not in repos, screenshots, or long-lived chat threads tied to integration accounts.
- **Version and document** every consumer against the AOC API and event matrix **before** the next upgrade window so breaking changes are a planned migration, not a fire drill.

---

## Quiz

1. Verifying **webhook signatures** (when offered) helps ensure:  
   A) Events came from the trusted sender and payloads were not tampered with in transit  
   B) Only the client’s screen resolution is validated  
   C) TLS certificates never expire  

2. For **REST API authentication**, preferred practice is:  
   A) Embed long-lived service passwords in public front-end code  
   B) Use OAuth client credentials, API keys, or tokens with rotation and minimal scopes  
   C) Reuse one global API key in every repository and chat room  

3. **Rate limits** on integration endpoints exist mainly to:  
   A) Protect the platform and partners from overload, abuse, and noisy retry storms  
   B) Guarantee unlimited throughput for any single client  
   C) Replace the need for authentication  

4. Maintaining **backward compatibility** when evolving APIs typically requires:  
   A) Silent breaking changes every release without notice  
   B) Versioning, deprecation timelines, and clear migration notes per vendor guidance  
   C) Deleting old versions the same day new ones ship, without clients testing  

5. **Event subscriptions** should be scoped to:  
   A) Only the event types your integration truly needs, to reduce cost and alert noise  
   B) Every available event at maximum verbosity regardless of use  
   C) Disable correlation IDs to shrink payloads  

---

## Answer key

1. **A** · 2. **B** · 3. **A** · 4. **B** · 5. **A**
