# Module: Boot process, kernel & modules

**Track:** Intermediate · **Module ID:** `int-boot`

## Overview

Trace boot from firmware through **GRUB2** and **initramfs**, manage kernel modules, capture **vmcore** after panics, and recover systems with rescue media.

## Learning objectives

- Contrast **UEFI** vs. **BIOS** paths; edit kernel cmdline and understand **dracut**/initramfs roles.
- Load/unload modules with **`modprobe`**; blacklist; compare **DKMS** vs. kmod packages.
- Configure **kdump** for crash dumps.
- Use live/rescue environments, **chroot**, and mounted roots for repair.

---

## Lesson 1: UEFI vs. BIOS boot; GRUB2 config, kernel cmdline, dracut/initramfs role

- **UEFI** boots via EFI System Partition and **`grubx64.efi`** (typical); **BIOS** uses MBR/stage loaders.
- **Kernel cmdline** in GRUB (`/etc/default/grub` → `grub2-mkconfig`) passes **root=**, **rd.*** dracut hints, **SELinux** switches.
- **initramfs** (dracut-built) loads drivers and pivots to real root—breakage here surfaces as **dracut** emergency shells.

## Lesson 2: `lsmod`, `modinfo`, `modprobe`, blacklist; DKMS vs. kmod packages

- **`lsmod`** shows loaded modules; **`modinfo`** metadata; **`modprobe`** resolves dependencies.
- **Blacklist** via **`/etc/modprobe.d/*.conf`** prevents autoload (e.g., conflicting drivers).
- **DKMS** rebuilds out-of-tree modules on kernel updates; distro **kmod** packages are simpler when available.

## Lesson 3: kdump / vmcore collection for post-mortem analysis

- **kdump** reserves crashkernel memory; secondary kernel captures **vmcore** after panic.
- Size **`crashkernel=`** appropriately; verify **`kdump.service`** and storage targets for large dumps.

## Lesson 4: Live/rescue media: `chroot`, mounting root for recovery

- Boot **rescue** ISO, **mount** root LV/partition under **`/mnt`**, bind **`dev`/`proc`/`sys`**, **`chroot /mnt`**.
- Reinstall **GRUB**, fix **`fstab`**, **dracut**, or **SELinux** contexts from within chroot—document steps.

## Lesson 5: Lab—`dracut -f`, `kernel-install`, initramfs inspection

- In a disposable VM, rebuild initramfs with **`dracut -f -v`** after adding a module config—watch include list.
- Compare **`kernel-install`** paths on systemd-boot vs GRUB hosts—know where UKIs or BLS snippets live.
- List **`lsinitrd`** contents for one image—find which **network** driver module is actually bundled.

## Lesson 6: Anti-patterns in boot recovery

- **Blind `rd.break` on production** without backout—easy to leave system unbootable.
- **Editing `grub.cfg` generator output** instead of **`/etc/default/grub`**—changes vanish on `grub-mkconfig`.
- **Skipping `chroot` bind mounts** (`/dev`, `/proc`, `/sys`)—`grub-install` fails mysteriously.

---

## Key takeaways

- **Initramfs issues** mimic “root not found”—verify UUIDs and host-only initqueue.
- **Module blacklists** are operational tools—track why each exists.

---

## Quiz

1. **GRUB2**’s role in Linux boot includes:  
   A) Loading the kernel and initial ramdisk per configuration  
   B) Running container orchestration  
   C) Managing ZFS pools exclusively  

2. **`modprobe`** differs from **`insmod`** mainly because **`modprobe`**:  
   A) Resolves module dependencies automatically  
   B) Never loads modules  
   C) Only lists PCI devices  

3. **kdump** is for:  
   A) Capturing memory dumps after kernel crashes for analysis  
   B) Live migrating VMs only  
   C) DNS caching  

4. **DKMS** is often used when:  
   A) Out-of-tree modules must be rebuilt across kernel updates  
   B) Formatting ext2 only  
   C) Configuring NTP stratum  

5. In recovery, **`chroot /mnt`** after bind-mounting **proc/sys/dev** lets you:  
   A) Run commands as if `/mnt` were the real root filesystem  
   B) Increase Wi-Fi speed only  
   C) Replace physical RAM  

6. **`dracut -f`** is commonly used to:  
   A) Regenerate the initramfs after driver/module or config changes  
   B) Resize swap files only  
   C) List Docker layers  

7. Editing **`/boot/grub2/grub.cfg`** directly (generator output) instead of **`/etc/default/grub`** is risky because:  
   A) The next `grub2-mkconfig` may overwrite your edits  
   B) It always improves boot time  
   C) It disables UEFI  

8. Inside a **rescue chroot**, forgetting to mount **`/dev`** and **`/proc`** often breaks:  
   A) Tools like `grub-install` that need device nodes and kernel interfaces  
   B) Only `ping` to localhost  
   C) Nothing—chroot never needs them  

---

## Answer key

1. **A** · 2. **A** · 3. **A** · 4. **A** · 5. **A** · 6. **A** · 7. **A** · 8. **A**
