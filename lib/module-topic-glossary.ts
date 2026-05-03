import { getTrainingTopicById } from "@/lib/all-training-topics";
import { parsePlanEntryId } from "@/lib/plan-sequence";
import type { SavedPlanModule } from "@/lib/training-plan-summary";

/** Split phrases like "Linux vs. kernel vs. distribution" into contrasted concepts. */
export function extractContrastTerms(phrase: string): string[] {
  const t = phrase.trim();
  if (!/\s+vs\.?\s+/i.test(t)) {
    return [];
  }
  return t
    .split(/\s+vs\.?\s+/i)
    .map((s) =>
      s
        .replace(/\([^)]*\)/g, "")
        .replace(/^[\s\-–—:]+|[\s\-–—:]+$/g, "")
        .trim(),
    )
    .filter(Boolean);
}

function normKey(s: string): string {
  return s
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/^["""'`]+|["""'.!?]+$/g, "")
    .trim();
}

/**
 * Curated definitions for vocabulary that appears across Linux / networking / Avaya topic libraries.
 * Keys are lowercase; lookups use normalized single-token or short phrases.
 */
const TERM_DEFINITIONS: Record<string, string> = {
  linux:
    "A family of open-source, Unix-like operating systems that use the Linux kernel together with GNU and other user-space components.",
  kernel:
    "The core of an operating system: it talks to hardware, schedules processes, manages memory, and exposes **system calls** to programs.",
  distribution:
    "A ready-to-install OS image built around the Linux kernel plus libraries, tools, default configs, and often vendor support — e.g. RHEL, Ubuntu, or SUSE.",
  distro: "Short for **distribution** — a packaged Linux-based operating system product.",
  gnu: "The GNU project’s tools and libraries that, combined with the Linux kernel, form what many people call “Linux” systems in practice.",
  shell:
    "A command interpreter (e.g. bash) that reads what you type, runs programs, and wires stdin/stdout/stderr together.",
  terminal:
    "The text window or session where you interact with a shell — distinct from a graphical desktop.",
  filesystem:
    "The tree of directories and files starting at `/`, governed by layout conventions (e.g. FHS) and mount points.",
  "file system": "See **filesystem**.",
  path: "A string that locates a file or directory — absolute (`/var/log`) or relative (`./config`).",
  permission:
    "Rules that say who may read, write, or execute a file or traverse a directory — shown as `rwx` for user/group/others.",
  chmod:
    "Change mode — command to alter file/directory permissions (symbolic like `u+x` or numeric like `755`).",
  chown: "Change owner — assigns user and/or group ownership of files (often requires elevated privileges).",
  sudo:
    "Run a single command as another user (usually root) using controlled privilege escalation instead of sharing the root password.",
  pipe: "The `|` operator — sends one command’s stdout to another command’s stdin.",
  redirect:
    "Operators like `>`, `>>`, `2>` that attach command output or errors to files instead of the terminal.",
  grep:
    "Search lines of text for a pattern — indispensable for logs, configs, and quick filtering.",
  sed: "Stream editor — performs text transforms on streams or files (often one-liners or scripts).",
  awk: "Pattern-directed text processing language — strong for columns and small reports.",
  process:
    "A running instance of a program — has a PID, memory, file descriptors, and state (running, sleeping, zombie…).",
  daemon:
    "A background service process — often managed by **systemd** or an init system on Linux servers.",
  systemd:
    "Linux init and service manager — starts units (services, mounts, timers) and tracks their lifecycle.",
  package:
    "A bundle (RPM/DEB/etc.) that installs software and metadata through the distro’s package manager.",
  rpm: "Red Hat Package Manager format — used by RHEL, Fedora, and compatible systems.",
  deb: "Debian package format — used by Debian, Ubuntu, and derivatives.",
  repository:
    "A curated collection of packages your system trusts — configured under `/etc/yum.repos.d` or `/etc/apt/sources.list`.",
  networking:
    "How hosts exchange data — addresses, ports, protocols, routing, DNS, and security policies.",
  ip: "Internet Protocol — defines host addressing (IPv4/IPv6) and how packets are routed.",
  tcp: "Reliable, connection-oriented transport — guarantees ordered delivery when both ends cooperate.",
  udp: "Lightweight, connectionless transport — good for latency-sensitive or broadcast patterns.",
  dns:
    "Maps names like `example.com` to IP addresses — critical for almost every networked application.",
  dhcp:
    "Automatically assigns IP configuration (address, gateway, DNS) to hosts on a LAN when offered by a server.",
  vlan:
    "Logical LAN segments sharing physical switches — isolate broadcast domains and policies without laying new cable.",
  subnet:
    "A contiguous IP range described by address + mask — determines local vs. routed traffic.",
  firewall:
    "Policy engine (e.g. **iptables**, **nftables**, cloud SGs) that permits or drops packets by rule.",
  vpn:
    "Encrypted tunnel between endpoints across an untrusted network — extends a secure site or identity boundary.",
  routing:
    "Choosing paths for packets across subnets and autonomous systems — driven by route tables and protocols.",
  bridge:
    "Layer-2 device or Linux bridge interface that forwards Ethernet frames between ports like a virtual switch.",
  bond: "Link aggregation — combines NICs for redundancy or throughput with well-defined failover modes.",
  voip:
    "Voice carried over IP networks — depends on codecs, RTP streams, QoS, and sometimes SIP trunking.",
  sip: "Session Initiation Protocol — common signaling protocol for establishing/modifying VoIP sessions.",
  rtp:
    "Real-time Transport Protocol — typically carries audio/video payload once a session is established.",
  virtualization:
    "Running isolated guests (VMs/containers) on shared hardware — improves utilization and isolation boundaries.",
  container:
    "Isolated user-space environment sharing the host kernel — Docker/Podman images ship apps predictably.",
  kubernetes:
    "Orchestrates containers across clusters — deployments, scaling, networking, and declarative desired state.",
  ansible:
    "Agentless automation — YAML playbooks apply configuration and commands over SSH or APIs.",
  terraform:
    "Infrastructure-as-code — declarative plans for cloud and on-prem resources with state tracking.",
  automation:
    "Repeatable scripts or pipelines that replace manual clicks — reduces drift and speeds rollout.",
  monitoring:
    "Collecting metrics/logs/traces so you can alert on failures and capacity before users notice.",
  logging:
    "Structured or unstructured records of events — often centralized (syslog, ELK, cloud logging).",
  backup:
    "Copies of data and configs stored separately — restore drills prove they actually work.",
  restore:
    "Returning systems or files to a known-good snapshot — validates backup integrity under pressure.",
  ha: "High availability — designs that survive component failure via redundancy and failover.",
  dr: "Disaster recovery — processes and sites used when a whole region or datacenter fails.",
  compliance:
    "Demonstrating controls meet policy/regulation — evidence trails for audits and security reviews.",
  security:
    "Confidentiality, integrity, availability — authentication, authorization, patching, and least privilege.",
  ldap:
    "Directory protocol often backing enterprise authentication — maps users/groups to apps and systems.",
  sso:
    "Single sign-on — one trusted login grants access to multiple relying apps via federation protocols.",
  api:
    "Application Programming Interface — contracts (often REST/JSON or gRPC) between software components.",
  rest: "Representational style over HTTP — resources, verbs, status codes; common for integration.",
  json:
    "Lightweight text format for structured data — dominates modern APIs and configuration snippets.",
  yaml:
    "Human-friendly structured config — indentation-sensitive; common for CI/CD and IaC definitions.",
  cicd:
    "Continuous integration / continuous delivery — automated build, test, and promotion pipelines.",
  git:
    "Distributed version control — branches, merges, and history underpin collaborative engineering.",
  trunk:
    "Primary integration branch — policies vary (trunk-based vs. long-lived feature branches).",
  patch:
    "A change set applied to code or configs — also vendor-delivered OS/software fixes.",
  upgrade:
    "Moving to a newer release — plan validation, backups, and rollback paths before production.",
  rollback:
    "Reverting to a prior release or snapshot when an upgrade causes unacceptable issues.",
  licensing:
    "Legal terms governing use/redistribution — GPL vs. permissive licenses affect obligations differently.",
  gpl:
    "GNU General Public License — strong copyleft; derivatives often must stay open when distributed.",
  upstream:
    "Original open-source project maintainers — downstream vendors ship tested builds with support.",
  downstream:
    "Vendor or community layers packaging upstream code — adds lifecycle tools and certifications.",
  documentation:
    "Authoritative references — `man`, `--help`, vendor KBs; prefer these over forum guesses in production.",
  man: "Manual pages — structured help topics (`man bash`, section numbers like `man 5 passwd`).",
  help:
    "Built-in hints (`--help`, `-h`) from CLI tools — fastest way to confirm flags before you run commands.",
  environment:
    "Variables like `PATH` that influence how shells and programs locate binaries and configuration.",
  variable:
    "Named value in the shell or process environment — exported vars propagate to child processes.",
  alias:
    "Shortcut command mapping — handy but can hide real binaries; verify with `type`/`which`.",
  symlink:
    "Symbolic link — path pointer to another file/dir; can span filesystems; breaks if target moves.",
  "symbolic link": "See **symlink**.",
  "hard link":
    "Additional directory entry pointing to the same inode — cannot cross filesystems; deleting one keeps others.",
  inode:
    "Metadata record for a file on Unix-like FS — permissions, timestamps, link count, block pointers.",
  mount:
    "Attaching a filesystem at a directory — `/etc/fstab` defines persistent mounts at boot.",
  partition:
    "Slice of a disk with its own filesystem — sizing affects upgrades, logs, and resilience.",
  raid:
    "Redundant Array of Independent Disks — mirrors/striping/parity trade capacity for fault tolerance.",
  lvm:
    "Logical Volume Manager — flexible disks/volumes/snapshots above raw partitions on Linux.",
  snapshot:
    "Point-in-time frozen view of data — basis for backups and quick rollback on supported storage.",
  quota:
    "Limits on disk usage per user/group — protects shared servers from one noisy neighbor.",
  locale:
    "Language/region settings affecting sorting, dates, and characters — must match app expectations.",
  timezone:
    "How clocks map to wall time — critical for logs across regions and for scheduling jobs.",
  cron:
    "Time-based job scheduler — entries in crontab run scripts on repeating schedules.",
  "systemd timer":
    "Alternative/adjunct to cron — systemd `.timer` units coordinate dependencies cleanly.",
  journal:
    "`journalctl` reads structured logs from journald — filter by unit, time, and priority.",
  syslog:
    "Traditional logging pipeline — remote syslog aggregation still common in enterprises.",
  selinux:
    "Mandatory access control on RHEL-like systems — contexts and booleans beyond classic DAC.",
  apparmor:
    "Path-based mandatory profiles — common on Ubuntu/SUSE for constraining processes.",
  capability:
    "Fine-grained privilege slices — lets daemons avoid full root while performing specific tasks.",
};

function lookupTerm(term: string, majorContext: string | null): string {
  const key = normKey(term);
  if (TERM_DEFINITIONS[key]) {
    return TERM_DEFINITIONS[key];
  }
  // Strip articles for lookup
  const bare = key.replace(/^(the|a|an)\s+/i, "");
  if (bare !== key && TERM_DEFINITIONS[bare]) {
    return TERM_DEFINITIONS[bare];
  }
  return (
    `In ${majorContext ? `the context of **${majorContext}**` : "this module"}, **${term.trim()}** is one of the ideas you are contrasting — connect it to examples in these notes and your vendor documentation so you can explain it clearly on the quiz.`
  );
}

/**
 * Markdown block: ### Key terms + definitions (inserted under Module overview).
 */
export function buildModuleKeyTermsMarkdown(
  entryId: string | null,
  module: Pick<SavedPlanModule, "title" | "subtitle">,
): string {
  const title = module.title.trim() || "this module";

  let majorContext: string | null = null;
  let focusPhrase: string | null = null;

  const parsed = entryId?.trim() ? parsePlanEntryId(entryId.trim()) : null;
  if (parsed) {
    const topic = getTrainingTopicById(parsed.topicId);
    if (topic) {
      majorContext = topic.major;
      if (parsed.kind === "subtopic") {
        focusPhrase = topic.minors[parsed.minorIndex]?.trim() ?? null;
      }
    }
  }

  if (!focusPhrase && /\s+vs\.?\s+/i.test(title)) {
    focusPhrase = title;
  }

  if (!focusPhrase?.trim()) {
    return "";
  }

  const terms = extractContrastTerms(focusPhrase);
  if (terms.length >= 2) {
    const lines = ["### Key terms", ""];
    for (const raw of terms) {
      const term = raw.trim();
      if (!term) continue;
      lines.push(`**${term}** — ${lookupTerm(term, majorContext)}`);
      lines.push("");
    }
    return lines.join("\n").trimEnd();
  }

  return "";
}
