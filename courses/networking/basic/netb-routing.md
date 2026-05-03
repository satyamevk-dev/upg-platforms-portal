# Module: Routing basics

**Track:** Basic · **Module ID:** `netb-routing`

## Overview

Routers forward **packets** based on **destination IP** and the **routing table**. This module introduces **static routes**, **connected routes**, **inter-VLAN routing**, and a high-level view of **first-hop redundancy** (HSRP/VRRP).

## Learning objectives

- Differentiate **connected**, **static**, and **dynamic** routes conceptually.
- Explain **longest-prefix match** in one sentence.
- Describe **router-on-a-stick** vs. **SVI** inter-VLAN routing at a high level.
- Name a reason enterprises use **first-hop redundancy** protocols.

---

## Lesson 1: Static routes and route lookup order

- A **static route** is administratively configured: “to reach network X, use next-hop Y or interface Z.”
- **Longest-prefix match:** if multiple routes match a destination, the **most specific** (longest mask) wins.
- **Default route** (`0.0.0.0/0`) is least specific; used when no more specific route matches.

## Lesson 2: Connected vs. learned routes

- **Connected** routes appear when an IP is configured on an up/up interface; they define “directly attached” subnets.
- **Dynamic** protocols (OSPF, BGP, etc.) **learn** and **advertise** reachability—covered in Intermediate.
- **Administrative distance** (concept) ranks source trustworthiness when multiple protocols offer the same prefix.

## Lesson 3: Inter-VLAN routing concepts

- **VLANs** separate broadcast domains; **L3** is required to move between them.
- **Router-on-a-stick:** router subinterfaces terminate **802.1Q** VLANs on a trunk.
- **SVI (Switched Virtual Interface):** L3 VLAN interface on a multilayer switch—common in campus cores.

## Lesson 4: First-hop redundancy overview (HSRP/VRRP awareness)

- Hosts point to a **default gateway** IP that should survive router failure.
- **HSRP** (Cisco), **VRRP** (standard), **GLBP** (Cisco) provide **virtual IP/MAC** ownership transfer on failure.
- Avoid **split-brain** by design: proper priorities, preemption settings, and interface tracking.

---

## Key takeaways

- **Routing is longest-match**; aggregate carefully to avoid black holes or suboptimal paths.
- **Inter-VLAN** is where many “can ping gateway but not other VLAN” issues appear.
- **First-hop redundancy** protects availability without changing host configs.

---

## Quiz

1. Two routes match `10.10.10.10`: `10.10.0.0/16` via A and `10.10.10.0/24` via B. Which wins?  
   A) `/16` because it is shorter  
   B) `/24` because it is the longest prefix match  
   C) The route with lower IP next-hop  

2. A **connected route** appears when:  
   A) A BGP neighbor comes up  
   B) An interface with an IP is up and assigned to that subnet  
   C) Only when DHCP is used  

3. **Router-on-a-stick** typically requires:  
   A) A **trunk** to the router with subinterfaces  
   B) Only access ports  
   C) No VLAN configuration  

4. **Default route** in IPv4 is commonly represented as:  
   A) `127.0.0.1/32`  
   B) `0.0.0.0/0`  
   C) `255.255.255.255/32`  

5. **VRRP/HSRP** primarily provides:  
   A) DNS caching  
   B) Default gateway redundancy  
   C) Wireless channel selection  

---

## Answer key

1. **B** · 2. **B** · 3. **A** · 4. **B** · 5. **B**
