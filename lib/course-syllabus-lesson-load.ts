import { extractLinuxModuleGuideLessonMarkdown, stripLeadingMarkdownH1 } from "@/lib/parse-linux-syllabus-lesson";
import { readCourseModuleGuideMarkdown } from "@/lib/course-module-guide-file";

/** Lesson markdown before `## Quiz` for any syllabus-backed course. Server-only. */
export function loadCourseSyllabusModuleLessonMarkdown(topicId: string): string | null {
  const md = readCourseModuleGuideMarkdown(topicId.trim());
  if (!md) return null;
  const lesson = extractLinuxModuleGuideLessonMarkdown(md);
  if (!lesson) return null;
  const withoutDupH1 = stripLeadingMarkdownH1(lesson);
  return withoutDupH1.trim() || lesson;
}
