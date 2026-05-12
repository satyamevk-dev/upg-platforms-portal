"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { QuizQuestionPublic } from "@/lib/module-quiz";
import { parseJsonResponse } from "@/lib/parse-json-response";
import { PORTAL_CARD, PORTAL_INSET, PORTAL_SURFACE } from "@/lib/portal-ui-classes";

type Props = {
  planId: string;
  headline: string;
  quizQuestions: QuizQuestionPublic[];
  submitPath: string;
  moduleOrder: number;
};

export function TraineeQuizPageClient({ planId, headline, quizQuestions, submitPath, moduleOrder }: Props) {
  return (
    <TraineeQuizPageForm
      key={`${planId}:${moduleOrder}:${quizQuestions.length}`}
      planId={planId}
      headline={headline}
      quizQuestions={quizQuestions}
      submitPath={submitPath}
      moduleOrder={moduleOrder}
    />
  );
}

function TraineeQuizPageForm({ planId, headline, quizQuestions, submitPath, moduleOrder }: Props) {
  const router = useRouter();
  const [answers, setAnswers] = useState<number[]>(() =>
    Array.from({ length: quizQuestions.length }, () => -1),
  );
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [planId, moduleOrder, quizQuestions.length]);

  async function submitQuiz() {
    setError(null);
    if (answers.some((a) => a < 0)) {
      setError("Answer every question before submitting.");
      return;
    }
    setPending(true);
    try {
      const res = await fetch(submitPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
        credentials: "same-origin",
      });
      const data = await parseJsonResponse<{ ok?: boolean; error?: string }>(res);
      if (!res.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "Quiz submission failed");
      }
      if (data.ok === true) {
        router.push(`/client/plans/${encodeURIComponent(planId)}`);
        router.refresh();
        return;
      }
      throw new Error("Unexpected quiz response");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-8">
      <header className={PORTAL_CARD}>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F46036]">Knowledge check</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{headline}</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          {quizQuestions.length} question{quizQuestions.length === 1 ? "" : "s"}. Choose one answer each; you get
          immediate feedback after each selection. Submit when finished.
        </p>
      </header>

      <section className={`overflow-hidden ${PORTAL_SURFACE}`}>
        <div className="space-y-8 px-6 py-8 sm:px-8">
          <ol className="space-y-8">
            {quizQuestions.map((q, qi) => (
              <li key={qi} className={`${PORTAL_INSET} p-5 sm:p-6`}>
                <div className="flex gap-3">
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#F46036]/15 text-sm font-bold text-[#b23d1e]">
                    {qi + 1}
                  </span>
                  <p className="min-w-0 flex-1 font-semibold leading-snug text-slate-900">{q.question}</p>
                </div>
                <ul className="mt-5 space-y-2">
                  {q.choices.map((choice, ci) => {
                    const id = `q${qi}-c${ci}`;
                    const picked = answers[qi];
                    const selected = picked === ci;
                    const answered = picked >= 0;
                    const correctIdx = q.correctIndex;
                    const isCorrectOption = ci === correctIdx;
                    let rowClass =
                      "flex gap-3 rounded-xl border p-3 text-sm leading-relaxed transition-colors sm:p-4 ";
                    if (!answered) {
                      rowClass += selected
                        ? "cursor-pointer border-[#F46036] bg-[#ECFBFA] shadow-sm"
                        : "cursor-pointer border-[#D0D3E7] bg-white hover:border-[#AAB3CE]";
                    } else if (isCorrectOption) {
                      rowClass += "border-emerald-400 bg-emerald-50/90 shadow-sm";
                    } else if (selected) {
                      rowClass += "border-rose-400 bg-rose-50/90";
                    } else {
                      rowClass += "border-[#D0D3E7]/80 bg-white/60 opacity-80";
                    }

                    return (
                      <li key={ci}>
                        <label htmlFor={id} className={rowClass}>
                          <input
                            type="radio"
                            name={`q-${qi}`}
                            id={id}
                            checked={selected}
                            onChange={() => {
                              setAnswers((prev) => {
                                const next = [...prev];
                                next[qi] = ci;
                                return next;
                              });
                            }}
                            className="mt-0.5 size-4 shrink-0 accent-[#F46036] disabled:cursor-not-allowed"
                            disabled={pending}
                          />
                          <span className="text-slate-800">
                            {choice}
                            {answered && isCorrectOption && answers[qi] !== q.correctIndex ? (
                              <span className="ml-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                                Correct answer
                              </span>
                            ) : null}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
                {answers[qi] >= 0 ? (
                  <p
                    role="status"
                    aria-live="polite"
                    className={`mt-4 rounded-lg px-3 py-2 text-sm font-medium ${
                      answers[qi] === q.correctIndex
                        ? "bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200"
                        : "bg-rose-50 text-rose-900 ring-1 ring-rose-200"
                    }`}
                  >
                    {answers[qi] === q.correctIndex
                      ? "Correct — nice work."
                      : "Incorrect — the correct choice is highlighted above. You can pick another option to try again."}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
          {error ? (
            <p className="text-sm font-medium text-rose-700" role="alert">
              {error}
            </p>
          ) : null}
        </div>
        <div className="flex flex-col gap-3 border-t border-[#D0D3E7] bg-[#F7F7FF]/60 px-6 py-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-8">
          <button
            type="button"
            disabled={pending}
            onClick={() => void submitQuiz()}
            className="inline-flex justify-center rounded-xl bg-[#F46036] px-5 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-[#d44a20] disabled:opacity-60 sm:min-w-[140px]"
          >
            {pending ? "Submitting…" : "Submit quiz"}
          </button>
          <Link
            href={`/client/plans/${encodeURIComponent(planId)}`}
            className="inline-flex justify-center rounded-xl border border-[#D0D3E7] bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm hover:bg-[#F7F7FF]"
          >
            Back to plan
          </Link>
        </div>
      </section>
    </div>
  );
}
