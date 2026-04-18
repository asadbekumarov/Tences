import { Bot, webhookCallback } from "https://deno.land/x/grammy/mod.ts";
import { registerHelpCommand, registerStartCommand } from "./src/commands/start.ts";
import { registerTenseHandlers } from "./src/handlers/tenses.ts";
import { registerVerbHandlers } from "./src/handlers/verbs.ts";

/**
 * Deno Deploy: Project → Settings → Environment Variables → BOT_TOKEN
 * Qiymatda bo'sh joy yoki qo'shtirnoq bo'lmasin; faqat @BotFather tokeni.
 */
function readBotToken(): string {
  const raw = Deno.env.get("BOT_TOKEN");
  if (raw === undefined) {
    return "";
  }
  // BOM, bo'sh joy, yangi qator — Deploy / .env xatolarini tuzatadi
  const token = raw.replace(/^\uFEFF/, "").trim();
  return token;
}

const token = readBotToken();

if (!token) {
  console.error(
    "[FATAL] BOT_TOKEN bo'sh yoki mavjud emas.\n" +
      "  • Deno Deploy: loyiha → Environment → BOT_TOKEN qo'shing (nom aynan shunday).\n" +
      "  • Lokal: .env yoki `deno run --env` ishlating.\n" +
      "  • Tekshiruv: echo $BOT_TOKEN uzunligi 40+ belgidan kam bo'lmasligi kerak.",
  );
  Deno.exit(1);
}

if (token.length < 40 || !/^\d+:/.test(token)) {
  console.error(
    "[FATAL] BOT_TOKEN format shubhali (odatda 40+ belgi, boshlanishi raqamlar:token).\n" +
      "  Deploy .env qiymatida qo'shtirnoq yozmang; faqat token matni.",
  );
  Deno.exit(1);
}

console.log(
  `[boot] BOT_TOKEN yuklandi (uzunlik: ${token.length}, boshlanishi: ${token.slice(0, 5)}...).`,
);

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

/** Webhook URL path segmenti: /TOKEN — slash, encoding va oxirgi / farqlarini hisobga oladi */
function pathMatchesWebhookToken(url: URL, expectedToken: string): boolean {
  let path = url.pathname;
  if (path !== "/" && path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  const segment = path.startsWith("/") ? path.slice(1) : path;
  if (!segment) return false;
  try {
    return decodeURIComponent(segment) === expectedToken;
  } catch {
    return segment === expectedToken;
  }
}

const port = resolveListenPort();

console.log(
  "[boot] Webhook: Telegram POST yuboradi → path / + BOT_TOKEN (setWebhook URL bilan bir xil path segment).",
);
console.log(`[boot] HTTP server port: ${port}`);

Deno.serve({ port }, async (req: Request) => {
  const url = new URL(req.url);

  if (req.method === "POST" && pathMatchesWebhookToken(url, token)) {
    try {
      const res = await handleUpdate(req);
      return res instanceof Response ? res : new Response("", { status: 500 });
    } catch (err) {
      console.error("[webhook] xatolik:", err);
      return new Response("Internal Error", { status: 500 });
    }
  }

  if (req.method === "POST") {
    console.warn(
      "[webhook] POST path mos kelmedi (pathnameni tekshiring, setWebhook URL token bilan bir xilmi).",
    );
  }

  return new Response("Bot is running!", {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
});
