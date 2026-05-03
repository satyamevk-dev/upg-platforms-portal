# Module: Software packages

**Track:** Basic · **Module ID:** `pkgs`

## Overview

Install and query packages on Debian- and RHEL-family systems, understand repositories and signing, and plan reboots after critical updates.

## Learning objectives

- Use `apt`/`dpkg` on Debian derivatives.
- Use `dnf`/`yum`/`rpm` on RHEL derivatives.
- Explain repositories, GPG signing, and update vs. upgrade semantics.
- Identify updates that require reboots (kernel, glibc, shared libs).

---

## Lesson 1: Debian family — `apt`, `apt-cache`, `dpkg`

- **`apt update`** refreshes index; **`apt install pkg`**, **`apt remove`**.
- **`apt-cache search`**, **`show`** for metadata.
- **`dpkg -l`**, **`dpkg -L pkg`** for low-level installed file lists.

## Lesson 2: RHEL family — `dnf`, `yum`, `rpm`

- **`dnf install`**, **`dnf update`**, **`dnf repoquery`** (tooling varies by version).
- **`rpm -qa`**, **`rpm -ql pkg`** — query installed RPM database.
- On older systems **`yum`** may still be a symlink to **`dnf`**.

## Lesson 3: Repositories, signing, update vs. upgrade

- **Repositories** are versioned package collections; mixing wrong repos breaks dependencies.
- **Signing** (GPG) proves package integrity—disable signature checks only in emergencies with explicit risk acceptance.
- **`update`** refreshes metadata; **`upgrade`**/`dist-upgrade` applies package changes—read release notes before major jumps.

## Lesson 4: Planning reboots

- **New kernel** almost always needs reboot to run it.
- **glibc**, **OpenSSL**, or widely linked libraries may require service restarts or full reboot for all processes to pick up changes.
- Use **`needs-restarting`** (RHEL) or vendor guidance; schedule maintenance windows.

---

## Key takeaways

- **Know your family** (deb vs. rpm) before following random internet commands.
- **Reboot planning** is part of patching, not an afterthought.

---

## Quiz

1. On Debian-style systems, refreshing the package index is typically:  
   A) `apt update`  
   B) `rpm -qf`  
   C) `fdisk -l`  

2. `rpm -qa` lists:  
   A) All installed RPM packages  
   B) All running processes  
   C) All kernel modules  

3. Package **signing** mainly helps:  
   A) Speed up downloads only  
   B) Verify authenticity/integrity of packages  
   C) Disable dependencies  

4. After installing a **new kernel** package, you generally:  
   A) Never reboot  
   B) Reboot (or explicitly kexec where supported) to run the new kernel  
   C) Only run `ls`  

5. `dpkg -L nginx` shows:  
   A) Files installed by package `nginx`  
   B) Network listeners  
   C) User accounts  

---

## Answer key

1. **A** · 2. **A** · 3. **B** · 4. **B** · 5. **A**
