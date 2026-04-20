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
  const token = raw.replace(/^\uFEFF/, "").trim();
  return token;
}

/** Logda token/path to'liq chiqmasin */
function maskSecret(value: string): string {
  if (value.length === 0) return "(bo'sh)";
  if (value.length <= 12) return `*** [len=${value.length}]`;
  return `${value.slice(0, 6)}…${value.slice(-4)} [len=${value.length}]`;
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
  `[boot] BOT_TOKEN yuklandi (uzunlik: ${token.length}, ${maskSecret(token)}).`,
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

/** Pathdan birinchi segment: /TOKEN yoki /TOKEN/ → TOKEN */
function webhookPathSegment(url: URL): string {
  let path = url.pathname;
  if (path !== "/" && path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  return path.startsWith("/") ? path.slice(1) : path;
}

function decodeSegment(segment: string): string {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

/** setWebhook URL: https://HOST/<TOKEN> — path segmenti token bilan byte-by-byte mos kelishi kerak */
function pathMatchesWebhookToken(url: URL, expectedToken: string): boolean {
  const segment = webhookPathSegment(url);
  if (!segment) return false;
  return decodeSegment(segment) === expectedToken;
}

/** Nima uchun mos kelmasligini logda ko'rsatish (token to'liq chiqmaydi) */
function logPathMatchDiagnostics(url: URL, expectedToken: string, matches: boolean): void {
  const segmentRaw = webhookPathSegment(url);
  const decoded = decodeSegment(segmentRaw);

  if (matches) {
    console.log(
      `[path/match] OK — segment ${maskSecret(decoded)} token bilan mos (uzunliklar: ${decoded.length} / ${expectedToken.length}).`,
    );
    return;
  }

  const reasons: string[] = [];
  if (!segmentRaw) reasons.push("path bo'sh (pathname faqat / yoki //)");
  else if (decoded.length !== expectedToken.length) {
    reasons.push(`uzunlik farqi: path=${decoded.length}, token=${expectedToken.length}`);
  } else {
    reasons.push("belgilar mos emas (setWebhook URL pathidagi token xato yoki encoding)");
    let diffAt = -1;
    for (let i = 0; i < Math.min(decoded.length, expectedToken.length); i++) {
      if (decoded[i] !== expectedToken[i]) {
        diffAt = i;
        break;
      }
    }
    if (diffAt >= 0) reasons.push(`birinchi farq indeksi: ${diffAt}`);
  }

  console.warn(
    `[path/match] MOS EMAS — path segment: ${maskSecret(decoded)} | token: ${maskSecret(expectedToken)}`,
  );
  console.warn(`[path/match] sabab: ${reasons.join("; ") || "noma'lum"}`);
  console.warn(
    "[path/match] Tekshiring: setWebhook URL = https://<sizning-host>/<BOT_TOKEN> (pathda qo'shimcha / yoki boshqa prefiks bo'lmasin).",
  );
}

const port = resolveListenPort();
const hostname = "0.0.0.0";
console.log("[boot] Webhook: Telegram POST → path / + BOT_TOKEN");
console.log(`[boot] HTTP server: ${hostname}:${port}`);

// Deno.serve ni eng sodda va ishlaydigan varianti
const serveOptions = { port, hostname } as unknown as { port?: number };
Deno.serve(serveOptions, async (req: Request) => {
  const url = new URL(req.url);

  console.log(`[webhook/in] ${req.method} ${url.pathname}`);

  if (req.method !== "POST") {
    return new Response("Bot is running!", { status: 200 });
  }

  const pathOk = pathMatchesWebhookToken(url, token);
  logPathMatchDiagnostics(url, token, pathOk);

  if (pathOk) {
    try {
      return await handleUpdate(req);
    } catch (err) {
      console.error("[webhook] handleUpdate xatolik:", err);
      return new Response("Error", { status: 500 });
    }
  }

  return new Response("Unauthorized", { status: 401 });
});