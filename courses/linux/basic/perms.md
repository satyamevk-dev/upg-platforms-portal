# Module: Users, groups & permissions

**Track:** Basic · **Module ID:** `perms`

## Overview

Read and set POSIX permissions, understand ownership and `umask`, and use `sudo` with a least-privilege mindset.

## Learning objectives

- Interpret `rwx` for files vs. directories.
- Apply `chmod` in symbolic and octal forms; avoid unsafe recursion.
- Use `chown` / `chgrp` and understand `umask` defaults.
- Explain `sudo` vs. `su` and why direct root login is discouraged.

---

## Lesson 1: Reading `rwx` modes for files vs. directories

- **Three triplets:** user (owner), group, others—each can be `r`, `w`, `x`.
- For **files:** `x` means executable. For **directories:** `x` means **enter/search**; `r` lists names; `w` creates/deletes entries (subject to sticky bits on shared dirs).

## Lesson 2: `chmod` — symbolic and octal; recursive cautions

- **Symbolic:** `chmod u+x`, `go-w`, `a+r`. **Octal:** `chmod 750 dir` (rwx/r-x/---).
- **`chmod -R`** can lock you out or expose secrets—test on a copy first; prefer Ansible/playbooks with review.

## Lesson 3: `chown`, `chgrp`, `umask`

- **`chown user:group file`** changes owner and group (often requires root).
- **`umask`** subtracts from default creation modes (e.g. `022` yields `755` dirs / `644` files commonly).
- World-writable files (`o+w`) are red flags on servers.

## Lesson 4: `sudo`, `su`, and least privilege

- **`sudo`** runs one command as another user (often root) with audit trail.
- **`su -`** starts a login shell as target user—use sparingly; prefer `sudo -i` with policy.
- Grant **minimal** sudo rules (specific commands, not blanket NOPASSWD ALL).

---

## Key takeaways

- **Directory execute** is not the same as file execute—misunderstanding breaks `cd` and services.
- **Recursive chmod/chown** belongs in change windows with backups.

---

## Quiz

1. For a **directory**, permission `x` for others means:  
   A) Others can delete the directory itself always  
   B) Others can traverse (enter) the directory if name is known  
   C) Others can list all files without `r`  

2. `chmod 640 file` typically gives:  
   A) rw-r-----  
   B) rwxrwxrwx  
   C) rw-------  

3. Which `umask` typically yields the **most permissive** default for “others” on newly created files (given the same base creation mode)?  
   A) `077`  
   B) `027`  
   C) `000`  

4. `sudo` is preferred over shared root passwords because:  
   A) It disables logging  
   B) It supports per-user audited privilege elevation  
   C) It removes the need for user accounts  

5. `chown alice:dev file` changes:  
   A) Only the group  
   B) Owner to `alice` and group to `dev`  
   C) Only the owner  

---

## Answer key

1. **B** · 2. **A** · 3. **C** · 4. **B** · 5. **B**