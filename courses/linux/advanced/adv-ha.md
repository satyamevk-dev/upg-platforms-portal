# Module: High availability & clustering

**Track:** Advanced · **Module ID:** `adv-ha`

## Overview

Build **shared-nothing** clusters with **quorum** and **fencing**, operate **Pacemaker**/**Corosync** resources, front services with **VIPs**, and speak **RPO**/**RTO** for DR patterns.

## Learning objectives

- Define **quorum**, **fencing (STONITH)**, and **split-brain** avoidance.
- Configure **Pacemaker** resource agents, **constraints**, and **ordering**.
- Place **floating IPs**/**VIPs** and **application-aware** health checks.
- Compare **sync** vs. **async** replication; use **RPO**/**RTO** language precisely.

---

## Lesson 1: Quorum, fencing (STONITH), and split-brain avoidance in shared-nothing designs

- **Quorum** prevents minority partitions from mutating state—**odd** node counts or **qdevice** witnesses.
- **STONITH** ensures failed nodes cannot corrupt shared resources—test fencing in maintenance.
- **Split-brain** yields divergent writes—design networks and votes to make it rare and detectable.

## Lesson 2: Pacemaker / Corosync resource agents; constraints and ordering

- **Corosync** provides membership/messaging; **Pacemaker** schedules resources.
- **Resource agents** implement start/stop/monitor; **constraints** encode colocation, order, and location rules.
- **Monitor** intervals must match SLA detection goals—too long hides failures.

## Lesson 3: Floating IPs, VIPs, and application-aware health checks

- **IPaddr2** or cloud LB integrations move **VIPs** with services—ARP/gratuitous announcements matter on L2.
- **Depth** of health checks: TCP connect vs. HTTP body vs. app-specific probes—balance false positives.

## Lesson 4: DR patterns: synchronous vs. asynchronous replication; RPO/RTO language

- **Sync** replication minimizes **RPO** at latency cost; **async** relaxes RPO for distance/cost.
- **RTO** is time-to-restore service—practice **failover** drills; **runbooks** beat heroics.

---

## Key takeaways

- **Clusters without fencing** are optimism, not HA.
- **RPO/RTO** commitments belong in writing—technology follows the numbers.

---

## Quiz

1. **STONITH** in clustering generally means:  
   A) Forcibly powering off or isolating a failed node to protect shared resources  
   B) A backup tape rotation schedule  
   C) A type of filesystem journal  

2. **Quorum** helps prevent:  
   A) Split-brain where two partitions both believe they may write state  
   B) IPv6 neighbor discovery only  
   C) Only cosmetic UI bugs  

3. **Pacemaker** primarily:  
   A) Orchestrates cluster resources (start/stop/monitor) with policies  
   B) Compiles the kernel  
   C) Manages Docker Hub accounts  

4. **RPO** (recovery point objective) describes:  
   A) How much data loss is acceptable in time  
   B) How long power cables may be  
   C) Maximum SSH key length  

5. **Synchronous** replication typically:  
   A) Acknowledges writes only after remote persistence, tightening RPO vs. async  
   B) Ignores latency completely  
   C) Disables networking  

---

## Answer key

1. **A** · 2. **A** · 3. **A** · 4. **A** · 5. **A**
