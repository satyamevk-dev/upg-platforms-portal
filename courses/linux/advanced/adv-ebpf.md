# Module: eBPF, tracing & dynamic observability

**Track:** Advanced · **Module ID:** `adv-ebpf`

## Overview

Navigate the Linux tracing stack from **ftrace** and **perf** through **eBPF**, **BCC**, and **bpftrace**; choose probes responsibly and read flame graphs and latency histograms at scale.

## Learning objectives

- Map **ftrace**, **perf**, eBPF programs, and **BCC**/**bpftrace** roles.
- Understand **kprobes**/**uprobes**, ring buffers, and overhead trade-offs.
- Interpret **flame graphs**, off-CPU stacks, and latency histograms.
- Know when to escalate from **strace** to **bpftrace** in production.

---

## Lesson 1: Kernel tracing landscape: ftrace, perf, eBPF programs, and BCC/bpftrace

- **ftrace** built-in kernel tracing—low overhead for function/graph tracing when enabled.
- **perf** samples and traces CPU, software events, and PMCs—great first multi-tool.
- **eBPF** runs verified programs in kernel context; **BCC** (Python/C tooling) and **bpftrace** (DSL) accelerate authoring.

## Lesson 2: Safe probes: kprobes/uprobes, ring buffers, and overhead trade-offs

- **kprobes** attach to kernel symbols; **uprobes** to user symbols—both can perturb latency if too frequent.
- **Ring buffers** batch events to userspace—tune loss vs. rate; test on canary nodes first.

## Lesson 3: Reading flame graphs, off-CPU stacks, and latency histograms at scale

- **On-CPU flame graphs** show hot code paths; **off-CPU** highlights blocking (locks, I/O waits).
- **Histograms** (e.g., syscall latency) expose tail behavior—watch coordinated omission in benchmarks.

## Lesson 4: When to escalate from strace to bpftrace for production incidents

- **strace** syscall tracing overhead can dominate; **bpftrace** one-liners filter by PID/latency thresholds with less intrusion.
- Still coordinate **PII** and **change windows**—kernel tracing is powerful and auditable.

## Lesson 5: Lab—`perf record`, `perf script` stackcollapse, one bpftrace one-liner

- Capture **`perf record -g -- sleep 10`** on a busy service host—**`perf report`** hottest symbol path.
- Generate a tiny **flame graph** input with **`perf script`** → stackcollapse steps (tooling varies)—see wide vs. tall plates.
- Run a **`bpftrace -e 'kprobe:sys_read { @bytes = hist(arg2); }'`** toy—respect rate and privacy; kill quickly.

## Lesson 6: Anti-patterns in tracing

- **High-frequency kprobes on hot syscalls** in prod without canary—tracing becomes the outage.
- **Shipping raw pcaps** with credentials to ticket systems—data classification violation.
- **Ignoring lost events** counters in ring buffers—silent incomplete conclusions.

---

## Key takeaways

- **Start with perf** for breadth; **bpftrace** for targeted kernel/user questions.
- **Always measure probe overhead**—tracing can become the incident.

---

## Quiz

1. **eBPF** programs run:  
   A) In kernel context after verifier checks, attached to events  
   B) Only in user-mode QEMU always  
   C) Only inside web browsers  

2. **bpftrace** is best described as:  
   A) A high-level tracing language built on eBPF  
   B) A disk formatter  
   C) A mail transfer agent  

3. **Off-CPU** flame graphs emphasize:  
   A) Time spent not running on CPU (blocked/waiting)  
   B) Only L2 cache hits  
   C) Only RAID parity calculations  

4. **kprobes** attach to:  
   A) Kernel functions/symbols for dynamic instrumentation  
   B) Only `/etc/passwd` lines  
   C) Only GPU shaders  

5. Compared to **strace** for heavy production diagnosis, **bpftrace** often:  
   A) Allows more selective, lower-overhead instrumentation  
   B) Always requires rebooting  
   C) Cannot filter by PID  

6. **`perf record -g`** is especially useful for building:  
   A) Call-graph profiles of on-CPU time  
   B) Disk partition tables only  
   C) DHCP leases only  

7. High-frequency **kprobes** on very hot kernel paths without careful filtering can:  
   A) Introduce significant overhead and distort the system you are measuring  
   B) Always reduce CPU usage  
   C) Disable eBPF verifier  

8. When exporting **packet captures** from production, you should consider:  
   A) Privacy/classification policies—payloads may contain secrets or PII  
   B) That pcaps never include payloads  
   C) That encryption makes captures useless always  

---

## Answer key

1. **A** · 2. **A** · 3. **A** · 4. **A** · 5. **A** · 6. **A** · 7. **A** · 8. **A**
