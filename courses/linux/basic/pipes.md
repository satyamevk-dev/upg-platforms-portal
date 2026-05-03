# Module: Redirection & pipes

**Track:** Basic · **Module ID:** `pipes`

## Overview

Connect programs using standard streams: redirect I/O and build pipelines for powerful one-liners.

## Learning objectives

- Map stdin, stdout, stderr to file descriptors 0–2.
- Redirect output and errors with `>`, `>>`, `2>`, and `&>`.
- Build pipelines with `|` and understand data flow.
- Use `tee` to log and display simultaneously.

---

## Lesson 1: stdin, stdout, stderr (0–2)

- **0** = stdin, **1** = stdout, **2** = stderr.
- Many commands read stdin if no file arg (e.g. `wc` without operands).
- Errors often go to stderr so they aren’t swallowed by stdout-only pipes—merge carefully.

## Lesson 2: Redirecting with `>`, `>>`, `2>`, `&>`, here-docs

- **`>`** truncates and writes; **`>>`** appends.
- **`2>file`** redirects stderr; **`2>&1`** sends stderr to stdout’s target.
- **`&>file`** (Bash) redirects both stdout and stderr to file.
- **Here-doc:** `cat <<EOF ... EOF` feeds stdin inline—useful for scripts.

## Lesson 3: Pipelines (`|`)

- **`cmd1 | cmd2`** connects cmd1’s stdout to cmd2’s stdin.
- Only stdout flows by default—errors may still print to terminal unless redirected.
- Order matters: filter early to reduce data (`grep` before heavy `sort` when possible).

## Lesson 4: `tee`

- **`tee file`** writes stdin to **both** file and stdout—useful with sudo: `sudo tee /etc/...`.
- **`tee -a`** appends—mirrors `>>` behavior while still passing data down the pipe.

---

## Key takeaways

- **stderr handling** is critical in logging and cron jobs—lost errors mean silent failures.
- **Pipelines** compose small tools into powerful workflows (Unix philosophy).

---

## Quiz

1. File descriptor **2** is:  
   A) stdin  
   B) stdout  
   C) stderr  

2. `>>` typically:  
   A) Truncates then writes  
   B) Appends to a file  
   C) Deletes a file  

3. `2>&1` means:  
   A) Redirect stdin to stdout  
   B) Redirect stderr to wherever stdout is currently going  
   C) Discard all output  

4. In `grep x file | wc -l`, `wc` receives:  
   A) The original file bytes  
   B) Lines matching `grep` on stdout  
   C) Only stderr from grep  

5. `tee` is useful when you want to:  
   A) Only discard output  
   B) Write to a file and still pass data through the pipe  
   C) Encrypt streams  

---

## Answer key

1. **C** · 2. **B** · 3. **B** · 4. **B** · 5. **B**
