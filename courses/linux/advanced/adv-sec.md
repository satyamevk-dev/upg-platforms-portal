# Module: Hardening, compliance & threat-aware Linux

**Track:** Advanced · **Module ID:** `adv-sec`

## Overview

Operationalize **CIS**/**STIG** baselines with **OpenSCAP**, understand **FIPS 140** mode impacts, deploy **AIDE** and immutable log targets, and deepen **kernel hardening** (**lockdown**, **ptrace**, **seccomp-bpf**).

## Learning objectives

- Run and remediate **OpenSCAP** profiles against **CIS**/**STIG**/**DISA** guidance.
- Plan for **FIPS 140** crypto constraints.
- Implement **AIDE** and remote **immutable** logging patterns.
- Tune **lockdown**, **ptrace scope**, and **seccomp-bpf** thoughtfully.

---

## Lesson 1: CIS / STIG / DISA profiles; OpenSCAP scans and remediation baselines

- **OpenSCAP** evaluates **XCCDF**/**OVAL** content—produce **reports** and **remediation** scripts with change control.
- **Exceptions** require risk acceptance—document compensating controls.

## Lesson 2: FIPS 140 mode implications for crypto stacks and packages

- **FIPS** mode restricts algorithms and modules—applications using non-approved crypto may fail.
- Validate **OpenSSL/JNSS/NSS** stacks and **Java** policies in staging before enforcement.

## Lesson 3: AIDE / integrity monitoring; remote logging to immutable stores

- **AIDE** baselines file metadata—schedule checks, protect DB, tune noise vs. coverage.
- Forward **audit**/syslog to **WORM**/SIEM with **tamper** protections—local logs alone are insufficient for serious threats.

## Lesson 4: Kernel hardening: lockdown, ptrace scope, and seccomp-bpf in depth

- **lockdown** mode restricts dangerous kernel interfaces—may break debuggers/drivers.
- **ptrace scope** limits cross-user tracing—good default on multi-tenant hosts.
- **seccomp-bpf** filters syscalls per process—compose with **namespaces** and **LSM**.

---

## Key takeaways

- **Compliance** is continuous—scan, patch, re-baseline.
- **Kernel hardening** breaks things pleasantly—test workloads.

---

## Quiz

1. **OpenSCAP** is commonly used to:  
   A) Evaluate systems against security compliance baselines and produce reports  
   B) Partition disks only  
   C) Manage Kubernetes Ingress  

2. **FIPS 140** mode on RHEL-style systems generally:  
   A) Constrains cryptographic modules/algorithms to approved sets  
   B) Disables all networking  
   C) Removes SELinux  

3. **AIDE** provides:  
   A) File integrity monitoring against a baseline database  
   B) Live VM migration  
   C) DNSSEC signing  

4. **Kernel lockdown** is intended to:  
   A) Restrict certain dangerous kernel features/interfaces for security  
   B) Increase swap usage always  
   C) Replace systemd  

5. **seccomp-bpf** allows:  
   A) Per-process syscall filtering using BPF programs  
   B) Only static firewall rules from 1990  
   C) Unrestricted module loading always  

---

## Answer key

1. **A** · 2. **A** · 3. **A** · 4. **A** · 5. **A**
