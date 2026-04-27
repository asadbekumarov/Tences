import type { Bot, Context } from "grammy";
import { createUnitKeyboard, irregularRangeKeyboard, mainMenuKeyboard } from "../keyboard/menu.js";

/** Asosiy menyu matni — /start va “Asosiy menyu” tugmasida ishlatiladi */
export function mainMenuCaption(firstName: string): string {
  return (
    `Salom, ${firstName}! Ingliz zamonlari (tenses) yoki 🔴 Irregular verbs bo‘yicha ma’lumot uchun menyudan tanlang.\n\n` +
    `Yoki inglizcha fe’lni yozing — bazada bo‘lsa, shakllari chiqadi.`
  );
}

export function registerStartCommand(bot: Bot<Context>) {
  bot.command("start", async (ctx) => {
    const name = ctx.from?.first_name ?? "do'stim";

    await ctx.reply(mainMenuCaption(name), {
      reply_markup: mainMenuKeyboard,
    });
  });
}

export function registerTensesCommand(bot: Bot<Context>) {
  bot.command("tenses", async (ctx) => {
    const name = ctx.from?.first_name ?? "do'stim";
    await ctx.reply(mainMenuCaption(name), {
      reply_markup: mainMenuKeyboard,
    });
  });
}

export function registerVocabularyCommand(bot: Bot<Context>) {
  bot.command("vocabulary", async (ctx) => {
    await ctx.reply("📚 <b>Lug'at (Unitlar)</b>\n\nUnitni tanlang:", {
      parse_mode: "HTML",
      reply_markup: createUnitKeyboard(1),
    });
  });
}

export function registerVerbsCommand(bot: Bot<Context>) {
  bot.command("verbs", async (ctx) => {
    await ctx.reply("🔴 <b>Irregular verbs</b>\n\nHarflar oralig‘ini tanlang:", {
      parse_mode: "HTML",
      reply_markup: irregularRangeKeyboard,
    });
  });
}

export function registerHelpCommand(bot: Bot<Context>) {
  bot.command("help", async (ctx) => {
    await ctx.reply(
      "📚 <b>Yordam</b>\n\n" +
        "<b>/start</b> — asosiy menyu va tense tanlash\n" +
        "<b>/help</b> — bu xabar\n\n" +
        "Menyudagi tugmalardan birini tanlang — har bir tense bo‘yicha qoida va misollar chiqadi.\n\n" +
        "🔴 <b>Irregular Verbs</b> — harflar bo‘yicha ro‘yxat.\n" +
        "So‘z qidiruv: bazadagi fe’lni inglizcha yozing (masalan: <code>went</code>, <code>take</code>).\n\n" +
        "Dasturchi: @asad_umarov",
      { parse_mode: "HTML" },
    );
  });
}
