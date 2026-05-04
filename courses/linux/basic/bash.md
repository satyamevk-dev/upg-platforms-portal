# Module: Bash scripting introduction

**Track:** Basic · **Module ID:** `bash`

## Overview

Write small, maintainable Bash scripts: structure, variables, tests, control flow, functions, exit codes, and an overview of scheduling.

## Learning objectives

- Start scripts with a proper shebang and executable bit.
- Use variables, quoting, and tests (`[ ]` vs. `[[ ]]`).
- Implement conditionals, loops, functions, and meaningful exit codes.
- Compare `cron` and **systemd timers** for scheduling.

---

## Lesson 1: Shebang, `chmod +x`, running scripts

- First line: **`#!/usr/bin/env bash`** for portability vs. hard-coded `/bin/bash`.
- **`chmod +x script.sh`** then **`./script.sh`** (PATH doesn’t include `.` by design—use `./`).
- **`bash script.sh`** runs without execute bit—useful in CI.

## Lesson 2: Variables, quoting, tests

- **`name=value`** no spaces around `=`; **`export`** for children.
- **`[[ -f file ]]`** Bash built-in tests; **`[`** POSIX—mind closing `]` and quoting.
- Always quote variables unless you intend word splitting: `"$var"`.

## Lesson 3: Conditionals, loops, functions, exit codes

- **`if` / `elif` / `else`**, **`for`**, **`while`**, **`case`** for structured flow.
- **Functions** group logic; **`return`** for function status, **`exit n`** for script status.
- **`set -euo pipefail`** common strict mode—learn implications before global use in legacy scripts.

## Lesson 4: `cron` and systemd timers (overview)

- **`cron`** — table-driven schedules; mind **`PATH`**, timezone, and logging stderr.
- **systemd timers** — integrated logging, dependencies, and calendar expressions—prefer on systemd-only distros for new work.

## Lesson 5: Lab—`shellcheck`, `set -euo pipefail`, and traps

- Run **`shellcheck script.sh`** on a legacy script—fix one class of issues (quoting, shebang, unreachable code).
- Add **`trap 'echo failed at $LINENO' ERR`** temporarily while debugging—remove or narrow before merge.
- Document what **`set -e`** does *not* catch (some contexts in pipelines/subshells)—avoid blind faith.

## Lesson 6: Anti-patterns in shell automation

- **Parsing `ls` output**—use globs, `find -print0` + `read -r -d ''`, or JSON tools when data is structured.
- **Unquoted `$@` misuse** vs **`"$@"`**—subtle breakage when arguments contain spaces.
- **Silent `curl | bash`** in production—supply-chain and audit nightmare.

---

## Key takeaways

- **Quoting and exit codes** separate fragile hacks from reliable automation.
- Prefer **systemd timers** or **orchestrators** when cron sprawl grows.

---

## Quiz

1. A typical portable shebang for Bash is:  
   A) `#!/usr/bin/python3`  
   B) `#!/usr/bin/env bash`  
   C) `#!/bin/false`  

2. Why use `"$var"` instead of `$var`?  
   A) To prevent unintended word splitting and globbing  
   B) To make variables slower  
   C) To disable functions  

3. `exit 3` at the end of a script:  
   A) Always reboots the server  
   B) Returns status code 3 to the parent process  
   C) Deletes the script  

4. `[[ -d /tmp ]]` tests whether `/tmp` is:  
   A) A directory  
   B) A non-empty file  
   C) A network interface  

5. systemd **timers** are often preferred over cron when you want:  
   A) No logging  
   B) Integration with journald and dependency-aware scheduling  
   C) Guaranteed sub-second precision always  

6. **`set -u`** (nounset) causes an error when:  
   A) A variable is referenced before assignment  
   B) A function returns zero  
   C) `grep` finds no lines  

7. **ShellCheck** is primarily a:  
   A) Static analyzer/linter for shell scripts  
   B) Container registry scanner  
   C) Kernel crash dump tool  

8. On Debian/Ubuntu, **`/bin/sh`** is often **dash** (or another POSIX shell), meaning scripts with a **`#!/bin/sh`** shebang should:  
   A) Assume Bash-only extensions like `[[ ]]` freely  
   B) Stick to POSIX constructs unless you change the shebang to Bash explicitly  
   C) Always use `source` on `.bashrc` in cron  

---

## Answer key

1. **B** · 2. **A** · 3. **B** · 4. **A** · 5. **B** · 6. **A** · 7. **A** · 8. **B**
