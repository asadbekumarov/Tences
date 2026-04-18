import type { Bot, Context } from "https://deno.land/x/grammy/mod.ts";
import { mainMenuKeyboard } from "../keyboard/menu.ts";

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

export function registerHelpCommand(bot: Bot<Context>) {
  bot.command("help", async (ctx) => {
    await ctx.reply(
      "📚 <b>Yordam</b>\n\n" +
        "<b>/start</b> — asosiy menyu va tense tanlash\n" +
        "<b>/help</b> — bu xabar\n\n" +
        "Menyudagi tugmalardan birini tanlang — har bir tense bo‘yicha qoida va misollar chiqadi.\n\n" +
        "🔴 <b>Irregular Verbs</b> — harflar bo‘yicha ro‘yxat.\n" +
        "So‘z qidiruv: bazadagi fe’lni inglizcha yozing (masalan: <code>went</code>, <code>take</code>).",
      { parse_mode: "HTML" },
    );
  });
}
