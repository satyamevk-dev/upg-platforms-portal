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

## Lesson 5: Lab—`tuned-adm profile`, `systemd-analyze blame`, `pidstat -d`

- Switch **`tuned-adm profile`** in a lab VM—benchmark one workload before/after with **`fio`** or app harness.
- Run **`systemd-analyze blame`** on a slow-boot host—identify worst units; cross-check with **`systemd-analyze critical-chain`**.
- Use **`pidstat -d 1`** while a backup runs—see which PIDs actually issue block I/O.

## Lesson 6: Anti-patterns in tuning

- **sysctl shopping lists** from blogs without measurement—regressions and unsupported combos.
- **RT scheduler classes** for ordinary web workloads—latency for everyone else tanks.
- **Ignoring `vmstat` si/so** while chasing CPU flags—memory pressure is the real villain.

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

6. **`systemd-analyze blame`** primarily helps identify:  
   A) Which systemd units contribute most to boot time ordering  
   B) RAID parity algorithms  
   C) TLS cipher suites only  

7. Applying many **`sysctl`** changes without baselines is often:  
   A) Guesswork that can harm stability or throughput  
   B) Mandatory before installing packages  
   C) Equivalent to `tuned-adm off` always  

8. **`pidstat`** is especially useful for:  
   A) Per-process CPU/memory/I/O stats over time  
   B) Formatting LUKS headers only  
   C) Replacing `tcpdump` for TLS inspection  

---

## Answer key

1. **A** · 2. **A** · 3. **A** · 4. **A** · 5. **A** · 6. **A** · 7. **A** · 8. **A**
