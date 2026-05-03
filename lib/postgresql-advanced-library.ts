import type { LinuxTopic } from "./linux-topic";

export const postgresqlAdvancedLibrary: LinuxTopic[] = [
  {
    id: "pga-query-tuning",
    major: "Query tuning & planner depth",
    minors: [
      "Cost model intuition: seq scan vs. index scan vs. bitmap",
      "When indexes hurt: write amplification, bloat",
      "Extended statistics and planner hints (judgment, not defaults)",
      "Parallel query and work_mem tradeoffs",
    ],
  },
  {
    id: "pga-vacuum-bloat",
    major: "VACUUM, MVCC & bloat",
    minors: [
      "How MVCC creates dead tuples",
      "VACUUM, autovacuum tuning signals",
      "Visibility map and index-only scans",
      "Monitoring table/index bloat and reclaim strategies",
    ],
  },
  {
    id: "pga-locking-concurrency",
    major: "Locking, deadlocks & concurrency",
    minors: [
      "Lock types relevant to DDL and DML",
      "advisory locks and application patterns",
      "Deadlock detection and mitigation",
      "Hot-row contention patterns and mitigations",
    ],
  },
  {
    id: "pga-replication-ha",
    major: "Replication & high availability",
    minors: [
      "Physical streaming replication architecture",
      "Synchronous vs. asynchronous tradeoffs",
      "Failover, split-brain awareness, and RPO/RTO language",
      "Read replicas and lag monitoring",
    ],
  },
  {
    id: "pga-backup-recovery",
    major: "Backup, PITR & disaster recovery",
    minors: [
      "Logical backups (pg_dump) vs. physical (base backup/WAL)",
      "Continuous archiving and point-in-time recovery concepts",
      "Restore drills and runbook hygiene",
      "Encryption and off-site retention expectations",
    ],
  },
  {
    id: "pga-advanced-features",
    major: "Partitioning, JSONB & extensions",
    minors: [
      "Declarative partitioning strategies and pruning",
      "JSON/JSONB: indexing (GIN), query patterns, pitfalls",
      "Full-text search overview (tsvector, GIN)",
      "Trusted extensions and upgrade implications",
    ],
  },
];
