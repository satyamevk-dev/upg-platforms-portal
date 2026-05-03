# Module: BGP fundamentals

**Track:** Intermediate · **Module ID:** `neti-bgp`

## Overview

**BGP** is the path-vector protocol of the Internet and many enterprise WANs. This module contrasts **iBGP** and **eBGP**, explains common **path attributes**, and introduces **filtering** and **peering resilience** patterns.

## Learning objectives

- Differentiate **iBGP** vs. **eBGP** and typical TTL / AS-path behavior.
- Explain **LOCAL_PREF**, **AS_PATH**, **MED**, and **communities** at a design level.
- Describe **prefix-list** vs. **route-map** roles in policy.
- Name one **peering redundancy** practice.

---

## Lesson 1: iBGP vs. eBGP and neighbor relationships

- **eBGP:** peers in **different ASNs**; often direct-connected (TTL 1) unless **multihop** configured.
- **iBGP:** same ASN; requires **full mesh** or **route reflectors** / **confederations** to avoid split-horizon-like issues with learned routes.
- **AS_PATH** loop prevention: discard if own ASN appears (policy exceptions exist—advanced).

## Lesson 2: Path attributes — LOCAL_PREF, AS_PATH, MED, communities

- **LOCAL_PREF** (higher wins) influences outbound path selection *within AS* for iBGP propagation.
- **AS_PATH** length influences preference (shorter often better for eBGP).
- **MED** (lower wins) hints preferred entry; compare only among **same neighboring AS** in classic rules.
- **Communities:** tag routes for **action at a distance** (e.g., do not export to peer X).

## Lesson 3: Filtering with prefix-lists and route-maps

- **Prefix-list** matches NLRI (prefix/length); fast and readable.
- **Route-map** sequences **match** + **set** for granular policy (communities, LP, MED, AS-path prepends).

## Lesson 4: Peering design and resilience

- **Dual routers**, **dual links**, **diverse paths** to carriers; document **maintenance windows** and **graceful shutdown** (BGP communities, GSHUT).
- **Prefix limits** protect against **route leaks**; monitor **RPKI** awareness for operators (intro).

---

## Key takeaways

- **BGP is policy**, not “shortest path IGP.”
- **iBGP scaling** needs RR/confed—don’t paste full mesh blindly.
- **Filters inbound and outbound**—trust but verify.

---

## Quiz

1. **eBGP** typically connects routers in:  
   A) The same ASN  
   B) Different ASNs  
   C) Only layer-2 switches  

2. **LOCAL_PREF** is most associated with:  
   A) Influencing best-path choice inside your AS (iBGP learned)  
   B) Wi-Fi channel width  
   C) DHCP Option 66  

3. **AS_PATH** is primarily used to:  
   A) Store DNS TTL  
   B) Record ASNs traversed and help prevent loops  
   C) Encrypt BGP messages  

4. A **route reflector** helps scale:  
   A) OSPF areas only  
   B) iBGP by reducing full-mesh requirements  
   C) ARP tables only  

5. **MED** is often described as:  
   A) A hint between peers about preferred entry point  
   B) Mandatory for all Internet routes  
   C) The same as LOCAL_PREF  

---

## Answer key

1. **B** · 2. **A** · 3. **B** · 4. **B** · 5. **A**
