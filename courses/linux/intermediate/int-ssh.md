# Module: SSH hardening & privileged access

**Track:** Intermediate · **Module ID:** `int-ssh`

## Overview

Harden **sshd**, manage keys and agents safely, design bastion patterns, and understand how **PAM** intersects SSH and **sudo**.

## Learning objectives

- Tune **`sshd_config`**: ciphers, `PermitRootLogin`, `AllowUsers`, `MaxAuthTries`.
- Compare key types, **ssh-agent** usage, forwarding risks, and SSH certificates (awareness).
- Apply **Match** blocks and jump host topologies.
- Explain **PAM** stack phases for authentication and session setup.

---

## Lesson 1: `sshd_config`: ciphers, `PermitRootLogin`, `AllowUsers`, `MaxAuthTries`

- Prefer modern **KexAlgorithms**, **Ciphers**, **MACs** per vendor baselines—test clients before production.
- **`PermitRootLogin prohibit-password`** (or `no`) reduces direct root exposure; use **sudo**/privilege tooling.
- **`AllowUsers`/`AllowGroups`** limit who may authenticate; **`MaxAuthTries`** slows brute force.

## Lesson 2: Key types, `ssh-agent`, forwarding pitfalls; certificate-based SSH (awareness)

- **ed25519** keys are default recommendation on current OpenSSH; know legacy **RSA** minimum sizes if required.
- **ssh-agent** avoids passphrase re-entry—protect agent sockets; **ForwardAgent** only to trusted admins/hosts.
- **SSH certificates** centralize trust—short-lived principals, **CA** signing—awareness for enterprise designs.

## Lesson 3: Jump hosts / bastions; `Match` blocks for role-based access

- **ProxyJump** / **JumpHost** patterns segment networks; combine with **MFA** at the edge.
- **`Match User`**, **`Match Address`** stanzas apply tighter options (e.g., no forwarding) to subsets.

## Lesson 4: PAM overview: how authentication stacks interact with SSH and `sudo`

- **PAM** modules chain for **auth**, **account**, **password**, **session**—order matters.
- **sshd** uses PAM when **`UsePAM yes`**; **sudo** consults PAM and **sudoers**—debug with **`pam_tty_audit`** only under change control.

## Lesson 5: Lab—`sshd -T`, host keys, and `Match` dry runs

- Run **`sshd -T`** as root to dump effective settings—compare to on-disk **`sshd_config`** and drop-ins.
- Rotate **host keys** in a lab: backup `/etc/ssh/ssh_host_*`, regenerate, update **known_hosts** story for clients.
- Add a **`Match Address`** stanza in staging only—verify **cipher** list and **PubkeyAuthentication** with **`ssh -vvv`**.

## Lesson 6: Anti-patterns in SSH operations

- **`ForwardAgent yes` to untrusted jump boxes**—agent theft across the chain.
- **Password auth left on** for automation accounts—keys + MFA at edge instead.
- **Editing live `sshd_config` without `sshd -t`**—syntax error locks you out on restart.

---

## Key takeaways

- **Least privilege** beats “SSH everywhere as root.”
- **Agent forwarding** is a supply-chain risk—default off unless required.

---

## Quiz

1. **`PermitRootLogin no`** primarily improves security by:  
   A) Preventing direct root SSH logins (policy still allows sudo workflows)  
   B) Disabling all users  
   C) Removing TLS  

2. **`AllowUsers`** is used to:  
   A) Restrict which local users may authenticate via SSH  
   B) List NFS exports  
   C) Configure swap  

3. **ProxyJump** / bastion patterns help:  
   A) Segment access through controlled choke points  
   B) Increase ARP timeouts only  
   C) Format disks faster  

4. **ssh-agent** mainly:  
   A) Holds decrypted private keys in memory to avoid repeated passphrase entry  
   B) Replaces `systemd`  
   C) Compiles kernels  

5. **PAM** “account” phase typically:  
   A) Checks whether the account is allowed to log in (time, expired, etc.) after auth modules  
   B) Draws graphics to the framebuffer only  
   C) Mounts SMB shares automatically always  

6. **`sshd -T`** is useful because it:  
   A) Dumps the effective configuration sshd would use after merging files and defaults  
   B) Deletes host keys  
   C) Only lists GPU PCI IDs  

7. **`ForwardAgent`** to an **untrusted** intermediate host is risky mainly because:  
   A) It can expose your agent’s keys to compromise on that hop  
   B) It always disables logging  
   C) It is required for `scp`  

8. Before reloading **sshd**, you should typically:  
   A) Run `sshd -t` (syntax test) and keep a second authenticated session open  
   B) Delete `/etc/passwd` for speed  
   C) Disable PAM globally  

---

## Answer key

1. **A** · 2. **A** · 3. **A** · 4. **A** · 5. **A** · 6. **A** · 7. **A** · 8. **A**
