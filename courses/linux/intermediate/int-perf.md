# Module: Performance, tuning & resource limits

**Track:** Intermediate · **Module ID:** `int-perf`

## Overview

Apply **tuned** profiles, tune **sysctl**, respect CPU/I/O scheduling, cap workloads with **cgroups v2** / systemd, and read classic observability tools without misreading load.

## Learning objectives

- Select and persist **tuned** profiles; tune representative **sysctl** keys.
- Use **nice**, **ionice**, **chrt** with awareness of scheduler behavior.
- Apply **systemd** resource controls on **cgroups v2** hosts.
- Interpret **vmstat**, **iostat**, **sar**, **pidstat**; relate load average to saturation.

---

## Lesson 1: `tuned` profiles; `sysctl` key examples (`vm.*`, `net.*`) and persistence

- **`tuned-adm list`**, **`profile`**, **`active`**—profiles bundle sysctl, sysfs, and daemon tweaks.
- **`sysctl`** keys like **`vm.swappiness`**, **`net.core.somaxconn`** affect behavior—document every change and test rollback.
- Persist via **`/etc/sysctl.d/*.conf`**; avoid scattering edits in **`/etc/sysctl.conf`** without naming convention.

## Lesson 2: CPU & I/O scheduling awareness; `nice`, `ionice`, `chrt`

- **nice** adjusts CPU priority within fair classes; **chrt** sets real-time policies—misuse can starve the system.
- **ionice** influences I/O scheduling class/priority for bulk jobs competing with latency-sensitive services.

## Lesson 3: cgroups v2: slices, limits on CPU/memory; systemd resource controls

- **Unified hierarchy** exposes **CPUWeight**, **MemoryMax**, **TasksMax** on slices/units.
- **`systemctl set-property`** or unit drop-ins express caps—verify with **`systemd-cgls`** and **`systemd-analyze blame`** for boot impact.

## Lesson 4: `vmstat`, `iostat`, `sar`, `pidstat`; interpreting load average vs. CPU saturation

- **vmstat** columns expose run queue, swap, block I/O—short intervals for spikes.
- **iostat -xz** shows per-device utilization and await—disk saturation signatures.
- **sar** historical data; **pidstat** per-task CPU/memory/I/O.
- **Load average** counts runnable + uninterruptible tasks—high load with idle CPU may mean I/O wait or locks, not “CPU maxed.”

---

## Key takeaways

- **Measure before tuning**—sysctl changes without baselines are guesses.
- **Resource limits** belong in unit files for services you operate, not only informal `nice` wrappers.

---

## Quiz

1. **`tuned-adm`** primarily helps:  
   A) Apply curated performance/power profiles  
   B) Resize LVM only  
   C) Manage SSH keys  

2. Persisting **`sysctl`** on boot is conventionally done via:  
   A) Drop-in files under `/etc/sysctl.d/`  
   B) Editing `/proc` manually each reboot only  
   C) `cron` `@reboot rm -rf /`  

3. **systemd** resource caps integrate with:  
   A) cgroups (v2 on current distros)  
   B) Only Windows drivers  
   C) Only email protocols  

4. High **load average** with low user CPU can indicate:  
   A) I/O wait or many tasks in uninterruptible sleep, among other causes  
   B) Always a network cable unplugged  
   C) Always correct CPU count mismatch only  

5. **`ionice`** is most relevant when:  
   A) Throttling or prioritizing disk I/O for batch jobs  
   B) Configuring VLAN IDs  
   C) Signing RPM packages  

---

## Answer key

1. **A** · 2. **A** · 3. **A** · 4. **A** · 5. **A**
