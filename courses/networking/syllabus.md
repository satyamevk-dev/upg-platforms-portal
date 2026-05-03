# Networking Professional Track — Course Syllabus

This syllabus mirrors the platform’s **Networking** learning path: **Basic**, **Intermediate**, and **Advanced**. Each row links to a dedicated module guide with structured lessons and an end-of-module quiz.

---

## How to use this course

1. Work through modules **in order** within each tier unless your instructor directs otherwise.
2. Read the **lessons**, sketch **topologies** or **addressing plans** on paper where it helps, and use **labs** (simulators, small VMs, or vendor sandboxes) when noted.
3. Complete the **quiz** at the bottom of each module file; use it to check understanding before moving on.
4. **Basic** assumes comfort with using a computer and general IT awareness. **Intermediate** assumes completion of Basic (or equivalent). **Advanced** assumes hands-on routing/switching or strong academic preparation plus lab access.

---

## Track 1 — Basic

| # | Module ID | Topic | Module guide |
|---|-----------|--------|--------------|
| 1 | `netb-osi` | Networking foundations & models | [basic/netb-osi.md](basic/netb-osi.md) |
| 2 | `netb-ipv4` | IPv4 addressing & subnetting | [basic/netb-ipv4.md](basic/netb-ipv4.md) |
| 3 | `netb-switching` | Ethernet switching basics | [basic/netb-switching.md](basic/netb-switching.md) |
| 4 | `netb-routing` | Routing basics | [basic/netb-routing.md](basic/netb-routing.md) |
| 5 | `netb-dnsdhcp` | DNS & DHCP essentials | [basic/netb-dnsdhcp.md](basic/netb-dnsdhcp.md) |
| 6 | `netb-tools` | Troubleshooting tools (entry) | [basic/netb-tools.md](basic/netb-tools.md) |

**Estimated effort (Basic):** 30–40 hours including labs.

---

## Track 2 — Intermediate

| # | Module ID | Topic | Module guide |
|---|-----------|--------|--------------|
| 1 | `neti-ospf` | Dynamic routing protocols | [intermediate/neti-ospf.md](intermediate/neti-ospf.md) |
| 2 | `neti-bgp` | BGP fundamentals | [intermediate/neti-bgp.md](intermediate/neti-bgp.md) |
| 3 | `neti-security` | Network security controls | [intermediate/neti-security.md](intermediate/neti-security.md) |
| 4 | `neti-wireless` | Wireless networking | [intermediate/neti-wireless.md](intermediate/neti-wireless.md) |
| 5 | `neti-qos` | QoS and traffic management | [intermediate/neti-qos.md](intermediate/neti-qos.md) |
| 6 | `neti-monitor` | Monitoring & telemetry | [intermediate/neti-monitor.md](intermediate/neti-monitor.md) |

**Estimated effort (Intermediate):** 35–50 hours including labs.

---

## Track 3 — Advanced

| # | Module ID | Topic | Module guide |
|---|-----------|--------|--------------|
| 1 | `neta-design` | Enterprise architecture & high availability | [advanced/neta-design.md](advanced/neta-design.md) |
| 2 | `neta-mpls` | MPLS & traffic engineering | [advanced/neta-mpls.md](advanced/neta-mpls.md) |
| 3 | `neta-ddos` | Threat mitigation & edge defense | [advanced/neta-ddos.md](advanced/neta-ddos.md) |
| 4 | `neta-automation` | Network automation at scale | [advanced/neta-automation.md](advanced/neta-automation.md) |
| 5 | `neta-sdn` | SDN & cloud networking | [advanced/neta-sdn.md](advanced/neta-sdn.md) |
| 6 | `neta-deepdebug` | Deep packet and protocol analysis | [advanced/neta-deepdebug.md](advanced/neta-deepdebug.md) |

**Estimated effort (Advanced):** 40–55 hours including labs.

---

## Capstone suggestions

- **Basic:** Document a small office: subnet plan, VLAN list, one inter-VLAN diagram, and a one-page “how DNS and DHCP work here” note.
- **Intermediate:** Lab report: OSPF adjacency bring-up with show commands, a simple BGP prefix filter rationale, and one wireless site-survey takeaway.
- **Advanced:** Design or critique a spine–leaf + EVPN/VXLAN sketch, or an automation runbook (pre-checks, change, post-checks, rollback).

---

## Document conventions

- **Terms** in **bold** on first formal use where helpful.
- **Commands** and **addresses** appear in `monospace`; use lab or documentation IPs only (RFC 5737 documentation ranges where appropriate).
- **Quiz answers** are in an **Answer key** subsection—attempt the questions first.

*Version: aligned with application Networking libraries (Basic / Intermediate / Advanced).*
