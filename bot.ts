// import { Bot } from "https://deno.land/x/grammy/mod.ts";
// import { registerStartCommand } from "./src/commands/start.ts";
// import { registerTenseHandlers } from "./src/handlers/tenses.ts";

// const token = Deno.env.get("BOT_TOKEN");

// if (!token) {
//   throw new Error("BOT_TOKEN topilmadi. Iltimos, env ga BOT_TOKEN ni qo'shing.");
// }

// const bot = new Bot(token);

// registerStartCommand(bot);
// registerTenseHandlers(bot);

// await bot.start();
import { Bot } from "https://deno.land/x/grammy/mod.ts";
import { registerStartCommand } from "./src/commands/start.ts";
import { registerTenseHandlers } from "./src/handlers/tenses.ts";

const token = Deno.env.get("BOT_TOKEN");

if (!token) {
  throw new Error("BOT_TOKEN topilmadi. Iltimos, env ga BOT_TOKEN ni qo'shing.");
}

const bot = new Bot(token);

registerStartCommand(bot);
registerTenseHandlers(bot);

// --- MUHIM O'ZGARIŞ ---
// Botni boshlashdan oldin barcha eski ulanishlarni va tiqilib qolgan xabarlarni tozalaymiz
console.log("Eski ulanishlar tozalanmoqda...");

await bot.api.deleteWebhook({ drop_pending_updates: true });

console.log("Bot muvaffaqiyatli ishga tushdi!");

// Botni yangidan "toza" holatda boshlaymiz
await bot.start({
  drop_pending_updates: true,
  allowed_updates: ["message", "callback_query"],
});