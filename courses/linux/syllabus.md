# Linux Professional Track — Course Syllabus

This syllabus mirrors the platform’s **LINUX** learning path: **Basic**, **Intermediate**, and **Advanced**. Each row links to a dedicated module guide with structured lessons and an end-of-module quiz.

---

## How to use this course

1. Work through modules **in order** within each tier unless your instructor directs otherwise.
2. Read the **lessons**, complete the **hands-on suggestions** on a lab VM or cloud instance where noted.
3. Complete the **quiz** at the bottom of each module file; use it to check understanding before moving on.
4. **Basic** assumes comfort with using a computer and no prior Linux experience. **Intermediate** assumes completion of Basic (or equivalent). **Advanced** assumes solid day-to-day administration skills.

---

## Track 1 — Basic

| # | Module ID | Topic | Module guide |
|---|-----------|--------|--------------|
| 1 | `intro` | Linux introduction & distributions | [basic/intro.md](basic/intro.md) |
| 2 | `shell` | Shell & the command line | [basic/shell.md](basic/shell.md) |
| 3 | `fs-nav` | Filesystem navigation | [basic/fs-nav.md](basic/fs-nav.md) |
| 4 | `files` | Files & directories | [basic/files.md](basic/files.md) |
| 5 | `text` | Text viewing & search | [basic/text.md](basic/text.md) |
| 6 | `pipes` | Redirection & pipes | [basic/pipes.md](basic/pipes.md) |
| 7 | `perms` | Users, groups & permissions | [basic/perms.md](basic/perms.md) |
| 8 | `proc` | Processes & services | [basic/proc.md](basic/proc.md) |
| 9 | `net` | Networking fundamentals | [basic/net.md](basic/net.md) |
| 10 | `pkgs` | Software packages | [basic/pkgs.md](basic/pkgs.md) |
| 11 | `bash` | Bash scripting introduction | [basic/bash.md](basic/bash.md) |

**Estimated effort (Basic):** 35–45 hours including labs.

---

## Track 2 — Intermediate

| # | Module ID | Topic | Module guide |
|---|-----------|--------|--------------|
| 1 | `int-storage` | Storage & filesystems (advanced) | [intermediate/int-storage.md](intermediate/int-storage.md) |
| 2 | `int-mac` | SELinux & mandatory access control | [intermediate/int-mac.md](intermediate/int-mac.md) |
| 3 | `int-net` | Advanced networking | [intermediate/int-net.md](intermediate/int-net.md) |
| 4 | `int-perf` | Performance, tuning & resource limits | [intermediate/int-perf.md](intermediate/int-perf.md) |
| 5 | `int-logs` | Logging, auditing & tracing | [intermediate/int-logs.md](intermediate/int-logs.md) |
| 6 | `int-ssh` | SSH hardening & privileged access | [intermediate/int-ssh.md](intermediate/int-ssh.md) |
| 7 | `int-boot` | Boot process, kernel & modules | [intermediate/int-boot.md](intermediate/int-boot.md) |
| 8 | `int-auto` | Automation & image-based deployment | [intermediate/int-auto.md](intermediate/int-auto.md) |
| 9 | `int-containers` | Containers & workload isolation | [intermediate/int-containers.md](intermediate/int-containers.md) |
| 10 | `int-trouble` | Troubleshooting methodology & support data | [intermediate/int-trouble.md](intermediate/int-trouble.md) |

**Estimated effort (Intermediate):** 40–55 hours including labs.

---

## Track 3 — Advanced

| # | Module ID | Topic | Module guide |
|---|-----------|--------|--------------|
| 1 | `adv-ebpf` | eBPF, tracing & dynamic observability | [advanced/adv-ebpf.md](advanced/adv-ebpf.md) |
| 2 | `adv-storage` | Enterprise storage & data path | [advanced/adv-storage.md](advanced/adv-storage.md) |
| 3 | `adv-ha` | High availability & clustering | [advanced/adv-ha.md](advanced/adv-ha.md) |
| 4 | `adv-sec` | Hardening, compliance & threat-aware Linux | [advanced/adv-sec.md](advanced/adv-sec.md) |
| 5 | `adv-net` | Advanced networking & overlays | [advanced/adv-net.md](advanced/adv-net.md) |
| 6 | `adv-perf` | Systems performance engineering | [advanced/adv-perf.md](advanced/adv-perf.md) |
| 7 | `adv-idm` | Enterprise identity on Linux | [advanced/adv-idm.md](advanced/adv-idm.md) |
| 8 | `adv-virt` | Virtualization & bare-metal workloads | [advanced/adv-virt.md](advanced/adv-virt.md) |
| 9 | `adv-k8s-node` | Kubernetes node & container runtime (OS view) | [advanced/adv-k8s-node.md](advanced/adv-k8s-node.md) |
| 10 | `adv-platform` | Platform, firmware & out-of-band | [advanced/adv-platform.md](advanced/adv-platform.md) |

**Estimated effort (Advanced):** 45–60 hours including labs.

---

## Capstone suggestions

- **Basic:** Automate a repeatable “new user + web log directory” setup with a small Bash script and documented `chmod`/`chown` choices.
- **Intermediate:** Produce a short runbook: LVM extend, SELinux boolean change with validation, and `journalctl` evidence for a failed service.
- **Advanced:** Deliver a performance or security brief: eBPF or OpenSCAP findings, with graphs or scan output and remediation notes.

---

## Document conventions

- **Commands** appear in `monospace`; run them on a non-production lab system unless instructed.
- **Quiz answers** are hidden in an **Answer key** subsection at the end of each module file—try the questions first.

*Version: aligned with application LINUX libraries (Basic / Intermediate / Advanced).*
