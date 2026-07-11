import { createUnitKeyboard, irregularRangeKeyboard, mainMenuKeyboard } from "../keyboard/menu.js";
import { soloMenuKeyboard } from "../soloQuiz/keyboard.js";
import { SoloQuizService } from "../soloQuiz/SoloQuizService.js";
export function mainMenuCaption(firstName) {
    return (`Salom, ${firstName}! Ingliz zamonlari (tenses), grammatika yoki 🔴 Irregular verbs bo'yicha ma'lumot uchun menyudan tanlang.\n\n` +
        `🎮 <b>Game</b> — bot bilan solo o'yin va umumiy reyting.\n\n` +
        `Yoki inglizcha fe'lni yozing — bazada bo'lsa, shakllari chiqadi.`);
}
export function registerStartCommand(bot) {
    bot.command("start", async (ctx) => {
        const name = ctx.from?.first_name ?? "do'stim";
        await ctx.reply(mainMenuCaption(name), {
            parse_mode: "HTML",
            reply_markup: mainMenuKeyboard,
        });
    });
}
export function registerTensesCommand(bot) {
    bot.command("tenses", async (ctx) => {
        const name = ctx.from?.first_name ?? "do'stim";
        await ctx.reply(mainMenuCaption(name), {
            parse_mode: "HTML",
            reply_markup: mainMenuKeyboard,
        });
    });
}
export function registerGrammarCommand(bot) {
    bot.command("grammar", async (ctx) => {
        const name = ctx.from?.first_name ?? "do'stim";
        await ctx.reply(mainMenuCaption(name), {
            parse_mode: "HTML",
            reply_markup: mainMenuKeyboard,
        });
    });
}
export function registerVocabularyCommand(bot) {
    bot.command("vocabulary", async (ctx) => {
        await ctx.reply("📚 <b>Lug'at (Unitlar)</b>\n\nUnitni tanlang:", {
            parse_mode: "HTML",
            reply_markup: createUnitKeyboard(1),
        });
    });
}
export function registerVerbsCommand(bot) {
    bot.command("verbs", async (ctx) => {
        await ctx.reply("🔴 <b>Irregular verbs</b>\n\nHarflar oralig'ini tanlang:", {
            parse_mode: "HTML",
            reply_markup: irregularRangeKeyboard,
        });
    });
}
export function registerGameCommand(bot) {
    bot.command("game", async (ctx) => {
        try {
            const svc = new SoloQuizService(ctx.api);
            await ctx.reply(svc.menuCaption(), {
                parse_mode: "HTML",
                reply_markup: soloMenuKeyboard,
            });
        }
        catch (err) {
            console.error("[start] /game failed:", err);
            await ctx.reply("❌ Game vaqtincha ishlamayapti.");
        }
    });
}
export function registerHelpCommand(bot) {
    bot.command("help", async (ctx) => {
        await ctx.reply("📚 <b>Yordam</b>\n\n" +
            "<b>/start</b> — asosiy menyu\n" +
            "<b>/game</b> — bot bilan solo o'yin\n" +
            "<b>/help</b> — bu xabar\n\n" +
            "🎮 Unit tanlang, 5 soniyada javob bering. Umumiy reytingda eng ko'p va tez topganlar birinchi!\n\n" +
            "Dasturchi: @asad_umarov", { parse_mode: "HTML" });
    });
}
