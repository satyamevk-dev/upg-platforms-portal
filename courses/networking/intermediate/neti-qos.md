# Module: QoS and traffic management

**Track:** Intermediate · **Module ID:** `neti-qos`

## Overview

**QoS** aligns network behavior with business priorities when congestion occurs. This module introduces **classification**, **marking (DSCP)**, **queuing**, **shaping/policing**, and **congestion** signals.

## Learning objectives

- Explain **DiffServ** edge vs. core roles at a high level.
- Map **class-map** / **policy-map** mental model (Cisco MQC style) to “match then act.”
- Describe why **voice** and **video** need bounded delay/jitter.
- Relate **drops** to **ECN** and **tail-drop** behavior conceptually.

---

## Lesson 1: Classification, marking (DSCP), and trust boundaries

- **Classify** traffic (ACLs, NBAR, VLAN, ports) then **mark** (DSCP/CoS) at **trust boundaries**.
- **PHB** examples: **EF**-like for low-latency, **AFxy** for assured forwarding classes.
- **Trust** device markings only where legitimate—end users can abuse DSCP if not policed.

## Lesson 2: Queuing, shaping, and policing

- **Queuing** (LLQ/CBWFQ concepts): strict priority for small voice volumes; **bandwidth** guarantees for classes.
- **Shaping** delays excess traffic smoothly; **policing** drops or remarks excess—use at **edges** to enforce contracts.

## Lesson 3: Voice/video prioritization basics

- **Voice:** small packets, sensitive to **jitter** and **one-way delay**—prioritize and protect with admission control (CAC) where available.
- **Video:** **bulk vs. interactive** differs; telepresence needs tighter bounds than file download.

## Lesson 4: Congestion signals and drop strategies

- **Tail-drop** can cause **TCP global synchronization**; **WRED** drops probabilistically before queues fill.
- **ECN** marks instead of dropping when endpoints support it—better for some flows.

---

## Key takeaways

- **QoS cannot create bandwidth**—it **allocates scarcity**.
- **End-to-end marking agreement** matters—document per-hop behaviors.
- **Measure before tuning**—SNMP/interface drops tell the truth.

---

## Quiz

1. **DSCP** marks are typically applied at:  
   A) Only the core, never the edge  
   B) Trust boundaries / policy points after classification  
   C) Only DNS servers  

2. **Policing** differs from **shaping** mainly in that policing:  
   A) Never drops packets  
   B) Often drops or remarks excess immediately vs. smoothing delay  
   C) Only works on Wi-Fi  

3. **LLQ** (conceptually) provides:  
   A) Lowest latency queue for strict priority traffic (e.g., voice) within limits  
   B) Unlimited best-effort throughput always  
   C) Layer-2 loop prevention  

4. **WRED** aims to:  
   A) Replace BGP  
   B) Avoid sudden full-queue drops by early random drops  
   C) Encrypt wireless frames  

5. **Trust boundary** means:  
   A) Where the network decides whether to believe device markings  
   B) Only a firewall default route  
   C) DHCP relay IP  

---

## Answer key

1. **B** · 2. **B** · 3. **A** · 4. **B** · 5. **A**
