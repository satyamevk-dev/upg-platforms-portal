# Module: DNS & DHCP essentials

**Track:** Basic · **Module ID:** `netb-dnsdhcp`

## Overview

**DHCP** automates IPv4/IPv6 addressing parameters; **DNS** maps names to addresses. This module covers **record types**, **resolution flow**, **DHCP DORA**, **leases**, and **reservations**.

## Learning objectives

- List common DNS record types and when each is used.
- Describe recursive vs. authoritative behavior at a high level.
- Explain **DORA** and lease renewal timers.
- Plan scopes and **reservations** for stable infrastructure devices.

---

## Lesson 1: DNS records (A, AAAA, CNAME, MX, PTR)

- **A:** IPv4 address for a name; **AAAA:** IPv6 address.
- **CNAME:** alias to another name (avoid CNAME at zone apex in classic DNS; use **ALIAS/ANAME** at providers where needed).
- **MX:** mail exchanger with **preference** (lower often preferred).
- **PTR:** reverse DNS (often under `in-addr.arpa` / `ip6.arpa`)—used by mail servers and troubleshooting.

## Lesson 2: Name resolution flow and caching

- A **stub resolver** on a host asks a **recursive resolver** (often ISP or `8.8.8.8` or internal DNS).
- **Caching** reduces latency; **TTL** on records controls freshness vs. load during changes.
- **Authoritative** servers answer for zones they host; **delegation** (NS records) chains the tree.

## Lesson 3: DHCP DORA and lease lifecycle

- **DORA:** **D**iscover (broadcast), **O**ffer, **R**equest, **A**ck.
- **Lease** has **T1** (renew) and **T2** (rebind) timers—client tries same server first, then broadcasts.
- **Options:** gateway, DNS servers, domain name, NTP, vendor-specific—**Option 43/60** etc. in VoIP/WLAN deployments.

## Lesson 4: Reservations and scope planning

- **Reservation** (by MAC or DUID) pins address for printers, APs, controllers—document **why**.
- **Scopes** should avoid overlap with **static** assignments; split by VLAN or by **superscope** only when you understand implications.
- **Split DHCP** (hot standby or load balance) improves availability for critical sites.

---

## Key takeaways

- **DNS is configuration + caching + TTL**—plan changes during low-impact windows.
- **DHCP is not authentication**—pair with **802.1X** or port security for untrusted access.
- **PTR** hygiene still matters for operational mail and forensics.

---

## Quiz

1. Which record type maps a hostname to an **IPv6** address?  
   A) A  
   B) AAAA  
   C) MX  

2. In DHCP, the **Ack** message primarily:  
   A) Discovers the server  
   B) Confirms lease parameters to the client  
   C) Deletes the lease  

3. **CNAME** is best described as:  
   A) Mail routing preference  
   B) Alias pointing to another DNS name  
   C) Reverse pointer  

4. **DHCP reservation** is used to:  
   A) Randomize addresses every second  
   B) Give a specific client a predictable IP  
   C) Replace DNS entirely  

5. **TTL** on a DNS record primarily influences:  
   A) How long resolvers may cache the answer  
   B) DHCP lease length only  
   C) Ethernet MTU  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **A**
