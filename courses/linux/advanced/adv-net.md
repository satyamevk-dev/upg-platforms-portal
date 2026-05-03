# Module: Advanced networking & overlays

**Track:** Advanced · **Module ID:** `adv-net`

## Overview

Operate Linux as a **router** with policy routing and **VRF-lite**, build **VXLAN**/**GENEVE** overlays, shape traffic with **tc**, and recognize **DPDK**/**XDP**/**AF_XDP** bypass patterns.

## Learning objectives

- Combine **policy routing**, **VRF-lite**, and advanced **iptables**/**nftables**.
- Stand up **VXLAN**/**GENEVE** tunnels and bridging endpoints.
- Apply **tc** shaping/policing with **CAKE**/**FQ_CODEL** awareness.
- Know when **DPDK**/**XDP**/**AF_XDP** fit.

---

## Lesson 1: Linux as a router: policy routing, VRF-lite, and advanced iptables/nftables

- **Policy routing** selects tables by **fwmark**, **source**, or **UID**—`ip rule` orchestrates.
- **VRF** devices isolate RIB/FIB—**lite** patterns on generic servers mimic provider edge behaviors.
- **nftables** sets handle **NAT**, **mangle**, **filter**—keep ruleset documentation in Git.

## Lesson 2: VXLAN / GENEVE overlays; bridging and tunnel endpoints on hosts

- **VXLAN** UDP encapsulation with **VNI** segmentation; **GENEVE** extensible protocol for NV overlays.
- **Bridge** + **vxlan** devices terminate tunnels—watch **MTU** (**IP overhead**), **multicast** vs. **EVPN** control planes (conceptual).

## Lesson 3: Traffic control (tc): shaping, policing, and CAKE/FQ_CODEL awareness

- **HTB**/**HFSC** hierarchies shape; **police** drops excess—understand **burst** buckets.
- **FQ_CODEL**/**CAKE** fight bufferbloat—often better defaults than naive **pfifo_fast**.

## Lesson 4: DPDK / XDP / AF_XDP: kernel bypass patterns and when teams adopt them

- **XDP** early drops/modify at NIC driver layer—great for **DDoS** mitigation prototypes.
- **AF_XDP** maps frames to userspace with **zero-copy** paths—complexity trade-off.
- **DPDK** polls NICs in userspace—cores dedicated; operational model differs from kernel stack.

---

## Key takeaways

- **Overlay MTU** issues masquerade as “random TCP hangs.”
- **Bypass** stacks buy pps at the cost of operability—justify with metrics.

---

## Quiz

1. **Policy routing** in Linux uses mechanisms such as:  
   A) Multiple routing tables selected by rules (`ip rule`)  
   B) Only ARP static entries  
   C) Only `/etc/hosts`  

2. **VXLAN** primarily provides:  
   A) Layer 2 overlay segmentation over UDP with a VNI  
   B) Disk encryption  
   C) User password rotation  

3. **`tc`** is used to:  
   A) Apply traffic control (qdiscs, classes, filters) for shaping and policing  
   B) List PCI devices only  
   C) Manage LVM thin pools only  

4. **XDP** programs run:  
   A) Early in the NIC/driver receive path for high-performance packet handling  
   B) Only inside Java VMs  
   C) Only on Windows guests  

5. **DPDK** typically implies:  
   A) Userspace polling of NICs with dedicated CPU isolation—different ops model  
   B) Automatic kernel upgrades  
   C) Mandatory use of Appletalk  

---

## Answer key

1. **A** · 2. **A** · 3. **A** · 4. **A** · 5. **A**
