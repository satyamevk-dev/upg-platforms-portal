# Module: Text viewing & search

**Track:** Basic · **Module ID:** `text`

## Overview

View, search, and summarize text efficiently—essential for logs, configs, and command output.

## Learning objectives

- Use `cat`, `less`, `head`, and `tail` appropriately; follow logs with `tail -f`.
- Search with `grep` using literals and simple regex.
- Chain `sort`, `uniq`, `cut`, and `wc` for quick stats.
- Know when `sed` and `awk` are the right tools.

---

## Lesson 1: `cat`, `less`, `head`, `tail`, `tail -f`

- **`cat`** concatenates to stdout—fine for small files; avoid huge files (use `less`).
- **`less`** paginates forward/backward; search with `/pattern`.
- **`head`/`tail`** show line limits; **`tail -f`** follows growing files (logs); **`tail -F`** retries if file rotates.

## Lesson 2: `grep`

- **`grep pattern file`**, **`-r`** recursive, **`-n`** line numbers, **`-i`** ignore case.
- **Basic regex:** `.` any char, `*` quantifier, `^` start, `$` end—mind quoting: `grep '^ERROR' app.log`.

## Lesson 3: `sort`, `uniq`, `cut`, `wc`

- **`sort`** orders lines; **`sort -u`** unique sort; pipe to **`uniq`** after sort for duplicate collapse.
- **`cut -d: -f1`** field extraction (e.g. `/etc/passwd`).
- **`wc -l`** line counts—great for quick volume checks.

## Lesson 4: Awareness of `sed` and `awk`

- **`sed`** stream edits (substitute, delete ranges)—non-interactive transforms.
- **`awk`** column-oriented processing and small programs—ideal for structured logs.
- Prefer **version control + editor** for complex config edits; use `sed` in automation with care.

## Lesson 5: Lab—`grep -E`, context flags, and `tail -F`

- Use **`grep -E 'ERR|WARN'`** on a sample log—then add **`-n`** and **`-C2`** for context around hits.
- Compare **`tail -f`** vs **`tail -F`** while **`logrotate`** runs (or simulate rename)—see why `-F` follows the same logical file.
- Pipe **`journalctl -u unit --no-pager | head`** vs reading the journal file directly—know when pagination matters.

## Lesson 6: Anti-patterns in log triage

- **`grep` on multi-GB files** without **time bounds** or **filters**—loads disks and hides signal in noise.
- **`cat file | grep`** when **`grep pattern file`** suffices—extra process and I/O for no gain.
- **Regex from the internet** on production logs without testing—ReDoS and accidental broad matches.

---

## Key takeaways

- **Pagination** (`less`) saves you from flooding terminals and overloading systems.
- **grep + tail** is the bread and butter of first-line log triage.

---

## Quiz

1. Best tool to **interactively** read a large file?  
   A) `cat`  
   B) `less`  
   C) `touch`  

2. `tail -f` is used to:  
   A) Delete the last lines  
   B) Watch new lines appended to a file  
   C) Sort a file  

3. `grep -r 'TODO' src/` searches:  
   A) Only the current directory non-recursively  
   B) Recursively under `src/`  
   C) Only binary files  

4. `uniq` typically requires input to be:  
   A) Random order  
   B) Sorted for predictable duplicate collapsing  
   C) Encrypted  

5. `wc -l` reports:  
   A) Word count only  
   B) Line count  
   C) File size in bytes only  

6. **`grep -n`** adds to each matching line:  
   A) Binary NUL bytes  
   B) Line numbers  
   C) Automatic email alerts  

7. **`tail -F`** differs from **`tail -f`** mainly because **`-F`**:  
   A) Retries following the file after rename/rotation when it reappears  
   B) Deletes the file after reading  
   C) Only works on binary files  

8. Using **`grep pattern file`** instead of **`cat file | grep pattern`** is often preferred because:  
   A) It avoids an unnecessary `cat` process and redundant I/O  
   B) It always disables regex  
   C) It requires root  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B** · 6. **B** · 7. **A** · 8. **A**
