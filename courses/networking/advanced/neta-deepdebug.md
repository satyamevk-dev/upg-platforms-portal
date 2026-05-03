# Module: Deep packet and protocol analysis

**Track:** Advanced · **Module ID:** `neta-deepdebug`

## Overview

When logs are not enough, **packets** tell the truth. This module covers **advanced tcpdump/Wireshark**, **TLS handshake** debugging, **PMTU black holes**, and **control-plane policing** impacts.

## Learning objectives

- Build **display filters** and **capture filters** for targeted traces.
- Follow a **TLS handshake** at a survey level (certificates, cipher suites).
- Diagnose **PMTU** issues and **DF bit** behavior.
- Recognize **CoPP/CP** symptoms affecting routing stability.

---

## Lesson 1: tcpdump/Wireshark filtering and reconstruction

- **Capture filter** (bpf) reduces volume early; **display filter** refines after capture.
- **Follow TCP stream** rebuilds application payloads—handle **PII** responsibly.
- Use **SPAN/RSPAN/ERSPAN** carefully in high-utilization environments.

## Lesson 2: TLS handshake analysis

- **ClientHello/ServerHello**, **certificate chain**, **ServerKeyExchange**, **Finished**—misconfigurations show as **alert** records.
- **SNI** matters for multi-tenant TLS; **ALPN** negotiates **HTTP/2**.

## Lesson 3: Asymmetric routing and PMTU black holes

- **Asymmetry** breaks **stateful firewalls** and skews **RTT** measurements—draw **both directions**.
- **PMTU black hole:** ICMP **Fragmentation Needed** / **Packet Too Big** blocked → **DF** large packets stall—enable **PMTUD** helpers or **clamp MSS** on VPNs.

## Lesson 4: Control-plane policing (CoPP)

- **CoPP** protects the **CPU** from **traffic punted** for processing; overly aggressive policies can **drop** **BGP/OSPF** or **ICMP** needed for MTU discovery.
- **Symptom:** flapping neighbors, intermittent management—**show policy-map control-plane** (platform-specific).

---

## Key takeaways

- **Capture at both ends** before theorizing.
- **TLS** issues are often **clock**, **SNI**, or **chain**—not “magic crypto.”
- **Silently dropped ICMP** is a production incident waiting to happen.

---

## Quiz

1. A **display filter** in Wireshark differs from a **capture filter** mainly because:  
   A) Display filters are applied after packets are stored  
   B) They are identical terms  
   C) Capture filters only work on Wi-Fi  

2. **SNI** in TLS is used to:  
   A) Select the correct certificate on multi-site TLS endpoints  
   B) Replace IP addresses  
   C) Configure STP priority  

3. A **PMTU black hole** can occur when:  
   A) Path MTU discovery fails because ICMP messages are blocked  
   B) DNS TTL is too high  
   C) Only when using DHCP  

4. **Follow TCP stream** helps to:  
   A) Reassemble application-layer conversation for analysis  
   B) Configure VLANs  
   C) Replace NetFlow  

5. **CoPP** primarily protects:  
   A) The device control plane CPU from excessive punted traffic  
   B) Only wireless clients  
   C) Only optical transceivers  

---

## Answer key

1. **A** · 2. **A** · 3. **A** · 4. **A** · 5. **A**
