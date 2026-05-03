# Module: Troubleshooting tools (entry)

**Track:** Basic · **Module ID:** `netb-tools`

## Overview

Effective troubleshooting is **methodical**: verify **layers** from physical up. This module introduces **ping**, **traceroute**, **DNS lookup tools**, host addressing commands, **ARP**, and reading **interface counters**.

## Learning objectives

- Use **ping** and **traceroute** to localize L3 vs. path issues (within limits).
- Compare **ip** vs. legacy **ifconfig** style output conceptually.
- Interpret **ARP/neighbor** tables for L2 resolution problems.
- Spot **errors vs. discards** on interfaces for quick triage.

---

## Lesson 1: ping, traceroute, and path asymmetry awareness

- **ping (ICMP echo)** tests reachability and latency; failures may be **firewall**, **ACL**, **routing**, or **PBR**—not just “host down.”
- **traceroute** reveals hop-by-hop path (TTL-expiry based); **asymmetric routes** can confuse interpretation—correlate with **return path**.
- On Windows: `tracert`; on Linux/macOS: `traceroute` / `tracepath`.

## Lesson 2: nslookup vs. dig vs. host

- **nslookup** (interactive capable), **dig** (scriptable, verbose), **host** (concise)—all query DNS.
- Practice: `dig +trace` for delegation debugging (Intermediate); for Basic, know **A/AAAA** answers vs. **NXDOMAIN**.

## Lesson 3: ipconfig / ifconfig / `ip a` — what to look for

- Confirm **IP, mask, gateway, DNS** on the correct interface.
- **Media state down** → cable, VLAN, or admin-down first.
- Linux **`ip addr`** and **`ip route`** are the modern pair; Windows **`ipconfig /all`**.

## Lesson 4: ARP table and neighbor discovery

- **ARP** maps IPv4 → MAC on local subnet; **stale/incomplete** entries suggest VLAN or NIC issues.
- IPv6 uses **Neighbor Discovery (ND)**; `ip -6 neigh` on Linux.

## Lesson 5: Interface counters for quick diagnostics

- **errors** (CRC, giants, runts) → cable, duplex, optics, bad NIC.
- **discards** (drops) → congestion, QoS, or buffer exhaustion—pair with **QoS** modules later.

---

## Key takeaways

- **One tool rarely proves root cause**—cross-check with routing, ARP, and DNS.
- **ICMP blocked** is normal on the Internet edge—test from *inside* the trust zone too.
- **Counters trending up** beat “it feels slow” every time.

---

## Quiz

1. **ping** primarily uses:  
   A) TCP port 443  
   B) ICMP echo request/reply (when allowed)  
   C) BGP keepalives  

2. **ARP** is used to resolve:  
   A) Hostname to IPv6  
   B) IPv4 address to MAC on the local subnet  
   C) URL to certificate  

3. On Linux, **`ip route show default`** typically reveals:  
   A) DNS search suffix only  
   B) The default gateway path  
   C) Wireless channel  

4. Rising **CRC errors** on an interface suggest you should suspect:  
   A) Only application bugs  
   B) Physical layer or duplex/cable issues  
   C) DNS TTL  

5. **dig** is especially useful for:  
   A) Formatting hard disks  
   B) Detailed DNS query/response inspection  
   C) DHCP lease renewal  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B**
