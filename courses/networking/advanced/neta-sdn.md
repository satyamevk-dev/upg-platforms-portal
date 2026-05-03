# Module: SDN & cloud networking

**Track:** Advanced · **Module ID:** `neta-sdn`

## Overview

**SDN** separates **control** from **data plane** (in varying degrees). This module surveys **controller-based** networking, **cloud VPC/VNet** connectivity, **hybrid** patterns, and **service mesh** interaction with **east–west** traffic.

## Learning objectives

- Explain **SDN controller** value and trade-offs (single brain risks).
- Compare **VPC peering**, **transit**, and **VPN** hybrid models.
- Describe **service mesh** sidecars/proxies vs. traditional network paths.
- Name **multi-cloud** routing and **security boundary** concerns.

---

## Lesson 1: Controller-based networking and policy

- **SDN** centralizes policy; **OpenFlow**-style direct programming is less common now than **fabric controllers** with **BGP-EVPN** under the hood.
- **Risk:** controller/cluster outage—design **graceful degradation** and **out-of-band** access.

## Lesson 2: Cloud VPC/VNet peering and transit

- **Peering** connects private networks (same cloud, often same region—rules vary by provider).
- **Transit gateway / hub** scales many spokes; watch **route limits** and **asymmetric routing** with **firewall appliances**.

## Lesson 3: Hybrid links

- **IPsec/SD-WAN** overlays vs. **dedicated interconnects**—cost, latency, and **encryption** trade-offs.
- **DNS split-horizon** and **private endpoints** reduce hairpinning.

## Lesson 4: Service mesh and east–west security

- **Mesh** (e.g., Istio/Linkerd concepts) encrypts and policies **service-to-service** atop Kubernetes—**overlaps** with traditional firewall zones.
- **mTLS** and **L7 policies** need **observability** (metrics/traces) to debug.

## Lesson 5: Multi-cloud boundaries

- **Identity**, **keys**, and **logging** must be **centralized or correlated**; avoid **shadow networking** via undocumented peerings.

---

## Key takeaways

- **Cloud networking is still routing + state + policy**—different UI, same discipline.
- **Hybrid** designs fail on **DNS** and **asymmetric paths** first.
- **Mesh** adds **L7 complexity**—train operators accordingly.

---

## Quiz

1. A common **SDN** motivation is:  
   A) Eliminate all need for routing protocols everywhere  
   B) Centralize policy and simplify provisioning via abstraction  
   C) Remove encryption requirements  

2. **VPC peering** typically:  
   A) Connects two private cloud networks with routed private connectivity (per provider rules)  
   B) Only works over public Internet without any setup  
   C) Replaces BGP always  

3. **Transit hub** designs help with:  
   A) Scaling many spoke attachments with a central routing appliance  
   B) Removing the need for subnets  
   C) Disabling DNS  

4. **Service mesh** often implements:  
   A) mTLS and L7 policy between microservices  
   B) Only physical cabling  
   C) Only DHCP  

5. **Hybrid cloud** challenges often include:  
   A) DNS, asymmetric routing, and consistent security policy  
   B) Only monitor refresh rates  
   C) Only LCD brightness  

---

## Answer key

1. **B** · 2. **A** · 3. **A** · 4. **A** · 5. **A**
