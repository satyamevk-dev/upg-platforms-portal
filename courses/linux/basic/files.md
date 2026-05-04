# Module: Files & directories

**Track:** Basic · **Module ID:** `files`

## Overview

Create, copy, move, remove, and link files and directories safely; use `find` for basic searches.

## Learning objectives

- Create files and directory trees with `touch`, `mkdir`, and `mkdir -p`.
- Copy, move, and remove with `cp`, `mv`, and `rm` using safe flags.
- Explain hard links vs. symbolic links and when to use each.
- Run basic `find` queries by name and type.

---

## Lesson 1: `touch`, `mkdir`, `mkdir -p`, `rmdir` vs. `rm -r`

- **`touch`** updates timestamps or creates empty files.
- **`mkdir`** creates one directory; **`mkdir -p`** creates intermediate parents (idempotent for existing dirs).
- **`rmdir`** only removes **empty** directories; **`rm -r`** removes trees—**dangerous** without backups.
- Prefer **`rm -i`** interactively; avoid **`rm -rf`** on vague paths.

## Lesson 2: `cp`, `mv`, `rm` — safe habits

- **`cp -a`** archive mode (preserves metadata, recursive for dirs) on GNU `cp`.
- **`mv`** renames or moves within the same filesystem efficiently (same inode) when possible.
- **`rm`** never “goes to trash” by default—assume **permanent** deletion.

## Lesson 3: Hard links vs. symbolic links

- **Hard link:** same inode, multiple directory entries; cannot cross filesystems; deleting one link leaves data until link count hits zero.
- **Symbolic link:** special file pointing to a path; can cross filesystems; breaks if target moves/deletes.
- Create: **`ln target linkname`**, **`ln -s target linkname`**.

## Lesson 4: `find` basics

- **`find . -name '*.log'`** — name glob (quote to avoid shell expansion).
- **`find /var -type f -name 'messages*'`** — files only under `/var`.
- Add **`-maxdepth`** to limit traversal on large trees.

## Lesson 5: Lab—`rsync -n`, `install`, and dry runs

- Practice **`rsync -avn src/ dest/`** (dry run) before real copies—confirm trailing slash semantics (`src/` vs `src`).
- Use **`install -D -m 0644 file path`** in scripts for atomic-ish file placement with explicit mode.
- Pair **`find ... -print`** (or `-ls`) before any **`-delete`** experiment—verify matches on a busy tree.

## Lesson 6: Anti-patterns with files and links

- **`chmod -R 777`** “to fix permissions”—creates audit failures and risky world-writable trees.
- **Dangling symlinks** in deployment—services start but read empty/wrong configs silently.
- **`mv` across filesystems** expecting instant inode-preserving rename—falls back to copy+delete; plan disk space.

---

## Key takeaways

- **`rm -rf`** and careless `mv` cause outages—slow down and use absolute paths in runbooks.
- **Symlinks** are flexible; **hard links** are rare in day-to-day admin except for dedup awareness.

---

## Quiz

1. Which command creates parent directories as needed?  
   A) `mkdir` only  
   B) `mkdir -p`  
   C) `touch -p`  

2. A **symbolic link** can:  
   A) Only point to files on the same filesystem  
   B) Point to a path that may not exist yet  
   C) Never break after creation  

3. `rmdir` removes a directory only if:  
   A) It contains hidden files  
   B) It is empty  
   C) It is under `/tmp` only  

4. `find . -type f` finds:  
   A) Only directories  
   B) Only regular files  
   C) Only symlinks  

5. Hard links share:  
   A) Different inodes always  
   B) The same inode  
   C) Only file names, not data  

6. **`ln file1 file2` without `-s`** creates:  
   A) A symbolic link  
   B) A hard link (same inode, new directory entry)  
   C) A compressed archive  

7. Before **`find ... -delete`**, a disciplined first step is often:  
   A) Run the same predicate with `-print` or `-ls` and verify matches  
   B) Add `-delete` first to save time  
   C) `chmod 777` the mount point  

8. **`cp -a`** is especially valued for directory trees because it:  
   A) Skips metadata for speed  
   B) Recursively copies while preserving metadata (GNU archive mode)  
   C) Encrypts data in flight always  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B** · 6. **B** · 7. **A** · 8. **B**
