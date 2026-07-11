export class SoloQuizManager {
    bySession = new Map();
    userToSession = new Map();
    questionTicker = null;
    onQuestionTick = null;
    setQuestionTickHandler(handler) {
        this.onQuestionTick = handler;
        this.ensureQuestionTicker();
    }
    ensureQuestionTicker() {
        if (this.questionTicker)
            return;
        this.questionTicker = setInterval(() => {
            if (!this.onQuestionTick)
                return;
            for (const [sessionId, game] of this.bySession) {
                if (!game.locked)
                    this.onQuestionTick(sessionId);
            }
        }, 1000);
    }
    hasUser(userId) {
        return this.userToSession.has(userId);
    }
    get(sessionId) {
        return this.bySession.get(sessionId);
    }
    register(game) {
        this.bySession.set(game.sessionId, game);
        this.userToSession.set(game.userId, game.sessionId);
        this.ensureQuestionTicker();
    }
    setMessageId(sessionId, messageId) {
        const game = this.bySession.get(sessionId);
        if (game)
            game.messageId = messageId;
    }
    clearQuestionTimer(sessionId) {
        const game = this.bySession.get(sessionId);
        if (!game?.questionTimer)
            return;
        clearTimeout(game.questionTimer);
        game.questionTimer = null;
    }
    remove(sessionId) {
        const game = this.bySession.get(sessionId);
        if (!game)
            return;
        this.clearQuestionTimer(sessionId);
        this.userToSession.delete(game.userId);
        this.bySession.delete(sessionId);
    }
    shutdown() {
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
