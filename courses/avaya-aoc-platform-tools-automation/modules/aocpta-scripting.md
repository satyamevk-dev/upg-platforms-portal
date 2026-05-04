# Module: Scripting & orchestration

**Track:** Platform tools & automation · **Module ID:** `aocpta-scripting`

## Overview

This module aligns with the training library topic **Scripting & orchestration**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Shell vs. Python vs. PowerShell trade-offs for ops tasks
- Parameterizing scripts for multi-tenant runs
- Safe credential injection (no secrets in logs)
- Wrapping vendor APIs in small reusable modules

---

## Lesson 1: Picking the runtime—shell, Python, or PowerShell

- Choose **shell** for glue around CLIs and quick ops; **Python** for structured data, retries, and tests around vendor SDKs; **PowerShell** when Windows jump hosts or Active Directory–adjacent tasks dominate your estate.
- Standardize **style**: `set -o pipefail` (bash), `StrictMode` (PowerShell), or typed Python entrypoints so failures do not masquerade as success.
- Prerequisites: pinned **interpreter** version in `pyproject` or container, **lint** and **format** in CI, and a shared **logging** format that includes tenant and correlation IDs.

## Lesson 2: Parameterized, multi-tenant safe runs

- **Happy path**: script accepts `--tenant`, `--environment`, and `--dry-run` → loads secrets from **vault** or env injection → performs read-only validation → applies change only with explicit `--apply` flag.
- Wrap vendor calls in a **single module** per API surface so retries, logging, and metrics stay consistent across scripts.
- Checkpoints: dry-run diff matches reviewer expectation; same script works for **two** lab tenants without copy-paste edits to URLs.

## Lesson 3: Credential injection, logging, and failure visibility

- Pitfalls: `echo $TOKEN`; **tracebacks** leaking headers; `curl -v` in shared CI logs; ignoring **partial** failure when looping users.
- Constraints: secrets never in **argv** visible to `ps`; Windows **Credential Manager** vs. Linux **keyring** differences; corporate **read-only** filesystems on runners.
- Rollback: scripts support `--undo` or emit **reverse** API calls only when vendor supports safe deletes; otherwise emit human checklist.

## Lesson 4: Packaging scripts for the team

- **Done** when `README` lists inputs, outputs, exit codes, and **example** invocations; CI runs **shellcheck**, **ruff**, or **PSScriptAnalyzer** as applicable.
- Document **required** env vars in `.env.example` without values; link runbook for common exit `3` vs `4` meanings you define.
- Handoff: publish scripts as versioned **package** or container so “works on my laptop” disappears from incidents vocabulary.

---

## Key takeaways

- **One thin wrapper module** around each vendor API beats ten copy-pasted `curl` blocks that diverge on retry semantics.
- **`--dry-run` plus explicit `--apply`** turns dangerous automation into reviewable, auditable operations.
- **Logs are not a secrets store**—redact tokens and payloads by default; structured logs speed AOC incident correlation.

---

## Quiz

1. Passing secrets to a script is least risky when:  
   A) Hard-coding them at the top of the file for speed  
   B) Injecting from a vault or CI secret store at runtime without printing them to stdout  
   C) Passing them as visible command-line arguments for simplicity  

2. A **`--dry-run`** mode is valuable because it:  
   A) Deletes faster in production  
   B) Shows intended API calls or config diffs without committing side effects  
   C) Disables authentication to simplify testing  

3. For multi-tenant automation, **parameterizing** tenant and environment IDs prevents:  
   A) Accidental runs against the wrong tenant when URLs differ only subtly  
   B) All logging  
   C) Version control  

4. Centralizing vendor HTTP calls in a **shared module** mainly helps:  
   A) Guarantee every script uses the same retries, timeouts, and observability hooks  
   B) Remove the need for code review  
   C) Avoid ever updating dependencies  

5. When logging API errors, you should:  
   A) Log full Authorization headers for debugging  
   B) Log correlation IDs, HTTP status, and redacted bodies per policy  
   C) Disable logging to save disk  

---

## Answer key

1. **B** · 2. **B** · 3. **A** · 4. **A** · 5. **B**
