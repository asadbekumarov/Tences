import { Composer } from "grammy";
import { isGroupChat } from "../utils/chat.js";
/** Shaxsiy chat handlerlari — guruhda umuman ishlamaydi */
export const privateOnlyComposer = new Composer();
privateOnlyComposer.use(async (ctx, next) => {
    if (isGroupChat(ctx))
        return;
    await next();
});
