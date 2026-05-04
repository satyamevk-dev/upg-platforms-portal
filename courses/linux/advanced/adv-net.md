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

## Lesson 5: Lab—`ip -d link`, `bridge fdb`, `tc -s qdisc`

- **`ip -d link show type vxlan`**—inspect **id**, **local**, **dstport**, **ttl**, **df** flags on a lab tunnel.
- **`bridge fdb show br0`**—see **MAC→vxlan** mapping when learning multicast/EVPN-style setups (conceptual).
- **`tc -s qdisc show dev eth0`**—read **drops** and **overlimits** on **fq_codel**/cake before tuning knobs blindly.

## Lesson 6: Anti-patterns in advanced networking

- **VXLAN without MTU headroom**—mysterious TCP hangs and “it works on small payloads.”
- **Policy routing rules** without comments/owner—next admin deletes wrong **`ip rule`**.
- **tc shaping** without bufferbloat literacy—drops everywhere, app timeouts.

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

6. **VXLAN overlays** commonly require extra attention to:  
   A) MTU/IP overhead to avoid black-holed large TCP segments  
   B) inode counts on `/tmp` only  
   C) LUKS key rotation schedules only  

7. **`tc -s qdisc`** is useful because it can show:  
   A) Queueing statistics like drops/overlimits for shaping diagnosis  
   B) Only ARP table entries  
   C) Only ZFS ARC size  

8. **Policy routing** (`ip rule`) without documentation/ownership often leads to:  
   A) Confusing asymmetric routing and accidental deletion during maintenance  
   B) Faster DNS always  
   C) Automatic HA quorum  

---

## Answer key

1. **A** · 2. **A** · 3. **A** · 4. **A** · 5. **A** · 6. **A** · 7. **A** · 8. **A**
