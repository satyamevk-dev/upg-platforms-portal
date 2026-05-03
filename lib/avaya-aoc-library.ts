import type { LinuxTopic } from "./linux-topic";

export type { LinuxTopic } from "./linux-topic";

/** Avaya AOC (Aura Operations Console / operations-focused admin) curriculum for training plans. */
export const avayaAocLibrary: LinuxTopic[] = [
  {
    id: "aoc-overview",
    major: "Avaya AOC overview & architecture",
    minors: [
      "Role of AOC in the Avaya enterprise stack",
      "Core services, dependencies, and deployment models",
      "Licensing and capacity planning awareness",
      "Security model: roles, tenants, and least privilege",
    ],
  },
  {
    id: "aoc-console",
    major: "Console access & navigation",
    minors: [
      "Login, session management, and supported browsers",
      "Dashboards, global search, and context menus",
      "Working with lists, filters, and bulk actions",
      "Audit trails and export basics",
    ],
  },
  {
    id: "aoc-directory",
    major: "Directory, users & groups",
    minors: [
      "User lifecycle: create, modify, disable, and templates",
      "Groups, nested membership, and attribute mapping",
      "Directory sync and identity provider integration patterns",
      "Password policies and MFA considerations",
    ],
  },
  {
    id: "aoc-messaging",
    major: "Messaging & collaboration policies",
    minors: [
      "Spaces, channels, and retention policies",
      "Compliance: legal hold, eDiscovery hooks, and archiving",
      "External federation and guest access controls",
      "Client rollout: supported endpoints and feature flags",
    ],
  },
  {
    id: "aoc-integrations",
    major: "Integrations & APIs",
    minors: [
      "Webhooks, event subscriptions, and rate limits",
      "REST API authentication and common workflows",
      "CRM and ticketing integrations (patterns)",
      "Change windows and backward compatibility",
    ],
  },
  {
    id: "aoc-ops",
    major: "Operations, monitoring & backup",
    minors: [
      "Health indicators, alerts, and escalation paths",
      "Log collection, tracing, and support bundles",
      "Backup/restore expectations and DR drills",
      "Patching, upgrades, and maintenance modes",
    ],
  },
  {
    id: "aoc-troubleshoot",
    major: "Troubleshooting & support handoff",
    minors: [
      "Top failure modes and first-response checks",
      "Correlating user reports with platform telemetry",
      "Vendor support: required data and severity guidelines",
      "Knowledge base and runbook hygiene",
    ],
  },
];
