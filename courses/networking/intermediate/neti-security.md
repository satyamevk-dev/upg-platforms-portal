# Module: Network security controls

**Track:** Intermediate · **Module ID:** `neti-security`

## Overview

Security is **policy expressed in packets**. This module covers **ACL design**, **stateful firewalls** and **zones**, **NAT/PAT** behavior, and **IPsec VPN** phases at a survey level.

## Learning objectives

- Explain **top-down** ACL matching and **implicit deny**.
- Contrast **stateless** vs. **stateful** filtering.
- Describe **PAT** vs. **dynamic NAT** behaviorally.
- Outline **IPsec** phase 1 vs. phase 2 purposes.

---

## Lesson 1: ACL design and top-down matching

- **First match wins**; finalize with **explicit permit/deny** as needed; many platforms **implicit deny** at end.
- **Extended ACLs** can match **source/dest IP, ports, protocols**—place as close to source *or* destination per design philosophy (Cisco: standard vs. extended guidance).
- **Object-groups** improve readability and change control.

## Lesson 2: Stateful firewalls and zone-based policy

- **Stateful** devices track **flows** (5-tuple) and allow return traffic matching established session state.
- **ZBFW (zone-based)** assigns interfaces to **zones**; policies govern **zone-pair** direction (e.g. inside → DMZ).

## Lesson 3: NAT/PAT behaviors and troubleshooting

- **PAT** maps many inside addresses to one outside IP using **port translation**; breaks some protocols without **ALG** or **modern alternatives**.
- **Static NAT** 1:1 for servers; watch **hairpinning** and **DNS** (split DNS vs. NAT reflection).

## Lesson 4: VPN basics — IPsec phases

- **IKE Phase 1:** establishes **ISAKMP SA** (authentication, key exchange—often IKEv2 today).
- **IKE Phase 2 (IPsec SA):** protects **interesting traffic** with ESP/AH transforms.
- Troubleshoot with **phase-1 mismatch** (crypto proposals, PSK/certs, IDs) vs. **phase-2** (proxy-IDs, PFS, lifetimes).

---

## Key takeaways

- **ACL + state + zones** should mirror **risk tiers**, not “permit ip any any” convenience.
- **NAT is not security**—it obscures addresses; still need inspection and authZ.
- **VPNs** fail on **small mismatches**—use checklists.

---

## Quiz

1. In a typical ACL, if no line matches, many devices:  
   A) Permit all  
   B) Implicitly deny  
   C) Ask DNS  

2. **Stateful** firewalls track:  
   A) Only Layer 1 voltage  
   B) Sessions/flows to permit return traffic legitimately  
   C) Only BGP communities  

3. **PAT** is best described as:  
   A) One inside IP to many outside IPs  
   B) Many inside hosts sharing one (or few) outside IPs using port multiplexing  
   C) No translation at all  

4. **IKE Phase 1** primarily establishes:  
   A) The secure channel to negotiate IPsec parameters  
   B) DHCP leases  
   C) STP root bridge  

5. **ZBFW** policies are commonly applied between:  
   A) DNS zones only  
   B) **Security zones** (e.g., inside, outside, DMZ)  
   C) Only Wi-Fi SSIDs  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **A** · 5. **B**
