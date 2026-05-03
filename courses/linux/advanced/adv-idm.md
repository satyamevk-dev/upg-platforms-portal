# Module: Enterprise identity on Linux

**Track:** Advanced · **Module ID:** `adv-idm`

## Overview

Troubleshoot **SSSD** against **AD**/**IPA**, reason about **Kerberos** tickets and **keytabs**, engineer **PAM** stacks, and implement **sudoers**/**polkit** patterns for regulated **RBAC**.

## Learning objectives

- Operate **SSSD** domains, caches, and auth debugging.
- Explain **Kerberos** tickets, **keytabs**, and constrained delegation (conceptual).
- Deep dive **PAM** module ordering (**auth**, **account**, **session**, **password**).
- Design **sudoers**, **polkit**, and **RBAC** for enterprises.

---

## Lesson 1: SSSD: domains, caches, and troubleshooting auth against AD / IPA

- **`sssd.conf`** domains, **id_provider**, **auth_provider**—**sss_cache** tools clear stuck entries under change control.
- **Debug** levels produce verbose logs—sanitize; correlate with **Kerberos** **kinit**/**klist** tests.

## Lesson 2: Kerberos tickets, keytabs, and constrained delegation (conceptual)

- **TGT** vs. **service** tickets; **keytab** files hold long-lived keys for services—permissions **0400** and rotation matter.
- **Constrained delegation** limits which backends a service may impersonate toward—design with AD admins.

## Lesson 3: PAM stacks deep dive: auth, account, session, password modules

- **auth** proves identity; **account** checks policy; **password** changes secrets; **session** sets up environment/audit.
- **pam_sss**, **pam_unix**, **pam_faillock** ordering changes lockout behavior—test **su**, **ssh**, **sudo** separately.

## Lesson 4: sudoers, polkit, and RBAC patterns for regulated environments

- **sudoers** **Cmnd_Alias** granularity beats blanket **ALL**; deploy via **LDAP** or **SSSD sudo** provider where fit.
- **polkit** rules gate **DBus** actions—desktop services and some installers; peer-review **.rules** files.
- **RBAC** maps job functions to least privilege—recertify quarterly.

---

## Key takeaways

- **SSSD + PAM** issues are often **DNS**, **time skew**, or **cache**—check basics first.
- **sudo** sprawl is a compliance debt—automate reviews.

---

## Quiz

1. **SSSD** primarily provides:  
   A) Centralized identity integration and caching for Linux clients  
   B) ZFS pool management  
   C) GPU scheduling only  

2. A **keytab** file typically stores:  
   A) Long-lived Kerberos keys for services/hosts  
   B) SSH host banners only  
   C) GRUB passwords in plaintext always  

3. PAM **account** phase often enforces:  
   A) Policies like time-of-day, account expiration, and access restrictions  
   B) Only framebuffer resolution  
   C) Only RAID scrub schedules  

4. **polkit** governs:  
   A) Privileged actions over D-Bus / system services via policy rules  
   B) Only BGP peering  
   C) Only tape libraries  

5. **sudoers** should prefer:  
   A) Least-privilege command allowlists over broad `ALL` grants  
   B) `NOPASSWD: ALL` for every user  
   C) World-readable private keys  

---

## Answer key

1. **A** · 2. **A** · 3. **A** · 4. **A** · 5. **A**
