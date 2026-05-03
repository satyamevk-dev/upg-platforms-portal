import type { LinuxTopic } from "./linux-topic";

export const postgresqlBasicsLibrary: LinuxTopic[] = [
  {
    id: "pgb-rel-model",
    major: "Relational model & PostgreSQL overview",
    minors: [
      "Tables, rows, columns, and primary keys in plain language",
      "How PostgreSQL fits in the data stack (OLTP, apps, analytics awareness)",
      "Server, cluster, database, schema — naming the pieces",
      "Community vs. vendor distributions and version cadence",
    ],
  },
  {
    id: "pgb-install-connect",
    major: "Install, connect & psql",
    minors: [
      "Local install paths (packages, Docker) and service basics",
      "Connection strings: host, port, database, user, SSL awareness",
      "psql: connecting, meta-commands (\\l, \\dt, \\d), and \\?",
      "GUI clients vs. CLI for day-to-day work",
    ],
  },
  {
    id: "pgb-ddl",
    major: "DDL: tables, types & constraints",
    minors: [
      "CREATE TABLE and common PostgreSQL data types",
      "NULL semantics and DEFAULT",
      "PRIMARY KEY, UNIQUE, NOT NULL, CHECK (intro)",
      "ALTER TABLE: add/drop column awareness",
    ],
  },
  {
    id: "pgb-select",
    major: "Querying with SELECT",
    minors: [
      "SELECT list, FROM, WHERE, AND/OR, IN, BETWEEN",
      "ORDER BY, LIMIT / OFFSET",
      "DISTINCT and simple expressions",
      "Comments and readable SQL habits",
    ],
  },
  {
    id: "pgb-dml",
    major: "Writing data: INSERT, UPDATE, DELETE",
    minors: [
      "INSERT: single row and multi-row forms",
      "UPDATE and DELETE with WHERE — avoiding full-table mistakes",
      "RETURNING clause basics",
      "Safe habits in shared environments (transactions preview)",
    ],
  },
  {
    id: "pgb-keys-fk",
    major: "Keys & relationships",
    minors: [
      "Surrogate vs. natural keys",
      "FOREIGN KEY: purpose and ON DELETE/UPDATE behaviors (overview)",
      "Referential integrity in practice",
      "When to defer constraint checks (awareness)",
    ],
  },
];
