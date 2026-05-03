import type { LinuxTopic } from "./linux-topic";

export const linuxAdvancedLibrary: LinuxTopic[] = [
  {
    id: "adv-ebpf",
    major: "eBPF, tracing & dynamic observability",
    minors: [
      "Kernel tracing landscape: ftrace, perf, eBPF programs, and BCC/bpftrace",
      "Safe probes: kprobes/uprobes, ring buffers, and overhead trade-offs",
      "Reading flame graphs, off-CPU stacks, and latency histograms at scale",
      "When to escalate from strace to bpftrace for production incidents",
    ],
  },
  {
    id: "adv-storage",
    major: "Enterprise storage & data path",
    minors: [
      "Multipath (DM-Multipath), ALUA, and path failure behavior",
      "SAN basics: iSCSI initiator, FC WWNs, LUN discovery, and persistent naming",
      "LUKS full-disk and file-level encryption; clevis/tang for NBDE (awareness)",
      "NFS/SMB at scale: Kerberos mounts, pNFS concepts, and performance knobs",
    ],
  },
  {
    id: "adv-ha",
    major: "High availability & clustering",
    minors: [
      "Quorum, fencing (STONITH), and split-brain avoidance in shared-nothing designs",
      "Pacemaker / Corosync resource agents; constraints and ordering",
      "Floating IPs, VIPs, and application-aware health checks",
      "DR patterns: synchronous vs. asynchronous replication; RPO/RTO language",
    ],
  },
  {
    id: "adv-sec",
    major: "Hardening, compliance & threat-aware Linux",
    minors: [
      "CIS / STIG / DISA profiles; OpenSCAP scans and remediation baselines",
      "FIPS 140 mode implications for crypto stacks and packages",
      "AIDE / integrity monitoring; remote logging to immutable stores",
      "Kernel hardening: lockdown, ptrace scope, and seccomp-bpf in depth",
    ],
  },
  {
    id: "adv-net",
    major: "Advanced networking & overlays",
    minors: [
      "Linux as a router: policy routing, VRF-lite, and advanced iptables/nftables",
      "VXLAN / GENEVE overlays; bridging and tunnel endpoints on hosts",
      "Traffic control (tc): shaping, policing, and CAKE/FQ_CODEL awareness",
      "DPDK / XDP / AF_XDP: kernel bypass patterns and when teams adopt them",
    ],
  },
  {
    id: "adv-perf",
    major: "Systems performance engineering",
    minors: [
      "Methodology: USE, RED, and drill-down from symptoms to saturated resources",
      "CPU schedulers, NUMA, huge pages, and memory locality on large hosts",
      "Block layer: queue depth, I/O schedulers (mq-deadline, none), and NVMe",
      "Coordinated omission, benchmarking pitfalls, and reproducible load tests",
    ],
  },
  {
    id: "adv-idm",
    major: "Enterprise identity on Linux",
    minors: [
      "SSSD: domains, caches, and troubleshooting auth against AD / IPA",
      "Kerberos tickets, keytabs, and constrained delegation (conceptual)",
      "PAM stacks deep dive: auth, account, session, password modules",
      "sudoers, polkit, and RBAC patterns for regulated environments",
    ],
  },
  {
    id: "adv-virt",
    major: "Virtualization & bare-metal workloads",
    minors: [
      "KVM / QEMU / libvirt: CPU models, NUMA pinning, hugepages for guests",
      "SR-IOV, macvtap, and bridge vs. OVS for guest networking",
      "Live migration requirements: shared storage, CPU compatibility, timing",
      "Nested virt, device passthrough (VFIO), and firmware (UEFI) for VMs",
    ],
  },
  {
    id: "adv-k8s-node",
    major: "Kubernetes node & container runtime (OS view)",
    minors: [
      "kubelet, container runtime (containerd/CRI-O), and image pulls from the host",
      "CNI plugins on-node: bridges, iptables/nft rules, and DNS to pods",
      "cgroups v2 + systemd slices for kube-reserved / system-reserved",
      "Debugging from the node: crictl, journal of kubelet, and stuck mounts",
    ],
  },
  {
    id: "adv-platform",
    major: "Platform, firmware & out-of-band",
    minors: [
      "dmidecode, lspci, sensors; validating hardware inventory vs. reality",
      "IPMI / Redfish / BMC for power, serial console, and remote ISO mount",
      "Firmware updates: LVFS/fwupd vs. vendor tools; secure boot chain",
      "kexec / fast reboot; crashkernel sizing; post-mortem with vmcore analysis",
    ],
  },
];
