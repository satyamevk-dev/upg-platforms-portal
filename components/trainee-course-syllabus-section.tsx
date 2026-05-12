import type { ReactNode } from "react";
import type { LinuxSyllabusTrackSection } from "@/lib/linux-syllabus-for-plan";
import { PORTAL_SURFACE } from "@/lib/portal-ui-classes";

type Props = {
  title: string;
  syllabusFilePath: string;
  body: ReactNode;
  sections: LinuxSyllabusTrackSection[];
};

const levelAccent: Record<string, string> = {
  Basic: "from-[#b23d1e]/15 to-[#F46036]/5 ring-[#F46036]/20",
  Intermediate: "from-[#4FCEC0]/12 to-[#4FCEC0]/5 ring-[#4FCEC0]/15",
  Advanced: "from-slate-600/10 to-slate-500/5 ring-slate-400/20",
};

export function TraineeCourseSyllabusSection({ title, syllabusFilePath, body, sections }: Props) {
  if (sections.length === 0) return null;

  return (
    <div className="border-t border-[#D0D3E7]/90 bg-gradient-to-b from-slate-50/40 to-white/30 px-6 py-8 sm:px-10 sm:py-10">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#b23d1e]">Reference</p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">{title}</h2>
        </div>
      </div>
      <div className="max-w-3xl text-sm leading-relaxed text-slate-600">
        <p>
          Aligned with{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-800">{syllabusFilePath}</code>
          {body}
        </p>
      </div>

      <div className="mt-8 space-y-8">
        {sections.map((sec) => {
          const accent = levelAccent[sec.level] ?? levelAccent.Basic;
          return (
            <section
              key={sec.level}
              aria-labelledby={`syllabus-${sec.level}`}
              className={`overflow-hidden ${PORTAL_SURFACE}`}
            >
              <div
                className={`border-b border-[#D0D3E7] bg-gradient-to-r px-5 py-4 sm:px-6 ${accent} ring-1 ring-inset`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 id={`syllabus-${sec.level}`} className="text-base font-bold text-slate-900">
                    {sec.level}
                  </h3>
                  <p className="text-xs font-medium text-slate-600 sm:text-sm">
                    <span className="text-slate-500">Est. </span>
                    {sec.effort}
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#D0D3E7] bg-[#F7F7FF]">
                      <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        #
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        ID
                      </th>
                      <th className="min-w-[12rem] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Topic
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Plan
                      </th>
                      <th className="min-w-[14rem] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Guide path
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sec.modules.map((row, idx) => (
                      <tr
                        key={row.id}
                        className={`border-b border-[#D0D3E7] transition-colors last:border-b-0 ${
                          row.inPlan ? "bg-[#ECFBFA]/95 hover:bg-[#D8F6F3]" : "bg-white hover:bg-slate-50/80"
                        }`}
                      >
                        <td className="whitespace-nowrap px-4 py-3 tabular-nums text-slate-500">{idx + 1}</td>
                        <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-800">{row.id}</td>
                        <td className="px-4 py-3 text-slate-800">{row.topic}</td>
                        <td className="whitespace-nowrap px-4 py-3">
                          {row.inPlan ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#F46036]/12 px-2.5 py-1 text-xs font-semibold text-[#177F78] ring-1 ring-[#F46036]/25">
                              <span className="size-1.5 rounded-full bg-[#F46036]" aria-hidden />
                              In your plan
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-mono text-[11px] leading-snug text-slate-600">{row.guidePath}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
