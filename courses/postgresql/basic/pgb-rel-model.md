# Module: Relational model & PostgreSQL overview

**Track:** Basic · **Module ID:** `pgb-rel-model`

## Overview

This module aligns with the training library topic **Relational model & PostgreSQL overview**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Tables, rows, columns, and primary keys in plain language
- How PostgreSQL fits in the data stack (OLTP, apps, analytics awareness)
- Server, cluster, database, schema — naming the pieces
- Community vs. vendor distributions and version cadence

---

## Lesson 1: Tables, rows, columns, and keys in plain language

- Relate **tables** to spreadsheets-with-rules: each **row** is one fact (one order, one customer), each **column** is a named attribute with a declared **type**, and **primary keys** guarantee you can point at a row unambiguously.
- Contrast **logical** design (what the business means) with **physical** storage (how PostgreSQL stores it on disk)—you mostly think in logical terms when writing SQL.
- Prerequisites: a running PostgreSQL instance (local or Docker), `psql`, and a tiny sample dataset or the willingness to `CREATE TABLE` a few toy tables.

## Lesson 2: PostgreSQL in the data stack

- **Happy path**: identify where **OLTP** Postgres sits behind your app APIs vs. where **analytical** workloads might still flow to a warehouse or columnar engine—Postgres can do both in small doses, but mixing huge batch jobs with latency-sensitive transactions needs awareness.
- Name the moving parts you will hear in operations: **instance** (one server process tree), **database**, **schema** namespace inside a database, and optional **read replicas** in larger setups.
- Checkpoints: you can draw a one-page diagram: app → connection pool → Postgres → backups; mark which tier owns **schema migrations**.

## Lesson 3: Naming hierarchy and distribution choices

- Pitfalls: saying “**database**” when you mean **schema**, or creating everything in `public` until migrations become painful; assuming “**cluster**” always means Kubernetes—it may mean one PostgreSQL **server** with multiple databases.
- Understand **community PostgreSQL** vs. **vendor** forks or managed offerings: same SQL core, different **upgrade cadence**, **extensions**, and **SLA** owner.
- Rollback mindset at modeling time: avoid encoding **business rules** only in application code when a **constraint** in the database would protect every client.

## Lesson 4: Handoff to install and modeling work

- **Done** when your glossary (instance, database, schema, role, table, key) is shared with the team and linked from the repo **README** for new hires.
- Document which **major version** you target and where release notes live (`postgresql.org` docs for community).
- Handoff: list **next modules** in order—install/connect, then DDL—so learners know why keys matter before they create real tables.

---

## Key takeaways

- **Rows and keys are contracts** with every application that touches the table—design them before the ORM owns you.
- **Schema namespaces** exist to organize objects; defaulting everything to `public` scales poorly in multi-team systems.
- **Community vs. managed vs. fork** changes who patches production—name that owner early.

---

## Quiz

1. In relational terms, a **primary key** most directly ensures:  
   A) Every column is nullable  
   B) Each row in a table can be uniquely identified within that table  
   C) Indexes are never needed  

2. A **schema** in PostgreSQL is best described as:  
   A) A separate physical server always  
   B) A namespace inside a database that groups tables, views, and other objects  
   C) The same thing as a database always  

3. PostgreSQL is commonly categorized as:  
   A) Only a key-value cache  
   B) A general-purpose relational OLTP database that can host analytics-style workloads with care  
   C) Only a message queue  

4. In many teams, “**cluster**” in PostgreSQL documentation often means:  
   A) Only Kubernetes  
   B) A running PostgreSQL instance (server) and its databases, not necessarily container orchestration  
   C) A spreadsheet file  

5. **Community PostgreSQL** differs from some vendor distributions mainly in:  
   A) There is no SQL support  
   B) Packaging, support model, extensions, and upgrade cadence may differ while the core SQL engine stays familiar  
   C) It cannot enforce foreign keys  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B**
