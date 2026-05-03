import type { LinuxTopic } from "./linux-topic";

export type { LinuxTopic } from "./linux-topic";

export const linuxBasicsLibrary: LinuxTopic[] = [
  {
    id: "intro",
    major: "Linux introduction & distributions",
    minors: [
      "Linux vs. kernel vs. distribution",
      "Common enterprise distros (RHEL, Ubuntu, SUSE)",
      "Open-source licensing (GPL, upstream/downstream)",
      "Getting help: man, --help, info, vendor docs",
    ],
  },
  {
    id: "shell",
    major: "Shell & the command line",
    minors: [
      "Terminal, shell, prompt, and login vs. non-login shells",
      "Command structure: options, arguments, quoting",
      "History, expansion, and tab completion",
      "Environment variables, PATH, and aliases",
    ],
  },
  {
    id: "fs-nav",
    major: "Filesystem navigation",
    minors: [
      "Absolute vs. relative paths and special entries (. .. ~ -)",
      "pwd, cd, and working directory",
      "ls: listings, hidden files, human sizes, sorting",
      "FHS overview: /etc, /var, /home, /usr, /tmp, /opt",
    ],
  },
  {
    id: "files",
    major: "Files & directories",
    minors: [
      "touch, mkdir, mkdir -p; rmdir vs. rm -r",
      "cp, mv, rm: safe habits and interactive flags",
      "Hard links vs. symbolic links (ln, ln -s)",
      "find basics: -name, -type, depth limits",
    ],
  },
  {
    id: "text",
    major: "Text viewing & search",
    minors: [
      "cat, less, head, tail; following logs with tail -f",
      "grep: literals, -r, -n, basic regex",
      "sort, uniq, cut, wc for quick text stats",
      "Awareness of sed and awk for stream editing",
    ],
  },
  {
    id: "pipes",
    major: "Redirection & pipes",
    minors: [
      "stdin, stdout, stderr (file descriptors 0–2)",
      "Redirecting with >, >>, 2>, &>, and here-docs",
      "Pipelines (|) and combining commands",
      "tee to log and display at once",
    ],
  },
  {
    id: "perms",
    major: "Users, groups & permissions",
    minors: [
      "Reading rwx modes for files vs. directories",
      "chmod: symbolic and octal; recursive cautions",
      "chown and chgrp; ownership and umask",
      "sudo, su, and least-privilege patterns",
    ],
  },
  {
    id: "proc",
    major: "Processes & services",
    minors: [
      "ps, pgrep, top / htop for live metrics",
      "Signals: SIGTERM vs. SIGKILL; kill and killall",
      "Foreground, background, jobs, nohup (concept)",
      "systemd: systemctl status, journalctl -u",
    ],
  },
  {
    id: "net",
    major: "Networking fundamentals",
    minors: [
      "ip / ss (and legacy ifconfig / netstat where used)",
      "ping, traceroute / tracepath; reachability",
      "dig, nslookup, getent hosts; /etc/resolv.conf",
      "curl and wget for HTTP/S checks",
    ],
  },
  {
    id: "pkgs",
    major: "Software packages",
    minors: [
      "Debian family: apt, apt-cache, dpkg",
      "RHEL family: dnf, yum, rpm",
      "Repositories, signing, and update vs. upgrade",
      "Planning reboots after kernel / glibc updates",
    ],
  },
  {
    id: "bash",
    major: "Bash scripting introduction",
    minors: [
      "Shebang, chmod +x, and running scripts",
      "Variables, quoting, tests ([ ], [[ ]])",
      "Conditionals, loops, functions, exit codes",
      "cron / systemd timers for scheduling (overview)",
    ],
  },
];
