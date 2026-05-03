import { getTrainingTopicById } from "@/lib/all-training-topics";
import { extractContrastTerms } from "@/lib/module-topic-glossary";
import { parsePlanEntryId } from "@/lib/plan-sequence";
import { getTrainingSourceForTopicId } from "@/lib/training-topic-source";
import type { SavedPlanModule } from "@/lib/training-plan-summary";

export type LearningTrackLevel = "Basic" | "Intermediate" | "Advanced" | "General";

/** Structured blocks suitable for APIs, PDF export, or rendering to markdown. */
export type StructuredTrainingMaterial = {
  trackLabel: string;
  topicFocus: string;
  majorTopic: string | null;
  level: LearningTrackLevel;
  /** Ordered outcomes for this study unit */
  objectives: string[];
  /** Narrative sections */
  sections: Array<{ id: string; title: string; body: string }>;
  /** Hands-on prompts */
  labSuggestions: string[];
  /** Self-check before quiz */
  reviewChecklist: string[];
};

function parseTrackFromSectionHeader(sectionHeader: string | null): {
  group: string;
  level: string;
} | null {
  if (!sectionHeader?.trim()) return null;
  const m = sectionHeader.trim().match(/^(.+?)\s*›\s*(.+)$/);
  if (!m) return null;
  return { group: m[1].trim(), level: m[2].trim() };
}

function normalizeLevel(raw: string | undefined): LearningTrackLevel {
  const u = raw?.trim();
  if (!u) return "General";
  const lower = u.toLowerCase();
  if (lower === "basic") return "Basic";
  if (lower === "intermediate") return "Intermediate";
  if (lower === "advanced") return "Advanced";
  return "General";
}

export type ResolvedTrainingContext = {
  topicFocus: string;
  majorTopic: string | null;
  trackLabel: string;
  level: LearningTrackLevel;
  group: string | null;
  /** Sub-bullets from the plan topic library (major module); used to tailor core study material by level. */
  curriculumMinors: string[];
};

export function resolveTrainingContext(
  entryId: string | null,
  sectionHeader: string | null,
  module: Pick<SavedPlanModule, "title" | "subtitle">,
): ResolvedTrainingContext {
  const title = module.title.trim() || "this module";
  let topicFocus = title;
  let majorTopic: string | null = null;
  let trackLabel = sectionHeader?.trim() ? sectionHeader.trim() : "Training";
  let level: LearningTrackLevel = "General";
  let group: string | null = null;
  let curriculumMinors: string[] = [];

  const parsed = entryId?.trim() ? parsePlanEntryId(entryId.trim()) : null;
  if (parsed) {
    const topic = getTrainingTopicById(parsed.topicId);
    const labels = getTrainingSourceForTopicId(parsed.topicId);
    if (topic) {
      majorTopic = topic.major;
      if (parsed.kind === "subtopic") {
        topicFocus = topic.minors[parsed.minorIndex]?.trim() || title;
        const line = topic.minors[parsed.minorIndex];
        curriculumMinors = line ? [line] : [];
      } else {
        topicFocus = topic.major;
        curriculumMinors = topic.minors ?? [];
      }
    }
    if (labels?.group && labels.level) {
      trackLabel = `${labels.group} › ${labels.level}`;
      level = normalizeLevel(labels.level);
      group = labels.group;
    } else if (labels?.group) {
      trackLabel = labels.group;
      group = labels.group;
    }
  }

  const fromHeader = parseTrackFromSectionHeader(sectionHeader);
  if (fromHeader && level === "General") {
    trackLabel = `${fromHeader.group} › ${fromHeader.level}`;
    level = normalizeLevel(fromHeader.level);
    group = fromHeader.group;
  }

  /** Exercise name / plan module title is the label under "Module study"; assessments must target that text. */
  const displayLabel = module.title.trim();
  if (displayLabel) {
    topicFocus = displayLabel;
  }

  return { topicFocus, majorTopic, trackLabel, level, group, curriculumMinors };
}

export function isLinuxKernelVsDistributionFocus(focus: string): boolean {
  const terms = extractContrastTerms(focus);
  if (terms.length >= 3) {
    const lower = terms.map((t) => t.toLowerCase());
    return (
      lower.some((t) => t.includes("linux")) &&
      lower.some((t) => t.includes("kernel")) &&
      lower.some((t) => t.includes("distribution") || t.includes("distro"))
    );
  }
  const n = focus.toLowerCase();
  return (
    n.includes("linux") &&
    n.includes("kernel") &&
    (n.includes("distribution") || n.includes("distro"))
  );
}

function materialLinuxKernelDistribution(
  ctx: ResolvedTrainingContext,
): StructuredTrainingMaterial {
  const { trackLabel, topicFocus, majorTopic, level } = ctx;
  const major = majorTopic ?? "Linux introduction";
  /** Treat unspecified track depth like foundational content. */
  const L = level === "General" ? "Basic" : level;

  const objectives: string[] =
    L === "Basic"
      ? [
          `Tell apart **Linux** (ecosystem), the **kernel**, and a **distribution** as a shipped product.`,
          `Relate how a vendor “distribution” packages the kernel with userspace and policies.`,
          `Use simple commands to identify kernel version vs. OS identity on a lab system.`,
        ]
      : L === "Intermediate"
        ? [
            `Contrast upstream kernel sources with vendor kernels and long-term support streams.`,
            `Explain how userspace (systemd, glibc, packaging) varies across distributions while sharing the kernel interface.`,
            `Navigate vendor docs (RHEL/SUSE/Ubuntu) for lifecycle and compatibility implications.`,
          ]
        : [
            `Trace kernel configuration, module boundaries, and ABI stability guarantees relevant to enterprise SLAs.`,
            `Evaluate tradeoffs between rolling vs. fixed-point distributions for workloads you operate.`,
            `Map security responses (CVE backports) across kernel vs. distribution maintenance models.`,
          ];

  const sections: StructuredTrainingMaterial["sections"] =
    L === "Basic"
      ? [
          {
            id: "fit",
            title: "How Linux, the kernel, and a distribution relate",
            body:
              `People often say “Linux” to mean a complete operating environment. Strictly, **Linux** refers to the kernel started by Linus Torvalds — the code that schedules processes, manages memory, talks to drivers, and exposes **system calls** to programs. A **distribution** (often shortened to “distro”) is what you download or install: the kernel **plus** curated userspace (GNU tools, init system, libraries), installer, package manager, default configs, and often commercial support. Think of the kernel as the engine and the distribution as the entire vehicle tuned for a purpose (server, desktop, embedded).`,
          },
          {
            id: "examples",
            title: "Examples you should recognize",
            body:
              `Common enterprise-oriented distributions include **Red Hat Enterprise Linux (RHEL)**, **SUSE Linux Enterprise**, and community derivatives such as **Fedora** or **Ubuntu**. Each chooses kernel versions, patch policies, release cadence, and tooling — so two servers “both running Linux” can still behave differently from an ops perspective.`,
          },
          {
            id: "why",
            title: `Why this distinction matters for ${major}`,
            body:
              `As you progress through **${major}**, every lab decision — package installs, kernel modules, upgrades — assumes you know whether you are changing **distribution-level** packages or behaviors that depend on the **kernel** (drivers, certain sysctl knobs, eBPF availability). Mixing those layers causes confusion in incidents and change windows.`,
          },
        ]
      : L === "Intermediate"
        ? [
            {
              id: "upstream",
              title: "Upstream kernel vs. what ships on your servers",
              body:
                `Kernel source evolves continuously upstream; distributions freeze on a baseline, then **backport** security fixes and sometimes features. Two hosts can report similar ` +
                "`uname -r`" +
                ` strings yet follow different patch queues — always correlate with your vendor’s release notes.`,
            },
            {
              id: "userspace",
              title: "Distribution identity beyond the kernel",
              body:
                `Package managers (` +
                "`dnf` / `zypper` / `apt`" +
                `), init systems, SELinux/AppArmor defaults, and library versions define operational habits. The kernel ABI ties these layers together — **glibc**, dynamic linker behavior, and container runtimes all assume compatible kernel features.`,
            },
          ]
        : [
            {
              id: "sla",
              title: "Enterprise lifecycle and kernel lineage",
              body:
                `Advanced operations tie **CVE remediation**, live patching, and hardware enablement to explicit kernel branches maintained by your vendor. Understand **kABI** stability promises on RHEL-like systems versus faster-moving upstream kernels in rolling distros.`,
            },
            {
              id: "design",
              title: "Choosing distribution characteristics deliberately",
              body:
                `Evaluate footprint, compliance artifacts, real-time extensions, and hybrid cloud images — these decisions sit mostly at **distribution** scope even when features surface as kernel modules or sysctl interfaces.`,
            },
          ];

  const labSuggestions =
    L === "Basic"
      ? [
          `On any Linux VM, run \`uname -r\` (kernel release) and compare with \`/etc/os-release\` (distribution identity).`,
          `Open \`man uname\` and note what fields distinguish kernel vs. operating system naming.`,
        ]
      : L === "Intermediate"
        ? [
            `Inspect \`/proc/version\` and vendor kernel changelog packages (` +
              "`rpm -qa kernel*` / `dpkg -l | grep linux-image`" +
              `).`,
            `Map one CVE advisory from your vendor to whether it required a kernel package upgrade vs. userspace only.`,
          ]
        : [
            `Review **kABI** / stable-module-interface docs for your enterprise distro and list one driver affected.`,
            `Contrast **live patching** (e.g. kpatch, kgraft) constraints with full kernel RPM upgrades during maintenance.`,
          ];

  const reviewChecklist =
    L === "Basic"
      ? [
          `Can you explain “kernel vs. distribution” in two sentences to a new teammate?`,
          `Can you name two distributions and what differs besides the kernel version?`,
          `Can you point to where your organization documents **standard images** (golden distro builds)?`,
        ]
      : L === "Intermediate"
        ? [
            `Can you trace how your fleet receives kernel updates vs. userspace updates?`,
            `Can you justify why two containers on “Linux” might differ in **syscall** availability?`,
          ]
        : [
            `Can you articulate your vendor’s **kernel support horizon** vs. application stack support?`,
            `Can you identify one workload constraint tied to kernel features (e.g. **io_uring**, **BPF**)?`,
          ];

  return {
    trackLabel,
    topicFocus,
    majorTopic,
    level,
    objectives,
    sections,
    labSuggestions,
    reviewChecklist,
  };
}

function domainPhrase(group: string | null): string {
  if (!group) return "your platform";
  const g = group.toUpperCase();
  if (g === "LINUX" || g.includes("LINUX")) return "Linux systems and the surrounding toolchain";
  if (g.includes("NETWORK")) return "network design, addressing, and operations";
  if (g.includes("PYTHON")) return "Python development, libraries, and automation";
  if (g.includes("POSTGRESQL")) return "relational databases, SQL, and PostgreSQL operations";
  if (g.includes("AVAYA")) return "Avaya solutions and operational practice";
  return `${group} environments`;
}

type TrackDepth = "Basic" | "Intermediate" | "Advanced";

/** Level-specific core narrative tied to plan syllabus bullets when the topic comes from the library. */
function curriculumCoreSection(
  curriculumMinors: string[],
  L: TrackDepth,
  topicFocus: string,
  scope: string,
): StructuredTrainingMaterial["sections"][number] | null {
  if (curriculumMinors.length === 0) return null;
  const max = 5;
  const lines = curriculumMinors.slice(0, max);
  const overflow = curriculumMinors.length > max;

  if (L === "Basic") {
    const body =
      `Your plan maps **${topicFocus}** to concrete syllabus points inside **${scope}**. At **Basic** depth, convert each into language you could use in standup — no jargon without a definition:\n\n` +
      lines.map((m) => `- **${m}** — write a one-sentence definition and one example (lab, ticket, or realistic hypothetical).`).join("\n") +
      (overflow
        ? `\n\n_Additional bullets appear under **Curriculum anchors (from your plan)** — treat them the same way._`
        : "");
    return {
      id: "syllabus-basic",
      title: "Core material: syllabus bullets → plain-language mastery",
      body,
    };
  }

  if (L === "Intermediate") {
    const body =
      `At **Intermediate** depth, each syllabus point should connect to **verification** in ${scope}:\n\n` +
      lines
        .map(
          (m) =>
            `- **${m}** — name the command, UI path, log pattern, or metric that proves this is healthy; who typically owns remediation?`,
        )
        .join("\n") +
      (overflow ? `\n\n_Repeat for every anchor listed for this module._` : "");
    return {
      id: "syllabus-intermediate",
      title: "Core material: syllabus → operational checks and ownership",
      body,
    };
  }

  const body =
    `At **Advanced** depth, stress-test each syllabus item for **failure modes, blast radius, and controls**:\n\n` +
    lines
      .map(
        (m) =>
          `- **${m}** — worst realistic failure? Existing control or design guardrail? What would you challenge in design or security review?`,
      )
      .join("\n") +
    (overflow ? `\n\n_Apply the same rigor to the full curriculum list for this module._` : "");
  return {
    id: "syllabus-advanced",
    title: "Core material: syllabus → risk, controls, and design critique",
    body,
  };
}

/** Rich study unit for any module: topic + learning-track depth + optional program group. */
function materialDynamicTrackUnit(ctx: ResolvedTrainingContext): StructuredTrainingMaterial {
  const { trackLabel, topicFocus, majorTopic, level, group, curriculumMinors } = ctx;
  const scope = majorTopic ?? topicFocus;
  const L: TrackDepth = level === "General" ? "Basic" : level;
  const domain = domainPhrase(group);

  const depthHint =
    L === "Basic"
      ? "clear definitions, orientation, and concrete examples you can recognize in a lab or ticket"
      : L === "Intermediate"
        ? "how components connect day-to-day: tooling, handoffs, failure modes, and verification steps"
        : "architecture tradeoffs, risk boundaries, scaling or lifecycle pressures, and governance checkpoints";

  const objectives =
    L === "Basic"
      ? [
          `Define **${topicFocus}** in plain language and place it inside **${scope}**.`,
          `Recognize how this idea shows up on **${trackLabel}** work in ${domain}.`,
          `Point to where your team or vendor documents truth before you change anything in production.`,
        ]
      : L === "Intermediate"
        ? [
            `Explain how **${topicFocus}** interacts with neighboring components and responsibilities.`,
            `Describe a realistic workflow or signal (logs, metrics, checks) tied to this topic on **${trackLabel}**.`,
            `Anticipate one misconfiguration or outage pattern someone at your tier should catch early.`,
          ]
        : [
            `Evaluate design and operational tradeoffs for **${topicFocus}** under realistic constraints.`,
            `Map stakeholders, blast radius, and escalation paths when this area fails or changes.`,
            `Align technical choices with organizational policies (security, change windows, compliance).`,
          ];

  const s1Body =
    `You are studying **${topicFocus}** as part of **${scope}** on the **${trackLabel}** track. ` +
    `This module is calibrated for **${L}** depth: ${depthHint}. ` +
    `The **Core material** subsections below change with that tier — work them in order, then use labs and the quiz to reinforce. ` +
    `Your internal standards and vendor documentation remain authoritative if anything disagrees.`;

  const s2Title =
    L === "Basic"
      ? `Core material: mental model for ${topicFocus}`
      : L === "Intermediate"
        ? `Core material: operational wiring for ${topicFocus}`
        : `Core material: architecture, risk, and controls for ${topicFocus}`;

  const s2Body =
    L === "Basic"
      ? `Start with vocabulary: write **${topicFocus}** in your own words. Note what problem it solves, who touches it (you, platform, vendor), and what “good” looks like in ${domain}. Sketch one example from training or your environment — even hypothetical — so the idea is anchored before you touch advanced edge cases.`
      : L === "Intermediate"
        ? `Trace **${topicFocus}** end-to-end: inputs, owners, dependencies, and what breaks first when something drifts. List tools or interfaces you expect (CLI, UI, API, tickets). Decide what you would check first in an incident involving this area, and what “done” means for a change touching **${topicFocus}**.`
        : `Pressure-test assumptions: limits, single points of failure, upgrade paths, and how changes propagate. Identify security or compliance edges (identity, segmentation, data handling) that intersect **${topicFocus}**. Document what must never happen vs. what is tolerable with mitigation, and where executive or architecture sign-off applies.`;

  const syllabusSection = curriculumCoreSection(curriculumMinors, L, topicFocus, scope);

  const trackTitle =
    L === "Basic"
      ? `Core material: how Basic tier fits ${trackLabel}`
      : L === "Intermediate"
        ? `Core material: Intermediate practice on ${trackLabel}`
        : `Core material: Advanced accountability on ${trackLabel}`;

  const s3Body =
    L === "Basic"
      ? `On **${trackLabel}** at **Basic** depth, prioritize **recognition and vocabulary**: you should spot **${topicFocus}** in real artifacts (docs, configs, dashboards) and speak about it accurately in ${domain}. Relate it to everyday tickets or changes your team files — not to every exception or rare platform quirk. If your org labels this module differently, use the **Learning track** line at the top as the source of truth for tier.`
      : L === "Intermediate"
        ? `On **${trackLabel}** at **Intermediate** depth, **${topicFocus}** should feel actionable: you can walk a peer through the workflow, name the first diagnostics, and know which adjacent team to pull in. Connect lessons to **observability** and **change discipline** — what would you measure before and after a change involving **${topicFocus}**?`
        : `On **${trackLabel}** at **Advanced** depth, you own **tradeoffs and governance** around **${topicFocus}**: blast radius, policy alignment, rollback posture, and who approves risky moves. Be ready to justify decisions to security, architecture, or leadership using concrete scenarios, not slogans.`;

  const s4Title =
    L === "Basic"
      ? "Core material: readiness check (Basic)"
      : L === "Intermediate"
        ? "Core material: readiness check (Intermediate)"
        : "Core material: readiness check (Advanced)";
  const s4Body =
    L === "Basic"
      ? `Can you explain **${topicFocus}** to a peer in under two minutes? Can you name one document or dashboard you would open to verify your understanding — at a **Basic** level, not exhaustive expert depth?`
      : L === "Intermediate"
        ? `Can you diagram or bullet the data/control flow for **${topicFocus}**? Can you list two signals that prove it is healthy vs. degraded, and the first command or screen you’d open when it’s not?`
        : `Can you defend one design or process choice around **${topicFocus}** against a skeptical reviewer — including rollback, monitoring, and who is accountable when it fails?`;

  const sections: StructuredTrainingMaterial["sections"] = [
    { id: "frame", title: `Framing: ${topicFocus} at ${L} depth`, body: s1Body },
    { id: "depth", title: s2Title, body: s2Body },
    ...(syllabusSection ? [syllabusSection] : []),
    { id: "track", title: trackTitle, body: s3Body },
    { id: "exit", title: s4Title, body: s4Body },
  ];

  const labSuggestions =
    L === "Basic"
      ? [
          `Write a five-sentence explainer of **${topicFocus}** as if onboarding a new teammate on **${trackLabel}**.`,
          `Find one diagram, README, or vendor page your organization trusts for **${scope}** and bookmark it for later.`,
        ]
      : L === "Intermediate"
        ? [
            `Turn your notes into a short runbook section: prerequisites, steps, verification, and rollback for **${topicFocus}**.`,
            `Pair **${topicFocus}** with one metric or log line you would watch during a change — justify your choice.`,
          ]
        : [
            `Produce a risk mini-table for **${topicFocus}**: threat or failure mode, likelihood, impact, existing control, gap.`,
            `Peer-review style: list three questions a security or architecture reviewer might ask about **${topicFocus}** in production.`,
          ];

  const reviewChecklist =
    L === "Basic"
      ? [
          `Can you restate **${topicFocus}** without reading the module title?`,
          `Can you explain why this topic belongs on **${trackLabel}** for ${domain}?`,
          `Can you name where to verify facts before acting in production?`,
        ]
      : L === "Intermediate"
        ? [
            `Can you walk through **${topicFocus}** as a short operational story (trigger → checks → outcome)?`,
            `Can you identify one dependency others underestimate?`,
            `Can you list one failure symptom and the first diagnostic step?`,
          ]
        : [
            `Can you summarize tradeoffs for **${topicFocus}** in one paragraph?`,
            `Can you cite one policy or control that constrains how you operate this area?`,
            `Can you describe rollback or containment if a change goes wrong?`,
          ];

  return {
    trackLabel,
    topicFocus,
    majorTopic,
    level,
    objectives,
    sections,
    labSuggestions,
    reviewChecklist,
  };
}

export function generateStructuredTrainingMaterial(ctx: ResolvedTrainingContext): StructuredTrainingMaterial {
  if (isLinuxKernelVsDistributionFocus(ctx.topicFocus)) {
    return materialLinuxKernelDistribution(ctx);
  }
  return materialDynamicTrackUnit(ctx);
}

/** Renders structured material as markdown for the Study notes section. */
export function structuredTrainingMaterialToMarkdown(m: StructuredTrainingMaterial): string {
  const lines: string[] = [];

  const levelLine =
    m.level === "General"
      ? "Level **General** (material depth matches **Basic** when no tier is set)"
      : `Level **${m.level}**`;
  lines.push(`> **Structured study unit** · Track **${m.trackLabel}** · Focus **${m.topicFocus}** · ${levelLine}`);
  lines.push("");

  lines.push("### Learning objectives");
  lines.push("");
  m.objectives.forEach((o, i) => {
    lines.push(`${i + 1}. ${o}`);
  });
  lines.push("");

  lines.push("### Core material");
  lines.push("");
  for (const s of m.sections) {
    lines.push(`#### ${s.title}`);
    lines.push("");
    lines.push(s.body);
    lines.push("");
  }

  lines.push("### Apply / lab prompts");
  lines.push("");
  for (const lab of m.labSuggestions) {
    lines.push(`- ${lab}`);
  }
  lines.push("");

  lines.push("### Self-review (before the quiz)");
  lines.push("");
  for (const item of m.reviewChecklist) {
    lines.push(`- [ ] ${item}`);
  }
  lines.push("");

  return lines.join("\n").trimEnd();
}

/** Study notes markdown from an already-resolved context (avoids duplicate resolution). */
export function buildDynamicStudyNotesFromResolvedContext(ctx: ResolvedTrainingContext): string {
  return structuredTrainingMaterialToMarkdown(generateStructuredTrainingMaterial(ctx));
}

/** Full markdown block for ## Study notes (dynamic generation only). */
export function buildDynamicStudyNotesMarkdown(
  entryId: string | null,
  sectionHeader: string | null,
  module: Pick<SavedPlanModule, "title" | "subtitle" | "sectionHeader">,
): string {
  const ctx = resolveTrainingContext(entryId, sectionHeader, module);
  return buildDynamicStudyNotesFromResolvedContext(ctx);
}

/**
 * Dynamic module overview: topic focus, learning track, and depth — always aligned with {@link resolveTrainingContext}.
 * (Module subtitle, if any, is shown separately under the title.)
 */
export function buildDynamicModuleOverviewMarkdown(ctx: ResolvedTrainingContext): string {
  const { topicFocus, majorTopic, trackLabel, level, group } = ctx;
  const scope = majorTopic ?? topicFocus;
  const L = level === "General" ? "Basic" : level;

  const depthAim =
    L === "Basic"
      ? "foundational understanding and recognizable examples"
      : L === "Intermediate"
        ? "operational connections, tooling, and verification habits"
        : "deeper tradeoffs, risk, and governance relevant to experienced operators";

  const domain = domainPhrase(group);

  return (
    `This module centers on **${topicFocus}** within **${scope}**. You are following **${trackLabel}** — at this stage, aim for **${depthAim}** suited to **${domain}**. ` +
    `The **Study notes** below are generated for this topic and track level; complete the quiz when you are ready.`
  );
}
