# Module: Storage & filesystems (advanced)

**Track:** Intermediate · **Module ID:** `int-storage`

## Overview

Move beyond casual `df`/`ls` usage: identify block devices reliably, choose filesystem types and mount options, operate LVM for elasticity, and recognize Stratis/VDO and full-disk scenarios.

## Learning objectives

- Use `blkid`, `lsblk`, `findmnt`, and `/etc/fstab` with UUIDs vs. labels.
- Compare ext4 and XFS for `mkfs`, `fsck`, and options like `noatime` and quota awareness.
- Create and resize LVM stacks (PV → VG → LV).
- Recognize Stratis/VDO, swap placement, and triage “disk full” situations.

---

## Lesson 1: `blkid`, `lsblk`, `findmnt`, and persistent mounts via `/etc/fstab` (UUID vs. labels)

- **`lsblk`** shows the block tree; **`findmnt`** shows what is mounted and from where.
- **`blkid`** prints UUIDs and TYPE—prefer **UUID=** or **LABEL=** in **`/etc/fstab`** so names like `/dev/sdb` cannot drift after reboot.
- After editing fstab, validate with **`findmnt --verify`** or **`mount -a`** on a maintenance window.

## Lesson 2: File-system types: ext4, XFS — `mkfs`, `fsck`, and mount options (`noatime`, quotas intro)

- **`mkfs.ext4`**, **`mkfs.xfs`** initialize devices; **`fsck`** offline repair—unmount first.
- **`noatime`** reduces metadata writes for read-heavy workloads; understand trade-offs vs. `relatime`.
- **Quotas** (project/user/group) need filesystem support and tooling—plan before production data lands.

## Lesson 3: LVM: physical volumes, volume groups, logical volumes; extend/reduce workflows

- **PV** wraps a disk or partition; **VG** pools capacity; **LV** is what you `mkfs` and mount.
- **Extend:** grow VG (new PV or extend PV), **`lvextend`**, then grow filesystem (**`xfs_growfs`** or **`resize2fs`** depending on type).
- **Reduce** is riskier (especially XFS)—requires careful ordering; often prefer migrate + rebuild for XFS shrink needs.

## Lesson 4: Stratis & VDO awareness; swap: files vs. partitions; troubleshooting full disks

- **Stratis** / **VDO** (where offered) layer management/dedup concepts—know vendor docs before enabling.
- **Swap:** dedicated partition vs. file—hibernation and performance implications differ.
- **Full disk:** distinguish inode exhaustion vs. block exhaustion (`df -i` vs. `df -h`); find large consumers with **`du`**.

## Lesson 5: Lab—`findmnt --verify`, `xfs_info`, thin pool metadata

- Run **`findmnt --verify`** after **fstab** edits—catch syntax/options issues before reboot.
- On **XFS**, **`xfs_info`** mountpoint—note **log** and **realtime** sections; correlate with workload.
- If using **LVM thin**, watch **metadata** usage—not only data LV percent.

## Lesson 6: Anti-patterns in storage ops

- **Growing LV without growing filesystem**—`df` still shows full; support tickets repeat.
- **`mkfs` on the wrong device**—always double-check **`lsblk`** and **by-id** paths.
- **Shrinking XFS** casually—often unsupported dangerous path; migrate instead.

---

## Key takeaways

- **Stable naming** (UUID/LABEL) prevents boot failures after hardware reordering.
- **LVM + correct grow sequence** avoids “extended LV but filesystem still small” mistakes.

---

## Quiz

1. In `/etc/fstab`, referencing **`UUID=...`** instead of `/dev/sdX` mainly reduces risk of:  
   A) Slower mounts  
   B) Wrong device mapping after reboot or rescan  
   C) SELinux denials  

2. To grow an **XFS** filesystem after `lvextend`, you typically use:  
   A) `resize2fs`  
   B) `xfs_growfs` on the mounted mount point  
   C) `fsck -y`  

3. **`findmnt`** is most directly useful for:  
   A) Listing what is mounted and the source device/options  
   B) Editing GRUB  
   C) Rotating logs  

4. Inode exhaustion on a full filesystem often shows as:  
   A) Errors creating new files despite apparent free space in `df -h`  
   B) Only network timeouts  
   C) Only CPU spikes  

5. An LVM **volume group** is best described as:  
   A) A pool of physical volume capacity  
   B) A single file inside `/tmp`  
   C) A kernel module name only  

6. After editing **`/etc/fstab`**, a cautious validation step is:  
   A) `findmnt --verify` (and/or controlled `mount -a` in a window)  
   B) `rm -rf /lost+found`  
   C) Disabling journaling without backup  

7. A common mistake after **`lvextend`** is:  
   A) Forgetting to grow the filesystem (`xfs_growfs` / `resize2fs`) so free space does not appear  
   B) Always shrinking ext4 online safely without checks  
   C) Mounting `/boot` twice for fun  

8. **Inode exhaustion** (`df -i` shows 100%) can cause:  
   A) “No space left” errors even when `df -h` shows free blocks  
   B) Faster CPU turbo  
   C) Automatic RAID expansion  

---

## Answer key

1. **B** · 2. **B** · 3. **A** · 4. **A** · 5. **A** · 6. **A** · 7. **A** · 8. **A**
