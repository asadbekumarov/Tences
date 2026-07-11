import { randomUUID } from "node:crypto";
import { toDbUserId } from "../db/ids.js";
import { prisma } from "../db/prisma.js";
import { buildQuestionsForUnit } from "../duel/wordRepository.js";
import { SOLO_QUIZ_CONFIG } from "./config.js";
import { escapeHtml } from "../utils/html.js";
import { createSoloAnswerKeyboard, createSoloUnitKeyboard, soloMenuKeyboard, soloPlayAgainKeyboard, } from "./keyboard.js";
import { soloQuizManager } from "./SoloQuizManager.js";
function displayName(firstName, username) {
    const safe = escapeHtml(firstName);
    return username ? `@${escapeHtml(username)}` : safe;
}
function formatQuestion(game) {
    const q = game.questions[game.currentIndex];
    const total = game.questions.length;
    const elapsed = Math.max(0, SOLO_QUIZ_CONFIG.QUESTION_TIMEOUT_MS - (Date.now() - game.questionStartedAt));
    const secLeft = Math.ceil(elapsed / 1000);
    return (`🎮 <b>Unit ${game.unit}</b> | Ball: <b>${game.score}</b>\n\n` +
        `❓ Savol ${game.currentIndex + 1}/${total}\n` +
        `⏳ <b>${secLeft}</b> soniya\n\n` +
        q.prompt);
}
function formatSessionResult(game) {
    const total = game.questions.length;
    const pct = total > 0 ? Math.round((game.score / total) * 100) : 0;
    return (`🏁 <b>O'yin tugadi!</b>\n\n` +
        `📚 Unit ${game.unit}\n` +
        `✅ To'g'ri: <b>${game.score}/${total}</b> (${pct}%)\n` +
        `⚡ O'rtacha tezlik: <b>${game.score > 0 ? Math.round(game.correctTimeMs / game.score / 100) / 10 : 0}s</b>`);
}
async function upsertUser(ctx) {
    await prisma.user.upsert({
        where: { id: toDbUserId(ctx.userId) },
        create: {
            id: toDbUserId(ctx.userId),
            firstName: ctx.firstName,
            username: ctx.username,
        },
        update: { firstName: ctx.firstName, username: ctx.username },
    });
}
export class SoloQuizService {
    api;
    constructor(api) {
        this.api = api;
    }
    menuCaption() {
        return ("🎮 <b>Bot bilan o'yin</b>\n\n" +
            "Unit tanlang — unitdagi <b>barcha so'zlar</b>.\n" +
            "Har savolga <b>5 soniya</b>.\n" +
            "Xato yoki vaqt tugasa — keyingi savol.\n\n" +
            "🏆 Umumiy reyting: eng ko'p to'g'ri va tez javob berganlar yuqorida.");
    }
    async formatGlobalLeaderboard(currentUserId) {
        const all = await prisma.user.findMany({
            where: { soloGames: { gt: 0 } },
        });
        if (all.length === 0) {
            return "🏆 <b>Reyting</b>\n\nHali hech kim o'yin o'ynamagan.";
        }
        const ranked = all
            .map((u) => ({
            user: u,
            avgScore: u.soloScore / u.soloGames,
            avgTimeSec: u.soloScore > 0 ? Number(u.soloTimeMs) / u.soloScore / 1000 : Infinity,
        }))
            .sort((a, b) => {
            if (b.avgScore !== a.avgScore)
                return b.avgScore - a.avgScore;
            return a.avgTimeSec - b.avgTimeSec;
        });
        const top = ranked.slice(0, SOLO_QUIZ_CONFIG.LEADERBOARD_SIZE);
        const myRank = ranked.findIndex((r) => r.user.id === toDbUserId(currentUserId)) + 1;
        const medals = ["🥇", "🥈", "🥉"];
        const lines = top.map((r, i) => {
            const medal = medals[i] ?? `${i + 1}.`;
            const name = displayName(r.user.firstName, r.user.username);
            const avgSec = r.avgTimeSec === Infinity ? "—" : r.avgTimeSec.toFixed(1);
            const marker = r.user.id === toDbUserId(currentUserId) ? " 👈" : "";
            return (`${medal} ${name} — ` +
                `<b>${r.avgScore.toFixed(1)}</b> o'rtacha ball, ${avgSec}s${marker}`);
        });
        let footer = `\n\n👥 Jami: <b>${ranked.length}</b> o'yinchi`;
        if (myRank > 0) {
            footer += `\n📍 Sizning o'rningiz: <b>#${myRank}</b>`;
        }
        else {
            footer += `\n📍 Hali reytingda yo'qsiz — birinchi o'yiningizni boshlang!`;
        }
        return `🏆 <b>Umumiy reyting</b>\n\n${lines.join("\n")}${footer}`;
    }
    async startGame(ctx, unit, messageId) {
        if (soloQuizManager.hasUser(ctx.userId)) {
            return { ok: false, reason: "busy" };
        }
        if (unit < SOLO_QUIZ_CONFIG.MIN_UNIT || unit > SOLO_QUIZ_CONFIG.MAX_UNIT) {
            return { ok: false, reason: "bad_unit" };
        }
        await upsertUser(ctx);
        let questions;
        try {
            questions = await buildQuestionsForUnit(unit, { useAllWords: true });
        }
        catch {
            return { ok: false, reason: "no_words" };
        }
        const sessionId = randomUUID();
        const game = {
            sessionId,
            userId: ctx.userId,
            firstName: ctx.firstName,
            username: ctx.username,
            chatId: ctx.chatId,
            messageId: messageId ?? null,
            unit,
            questions,
            currentIndex: 0,
            score: 0,
            correctTimeMs: 0,
            questionStartedAt: 0,
            questionTimer: null,
            lastQuestionSecondsShown: null,
            locked: false,
        };
        soloQuizManager.register(game);
        await this.showQuestion(sessionId);
        return { ok: true, sessionId };
    }
    async showQuestion(sessionId) {
        const game = soloQuizManager.get(sessionId);
        if (!game)
            return;
        if (game.currentIndex >= game.questions.length) {
            await this.finishGame(sessionId);
            return;
        }
        game.locked = false;
        game.questionStartedAt = Date.now();
        soloQuizManager.clearQuestionTimer(sessionId);
        const q = game.questions[game.currentIndex];
        const text = formatQuestion(game);
        const keyboard = createSoloAnswerKeyboard(sessionId, game.currentIndex, q.options);
        const messageId = await this.editOrSend(game, text, keyboard);
        soloQuizManager.setMessageId(sessionId, messageId);
        game.questionTimer = setTimeout(() => {
            void this.onTimeout(sessionId, game.currentIndex);
        }, SOLO_QUIZ_CONFIG.QUESTION_TIMEOUT_MS);
        game.lastQuestionSecondsShown = null;
        void this.tickQuestion(sessionId);
    }
    async tickQuestion(sessionId) {
        const game = soloQuizManager.get(sessionId);
        if (!game || game.locked || !game.messageId)
            return;
        const q = game.questions[game.currentIndex];
        if (!q)
            return;
        const elapsed = Math.max(0, SOLO_QUIZ_CONFIG.QUESTION_TIMEOUT_MS - (Date.now() - game.questionStartedAt));
        const secLeft = Math.ceil(elapsed / 1000);
        if (secLeft <= 0)
            return;
        if (game.lastQuestionSecondsShown === secLeft)
            return;
        try {
            await this.api.editMessageText(game.chatId, game.messageId, formatQuestion(game), {
                parse_mode: "HTML",
                reply_markup: createSoloAnswerKeyboard(sessionId, game.currentIndex, q.options),
            });
            game.lastQuestionSecondsShown = secLeft;
        }
        catch (err) {
            const desc = err && typeof err === "object" && "description" in err
                ? String(err.description)
                : "";
            if (desc.includes("message is not modified")) {
                game.lastQuestionSecondsShown = secLeft;
            }
        }
    }
    async onTimeout(sessionId, questionIndex) {
        const game = soloQuizManager.get(sessionId);
        if (!game || game.locked || game.currentIndex !== questionIndex)
            return;
        game.locked = true;
        soloQuizManager.clearQuestionTimer(sessionId);
        await this.editOrSend(game, `⏱ <b>Vaqt tugadi!</b>\n\n${game.questions[questionIndex].word}`);
        await this.delayAndAdvance(sessionId, questionIndex);
    }
    processAnswer(sessionId, questionIndex, optionId, userId) {
        const game = soloQuizManager.get(sessionId);
        if (!game)
            return { kind: "not_found" };
        if (game.userId !== userId)
            return { kind: "not_found" };
        if (game.currentIndex !== questionIndex)
            return { kind: "stale" };
        if (game.locked)
            return { kind: "stale" };
        const question = game.questions[questionIndex];
        const option = question.options.find((o) => o.id === optionId);
        if (!option)
            return { kind: "stale" };
        game.locked = true;
        soloQuizManager.clearQuestionTimer(sessionId);
        if (!option.isCorrect) {
            return { kind: "wrong" };
        }
        const responseMs = Date.now() - game.questionStartedAt;
        game.score += 1;
        game.correctTimeMs += responseMs;
        return { kind: "correct", responseMs };
    }
    async handleAnswerResult(sessionId, questionIndex, result) {
        const game = soloQuizManager.get(sessionId);
        if (!game)
            return;
        if (result.kind === "correct") {
            const sec = (result.responseMs / 1000).toFixed(1);
            await this.editOrSend(game, `✅ <b>To'g'ri!</b> +1 ball (${sec}s)`);
        }
        else if (result.kind === "wrong") {
            await this.editOrSend(game, "❌ <b>Noto'g'ri</b> — keyingi savol...");
        }
        if (result.kind === "correct" || result.kind === "wrong") {
            await this.delayAndAdvance(sessionId, questionIndex);
        }
    }
    async delayAndAdvance(sessionId, fromIndex) {
        await new Promise((r) => setTimeout(r, SOLO_QUIZ_CONFIG.ADVANCE_DELAY_MS));
        const game = soloQuizManager.get(sessionId);
        if (!game || game.currentIndex !== fromIndex)
            return;
        game.currentIndex += 1;
        await this.showQuestion(sessionId);
    }
    async finishGame(sessionId) {
        const game = soloQuizManager.get(sessionId);
        if (!game)
            return;
        soloQuizManager.clearQuestionTimer(sessionId);
        await prisma.user.update({
            where: { id: toDbUserId(game.userId) },
            data: {
                soloScore: { increment: game.score },
                soloTimeMs: { increment: BigInt(game.correctTimeMs) },
                soloGames: { increment: 1 },
            },
        });
        const sessionText = formatSessionResult(game);
        const boardText = await this.formatGlobalLeaderboard(game.userId);
        const text = `${sessionText}\n\n${boardText}`;
        await this.editOrSend(game, text, soloPlayAgainKeyboard());
        soloQuizManager.remove(sessionId);
    }
    async editOrSend(game, text, keyboard) {
        const opts = { parse_mode: "HTML", reply_markup: keyboard };
        if (game.messageId) {
            try {
                await this.api.editMessageText(game.chatId, game.messageId, text, opts);
                return game.messageId;
            }
            catch {
                /* fallback */
            }
        }
        const msg = await this.api.sendMessage(game.chatId, text, opts);
        return msg.message_id;
    }
    unitPickerText() {
        return "📚 <b>Unit tanlang</b> — o'yin shu unitdan boshlanadi:";
    }
    getMenuKeyboard() {
        return soloMenuKeyboard;
    }
    getUnitKeyboard(page) {
        return createSoloUnitKeyboard(page);
    }
}
