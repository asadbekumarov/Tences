import { GROUP_QUIZ_CONFIG } from "./config.js";
import type { LiveGroupGame } from "./types.js";

export class GroupQuizManager {
  private readonly byGameId = new Map<string, LiveGroupGame>();
  private readonly chatToGame = new Map<number, string>();
  private cleanupTimer: ReturnType<typeof setInterval> | null = null;

  startCleanup(onStale: (gameId: string) => void): void {
    if (this.cleanupTimer) return;
    this.cleanupTimer = setInterval(() => {
      const now = Date.now();
      for (const [gameId, live] of this.byGameId) {
        if (live.status !== "ACTIVE") continue;
        if (now - live.lastPlayerActionAt > GROUP_QUIZ_CONFIG.INACTIVE_GAME_TIMEOUT_MS) {
          onStale(gameId);
        }
      }
    }, GROUP_QUIZ_CONFIG.CLEANUP_INTERVAL_MS);
  }

  stopCleanup(): void {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  hasChat(chatId: number): boolean {
    return this.chatToGame.has(chatId);
  }

  get(gameId: string): LiveGroupGame | undefined {
    return this.byGameId.get(gameId);
  }

  getByChat(chatId: number): LiveGroupGame | undefined {
    const id = this.chatToGame.get(chatId);
    return id ? this.byGameId.get(id) : undefined;
  }

  register(live: LiveGroupGame): void {
    this.byGameId.set(live.gameId, live);
    this.chatToGame.set(live.chatId, live.gameId);
  }

  touch(gameId: string): void {
    const live = this.byGameId.get(gameId);
    if (live) live.lastActivityAt = Date.now();
  }

  setMessageId(gameId: string, messageId: number): void {
    const live = this.byGameId.get(gameId);
    if (live) live.messageId = messageId;
  }

  clearLobbyEndTimer(gameId: string): void {
    const live = this.byGameId.get(gameId);
    if (!live?.lobbyEndTimer) return;
    clearTimeout(live.lobbyEndTimer);
    live.lobbyEndTimer = null;
  }

  clearLobbyTickInterval(gameId: string): void {
    const live = this.byGameId.get(gameId);
    if (!live?.lobbyTickInterval) return;
    clearInterval(live.lobbyTickInterval);
    live.lobbyTickInterval = null;
  }

  clearQuestionTimer(gameId: string): void {
    const live = this.byGameId.get(gameId);
    if (live?.questionTimer) {
      clearTimeout(live.questionTimer);
      live.questionTimer = null;
    }
  }

  clearInactivityTimer(gameId: string): void {
    const live = this.byGameId.get(gameId);
    if (live?.inactivityTimer) {
      clearTimeout(live.inactivityTimer);
      live.inactivityTimer = null;
    }
  }

  recordPlayerAction(gameId: string): void {
    const live = this.byGameId.get(gameId);
    if (live) {
      live.lastPlayerActionAt = Date.now();
      live.lastActivityAt = Date.now();
    }
  }

  remove(gameId: string): void {
    const live = this.byGameId.get(gameId);
    if (!live) return;
    this.clearLobbyEndTimer(gameId);
    this.clearLobbyTickInterval(gameId);
    this.clearQuestionTimer(gameId);
    this.clearInactivityTimer(gameId);
    this.chatToGame.delete(live.chatId);
    this.byGameId.delete(gameId);
  }

  shutdown(): void {
    this.stopCleanup();
    for (const gameId of [...this.byGameId.keys()]) {
      this.remove(gameId);
    }
  }
}

export const groupQuizManager = new GroupQuizManager();
