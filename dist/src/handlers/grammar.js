import { InlineKeyboard } from "grammy";
import { prisma } from "../db/prisma.js";
import { conditionalsBackKeyboard, conditionalsContentMap, conditionalsIntro, conditionalsMenuKeyboard, } from "../grammar/conditionals.js";
import { infinitiveGerundBackKeyboard, infinitiveGerundContentMap, infinitiveGerundIntro, infinitiveGerundMenuKeyboard, } from "../grammar/infinitiveGerund.js";
import { safeAnswerCallback } from "../utils/callback.js";
export function registerGrammarHandlers(bot) {
    bot.callbackQuery("menu:grammar", async (ctx) => {
        await safeAnswerCallback(ctx);
        let topics;
        try {
            topics = await prisma.grammarTopic.findMany({
                orderBy: { createdAt: "asc" },
            });
        }
        catch (err) {
            console.error("[grammar] findMany failed:", err);
            await ctx.editMessageText("❌ Grammatika hozircha yuklanmadi. Keyinroq urinib ko'ring.", {
                reply_markup: new InlineKeyboard().text("Ortga", "menu:main"),
            });
            return;
        }
        if (topics.length === 0) {
            await ctx.editMessageText("📭 Hozircha grammatika mavzulari yo'q.", {
                reply_markup: new InlineKeyboard().text("Ortga", "menu:main"),
            });
            return;
        }
        const keyboard = new InlineKeyboard();
        for (const topic of topics) {
            keyboard.text(topic.title, `grammar_view:${topic.slug}`).row();
        }
        keyboard.text("Ortga", "menu:main");
        await ctx.editMessageText("<b>Grammatika (Topics)</b>\n\nMavzuni tanlang:", {
            parse_mode: "HTML",
            reply_markup: keyboard,
        });
    });
    bot.callbackQuery(/^grammar_view:(.+)$/, async (ctx) => {
        const slug = ctx.match[1];
        await safeAnswerCallback(ctx);
        if (slug === "conditionals") {
            await ctx.editMessageText(conditionalsIntro, {
                parse_mode: "HTML",
                reply_markup: conditionalsMenuKeyboard,
            });
            return;
        }
        if (slug === "infinitive-gerund") {
            await ctx.editMessageText(infinitiveGerundIntro, {
                parse_mode: "HTML",
                reply_markup: infinitiveGerundMenuKeyboard,
            });
            return;
        }
        const topic = await prisma.grammarTopic.findUnique({
            where: { slug },
        });
        if (!topic) {
            await ctx.reply("❌ Mavzu topilmadi.");
            return;
        }
        const backKeyboard = new InlineKeyboard().text("Ortga", "menu:grammar");
        await ctx.editMessageText(topic.content, {
            parse_mode: "HTML",
            reply_markup: backKeyboard,
        });
    });
    for (const [key, message] of Object.entries(conditionalsContentMap)) {
        bot.callbackQuery(`grammar_cond:${key}`, async (ctx) => {
            await safeAnswerCallback(ctx);
            await ctx.editMessageText(message, {
                parse_mode: "HTML",
                reply_markup: conditionalsBackKeyboard,
            });
        });
    }
    for (const [key, message] of Object.entries(infinitiveGerundContentMap)) {
        bot.callbackQuery(`grammar_ig:${key}`, async (ctx) => {
            await safeAnswerCallback(ctx);
            await ctx.editMessageText(message, {
                parse_mode: "HTML",
                reply_markup: infinitiveGerundBackKeyboard,
            });
        });
    }
}
