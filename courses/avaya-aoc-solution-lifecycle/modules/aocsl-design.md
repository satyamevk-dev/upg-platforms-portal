# Module: Design & architect

**Track:** Solution lifecycle · **Module ID:** `aocsl-design`

## Overview

This module aligns with the training library topic **Design & architect**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Reference architecture and environment tiers (dev/test/prod)
- Identity, networking, and security boundaries
- Data residency, compliance, and retention design
- Integration contracts and API/event design

---

## Lesson 1: Reference architecture and environment tiers

- Produce a **reference architecture** diagram: **dev**, **test**, **stage**, and **prod** for AOC and dependencies (IdP, SBC, observability, ITSM); show **traffic** and **admin** paths, not only server icons.
- Define **promotion** rules: which changes flow automatically vs. which require CAB; align **naming** and **tagging** standards for resources and tenants.
- Prerequisites: approved **network** segments, **certificate** authority strategy, and discovery outputs listing non-negotiable compliance boundaries.

## Lesson 2: Identity, networking, and security boundaries

- **Happy path**: document **trust zones**—where admin APIs terminate, where **break-glass** lives, how **MFA** applies, and which **integrations** may cross the DMZ.
- Specify **least-privilege** admin roles mapped to real job functions; include **separation of duties** for high-risk actions (for example tenant destroy vs. day-2 config).
- Checkpoints: security **sign-off** on **data flows**; penetration test scope agreed if required; **firewall** ruleset draft attached to the design package.

## Lesson 3: Data residency, retention, and integration contracts

- Pitfalls: **residency** chosen late forcing redesign; **retention** mismatched to legal hold reality; **integration** payloads carrying PII without DLP review.
- Constraints: **regulatory** region locks, **vendor** multi-tenant vs. dedicated options, and **API rate** assumptions baked into wrong tier sizing.
- Rollback at design means revising **contracts** (SLA, DPA) before build spends money—cheaper than renegotiating mid-deploy.

## Lesson 4: Design package handoff to plan and build

- **Done** when **architecture decision records (ADRs)** exist for major forks (cloud vs. on-prem extension, IdP choice, observability stack), with alternatives rejected and rationale.
- Document **integration contracts**: event schemas, auth modes, **SLO** targets, and **backward compatibility** expectations for partner systems.
- Handoff: **review board** (security, network, apps) minutes stored; **bill of materials** for licenses and infra attached to cost workbook in Plan module.

---

## Key takeaways

- **Draw boundaries before you buy hardware**—identity, network, and admin blast radius belong on paper with signatures, not in post-incident PDFs.
- **Compliance and residency are design inputs**, not footnotes; retrofitting them after build is expensive and politically toxic.
- **Versioned integration contracts** (events, APIs, SLAs) keep AOC, partners, and your automation team aligned through upgrades.

---

## Quiz

1. **Environment tiers** (dev/test/stage/prod) primarily exist to:  
   A) Increase license cost without benefit  
   B) Reduce risk by testing changes and promotions before customer-impacting production  
   C) Eliminate the need for documentation  

2. In design, **security boundaries** should clarify:  
   A) Only logo placement  
   B) Trust zones, MFA expectations, admin API exposure, and separation of duties for high-risk actions  
   C) Only desktop wallpaper policy  

3. **Data residency** decisions are best made:  
   A) After production go-live when users complain  
   B) During design, aligned with regulatory, contractual, and vendor deployment options  
   C) Randomly per team preference  

4. **Integration contracts** in the design phase should capture:  
   A) Only internal nicknames for services  
   B) Auth modes, payload sensitivity, rate expectations, versioning, and ownership on both sides  
   C) No SLAs or error handling expectations  

5. **ADRs** (architecture decision records) are valuable because they:  
   A) Replace all testing  
   B) Capture major decisions, rejected alternatives, and rationale for future auditors and new engineers  
   C) Must never be updated  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B**
