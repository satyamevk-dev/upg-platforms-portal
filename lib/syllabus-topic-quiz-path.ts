import { getTrainingSourceForTopicId } from "@/lib/training-topic-source";
import { syllabusQuizSlugForTrainingGroup } from "@/lib/course-catalog-syllabus";

/** URL segment after `/client/plans/.../quiz/cohort/` and matching API route. */
export function syllabusCohortQuizSlugForTopicId(topicId: string): string | null {
  const g = getTrainingSourceForTopicId(topicId.trim())?.group;
  return syllabusQuizSlugForTrainingGroup(g);
}

export function traineeSyllabusTopicQuizClientPath(planId: string, topicId: string): string | null {
  const slug = syllabusCohortQuizSlugForTopicId(topicId);
  if (!slug) return null;
  return `/client/plans/${encodeURIComponent(planId)}/quiz/cohort/${slug}/${encodeURIComponent(topicId)}`;
}

export function traineeSyllabusTopicQuizApiPath(planId: string, topicId: string): string | null {
  const slug = syllabusCohortQuizSlugForTopicId(topicId);
  if (!slug) return null;
  return `/api/trainee/plans/${encodeURIComponent(planId)}/quiz/cohort/${slug}/${encodeURIComponent(topicId)}`;
}
