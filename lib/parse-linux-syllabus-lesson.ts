/**
 * Learner-facing markdown: content before `## Quiz` (and answer key), matching
 * `courses/linux/**.md` module guides used for assessments.
 */
export function extractLinuxModuleGuideLessonMarkdown(markdown: string): string | null {
  const text = markdown.replace(/\r\n/g, "\n");
  const quizMatch = text.match(/^## Quiz\s*$/m);
  const raw = quizMatch?.index !== undefined ? text.slice(0, quizMatch.index) : text;
  const body = raw.replace(/(?:\n*---\s*)+$/g, "").trim();
  if (!body) return null;
  return body;
}

/** Drop file H1 when the page already renders the plan module title as `# …`. */
export function stripLeadingMarkdownH1(markdown: string): string {
  return markdown.replace(/^#[^\n]*\n+/, "").trim();
}
