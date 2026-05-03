# Module: MPLS & traffic engineering

**Track:** Advanced · **Module ID:** `neta-mpls`

## Overview

**MPLS** enables provider-style **label switching** and **L3VPN** services. This module surveys **LDP**, **RSVP-TE**, **L3VPN** (RD/RT), **segment routing** awareness, and **PE troubleshooting** mindsets.

## Learning objectives

- Explain **label push/swap/pop** at a high level.
- Differentiate **LDP** vs. **RSVP-TE** roles.
- Define **RD** vs. **RT** for VPNv4/VPNv6.
- Name why **SR** matters to greenfield designs.

---

## Lesson 1: LDP, labels, and LSP basics

- **FEC** → **label** binding distributed by **LDP** (liberal vs. conservative retention—awareness).
- **PHP (penultimate hop popping)** reduces label stack on last P before PE—know implications for **QoS** uniform model.

## Lesson 2: RSVP-TE and traffic engineering

- **RSVP-TE** signals **explicit paths** and **reservations**—useful for **guaranteed** bandwidth and **FRR** detours.
- Trade-offs: statefulness and complexity vs. **IGP-based** SR-TE in newer designs.

## Lesson 3: L3VPN — RD, RT, and route distinguishers

- **VPNv4** address = **RD:IPv4** to keep overlapping customer prefixes unique in MP-BGP.
- **RT** (route-target) controls **import/export** into **VRFs**—community-like semantics for VPN membership.

## Lesson 4: Segment routing awareness

- **SR-MPLS** or **SRv6** encodes paths via **labels/SIDs**—can reduce LDP/RSVP in some designs; migration is staged.

## Lesson 5: PE edge troubleshooting paths

- **CE–PE** routing (static, BGP, OSPF as PE-CE), **VRF** interfaces, **label stack** on P routers—layered show commands and **ping with labels** (platform-specific).

---

## Key takeaways

- **VPNs are BGP policy + labels**, not magic encapsulation alone.
- **RD/RT mistakes** duplicate or leak routes—peer review changes.
- **TE** is operational complexity—justify with measured need.

---

## Quiz

1. **MPLS labels** are primarily used to:  
   A) Replace IP entirely on hosts  
   B) Switch traffic faster along label-switched paths  
   C) Encrypt payloads by default  

2. **LDP** is commonly responsible for:  
   A) Distributing label bindings for FECs  
   B) Only wireless authentication  
   C) Only DHCP  

3. **Route Distinguisher (RD)** helps:  
   A) Make overlapping customer prefixes unique in MP-BGP VPNv4  
   B) Replace default gateways  
   C) Configure DNSSEC  

4. **Route Target (RT)** primarily:  
   A) Controls VPN route import/export into VRFs  
   B) Sets interface MTU only  
   C) Defines syslog facility  

5. **RSVP-TE** is most associated with:  
   A) Label-switched traffic engineering paths  
   B) WPA3 only  
   C) ARP resolution  

---

## Answer key

1. **B** · 2. **A** · 3. **A** · 4. **A** · 5. **A**
