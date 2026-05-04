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

## Lesson 5: Lab—`systemctl cat`, drop-ins, and cgroup hints

- Run **`systemctl cat sshd`** (or `nginx`)—see main unit + fragments; practice adding a **`systemctl edit --full`** workflow only in lab.
- Inspect **`systemctl show -p FragmentPath,DropInPaths`**—know where the effective config came from.
- Use **`systemd-cgls`** briefly—relate **user.slice** vs **system.slice** vs service scopes on a busy host.

## Lesson 6: Anti-patterns with processes and services

- **`kill -9` first**—skips graceful shutdown; corrupts databases and leaves stale sockets.
- **Editing vendor unit files in `/usr`**—overwritten on upgrade; use **drop-ins** in `/etc/systemd/system/*.d/`.
- **Ignoring `systemctl --failed`** after maintenance—silent partial outages.

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

6. After editing a systemd **unit drop-in**, you typically need:  
   A) `systemctl daemon-reload` before `restart` picks up changes  
   B) Only `reboot` always—reload never works  
   C) `fdisk` on `/var`  

7. A **zombie** (`Z`) process entry remains until:  
   A) The parent reaps the terminated child via `wait`  
   B) You rename `/etc/passwd`  
   C) `ping` succeeds  

8. **`systemctl --failed`** is useful to:  
   A) List units in a failed state for quick post-change triage  
   B) Format USB drives  
   C) Show only kernel threads  

---

## Answer key

1. **B** · 2. **B** · 3. **B** · 4. **A** · 5. **B** · 6. **A** · 7. **A** · 8. **A**
