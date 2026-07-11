export type DuelStatus =
  | "invite_open"
  | "lobby"
  | "ready_check"
  | "active"
  | "finished"
  | "aborted";

export interface DuelOption {
  id: number;
  text: string;
  isCorrect: boolean;
}

export interface DuelQuestion {
  id: number;
  word: string;
  prompt: string;
  options: DuelOption[];
  answeredBy: number | null;
  submissions: Set<number>;
}

export interface DuelPlayer {
  userId: number;
  firstName: string;
  username?: string;
  score: number;
  chatId: number;
  messageId: number | null;
}

export interface ActiveDuel {
  id: string;
  inviteCode: string;
  hostId: number;
  unit: number;
  status: DuelStatus;
  players: DuelPlayer[];
  questions: DuelQuestion[];
  readyPlayers: Set<number>;
  currentQuestionIndex: number;
  questionStartedAt: number;
  questionTimer: ReturnType<typeof setTimeout> | null;
  createdAt: number;
  lastActivityAt: number;
}

export interface QueueEntry {
  userId: number;
  firstName: string;
  username?: string;
  chatId: number;
  joinedAt: number;
  waitingMessageId: number | null;
}

export type AnswerResult =
  | { kind: "not_found" }
  | { kind: "not_participant" }
  | { kind: "finished" }
  | { kind: "stale_question" }
  | { kind: "duplicate" }
  | { kind: "too_late"; duelId: string }
  | { kind: "wrong"; duelId: string; userId: number }
  | { kind: "correct"; duelId: string; userId: number; advance: boolean }
  | { kind: "both_wrong"; duelId: string; advance: boolean };

export interface DuelFinishResult {
  duelId: string;
  unit: number;
  players: [DuelPlayer, DuelPlayer];
  winnerId: number | null;
  isDraw: boolean;
}

export type DuelEvent =
  | { type: "invite_created"; duel: ActiveDuel }
  | { type: "guest_joined"; duel: ActiveDuel }
  | { type: "unit_selected"; duel: ActiveDuel }
  | { type: "ready_update"; duel: ActiveDuel }
  | { type: "question"; duel: ActiveDuel; questionIndex: number }
  | { type: "finished"; result: DuelFinishResult }
  | { type: "aborted"; duel: ActiveDuel; reason: string };
