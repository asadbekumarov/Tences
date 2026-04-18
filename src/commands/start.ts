import type { Bot, Context } from "https://deno.land/x/grammy/mod.ts";
import { mainMenuKeyboard } from "../keyboard/menu.ts";

/** Asosiy menyu matni — /start va “Asosiy menyu” tugmasida ishlatiladi */
export function mainMenuCaption(firstName: string): string {
  return `Salom, ${firstName}! Ingliz tenses bo'yicha ma'lumot olish uchun menyudan birini tanlang:`;
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
        "Menyudagi tugmalardan birini tanlang — har bir tense bo‘yicha qoida va misollar chiqadi.",
      { parse_mode: "HTML" },
    );
  });
}
