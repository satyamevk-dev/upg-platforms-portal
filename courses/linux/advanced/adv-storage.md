# Module: Enterprise storage & data path

**Track:** Advanced · **Module ID:** `adv-storage`

## Overview

Design resilient block paths with **multipath**, attach **SAN** LUNs predictably, layer **LUKS** and **NBDE** awareness, and scale **NFS**/**SMB** with Kerberos and performance literacy.

## Learning objectives

- Explain **DM-Multipath**, **ALUA**, and path failure behavior.
- Operate **iSCSI** initiators, **FC** identity, LUN discovery, and persistent naming.
- Contrast **LUKS** full-disk vs. file-level encryption; know **clevis**/**tang** (NBDE) at awareness level.
- Discuss **NFS**/**SMB** at scale: Kerberos mounts, **pNFS** concepts, tunables.

---

## Lesson 1: Multipath (DM-Multipath), ALUA, and path failure behavior

- **DM-Multipath** aggregates redundant paths—**prio** and **path_checker** policies matter for arrays.
- **ALUA** expresses optimized vs. non-optimized paths—misconfiguration yields slow “active/passive” surprises.

## Lesson 2: SAN basics: iSCSI initiator, FC WWNs, LUN discovery, and persistent naming

- **iSCSI:** **discovery**, **login**, **persistent** node records; secure with CHAP/VLAN segmentation as policy dictates.
- **FC:** **WWPN**/**WWNN** zoning and masking; **LUN** alignment and queue depth tuning with vendor guidance.
- Prefer **by-id**/**multipath** names in **`/etc/fstab`** and LVM PVs.

## Lesson 3: LUKS full-disk and file-level encryption; clevis/tang for NBDE (awareness)

- **LUKS** encrypts block devices; **clevis**/**tang** enables **NBDE** network-bound decryption—understand key escrow and availability.
- File-level encryption (eCryptfs, fscrypt) differs in threat model and backup semantics.

## Lesson 4: NFS/SMB at scale: Kerberos mounts, pNFS concepts, and performance knobs

- **Kerberos**-secured mounts integrate with enterprise IDM—clock skew and SPN hygiene matter.
- **pNFS** splits data/metadata paths—awareness for throughput at scale.
- Tune **rsize**/**wsize**, **nfsvers**, server **threads**, and network MTU/jumbo carefully with measurement.

## Lesson 5: Lab—`multipath -ll`, `iscsiadm -m session`, NFS `nfsstat`

- **`multipath -ll`** on a SAN host—confirm **active**/**enabled** path groups and **prio** health.
- **`iscsiadm -m session -P 3`**—session details for debugging login/auth issues (read-only).
- **`nfsstat -cn`** during a load test—client op breakdown vs. server-side **`nfsstat`** where available.

## Lesson 6: Anti-patterns in enterprise storage

- **Single-path “redundant” arrays**—false confidence; no automatic failover.
- **Kerberos NFS** with **clock skew** ignored—mystery “access denied” spirals.
- **LUKS without tested DR unlock**—data availability incident during key loss.

---

## Key takeaways

- **Multipath + ALUA** mis-wiring causes “mysterious” latency—not always application bugs.
- **Encryption** choices affect **boot**, **DR**, and **support** workflows—design holistically.

---

## Quiz

1. **DM-Multipath** primarily provides:  
   A) I/O path redundancy and failover across multiple links to storage  
   B) CPU frequency scaling  
   C) Container image signing  

2. **iSCSI discovery** is a step toward:  
   A) Finding and logging into targets before presenting LUNs  
   B) Configuring Wi-Fi SSIDs  
   C) Managing BMC sensors only  

3. **LUKS** is commonly used for:  
   A) Block-device encryption with Linux unified key setup  
   B) Routing policy only  
   C) LDAP schema design  

4. **NBDE** (clevis/tang) at a high level relates to:  
   A) Network-bound disk encryption unlocking patterns  
   B) GPU virtualization  
   C) SNMP trap formatting  

5. **Kerberos** with NFS often matters because:  
   A) It provides strong authentication integration for enterprise file shares  
   B) It replaces TCP entirely  
   C) It disables encryption always  

6. **`multipath -ll`** is primarily used to:  
   A) Inspect multipath device state, path groups, and failover health  
   B) Compile eBPF programs  
   C) Manage Wi-Fi SSIDs  

7. A common operational mistake with **iSCSI** storage is:  
   A) Assuming discovery/login steps were completed when LUNs are not actually presented  
   B) Always disabling CHAP without reading policy  
   C) Using `/dev/sda` labels forever without stable naming  

8. **NBDE (clevis/tang)** introduces operational requirements around:  
   A) Network availability and key escrow for automatic decryption workflows  
   B) GPU passthrough only  
   C) Only BIOS splash screens  

---

## Answer key

1. **A** · 2. **A** · 3. **A** · 4. **A** · 5. **A** · 6. **A** · 7. **A** · 8. **A**
