import { InlineKeyboard } from "grammy";
import { toDbUserId } from "../db/ids.js";
import { prisma } from "../db/prisma.js";
import { DUEL_CONFIG } from "./config.js";
import { duelManager } from "./DuelManager.js";
import { createAnswerKeyboard, createGameUnitKeyboard, createReadyKeyboard, } from "./keyboard.js";
import { buildQuestionsForUnit } from "./wordRepository.js";
function opponentOf(duel, userId) {
    return duel.players.find((p) => p.userId !== userId) ?? duel.players[0];
}
function playerOf(duel, userId) {
    const player = duel.players.find((p) => p.userId === userId);
    if (!player)
        throw new Error(`Player ${userId} not in duel ${duel.id}`);
    return player;
}
function formatQuestionText(duel, userId) {
    const me = playerOf(duel, userId);
    const opp = opponentOf(duel, userId);
    const question = duel.questions[duel.currentQuestionIndex];
    const total = duel.questions.length;
    if (!question) {
        return `🎮 <b>Game — Unit ${duel.unit}</b>\n\nSavollar tugadi.`;
    }
    const intro = duel.currentQuestionIndex === 0
        ? `🎮 Raqib: <b>${opp.firstName}</b>\nBirinchi to'g'ri javob ball oladi!\n\n`
        : "";
    return (`🎮 <b>Game — Unit ${duel.unit}</b>\n` +
        `📊 Siz: <b>${me.score}</b> | Raqib: <b>${opp.score}</b>\n\n` +
        intro +
        `❓ Savol ${duel.currentQuestionIndex + 1}/${total}\n` +
        question.prompt);
}
function formatFinishText(result) {
    const sorted = [...result.players].sort((a, b) => b.score - a.score);
    const medals = ["🏆", "🥈"];
    const lines = sorted.map((p, i) => {
        const medal = medals[i] ?? "▪️";
        const win = i === 0 && !result.isDraw ? " <i>(G'olib)</i>" : result.isDraw ? "" : "";
        return `${medal} <b>${p.firstName}</b>: ${p.score} ball${win}`;
    });
    const header = result.isDraw ? "🤝 <b>Durang!</b>" : "🎉 <b>O'yin tugadi!</b>";
    return `${header}\n\n⚔️ Unit ${result.unit}\n\n${lines.join("\n")}`;
}
function formatLobbyText(duel, userId) {
    const guest = duel.players[1];
    if (duel.hostId === userId) {
        return (`🎮 <b>Duel lobby</b>\n\n` +
            `✅ Do'stingiz qo'shildi: <b>${guest?.firstName ?? "..."}</b>\n\n` +
            `📚 Unitni tanlang (masalan: Unit 3):`);
    }
    return (`🎮 <b>Duel lobby</b>\n\n` +
        `👤 Raqib: <b>${duel.players[0].firstName}</b>\n\n` +
        `⏳ Unit tanlanishi kutilmoqda...`);
}
function formatReadyText(duel, userId) {
    const me = playerOf(duel, userId);
    const opp = opponentOf(duel, userId);
    const meReady = duel.readyPlayers.has(userId);
    const oppReady = duel.readyPlayers.has(opp.userId);
    return (`🎮 <b>Unit ${duel.unit}</b> — tayyorlik\n\n` +
        `👤 Siz: ${meReady ? "✅ Tayyor" : "⏳ Kutilmoqda"}\n` +
        `👤 ${opp.firstName}: ${oppReady ? "✅ Tayyor" : "⏳ Kutilmoqda"}\n\n` +
        (meReady ? "Raqibingizni kutyapmiz..." : "Tayyormisiz?"));
}
async function upsertUser(ctx) {
    const id = toDbUserId(ctx.userId);
    await prisma.user.upsert({
        where: { id },
        create: { id, firstName: ctx.firstName, username: ctx.username },
        update: { firstName: ctx.firstName, username: ctx.username },
    });
}
async function persistDuelResult(result) {
    const [p1, p2] = result.players;
    await prisma.$transaction(async (tx) => {
        for (const player of result.players) {
            const id = toDbUserId(player.userId);
            await tx.user.upsert({
                where: { id },
                create: { id, firstName: player.firstName, username: player.username },
                update: { firstName: player.firstName, username: player.username },
            });
        }
        await tx.duelHistory.create({
            data: {
                unit: result.unit,
                player1Id: toDbUserId(p1.userId),
                player2Id: toDbUserId(p2.userId),
                player1Score: p1.score,
                player2Score: p2.score,
                winnerId: result.winnerId !== null ? toDbUserId(result.winnerId) : null,
            },
        });
        if (result.isDraw) {
            await tx.user.updateMany({
                where: { id: { in: [toDbUserId(p1.userId), toDbUserId(p2.userId)] } },
                data: { draws: { increment: 1 } },
            });
            return;
        }
        const winnerId = result.winnerId;
        const loserId = winnerId === p1.userId ? p2.userId : p1.userId;
        const loser = await tx.user.findUniqueOrThrow({ where: { id: toDbUserId(loserId) } });
        await tx.user.update({
            where: { id: toDbUserId(winnerId) },
            data: { wins: { increment: 1 }, rating: { increment: DUEL_CONFIG.RATING_WIN_DELTA } },
        });
        await tx.user.update({
            where: { id: toDbUserId(loserId) },
            data: {
                losses: { increment: 1 },
                rating: Math.max(0, loser.rating - DUEL_CONFIG.RATING_LOSS_DELTA),
            },
        });
    });
}
async function safeEditOrSend(api, chatId, messageId, text, replyMarkup) {
    const options = { parse_mode: "HTML", reply_markup: replyMarkup };
    if (messageId) {
        try {
            await api.editMessageText(chatId, messageId, text, options);
            return messageId;
        }
        catch (err) {
            console.error("[DuelService] editMessageText failed:", err);
        }
    }
    const msg = await api.sendMessage(chatId, text, options);
    return msg.message_id;
}
export class DuelService {
    api;
    botUsername = null;
    constructor(api) {
        this.api = api;
    }
    async getBotUsername() {
        if (this.botUsername)
            return this.botUsername;
        const me = await this.api.getMe();
        this.botUsername = me.username ?? "tences_bot";
        return this.botUsername;
    }
    buildInviteLink(code) {
        return this.getBotUsername().then((u) => `https://t.me/${u}?start=game_${code}`);
    }
    gameMenuCaption() {
        return ("🎮 <b>1v1 Game</b>\n\n" +
            "Do'stingizni chaqiring yoki tasodifiy raqib bilan o'ynang.\n" +
            "20 ta savol — birinchi to'g'ri javob ball oladi!");
    }
    async createInvite(ctx) {
        if (duelManager.isUserBusy(ctx.userId)) {
            return { ok: false, reason: "busy" };
        }
        await upsertUser(ctx);
        const duel = duelManager.createInvite({
            userId: ctx.userId,
            firstName: ctx.firstName,
            username: ctx.username,
            chatId: ctx.chatId,
        });
        const link = await this.buildInviteLink(duel.inviteCode);
        return { ok: true, duel, link };
    }
    async joinInvite(code, ctx) {
        await upsertUser(ctx);
        const result = duelManager.joinInvite(code, {
            userId: ctx.userId,
            firstName: ctx.firstName,
            username: ctx.username,
            chatId: ctx.chatId,
        });
        return result.ok ? { ok: true, duel: result.duel } : { ok: false, reason: result.reason };
    }
    async selectUnit(duelId, hostId, unit) {
        if (unit < DUEL_CONFIG.MIN_UNITS || unit > DUEL_CONFIG.MAX_UNITS)
            return false;
        try {
            const questions = await buildQuestionsForUnit(unit);
            return duelManager.selectUnit(duelId, hostId, unit, questions);
        }
        catch (err) {
            console.error("[DuelService] selectUnit failed:", err);
            return false;
        }
    }
    setReady(duelId, userId) {
        return duelManager.setReady(duelId, userId);
    }
    async renderInviteWaiting(duel, link) {
        const host = duel.players[0];
        const text = `🎮 <b>Duel yaratildi!</b>\n\n` +
            `Do'stingizga shu havolani yuboring:\n` +
            `<code>${link}</code>\n\n` +
            `⏳ Do'st kutilmoqda...`;
        const messageId = await safeEditOrSend(this.api, host.chatId, host.messageId, text);
        duelManager.setPlayerMessage(host.userId, messageId);
    }
    async renderLobby(duel) {
        await Promise.all(duel.players.map(async (player) => {
            const text = formatLobbyText(duel, player.userId);
            const keyboard = duel.hostId === player.userId
                ? createGameUnitKeyboard(duel.id, 1)
                : undefined;
            const messageId = await safeEditOrSend(this.api, player.chatId, player.messageId, text, keyboard);
            duelManager.setPlayerMessage(player.userId, messageId);
        }));
    }
    async renderReadyScreen(duel) {
        await Promise.all(duel.players.map(async (player) => {
            const text = formatReadyText(duel, player.userId);
            const isReady = duel.readyPlayers.has(player.userId);
            const messageId = await safeEditOrSend(this.api, player.chatId, player.messageId, text, createReadyKeyboard(duel.id, isReady));
            duelManager.setPlayerMessage(player.userId, messageId);
        }));
    }
    async notifyGuestJoined(duel) {
        const host = duel.players[0];
        const guest = duel.players[1];
        try {
            await this.api.sendMessage(host.chatId, `🎉 <b>${guest.firstName}</b> duelga qo'shildi! Unit tanlang.`, { parse_mode: "HTML" });
        }
        catch (err) {
            console.error("[DuelService] notifyGuestJoined failed:", err);
        }
    }
    async joinQueue(unit, ctx) {
        if (unit < DUEL_CONFIG.MIN_UNITS || unit > DUEL_CONFIG.MAX_UNITS) {
            return { status: "error", message: "Noto'g'ri unit." };
        }
        await upsertUser(ctx);
        const entry = duelManager.joinQueue(unit, {
            userId: ctx.userId,
            firstName: ctx.firstName,
            username: ctx.username,
            chatId: ctx.chatId,
        });
        if (!entry)
            return { status: "busy" };
        const pair = duelManager.tryMatch(unit);
        if (!pair)
            return { status: "waiting", entry };
        try {
            const questions = await buildQuestionsForUnit(unit);
            const duel = {
                id: duelManager.allocateDuelId(),
                inviteCode: duelManager.allocateInviteCode(),
                hostId: pair[0].userId,
                unit,
                status: "ready_check",
                players: [
                    {
                        userId: pair[0].userId,
                        firstName: pair[0].firstName,
                        username: pair[0].username,
                        score: 0,
                        chatId: pair[0].chatId,
                        messageId: pair[0].waitingMessageId,
                    },
                    {
                        userId: pair[1].userId,
                        firstName: pair[1].firstName,
                        username: pair[1].username,
                        score: 0,
                        chatId: pair[1].chatId,
                        messageId: pair[1].waitingMessageId,
                    },
                ],
                questions,
                readyPlayers: new Set(),
                currentQuestionIndex: 0,
                questionStartedAt: 0,
                questionTimer: null,
                createdAt: Date.now(),
                lastActivityAt: Date.now(),
            };
            duelManager.registerActiveDuel(duel);
            await this.renderReadyScreen(duel);
            return { status: "matched", duel };
        }
        catch (err) {
            console.error("[DuelService] random match failed:", err);
            duelManager.leaveQueue(pair[0].userId);
            duelManager.leaveQueue(pair[1].userId);
            return { status: "error", message: "Duel yaratishda xatolik." };
        }
    }
    leaveQueue(userId) {
        return duelManager.leaveQueue(userId);
    }
    async renderQuestion(duel) {
        const question = duel.questions[duel.currentQuestionIndex];
        if (!question)
            return;
        const keyboard = createAnswerKeyboard(duel);
        await Promise.all(duel.players.map(async (player) => {
            const text = formatQuestionText(duel, player.userId);
            try {
                const messageId = await safeEditOrSend(this.api, player.chatId, player.messageId, text, keyboard);
                duelManager.setPlayerMessage(player.userId, messageId);
            }
            catch (err) {
                console.error(`[DuelService] renderQuestion failed:`, err);
            }
        }));
    }
    processAnswer(duelId, userId, questionId, optionId) {
        return duelManager.processAnswer(duelId, userId, questionId, optionId);
    }
    async handleAnswerResult(result) {
        if (result.kind === "correct" && result.advance) {
            await this.advanceDuel(result.duelId);
        }
        else if (result.kind === "both_wrong" && result.advance) {
            await this.advanceDuel(result.duelId);
        }
    }
    async advanceDuel(duelId) {
        try {
            duelManager.advanceQuestion(duelId);
        }
        catch (err) {
            console.error("[DuelService] advanceDuel error:", err);
            duelManager.abortDuel(duelId, "advance_error");
        }
    }
    async finishDuel(result) {
        try {
            await persistDuelResult(result);
        }
        catch (err) {
            console.error("[DuelService] persistDuelResult error:", err);
        }
        const text = formatFinishText(result);
        const keyboard = new InlineKeyboard().text("🎮 Yana o'ynash", "game_menu");
        await Promise.all(result.players.map(async (player) => {
            try {
                await safeEditOrSend(this.api, player.chatId, player.messageId, text, keyboard);
            }
            catch (err) {
                console.error(`[DuelService] finish message failed:`, err);
            }
        }));
    }
    async abortDuel(duel, reason) {
        const text = reason === "server_shutdown"
            ? "⚠️ Server qayta ishga tushdi. O'yin bekor qilindi."
            : "⚠️ O'yin vaqti tugadi yoki bekor qilindi.";
        const keyboard = new InlineKeyboard().text("🎮 Game", "game_menu");
        await Promise.all(duel.players.map(async (player) => {
            try {
                await safeEditOrSend(this.api, player.chatId, player.messageId, text, keyboard);
            }
            catch (err) {
                console.error("[DuelService] abort notify failed:", err);
            }
        }));
    }
}
