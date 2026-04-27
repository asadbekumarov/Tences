import { Bot, webhookCallback } from "grammy";
import { createServer } from "node:http";
import "dotenv/config";
import { registerHelpCommand, registerStartCommand, registerTensesCommand, registerVerbsCommand, registerVocabularyCommand, } from "./src/commands/start.js";
import { registerTenseHandlers } from "./src/handlers/tenses.js";
import { registerVerbHandlers } from "./src/handlers/verbs.js";
import { adminComposer } from "./src/handlers/admin.js";
/**
 * Node.js: .env faylidan yoki environmentdan o'qiymiz
 */
function readBotToken() {
    // 1. Birinchi navbatda environmentdan qidiramiz
    const raw = process.env.BOT_TOKEN;
    if (!raw || raw.trim() === "") {
        // 2. Agar environment bo'sh bo'lsa, zaxira sifatida tokenni qat'iy yozib ketish mumkin
        const fallbackToken = "8619070730:AAHKvow8feeJgpGZNCoexImTymHVPnTfApU";
        console.log("[boot] BOT_TOKEN environmentdan topilmadi, fallback ishlatilyapti.");
        return fallbackToken;
    }
    // BOM (Byte Order Mark) belgilarini tozalash va ortiqcha bo'shliqlarni olib tashlash
    return raw.replace(/^\uFEFF/, "").trim();
}
/** Logda token/path to'liq chiqmasin */
function maskSecret(value) {
    if (value.length === 0)
        return "(bo'sh)";
    if (value.length <= 12)
        return `*** [len=${value.length}]`;
    return `${value.slice(0, 6)}…${value.slice(-4)} [len=${value.length}]`;
}
const token = readBotToken();
if (!token) {
    console.error("[FATAL] BOT_TOKEN bo'sh yoki mavjud emas.\n" +
        "  • .env fayliga BOT_TOKEN qo'shing.\n" +
        "  • Alwaysdata panelida environment variable qo'shing.");
    process.exit(1);
}
if (token.length < 40 || !/^\d+:/.test(token)) {
    console.error("[FATAL] BOT_TOKEN format shubhali (odatda 40+ belgi, boshlanishi raqamlar:token).");
    process.exit(1);
}
console.log(`[boot] BOT_TOKEN yuklandi (uzunlik: ${token.length}, ${maskSecret(token)}).`);
const bot = new Bot(token);
// 🔹 IMPORTANT: Register the admin composer FIRST (before other handlers)
// This ensures the user tracking middleware captures all interactions
bot.use(adminComposer);
// Buyruqlarni ro'yxatdan o'tkazish
registerStartCommand(bot);
registerTensesCommand(bot);
registerVocabularyCommand(bot);
registerVerbsCommand(bot);
registerHelpCommand(bot);
// Handlerlarni ro'yxatdan o'tkazish
registerTenseHandlers(bot);
registerVerbHandlers(bot);
// Bot menyusi uchun buyruqlarni o'rnatish
bot.api.setMyCommands([
    { command: "start", description: "Botni qayta ishga tushirish" },
    { command: "tenses", description: "Ingliz tili zamonlari" },
    { command: "vocabulary", description: "Lug'at unitlari (1-60)" },
    { command: "verbs", description: "Noto'g'ri fe'llar ro'yxati" },
    { command: "users", description: "Foydalanuvchilar ro'yxati (faqat admin)" },
    { command: "help", description: "@asad_umarov" },
]);
function resolveListenPort() {
    const raw = process.env.PORT;
    if (raw === undefined || raw === "")
        return 8000;
    const n = Number.parseInt(raw, 10);
    if (!Number.isFinite(n) || n < 1 || n > 65535)
        return 8000;
    return n;
}
/** Pathdan birinchi segment: /TOKEN yoki /TOKEN/ → TOKEN */
function webhookPathSegment(pathname) {
    let path = pathname;
    if (path !== "/" && path.endsWith("/")) {
        path = path.slice(0, -1);
    }
    return path.startsWith("/") ? path.slice(1) : path;
}
function decodeSegment(segment) {
    try {
        return decodeURIComponent(segment);
    }
    catch {
        return segment;
    }
}
/** setWebhook URL: https://HOST/<TOKEN> — path segmenti token bilan byte-by-byte mos kelishi kerak */
function pathMatchesWebhookToken(pathname, expectedToken) {
    const segment = webhookPathSegment(pathname);
    if (!segment)
        return false;
    return decodeSegment(segment) === expectedToken;
}
/** Nima uchun mos kelmasligini logda ko'rsatish (token to'liq chiqmaydi) */
function logPathMatchDiagnostics(pathname, expectedToken, matches) {
    const segmentRaw = webhookPathSegment(pathname);
    const decoded = decodeSegment(segmentRaw);
    if (matches) {
        console.log(`[path/match] OK — segment ${maskSecret(decoded)} token bilan mos (uzunliklar: ${decoded.length} / ${expectedToken.length}).`);
        return;
    }
    const reasons = [];
    if (!segmentRaw)
        reasons.push("path bo'sh (pathname faqat / yoki //)");
    else if (decoded.length !== expectedToken.length) {
        reasons.push(`uzunlik farqi: path=${decoded.length}, token=${expectedToken.length}`);
    }
    else {
        reasons.push("belgilar mos emas (setWebhook URL pathidagi token xato yoki encoding)");
    }
    console.warn(`[path/match] MOS EMAS — path segment: ${maskSecret(decoded)} | token: ${maskSecret(expectedToken)}`);
    console.warn(`[path/match] sabab: ${reasons.join("; ") || "noma'lum"}`);
}
const port = Number(process.env.PORT) || 8100;
const hostname = process.env.HOST || "::";
// Alwaysdata-da yoki boshqa joyda Webhook ishlatish uchun PORT muhit o'zgaruvchisi kerak.
// Lokal test uchun POLLING=true ishlatamiz.
const usePolling = process.env.POLLING === "true";
if (usePolling) {
    console.log("[boot] Bot polling rejimida ishga tushmoqda...");
    bot.start({
        onStart: (botInfo) => {
            console.log(`[boot] Bot @${botInfo.username} sifatida ishlayapti!`);
        },
    });
    /**
     * Graceful Shutdown for Polling Mode
     * Handle both SIGINT (Ctrl+C) and SIGTERM (kill signal from process manager)
     */
    process.once("SIGINT", () => {
        console.log("\n[shutdown] SIGINT obtained. Stopping bot gracefully...");
        bot.stop();
        process.exit(0);
    });
    process.once("SIGTERM", () => {
        console.log("\n[shutdown] SIGTERM obtained. Stopping bot gracefully...");
        bot.stop();
        process.exit(0);
    });
}
else {
    console.log("[boot] Webhook: Telegram POST → path / + BOT_TOKEN");
    console.log(`[boot] HTTP server: ${hostname}:${port}`);
    const handleUpdate = webhookCallback(bot, "http");
    const server = createServer((req, res) => {
        const url = new URL(req.url || "/", `http://${req.headers.host}`);
        const pathname = url.pathname;
        console.log(`[webhook/in] ${req.method} ${pathname}`);
        if (req.method !== "POST") {
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end("Bot is running!");
            return;
        }
        const pathOk = pathMatchesWebhookToken(pathname, token);
        logPathMatchDiagnostics(pathname, token, pathOk);
        if (pathOk) {
            handleUpdate(req, res).catch((err) => {
                console.error("[webhook] handleUpdate xatolik:", err);
                if (!res.headersSent) {
                    res.writeHead(500);
                    res.end("Error");
                }
            });
            return;
        }
        res.writeHead(401);
        res.end("Unauthorized");
    });
    server.listen(port, hostname, () => {
        console.log(`[boot] Server listening on ${hostname}:${port}`);
    });
    /**
     * Graceful Shutdown for Webhook Mode
     * Handle both SIGINT (Ctrl+C) and SIGTERM (kill signal from process manager)
     */
    process.once("SIGINT", () => {
        console.log("\n[shutdown] SIGINT obtained. Stopping server gracefully...");
        server.close(() => {
            console.log("[shutdown] Server closed. Exiting...");
            process.exit(0);
        });
        // Force exit after 30 seconds if server doesn't close
        setTimeout(() => {
            console.error("[shutdown] Forcefully exiting after 30 seconds...");
            process.exit(1);
        }, 30000);
    });
    process.once("SIGTERM", () => {
        console.log("\n[shutdown] SIGTERM obtained. Stopping server gracefully...");
        server.close(() => {
            console.log("[shutdown] Server closed. Exiting...");
            process.exit(0);
        });
        // Force exit after 30 seconds if server doesn't close
        setTimeout(() => {
            console.error("[shutdown] Forcefully exiting after 30 seconds...");
            process.exit(1);
        }, 30000);
    });
}
