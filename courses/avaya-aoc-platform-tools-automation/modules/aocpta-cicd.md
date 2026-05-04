# Module: CI/CD for platform changes

**Track:** Platform tools & automation · **Module ID:** `aocpta-cicd`

## Overview

This module aligns with the training library topic **CI/CD for platform changes**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Pipeline stages: validate, plan, apply, smoke test
- Immutable artifacts and version pinning
- Blue/green or canary for risky control-plane updates
- Rollback triggers and automated guardrails

---

## Lesson 1: Pipeline stages from validate to smoke

- Standardize stages: **lint** → **unit** → **plan** or **diff** → **policy** scan → **apply** (only on protected branch) → **post-deploy smoke** hitting AOC health and one synthetic admin API.
- Require **human approval** or change ticket ID on production applies; inject **artifact digest** into deployment manifest so what ran is provable.
- Prerequisites: ephemeral **test** tenant, secrets scoped per environment, and feature flags to disable risky jobs on hotfix branches.

## Lesson 2: Immutable artifacts and version pinning

- Build **container images** or **OCI bundles** once; promote the same digest through environments—never rebuild “the same” tag at prod time with drifting base layers.
- Pin **Helm chart**, **Terraform module**, and **vendor CLI** versions in lockfiles committed beside application code.
- Checkpoints: rollback means redeploying **previous digest** from registry, not guessing a git SHA from memory.

## Lesson 3: Blue/green, canary, and automated guardrails

- Pitfalls: **canary** without **metric** gates; skipping **database migration** ordering; pipelines that **SSH** directly instead of using declared deployers.
- Constraints: maintenance windows for **AOC vendor** upgrades; maximum parallel deploys; compliance scans that must pass before prod.
- Rollback triggers: error budget burn, synthetic failure, or manual **big red button** job that redeploys last-known-good and opens incident bridge.

## Lesson 4: Release documentation and ownership

- **Done** when release notes list **AOC version**, automation version, schema migrations, and **feature flags** toggled; on-call acknowledges healthy **SLO** after soak period.
- Document who may **pause** pipeline, who approves **hotfix** merges, and where **postmortem** template lives.
- Handoff: link pipeline dashboard and **deployment frequency** / **lead time** metrics for platform leadership reviews.

---

## Key takeaways

- **Immutable artifacts** promoted by digest make rollbacks boringly fast—redeploy last digest, not “rebuild and hope.”
- **Automated smoke plus metric gates** on canaries turn gut-feel releases into evidence-based go/no-go decisions.
- **Guardrails in CI** (policy, secrets scan, license check) are cheaper than production firefighting after a bad merge.

---

## Quiz

1. A healthy **CI/CD** sequence for infrastructure or config changes usually includes:  
   A) Only manual SSH edits on production  
   B) Validate, plan or diff, policy checks, controlled apply, and post-deploy smoke tests  
   C) Skipping tests when the change is small  

2. **Immutable artifacts** in deployment pipelines mean:  
   A) The same built image or bundle digest is promoted across environments rather than rebuilding ad hoc per stage  
   B) Artifacts must never be stored in a registry  
   C) Every environment builds from different unlabeled sources  

3. **Canary** releases are most valuable when paired with:  
   A) Automated metrics or health checks that can halt or roll back traffic on regression  
   B) Deploying to 100% of users instantly without observation  
   C) Disabling monitoring to reduce noise  

4. **Rollback triggers** should ideally be:  
   A) Undefined so operators improvise  
   B) Documented thresholds (errors, latency, synthetic failures) that automatically or quickly initiate rollback  
   C) Only usable after a full week of outage  

5. **Version pinning** for Helm, Terraform modules, or vendor CLIs helps because:  
   A) It makes upgrades impossible  
   B) It makes upgrades deliberate: you choose when to advance versions after testing  
   C) It removes the need for a lockfile  

---

## Answer key

1. **B** · 2. **A** · 3. **A** · 4. **B** · 5. **B**
