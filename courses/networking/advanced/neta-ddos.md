# Module: Threat mitigation & edge defense

**Track:** Advanced · **Module ID:** `neta-ddos`

## Overview

**DDoS** attacks aim for **exhaustion** (bandwidth, state, CPU) or **exploitation**. This module covers **detection/scrubbing**, **RTBH/Flowspec** awareness, **CDN/WAF** roles, and **incident communications**.

## Learning objectives

- Differentiate **volumetric**, **protocol**, and **application-layer** attacks at a high level.
- Explain **scrubbing center** traffic diversion conceptually.
- Name **RTBH** and **Flowspec** purposes.
- List **runbook** elements for edge incidents.

---

## Lesson 1: DDoS classes and detection

- **Volumetric:** fill pipes; needs **carrier/cloud scrubbing** and **anycast** absorption.
- **Protocol:** exploit state tables (SYN floods, etc.)—mitigate with **SYN cookies**, **rate limits**, **smart ACLs**.
- **Application-layer:** expensive HTTP workloads—**WAF**, **caching**, **challenge** mechanisms.

## Lesson 2: Scrubbing workflows

- **BGP diversion** or **DNS swing** to **scrubbing** provider; **clean traffic** returned via **GRE** or **cross-connect**.
- **Time-to-mitigate** SLAs and **false positive** playbooks must be pre-negotiated.

## Lesson 3: RTBH and Flowspec (awareness)

- **RTBH (Remote Triggered Black Hole):** drop traffic to **victim /32** upstream to protect aggregate—**collateral** if mis-scoped.
- **Flowspec** distributes **flow rules** via BGP for **surgical** mitigation—powerful, risky.

## Lesson 4: WAF/CDN interplay

- **CDN** absorbs static and cacheable content; **WAF** inspects **L7** for exploits; both alter **true client IP** visibility—plan **headers** and **logging**.

## Lesson 5: Incident runbooks and comms

- **Roles:** NOC, security, provider TAM, leadership updates.
- **Evidence:** **NetFlow**, **pcap** samples, **BGP updates**, **ticket** timeline—post-incident **blameless review**.

---

## Key takeaways

- **No single appliance** stops modern DDoS—**architecture + partners** matter.
- **Blackholing** is a scalpel that can cut the patient—validate prefixes.
- **Practice** diversion quarterly.

---

## Quiz

1. A **volumetric** attack primarily targets:  
   A) Application SQL parsing only  
   B) Available bandwidth or flooding capacity  
   C) Only DHCP servers  

2. **Scrubbing centers** typically:  
   A) Clean traffic after diversion/filtering  
   B) Replace DNS entirely  
   C) Disable BGP  

3. **RTBH** is often used to:  
   A) Advertise a /32 discard route upstream to sink attack traffic  
   B) Increase MTU automatically  
   C) Encrypt all email  

4. **Flowspec** allows:  
   A) Distribution of traffic filtering rules via BGP  
   B) Only wireless channel changes  
   C) Static routing only  

5. A **WAF** primarily helps with:  
   A) Layer-7 application attack mitigation  
   B) Physical cable testing  
   C) STP root election  

---

## Answer key

1. **B** · 2. **A** · 3. **A** · 4. **A** · 5. **A**
