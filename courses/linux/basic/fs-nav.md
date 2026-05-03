# Module: Filesystem navigation

**Track:** Basic · **Module ID:** `fs-nav`

## Overview

Navigate the Linux directory tree confidently: paths, the working directory, listing files, and the Filesystem Hierarchy Standard (FHS).

## Learning objectives

- Use absolute vs. relative paths and special entries `.`, `..`, `~`, `-`.
- Change and display the working directory with `cd` and `pwd`.
- List directory contents with `ls` and common options.
- Map major FHS directories to their roles.

---

## Lesson 1: Absolute vs. relative paths and special entries

- **Absolute** paths start at root `/`; **relative** paths start from the current working directory.
- `.` = current directory; `..` = parent; `~` = current user’s home (or `~user`); `-` with `cd` = previous directory (shell feature).
- **Hands-on:** From `/tmp`, `cd ../var/log` vs. `cd /var/log`.

## Lesson 2: `pwd` and `cd`

- **`pwd`** prints working directory (`-P` resolves symlinks on many systems).
- **`cd`** without args often goes home; `cd -` toggles last directory.
- Avoid spaces in path names in scripts without quoting; prefer `mkdir "My Dir"` or underscores.

## Lesson 3: `ls`: listings, hidden files, human sizes, sorting

- **`ls -a`** shows hidden (dotfiles); **`-l`** long listing; **`-h`** human-readable sizes with **`-l`**.
- **`-t`** sort by time; **`-S`** by size; **`-r`** reverse.
- **Color output** is often an alias—know plain `ls` behavior for scripts (`ls --color=auto` may differ).

## Lesson 4: FHS overview

- **`/etc`** — system configuration. **`/var`** — variable data (logs, spool). **`/home`** — user homes. **`/usr`** — read-only user programs and libraries. **`/tmp`** — temporary (often cleaned on reboot). **`/opt`** — add-on software packages.
- **`/bin`**, **`/sbin`**, **`/usr/bin`**, **`/usr/sbin`** — essential vs. general commands (modern distros may merge via symlinks).

---

## Key takeaways

- **Paths and quoting** are the #1 source of beginner errors in automation.
- **FHS** helps you guess *where* to look for logs and configs.

---

## Quiz

1. Which path is **absolute**?  
   A) `documents/report.txt`  
   B) `/home/alice/report.txt`  
   C) `./report.txt`  

2. Which directory typically holds **system-wide configuration**?  
   A) `/tmp`  
   B) `/etc`  
   C) `/proc`  

3. `ls -lah` combines:  
   A) List all files, long format, human sizes  
   B) List only symlinks  
   C) Delete hidden files  

4. `..` refers to:  
   A) The root directory only  
   B) The parent directory  
   C) The user’s home  

5. Variable data such as logs usually lives under:  
   A) `/usr`  
   B) `/var`  
   C) `/boot`  

---

## Answer key

1. **B** · 2. **B** · 3. **A** · 4. **B** · 5. **B**
