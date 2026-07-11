import type { LiveSoloGame } from "./types.js";

export class SoloQuizManager {
  private readonly bySession = new Map<string, LiveSoloGame>();
  private readonly userToSession = new Map<number, string>();
  private questionTicker: ReturnType<typeof setInterval> | null = null;
  private onQuestionTick: ((sessionId: string) => void) | null = null;

  setQuestionTickHandler(handler: (sessionId: string) => void): void {
    this.onQuestionTick = handler;
    this.ensureQuestionTicker();
  }

  private ensureQuestionTicker(): void {
    if (this.questionTicker) return;
    this.questionTicker = setInterval(() => {
      if (!this.onQuestionTick) return;
      for (const [sessionId, game] of this.bySession) {
        if (!game.locked) this.onQuestionTick(sessionId);
      }
    }, 1000);
  }

  hasUser(userId: number): boolean {
    return this.userToSession.has(userId);
  }

  get(sessionId: string): LiveSoloGame | undefined {
    return this.bySession.get(sessionId);
  }

  register(game: LiveSoloGame): void {
    this.bySession.set(game.sessionId, game);
    this.userToSession.set(game.userId, game.sessionId);
    this.ensureQuestionTicker();
  }

  setMessageId(sessionId: string, messageId: number): void {
    const game = this.bySession.get(sessionId);
    if (game) game.messageId = messageId;
  }

  clearQuestionTimer(sessionId: string): void {
    const game = this.bySession.get(sessionId);
    if (!game?.questionTimer) return;
    clearTimeout(game.questionTimer);
    game.questionTimer = null;
  }

  remove(sessionId: string): void {
    const game = this.bySession.get(sessionId);
    if (!game) return;
    this.clearQuestionTimer(sessionId);
    this.userToSession.delete(game.userId);
    this.bySession.delete(sessionId);
  }

  shutdown(): void {
    if (this.questionTicker) {
      clearInterval(this.questionTicker);
      this.questionTicker = null;
    }
    for (const sessionId of [...this.bySession.keys()]) {
      this.remove(sessionId);
    }
  }
}

export const soloQuizManager = new SoloQuizManager();
