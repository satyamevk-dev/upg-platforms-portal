import type { LinuxTopic } from "./linux-topic";

export type { LinuxTopic } from "./linux-topic";

/** Avaya AOC solution lifecycle: from discovery through retirement. */
export const avayaAocSolutionLifecycleLibrary: LinuxTopic[] = [
  {
    id: "aocsl-discover",
    major: "Discover & assess",
    minors: [
      "Stakeholder interviews and success criteria",
      "Current-state inventory: apps, identities, integrations",
      "Gap analysis vs. target AOC capabilities",
      "Risk register, assumptions, and dependencies",
    ],
  },
  {
    id: "aocsl-design",
    major: "Design & architect",
    minors: [
      "Reference architecture and environment tiers (dev/test/prod)",
      "Identity, networking, and security boundaries",
      "Data residency, compliance, and retention design",
      "Integration contracts and API/event design",
    ],
  },
  {
    id: "aocsl-plan",
    major: "Plan & govern",
    minors: [
      "Roadmap, milestones, and change windows",
      "RACI, CAB alignment, and communication plan",
      "Training and adoption strategy for admins and power users",
      "Cost model: licenses, infra, and support",
    ],
  },
  {
    id: "aocsl-build",
    major: "Build & integrate",
    minors: [
      "Provisioning automation and configuration baselines",
      "Directory sync, SSO, and federation setup",
      "Pilot cohorts, feature flags, and rollback criteria",
      "Validation test plans and sign-off gates",
    ],
  },
  {
    id: "aocsl-deploy",
    major: "Deploy & migrate",
    minors: [
      "Cutover strategies: big-bang vs. phased",
      "Migration runbooks: data, users, and traffic",
      "Hypercare, war-room procedures, and rollback",
      "Go-live checklist and operational handoff",
    ],
  },
  {
    id: "aocsl-operate",
    major: "Operate & optimize",
    minors: [
      "SRE-style monitoring, SLOs, and incident response",
      "Capacity reviews, patching, and lifecycle upgrades",
      "Continuous improvement backlog and vendor engagement",
      "Quarterly business reviews and value realization",
    ],
  },
  {
    id: "aocsl-retire",
    major: "Retire & transition",
    minors: [
      "End-of-life planning and data export/archival",
      "Decommissioning order: integrations, users, systems",
      "Knowledge transfer and documentation archive",
      "Lessons learned and formal project closure",
    ],
  },
];
