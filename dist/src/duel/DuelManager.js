import { randomBytes } from "node:crypto";
import { DUEL_CONFIG } from "./config.js";
export class DuelManager {
    queues = new Map();
    activeDuels = new Map();
    inviteCodeToDuel = new Map();
    userToDuel = new Map();
    listeners = new Set();
    cleanupTimer = null;
    startCleanup() {
        if (this.cleanupTimer)
            return;
        this.cleanupTimer = setInterval(() => this.runCleanup(), DUEL_CONFIG.CLEANUP_INTERVAL_MS);
        this.cleanupTimer.unref?.();
    }
    stopCleanup() {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
            this.cleanupTimer = null;
        }
    }
    onEvent(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
    emit(event) {
        for (const listener of this.listeners) {
            try {
                listener(event);
            }
            catch (err) {
                console.error("[DuelManager] event listener error:", err);
            }
        }
    }
    allocateDuelId() {
        return randomBytes(4).toString("hex");
    }
    allocateInviteCode() {
        return randomBytes(3).toString("hex");
    }
    isUserBusy(userId) {
        return this.userToDuel.has(userId) || this.findQueueEntry(userId) !== null;
    }
    getUserDuelId(userId) {
        return this.userToDuel.get(userId);
    }
    getDuel(duelId) {
        return this.activeDuels.get(duelId);
    }
    getDuelByInviteCode(code) {
        const duelId = this.inviteCodeToDuel.get(code);
        return duelId ? this.activeDuels.get(duelId) : undefined;
    }
    findQueueEntry(userId) {
        for (const queue of this.queues.values()) {
            const entry = queue.find((q) => q.userId === userId);
            if (entry)
                return entry;
        }
        return null;
    }
    bindUser(userId, duelId) {
        this.userToDuel.set(userId, duelId);
    }
    unbindDuel(duel) {
        for (const player of duel.players) {
            this.userToDuel.delete(player.userId);
        }
        this.inviteCodeToDuel.delete(duel.inviteCode);
        this.activeDuels.delete(duel.id);
    }
    createInvite(host) {
        if (this.isUserBusy(host.userId)) {
            throw new Error("user_busy");
        }
        const inviteCode = this.allocateInviteCode();
        const duel = {
            id: this.allocateDuelId(),
            inviteCode,
            hostId: host.userId,
            unit: 0,
            status: "invite_open",
            players: [{ ...host, score: 0, messageId: null }],
            questions: [],
            readyPlayers: new Set(),
            currentQuestionIndex: 0,
            questionStartedAt: 0,
            questionTimer: null,
            createdAt: Date.now(),
            lastActivityAt: Date.now(),
        };
        this.activeDuels.set(duel.id, duel);
        this.inviteCodeToDuel.set(inviteCode, duel.id);
        this.bindUser(host.userId, duel.id);
        this.emit({ type: "invite_created", duel });
        return duel;
    }
    joinInvite(code, guest) {
        const duel = this.getDuelByInviteCode(code);
        if (!duel)
            return { ok: false, reason: "not_found" };
        if (duel.status !== "invite_open")
            return { ok: false, reason: "full" };
        if (duel.hostId === guest.userId)
            return { ok: false, reason: "self" };
        if (this.isUserBusy(guest.userId))
            return { ok: false, reason: "busy" };
        duel.players.push({ ...guest, score: 0, messageId: null });
        duel.status = "lobby";
        duel.lastActivityAt = Date.now();
        this.bindUser(guest.userId, duel.id);
        this.emit({ type: "guest_joined", duel });
        return { ok: true, duel };
    }
    selectUnit(duelId, hostId, unit, questions) {
        const duel = this.activeDuels.get(duelId);
        if (!duel || duel.hostId !== hostId)
            return false;
        if (duel.status !== "lobby")
            return false;
        if (duel.players.length < 2)
            return false;
        duel.unit = unit;
        duel.questions = questions;
        duel.readyPlayers = new Set();
        duel.status = "ready_check";
        duel.lastActivityAt = Date.now();
        this.emit({ type: "unit_selected", duel });
        return true;
    }
    setReady(duelId, userId) {
        const duel = this.activeDuels.get(duelId);
        if (!duel || duel.status !== "ready_check")
            return false;
        if (!duel.players.some((p) => p.userId === userId))
            return false;
        duel.readyPlayers.add(userId);
        duel.lastActivityAt = Date.now();
        this.emit({ type: "ready_update", duel });
        if (duel.readyPlayers.size >= duel.players.length) {
            duel.status = "active";
            duel.currentQuestionIndex = 0;
            this.beginQuestion(duelId);
        }
        return true;
    }
    joinQueue(unit, entry) {
        if (this.isUserBusy(entry.userId))
            return null;
        const queue = this.queues.get(unit) ?? [];
        const queueEntry = {
            ...entry,
            joinedAt: Date.now(),
            waitingMessageId: null,
        };
        queue.push(queueEntry);
        this.queues.set(unit, queue);
        return queueEntry;
    }
    leaveQueue(userId) {
        for (const [unit, queue] of this.queues) {
            const index = queue.findIndex((q) => q.userId === userId);
            if (index !== -1) {
                queue.splice(index, 1);
                if (queue.length === 0)
                    this.queues.delete(unit);
                return true;
            }
        }
        return false;
    }
    setQueueWaitingMessage(userId, messageId) {
        const entry = this.findQueueEntry(userId);
        if (entry)
            entry.waitingMessageId = messageId;
    }
    tryMatch(unit) {
        const queue = this.queues.get(unit);
        if (!queue || queue.length < 2)
            return null;
        const player1 = queue.shift();
        const player2 = queue.shift();
        if (queue.length === 0)
            this.queues.delete(unit);
        return [player1, player2];
    }
    registerActiveDuel(duel) {
        this.activeDuels.set(duel.id, duel);
        this.inviteCodeToDuel.set(duel.inviteCode, duel.id);
        for (const player of duel.players) {
            this.bindUser(player.userId, duel.id);
        }
    }
    setPlayerMessage(userId, messageId) {
        const duelId = this.userToDuel.get(userId);
        if (!duelId)
            return;
        const duel = this.activeDuels.get(duelId);
        const player = duel?.players.find((p) => p.userId === userId);
        if (player)
            player.messageId = messageId;
    }
    beginQuestion(duelId) {
        const duel = this.activeDuels.get(duelId);
        if (!duel || duel.status !== "active")
            return null;
        this.clearQuestionTimer(duel);
        duel.questionStartedAt = Date.now();
        duel.lastActivityAt = Date.now();
        duel.questionTimer = setTimeout(() => this.handleQuestionTimeout(duelId), DUEL_CONFIG.QUESTION_TIMEOUT_MS);
        duel.questionTimer.unref?.();
        this.emit({ type: "question", duel, questionIndex: duel.currentQuestionIndex });
        return duel;
    }
    processAnswer(duelId, userId, questionId, optionId) {
        const duel = this.activeDuels.get(duelId);
        if (!duel)
            return { kind: "not_found" };
        if (duel.status !== "active")
            return { kind: "finished" };
        if (!duel.players.some((p) => p.userId === userId))
            return { kind: "not_participant" };
        const question = duel.questions[duel.currentQuestionIndex];
        if (!question || question.id !== questionId)
            return { kind: "stale_question" };
        if (question.submissions.has(userId))
            return { kind: "duplicate" };
        const option = question.options.find((o) => o.id === optionId);
        if (!option)
            return { kind: "stale_question" };
        duel.lastActivityAt = Date.now();
        if (option.isCorrect) {
            if (question.answeredBy !== null) {
                question.submissions.add(userId);
                return { kind: "too_late", duelId };
            }
            question.answeredBy = userId;
            question.submissions.add(userId);
            const player = duel.players.find((p) => p.userId === userId);
            if (player)
                player.score += 1;
            this.clearQuestionTimer(duel);
            return { kind: "correct", duelId, userId, advance: true };
        }
        question.submissions.add(userId);
        if (duel.players.every((p) => question.submissions.has(p.userId))) {
            this.clearQuestionTimer(duel);
            return { kind: "both_wrong", duelId, advance: true };
        }
        return { kind: "wrong", duelId, userId };
    }
    advanceQuestion(duelId) {
        const duel = this.activeDuels.get(duelId);
        if (!duel || duel.status !== "active") {
            throw new Error(`Cannot advance inactive duel ${duelId}`);
        }
        this.clearQuestionTimer(duel);
        duel.currentQuestionIndex += 1;
        duel.lastActivityAt = Date.now();
        if (duel.currentQuestionIndex >= duel.questions.length) {
            return this.finishDuel(duelId);
        }
        duel.questionStartedAt = Date.now();
        duel.questionTimer = setTimeout(() => this.handleQuestionTimeout(duelId), DUEL_CONFIG.QUESTION_TIMEOUT_MS);
        duel.questionTimer.unref?.();
        this.emit({ type: "question", duel, questionIndex: duel.currentQuestionIndex });
        return { kind: "next", duel };
    }
    handleQuestionTimeout(duelId) {
        const duel = this.activeDuels.get(duelId);
        if (!duel || duel.status !== "active")
            return;
        try {
            this.advanceQuestion(duelId);
        }
        catch (err) {
            console.error("[DuelManager] timeout advance error:", err);
        }
    }
    finishDuel(duelId) {
        const duel = this.activeDuels.get(duelId);
        if (!duel)
            throw new Error(`Duel ${duelId} not found`);
        this.clearQuestionTimer(duel);
        duel.status = "finished";
        const [p1, p2] = duel.players;
        let winnerId = null;
        if (p1.score > p2.score)
            winnerId = p1.userId;
        else if (p2.score > p1.score)
            winnerId = p2.userId;
        const result = {
            duelId,
            unit: duel.unit,
            players: [p1, p2],
            winnerId,
            isDraw: winnerId === null,
        };
        this.emit({ type: "finished", result });
        this.unbindDuel(duel);
        return result;
    }
    abortDuel(duelId, reason) {
        const duel = this.activeDuels.get(duelId);
        if (!duel)
            return;
        this.clearQuestionTimer(duel);
        duel.status = "aborted";
        this.emit({ type: "aborted", duel, reason });
        this.unbindDuel(duel);
    }
    clearQuestionTimer(duel) {
        if (duel.questionTimer) {
            clearTimeout(duel.questionTimer);
            duel.questionTimer = null;
        }
    }
    shutdown() {
        this.stopCleanup();
        for (const duelId of [...this.activeDuels.keys()]) {
            this.abortDuel(duelId, "server_shutdown");
        }
        this.queues.clear();
    }
    runCleanup() {
        const now = Date.now();
        for (const [unit, queue] of this.queues) {
            const fresh = queue.filter((q) => now - q.joinedAt < DUEL_CONFIG.QUEUE_TTL_MS);
            if (fresh.length === 0)
                this.queues.delete(unit);
            else if (fresh.length !== queue.length)
                this.queues.set(unit, fresh);
        }
        for (const [duelId, duel] of this.activeDuels) {
            const ttl = duel.status === "invite_open" || duel.status === "lobby" || duel.status === "ready_check"
                ? DUEL_CONFIG.INVITE_TTL_MS
                : DUEL_CONFIG.INACTIVE_DUEL_TIMEOUT_MS;
            if (now - duel.lastActivityAt > ttl) {
                this.abortDuel(duelId, "inactive_timeout");
            }
        }
    }
    getQueueSize(unit) {
        return this.queues.get(unit)?.length ?? 0;
    }
}
export const duelManager = new DuelManager();
