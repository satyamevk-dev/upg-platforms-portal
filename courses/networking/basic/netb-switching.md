# Module: Ethernet switching basics

**Track:** Basic · **Module ID:** `netb-switching`

## Overview

Switches forward **frames** based on **MAC addresses**. This module covers **MAC learning**, **VLANs** (802.1Q), **access vs. trunk** ports, **STP** purpose, and common **speed/duplex** mismatch symptoms.

## Learning objectives

- Explain how a switch builds a **MAC address table**.
- Compare **access** and **trunk** ports and the role of **802.1Q** tags.
- State why **STP** exists and what loops do without it.
- Recognize classic duplex/speed mismatch indicators.

---

## Lesson 1: MAC addresses and switch forwarding

- Each NIC has a **MAC** (burned-in or administratively set); frames carry **source** and **destination** MAC.
- Switches **learn** source MACs on ingress and map them to **ports**; unknown unicast is **flooded** within the VLAN.
- **Collision domains** are per-port in full-duplex switched Ethernet; **broadcast domains** are VLAN-scoped.

## Lesson 2: VLAN tagging (802.1Q) — access vs. trunk

- **VLAN** segments a switch logically; frames are associated with a VLAN ID.
- **Access port:** belongs to **one** VLAN; frames are **untagged** on the wire to the end host.
- **Trunk port:** carries **multiple** VLANs; frames are typically **tagged** with **802.1Q** (except native VLAN behavior—know your vendor defaults).
- **Native VLAN** mismatches between switches are a classic cause of “some VLANs work, some don’t.”

## Lesson 3: STP purpose and loop avoidance

- **Spanning Tree (STP)** blocks redundant links to prevent **Layer-2 loops** that would flood broadcasts forever.
- **Root bridge** election and **port roles** (root, designated, blocked) determine which paths are active.
- Modern designs may use **MC-LAG**, **TRILL**, or **fabric** protocols—but **STP awareness** remains essential on brownfield campus networks.

## Lesson 4: Speed and duplex mismatches

- **Auto-negotiation** usually preferred; **forced** speed/duplex on one side only can yield **half-duplex** on one end and **collisions/errors**.
- **Symptoms:** interface errors, poor throughput, intermittent connectivity—check `show interface` counters and negotiation status.

---

## Key takeaways

- **MAC learning + flooding** explains many “works sometimes” behaviors.
- **VLAN + trunk** discipline is non-negotiable in multi-site LANs.
- **STP** is insurance against human cabling mistakes and redundant designs.

---

## Quiz

1. A switch forwards a **unicast** frame whose destination MAC is **unknown**. It typically:  
   A) Drops the frame silently  
   B) Floods it out all ports in the same VLAN (except ingress)  
   C) Sends it to the default gateway  

2. **802.1Q** tags are most associated with:  
   A) IP routing between continents only  
   B) VLAN identification on trunks  
   C) DNS resolution  

3. **STP** primarily prevents:  
   A) IPv4 address exhaustion  
   B) Layer-2 loops and broadcast storms  
   C) DHCP lease overlap  

4. An **access port** usually carries:  
   A) Multiple tagged VLANs to a PC  
   B) A single VLAN, untagged toward the end device  
   C) Only WAN traffic  

5. One-sided **manual speed/duplex** configuration often leads to:  
   A) Better security  
   B) Duplex mismatch and interface errors  
   C) Automatic /32 routing  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B**
