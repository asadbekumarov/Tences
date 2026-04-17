import type { Bot, Context } from "https://deno.land/x/grammy/mod.ts";
import { mainMenuKeyboard } from "../keyboard/menu.ts";

export function registerStartCommand(bot: Bot<Context>) {
  bot.command("start", async (ctx) => {
    const name = ctx.from?.first_name ?? "do'stim";

    await ctx.reply(
      `Salom, ${name}! Ingliz tenses bo'yicha ma'lumot olish uchun menyudan birini tanlang:`,
      {
        reply_markup: mainMenuKeyboard,
      },
    );
  });
}
