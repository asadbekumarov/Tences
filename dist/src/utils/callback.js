import { BotError, GrammyError } from "grammy";
export function isExpiredCallbackQuery(err) {
    const grammyErr = err instanceof BotError ? err.error : err instanceof GrammyError ? err : null;
    return (grammyErr instanceof GrammyError &&
        grammyErr.method === "answerCallbackQuery" &&
        grammyErr.error_code === 400 &&
        grammyErr.description.includes("query is too old"));
}
/** Telegram callback muddati o'tsa yoki ID noto'g'ri bo'lsa — xavfsiz yutib yuboradi */
export async function safeAnswerCallback(ctx, text) {
    try {
        await ctx.answerCallbackQuery(text ? { text } : undefined);
    }
    catch (err) {
        if (!isExpiredCallbackQuery(err)) {
            console.error("[callback] answerCallbackQuery failed:", err);
        }
    }
}
