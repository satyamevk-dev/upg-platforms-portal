# Module: Platform, firmware & out-of-band

**Track:** Advanced · **Module ID:** `adv-platform`

## Overview

Validate hardware inventory with **dmidecode**/**lspci**/**sensors**, operate **IPMI**/**Redfish**/**BMC** for lights-out management, plan **firmware** updates (**LVFS**/**fwupd** vs. vendor tools), and tune **kexec**/**crashkernel** for fast recovery and **vmcore** analysis.

## Learning objectives

- Use **dmidecode**, **lspci**, **sensors** against expected CMDB records.
- Manage power and console via **IPMI**/**Redfish**/**BMC**.
- Compare **LVFS**/**fwupd** with vendor-specific updaters; understand **Secure Boot** chain.
- Configure **kexec** fast reboot and **crashkernel** sizing; analyze **vmcore**.

---

## Lesson 1: dmidecode, lspci, sensors; validating hardware inventory vs. reality

- **dmidecode** reads SMBIOS—serial, DIMM layout, BIOS version; compare to procurement.
- **lspci**/**lsusb** enumerate buses; **sensors** (lm-sensors) for thermal/voltage—validate thresholds in monitoring.

## Lesson 2: IPMI / Redfish / BMC for power, serial console, and remote ISO mount

- **ipmitool** sol activate for **serial-over-LAN**; **chassis power** cycle during datacenter procedures.
- **Redfish** modern REST API—automate inventory and **virtual media** mounts with audit trails.

## Lesson 3: Firmware updates: LVFS/fwupd vs. vendor tools; secure boot chain

- **fwupd** + **LVFS** stream for supported devices—enterprise may mirror.
- **Vendor** ISO/USB utilities still required for NIC/RAID firmware—schedule **maintenance**.
- **Secure Boot** keys and **shim** updates are change-managed events—test **dual-boot** and **third-party** modules.

## Lesson 4: kexec / fast reboot; crashkernel sizing; post-mortem with vmcore analysis

- **kexec** loads a crash kernel quickly—**crash** utility inspects **vmcore** with **vmlinux** debuginfo.
- Size **crashkernel=** for workload RAM—too small loses dumps; too large wastes precious memory.

## Lesson 5: Lab—`ipmitool sol`, `fwupdmgr get-updates`, SMBIOS audit script

- **`ipmitool -I lanplus -H bmc -U user sol activate`** in lab—document escape sequence and session logging policy.
- **`fwupdmgr get-devices`** / **`get-updates`** on supported laptop or server—note **LVFS** consent prompts.
- Script **`dmidecode -s system-serial-number`** vs CMDB—catch ghost assets after motherboard swap.

## Lesson 6: Anti-patterns in platform management

- **BMC on flat corporate LAN** without ACLs—lights-out equals attacker-in.
- **Firmware “latest always” Friday**—NIC/RAID regressions need bake time.
- **kdump reserved too small**—vmcore truncated, postmortem useless.

---

## Key takeaways

- **BMC** access is a **security domain**—network segmentation and strong auth mandatory.
- **Firmware drift** causes “impossible” bugs—baseline and update deliberately.

---

## Quiz

1. **dmidecode** reads information from:  
   A) SMBIOS/DMI tables describing hardware identity and configuration  
   B) Only GPU VRAM temperature without drivers  
   C) Only ZFS ARC stats  

2. **IPMI** at a high level provides:  
   A) Out-of-band management (power, sensors, SOL) independent of the host OS  
   B) In-band-only graphics drivers  
   C) Container image signing  

3. **fwupd** / **LVFS** are associated with:  
   A) Distributing firmware updates to supported components via a standard Linux tool  
   B) Only mainframe JCL  
   C) Only DHCP options  

4. **Secure Boot** concerns:  
   A) Validating the boot chain with cryptographic signatures  
   B) Only SSH port forwarding  
   C) Only `nice` values  

5. **kexec** is used to:  
   A) Quickly boot into a new kernel from the running system (including crash kernel paths)  
   B) Format swap  
   C) Replace DNSSEC  

6. **BMC/IPMI** interfaces should be treated as:  
   A) A high-privilege management plane requiring network segmentation and strong authentication  
   B) Safe to expose publicly without controls  
   C) Equivalent to read-only `ping`  

7. **`fwupd` + LVFS** is mainly about:  
   A) Delivering firmware updates to supported devices through a standard Linux mechanism  
   B) Managing Kubernetes Ingress TLS only  
   C) Replacing `systemd-journald`  

8. Undersized **`crashkernel=`** reservations commonly cause:  
   A) Truncated or failed vmcore captures after a panic  
   B) Faster normal reboots always  
   C) Automatic RAID scrubbing  

---

## Answer key

1. **A** · 2. **A** · 3. **A** · 4. **A** · 5. **A** · 6. **A** · 7. **A** · 8. **A**
