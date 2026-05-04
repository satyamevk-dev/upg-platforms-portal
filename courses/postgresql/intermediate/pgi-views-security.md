# Module: Views, roles & object privileges

**Track:** Intermediate · **Module ID:** `pgi-views-security`

## Overview

This module aligns with the training library topic **Views, roles & object privileges**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Views for abstraction and simpler grants
- Roles, membership, and least privilege
- GRANT/REVOKE on tables and sequences
- Row-level security awareness

---

## Lesson 1: Views for abstraction and simpler grants

- **`CREATE VIEW`** packages a vetted `SELECT`—reporting tools and junior services can query the view while owners evolve underlying tables with controlled migrations.
- Know **`security invoker` vs. `security definer`** (PostgreSQL 15+ explicit defaults)—`SECURITY DEFINER` views are powerful and risky; document who may create them.
- Prerequisites: understanding of underlying **GRANT** targets (base tables vs. views) and search_path implications.

## Lesson 2: Roles, membership, and least privilege

- **Happy path**: model **login roles** for humans vs. **`NOLOGIN`** group roles holding privileges; `GRANT SELECT` on views to app roles while base tables stay private.
- Use **`ALTER DEFAULT PRIVILEGES`** in schemas so new objects inherit sane grants from day one.
- Checkpoints: `\dp` in `psql` shows effective ACLs; CI checks that migrations include privilege updates when adding tables.

## Lesson 3: GRANT/REVOKE, sequences, and RLS awareness

- Pitfalls: granting **`ALL`** “temporarily”; forgetting **`USAGE`/`SELECT`** on sequences backing serial columns; enabling **RLS** without policies and locking everyone out.
- **Row Level Security** policies belong to defense-in-depth—coordinate with app auth context (`SET ROLE` / JWT claims) before toggling `FORCE ROW LEVEL SECURITY`.
- Rollback: keep **`REVOKE`** scripts symmetric with grants in migrations; test as non-superuser role in staging.

## Lesson 4: Security review handoff

- **Done** when data owners sign **matrix**: role → allowed operations → objects; views documented with owner and definer semantics.
- Document **`search_path`** for `SECURITY DEFINER` functions/views to avoid hijack via object shadowing.
- Handoff: point to **replication & HA** advanced module if reporting replicas need read-only grants.

---

## Key takeaways

- **Views are a privilege firewall** when base tables are locked down—cheap abstraction, high leverage.
- **Group roles** keep grants manageable; avoid duplicating the same `GRANT` list across fifty service accounts.
- **RLS is sharp**—policy testing is mandatory before `FORCE` in production.

---

## Quiz

1. Granting **`SELECT` on a view** while withholding **`SELECT` on base tables** can work because:  
   A) Views always bypass permissions  
   B) The view owner’s rights (and security barrier/invoker/definer rules) mediate access to underlying objects  
   C) PostgreSQL ignores views  

2. A **`NOLOGIN`** role is commonly used to:  
   A) Connect from psql interactively  
   B) Group privileges that login roles inherit via `GRANT role TO user`  
   C) Replace passwords  

3. **`ALTER DEFAULT PRIVILEGES`** helps teams:  
   A) Skip all future `GRANT` statements  
   B) Apply consistent privileges to objects created by specific roles in a schema  
   C) Disable auditing  

4. **Row Level Security (RLS)** without policies typically:  
   A) Allows all rows for non-owners  
   B) Can deny all access for affected roles until policies exist—test carefully  
   C) Automatically infers policies from foreign keys  

5. Revoking privileges should be:  
   A) Done only in production first  
   B) Scripted, reviewed, and tested as non-superuser in lower environments before production rollout  
   C) Avoided forever  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B**
