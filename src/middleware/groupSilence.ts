import { Composer, type Context } from "grammy";
import { isGroupAdmin, isGroupChat } from "../utils/chat.js";

function isStartGameCommand(ctx: Context): boolean {
  const text = ctx.message?.text?.trim() ?? "";
  return /^\/startgame(@\w+)?(\s|$)/i.test(text);
}

function isGroupQuizCallback(ctx: Context): boolean {
  return ctx.callbackQuery?.data?.startsWith("gq_") ?? false;
}

/** Guruhda faqat admin /startgame va o'yin callbacklari (gq_*) ishlaydi */
export const groupSilenceComposer = new Composer<Context>();

groupSilenceComposer.use(async (ctx, next) => {
  if (!isGroupChat(ctx)) {
    await next();
    return;
  }

  if (isGroupQuizCallback(ctx)) {
    await next();
    return;
  }

  if (isStartGameCommand(ctx)) {
    if (await isGroupAdmin(ctx)) {
      await next();
    }
    return;
  }
});
