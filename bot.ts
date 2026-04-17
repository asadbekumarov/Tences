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

await bot.start();