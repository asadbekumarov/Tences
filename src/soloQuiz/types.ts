import type { DuelQuestion } from "../duel/types.js";

export interface LiveSoloGame {
  sessionId: string;
  userId: number;
  firstName: string;
  username?: string;
  chatId: number;
  messageId: number | null;
  unit: number;
  questions: DuelQuestion[];
  currentIndex: number;
  score: number;
  correctTimeMs: number;
  questionStartedAt: number;
  questionTimer: ReturnType<typeof setTimeout> | null;
  lastQuestionSecondsShown: number | null;
  locked: boolean;
}

export type SoloAnswerResult =
  | { kind: "not_found" }
  | { kind: "finished" }
  | { kind: "stale" }
  | { kind: "timeout" }
  | { kind: "wrong" }
  | { kind: "correct"; responseMs: number };
