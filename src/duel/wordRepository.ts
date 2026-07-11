import { prisma } from "../db/prisma.js";
import { DUEL_CONFIG } from "./config.js";
import type { DuelOption, DuelQuestion } from "./types.js";

interface SheetyRow {
  unit: number;
  word: string;
  translation: string;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickDistractors(
  pool: { translation: string }[],
  correct: string,
  count: number,
): string[] {
  const candidates = pool
    .map((w) => w.translation)
    .filter((t) => t !== correct);
  return shuffle(candidates).slice(0, count);
}

export async function ensureWordsForUnit(unit: number): Promise<void> {
  const existing = await prisma.word.count({ where: { unit } });
  if (existing > 0) return;

  const response = await fetch(DUEL_CONFIG.SHEETY_URL);
  if (!response.ok) {
    throw new Error(`Sheety API error: ${response.status}`);
  }

  const data = (await response.json()) as { varaq1?: SheetyRow[] };
  const rows = (data.varaq1 ?? []).filter((row) => row.unit === unit);

  if (rows.length === 0) {
    throw new Error(`Unit ${unit} has no vocabulary`);
  }

  for (const row of rows) {
    await prisma.word.upsert({
      where: {
        unit_word: {
          unit: row.unit,
          word: row.word.trim(),
        },
      },
      create: {
        unit: row.unit,
        word: row.word.trim(),
        translation: row.translation.trim(),
      },
      update: {
        translation: row.translation.trim(),
      },
    });
  }
}

export async function getWordCountForUnit(unit: number): Promise<number> {
  await ensureWordsForUnit(unit);
  return prisma.word.count({ where: { unit } });
}

export async function buildQuestionsForUnit(
  unit: number,
  options?: { useAllWords?: boolean },
): Promise<DuelQuestion[]> {
  await ensureWordsForUnit(unit);

  const words = await prisma.word.findMany({ where: { unit } });
  if (words.length < DUEL_CONFIG.OPTIONS_PER_QUESTION) {
    throw new Error(`Unit ${unit} has insufficient words for duels`);
  }

  const limit = options?.useAllWords
    ? words.length
    : Math.min(DUEL_CONFIG.QUESTIONS_PER_DUEL, words.length);

  const selected = shuffle(words).slice(0, limit);

  return selected.map((word, index) => {
    const distractors = pickDistractors(
      words,
      word.translation,
      DUEL_CONFIG.OPTIONS_PER_QUESTION - 1,
    );
    const optionTexts = shuffle([word.translation, ...distractors]);
    const options: DuelOption[] = optionTexts.map((text, optionId) => ({
      id: optionId,
      text,
      isCorrect: text === word.translation,
    }));

    return {
      id: index,
      word: word.word,
      prompt: `«${word.word}» so'zining tarjimasi qaysi?`,
      options,
      answeredBy: null,
      submissions: new Set<number>(),
    };
  });
}
