import type { Bot, Context } from "grammy";
import { GROUP_QUIZ_CONFIG } from "../groupQuiz/config.js";
import { GroupQuizService } from "../groupQuiz/GroupQuizService.js";
import { groupQuizManager } from "../groupQuiz/GroupQuizManager.js";
import { groupQuizRepository } from "../groupQuiz/GroupQuizRepository.js";
import { createUnitPickerKeyboard } from "../groupQuiz/keyboard.js";
import { safeAnswerCallback } from "../utils/callback.js";
import { isGroupAdmin, isGroupChat } from "../utils/chat.js";

let quizService: GroupQuizService | null = null;

async function promptStartGame(ctx: Context): Promise<void> {
  if (!isGroupChat(ctx) || !ctx.from) return;

  if (groupQuizManager.hasChat(ctx.chat!.id)) {
    await ctx.reply("⚠️ Bu guruhda allaqachon aktiv o'yin bor.");
    return;
  }

  await quizService!.reconcileChat(ctx.chat!.id);

  const active = await groupQuizRepository.findActiveByChat(ctx.chat!.id);
  if (active) {
    await ctx.reply("⚠️ Bu guruhda allaqachon aktiv o'yin bor.");
    return;
  }

  await ctx.reply("📚 <b>Unit tanlang</b> — o'yin savollari shu unitdan:", {
    parse_mode: "HTML",
    reply_markup: createUnitPickerKeyboard(1),
  });
}

export function registerGroupQuizHandlers(bot: Bot<Context>): void {
  quizService = new GroupQuizService(bot.api);

  void groupQuizRepository.cancelStaleGames();

  groupQuizManager.startCleanup((gameId) => {
    void quizService?.endDueToInactivity(gameId);
  });

  bot.command("startgame", async (ctx) => {
    await promptStartGame(ctx);
  });

  bot.callbackQuery(/^gq_unit_page:(\d+)$/, async (ctx) => {
    if (!isGroupChat(ctx) || !(await isGroupAdmin(ctx))) {
      await safeAnswerCallback(ctx, "Faqat admin");
      return;
    }
    const page = Number.parseInt(ctx.match[1], 10);
    await safeAnswerCallback(ctx);
    try {
      await ctx.editMessageText("📚 <b>Unit tanlang</b>:", {
        parse_mode: "HTML",
        reply_markup: createUnitPickerKeyboard(page),
      });
    } catch {
      /* ignore */
    }
  });

  bot.callbackQuery(/^gq_pick_unit:(\d+)$/, async (ctx) => {
    if (!isGroupChat(ctx) || !ctx.from || !(await isGroupAdmin(ctx))) {
      await safeAnswerCallback(ctx, "Faqat admin");
      return;
    }

    const unit = Number.parseInt(ctx.match[1], 10);
    if (unit < GROUP_QUIZ_CONFIG.MIN_UNIT || unit > GROUP_QUIZ_CONFIG.MAX_UNIT) {
      await safeAnswerCallback(ctx, "Noto'g'ri unit");
      return;
    }

    await safeAnswerCallback(ctx, "O'yin yaratilmoqda...");

    const result = await quizService!.startLobby(ctx.chat!.id, ctx.from.id, unit);
    if (!result.ok) {
      if (result.reason === "no_words") {
        await ctx.reply(`❌ Unit ${unit} da yetarli so'z yo'q.`);
      } else {
        await ctx.reply("⚠️ Aktiv o'yin mavjud.");
      }
      return;
    }

    try {
      await ctx.deleteMessage();
    } catch {
      /* ignore */
    }
  });

  bot.callbackQuery(/^gq_join:(.+)$/, async (ctx) => {
    if (!ctx.from || !ctx.chat) return;
    const gameId = ctx.match[1];

    const joined = await quizService!.joinGame(
      gameId,
      ctx.from.id,
      ctx.from.first_name,
      ctx.from.username,
    );

    await safeAnswerCallback(ctx, joined ? "✅ Qo'shildingiz!" : "Allaqachon qo'shilgansiz yoki o'yin boshlangan");
  });

  bot.callbackQuery(/^gq_ans:([^:]+):(\d+):(\d+)$/, async (ctx) => {
    if (!ctx.from) return;

    const gameId = ctx.match[1];
    const qIndex = Number.parseInt(ctx.match[2], 10);
    const optionId = Number.parseInt(ctx.match[3], 10);

    const { feedback, advance, answeredIndex } = await quizService!.processAnswer(
      gameId,
      qIndex,
      optionId,
      ctx.from.id,
      ctx.callbackQuery.message?.message_id,
    );

    await safeAnswerCallback(ctx, feedback);

    if (advance && answeredIndex !== undefined) {
      try {
        await quizService!.advanceQuestion(gameId, answeredIndex);
      } catch (err) {
        console.error("[groupQuiz] advance failed:", err);
      }
    }
  });
}

export function shutdownGroupQuiz(): void {
  groupQuizManager.shutdown();
}
