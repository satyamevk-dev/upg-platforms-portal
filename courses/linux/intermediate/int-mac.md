# Module: SELinux & mandatory access control

**Track:** Intermediate · **Module ID:** `int-mac`

## Overview

SELinux enforces policy beyond discretionary permissions. Learn modes, contexts, common fix workflows, AVC interpretation, and how AppArmor differs.

## Learning objectives

- Compare enforcing vs. permissive; read contexts with `ls -Z` and `ps -Z`.
- Use `semanage`, `restorecon`, `chcon`, and boolean management safely.
- Map AVC lines to likely fixes using `audit2why` / setroubleshoot patterns.
- Contrast AppArmor profiles with SELinux and typical distro choices.

---

## Lesson 1: Enforcing vs. permissive; contexts (user, role, type) and `ls -Z` / `ps -Z`

- **Enforcing** blocks violations; **permissive** logs but allows—use short windows for diagnosis, not as permanent posture.
- **Context** triples include **user:role:type** (and often level); **type** drives most policy decisions for services.
- **`ls -Z`**, **`ps -Z`**, **`id -Z`** show labels attached to files and processes.

## Lesson 2: `semanage`, `restorecon`, `chcon`; booleans and `semanage boolean -l`

- **`restorecon -Rv path`** reapplies spec file contexts—first-line fix after restores/copies.
- **`chcon`** is temporary; persistent changes belong in policy modules or **`semanage fcontext`** + `restorecon`.
- **Booleans** toggle whole policy knobs—inspect with **`semanage boolean -l`** and understand side effects.

## Lesson 3: Reading AVC denials; `audit2why` / setroubleshoot patterns

- **AVC denied** lines name **scontext** (source) and **tcontext** (target) and **tclass** (object class).
- **`audit2why`** translates denials into human hints (boolean? mislabeled file?).
- **setroubleshoot** (where installed) provides guided messages—still verify against policy intent.

## Lesson 4: AppArmor profiles vs. SELinux; when distros choose which stack

- **AppArmor** often path-centric profiles; **SELinux** richer type enforcement and MLS options.
- RHEL-family centers on **SELinux**; Ubuntu enables **AppArmor** by default—know both when supporting mixed estates.

---

## Key takeaways

- Prefer **`restorecon` + semanage fcontext** over endless `chcon`.
- **Never** permanently run enforcing services in permissive without a ticket and timeline.

---

## Quiz

1. In SELinux, **permissive** mode generally:  
   A) Logs denials but does not block them  
   B) Disables all auditing  
   C) Removes the kernel  

2. After restoring files from backup, a common first remediation for wrong contexts is:  
   A) `restorecon` on affected paths  
   B) `chmod 777` on `/`  
   C) Disabling networking globally  

3. **`semanage boolean -l`** helps you:  
   A) Inspect policy toggles and their descriptions  
   B) Format USB drives  
   C) List open TCP ports  

4. An **AVC** denial log line is primarily used to:  
   A) Understand which label tried which operation on which object  
   B) Measure disk temperature  
   C) Configure NTP  

5. Compared at a high level, **AppArmor** is often described as:  
   A) Profile-oriented, frequently path-based MAC  
   B) Identical internally to ext4  
   C) A DHCP server  

---

## Answer key

1. **A** · 2. **A** · 3. **A** · 4. **A** · 5. **A**
