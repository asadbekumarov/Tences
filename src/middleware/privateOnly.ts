import { Composer, type Context } from "grammy";
import { isGroupChat } from "../utils/chat.js";

/** Shaxsiy chat handlerlari — guruhda umuman ishlamaydi */
export const privateOnlyComposer = new Composer<Context>();

privateOnlyComposer.use(async (ctx, next) => {
  if (isGroupChat(ctx)) return;
  await next();
});
