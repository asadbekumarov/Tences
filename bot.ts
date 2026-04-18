import { Bot, webhookCallback } from "https://deno.land/x/grammy/mod.ts";
import { registerHelpCommand, registerStartCommand } from "./src/commands/start.ts";
import { registerTenseHandlers } from "./src/handlers/tenses.ts";
import { registerVerbHandlers } from "./src/handlers/verbs.ts";

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
registerVerbHandlers(bot);

const handleUpdate = webhookCallback(bot, "std/http");

function resolveListenPort(): number {
  const raw = Deno.env.get("PORT");
  if (raw === undefined || raw === "") return 8000;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1 || n > 65535) return 8000;
  return n;
}

const port = resolveListenPort();

console.log(`Webhook server: port ${port} (path: /<BOT_TOKEN>)`);

Deno.serve({ port }, async (req: Request) => {
  const url = new URL(req.url);

  if (req.method === "POST" && url.pathname.slice(1) === token) {
    try {
      const res = await handleUpdate(req);
      return res instanceof Response ? res : new Response("", { status: 500 });
    } catch (err) {
      console.error("Webhook xatoligi:", err);
      return new Response("Internal Error", { status: 500 });
    }
  }

  return new Response("Bot is running!", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
});
