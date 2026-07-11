import { SoloQuizService } from "../soloQuiz/SoloQuizService.js";
import { soloQuizManager } from "../soloQuiz/SoloQuizManager.js";
import { safeAnswerCallback } from "../utils/callback.js";
let soloService = null;
function userCtx(ctx) {
    if (!ctx.from || !ctx.chat)
        return null;
    return {
        userId: ctx.from.id,
        firstName: ctx.from.first_name,
        username: ctx.from.username,
        chatId: ctx.chat.id,
    };
}
function feedbackForResult(result) {
    switch (result.kind) {
        case "correct":
            return "✅ To'g'ri!";
        case "wrong":
            return "❌ Noto'g'ri";
        case "stale":
            return "Savol tugagan";
        case "finished":
        case "not_found":
            return "O'yin topilmadi";
        case "timeout":
            return "⏱ Vaqt tugadi";
        default:
            return undefined;
    }
}
async function showGameMenu(ctx, edit = false) {
    const text = soloService.menuCaption();
    const opts = {
        parse_mode: "HTML",
        reply_markup: soloService.getMenuKeyboard(),
    };
    if (edit) {
        await ctx.editMessageText(text, opts);
    }
    else {
        await ctx.reply(text, opts);
    }
}
export function registerGameHandlers(composer, api) {
    soloService = new SoloQuizService(api);
    soloQuizManager.setQuestionTickHandler((sessionId) => {
        void soloService?.tickQuestion(sessionId);
    });
    composer.callbackQuery("game_menu", async (ctx) => {
        await safeAnswerCallback(ctx);
        try {
            await showGameMenu(ctx, true);
        }
        catch (err) {
            console.error("[game] game_menu failed:", err);
        }
    });
    composer.callbackQuery("duel_menu", async (ctx) => {
        await safeAnswerCallback(ctx);
        try {
            await showGameMenu(ctx, true);
        }
        catch (err) {
            console.error("[game] duel_menu failed:", err);
        }
    });
    composer.callbackQuery("solo_pick_unit", async (ctx) => {
        await safeAnswerCallback(ctx);
        try {
            await ctx.editMessageText(soloService.unitPickerText(), {
                parse_mode: "HTML",
                reply_markup: soloService.getUnitKeyboard(1),
            });
        }
        catch (err) {
            console.error("[game] solo_pick_unit failed:", err);
        }
    });
    composer.callbackQuery("solo_leaderboard", async (ctx) => {
        if (!ctx.from)
            return;
        await safeAnswerCallback(ctx);
        const text = await soloService.formatGlobalLeaderboard(ctx.from.id);
        try {
            await ctx.editMessageText(text, {
                parse_mode: "HTML",
                reply_markup: soloService.getMenuKeyboard(),
            });
        }
        catch {
            await ctx.reply(text, {
                parse_mode: "HTML",
                reply_markup: soloService.getMenuKeyboard(),
            });
        }
    });
    composer.callbackQuery(/^solo_page:(\d+)$/, async (ctx) => {
        const page = Number.parseInt(ctx.match[1], 10);
        await safeAnswerCallback(ctx);
        try {
            await ctx.editMessageText(soloService.unitPickerText(), {
                parse_mode: "HTML",
                reply_markup: soloService.getUnitKeyboard(page),
            });
        }
        catch (err) {
            console.error("[game] solo_page failed:", err);
        }
    });
    composer.callbackQuery(/^solo_unit:(\d+)$/, async (ctx) => {
        const u = userCtx(ctx);
        if (!u)
            return;
        const unit = Number.parseInt(ctx.match[1], 10);
        await safeAnswerCallback(ctx, "O'yin boshlanmoqda...");
        const messageId = ctx.callbackQuery.message?.message_id;
        const result = await soloService.startGame(u, unit, messageId);
        if (!result.ok) {
            const messages = {
                busy: "⚠️ Siz allaqachon o'yindasiz.",
                no_words: `❌ Unit ${unit} da so'z topilmadi.`,
                bad_unit: "❌ Noto'g'ri unit.",
            };
            await ctx.reply(messages[result.reason] ?? "❌ Xatolik.", {
                reply_markup: soloService.getMenuKeyboard(),
            });
        }
    });
    composer.callbackQuery(/^solo_ans:([^:]+):(\d+):(\d+)$/, async (ctx) => {
        if (!ctx.from)
            return;
        const sessionId = ctx.match[1];
        const qIndex = Number.parseInt(ctx.match[2], 10);
        const optionId = Number.parseInt(ctx.match[3], 10);
        const result = soloService.processAnswer(sessionId, qIndex, optionId, ctx.from.id);
        await safeAnswerCallback(ctx, feedbackForResult(result));
        try {
            await soloService.handleAnswerResult(sessionId, qIndex, result);
        }
        catch (err) {
            console.error("[game] handleAnswerResult failed:", err);
        }
    });
}
export function shutdownGameSystem() {
    soloQuizManager.shutdown();
}
