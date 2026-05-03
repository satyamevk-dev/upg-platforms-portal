# Module: Shell & the command line

**Track:** Basic · **Module ID:** `shell`

## Overview

Build fluency with the terminal: how shells work, how commands are structured, and how history, environment variables, and aliases speed up daily work.

## Learning objectives

- Explain terminal vs. shell vs. prompt and login vs. non-login shells.
- Parse commands into command, options, and arguments with correct quoting.
- Use history, expansion, and tab completion safely.
- Manage `PATH`, environment variables, and aliases.

---

## Lesson 1: Terminal, shell, prompt, and login vs. non-login shells

- The **terminal** is the UI; the **shell** (often Bash) interprets commands.
- The **prompt** shows context (user, host, cwd); it is configurable via `PS1`.
- **Login shell:** started after authentication (reads profile files depending on distro). **Non-login interactive:** e.g. opening a terminal app—may read different init files.
- **Hands-on:** Echo `$0` and compare `bash -l` vs. `bash` (behavior differs by distro config).

## Lesson 2: Command structure: options, arguments, quoting

- Pattern: `command [options] [arguments]`. Options may be short (`-a`) or long (`--all`).
- **Quoting:** single quotes preserve literals; double quotes allow some expansion; backticks/old `$( )` run command substitution.
- Word splitting and globbing happen **before** the command runs—quoting prevents accidental splits.

## Lesson 3: History, expansion, and tab completion

- **History:** `history`, `!n`, `!!`, `Ctrl+R` reverse search—use carefully on shared systems (sensitive args).
- **Tab completion:** Bash programmable completion (`complete`); reduces typos.
- Disable or sanitize history in scripts that embed secrets (use environment or secret stores instead).

## Lesson 4: Environment variables, PATH, and aliases

- **Environment** is inherited by child processes; **shell variables** may be local unless `export`ed.
- **`PATH`:** ordered list of directories for command lookup; prepend trusted paths intentionally.
- **`alias`:** shortcut for commands; put persistent aliases in `~/.bashrc` or equivalent—document them for teammates.

---

## Key takeaways

- Quoting and **PATH hygiene** prevent subtle security and operational bugs.
- Know which **init files** your distro sources for login vs. interactive shells.

---

## Quiz

1. Which typically **interprets** your typed commands?  
   A) Terminal emulator only  
   B) Shell  
   C) Window manager  

2. In Bash, which quoting preserves **everything** literally?  
   A) Double quotes `"`  
   B) Single quotes `'`  
   C) No quotes  

3. `export VAR=value` mainly ensures:  
   A) The variable is stored only in the current function  
   B) Child processes inherit `VAR`  
   C) The variable is encrypted  

4. **`PATH`** is used to:  
   A) List mounted filesystems  
   B) Locate executable files  
   C) Define user passwords  

5. A **login shell** is best described as:  
   A) Any script run with `bash script.sh`  
   B) A shell session started as part of the login process (conceptually)  
   C) A shell with networking disabled  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **B** · 5. **B**
