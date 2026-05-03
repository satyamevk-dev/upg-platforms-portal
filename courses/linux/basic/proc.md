# Module: Processes & services

**Track:** Basic · **Module ID:** `proc`

## Overview

Inspect running processes, send signals safely, understand job control basics, and interact with **systemd** units.

## Learning objectives

- Use `ps`, `pgrep`, and `top`/`htop` for visibility.
- Compare SIGTERM vs. SIGKILL and use `kill` appropriately.
- Describe foreground/background jobs and `nohup` at a high level.
- Check service status with `systemctl` and logs with `journalctl -u`.

---

## Lesson 1: `ps`, `pgrep`, `top` / `htop`

- **`ps aux`** or **`ps -ef`** — full listings (syntax varies by distro).
- **`pgrep -af pattern`** finds PIDs by name—script-friendly.
- **`top`** / **`htop`** — live CPU/memory; `htop` is interactive and user-friendly.

## Lesson 2: Signals — SIGTERM vs. SIGKILL; `kill` and `killall`

- **SIGTERM (15)** — polite shutdown; process can handle and clean up.
- **SIGKILL (9)** — cannot be caught; use only when stuck—may corrupt state.
- **`kill PID`**, **`kill -TERM PID`**, **`kill -KILL PID`**; **`killall`** by name (risky on shared hosts—prefer `pkill` with care).

## Lesson 3: Foreground, background, jobs, `nohup`

- **Foreground** blocks the shell; **background** with `&` returns prompt.
- **`jobs`**, **`fg`**, **`bg`** manage shell job table.
- **`nohup cmd &`** survives hangup—classic for long runs; modern alternative: **systemd user services** or **tmux/screen**.

## Lesson 4: systemd — `systemctl`, `journalctl -u`

- **`systemctl status unit`** — state, main PID, recent log lines.
- **`systemctl start|stop|restart|reload unit`** — lifecycle (needs privileges).
- **`journalctl -u unit -f`** — follow unit logs; **`--since`** for windows.

---

## Key takeaways

- Prefer **SIGTERM** and **service units** over **KILL** for operational maturity.
- **journalctl** is the first place to look when a service “won’t start.”

---

## Quiz

1. Which signal should you try **before** SIGKILL for a cooperative shutdown?  
   A) SIGSTOP  
   B) SIGTERM  
   C) SIGWINCH  

2. `pgrep` is especially useful for:  
   A) Formatting disks  
   B) Finding process IDs by name or pattern  
   C) Editing unit files  

3. `systemctl status sshd` typically shows:  
   A) Only disk free space  
   B) Service state, PID, and excerpt of recent logs  
   C) Kernel version only  

4. `nohup` is historically used to:  
   A) Prevent a process from receiving hangup on terminal disconnect (roughly)  
   B) Encrypt process memory  
   C) Raise process priority always  

5. SIGKILL is special because:  
   A) It can always be ignored by the process  
   B) It cannot be handled by the target process  
   C) It only affects zombie processes  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **A** · 5. **B**
