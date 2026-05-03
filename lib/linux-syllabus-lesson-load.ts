import { extractLinuxModuleGuideLessonMarkdown, stripLeadingMarkdownH1 } from "@/lib/parse-linux-syllabus-lesson";
import { readLinuxModuleGuideMarkdown } from "@/lib/linux-module-guide-file";

/**
 * Lesson sections from the LINUX module guide (everything before `## Quiz`).
 * Server-only. Returns null if the file is missing or has no usable body.
 */
export function loadLinuxSyllabusModuleLessonMarkdown(topicId: string): string | null {
  const md = readLinuxModuleGuideMarkdown(topicId.trim());
  if (!md) return null;
  const lesson = extractLinuxModuleGuideLessonMarkdown(md);
  if (!lesson) return null;
  const withoutDupH1 = stripLeadingMarkdownH1(lesson);
  return withoutDupH1.trim() || lesson;
}
