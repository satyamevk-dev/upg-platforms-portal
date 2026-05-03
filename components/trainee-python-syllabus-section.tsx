import type { LinuxSyllabusTrackSection } from "@/lib/linux-syllabus-for-plan";
import { TraineeCourseSyllabusSection } from "@/components/trainee-course-syllabus-section";

type Props = {
  sections: LinuxSyllabusTrackSection[];
};

export function TraineePythonSyllabusSection({ sections }: Props) {
  return (
    <TraineeCourseSyllabusSection
      title="Python syllabus for your assignment"
      syllabusFilePath="courses/python/syllabus.md"
      body={
        <>
          . Tracks are grouped by syllabus level (Basic, Intermediate, Advanced). Only tiers that include at least one
          of your plan&apos;s Python modules are shown. Each syllabus topic has one module guide and one end-of-topic
          quiz on a separate page. Mark study complete on every plan step mapped to that topic before the quiz unlocks;
          passing it completes every related row together. Rows marked{" "}
          <span className="font-medium text-[#006b64]">In your plan</span> match your assigned topics; others show
          where those modules sit in the full curriculum.
        </>
      }
      sections={sections}
    />
  );
}
