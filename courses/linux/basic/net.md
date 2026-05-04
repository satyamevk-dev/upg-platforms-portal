# Module: Networking fundamentals

**Track:** Basic · **Module ID:** `net`

## Overview

Verify addresses, ports, DNS, and simple HTTP reachability from the Linux CLI—core skills for admins and SREs.

## Learning objectives

- Use modern `ip` and `ss` (and recognize legacy `ifconfig` / `netstat` where still seen).
- Test reachability with `ping` and path tracing with `traceroute` / `tracepath`.
- Resolve DNS with `dig`, `nslookup`, and `getent hosts`.
- Fetch URLs with `curl` and `wget`.

---

## Lesson 1: `ip` / `ss` (and legacy tools)

- **`ip addr`** — addresses; **`ip route`** — routing table; **`ip link`** — interfaces.
- **`ss -tulpn`** — listening TCP/UDP sockets with processes (often needs root for all PIDs).
- Legacy **`ifconfig`**, **`netstat`** may still appear in old docs—prefer **`ip`**/**`ss`** on new systems.

## Lesson 2: `ping`, `traceroute` / `tracepath`

- **`ping`** tests ICMP (may be blocked); note **MTU** and **latency** patterns.
- **`traceroute`** / **`tracepath`** show hop path—useful for asymmetric routing clues (not definitive).

## Lesson 3: `dig`, `nslookup`, `getent hosts`

- **`dig +short A example.com`** — quick answers; **`dig`** full output for debugging TTL, flags.
- **`getent hosts name`** exercises **NSS** (`/etc/nsswitch.conf`)—shows what libc resolution returns.
- Inspect **`/etc/resolv.conf`** (or **systemd-resolved** stubs) when DNS acts “random.”

## Lesson 4: `curl` and `wget`

- **`curl -I URL`** — headers only; **`curl -v`** — verbose TLS/cert path.
- **`wget`** — simple downloads; **`curl`** more flexible for APIs and methods.

## Lesson 5: Lab—`ip route get`, `ss` filters, and MTU sanity

- Run **`ip route get 8.8.8.8`**—note **src** IP, **dev**, and **table**; correlate with **`ip rule list`** if policy routing exists.
- Compare **`ss -lnt`** vs **`ss -lnpt`**—when you need PIDs, what privileges are implied?
- Check **MTU** on involved interfaces—overlay and PPPoE scenarios where **PMTU blackholes** mimic “random hangs.”

## Lesson 6: Anti-patterns in network debugging

- **Assuming `ping` failure means host down**—ICMP may be filtered while TCP services work.
- **Testing only with `curl` to localhost**—misses firewall, routing, or SNAT issues on real paths.
- **`tcpdump` without filters** in production—captures sensitive payloads and overloads disks.

---

## Key takeaways

- **Layer 2/3/4/7** checks: link → address → route → port → app response.
- **DNS vs. /etc/hosts** vs. corporate split-horizon—triangulate with `dig` + `getent`.

---

## Quiz

1. Which command best lists **listening TCP sockets** with process info on modern systems?  
   A) `ls /etc`  
   B) `ss -tulpn`  
   C) `chmod +x`  

2. `dig` is primarily used for:  
   A) Disk imaging  
   B) DNS queries  
   C) User password changes  

3. `ping` primarily exercises:  
   A) HTTP layer  
   B) ICMP reachability (when allowed)  
   C) Filesystem mounts  

4. `getent hosts` is useful because it:  
   A) Shows NSS-based name resolution results  
   B) Formats USB devices  
   C) Replaces `iptables`  

5. `curl -I` typically fetches:  
   A) Response headers only (HEAD-style)  
   B) Full body always  
   C) Kernel modules  

6. **`ip route get <addr>`** is especially helpful to see:  
   A) Which interface/source IP the kernel would select for that destination  
   B) GPU temperature  
   C) inode usage only  

7. Successful **`ping`** to a host proves:  
   A) Nothing about arbitrary TCP ports being open  
   B) That all TCP ports are open  
   C) That TLS certificates are valid  

8. **`curl --resolve example.com:443:127.0.0.1 https://example.com/`** is useful to:  
   A) Bypass DNS for SNI/Host testing against a specific backend IP  
   B) Format ext4  
   C) List loaded eBPF programs  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **A** · 5. **A** · 6. **A** · 7. **A** · 8. **A**
