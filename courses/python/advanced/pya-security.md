# Module: Security & supply chain

**Track:** Advanced · **Module ID:** `pya-security`

## Overview

This module aligns with the training library topic **Security & supply chain**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Secrets management and unsafe deserialization
- Dependency scanning and SBOM awareness
- Sandboxing subprocesses and validating inputs
- Reproducible builds and lockfiles

---

## Lesson 1: Secrets, env vars, and unsafe deserialization

- Never **`pickle.loads`** on untrusted bytes—remote code execution; prefer **`json`**, **`pydantic`**, **`msgpack`** with schema validation for external input.
- Load secrets from **vault**, **cloud secret manager**, or **runtime env** injection in orchestrators—not committed `.env` files in Git.
- Prerequisites: packaging module for dependency pinning; security contact for crypto review on anything touching TLS or tokens.

## Lesson 2: Dependency scanning, SBOM, and supply chain

- **Happy path**: enable **`pip-audit`/`uv audit`**, GitHub Dependabot, or equivalent; export **SBOM** (`cyclonedx`) from builds; block PR merges on **critical** CVEs with documented exceptions process.
- Pin **hashes** in lockfiles when feasible; verify **wheel** provenance if your org requires it.
- Checkpoints: CI fails on known vulnerable `requests` versions; license allowlist enforced.

## Lesson 3: Subprocess sandboxing and input validation

- Pitfalls: **`shell=True`** with user fragments; passing unsanitized paths to **`os.system`**; regex **ReDoS** on user patterns.
- Use **`subprocess.run([...], check=True)`** with argv lists; validate URLs with **`urllib.parse`**, file paths with **`Path.resolve`** and allowlists.
- Rollback: feature disable flags for risky integrations until validation library lands.

## Lesson 4: Reproducible builds and security handoff

- **Done** when **SLSA**-style provenance or internal equivalent documented; **signing** for release artifacts if applicable.
- Run **bandit**/`ruff` security rules in CI; document **exception** comments with ticket links only.
- Handoff: **platform** module for container hardening and runtime observability of security events.

## Lesson 5: Lab—`pip-audit` / hash pins and a toy threat model

- Run **`pip-audit`** (or your org’s scanner) on a small `requirements.txt`—file one finding as a fake CVE narrative: impact, blast radius, fix version.
- Regenerate a lock with **hash pins** if your toolchain supports it—diff the lockfile and note what changed.
- Write a **STRIDE-lite** table for a CLI that reads local files and POSTs JSON—mark spoofing/tampering/elevation rows as N/A or in-scope with one mitigation each.

## Lesson 6: Anti-patterns in app security

- **`yaml.load` on untrusted YAML**—same class of risk as unsafe pickle patterns; use **`safe_load`** and schema validation.
- **Regex as the only parser** for structured input—invites bypasses and ReDoS; use real parsers and limits.
- **Security exceptions in CI without expiry**—exceptions become permanent debt; ticket + sunset date.

---

## Key takeaways

- **`pickle` is not a wire format**—treat it like `eval` with extra steps.
- **Secrets in repos are incidents waiting for git clone**—vaults exist for a reason.
- **Supply chain security is CI security**—automate scanning or accept silent drift.

---

## Quiz

1. **`pickle.loads(untrusted_bytes)`** is dangerous because:  
   A) It is always slower than JSON  
   B) It can execute arbitrary code during deserialization  
   C) It only supports strings  

2. **SBOM** (Software Bill of Materials) primarily helps:  
   A) Speed up Python imports  
   B) Track third-party components for vulnerability and license response  
   C) Replace unit tests  

3. Using **`subprocess.run(..., shell=True)`** with partially user-controlled strings is risky because:  
   A) It always disables logging  
   B) It can allow shell injection if strings are not strictly controlled  
   C) It forbids timeouts  

4. Storing production **API keys** in a committed **`.env`** file is:  
   A) Best practice  
   B) Unsafe—secrets should live in secret managers or CI-injected environment with access controls  
   C) Required by pip  

5. **Dependency scanning** in CI is valuable because:  
   A) It removes the need for locks  
   B) It surfaces known CVEs in pinned dependencies before they reach production  
   C) It replaces code review  

6. **`yaml.load` on untrusted input** is risky because:  
   A) YAML cannot represent nested data  
   B) Arbitrary objects/tags may be constructed—prefer **`safe_load`** and validation  
   C) It is always faster than JSON  

7. **ReDoS** (regular expression denial of service) matters when:  
   A) Patterns are only used on trusted constants  
   B) User-controlled patterns or inputs meet catastrophic backtracking—timeouts and simpler parsers help  
   C) `re` is not in the standard library  

8. **Lockfiles plus scanning** together help because:  
   A) Locks alone prove code is vulnerability-free  
   B) Locks pin what you ship; scanning tells you whether those pins include known bad versions  
   C) Scanning removes the need to pin versions  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B** · 6. **B** · 7. **B** · 8. **B**
