import { Bot, webhookCallback } from "https://deno.land/x/grammy/mod.ts";
import { registerHelpCommand, registerStartCommand } from "./src/commands/start.ts";
import { registerTenseHandlers } from "./src/handlers/tenses.ts";

/**
 * BOT_TOKEN: muhit o‘zgaruvchisi yoki `deno run --env` bilan `.env` faylidan.
 * Telegramda setWebhook URL: https://<domeningiz>/<BOT_TOKEN>
 */
const token = Deno.env.get("BOT_TOKEN");

if (!token) {
  console.error(
    "Xato: BOT_TOKEN topilmadi. .env.example ni .env qilib nusxalang, keyin `deno task start` ishlating.",
  );
  Deno.exit(1);
}

const bot = new Bot(token);

registerStartCommand(bot);
registerHelpCommand(bot);
registerTenseHandlers(bot);

const handleUpdate = webhookCallback(bot, "std/http");

console.log("Webhook server ishga tushmoqda (long polling yo‘q — faqat HTTP orqali yangilanishlar).");

Deno.serve(async (req: Request) => {
  if (req.method === "POST") {
    const url = new URL(req.url);
    if (url.pathname.slice(1) === token) {
      try {
        const res = await handleUpdate(req);
        return res instanceof Response ? res : new Response("", { status: 500 });
      } catch (err) {
        console.error(err);
        return new Response("Error", { status: 500 });
      }
    }
  }
  return new Response("Bot is running!");
});
