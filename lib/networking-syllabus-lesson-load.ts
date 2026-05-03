import { readNetworkingModuleGuideMarkdown } from "@/lib/networking-module-guide-file";
import { extractLinuxModuleGuideLessonMarkdown, stripLeadingMarkdownH1 } from "@/lib/parse-linux-syllabus-lesson";

/**
 * Lesson sections from the Networking module guide (everything before `## Quiz`).
 * Server-only. Returns null if the file is missing or has no usable body.
 */
export function loadNetworkingSyllabusModuleLessonMarkdown(topicId: string): string | null {
  const md = readNetworkingModuleGuideMarkdown(topicId.trim());
  if (!md) return null;
  const lesson = extractLinuxModuleGuideLessonMarkdown(md);
  if (!lesson) return null;
  const withoutDupH1 = stripLeadingMarkdownH1(lesson);
  return withoutDupH1.trim() || lesson;
}
