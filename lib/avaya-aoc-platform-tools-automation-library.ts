import type { LinuxTopic } from "./linux-topic";

export type { LinuxTopic } from "./linux-topic";

/** Avaya AOC platform tooling, scripting, and automation patterns. */
export const avayaAocPlatformToolsAutomationLibrary: LinuxTopic[] = [
  {
    id: "aocpta-toolkit",
    major: "Platform toolkit & CLIs",
    minors: [
      "Official CLIs, SDKs, and supported runtime versions",
      "Authentication to tools: tokens, profiles, and secrets hygiene",
      "Workspace layout: config files, environments, and overrides",
      "Helpful diagnostics bundled with vendor tooling",
    ],
  },
  {
    id: "aocpta-apis",
    major: "APIs, webhooks & event automation",
    minors: [
      "REST patterns: pagination, idempotency, and error taxonomy",
      "Webhook registration, retries, and signature verification",
      "Event schemas, versioning, and consumer design",
      "Rate limits, backoff, and bulk job patterns",
    ],
  },
  {
    id: "aocpta-scripting",
    major: "Scripting & orchestration",
    minors: [
      "Shell vs. Python vs. PowerShell trade-offs for ops tasks",
      "Parameterizing scripts for multi-tenant runs",
      "Safe credential injection (no secrets in logs)",
      "Wrapping vendor APIs in small reusable modules",
    ],
  },
  {
    id: "aocpta-iac",
    major: "Infrastructure as code & config management",
    minors: [
      "Declarative definitions for AOC dependencies (patterns)",
      "Drift detection and reconciliation workflows",
      "Secrets managers and rotation hooks",
      "GitOps-style promotion across environments",
    ],
  },
  {
    id: "aocpta-cicd",
    major: "CI/CD for platform changes",
    minors: [
      "Pipeline stages: validate, plan, apply, smoke test",
      "Immutable artifacts and version pinning",
      "Blue/green or canary for risky control-plane updates",
      "Rollback triggers and automated guardrails",
    ],
  },
  {
    id: "aocpta-obs",
    major: "Observability as code",
    minors: [
      "Dashboards, alerts, and SLO definitions in repo",
      "Synthetic checks for critical admin journeys",
      "Log/metric/trace correlation for AOC services",
      "Runbooks linked from alert annotations",
    ],
  },
  {
    id: "aocpta-selfservice",
    major: "Self-service & internal platforms",
    minors: [
      "Service catalog patterns for common AOC requests",
      "Approval workflows and least-privilege execution roles",
      "ChatOps / ticketing integration for automation triggers",
      "Measuring adoption and toil reduction",
    ],
  },
];
