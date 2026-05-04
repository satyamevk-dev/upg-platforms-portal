# Module: Discover & assess

**Track:** Solution lifecycle · **Module ID:** `aocsl-discover`

## Overview

This module aligns with the training library topic **Discover & assess**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Stakeholder interviews and success criteria
- Current-state inventory: apps, identities, integrations
- Gap analysis vs. target AOC capabilities
- Risk register, assumptions, and dependencies

---

## Lesson 1: Stakeholders, outcomes, and success criteria

- Run structured **interviews** with business owners, IT, security, compliance, and help desk; capture **measurable** outcomes (for example “reduce admin toil hours,” “single sign-on for all employees,” “retention policy X”) instead of vague “modernize collaboration.”
- Separate **must-have** vs. **nice-to-have** for the first AOC release train; document **out of scope** explicitly to prevent scope creep disguised as “small asks.”
- Prerequisites: NDA-safe **workshop** calendar, interview script template, and access to existing **vendor** or **RFP** materials your organization already trusts.

## Lesson 2: Current-state inventory and evidence

- **Happy path**: build a **system of record** spreadsheet or CMDB extract listing collaboration **apps**, **identities** (IdP, AD attributes), **integrations** (CRM, ITSM, SBC), and **data flows** with owners and last-change dates.
- Pull **license** counts, **support ticket** themes, and **incident** history for legacy platforms to quantify pain, not only anecdotes.
- Checkpoints: every row has an **owner**; unknowns are logged as **assumptions** with expiry dates, not silently treated as facts.

## Lesson 3: Gap analysis, risks, and dependencies

- Map current capabilities to **target AOC** capabilities using vendor capability matrices **plus** your internal policies (MFA, retention, geo).
- Maintain a living **risk register**: technical (latency, capacity), organizational (training debt), schedule (vendor lead times), and **dependency** risks (IdP cutover, circuit installs).
- Rollback mindset at this phase means **killing** or **rescoping** the program early if discovery shows unbounded dependencies—cheaper than a failed cutover.

## Lesson 4: Handoff into design and charter

- **Done** when a **signed discovery summary** lists success criteria, inventory, prioritized gaps, top risks with mitigations, and a **recommendation** on path (phased vs. pilot-first).
- Document **assumption owners**, **data classification** for shared artifacts, and **links** to raw interview notes stored per records policy.
- Handoff: formal **kickoff** into design with RACI draft and **decision log** template attached.

---

## Key takeaways

- **Written, measurable success criteria** beat slide-deck optimism—they anchor scope when pressure arrives mid-program.
- **Inventory with owners and dates** turns “we think we have 12 apps” into evidence the CFO and auditors can trust.
- **Risks and assumptions belong in daylight** early; discovery is cheap therapy compared to production cutover surprises.

---

## Quiz

1. During **discover**, success criteria should ideally be:  
   A) Vague slogans only  
   B) Measurable and agreed with sponsors (for example SLO-style outcomes or KPIs)  
   C) Defined only after go-live  

2. A **current-state inventory** for an AOC program should include:  
   A) Only desk phone models  
   B) Applications, identities, integrations, data flows, and ownership—not only the Avaya components  
   C) Marketing brand colors only  

3. **Gap analysis** compares:  
   A) Two unrelated vendors’ marketing sites  
   B) Today’s capabilities and constraints to the target AOC-aligned future state your organization defined  
   C) Only employee headcount  

4. A **risk register** is most useful when each risk has:  
   A) No owner and no mitigation plan  
   B) Owner, likelihood or impact class, mitigation, and trigger for escalation  
   C) Only a title with no follow-up  

5. **Assumptions** discovered during interviews should be:  
   A) Hidden from sponsors to avoid questions  
   B) Logged with owners, validation steps, and dates—then closed or promoted to facts  
   C) Ignored if inconvenient  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B**
