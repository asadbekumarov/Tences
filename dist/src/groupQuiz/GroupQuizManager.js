import { GROUP_QUIZ_CONFIG } from "./config.js";
export class GroupQuizManager {
    byGameId = new Map();
    chatToGame = new Map();
    cleanupTimer = null;
    startCleanup(onStale) {
        if (this.cleanupTimer)
            return;
        this.cleanupTimer = setInterval(() => {
            const now = Date.now();
            for (const [gameId, live] of this.byGameId) {
                if (live.status !== "ACTIVE")
                    continue;
                if (now - live.lastPlayerActionAt > GROUP_QUIZ_CONFIG.INACTIVE_GAME_TIMEOUT_MS) {
                    onStale(gameId);
                }
            }
        }, GROUP_QUIZ_CONFIG.CLEANUP_INTERVAL_MS);
    }
    stopCleanup() {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
            this.cleanupTimer = null;
        }
    }
    hasChat(chatId) {
        return this.chatToGame.has(chatId);
    }
    get(gameId) {
        return this.byGameId.get(gameId);
    }
    getByChat(chatId) {
        const id = this.chatToGame.get(chatId);
        return id ? this.byGameId.get(id) : undefined;
    }
    register(live) {
        this.byGameId.set(live.gameId, live);
        this.chatToGame.set(live.chatId, live.gameId);
    }
    touch(gameId) {
        const live = this.byGameId.get(gameId);
        if (live)
            live.lastActivityAt = Date.now();
    }
    setMessageId(gameId, messageId) {
        const live = this.byGameId.get(gameId);
        if (live)
            live.messageId = messageId;
    }
    clearLobbyEndTimer(gameId) {
        const live = this.byGameId.get(gameId);
        if (!live?.lobbyEndTimer)
            return;
        clearTimeout(live.lobbyEndTimer);
        live.lobbyEndTimer = null;
    }
    clearLobbyTickInterval(gameId) {
        const live = this.byGameId.get(gameId);
        if (!live?.lobbyTickInterval)
            return;
        clearInterval(live.lobbyTickInterval);
        live.lobbyTickInterval = null;
    }
    clearQuestionTimer(gameId) {
        const live = this.byGameId.get(gameId);
        if (live?.questionTimer) {
            clearTimeout(live.questionTimer);
            live.questionTimer = null;
        }
    }
    clearInactivityTimer(gameId) {
        const live = this.byGameId.get(gameId);
        if (live?.inactivityTimer) {
            clearTimeout(live.inactivityTimer);
            live.inactivityTimer = null;
        }
    }
    recordPlayerAction(gameId) {
        const live = this.byGameId.get(gameId);
        if (live) {
            live.lastPlayerActionAt = Date.now();
            live.lastActivityAt = Date.now();
        }
    }
    remove(gameId) {
        const live = this.byGameId.get(gameId);
        if (!live)
            return;
        this.clearLobbyEndTimer(gameId);
        this.clearLobbyTickInterval(gameId);
        this.clearQuestionTimer(gameId);
        this.clearInactivityTimer(gameId);
        this.chatToGame.delete(live.chatId);
        this.byGameId.delete(gameId);
    }
    shutdown() {
        this.stopCleanup();
        for (const gameId of [...this.byGameId.keys()]) {
            this.remove(gameId);
        }
    }
}
export const groupQuizManager = new GroupQuizManager();
