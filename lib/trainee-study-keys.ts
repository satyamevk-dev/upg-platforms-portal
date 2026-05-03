/** Stored inside `TraineePlanProgress.completedEntryIds` alongside quiz keys; never overlaps real module keys. */
export const TRAINEE_STUDY_MARKER_PREFIX = "__trainee_study__:" as const;

export function studyMarkerForModuleCompletionKey(completionKey: string): string {
  return `${TRAINEE_STUDY_MARKER_PREFIX}${completionKey}`;
}

export function isTraineeStudyMarkerEntry(id: string): boolean {
  return id.startsWith(TRAINEE_STUDY_MARKER_PREFIX);
}

/** Inner module progress key, or null if not a study marker. */
export function moduleCompletionKeyFromStudyMarker(id: string): string | null {
  if (!isTraineeStudyMarkerEntry(id)) return null;
  return id.slice(TRAINEE_STUDY_MARKER_PREFIX.length) || null;
}
