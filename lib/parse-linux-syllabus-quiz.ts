import type { ModuleQuizItem } from "@/lib/exercise-details-json";

type ParsedBlock = { num: number; stem: string; choices: string[] };

/**
 * Parses the `## Quiz` / `## Answer key` blocks from a `courses/linux/**.md` module file.
 * Expects 3 choices (A–C) per question and a compact answer line like `1. **B** · 2. **A**`.
 */
export function parseLinuxSyllabusQuizMarkdown(markdown: string): ModuleQuizItem[] | null {
  const quizMatch = markdown.match(/^## Quiz\s*$/m);
  if (!quizMatch || quizMatch.index === undefined) return null;

  const afterQuiz = markdown.slice(quizMatch.index + quizMatch[0].length);
  const keyMatch = afterQuiz.match(/^## Answer key\s*$/m);
  const quizBody = keyMatch?.index !== undefined ? afterQuiz.slice(0, keyMatch.index) : afterQuiz;
  const answerSection = keyMatch?.index !== undefined ? afterQuiz.slice(keyMatch.index) : "";

  const answerByNum = new Map<number, number>();
  const ansRe = /(\d+)\.\s*\*\*([A-Ca-c])\*\*/g;
  let am: RegExpExecArray | null;
  while ((am = ansRe.exec(answerSection)) !== null) {
    const n = Number.parseInt(am[1]!, 10);
    const letter = am[2]!.toUpperCase();
    if (!Number.isInteger(n) || n < 1) continue;
    answerByNum.set(n, letter.charCodeAt(0) - "A".charCodeAt(0));
  }

  const blocks = parseQuizQuestionBlocks(quizBody);
  if (blocks.length === 0 || answerByNum.size === 0) return null;
  if (blocks.length !== answerByNum.size) return null;

  blocks.sort((a, b) => a.num - b.num);

  const out: ModuleQuizItem[] = [];
  for (const b of blocks) {
    const correct = answerByNum.get(b.num);
    if (correct === undefined || correct < 0 || correct > 2) return null;
    if (b.choices.length !== 3) return null;
    out.push({
      question: b.stem,
      choices: b.choices,
      correctIndex: correct,
    });
  }
  return out;
}

function parseQuizQuestionBlocks(quizBody: string): ParsedBlock[] {
  const raw = quizBody.trim();
  if (!raw) return [];

  const parts = raw.split(/(?=^\d+\.\s+)/m).filter((p) => /^\d+\.\s+/.test(p.trim()));
  const blocks: ParsedBlock[] = [];

  for (const part of parts) {
    const lines = part
      .trim()
      .split(/\r?\n/)
      .map((l) => l.replace(/\s+$/, ""));
    const first = lines[0]?.match(/^(\d+)\.\s+(.*)$/);
    if (!first) continue;
    const num = Number.parseInt(first[1]!, 10);
    if (!Number.isInteger(num) || num < 1) continue;

    const stemLines: string[] = [first[2]!.trim()];
    const choices: string[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]!;
      const choice = line.match(/^\s*([ABC])\)\s*(.*)$/i);
      if (choice) {
        choices.push(choice[2]!.trim());
      } else if (choices.length === 0 && line.trim()) {
        stemLines.push(line.trim());
      }
    }

    if (choices.length !== 3) continue;
    blocks.push({ num, stem: stemLines.join(" ").trim(), choices });
  }

  return blocks;
}
