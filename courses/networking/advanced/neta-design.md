# Module: Enterprise architecture & high availability

**Track:** Advanced · **Module ID:** `neta-design`

## Overview

Modern data centers and campuses use **scale-out fabrics** and **redundant paths**. This module contrasts **three-tier** vs. **spine–leaf**, introduces **EVPN/VXLAN** at a conceptual level, and discusses **failure domains**, **MLAG/vPC**, and **capacity planning**.

## Learning objectives

- Compare **three-tier** campus to **spine–leaf** CLOS-style fabrics.
- Explain **VXLAN** encapsulation and why **EVPN** controls plane separation matters.
- Identify **failure domains** and **blast radius** in dual-homing designs.
- List inputs for **growth and redundancy** in capacity plans.

---

## Lesson 1: Spine–leaf vs. three-tier

- **Three-tier:** access → distribution → core; familiar but can complicate **east–west** scale.
- **Spine–leaf:** every leaf connects to **every spine**; predictable **non-blocking** goals; uniform hop count.
- **Oversubscription** ratios must be explicit in design docs.

## Lesson 2: EVPN/VXLAN fabric concepts

- **VXLAN** extends L2 segments over **UDP** with **VNI**; **VTEP** encapsulates/decapsulates.
- **EVPN** (BGP address family) carries **MAC/IP** reachability and supports **multihoming** with standards-based DF election (vendor nuances exist).
- **Control-plane** learning reduces unknown-unicast flooding vs. classic flood-and-learn.

## Lesson 3: HA: dual-homing, MLAG/vPC, failure domains

- **MLAG/vPC** pairs switches so hosts see one logical LAG; watch **peer-link** health and **split-brain** procedures.
- **Failure domain:** power, cooling, ToR pair, POP—**correlate** failures to avoid “both paths share one fuse.”

## Lesson 4: Capacity planning assumptions

- Document **traffic matrices** (N–S vs. E–W), **headroom %**, **rack power**, and **optics** roadmap (100G/400G).
- **Lifecycle** optics and **breakout** cables early to avoid stranded ports.

---

## Key takeaways

- **Fabric design is a system**—routing, bridging, telemetry, and operations must align.
- **Dual-homing** without **isolated failure domains** is illusionary redundancy.
- **Write assumptions down**—future you is also a stakeholder.

---

## Quiz

1. In **spine–leaf**, leaves typically connect to:  
   A) Only one spine for cost savings always  
   B) All spines for ECMP-style uplink use  
   C) Only WAN routers  

2. **VXLAN** primarily provides:  
   A) Layer-3 only, no overlay  
   B) Layer-2 overlay segmentation across IP underlay  
   C) DNSSEC validation  

3. **EVPN** is often associated with:  
   A) DHCP relay  
   B) BGP-based control plane for L2/L3 VPN services  
   C) Only wireless controller clustering  

4. **MLAG/vPC** aims to:  
   A) Replace BGP entirely  
   B) Present paired switches as one logical device to a LAG-connected host  
   C) Disable STP on all networks  

5. **Failure domain** analysis asks:  
   A) What single fault takes down both redundant paths?  
   B) Only about DNS TTL  
   C) Only about syslog format  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **A**
