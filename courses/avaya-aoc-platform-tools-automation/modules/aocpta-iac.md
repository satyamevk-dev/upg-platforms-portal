# Module: Infrastructure as code & config management

**Track:** Platform tools & automation · **Module ID:** `aocpta-iac`

## Overview

This module aligns with the training library topic **Infrastructure as code & config management**. Work through the lessons, try examples in a lab or sandbox, and use the quiz to confirm understanding before moving on.

## Learning objectives

- Declarative definitions for AOC dependencies (patterns)
- Drift detection and reconciliation workflows
- Secrets managers and rotation hooks
- GitOps-style promotion across environments

---

## Lesson 1: Declarative model for AOC-related dependencies

- Express **DNS, certificates, load balancers, databases**, and integration endpoints that AOC relies on as **declarative** resources in Terraform, Pulumi, Ansible, or your standard—avoid snowflake click-ops for anything that must match between regions.
- Tag resources with **owner**, **cost center**, and **environment** so drift reports and blast-radius analysis stay honest.
- Prerequisites: remote **state** with locking, policy-as-code (**OPA** or cloud guardrails), and a diagram of which objects are **shared** vs. **per-tenant** automation.

## Lesson 2: Plan, apply, and drift detection

- **Happy path**: `plan` in CI on every merge → human or policy approval for `apply` → post-apply **smoke** (health URL, synthetic login) recorded in the pipeline log.
- Schedule **drift detection** jobs that compare live cloud or VM state to desired spec; route deltas to the same backlog as product bugs when they affect AOC availability.
- Checkpoints: plan output shows **only** intended diffs; state file version increments correlate with change ticket IDs.

## Lesson 3: Secrets, rotation hooks, and GitOps promotion

- Pitfalls: secrets in **plain state** without remote backend encryption; **manual** hotfixes outside IaC that disappear next apply; promoting the same branch pointer to prod and stage accidentally.
- Constraints: regulated **key custody** (HSM, KMS); **air-gap** where `terraform apply` runs only from bastion; vendor **timeouts** on long-running resource creates.
- Rollback: keep previous **state snapshot** and tagged module version; document `terraform state rm` or vendor-specific **import** recovery only with senior review.

## Lesson 4: GitOps handoff and ownership

- **Done** when **main** branch rules require two reviews for prod paths, **Argo CD** or equivalent shows healthy sync, and **rollback** PR template exists.
- Document which repo paths map to **which** AOC environment and who may click **Sync** vs. who may merge only.
- Handoff: add **on-call** link and **SLO** dashboard for infrastructure underpinning AOC automation.

---

## Key takeaways

- **Plan before apply** in CI is your contract with auditors and future you—treat `apply` surprises as process bugs, not inevitabilities.
- **Drift** ignored long enough becomes “mystery outage”; schedule detection like any other production job.
- **Secrets belong in KMS-backed state or external data sources**, not in cleartext modules committed for convenience.

---

## Quiz

1. **Drift detection** in IaC contexts primarily means:  
   A) Ignoring manual console changes forever  
   B) Comparing live infrastructure state to declared desired state and surfacing differences  
   C) Deleting state files weekly  

2. Remote **state** with locking is important because:  
   A) It prevents concurrent applies corrupting the same state file  
   B) It removes the need for backups  
   C) It disables encryption  

3. **GitOps-style promotion** typically moves changes:  
   A) Only via direct SSH edits on production servers  
   B) Through version-controlled manifests merged forward dev → stage → prod with policy gates  
   C) By emailing JSON to operators  

4. **Secrets managers** integrate with IaC best when:  
   A) Long-lived passwords are hard-coded in modules  
   B) Short-lived credentials are generated at apply time or referenced by ID without storing plaintext in Git  
   C) Secrets are stored only in local `terraform.tfvars` committed to main  

5. After an unexpected `apply`, the first recovery thought should be:  
   A) Delete the entire cloud account  
   B) Use documented rollback: previous module or chart version, state restore, or targeted reverse resources per runbook  
   C) Re-run apply repeatedly until it succeeds  

---

## Answer key

1. **B** · 2. **A** · 3. **B** · 4. **B** · 5. **B**
