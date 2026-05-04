# Module: APIs, webhooks & event automation

**Track:** Platform tools & automation · **Module ID:** `aocpta-apis`

## Overview

This module aligns with the training library topic **APIs, webhooks & event automation**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- REST patterns: pagination, idempotency, and error taxonomy
- Webhook registration, retries, and signature verification
- Event schemas, versioning, and consumer design
- Rate limits, backoff, and bulk job patterns

---

## Lesson 1: REST contracts, pagination, and idempotency

- Model each Avaya AOC automation use case as **resources** and **verbs**: which calls are safe to repeat, which require **idempotency keys** or natural keys, and how **pagination** cursors or offsets behave under load.
- Build a small internal **error taxonomy** (auth, validation, conflict, rate limit, server) so retries and alerting do not treat every `5xx` the same.
- Prerequisites: sandbox **base URLs**, Postman or `curl` collection checked into repo without secrets, and the vendor’s **OpenAPI** or reference doc version pinned for your release.

## Lesson 2: Webhooks, signatures, and consumer skeleton

- **Happy path**: register a webhook in **lab** only → implement **signature** verification (or mTLS if offered) → acknowledge quickly with `200` after enqueue to worker → process asynchronously with **retries** and **dead-letter**.
- Store **raw payload** hashes or IDs for replay debugging; never log full payloads if they contain PII without redaction policy.
- Checkpoints: duplicate delivery increments a **metric** but does not double-provision users; poison message lands in **DLQ** with alert.

## Lesson 3: Event schemas, rate limits, and bulk jobs

- Pitfalls: **schema drift** after AOC upgrade breaking JSON parsing; tight **retry** loops causing **429** storms; oversized **bulk** jobs blocking shared thread pools.
- Constraints: vendor **SLA** on delivery latency, maximum **webhook** registrations per tenant, and **payload** size caps.
- Rollback: disable subscription; pin consumer to prior **schema adapter** layer; drain DLQ before re-enabling.

## Lesson 4: Versioning and documentation for integrators

- **Done** when an **event catalog** (types, fields, sample payloads) lives next to code with a **SemVer** or date stamp tied to AOC build, and upgrade notes list **breaking** field changes.
- Document **retry policy**, **ordering** guarantees (if any), and **correlation** headers your workers must propagate into ITSM or logs.
- Handoff: link monitoring dashboards for **webhook lag**, **DLQ depth**, and **API error** rate per integration.

---

## Key takeaways

- **Idempotent consumers** and explicit **pagination** handling are non-negotiable when AOC or middleware retries deliveries.
- **Verify webhook authenticity** before any side effect; treat unsigned or wrong-signature traffic as hostile noise.
- **Version the event contract** alongside the AOC release train so upgrades are a migration plan, not a silent parser outage.

---

## Quiz

1. For list endpoints that return partial pages, clients should:  
   A) Assume one request always returns the full universe of rows  
   B) Follow documented pagination (cursor or offset) until an empty or terminal page  
   C) Disable TLS to get larger pages  

2. **Idempotent** POST or PATCH handling for automation most often relies on:  
   A) Random sleep without keys  
   B) Idempotency keys, stable natural keys, or upsert semantics so retries do not duplicate work  
   C) Deleting the database between retries  

3. Webhook handlers should verify **signatures** (when provided) to:  
   A) Speed up JSON parsing  
   B) Ensure the event came from the trusted sender and was not tampered with  
   C) Replace authentication on subsequent REST calls  

4. On HTTP **429 Too Many Requests**, the best default client behavior is:  
   A) Immediate tight loop with identical request rate  
   B) Exponential backoff with jitter and respect for `Retry-After` when present  
   C) Switch to HTTP without encryption  

5. **Bulk job** APIs should be designed with:  
   A) No chunking or status polling—fire one giant request and hope  
   B) Chunking, progress or job IDs, and clear partial-failure reporting per vendor patterns  
   C) Always synchronous responses for unlimited rows  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B**
