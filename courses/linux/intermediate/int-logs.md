# Module: Logging, auditing & tracing

**Track:** Intermediate · **Module ID:** `int-logs`

## Overview

Master **journald** ergonomics, classic **rsyslog**/**logrotate** patterns, **auditd** for compliance forensics, and choose **strace**/**ltrace**/**perf** for live issues.

## Learning objectives

- Filter **journalctl** by boot, unit, priority; configure persistence and size limits.
- Design **rsyslog** rules and remote forwarding; shape **logrotate** to avoid disk loss.
- Use **auditd** rules with **`ausearch`** / **`aureport`** at a professional level.
- Pick **strace**, **ltrace**, or **perf top** based on symptom class and overhead.

---

## Lesson 1: `journalctl`: boots, units, priority filters, persistent journal limits

- **`journalctl -b`**, **`-b -1`** previous boot; **`-u unit`**; **`-p err`** priority cutoff.
- **`/etc/systemd/journald.conf`** controls **Storage=**, **SystemMaxUse=**—avoid unbounded growth on small `/var`.

## Lesson 2: `rsyslog` rules, remote logging, and `logrotate` configuration patterns

- **rsyslog** **rules** route facilities/levels to files or remote relays—test with **`logger`**.
- **Remote** logging aids aggregation and tamper resistance (still protect transport).
- **logrotate** **size**/**time** triggers, **copytruncate** caveats—ensure apps reopen logs or use **HUP** patterns.

## Lesson 3: `auditd`: rules, `ausearch`, `aureport` (high-level enterprise use)

- **auditd** records security-relevant syscalls and object access—rules must be minimal and justified.
- **`ausearch -m avc`** or **`-ts today`** filter events; **`aureport`** summarizes for audits.
- Coordinate retention with legal/compliance—local disks are not infinite archives.

## Lesson 4: `strace`, `ltrace`, `perf top` — when to use which for live troubleshooting

- **strace** traces syscalls—great for “why is this binary failing/EAGAIN/ENOENT?” overhead can be high.
- **ltrace** library calls—useful for dynamically linked mystery failures.
- **perf top** samples stacks—find hot functions without full **bpf** toolchain.

---

## Key takeaways

- **Structured journal queries** beat scrolling default pager output during incidents.
- **Audit rules** are code—peer review and monitor volume.

---

## Quiz

1. **`journalctl -u nginx -f`** primarily:  
   A) Follows logs for the `nginx` unit  
   B) Formats a disk as XFS  
   C) Lists kernel modules  

2. **logrotate** is used to:  
   A) Rotate/compress logs on schedule or size to control disk use  
   B) Replace DNS  
   C) Configure bonding  

3. **auditd** is chiefly for:  
   A) Security-relevant event recording with searchable audit logs  
   B) Gaming frame rates  
   C) GPU temperature only  

4. **strace** is most appropriate when you need:  
   A) Syscall-level visibility into a process’s interactions with the kernel  
   B) A firewall GUI  
   C) RAID assembly only  

5. **`journalctl -b -1`** shows logs from:  
   A) The previous boot  
   B) Only USB devices  
   C) Only cron tables  

---

## Answer key

1. **A** · 2. **A** · 3. **A** · 4. **A** · 5. **A**
