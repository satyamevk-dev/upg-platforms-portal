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

---

## Answer key

1. **A** · 2. **A** · 3. **A** · 4. **A** · 5. **A**
