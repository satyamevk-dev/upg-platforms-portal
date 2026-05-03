import type { ModuleQuizItem } from "@/lib/exercise-details-json";
import type { LearningTrackLevel } from "@/lib/module-dynamic-training-content";

const QCOUNT = 25;

type QA = { stem: string; right: string; wrong: [string, string, string] };

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleChoices<T>(items: T[], rng: () => number): { ordered: T[]; correctIndex: number } {
  const correct = items[0];
  const rest = items.slice(1);
  const pool = [correct, ...rest];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const correctIndex = pool.indexOf(correct);
  return { ordered: pool, correctIndex };
}

/** Foundational misconceptions vs facts: kernel vs distro, identity commands, roles. */
const BASIC_BANK: QA[] = [
  {
    stem: 'In strict technical usage, the name “Linux” most accurately refers to:',
    right: 'The open-source operating system kernel.',
    wrong: [
      'A complete desktop environment by itself.',
      'The GNU Compiler Collection only.',
      'A single vendor’s proprietary firmware blob.',
    ],
  },
  {
    stem: 'Which best describes a Linux distribution (“distro”)?',
    right: 'A curated product combining the kernel with userspace, packages, policies, and tooling.',
    wrong: [
      'The upstream kernel git repository alone.',
      'Only cloud-hosted hypervisors.',
      'A compatibility layer for Windows drivers.',
    ],
  },
  {
    stem: 'On many Linux systems, which file commonly identifies the distribution name and version?',
    right: '/etc/os-release',
    wrong: ['/etc/fstab', '/proc/cpuinfo', '~/.bash_history'],
  },
  {
    stem: 'The command `uname -r` primarily reports:',
    right: 'The kernel release / version string.',
    wrong: ['The marketing name of the distro.', 'The installed CPU model name only.', 'The default gateway IP address.'],
  },
  {
    stem: 'Two servers both run “Linux.” What most often explains operational differences beyond kernel version?',
    right: 'Different userspace stacks, packaging, defaults, and vendor policies.',
    wrong: [
      'They must behave identically if both use bash.',
      'Only the hostname differs.',
      'Distributions cannot change anything except wallpaper.',
    ],
  },
  {
    stem: 'The Linux kernel is principally responsible for:',
    right: 'CPU scheduling, memory management, devices, and exposing system calls.',
    wrong: [
      'Rendering all desktop icons.',
      'Hosting only container images.',
      'Replacing the motherboard firmware.',
    ],
  },
  {
    stem: 'User-space programs access kernel features mainly through:',
    right: 'System calls (the kernel’s controlled interface).',
    wrong: [
      'Editing GRUB configuration only.',
      'Writing directly to RAM chips without the kernel.',
      'Replacing files under /var/log only.',
    ],
  },
  {
    stem: 'Red Hat Enterprise Linux (RHEL) is best characterized as:',
    right: 'An enterprise-oriented distribution with long maintenance and vendor support.',
    wrong: [
      'The Linux kernel sources maintained by Linus Torvalds.',
      'A programming language runtime.',
      'A mandatory desktop theme package.',
    ],
  },
  {
    stem: 'Ubuntu is best described as:',
    right: 'A widely used Linux distribution with its own releases and tooling.',
    wrong: ['The official kernel documentation tarball.', 'A network routing protocol.', 'A mandatory hypervisor product.'],
  },
  {
    stem: 'Fedora is often described as:',
    right: 'A faster-moving community distro in the RHEL technology family.',
    wrong: ['An obsolete Android distribution.', 'A DNS record type.', 'A tape archive utility like tar.'],
  },
  {
    stem: 'GNU core utilities and shells shipped by a distro are part of:',
    right: 'The userspace software curated by that distribution.',
    wrong: [
      'Kernel ring-0 interrupt vectors only.',
      'CPU microcode exclusively.',
      'The bootloader without any userspace.',
    ],
  },
  {
    stem: 'Package managers (`dnf`, `apt`, `zypper`, …) primarily manage:',
    right: 'Installing, upgrading, and removing distribution-packaged software.',
    wrong: [
      'Rewriting kernel source in memory.',
      'Assigning MAC addresses only.',
      'Encrypting TLS certificates only.',
    ],
  },
  {
    stem: 'Why might two containers on “Linux” differ in available syscalls?',
    right: 'Kernel version/features and host configuration determine syscall availability.',
    wrong: [
      'Containers replace the kernel entirely.',
      'Syscalls come from `/etc/os-release` text.',
      'Containers never share the host kernel.',
    ],
  },
  {
    stem: 'Which statement about kernels and distributions is accurate?',
    right: 'Vendors choose which kernel versions, patches, and support timelines to ship.',
    wrong: [
      'Every distro runs identical unmodified upstream forever.',
      'Kernel updates never affect drivers.',
      'The kernel has no role in hardware enablement.',
    ],
  },
  {
    stem: '`/proc/version` typically reflects:',
    right: 'Information about the running kernel build.',
    wrong: ['Only the laptop OEM sticker text.', 'Installed Python wheels.', 'SSH `authorized_keys` entries.'],
  },
  {
    stem: 'A vendor “Long Term Support (LTS)” Linux release usually emphasizes:',
    right: 'Extended maintenance suitable for production environments.',
    wrong: [
      'Removing security patches immediately.',
      'Deleting package managers.',
      'Replacing Linux with a non-Linux kernel.',
    ],
  },
  {
    stem: 'Most peripheral drivers run:',
    right: 'In kernel space (often as modules loaded into the kernel).',
    wrong: [
      'Only as Python scripts in `/usr/local/bin`.',
      'Only inside systemd-journald.',
      'Only in userspace without kernel involvement.',
    ],
  },
  {
    stem: 'The bootloader’s relationship to the kernel is to:',
    right: 'Load the kernel into memory and start it.',
    wrong: [
      'Replace the scheduler entirely.',
      'Store `/etc/os-release` exclusively.',
      'Compile all userspace packages.',
    ],
  },
  {
    stem: 'Which pair best contrasts kernel space and user space?',
    right: 'Kernel space runs privileged OS core code; user space runs apps using kernel services.',
    wrong: [
      'They are identical memory regions.',
      'User space includes CPU microcode exclusively.',
      'Kernel space refers only to shell aliases.',
    ],
  },
  {
    stem: '“Upstream kernel” usually refers to:',
    right: 'Mainline Linux kernel development before distro vendors adapt it.',
    wrong: [
      'Only the vendor field in `/etc/os-release`.',
      'Documentation bundled with LibreOffice.',
      'Floppy-disk drivers from the 1990s only.',
    ],
  },
  {
    stem: 'Which pair helps distinguish kernel identity from distro branding on a host?',
    right: '`uname -r` versus reading `/etc/os-release`.',
    wrong: ['`ping` versus `traceroute`.', '`chmod` versus `chown` without context.', '`ls` versus `cat` always.'],
  },
  {
    stem: 'SELinux or AppArmor are integrated as:',
    right: 'Distribution-managed mandatory access controls built on kernel hooks.',
    wrong: [
      'Pure BIOS password prompts unrelated to Linux.',
      'GPU shader compilers.',
      'Swap-partition sizing tools only.',
    ],
  },
  {
    stem: 'Different distributions may ship different default init systems because:',
    right: 'Maintainers integrate different userspace stacks atop the same kernel interface.',
    wrong: [
      'Init systems replace the Linux kernel.',
      'Init systems are globally identical by law.',
      'Init systems exist only on macOS.',
    ],
  },
  {
    stem: 'For operators, knowing kernel vs distribution boundaries helps when:',
    right: 'Planning kernel/driver upgrades versus application package updates.',
    wrong: [
      'Claiming kernels never appear in incidents.',
      'Assuming distributions publish no release notes.',
      'Ignoring package managers entirely.',
    ],
  },
  {
    stem: 'Which scenario mixes up “kernel change” vs “distribution package change”?',
    right: 'Installing a vendor kernel package vs installing a userspace library without reboot.',
    wrong: ['Editing `~/.bashrc` vs changing wallpaper.', 'Renaming a host vs DNS TTL.', 'YAML vs JSON formatting only.'],
  },
];

/** Vendor kernels, backports, ABI boundaries, operational distinctions. */
const INTERMEDIATE_BANK: QA[] = [
  {
    stem: 'Compared to vanilla upstream, an enterprise vendor kernel often includes:',
    right: 'Backported fixes and hardware enablement on a stable baseline.',
    wrong: [
      'Only renamed kernel symbols with zero patches.',
      'Removal of all loadable modules.',
      'Identical bit-for-bit source to every rolling distro.',
    ],
  },
  {
    stem: 'glibc and dynamic linking primarily depend on:',
    right: 'A compatible kernel userspace ABI and syscall behavior.',
    wrong: [
      'The wallpaper theme only.',
      'DNS resolver configuration only.',
      'SSH port numbers only.',
    ],
  },
  {
    stem: 'Why might two servers with similar `uname -r` strings still differ in behavior?',
    right: 'Vendors carry different patch queues on top of similar version strings.',
    wrong: [
      'Kernel strings fully describe all patches.',
      '`uname` reports package versions.',
      'Behavior cannot differ if the string matches.',
    ],
  },
  {
    stem: 'systemd vs SysV init differences are mainly:',
    right: 'Distribution-level integration choices atop the Linux kernel.',
    wrong: [
      'Kernel scheduler algorithms.',
      'CPU microcode revisions.',
      'TLS cipher suites only.',
    ],
  },
  {
    stem: 'Containers on Linux share:',
    right: 'The host kernel while isolating userspace resources.',
    wrong: [
      'Independent kernels per container by default.',
      'No kernel involvement.',
      'Only Windows kernels.',
    ],
  },
  {
    stem: 'eBPF programs require:',
    right: 'Kernel support and appropriate privileges/caps on the host.',
    wrong: [
      'Only changes to `/etc/os-release`.',
      'Disabling the Linux kernel.',
      'A non-Linux hypervisor.',
    ],
  },
  {
    stem: 'Kernel modules (`.ko`) extend:',
    right: 'Kernel functionality such as device drivers or filesystems.',
    wrong: [
      'Only static HTML documentation.',
      'Package manager databases only.',
      'Shell alias tables only.',
    ],
  },
  {
    stem: 'Rolling-release vs fixed-point distributions mainly differ in:',
    right: 'How aggressively userspace and kernel packages move forward over time.',
    wrong: [
      'Whether they use TCP/IP.',
      'Whether they have a kernel.',
      'Whether files exist.',
    ],
  },
  {
    stem: 'Enterprise distros often publish:',
    right: 'Explicit lifecycle dates for major versions and hardware compatibility.',
    wrong: [
      'Kernel sources only via fax.',
      'No documentation of changes.',
      'Identical lifetimes for every rolling distro.',
    ],
  },
  {
    stem: '`sysctl` tunables typically adjust:',
    right: 'Kernel runtime parameters exposed via procfs/sysfs interfaces.',
    wrong: [
      'Only desktop icon sizes.',
      'Only apt repository URLs.',
      'Only user crontabs.',
    ],
  },
  {
    stem: 'SELinux enforcement modes are configured at:',
    right: 'Distribution policy layers using kernel LSM hooks.',
    wrong: [
      'GPU firmware blobs only.',
      'CSV files in `/tmp` only.',
      'BIOS passwords without Linux involvement.',
    ],
  },
  {
    stem: 'When comparing Ubuntu LTS and interim releases, expect:',
    right: 'Different cadence and support windows for the same Linux ecosystem.',
    wrong: [
      'No difference in kernel involvement.',
      'LTS means “no kernel”.',
      'Interim releases cannot ship kernels.',
    ],
  },
  {
    stem: 'ABI stability promises (e.g., kABI on RHEL-like systems) matter for:',
    right: 'Third-party kernel modules and driver compatibility across updates.',
    wrong: [
      'Font rendering in browsers only.',
      'DNS recursion depth only.',
      'SSH host key formats only.',
    ],
  },
  {
    stem: 'Firmware blobs needed by drivers are often delivered via:',
    right: 'Distribution packages or vendor updates coordinated with kernel modules.',
    wrong: [
      'Only editing `/etc/hosts`.',
      'Only Python pip installs.',
      'Only swapoff commands.',
    ],
  },
  {
    stem: 'Network namespaces in Linux are a:',
    right: 'Kernel feature used by containers and advanced networking stacks.',
    wrong: [
      'Pure userspace simulation with no kernel support.',
      'Windows-only feature.',
      'Feature of `/etc/os-release` parsing.',
    ],
  },
  {
    stem: 'Why read vendor release notes after `uname -r` changes?',
    right: 'Patch sets and known issues are not fully captured by the short release string.',
    wrong: [
      'Release notes duplicate `uname` exactly.',
      'Kernel updates never affect drivers.',
      'Strings fully enumerate CVE fixes.',
    ],
  },
  {
    stem: 'Initramfs/initrd images mainly help:',
    right: 'Bootstrapping userspace early enough to mount root and hand off to init.',
    wrong: [
      'Replace the kernel entirely.',
      'Host only Python apps.',
      'Configure only Wi-Fi SSIDs.',
    ],
  },
  {
    stem: 'Disk I/O schedulers and block layers live:',
    right: 'In the kernel path between applications and storage hardware.',
    wrong: [
      'Only inside LibreOffice.',
      'Only in `.bashrc`.',
      'Only on macOS hosts.',
    ],
  },
  {
    stem: 'Cross-distro portability issues often trace to:',
    right: 'Different library versions, defaults, and kernel feature flags.',
    wrong: [
      'Identical kernels guaranteeing identical apps.',
      'Distros sharing zero kernel code.',
      'Kernels not exposing syscalls.',
    ],
  },
  {
    stem: 'Hardware enablement (HWE) stacks can deliver:',
    right: 'Newer kernels/drivers on an otherwise stable distro baseline.',
    wrong: [
      'Only cosmetic themes.',
      'Removal of all modules.',
      'Non-Linux kernels.',
    ],
  },
  {
    stem: 'cgroups are primarily a:',
    right: 'Kernel mechanism to control resource usage for processes/groups.',
    wrong: [
      'Package signing standard.',
      'Desktop icon layout format.',
      'YAML linter.',
    ],
  },
  {
    stem: 'Tracing tools (perf, ftrace) rely on:',
    right: 'Kernel instrumentation and access controls.',
    wrong: [
      'Only parsing `/etc/os-release`.',
      'Only Java bytecode.',
      'Disabling system calls globally.',
    ],
  },
  {
    stem: 'When both hosts run “the same distro major version,” differences may still arise from:',
    right: 'Minor updates, enabled repositories, and kernel patch levels.',
    wrong: [
      'Guaranteed identical syscall tables always.',
      'Impossibility of different package sets.',
      'Kernels being irrelevant.',
    ],
  },
  {
    stem: 'Swap and memory overcommit policies are governed by:',
    right: 'Kernel VM tunables and distribution defaults.',
    wrong: [
      'Only browser cache settings.',
      'Only SMTP ports.',
      'Only SSH banner text.',
    ],
  },
  {
    stem: 'Differences between minimal server images and desktop spins are mainly:',
    right: 'Userspace packages and defaults atop the same kernel family.',
    wrong: [
      'Different non-Linux kernels by definition.',
      'Server images never use Linux.',
      'Desktop spins cannot share kernels.',
    ],
  },
];

/** Lifecycle, patching models, deeper kernel ops—enterprise ops angle. */
const ADVANCED_BANK: QA[] = [
  {
    stem: 'Live kernel patching (kpatch/kgraft-style) primarily aims to:',
    right: 'Apply limited security fixes without a full reboot when constraints allow.',
    wrong: [
      'Replace all kernel development upstream.',
      'Eliminate the need for vendor support.',
      'Upgrade glibc without touching userspace.',
    ],
  },
  {
    stem: 'kABI stability on enterprise distros matters because:',
    right: 'Out-of-tree modules expect stable kernel symbols across maintenance updates.',
    wrong: [
      'It guarantees identical application binaries forever.',
      'It removes the need for kernels.',
      'It only affects desktop fonts.',
    ],
  },
  {
    stem: 'CVE remediation might target:',
    right: 'Either kernel packages, userspace packages, or both—depending on the flaw.',
    wrong: [
      'Only `/etc/motd` text.',
      'Kernel CVEs never require package updates.',
      'Userspace CVEs never interact with the kernel.',
    ],
  },
  {
    stem: 'Realtime (PREEMPT_RT) variants emphasize:',
    right: 'Predictable scheduling latency for time-sensitive workloads.',
    wrong: [
      'Faster wallpaper rendering only.',
      'Disabling all kernel locks universally.',
      'Removing syscall interfaces.',
    ],
  },
  {
    stem: 'io_uring availability depends on:',
    right: 'Kernel version/features and distro enablement choices.',
    wrong: [
      'Only the contents of `/etc/os-release`.',
      'Only PHP version.',
      'Windows subsystem settings.',
    ],
  },
  {
    stem: 'Secure Boot and kernel module signing interact because:',
    right: 'Policy may require signed modules/trusted keys at boot time.',
    wrong: [
      'They ban all distributions.',
      'They eliminate root entirely.',
      'They prevent containers.',
    ],
  },
  {
    stem: 'Kernel crash dumps (kdump) involve:',
    right: 'Reserved memory and kernel mechanisms to capture failure context.',
    wrong: [
      'Only syslog parsing.',
      'Only Grafana dashboards.',
      'Only CI/CD YAML.',
    ],
  },
  {
    stem: 'NUMA awareness is primarily handled by:',
    right: 'Kernel memory policies and scheduler placement with hardware topology.',
    wrong: [
      'Only spreadsheet formulas.',
      'Only `/etc/hosts`.',
      'Only TLS certificates.',
    ],
  },
  {
    stem: 'Huge pages / transparent huge pages relate to:',
    right: 'Kernel memory management tradeoffs for TLB efficiency.',
    wrong: [
      'Printer DPI settings.',
      'DNS TTL defaults.',
      'JPEG compression ratios.',
    ],
  },
  {
    stem: 'Kernel lockdown / integrity modes can restrict:',
    right: 'Loading unsigned modules or accessing sensitive interfaces.',
    wrong: [
      'Only Wi-Fi SSID names.',
      'Only Git branch names.',
      'Whether TCP/IP exists.',
    ],
  },
  {
    stem: 'Distro maintenance streams differ on:',
    right: 'How long kernels receive CVE backports vs. rebasing to newer baselines.',
    wrong: [
      'Whether Linux uses syscalls.',
      'Whether disks exist.',
      'Whether SSH uses encryption.',
    ],
  },
  {
    stem: 'BPF verifier errors typically indicate:',
    right: 'Programs violate kernel safety constraints for the loaded BPF program.',
    wrong: [
      'Broken `/etc/os-release` syntax.',
      'Invalid MIME types in email.',
      'Wrong desktop resolution.',
    ],
  },
  {
    stem: 'Kernel samepage merging (KSM) trades:',
    right: 'CPU for memory deduplication in virtualization workloads.',
    wrong: [
      'GPU VRAM for DNS latency.',
      'SSH keys for TLS keys.',
      'Disk RPM for RAM speed.',
    ],
  },
  {
    stem: 'IRQ affinity tuning affects:',
    right: 'Which CPUs handle device interrupts—kernel scheduler/interrupt routing.',
    wrong: [
      'Only GNOME extensions.',
      'Only LDAP schemas.',
      'Only YAML indentation.',
    ],
  },
  {
    stem: 'Memory cgroup OOM behavior is decided by:',
    right: 'Kernel cgroup policies and limits—not only userspace wishes.',
    wrong: [
      'Only apt repository mirrors.',
      'Only CRON minute fields.',
      'Only MOTD banner length.',
    ],
  },
  {
    stem: 'Kernel retpolines / speculative execution mitigations illustrate:',
    right: 'Security responses implemented in kernel code paths with performance tradeoffs.',
    wrong: [
      'Pure marketing names with no code changes.',
      'Changes only in README files.',
      'TLS cipher renaming only.',
    ],
  },
  {
    stem: 'FIPS-validated environments often constrain:',
    right: 'Crypto modules and kernel crypto provider selections.',
    wrong: [
      'Only terminal color schemes.',
      'Only Markdown headings.',
      'Only CSV delimiters.',
    ],
  },
  {
    stem: 'Kernel crash signatures often pair with:',
    right: 'Vendor support workflows and known-good kernel baseline comparisons.',
    wrong: [
      'Only Instagram filters.',
      'Only CSV imports.',
      'Only Slack emoji.',
    ],
  },
  {
    stem: 'ZFS on Linux highlights:',
    right: 'Feature availability tied to kernel module licensing/support models per distro.',
    wrong: [
      'Identical legal posture on every distro automatically.',
      'Kernel independence from licensing.',
      'ZFS running without a kernel.',
    ],
  },
  {
    stem: 'Kernel pressure stall information (PSI) exposes:',
    right: 'Scheduler-level contention signals for capacity decisions.',
    wrong: [
      'GPU FPS counters.',
      'SMTP queue depths only.',
      'LDAP bind latency only.',
    ],
  },
  {
    stem: 'Kernel tickless / NO_HZ impacts:',
    right: 'Timer interrupts and power/performance behavior at the scheduler layer.',
    wrong: [
      'Only wallpaper slideshow timing.',
      'Only CSV parsing.',
      'Only DNS record sizes.',
    ],
  },
  {
    stem: 'Kernel module dependency ordering during boot is handled by:',
    right: 'Module infrastructure (modprobe/depmod) coordinated with the loaded kernel.',
    wrong: [
      'Only `/etc/os-release` parsing order.',
      'Only pip install order.',
      'Only Git commit hashes.',
    ],
  },
  {
    stem: 'Kernel audit subsystem (auditd integration) tracks:',
    right: 'Security-relevant events via kernel-generated records.',
    wrong: [
      'Only Spotify playlists.',
      'Only spreadsheet macros.',
      'Only Slack workspace IDs.',
    ],
  },
  {
    stem: 'Kernel memory poisoning / KASAN variants aid:',
    right: 'Finding undefined behavior and memory bugs in kernel code paths.',
    wrong: [
      'CSS linting.',
      'Markdown formatting.',
      'PNG compression.',
    ],
  },
  {
    stem: 'Choosing rolling vs. fixed-point distros for production often hinges on:',
    right: 'Change velocity vs. certification windows and vendor support commitments.',
    wrong: [
      'Whether TCP exists.',
      'Whether kernels exist.',
      'Whether SSH exists.',
    ],
  },
];

function effectiveTier(level: LearningTrackLevel): "Basic" | "Intermediate" | "Advanced" {
  if (level === "General") return "Basic";
  return level;
}

function bankForTier(tier: "Basic" | "Intermediate" | "Advanced"): QA[] {
  if (tier === "Intermediate") return INTERMEDIATE_BANK;
  if (tier === "Advanced") return ADVANCED_BANK;
  return BASIC_BANK;
}

/**
 * 25-question quiz on Linux vs kernel vs distribution, aligned to learning-track depth.
 * Deterministic shuffle per seed (plan + module + level).
 */
export function generateLinuxKernelDistributionQuizItems(
  seed: number,
  level: LearningTrackLevel,
): ModuleQuizItem[] {
  const rng = mulberry32(seed);
  const tier = effectiveTier(level);
  const bank = bankForTier(tier);
  const out: ModuleQuizItem[] = [];

  for (let i = 0; i < QCOUNT; i++) {
    const qa = bank[i]!;
    const { ordered, correctIndex } = shuffleChoices([qa.right, ...qa.wrong], rng);
    out.push({
      question: qa.stem,
      choices: ordered,
      correctIndex,
    });
  }

  return out;
}
