# Module: Automation & image-based deployment

**Track:** Intermediate · **Module ID:** `int-auto`

## Overview

Use **Ansible** for idempotent configuration, seed systems with **cloud-init** and **Kickstart**/AutoInstall, and place **GitOps**/pipelines in context.

## Learning objectives

- Structure **inventory**, ad-hoc commands, **playbooks**, and **roles**.
- Apply **variables**, **handlers**, and idempotency; connect to hosts securely.
- Automate first boot with **cloud-init** and kickstart-style installers.
- Map **GitOps** and CI hooks to configuration management.

---

## Lesson 1: Ansible: inventory, ad-hoc commands, playbooks, roles (structure only)

- **Inventory** lists hosts/groups—INI or YAML; **dynamic inventory** for clouds.
- **Ad-hoc:** `ansible all -m ping`; **playbooks** declare ordered tasks; **roles** bundle reusable task/var/file trees.
- **ansible.cfg** sets defaults (remote user, key, forks).

## Lesson 2: Variables, handlers, idempotency; running against Linux hosts securely

- **Variables** layer: extra vars, host vars, group vars, role defaults—precedence matters.
- **Handlers** run once when notified—restart services only on real config change.
- **Idempotency:** modules return **changed** only when needed; avoid raw `command: curl | bash` patterns.

## Lesson 3: cloud-init and Kickstart/AutoInstall for repeatable builds

- **cloud-init** user-data configures users, packages, write_files, runcmd on first boot in clouds.
- **Kickstart** / **AutoInstall** unattended OS installs—versioned answer files in Git, tested on staging hardware/virt.

## Lesson 4: GitOps / pipeline hooks to config management (conceptual map)

- **Git** is source of truth; **pipeline** runs tests (**ansible-lint**, molecule) then promotes to prod controllers.
- **GitOps** controllers (concept) reconcile desired state—map to your org’s Kubernetes vs. VM workflows.

---

## Key takeaways

- **Idempotent playbooks** reduce midnight “rerun fixed it” mysteries.
- **Image + cloud-init + CM** composes modern fleet onboarding.

---

## Quiz

1. In Ansible, a **handler** typically:  
   A) Runs when notified, often once at the end of a play, to restart services after config changes  
   B) Encrypts disks automatically  
   C) Replaces `iptables`  

2. **Inventory** in Ansible is:  
   A) The list of managed hosts and their groupings  
   B) Only a kernel parameter  
   C) A type of RAID  

3. **cloud-init** is commonly used to:  
   A) Apply first-boot configuration in cloud and virtualization environments  
   B) Compile GCC  
   C) Manage BMC firmware only  

4. **Idempotency** means a playbook should:  
   A) Reach the desired state without unnecessary side effects on re-run  
   B) Always delete all data  
   C) Never use variables  

5. **Kickstart**/AutoInstall files primarily automate:  
   A) Unattended operating system installation choices  
   B) GPU overclocking  
   C) Email server greylisting  

---

## Answer key

1. **A** · 2. **A** · 3. **A** · 4. **A** · 5. **A**
