# Module: Platform toolkit & CLIs

**Track:** Platform tools & automation · **Module ID:** `aocpta-toolkit`

## Overview

This module aligns with the training library topic **Platform toolkit & CLIs**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Official CLIs, SDKs, and supported runtime versions
- Authentication to tools: tokens, profiles, and secrets hygiene
- Workspace layout: config files, environments, and overrides
- Helpful diagnostics bundled with vendor tooling

---

## Lesson 1: Toolchain map and supported runtimes

- Inventory **official CLIs and SDKs** for your Avaya AOC automation surface; record **supported language or shell versions**, install paths, and how upgrades are distributed (package manager, vendor bundle, container image).
- Separate **human operator profiles** from **CI service principals** so token lifetime, MFA, and IP allowlists can differ without shared “god” credentials.
- Prerequisites: non-production **tenant**, read-only API role, a **secrets manager** account you can use from a lab VM, and the vendor matrix that states which tool version pairs with which AOC release.

## Lesson 2: Authentication, profiles, and workspace layout

- **Happy path**: install pinned tool version → create **profile** files per environment (`dev`, `stage`, `prod`) → authenticate with short-lived token or device login per org policy → run a **read-only** command (for example list or status) against `stage`.
- Standardize **workspace layout**: checked-in defaults in `config/`, local **overrides** in `.gitignore`, and documented **env vars** that never embed raw secrets.
- Checkpoints: two engineers run the same command with the same profile and see identical **API host** and **tenant** scope; diagnostics flag (`--verbose` or vendor equivalent) shows **request ID** you can correlate with server logs.

## Lesson 3: Failure modes around configs and secrets

- Pitfalls: **wrong profile** pointed at production; **stale** cached tokens; secrets pasted into **shell history** or **CI logs**; mixing **global** install with project-pinned version and getting subtle JSON schema mismatches.
- Constraints: corporate **proxy** or **TLS inspection** breaking CLI trust store; **air-gapped** runners requiring offline bundles; vendor **deprecation** windows for legacy auth modes.
- Rollback: keep **previous tool version** in artifact store; document `profile uninstall` or token revoke steps; prefer **feature flags** on automation side before destructive API calls.

## Lesson 4: Handoff for the platform toolkit

- **Done** when **version pins** (tool, SDK, OS) live in repo or image tag, **bootstrap** steps are scripted, and **smoke** read-only commands pass from a clean workstation following only the README.
- Document **download URLs**, **checksum** verification commands, and **support bundle** flags bundled with the CLI that your team will reuse during incidents.
- Handoff: add “**who upgrades the toolchain**” and calendar reminder tied to AOC release notes; link internal wiki from repo `CONTRIBUTING.md`.

---

## Key takeaways

- **Pin tool and runtime versions** next to AOC release compatibility—floating “latest” breaks automation the week of a vendor upgrade.
- **Profiles and workspaces** should make wrong-environment mistakes hard: naming, colors in prompts, and separate config paths beat good intentions alone.
- **Diagnostics flags** and request IDs are part of production readiness, not optional niceties when CLIs talk to live tenants.

---

## Quiz

1. **CLI/SDK authentication** for automation should prefer:  
   A) Long-lived shared passwords embedded in every script  
   B) Short-lived tokens or OAuth-style flows with scopes limited to the job, plus rotation  
   C) Disabling TLS verification so scripts run faster  

2. Splitting **human** and **CI** credentials mainly helps:  
   A) Eliminate the need for any audit trail  
   B) Apply different MFA, IP restrictions, and rotation policies without blocking pipelines  
   C) Give every pipeline full tenant admin by default  

3. Storing tenant defaults in repo while keeping secrets out of Git is best done with:  
   A) Checked-in non-secret config and local or vault-backed overrides ignored by version control  
   B) Committing `.env` with production API keys for team convenience  
   C) Storing secrets only in Slack DMs  

4. When a CLI fails after an AOC upgrade, a strong first step is:  
   A) Delete all automation without reading release notes  
   B) Compare tool/SDK version matrix to the new AOC version and reproduce with verbose or trace flags  
   C) Assume the network is always at fault without capturing request IDs  

5. **Least privilege** for a read-only health script means:  
   A) Grant tenant super-admin so the script never hits a 403  
   B) Grant only the API scopes or roles required for the specific read calls it performs  
   C) Share one service account password in email  

---

## Answer key

1. **B** · 2. **B** · 3. **A** · 4. **B** · 5. **B**
