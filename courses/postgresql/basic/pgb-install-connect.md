# Module: Install, connect & psql

**Track:** Basic · **Module ID:** `pgb-install-connect`

## Overview

This module aligns with the training library topic **Install, connect & psql**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Local install paths (packages, Docker) and service basics
- Connection strings: host, port, database, user, SSL awareness
- psql: connecting, meta-commands (\l, \dt, \d), and \?
- GUI clients vs. CLI for day-to-day work

---

## Lesson 1: Install paths and how the server runs

- Compare **package** installs (Linux distro or Postgres.app), **Docker** images, and **managed** cloud instances: who applies CVE patches, where `data_directory` lives, and how you restart the service (`pg_ctl`, systemd, or cloud console).
- Learn the default **listen_addresses**, **port 5432**, and why changing `postgresql.conf` requires a reload or restart depending on parameter class.
- Prerequisites: non-production host or container, sudo or equivalent where applicable, and firewall awareness if you bind beyond localhost.

## Lesson 2: Connection strings, roles, and SSL awareness

- **Happy path**: build a URI like `postgresql://user:pass@host:5432/dbname?sslmode=require` matching your org policy; connect with `psql "$DATABASE_URL"` without pasting secrets into shell history when avoidable.
- Map **database** name vs. **user** (role) name; know that `peer` vs. `scram-sha-256` authentication changes how passwords behave on local sockets vs. TCP.
- Checkpoints: `\conninfo` in `psql` shows host, port, user, database, and SSL; `SELECT version();` returns the exact server build you are learning against.

## Lesson 3: psql meta-commands and client tradeoffs

- Pitfalls: relying on **GUI-only** features in docs your CI cannot replay; forgetting `\x` for wide rows; using **superuser** locally and then being surprised by permission errors in prod.
- Constraints: corporate **TLS inspection** may require extra CA bundles; read-only **jump hosts** may block GUI forwarding—CLI remains the lowest common denominator.
- Rollback: keep a **known-good** connection snippet in a password manager or vault template, not scattered Slack messages.

## Lesson 4: Handoff—document the “golden path” connect

- **Done** when new engineers can connect from README steps in under ten minutes, including **SSL mode** and **search_path** notes if you set them.
- Document **port-forward** or **bastion** pattern if used; never commit `.pgpass` with secrets to Git—document the file format only.
- Handoff: link to internal runbook for **credential rotation** and where logs live (`pg_log` / cloud logging).

---

## Key takeaways

- **Connection strings encode policy** (SSL, timeouts)—treat them like code reviewed in PRs, not copy-paste folklore.
- **`psql` meta-commands** (`\l`, `\dt`, `\d`, `\?`) are the fastest way to explore a schema you did not build.
- **CLI-first** habits keep CI, support, and developers aligned; GUIs are optional accelerators.

---

## Quiz

1. The default PostgreSQL server port is conventionally:  
   A) 3306  
   B) 5432  
   C) 6379  

2. In `psql`, `\conninfo` shows:  
   A) Only the PostgreSQL version string  
   B) Current connection parameters such as host, port, database, user, and SSL usage  
   C) Only table sizes  

3. **`sslmode=require`** in a libpq URI generally means:  
   A) Disable encryption entirely  
   B) Encrypt the connection and verify encryption is in use per libpq rules (not full certificate pinning unless combined with other modes)  
   C) Allow plaintext passwords only  

4. A **role** used for application connections should usually:  
   A) Be the `postgres` superuser for simplicity  
   B) Have least privilege on the objects it needs—not superuser unless truly required  
   C) Share one password across every microservice  

5. **Meta-commands** in `psql` (for example `\dt`) are:  
   A) Standard SQL executed on the server unchanged  
   B) Client-side shortcuts interpreted by `psql`, not portable to every SQL GUI  
   C) Only available in Oracle mode  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B**
