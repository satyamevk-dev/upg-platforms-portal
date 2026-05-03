# Module: IPv4 addressing & subnetting

**Track:** Basic · **Module ID:** `netb-ipv4`

## Overview

IPv4 addressing is the foundation of most enterprise and lab networks. This module covers **CIDR**, **masks**, **usable host** math, **private vs. public** space, and how a **default gateway** fits into forwarding decisions.

## Learning objectives

- Read and write CIDR notation (e.g. `/24`) and dotted-decimal masks.
- Compute network, broadcast, and usable host ranges for common sizes.
- List RFC1918 private ranges and when NAT is implied at the edge.
- Explain why a host needs a correct subnet mask and default gateway.

---

## Lesson 1: CIDR notation, subnet masks, and “classes” (historical context)

- **CIDR** (Classless Inter-Domain Routing) writes prefix length as **`/n`** bits for the network portion (e.g. `192.0.2.0/24`).
- **Subnet mask** in dotted decimal matches the prefix (e.g. `/24` → `255.255.255.0`).
- **Classful A/B/C** are historical; modern networks are **classless**—always think in prefix length.

## Lesson 2: Network, broadcast, and usable hosts

- For prefix **`/n`**, host bits = **`32 − n`**, theoretical hosts = **`2^(32−n)`**; usable is **`2^(32−n) − 2`** when network and broadcast are reserved (typical IPv4 LAN).
- **Example:** `/28` → 4 host bits → 16 addresses → **14 usable**.
- **First address** = network ID; **last** = broadcast; assign interfaces from the middle range consistently.

## Lesson 3: Private vs. public (RFC1918) and NAT awareness

- **Private ranges:** `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16` — not globally routable; **NAT** at edge maps many inside addresses to fewer public IPs.
- **Public** addresses come from providers or RIRs; must be unique on the Internet.
- **Implication:** troubleshooting “works inside, fails outside” often starts at **NAT**, **firewall**, or **routing** to the edge.

## Lesson 4: Default gateway and route lookup (intro)

- Hosts send **off-subnet** traffic to the **default gateway** (router L3 interface on their VLAN/subnet).
- **Same-subnet** delivery uses ARP/ND (later); gateway must be **reachable** and on the **same L2 segment** (or correct path for complex L3-to-host models).

---

## Key takeaways

- **Prefix length** drives every design decision: how many subnets vs. how many hosts per subnet.
- **Usable host math** prevents off-by-one errors in DHCP scopes and firewall rules.
- **Private + NAT** is normal; know where your **public** break-out is.

---

## Quiz

1. How many **usable** IPv4 host addresses in a **`/30`** subnet (classic IPv4, network+broadcast reserved)?  
   A) 2  
   B) 4  
   C) 6  

2. Which is a **RFC1918 private** network?  
   A) `8.8.8.0/24`  
   B) `192.168.10.0/24`  
   C) `203.0.113.0/24`  

3. A host with IP `10.1.1.50/24` sends to `10.1.2.10`. It will typically send the packet to:  
   A) The destination directly without a gateway  
   B) Its **default gateway** (if `10.1.2.10` is not on the local subnet)  
   C) DNS first  

4. **`/24`** means:  
   A) 24 bits for the host portion  
   B) 24 bits for the network portion  
   C) 24 total bits in the address  

5. **CIDR** primarily replaced:  
   A) DNS  
   B) Classful-only allocation without flexible prefix boundaries  
   C) Ethernet  

---

## Answer key

1. **A** · 2. **B** · 3. **B** · 4. **B** · 5. **B**
