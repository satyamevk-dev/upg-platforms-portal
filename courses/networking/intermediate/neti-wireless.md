# Module: Wireless networking

**Track:** Intermediate · **Module ID:** `neti-wireless`

## Overview

Wi-Fi is **shared medium RF engineering**. This module compares **2.4 vs. 5 GHz**, introduces **WPA2/WPA3** enterprise concepts, **SSID-to-VLAN** mapping, **roaming**, and common **interference** sources.

## Learning objectives

- Plan channels to reduce **overlap** in 2.4 GHz; understand **DFS** awareness in 5 GHz.
- Contrast **WPA2-Enterprise** vs. **WPA3** goals at a high level.
- Explain **SSID → VLAN** mapping and controller roles.
- List common non-Wi-Fi interference sources.

---

## Lesson 1: 2.4 GHz vs. 5 GHz planning

- **2.4 GHz:** only **three non-overlapping 20 MHz channels** (1/6/11 in many regions); crowded but better range.
- **5 GHz:** more channels, often **DFS** required on some—radar detection can force channel moves.
- Use **site surveys** (passive/active) and **RSSI/SNR** targets from vendor design guides.

## Lesson 2: WPA2/WPA3 enterprise basics

- **802.1X** + **EAP** methods (PEAP, TLS) authenticate **users or devices** to **RADIUS**.
- **WPA3** improves **SAE** for personal networks and tightens enterprise crypto practices—know upgrade dependencies on old clients.

## Lesson 3: SSID to VLAN mapping and roaming

- **SSID** is the wireless “network name”; map to **VLAN** via **switch trunk** + **WLAN policy** on controller or cloud.
- **Roaming:** controller/coordinated architectures maintain **session state**; **fast transition (802.11r)** reduces handoff time for voice.

## Lesson 4: RF interference and mitigation

- **Microwave ovens**, **Bluetooth**, **cordless phones**, **bad cabling** (leakage), **neighbor APs**—spectrum analyzers help prove cause.
- **Power levels:** more is not always better—**cell sizing** reduces contention.

---

## Key takeaways

- **Wi-Fi is Layer 1 first**—no amount of VLAN wizardry fixes bad RF.
- **Enterprise auth** belongs on **WPA2/3 Enterprise**, not shared PSK for staff networks.
- **Document SSID/VLAN/RADIUS** flows before opening the floor.

---

## Quiz

1. In many regions, **non-overlapping 20 MHz** channels in 2.4 GHz are commonly:  
   A) 1, 5, 9  
   B) 1, 6, 11  
   C) Any three consecutive channels  

2. **802.1X** at the WLAN typically involves:  
   A) Static WEP keys only  
   B) RADIUS/EAP authentication before data access  
   C) BGP route reflection  

3. **SSID** is best described as:  
   A) A VLAN ID on wire always equal to SSID number  
   B) The wireless network name users see  
   C) The Ethernet MAC of the AP only  

4. **DFS** in 5 GHz relates to:  
   A) Dynamic frequency selection / radar avoidance requirements  
   B) DHCP scope sizing  
   C) DNSSEC  

5. **Co-channel interference** means:  
   A) APs on the same channel close enough to collide  
   B) Only wired loops  
   C) Only NAT overload  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **A** · 5. **A**
