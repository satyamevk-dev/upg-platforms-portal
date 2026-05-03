import type { LinuxTopic } from "./linux-topic";

export const linuxIntermediateLibrary: LinuxTopic[] = [
  {
    id: "int-storage",
    major: "Storage & filesystems (advanced)",
    minors: [
      "blkid, lsblk, findmnt, and persistent mounts via /etc/fstab (UUID vs. labels)",
      "File-system types: ext4, XFS — mkfs, fsck, and mount options (noatime, quotas intro)",
      "LVM: physical volumes, volume groups, logical volumes; extend/reduce workflows",
      "Stratis & VDO awareness; swap: files vs. partitions; troubleshooting full disks",
    ],
  },
  {
    id: "int-mac",
    major: "SELinux & mandatory access control",
    minors: [
      "Enforcing vs. permissive; contexts (user, role, type) and ls -Z / ps -Z",
      "semanage, restorecon, chcon; booleans and semanage boolean -l",
      "Reading AVC denials; audit2why / setroubleshoot patterns",
      "AppArmor profiles vs. SELinux; when distros choose which stack",
    ],
  },
  {
    id: "int-net",
    major: "Advanced networking",
    minors: [
      "NetworkManager (nmcli) vs. legacy ifcfg; bonding/teaming concepts",
      "firewalld zones, rich rules; nftables/iptables relationship",
      "Static routes, policy routing basics; ss vs. netstat in depth",
      "tcpdump / Wireshark on hosts; DNS client debugging (systemd-resolved, /etc/hosts)",
    ],
  },
  {
    id: "int-perf",
    major: "Performance, tuning & resource limits",
    minors: [
      "tuned profiles; sysctl key examples (vm.*, net.*) and persistence",
      "CPU & I/O scheduling awareness; nice, ionice, chrt",
      "cgroups v2: slices, limits on CPU/memory; systemd resource controls",
      "vmstat, iostat, sar, pidstat; interpreting load average vs. CPU saturation",
    ],
  },
  {
    id: "int-logs",
    major: "Logging, auditing & tracing",
    minors: [
      "journalctl: boots, units, priority filters, persistent journal limits",
      "rsyslog rules, remote logging, and logrotate configuration patterns",
      "auditd: rules, ausearch, aureport (high-level enterprise use)",
      "strace, ltrace, perf top — when to use which for live troubleshooting",
    ],
  },
  {
    id: "int-ssh",
    major: "SSH hardening & privileged access",
    minors: [
      "sshd_config: ciphers, PermitRootLogin, AllowUsers, MaxAuthTries",
      "Key types, ssh-agent, forwarding pitfalls; certificate-based SSH (awareness)",
      "Jump hosts / bastions; Match blocks for role-based access",
      "PAM overview: how authentication stacks interact with SSH and sudo",
    ],
  },
  {
    id: "int-boot",
    major: "Boot process, kernel & modules",
    minors: [
      "UEFI vs. BIOS boot; GRUB2 config, kernel cmdline, dracut/initramfs role",
      "lsmod, modinfo, modprobe, blacklist; DKMS vs. kmod packages",
      "kdump / vmcore collection for post-mortem analysis",
      "Live/rescue media: chroot, mounting root for recovery",
    ],
  },
  {
    id: "int-auto",
    major: "Automation & image-based deployment",
    minors: [
      "Ansible: inventory, ad-hoc commands, playbooks, roles (structure only)",
      "Variables, handlers, idempotency; running against Linux hosts securely",
      "cloud-init and Kickstart/AutoInstall for repeatable builds",
      "GitOps / pipeline hooks to config management (conceptual map)",
    ],
  },
  {
    id: "int-containers",
    major: "Containers & workload isolation",
    minors: [
      "Namespaces and cgroups as foundation; containers vs. VMs",
      "Podman and Docker: images, registries, run, build; rootless containers",
      "Storage and networking modes; seccomp and capabilities (intro)",
      "systemd-nspawn / compose files — when teams pick each tool",
    ],
  },
  {
    id: "int-trouble",
    major: "Troubleshooting methodology & support data",
    minors: [
      "Structured triage: reproduce, isolate layer (hardware, network, app, OS)",
      "sosreport, supportconfig patterns for vendor cases",
      "Boot failures: emergency mode, rd.break, journal from previous boot",
      "Documenting findings: timelines, config diffs, and rollback plans",
    ],
  },
];
