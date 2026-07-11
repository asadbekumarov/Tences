import { BotError, type Context, GrammyError } from "grammy";

export function isExpiredCallbackQuery(err: unknown): boolean {
  const grammyErr =
    err instanceof BotError ? err.error : err instanceof GrammyError ? err : null;
  return (
    grammyErr instanceof GrammyError &&
    grammyErr.method === "answerCallbackQuery" &&
    grammyErr.error_code === 400 &&
    grammyErr.description.includes("query is too old")
  );
}

/** Telegram callback muddati o'tsa yoki ID noto'g'ri bo'lsa — xavfsiz yutib yuboradi */
export async function safeAnswerCallback(ctx: Context, text?: string): Promise<void> {
  try {
    await ctx.answerCallbackQuery(text ? { text } : undefined);
  } catch (err) {
    if (!isExpiredCallbackQuery(err)) {
      console.error("[callback] answerCallbackQuery failed:", err);
    }
  }
}
