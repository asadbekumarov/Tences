import type { GameStatus } from "@prisma/client";

export interface QuizOption {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface LiveGroupGame {
  gameId: string;
  chatId: number;
  messageId: number | null;
  unit: number;
  status: GameStatus;
  hostUserId: number;
  currentIndex: number;
  totalQuestions: number;
  lobbyEndsAt: number;
  lobbyEndTimer: ReturnType<typeof setTimeout> | null;
  lobbyTickInterval: ReturnType<typeof setInterval> | null;
  lobbyPlayersCache: { firstName: string }[];
  lobbyPlayersDirty: boolean;
  lastLobbySecondsShown: number | null;
  questionTimer: ReturnType<typeof setTimeout> | null;
  inactivityTimer: ReturnType<typeof setTimeout> | null;
  lastPlayerActionAt: number;
  lastActivityAt: number;
}

export interface JoinPlayerInput {
  userId: number;
  firstName: string;
  username?: string;
}

export type ClaimAnswerResult =
  | { ok: true; firstName: string; word: string }
  | { ok: false; reason: "already_answered" | "wrong" | "not_found" | "finished" };
