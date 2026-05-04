# Module: Virtualization & bare-metal workloads

**Track:** Advanced · **Module ID:** `adv-virt`

## Overview

Run **KVM**/**QEMU**/**libvirt** with **NUMA** and **hugepages**, choose **SR-IOV**/**macvtap**/**bridge**/**OVS** models, meet **live migration** prerequisites, and handle **nested virt**, **VFIO** passthrough, and guest **UEFI**.

## Learning objectives

- Tune **CPU models**, **NUMA pinning**, and **hugepages** for guests.
- Compare **SR-IOV**, **macvtap**, **Linux bridge**, and **OVS** networking.
- List **live migration** requirements: shared storage, CPU compatibility, timing.
- Assess **nested virt**, **VFIO** passthrough, and **UEFI** firmware for VMs.

---

## Lesson 1: KVM / QEMU / libvirt: CPU models, NUMA pinning, hugepages for guests

- **CPU models** balance **migration** vs. **feature** exposure—**host-passthrough** is powerful but brittle for pools.
- **numatune** and **vcpu pin** in **libvirt** XML align guest vCPUs with **host** NUMA nodes.
- **Hugepages** back guest RAM to reduce fragmentation—ensure **Hugetlbfs** pools sized correctly.

## Lesson 2: SR-IOV, macvtap, and bridge vs. OVS for guest networking

- **SR-IOV** **VF** near-line rate with **PCIe** isolation—less flexible than virtio but lower overhead.
- **macvtap** private/bridge/vepa modes—understand **hairpin** and **promiscuity** needs.
- **Linux bridge** simplicity vs. **OVS** programmability—operations team skill drives choice.

## Lesson 3: Live migration requirements: shared storage, CPU compatibility, timing

- **Shared** disk or **block replication** must present identical volumes on target.
- **CPU** baseline or **migration** policies must allow **feature** sets—test **EPT/NPT**, **tsc** stability.
- **Downtime** budgets drive **pre-copy** tuning—watch **dirty** page rates.

## Lesson 4: Nested virt, device passthrough (VFIO), and firmware (UEFI) for VMs

- **Nested** **KVM** needs host **module** params—performance and debug complexity rise.
- **VFIO** binds devices to **vfio-pci**—IOMMU groups must be atomic; **ACS** quirks exist.
- **UEFI** guests need **OVMF** variables **NVRAM** handling for **Secure Boot** workflows.

## Lesson 5: Lab—`virsh dominfo`, migration URI, hugepage pool sizing

- **`virsh dominfo guest`**—note **CPU(s)**, **CPU time**, **Autostart**, **Security** driver in use.
- Practice **offline migration** in lab—watch **shared storage** prerequisite errors on purpose.
- Compute **hugepages** needed for RAM—`/proc/meminfo` **HugePages_Free** vs guest XML **memoryBacking**.

## Lesson 6: Anti-patterns in virtualization

- **host-passthrough CPU** on pools that require **live migration**—feature mismatch failures.
- **SR-IOV VF assigned to multiple guests**—data path corruption and impossible diagnostics.
- **OVS rules** without monitoring—VXLAN loops and STP surprises.

---

## Key takeaways

- **Networking model** is a security and ops contract—document it per cluster.
- **Live migration** fails mysteriously when **CPU**/**time**/**storage** assumptions drift.

---

## Quiz

1. **libvirt** is commonly used to:  
   A) Define and manage KVM/QEMU domains declaratively  
   B) Replace systemd journal  
   C) Compile eBPF only  

2. **NUMA pinning** for VMs helps:  
   A) Keep vCPU and memory on the same socket to reduce remote access latency  
   B) Increase ARP timeouts only  
   C) Disable networking  

3. **SR-IOV** provides:  
   A) Hardware-partitioned virtual functions from a physical NIC for near-native performance  
   B) Only software-defined RAID  
   C) Only LUKS keys  

4. **Live migration** typically requires:  
   A) Compatible CPU features and consistent storage visibility between hosts  
   B) Only a serial mouse  
   C) Disabling all encryption  

5. **VFIO** passthrough depends on:  
   A) IOMMU grouping and binding devices to the vfio driver safely  
   B) Only Btrfs subvolumes  
   C) Only cron tables  

6. **`virsh dominfo`** is most useful for summarizing:  
   A) A guest’s CPU count, memory, state, autostart, and related metadata  
   B) Kernel module parameters only  
   C) Only GPU VRAM clocks  

7. Using **`host-passthrough`** CPU models broadly can complicate **live migration** because:  
   A) Feature sets may differ between hosts in a pool, breaking compatibility checks  
   B) It always disables networking  
   C) It forces virtio-only disks  

8. **Hugepages** backing guest RAM require operational attention to:  
   A) Preallocated pool sizing and monitoring—otherwise guest start fails or host OOMs  
   B) Only `/etc/motd` contents  
   C) SNMP community strings  

---

## Answer key

1. **A** · 2. **A** · 3. **A** · 4. **A** · 5. **A** · 6. **A** · 7. **A** · 8. **A**
