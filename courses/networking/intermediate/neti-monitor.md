# Module: Monitoring & telemetry

**Track:** Intermediate · **Module ID:** `neti-monitor`

## Overview

You cannot operate what you cannot see. This module surveys **SNMP**, **syslog**, **NetFlow/IPFIX**, and **dashboard/alert** practices for network teams.

## Learning objectives

- Compare **SNMP polling** vs. **traps/informs**.
- Map **syslog severities** to operational response patterns.
- Explain **flow export** value for capacity and security.
- Define sensible **baselines** and **alert thresholds**.

---

## Lesson 1: SNMP polling, traps, and common objects

- **SNMPv3** (auth/priv) preferred over legacy v2c communities in production.
- **Polling** (get/walk) for **periodic metrics**; **traps/informs** for **events** (link down, threshold crossed).
- Know **ifHCInOctets/ifHCOutOctets** for **64-bit** counters on high-speed links.

## Lesson 2: Syslog levels and centralized logging

- **Severity 0–7** (Emergency → Debug)—filter noise at source but **retain security-relevant** events centrally.
- **Time sync (NTP)** is mandatory for correlation across devices.

## Lesson 3: NetFlow, sFlow, and IPFIX

- **NetFlow/IPFIX** exports **flow records** (5-tuple, bytes, duration) for **who talked to whom**.
- **sFlow** samples packets/ counters—faster insight on very high-speed devices with statistical approaches.

## Lesson 4: Baselines, dashboards, and alerts

- **Baseline** normal CPU, interface utilization, error rates—**alert on deltas** and anomalies.
- **On-call runbooks** should say *what to check next*, not only *what fired*.

---

## Key takeaways

- **SNMP without security** is an exposure—**ACL**, **views**, **V3 users**.
- **Flows** complement **SNMP**—neither replaces PCAP for deep issues.
- **Good monitoring is boring**—predictable dashboards, actionable alerts.

---

## Quiz

1. **SNMP traps** are best described as:  
   A) Periodic GET requests  
   B) Device-initiated event messages to a manager  
   C) DNS NOTIFY  

2. **Syslog severity 0 (Emergency)** implies:  
   A) Debug trivia  
   B) System is unusable  
   C) Informational only  

3. **NetFlow/IPFIX** is primarily used to:  
   A) Replace STP  
   B) Export traffic flow records for analysis  
   C) Assign DHCP addresses  

4. **64-bit interface counters** (e.g., ifHC*) matter because:  
   A) They look longer in show output only  
   B) 32-bit counters can wrap quickly on high-speed links  
   C) They disable routing  

5. **NTP** in monitoring context is critical for:  
   A) Color schemes on dashboards  
   B) Correlating events across devices  
   C) Wireless channel selection  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B**
