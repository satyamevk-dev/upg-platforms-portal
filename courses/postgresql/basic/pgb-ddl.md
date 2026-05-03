# Module: DDL: tables, types & constraints

**Track:** Basic · **Module ID:** `pgb-ddl`

## Overview

This module aligns with the training library topic **DDL: tables, types & constraints**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- CREATE TABLE and common PostgreSQL data types
- NULL semantics and DEFAULT
- PRIMARY KEY, UNIQUE, NOT NULL, CHECK (intro)
- ALTER TABLE: add/drop column awareness

---

## Lesson 1: Foundations and context

- Relate this topic to adjacent modules in the same learning track.
- Identify the main components, terms, and boundaries you will manipulate or observe.
- List prerequisites (tools, access, or prior modules) needed for hands-on practice.

## Lesson 2: Core workflows

- Walk the primary **happy path** for tasks tied to this topic.
- Note common configuration or code patterns from documentation and examples.
- Capture **checkpoints** (commands, UI states, or query results) that prove success.

## Lesson 3: Pitfalls, constraints, and operations

- Recognize typical failure modes and how to narrow root cause quickly.
- Understand limits imposed by security, scale, or vendor contracts where relevant.
- Plan **rollback** or safe retry when changing production-like environments.

## Lesson 4: Verification and handoff

- Define **done**: tests, metrics, or sign-off criteria appropriate to this topic.
- Document decisions, URLs, IDs, or connection strings your team will need later.
- Prepare a concise handoff for peers or support (what changed, what to watch).

---

## Key takeaways

- **Structure first:** clarify goals and constraints before deep implementation.
- **Automate checks** where possible so regressions surface early.
- **Operational clarity** beats one-off heroics—prefer repeatable procedures.

---

## Quiz

1. The best first step when approaching a new task in this module is usually:  
   A) Change production settings immediately to learn faster  
   B) Clarify goals, prerequisites, and a safe environment (lab or lower tier)  
   C) Skip documentation to save time  

2. A **checkpoint** in a workflow is best described as:  
   A) An optional narrative in release notes only  
   B) A verifiable signal that a step completed correctly before continuing  
   C) Only a calendar reminder  

3. When something fails, prioritizing **narrow root cause** means:  
   A) Rebooting everything without evidence  
   B) Gathering minimal evidence (logs, errors, scope) before large changes  
   C) Waiting indefinitely without triage  

4. **Least privilege** in admin and API contexts generally means:  
   A) Grant everyone admin to reduce tickets  
   B) Grant only the permissions required for the role or automation  
   C) Share one shared password for convenience  

5. Documentation at handoff should emphasize:  
   A) Only personal opinions without facts  
   B) What changed, why, and what to monitor next  
   C) Deleting all logs for privacy  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B**
