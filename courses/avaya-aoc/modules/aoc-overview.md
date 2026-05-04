# Module: Avaya AOC overview & architecture

**Track:** Avaya AOC · **Module ID:** `aoc-overview`

## Overview

This module aligns with the training library topic **Avaya AOC overview & architecture**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Role of AOC in the Avaya enterprise stack
- Core services, dependencies, and deployment models
- Licensing and capacity planning awareness
- Security model: roles, tenants, and least privilege

---

## Lesson 1: AOC’s place in the collaboration estate

- Map where **AOC** sits relative to identity (directory/IdP), endpoints, messaging and calling services, and integrations so you know what this administration plane governs versus what it only displays.
- Learn vocabulary you will reuse in every other module: **tenant** boundaries, **administrative roles**, **service dependencies**, and where **policy** is enforced in the path vs. delegated to another system.
- Prerequisites: lab or non-production AOC access, the admin/architecture guide for your **deployment model**, and a one-page sketch of your org’s real integration points (IdP, CRM, observability).

## Lesson 2: Architecture and deployment surfaces

- Trace a **happy path** for a standard user action (sign-in, join space, place test call) across client, authentication, AOC-managed configuration, and directory or integrations as described in Avaya documentation for your stack.
- Contrast **customer-operated** and **vendor-hosted** assumptions: who owns OS patching, certificates, network paths, and backup/DR for configuration and policy data.
- Checkpoints: you can list production **AOC base URLs**, identify your primary **cluster or region** name, and name one upstream **IdP** and one downstream **integration** your organization actually uses.

## Lesson 3: Licensing, capacity, and change risk

- Typical pitfalls: **capacity** surprises (concurrent admins, API volume, attachment or log growth), **license** or **entitlement** drift after upgrades or feature toggles, and internal wiki pages that no longer match the shipped UI.
- Constraints: contractual caps, mandatory **change approval**, **maintenance windows**, and regulatory expectations that limit who may hold super-administrator rights.
- Rollback mindset: export or snapshot critical **policies** before change; know how to revert a **feature flag** or policy revision per release notes; avoid “big bang” when a **pilot tenant** or cohort is available.

## Lesson 4: Security model and operational sign-off

- **Done** for this module when **tenant admin** assignments are reviewed, **break-glass** accounts and their MFA expectations are documented, and least-privilege **role** design is agreed with security.
- Document **AOC URLs**, environment names (prod/stage/lab), integration **service principals** or technical accounts, and escalation paths for identity vs. platform vs. network.
- Handoff: a short “day-2 ownership” note—who owns **patching**, who owns **backup verification**, who is **on-call** for AOC incidents, and where runbooks live.

---

## Key takeaways

- **Map the estate first:** dependencies, tenants, and integration blast radius belong on paper (or a diagram) before large architecture, licensing, or cutover bets.
- **Size growth honestly:** align entitlements and feature mix with measured or forecast usage so capacity surprises do not arrive as outages or audit findings.
- **Harden the admin plane:** least-privilege roles, documented break-glass, and clear day-2 ownership beat a culture of shared super-user accounts.

---

## Quiz

1. In an Avaya-focused enterprise stack, **Avaya AOC** is best described as:  
   A) A replacement for every edge network router  
   B) A platform for administering and governing Avaya collaboration capabilities and related policies  
   C) A generic NAS appliance for voicemail audio files only  

2. Before major changes to AOC-connected services, a sound architectural step is to:  
   A) Skip reading release notes if the UI looks familiar  
   B) Map core services, integrations, and upstream/downstream dependencies plus likely blast radius  
   C) Apply changes at peak traffic to shorten maintenance windows  

3. **Tenant isolation** and administrative **roles** primarily exist to:  
   A) Remove the need for any authentication  
   B) Enforce least privilege and separation of duties across teams and scopes  
   C) Guarantee identical permissions for every login  

4. When planning growth, **licensing and capacity** awareness helps you:  
   A) Align entitlements and feature mix with measured or forecast usage before large procurements  
   B) Disable monitoring to reduce database size  
   C) Assign every user a super-admin role for simplicity  

5. **Deployment models** (for example cloud vs. customer-operated) most strongly influence:  
   A) Who operates infrastructure, patching boundaries, and connectivity assumptions  
   B) The color of desk phone faceplates only  
   C) Whether TLS is ever used  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **A** · 5. **A**
