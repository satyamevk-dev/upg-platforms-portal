# Module: Troubleshooting methodology & support data

**Track:** Intermediate · **Module ID:** `int-trouble`

## Overview

Triage systematically, bundle evidence for vendors with **sosreport**/similar tools, recover from boot failures, and document incidents with timelines and rollback plans.

## Learning objectives

- Apply a **layered triage** model (hardware, network, app, OS).
- Collect **sosreport** / **supportconfig**-style payloads appropriately.
- Use **emergency mode**, **`rd.break`**, and **journal** from previous boot.
- Produce **timelines**, **config diffs**, and **rollback** documentation.

---

## Lesson 1: Structured triage: reproduce, isolate layer (hardware, network, app, OS)

- **Reproduce** with minimal steps; note **first failure** vs. cascading symptoms.
- **Swap components:** known-good config, alternate network path, different node—binary search the stack.
- **Change control:** one variable at a time; capture **before/after** metrics.

## Lesson 2: sosreport, supportconfig patterns for vendor cases

- **`sosreport`** bundles logs, configs, hardware—sanitize before external upload per policy.
- **supportconfig** (SUSE) analogous—match tool to distro; include **case ID** and **reproduction recipe**.

## Lesson 3: Boot failures: emergency mode, rd.break, journal from previous boot

- **emergency.target** / **rescue** shells when `/etc/fstab` or initqueue breaks.
- **`rd.break`** early in dracut for initramfs edits—rare, powerful, risky.
- **`journalctl -b -1`** reads last boot after recovery—correlate with power events and mounts.

## Lesson 4: Documenting findings: timelines, config diffs, and rollback plans

- **Timeline:** UTC stamps, change tickets, deploys, alerts—human-readable narrative.
- **Diffs:** `rpm -V`, `etckeeper`, Git for `/etc` where adopted.
- **Rollback:** how to revert feature flags, packages, and LB weights—tested before need.

---

## Key takeaways

- **Vendors close tickets faster** with sosreport + reproduction + timeline.
- **Boot debugging** rewards initramfs literacy—not only “grep syslog.”

---

## Quiz

1. **`sosreport`** is primarily used to:  
   A) Collect a bundled diagnostic archive for support cases  
   B) Resize swap files only  
   C) Configure LDAP  

2. **`journalctl -b -1`** helps after recovery by:  
   A) Showing logs from the previous boot for post-mortem analysis  
   B) Deleting old kernels  
   C) Listing only USB devices  

3. **Structured triage** encourages:  
   A) Reproducing and isolating which layer first exhibits failure  
   B) Changing ten settings at once for speed  
   C) Skipping metrics entirely  

4. **`rd.break`** is associated with:  
   A) Interrupting early initramfs boot for low-level debugging/repair  
   B) Rotating TLS certificates automatically  
   C) Managing Docker networks only  

5. A good incident doc should include:  
   A) Timeline, evidence bundles, config diffs, and rollback steps  
   B) Only emoji reactions  
   C) Unverifiable anecdotes only  

---

## Answer key

1. **A** · 2. **A** · 3. **A** · 4. **A** · 5. **A**
