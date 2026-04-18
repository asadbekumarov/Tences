import { Bot, webhookCallback } from "https://deno.land/x/grammy/mod.ts";
import { registerHelpCommand, registerStartCommand } from "./src/commands/start.ts";
import { registerTenseHandlers } from "./src/handlers/tenses.ts";

/**
 * BOT_TOKEN: muhit o‘zgaruvchisi yoki `deno run --env` bilan `.env` faylidan.
 * Windows (PowerShell): `$env:BOT_TOKEN="..."; deno task start`
 */
const token = Deno.env.get("BOT_TOKEN");

if (!token) {
  console.error(
    "Xato: BOT_TOKEN topilmadi. .env.example ni .env qilib nusxalang, keyin `deno task start` yoki `deno task dev:env` ishlating.",
  );
  Deno.exit(1);
}

const useWebhook = Deno.env.get("USE_WEBHOOK") === "true" ||
  Deno.env.get("USE_WEBHOOK") === "1";

const bot = new Bot(token);

registerStartCommand(bot);
registerHelpCommand(bot);
registerTenseHandlers(bot);

function resolveListenPort(): number {
  const raw = Deno.env.get("PORT");
  if (raw === undefined || raw === "") return 8000;
  const n = Number.parseInt(raw, 10);
  if (!Number.isFinite(n) || n < 1 || n > 65535) return 8000;
  return n;
}

if (useWebhook) {
  const handleWebhook = webhookCallback(bot, "std/http");
  const port = resolveListenPort();

  console.log(`Webhook rejimi: HTTP server ${port}-portda (Telegram URL path: /<BOT_TOKEN>)`);

  Deno.serve({ port }, async (req: Request) => {
    const url = new URL(req.url);

    if (req.method === "POST" && url.pathname.slice(1) === token) {
      try {
        const res = await handleWebhook(req);
        return res instanceof Response ? res : new Response("", { status: 500 });
      } catch (err) {
        console.error("Webhook xatolik:", err);
        return new Response("Internal Server Error", { status: 500 });
      }
    }

    return new Response("Bot serveri ishlayapti!", {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  });
} else {
  // Agar avval webhook qo‘yilgan bo‘lsa, long polling ishlamaydi — webhookni o‘chiramiz
  const api = bot.api;
  await api.deleteWebhook({ drop_pending_updates: true });

  const me = await api.getMe();
  console.log(`Long polling: @${me.username ?? me.first_name} — /start bosing (terminalni yopmang).`);
  await bot.start();
}
