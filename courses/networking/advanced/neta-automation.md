# Module: Network automation at scale

**Track:** Advanced · **Module ID:** `neta-automation`

## Overview

Automation turns **intent** into **consistent configuration** with **verification**. This module covers **source of truth**, **Ansible/Netmiko/Nornir** patterns, **NETCONF/RESTCONF/gNMI**, and **safe change** with rollback.

## Learning objectives

- Contrast **imperative** scripts vs. **declarative** intent models.
- Describe **idempotency** and **facts** gathering before change.
- Map common APIs: **CLI screen-scraping**, **NETCONF**, **RESTCONF**, **gNMI**.
- List **pre/post checks** and **automated rollback** triggers.

---

## Lesson 1: Source of truth and data models

- **SoT** may be **Git**, **IPAM/DCIM**, or **controller**—pick **one writer** per field to avoid drift.
- **YANG** models underpin **NETCONF/RESTCONF**—vendor deviations still exist; test in lab.

## Lesson 2: Ansible / Nornir / Netmiko patterns

- **Netmiko:** SSH CLI automation—simple, brittle to prompt changes.
- **Ansible:** modules + **playbooks**, **roles**, **inventory**; good for org-wide adoption.
- **Nornir:** Python framework with **inventory + tasks**—developer-friendly.

## Lesson 3: NAPALM, NETCONF, RESTCONF, gNMI

- **NAPALM** provides multi-vendor **getter** + **merge/replace** abstractions for some platforms.
- **NETCONF** RPC over SSH; **RESTCONF** HTTP; **gNMI** streaming telemetry + get/set—modern platforms standardize here.

## Lesson 4: Pre/post checks and rollback

- **Before:** **route counts**, **BGP states**, **interface errors**, **critical pings**.
- **After:** same checks + **synthetic tests**; **automatic rollback** on failure thresholds.
- **Canary** devices or **maintenance windows** for first rollout.

---

## Key takeaways

- **Automate verification**, not only pushing config.
- **Screen-scraping** is tech debt—migrate to **model-driven** APIs when possible.
- **Git review** for network changes is **change control**.

---

## Quiz

1. **Idempotent** automation means:  
   A) Every run duplicates config blindly  
   B) Repeated runs converge to desired state without unintended side effects  
   C) Only works on Wi-Fi  

2. **YANG** is most closely tied to:  
   A) Data models for NETCONF/RESTCONF  
   B) DHCP options  
   C) BGP MED  

3. **gNMI** is commonly used for:  
   A) Streaming telemetry and programmatic get/set on modern devices  
   B) Only DNS  
   C) Only L2 STP  

4. **Netmiko** is best described as:  
   A) Multi-vendor SSH CLI library  
   B) Only a syslog server  
   C) An MPLS label protocol  

5. **Pre/post checks** in automation primarily:  
   A) Replace the need for backups  
   B) Detect unintended impact quickly and trigger rollback  
   C) Disable all ACLs  

---

## Answer key

1. **B** · 2. **A** · 3. **A** · 4. **A** · 5. **B**
