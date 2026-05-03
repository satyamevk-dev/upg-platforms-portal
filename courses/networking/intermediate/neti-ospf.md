# Module: Dynamic routing protocols

**Track:** Intermediate · **Module ID:** `neti-ospf`

## Overview

**OSPF** is a link-state IGP common in enterprise networks. This module covers **areas**, **LSAs** at a survey level, **adjacency states**, **metrics**, **redistribution** caveats, and **convergence** expectations.

## Learning objectives

- Explain why OSPF uses areas and what **area 0 (backbone)** means.
- List common LSA types at a high level and what problem each addresses.
- Describe OSPF neighbor/adjacency states through **FULL**.
- Anticipate issues when **redistributing** external routes.

---

## Lesson 1: OSPF areas, LSAs, and adjacency states

- **Area** bounds link-state flooding; **ABR** connects areas; all areas must touch **backbone (area 0)** (virtual links are a workaround—avoid when possible).
- **LSA types (survey):** Type 1 Router, Type 2 Network, Type 3 Summary, Type 5 AS-external, Type 7 NSSA—know *purpose*, not every corner case on day one.
- **States:** Down → Init → **2-Way** (broadcast) → ExStart → Exchange → Loading → **Full**.

## Lesson 2: EIGRP concepts (where applicable) and path metrics

- **EIGRP** (Cisco) uses **composite metric** (bandwidth, delay, reliability, load); **feasible successor** enables fast reroute when conditions meet **feasibility condition**.
- **OSPF cost** = reference bandwidth / interface bandwidth (adjust **auto-cost** on modern high-speed links).

## Lesson 3: Route redistribution fundamentals and caveats

- **Redistribution** injects routes from one protocol/domain into another—risks **suboptimal routing**, **loops**, and **metric translation** issues.
- Use **route-maps**, **tags**, and **filtering**; prefer **summarization** at area boundaries where design allows.

## Lesson 4: Convergence and failover expectations

- **SPF** recompute on significant topology change; tuning **timers** (hello/dead) trades stability vs. speed.
- Pair IGP design with **BFD** (where supported) for faster failure detection at the data plane.

---

## Key takeaways

- **Area design** is about scale and blast radius—don’t make one flat area 0 “because it’s easier” at medium scale.
- **Redistribution** is where careers are made or broken—document metrics and filters.
- **Show commands** (`show ip ospf neighbor`, `show ip route ospf`) are your first triage.

---

## Quiz

1. In OSPF multi-area design, which area is the **backbone**?  
   A) Area 100 only  
   B) Area 0  
   C) Any NSSA automatically  

2. OSPF adjacency **FULL** means:  
   A) Neighbor is down  
   B) Databases are synchronized for that area relationship  
   C) Only Layer 2 is up  

3. **ABR** stands for:  
   A) Autonomous Boundary Router  
   B) Area Border Router  
   C) Address Binding Relay  

4. **Redistribution** without filtering can cause:  
   A) Stronger security by default  
   B) Routing loops or suboptimal paths  
   C) Automatic encryption  

5. OSPF **cost** is primarily derived from:  
   A) DNS TTL  
   B) Interface bandwidth settings vs. reference bandwidth  
   C) DHCP lease time  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B**
