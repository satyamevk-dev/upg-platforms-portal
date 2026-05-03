# Module: Networking foundations & models

**Track:** Basic · **Module ID:** `netb-osi`

## Overview

Build a mental model of how data moves from an application down through stacks, across media, and back up again. You will compare the **OSI** and **TCP/IP** models, relate common protocols to layers, and understand **frames**, **packets**, and **segments**—including **MTU** and **MSS** at a practical level.

## Learning objectives

- Map typical protocols (e.g. HTTP, TCP, IP, Ethernet) to OSI and TCP/IP layers.
- Explain unicast, broadcast, and multicast at a conceptual level.
- Describe LAN vs. WAN vs. internet edge in one sentence each.
- Relate MTU and MSS to fragmentation and end-to-end behavior.

---

## Lesson 1: OSI vs. TCP/IP — layers and where protocols fit

- The **OSI model** (7 layers) is a *reference* for discussion; the **TCP/IP model** (often 4 layers: Link, Internet, Transport, Application) reflects how the Internet grew.
- **Mnemonic (bottom-up OSI):** Please Do Not Throw Sausage Pizza Away — Physical, Data Link, Network, Transport, Session, Presentation, Application.
- **Examples:** **Ethernet** → Data Link (and Physical); **IPv4/IPv6** → Network; **TCP/UDP** → Transport; **HTTP/DNS** → Application (OSI layers 5–7 are often grouped in TCP/IP).
- **Encapsulation:** Each layer adds headers; upper-layer **PDU** names: **frame** (L2), **packet** (L3), **segment/datagram** (L4).

## Lesson 2: Frames, packets, segments — MTU and MSS

- A **frame** carries an L2 header + payload (often an IP packet on Ethernet).
- **MTU (Maximum Transmission Unit):** largest IP *payload* an interface will send in one piece on that hop (common Ethernet MTU **1500** bytes).
- **MSS (Maximum Segment Size):** TCP’s limit on *data* per segment; typically **MTU − IP header − TCP header** on a path (path MTU discovery matters on complex paths).
- **Fragmentation:** If a packet is too large for a link, routers *may* fragment IPv4 (discouraged today); IPv6 uses **PMTUD** and **ICMPv6 Packet Too Big** heavily—design for consistent MTU end-to-end when possible.

## Lesson 3: Unicast, broadcast, multicast

- **Unicast:** one sender, one receiver (typical client–server).
- **Broadcast:** one sender, all hosts on a *broadcast domain* (IPv4 limited; switches flood unknown unicasts/broadcasts within VLAN).
- **Multicast:** one sender, many interested receivers (IGMP, PIM—awareness only at Basic level); efficient for streaming and routing updates in larger designs.

## Lesson 4: LAN, WAN, and internet edge

- **LAN:** high-speed, organization-controlled segment (campus, office, data-center rack).
- **WAN:** connects sites over provider or private long-distance links (MPLS, Internet VPN, dedicated circuits).
- **Internet edge:** where your **ASN** or site meets upstream providers—NAT, firewalls, BGP (introduced later), DDoS protection often live here.

---

## Key takeaways

- Use **OSI** to *talk* about problems; use **TCP/IP** to *implement* on real stacks.
- **MTU/MSS** mismatches cause subtle performance or black-hole symptoms—always verify path.
- **Broadcast domains** are bounded by **VLANs** and **routers** (later modules).

---

## Quiz

1. In the OSI model, **IPv4** is most closely associated with which layer?  
   A) Data Link  
   B) Network  
   C) Transport  

2. On typical Ethernet, a common **MTU** value is:  
   A) 576 bytes  
   B) 1500 bytes  
   C) 9000 bytes (always, everywhere)  

3. **TCP MSS** conceptually relates to:  
   A) How much application data fits in a segment given path MTU and headers  
   B) Switch MAC table size  
   C) DNS TTL only  

4. **Multicast** is best described as:  
   A) One-to-one delivery  
   B) One-to-all on a broadcast domain only  
   C) One-to-many where receivers opt in (conceptually)  

5. A **WAN** primarily connects:  
   A) Two VMs on the same hypervisor only  
   B) Sites or regions over longer-distance provider or private links  
   C) Only Wi-Fi clients in one room  

---

## Answer key

1. **B** · 2. **B** · 3. **A** · 4. **C** · 5. **B**
