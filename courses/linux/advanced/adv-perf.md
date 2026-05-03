# Module: Systems performance engineering

**Track:** Advanced · **Module ID:** `adv-perf`

## Overview

Apply **USE**/**RED** methodologies, tune **NUMA** locality and **huge pages**, optimize the **block layer** for **NVMe**, and run **reproducible** benchmarks without **coordinated omission** traps.

## Learning objectives

- Drill down from symptoms with **USE** and **RED** frameworks.
- Configure **CPU** schedulers, **NUMA**, **huge pages**, and memory locality.
- Tune **queue depth**, **I/O schedulers** (**mq-deadline**, **none**), and **NVMe** behavior.
- Recognize **coordinated omission** and benchmark pitfalls.

---

## Lesson 1: Methodology: USE, RED, and drill-down from symptoms to saturated resources

- **USE** (Utilization, Saturation, Errors) per resource—find **first** saturated component.
- **RED** (Rate, Errors, Duration) for services—pairs well with **SLO** thinking.
- **Scientific method:** hypothesis, minimal experiment, measure, document.

## Lesson 2: CPU schedulers, NUMA, huge pages, and memory locality on large hosts

- **NUMA** penalties dominate when memory is **remote**—**numactl**, **tuned** profiles, VM pinning.
- **Transparent huge pages** vs. **static** hugepages—database workloads often prefer controlled THP settings.
- **CFS** tunables (**latency nice**, **autogroup**) affect fairness—validate with **perf** and **sched tracepoints**.

## Lesson 3: Block layer: queue depth, I/O schedulers (mq-deadline, none), and NVMe

- **NVMe** parallelism benefits from adequate **queue depth** and **nr_requests** understanding—vendor docs + **fio**.
- **mq-deadline** vs. **none** (often for fast SSDs)—measure **p99** latency, not just throughput.
- Watch **I/O schedulers** per device—kernel defaults evolve.

## Lesson 4: Coordinated omission, benchmarking pitfalls, and reproducible load tests

- **Coordinated omission** hides latency tails when load generators synchronize with responses—use **wrk2**/HdrHistogram-aware tools.
- **Warmup**, **filesystem state**, **CPU governor**, and **turbo** must be declared in benchmark reports.
- **Repro** includes **kernel**, **microcode**, **firmware**, and **exact** workload scripts in version control.

---

## Key takeaways

- **p99** matters—throughput-only headlines mislead SLO owners.
- **NUMA ignorance** wastes expensive hardware.

---

## Quiz

1. In the **USE** method, **Saturation** refers to:  
   A) Extra work queued because the resource cannot service demand immediately  
   B) Only fan RPM  
   C) Only HTML errors  

2. **NUMA** primarily impacts performance when:  
   A) Processes allocate/use memory on remote sockets incurring latency/bandwidth penalties  
   B) Using only IPv4 link-local  
   C) Printing to serial consoles  

3. For many **NVMe** workloads, scheduler choice should be:  
   A) Decided by measurement (e.g., mq-deadline vs. none), not folklore  
   B) Always `bfq` without testing  
   C) Ignored entirely  

4. **Coordinated omission** in load testing can:  
   A) Under-report latency tails because the generator adapts to slow responses  
   B) Increase disk RPM  
   C) Fix SELinux mislabels automatically  

5. **Huge pages** can help some workloads by:  
   A) Reducing page table overhead and TLB pressure for large mappings  
   B) Disabling CPU caches  
   C) Removing the need for backups  

---

## Answer key

1. **A** · 2. **A** · 3. **A** · 4. **A** · 5. **A**
