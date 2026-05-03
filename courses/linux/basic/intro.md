# Module: Linux introduction & distributions

**Track:** Basic · **Module ID:** `intro`

## Overview

You will learn what Linux is at the kernel and distribution level, how enterprise distributions differ, how licensing affects use and redistribution, and where to find authoritative help.

## Learning objectives

- Distinguish the Linux kernel from a distribution and from “Linux” as an ecosystem.
- Name common enterprise distros and their typical support models.
- Explain GPL vs. permissive licenses at a high level.
- Use `man`, `--help`, and vendor documentation effectively.

---

## Lesson 1: Linux vs. kernel vs. distribution

- The **kernel** manages hardware, processes, memory, and system calls. Everything else (libraries, init system, package manager, default configs) is **userspace**, often packaged as a **distribution** (“distro”).
- A **distribution** combines the kernel, GNU/core utilities, package management, policies, and often commercial support (e.g. RHEL) or community governance (e.g. Debian).
- **Hands-on:** Run `uname -r` (kernel release) and `cat /etc/os-release` (distribution metadata).

## Lesson 2: Common enterprise distros (RHEL, Ubuntu, SUSE)

- **RHEL / Rocky / Alma:** RPM/DNF family; long support cycles; common in regulated and enterprise environments.
- **Ubuntu LTS:** Debian heritage; `.deb`/`apt`; strong cloud and developer adoption.
- **SUSE Linux Enterprise:** RPM/zypper; strong in SAP and European enterprise contexts.
- Compare **support lifecycle** (major/minor, ELS) when choosing a baseline for servers.

## Lesson 3: Open-source licensing (GPL, upstream/downstream)

- **GPL-style** licenses often require sharing source when you distribute binaries; **permissive** licenses (e.g. MIT, BSD) impose fewer obligations.
- **Upstream** is the primary open-source project; **downstream** vendors add branding, support, certification, and sometimes delay patches for stabilization.
- Always follow your organization’s **compliance** team for redistribution and modification.

## Lesson 4: Getting help: `man`, `--help`, `info`, vendor docs

- `man <command>` — manual pages; sections (1=user commands, 5=config files, 8=admin).
- `<command> --help` — quick usage (not standardized across all tools).
- `info <command>` — GNU info system (navigation: `n`, `p`, `q`).
- Vendor **knowledge bases** and **security advisories** are authoritative for production issues.

---

## Key takeaways

- You work with a **distribution**, not “raw kernel only,” in practice.
- **Licensing and support lifecycle** drive enterprise choices as much as features.

---

## Quiz

1. Which best describes a Linux **distribution**?  
   A) Only the kernel source tree  
   B) Kernel plus integrated userspace, tools, and policies  
   C) A Windows compatibility layer  

2. Which file commonly identifies the installed distro?  
   A) `/etc/passwd`  
   B) `/etc/os-release`  
   C) `/boot/grub/grub.cfg`  

3. In enterprise contexts, **upstream** usually means:  
   A) Your company’s internal Git server only  
   B) The primary open-source project maintainers receive changes from  
   C) Deprecated packages  

4. `man 5 passwd` documents:  
   A) The `passwd` user command  
   B) The password file format  
   C) Kernel parameters  

5. GPL-style licenses are primarily concerned with:  
   A) Trademark colors  
   B) Conditions on distributing modified binaries and corresponding source  
   C) CPU architecture  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B**
