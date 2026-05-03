/**
 * Training-plan topic groups that use `courses/<track>/syllabus.md` module guides and shared topic quizzes.
 * Must match `group` strings in {@link ./training-topic-source}.
 */
export const SYLLABUS_COHORT_TRAINING_GROUPS = [
  "LINUX",
  "Networking",
  "Python",
  "PostgreSQL",
  "Avaya AOC",
  "Avaya AOC Solution Lifecycle",
  "Avaya AOC Platform Tools & Automation",
] as const;

export type SyllabusCohortTrainingGroup = (typeof SYLLABUS_COHORT_TRAINING_GROUPS)[number];

const COHORT_SET = new Set<string>(SYLLABUS_COHORT_TRAINING_GROUPS);

/** URL segment under `/client/plans/.../quiz/<slug>/...` and matching API route. */
export const TRAINING_GROUP_TO_QUIZ_SLUG: Record<SyllabusCohortTrainingGroup, string> = {
  LINUX: "linux",
  Networking: "networking",
  Python: "python",
  PostgreSQL: "postgresql",
  "Avaya AOC": "avaya-aoc",
  "Avaya AOC Solution Lifecycle": "avaya-aoc-solution-lifecycle",
  "Avaya AOC Platform Tools & Automation": "avaya-aoc-platform-tools-automation",
};

const SLUG_TO_GROUP = new Map<string, SyllabusCohortTrainingGroup>(
  (Object.entries(TRAINING_GROUP_TO_QUIZ_SLUG) as [SyllabusCohortTrainingGroup, string][]).map(([g, slug]) => [
    slug,
    g,
  ]),
);

export function trainingGroupIsSyllabusCohort(group: string | undefined): group is SyllabusCohortTrainingGroup {
  return !!group && COHORT_SET.has(group);
}

export function syllabusQuizSlugForTrainingGroup(group: string | undefined): string | null {
  if (!trainingGroupIsSyllabusCohort(group)) return null;
  return TRAINING_GROUP_TO_QUIZ_SLUG[group];
}

export function trainingGroupFromQuizSlug(slug: string): SyllabusCohortTrainingGroup | null {
  const s = slug.trim();
  return SLUG_TO_GROUP.get(s) ?? null;
}

/** Repo-relative path to `syllabus.md` for a cohort training group. */
export function syllabusRelPathForTrainingGroup(group: SyllabusCohortTrainingGroup): string {
  switch (group) {
    case "LINUX":
      return "courses/linux/syllabus.md";
    case "Networking":
      return "courses/networking/syllabus.md";
    case "Python":
      return "courses/python/syllabus.md";
    case "PostgreSQL":
      return "courses/postgresql/syllabus.md";
    case "Avaya AOC":
      return "courses/avaya-aoc/syllabus.md";
    case "Avaya AOC Solution Lifecycle":
      return "courses/avaya-aoc-solution-lifecycle/syllabus.md";
    case "Avaya AOC Platform Tools & Automation":
      return "courses/avaya-aoc-platform-tools-automation/syllabus.md";
    default:
      return "courses/linux/syllabus.md";
  }
}

/**
 * Fallback path when a topic id is not listed in the syllabus table (same conventions as app libraries).
 */
export function courseModuleGuideFallbackRepoPath(topicId: string): string | null {
  const id = topicId.trim();
  if (!id) return null;
  if (id.startsWith("adv-")) return `courses/linux/advanced/${id}.md`;
  if (id.startsWith("int-")) return `courses/linux/intermediate/${id}.md`;
  if (id.startsWith("netb-")) return `courses/networking/basic/${id}.md`;
  if (id.startsWith("neti-")) return `courses/networking/intermediate/${id}.md`;
  if (id.startsWith("neta-")) return `courses/networking/advanced/${id}.md`;
  if (id.startsWith("pyb-")) return `courses/python/basic/${id}.md`;
  if (id.startsWith("pyi-")) return `courses/python/intermediate/${id}.md`;
  if (id.startsWith("pya-")) return `courses/python/advanced/${id}.md`;
  if (id.startsWith("pgb-")) return `courses/postgresql/basic/${id}.md`;
  if (id.startsWith("pgi-")) return `courses/postgresql/intermediate/${id}.md`;
  if (id.startsWith("pga-")) return `courses/postgresql/advanced/${id}.md`;
  if (id.startsWith("aocsl-")) return `courses/avaya-aoc-solution-lifecycle/modules/${id}.md`;
  if (id.startsWith("aocpta-")) return `courses/avaya-aoc-platform-tools-automation/modules/${id}.md`;
  if (id.startsWith("aoc-")) return `courses/avaya-aoc/modules/${id}.md`;
  return null;
}
