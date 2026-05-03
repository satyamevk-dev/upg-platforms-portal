# Module: Advanced networking

**Track:** Intermediate · **Module ID:** `int-net`

## Overview

Configure hosts with NetworkManager or legacy files, secure traffic with firewalld/nftables, add routes, and capture packets for evidence-based debugging.

## Learning objectives

- Operate **`nmcli`** and recognize legacy **ifcfg** layouts.
- Use **firewalld** zones and rich rules; relate **nftables** to **iptables**.
- Add static routes and introductory policy routing; deepen **`ss`** usage.
- Capture with **tcpdump** / Wireshark and debug DNS client stacks.

---

## Lesson 1: NetworkManager (`nmcli`) vs. legacy `ifcfg`; bonding/teaming concepts

- **`nmcli dev status`**, **`nmcli con show`**, **`nmcli con up id ...`**—scriptable NM control.
- Legacy **`/etc/sysconfig/network-scripts/ifcfg-*`** persists on some RHEL derivatives; know both during migrations.
- **Bonding/teaming** aggregates links—LACP vs. active-backup; switch configuration must match mode.

## Lesson 2: `firewalld` zones, rich rules; `nftables`/`iptables` relationship

- **firewalld** zones express trust levels; **`firewall-cmd --list-all --zone=...`** for inspection.
- **Rich rules** express finer matches (source, port, action) without dropping to raw tables for every change.
- **nftables** is the modern kernel packet framework; **iptables** front-ends often translate to nft on newer distros.

## Lesson 3: Static routes, policy routing basics; `ss` vs. `netstat` in depth

- **`ip route add`** for statics; **policy routing** uses multiple tables/rules when traffic must egress differently by source or mark.
- **`ss -tanp`**, **`ss -uanp`** show sockets with timers and processes—prefer over deprecated **`netstat`**.

## Lesson 4: `tcpdump` / Wireshark on hosts; DNS client debugging (`systemd-resolved`, `/etc/hosts`)

- **`tcpdump -i any host x and port y`**—capture filters reduce noise; respect privacy policies.
- **Wireshark** GUI for deep protocol analysis—export pcaps for vendors.
- **`systemd-resolved`** stub resolvers vs. direct **`/etc/resolv.conf`**; **`getent hosts`** vs. **`dig`** isolates layers.

---

## Key takeaways

- **Match data path:** interface → address → route → firewall → listening socket → application.
- **Packet capture** beats guessing when ports “should be open.”

---

## Quiz

1. **`nmcli`** is primarily for:  
   A) Managing NetworkManager connections from CLI  
   B) Creating LVM snapshots only  
   C) Editing sudoers  

2. **firewalld** **zones** are best thought of as:  
   A) Trust groupings that define default policies for interfaces/sources  
   B) Disk partitions  
   C) Kernel compile flags  

3. On modern kernels, **nftables** relates to **iptables** roughly as:  
   A) The newer rule backend many tools ultimately target  
   B) Unrelated subsystems  
   C) Identical userland binaries always  

4. **`ss -lptn`** is useful to:  
   A) List listening TCP sockets with associated processes  
   B) Format USB sticks  
   C) Show only BIOS settings  

5. When DNS works in **`dig`** but fails in **`getent hosts`**, you should suspect:  
   A) NSS / resolver client configuration mismatch  
   B) Only physical RAM size  
   C) Only GPU drivers  

---

## Answer key

1. **A** · 2. **A** · 3. **A** · 4. **A** · 5. **A**
