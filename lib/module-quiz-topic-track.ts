import type { ModuleQuizItem } from "@/lib/exercise-details-json";
import type { LearningTrackLevel, ResolvedTrainingContext } from "@/lib/module-dynamic-training-content";

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

function effectiveTier(level: LearningTrackLevel): "Basic" | "Intermediate" | "Advanced" {
  return level === "General" ? "Basic" : level;
}

type Env = {
  title: string;
  scope: string;
  focus: string;
  track: string;
  bi: string;
  group: string;
};

function basicQuestion(variant: number, e: Env): QA {
  const { title, scope, focus, track, bi } = e;
  switch (variant) {
    case 0:
      return {
        stem: `Within "${scope}", what does studying "${focus}" primarily prepare you to do?`,
        right: `Recognize core ideas and vocabulary so you can discuss "${focus}" accurately on "${track}".`,
        wrong: [
          `Ignore "${focus}" because it never appears in operations.`,
          `Treat "${focus}" as unrelated to "${scope}".`,
          `Assume "${focus}" applies only to a different certification exam.`,
        ],
      };
    case 1:
      return {
        stem: `Why is "${bi}" worth attention while studying "${title}"?`,
        right: `It ties directly to the learning objectives for this module on "${track}".`,
        wrong: [
          `It is filler text trainers never review.`,
          `It replaces every other topic in "${scope}".`,
          `It is excluded from any knowledge check.`,
        ],
      };
    case 2:
      return {
        stem: `Which statement about "${focus}" fits a "${track}" foundation-level understanding?`,
        right: `You can explain what "${focus}" refers to and why it matters in "${scope}".`,
        wrong: [
          `"${focus}" has no definition in professional environments.`,
          `"${focus}" is identical on every platform without exception.`,
          `"${focus}" should be skipped until advanced-only courses.`,
        ],
      };
    case 3:
      return {
        stem: `Before finishing this module, a trainee should be able to say about "${bi}":`,
        right: `How it connects to "${title}" and typical responsibilities on "${track}".`,
        wrong: [
          `Nothing — memorization is discouraged entirely.`,
          `Only the spelling of the phrase with no meaning.`,
          `That it is exclusively historical and unused today.`,
        ],
      };
    case 5:
      return {
        stem: `**Basic** tier on "${track}": after studying "${focus}", you should first be able to:`,
        right: `Explain what "${focus}" means in plain language and why it sits inside "${scope}".`,
        wrong: [
          `Design multi-region failover with no further reading.`,
          `Approve production changes for every adjacent system without review.`,
          `Replace all team runbooks single-handedly.`,
        ],
      };
    case 6:
      return {
        stem: `Your module outline highlights "${bi}". For **Basic** depth, the best priority is:`,
        right: `Build accurate vocabulary and a concrete example you could explain to a new teammate.`,
        wrong: [
          `Memorize acronyms without knowing what they represent.`,
          `Skip definitions because operations "just knows" this.`,
          `Assume "${bi}" is optional trivia unrelated to "${title}".`,
        ],
      };
    case 7:
      return {
        stem: `Which outcome matches **Basic-level** expectations for "${focus}" within "${scope}"?`,
        right: `You recognize "${focus}" in docs or tools and can point to where your org defines it.`,
        wrong: [
          `You can bypass change control because the topic feels familiar.`,
          `You are responsible for vendor contract negotiations solo.`,
          `You must optimize every metric to expert targets immediately.`,
        ],
      };
    case 8:
      return {
        stem: `A colleague on "${track}" asks for a two-minute primer on "${focus}". At **Basic** depth you should:`,
        right: `Give a clear definition, one example, and where to read more internally or from the vendor.`,
        wrong: [
          `Decline because Basic tier forbids any explanation.`,
          `Read unrelated marketing copy verbatim with no context.`,
          `Insist they must finish Advanced modules first.`,
        ],
      };
    case 9:
      return {
        stem: `**Basic mastery** of this module ("${title}") is best described as:`,
        right: `You can connect "${focus}" and syllabus ideas like "${bi}" to real artifacts you might see at work.`,
        wrong: [
          `You never need to revisit the topic after the quiz.`,
          `You can ignore "${scope}" because only the title matters.`,
          `You are certified to override security policy.`,
        ],
      };
    case 10:
      return {
        stem: `Study notes framed "${focus}" for **Basic** learners. That implies you should:`,
        right: `Prioritize mental models and examples before deep edge cases or architecture debates.`,
        wrong: [
          `Start with the rarest failure modes in legacy hardware.`,
          `Skip fundamentals and jump to undocumented internals.`,
          `Treat every question as requiring executive sign-off.`,
        ],
      };
    case 11:
      return {
        stem: `Regarding "${bi}" at **Basic** depth, your main goal is to:`,
        right: `State what it refers to and how it supports "${title}" on "${track}".`,
        wrong: [
          `Prove you can rewrite vendor kernels from memory.`,
          `Eliminate all monitoring to simplify dashboards.`,
          `Avoid any connection to "${scope}".`,
        ],
      };
    default:
      return {
        stem: `What does completing the study unit on "${focus}" signal to your team?`,
        right: `You can relate "${focus}" to "${scope}" using shared vocabulary and examples.`,
        wrong: [
          `You no longer need peer review for any change.`,
          `You have implemented production changes without approval.`,
          `You have memorized the module title only.`,
        ],
      };
  }
}

function intermediateQuestion(variant: number, e: Env): QA {
  const { title, scope, focus, track, bi, group } = e;
  switch (variant) {
    case 0:
      return {
        stem: `Operationally, how does "${focus}" most often show up for someone on "${track}"?`,
        right: `In workflows, tooling, or tickets where "${scope}" connects to day-to-day ownership.`,
        wrong: [
          `Only in marketing slides unrelated to infrastructure.`,
          `Exclusively during hardware procurement unrelated to software.`,
          `Never — intermediate modules avoid operational context.`,
        ],
      };
    case 1:
      return {
        stem: `Which dependency or handoff is most plausibly linked to "${bi}" in "${title}"?`,
        right: `Adjacent teams, upstream/downstream systems, or verification steps you coordinate with.`,
        wrong: [
          `No dependencies exist once documentation is printed.`,
          `Only personal calendar reminders.`,
          `Physical shipping labels exclusively.`,
        ],
      };
    case 2:
      return {
        stem: `What kind of symptom might suggest "${focus}" is misunderstood or misconfigured?`,
        right: `Repeated incidents, unclear ownership, or checks that never match expected outcomes.`,
        wrong: [
          `Successful deployments with documented verification.`,
          `Aligned metrics and quiet on-call rotations.`,
          `Peer review approval with no open risks.`,
        ],
      };
    case 3:
      return {
        stem: `You notice ambiguity about "${focus}" during a handover on "${track}". What is the best next step?`,
        right: `Clarify definitions, point to canonical docs/runbooks, and agree on verification signals.`,
        wrong: [
          `Proceed without documenting assumptions.`,
          `Disable monitoring to reduce noise.`,
          `Assign blame before gathering facts.`,
        ],
      };
    case 5:
      return {
        stem: `**Intermediate** tier on "${track}": handling "${focus}" well usually means you can:`,
        right: `Trace a realistic workflow, name verification signals, and spot a likely misconfiguration.`,
        wrong: [
          `Ignore handoffs because the module is single-player only.`,
          `Assume success if no alert fired in the last minute ever.`,
          `Skip runbooks because intuition replaces documentation.`,
        ],
      };
    case 6:
      return {
        stem: `For "${bi}" in "${title}", an **Intermediate** trainee should connect it to:`,
        right: `Neighbors in "${scope}", tooling you touch, and how you would prove it healthy or broken.`,
        wrong: [
          `Only abstract philosophy with no operational hook.`,
          `Unrelated HR policies exclusively.`,
          `A single screenshot with no follow-up checks.`,
        ],
      };
    case 7:
      return {
        stem: `Which situation suggests **Intermediate-level** gaps around "${focus}"?`,
        right: `Repeated confusion about who owns fixes or which check validates a change.`,
        wrong: [
          `Documented verification passes and owners are clear.`,
          `Metrics match expectations after a controlled rollout.`,
          `On-call has a agreed triage path for this area.`,
        ],
      };
    case 8:
      return {
        stem: `On "${track}", **Intermediate** depth for "${scope}" most emphasizes:`,
        right: `Operational wiring — how "${focus}" behaves day-to-day and what breaks first.`,
        wrong: [
          `Choosing desktop wallpaper for status pages.`,
          `Eliminating all stakeholder communication.`,
          `Avoiding any measurement of outcomes.`,
        ],
      };
    case 9:
      return {
        stem: `During triage touching "${focus}", **Intermediate** practice includes:`,
        right: `Structured checks, evidence from logs or metrics, and clear escalation when stuck.`,
        wrong: [
          `Restarting services randomly until something changes.`,
          `Deleting traces to reduce ticket noise.`,
          `Closing tickets with no root-cause note.`,
        ],
      };
    case 10:
      return {
        stem: `**Intermediate** expectation: you can place "${bi}" inside:`,
        right: `The broader story of "${title}" — inputs, outputs, and who depends on it.`,
        wrong: [
          `A vacuum with no systems context.`,
          `Only historical footnotes with no current use.`,
          `Unrelated product launches from another division.`,
        ],
      };
    case 11:
      return {
        stem: `Which habit best separates **Intermediate** from **Basic** mastery of "${focus}" for ${group}?`,
        right: `You name a failure symptom and the first diagnostic or metric you would inspect.`,
        wrong: [
          `You memorize buzzwords without operational meaning.`,
          `You refuse to document what you checked.`,
          `You treat every issue as purely random noise.`,
        ],
      };
    default:
      return {
        stem: `For "${group}" teams, which habit best tests intermediate mastery of "${focus}"?`,
        right: `You can sketch inputs/outputs and name one failure mode you would watch for.`,
        wrong: [
          `You avoid naming any monitoring signal.`,
          `You delegate all thinking to vendor support automatically.`,
          `You rely solely on module titles without context.`,
        ],
      };
  }
}

function advancedQuestion(variant: number, e: Env): QA {
  const { scope, focus, track, bi, title } = e;
  switch (variant) {
    case 0:
      return {
        stem: `Which tradeoff or risk is most central when scaling or changing how "${focus}" is operated?`,
        right: `Balancing agility with stability, blast radius, and compliance expectations for "${scope}".`,
        wrong: [
          `Maximizing password length only.`,
          `Choosing wallpaper themes for dashboards.`,
          `Eliminating documentation to move faster.`,
        ],
      };
    case 1:
      return {
        stem: `When "${bi}" affects production outcomes, advanced practice emphasizes:`,
        right: `Clear accountability, escalation paths, and rollback or containment thinking.`,
        wrong: [
          `Avoiding post-incident review entirely.`,
          `Treating every outage as purely vendor fault.`,
          `Deploying without change windows on critical paths.`,
        ],
      };
    case 2:
      return {
        stem: `Which governance angle most often constrains decisions about "${focus}" at advanced depth?`,
        right: `Security boundaries, change approvals, data handling, or regulatory obligations your org applies.`,
        wrong: [
          `Only font choices in PDF exports.`,
          `Whether lunch breaks are synchronized.`,
          `IDE theme preferences.`,
        ],
      };
    case 3:
      return {
        stem: `How should an advanced operator evaluate a proposed change touching "${focus}"?`,
        right: `Assess dependencies, failure modes, verification, and rollback before approving execution.`,
        wrong: [
          `Approve if the slide deck has enough animations.`,
          `Ship immediately if tests were skipped for speed.`,
          `Rely on a single ping check as full validation.`,
        ],
      };
    case 5:
      return {
        stem: `**Advanced** tier on "${track}": operating "${focus}" responsibly requires weighing:`,
        right: `Blast radius, compliance or security constraints, and rollback or containment options.`,
        wrong: [
          `Only cosmetic wording in email templates.`,
          `Whether the team likes the module font.`,
          `Speed at the expense of every control.`,
        ],
      };
    case 6:
      return {
        stem: `When "${bi}" spans production boundaries, **Advanced** accountability most means:`,
        right: `Named owners, escalation paths, and explicit risk acceptance where gaps exist.`,
        wrong: [
          `Blaming a single junior engineer by default.`,
          `Hiding incidents from leadership always.`,
          `Skipping post-incident learning as policy.`,
        ],
      };
    case 7:
      return {
        stem: `Which question fits an **Advanced** critique of "${focus}" in "${scope}"?`,
        right: `What single change could cause the largest customer-visible failure — and how is it mitigated?`,
        wrong: [
          `What color should the chart legend be?`,
          `Should we remove all backups to save disk?`,
          `Can we forbid documentation entirely?`,
        ],
      };
    case 8:
      return {
        stem: `Architecture review challenges a change affecting "${focus}" in "${scope}". A strong **Advanced** reply:`,
        right: `Maps dependencies, failure modes, verification, rollback, and policy alignment.`,
        wrong: [
          `"Trust me" with no evidence or plan.`,
          `Claims no testing is needed for speed.`,
          `Asserts vendors absorb all risk automatically.`,
        ],
      };
    case 9:
      return {
        stem: `**Advanced** depth for "${focus}" implies you can articulate:`,
        right: `Tradeoffs, constraints, and who must sign off when uncertainty or risk is high.`,
        wrong: [
          `Only the module title spelled correctly.`,
          `That risk never applies to your org.`,
          `That rollback is never necessary.`,
        ],
      };
    case 10:
      return {
        stem: `Governance-wise, "${focus}" at **Advanced** level most often intersects with:`,
        right: `Change windows, data handling rules, identity or segmentation, and audit expectations.`,
        wrong: [
          `Personal music playlists during work.`,
          `Office snack rotation schedules.`,
          `Unrelated social media policy only.`,
        ],
      };
    case 11:
      return {
        stem: `For "${focus}", **Advanced** operators treat rollback and blast radius as:`,
        right: `First-class design inputs — planned before execution, not improvised after failure.`,
        wrong: [
          `Somebody else's problem once deployed.`,
          `Optional if the deploy feels fast.`,
          `Unnecessary if logs look quiet for five minutes.`,
        ],
      };
    default:
      return {
        stem: `On "${track}", what distinguishes advanced mastery of "${title}" from memorization?`,
        right: `You can defend tradeoffs, cite constraints, and outline stakeholder impact for "${focus}".`,
        wrong: [
          `Reciting definitions without connecting to risk.`,
          `Claiming "${scope}" never interacts with other domains.`,
          `Avoiding peer review for architectural choices.`,
        ],
      };
  }
}

const VARIANTS = 12;

function buildQuestion(
  tier: "Basic" | "Intermediate" | "Advanced",
  index: number,
  env: Env,
): QA {
  /** Spread templates across 25 items; 12 stems per tier reduces repetition with short syllabi. */
  const variant = (index * 7 + Math.floor(index / 3) * 2) % VARIANTS;
  if (tier === "Basic") return basicQuestion(variant, env);
  if (tier === "Intermediate") return intermediateQuestion(variant, env);
  return advancedQuestion(variant, env);
}

/**
 * Twenty-five MCQs tailored to resolved topic focus, learning-track depth, and curriculum bullets.
 * Deterministic shuffle per seed.
 */
export function generateTopicTrackLevelQuizItems(
  seed: number,
  ctx: ResolvedTrainingContext,
  topicBullets: string[],
  moduleTitle: string,
): ModuleQuizItem[] {
  const rng = mulberry32(seed);
  const title = moduleTitle.trim() || "this module";
  const bullets = topicBullets.length > 0 ? topicBullets : [ctx.topicFocus];
  const scope = ctx.majorTopic ?? ctx.topicFocus;
  const tier = effectiveTier(ctx.level);
  const focus = ctx.topicFocus;
  const track = ctx.trackLabel;
  const group = ctx.group ?? "your platform";

  const out: ModuleQuizItem[] = [];
  for (let i = 0; i < QCOUNT; i++) {
    const bi = bullets[i % bullets.length] ?? focus;
    const qa = buildQuestion(tier, i, { title, scope, focus, track, bi, group });
    const { ordered, correctIndex } = shuffleChoices([qa.right, ...qa.wrong], rng);
    out.push({
      question: qa.stem,
      choices: ordered,
      correctIndex,
    });
  }

  return out;
}
