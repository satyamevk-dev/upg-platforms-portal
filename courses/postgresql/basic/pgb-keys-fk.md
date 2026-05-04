# Module: Keys & relationships

**Track:** Basic · **Module ID:** `pgb-keys-fk`

## Overview

This module aligns with the training library topic **Keys & relationships**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Surrogate vs. natural keys
- FOREIGN KEY: purpose and ON DELETE/UPDATE behaviors (overview)
- Referential integrity in practice
- When to defer constraint checks (awareness)

---

## Lesson 1: Surrogate vs. natural keys

- **Surrogate keys** (`bigserial`, `uuid`) are stable when business attributes change; **natural keys** (email, country+tax id) encode domain meaning but may change or have exceptions—choose consciously per table.
- Composite natural keys are valid when the domain guarantees uniqueness and immutability; otherwise add a surrogate while **UNIQUE**-ing the natural columns.
- Prerequisites: normalized table sketches from design topics or a small ERD for practice.

## Lesson 2: FOREIGN KEY basics and referential actions

- **Happy path**: declare `REFERENCES parent(id)`; pick **`ON DELETE`** / **`ON UPDATE`** behaviors (`RESTRICT`, `CASCADE`, `SET NULL`) matching real business rules—not every child row should vanish when a parent soft-deletes.
- Index the **referencing column** on large child tables to avoid slow joins and FK checks even though PostgreSQL does not auto-create child-side indexes.
- Checkpoints: attempting to delete a parent with live children behaves as declared; `EXPLAIN` on joins shows expected index usage when statistics are healthy.

## Lesson 3: Integrity in practice and deferred checks

- Pitfalls: **orphan** rows introduced by bulk loads with constraints disabled; **`SET NULL`** without nullable column; **`CASCADE`** deletes wiping history nobody expected.
- **`DEFERRABLE INITIALLY DEFERRED`** constraints solve rare circular insert patterns—use sparingly and document transaction boundaries for app teams.
- Rollback: when migrating legacy data, **validate** with `LEFT JOIN ... WHERE child.parent_id IS NULL` before enabling FK enforcement.

## Lesson 4: Modeling review handoff

- **Done** when every relationship has named **ON DELETE** semantics in the ERD or migration comments, not only line arrows.
- Document **soft-delete** pattern (`deleted_at`) implications for FKs vs. hard delete.
- Handoff: point to **intermediate joins** and **transactions** modules for deeper concurrency stories.

---

## Key takeaways

- **Foreign keys are living documentation** of allowed associations—if the database does not know the rule, every app will disagree eventually.
- **`ON DELETE CASCADE`** is a chainsaw—wield it only when product and legal agree on mass deletes.
- **Index child FK columns** on big tables; PostgreSQL will not do that for you automatically.

---

## Quiz

1. A **surrogate primary key** is often used when:  
   A) Natural business identifiers are unstable, composite, or optional  
   B) You want duplicate rows in the same table  
   C) Foreign keys are illegal  

2. A **`FOREIGN KEY`** constraint primarily guarantees:  
   A) Column data types always match exactly  
   B) Referential integrity between child and parent rows per declared rules  
   C) Automatic indexing on every column  

3. **`ON DELETE SET NULL`** requires:  
   A) The referencing column to be nullable  
   B) The parent to have no primary key  
   C) Cascading deletes always  

4. **`ON DELETE CASCADE`** means:  
   A) Child rows are blocked from deleting  
   B) Deleting a parent row will delete dependent child rows automatically—use with care  
   C) Updates are forbidden  

5. **Deferrable** foreign key checks are mainly for:  
   A) Avoiding all constraints permanently  
   B) Special multi-statement transactions where intermediate states are temporarily inconsistent but final state is valid  
   C) Speeding up every insert unconditionally  

---

## Answer key

1. **A** · 2. **B** · 3. **A** · 4. **B** · 5. **B**
