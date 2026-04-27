import { findVerbByAnyForm, verbsInLetterRange, } from "../data/verbs.js";
import { irregularListFooterKeyboard, irregularRangeKeyboard, mainMenuKeyboard, } from "../keyboard/menu.js";
const RANGE_LABEL = {
    ad: "A — D",
    ek: "E — K",
    lr: "L — R",
    sz: "S — Z",
};
function formatVerbCard(v) {
    return (`🔤 <b>${escapeHtml(v.v1)}</b> — <i>${escapeHtml(v.translation)}</i>\n\n` +
        `<b>V1 (infinitive):</b> <code>${escapeHtml(v.v1)}</code>\n` +
        `<b>V2 (Past Simple):</b> <code>${escapeHtml(v.v2)}</code>\n` +
        `<b>V3 (Past Participle):</b> <code>${escapeHtml(v.v3)}</code>`);
}
function escapeHtml(s) {
    return s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}
function pad(s, len) {
    return s + " ".repeat(Math.max(0, len - s.length));
}
function formatVerbListHtml(range) {
    const verbs = verbsInLetterRange(range);
    const title = RANGE_LABEL[range];
    // Ustunlar uchun maksimal uzunlikni aniqlash
    let maxV1 = 0;
    let maxV2 = 0;
    verbs.forEach((v) => {
        if (v.v1.length > maxV1)
            maxV1 = v.v1.length;
        if (v.v2.length > maxV2)
            maxV2 = v.v2.length;
    });
    const lines = verbs.map((v, i) => {
        const n = (i + 1).toString().padEnd(2, " ");
        const v1 = pad(v.v1, maxV1);
        const v2 = pad(v.v2, maxV2);
        const v3 = v.v3;
        // Butun qatorni monospaced (code) qilish, shunda padding ishlaydi
        const formsLine = `<code>${n}. ${escapeHtml(v1)} — ${escapeHtml(v2)} — ${escapeHtml(v3)}</code>`;
        return (formsLine + `\n💡 <i>${escapeHtml(v.translation)}</i>`);
    });
    return (`🔴 <b>Irregular verbs</b> (${title})\n\n` +
        lines.join("\n\n"));
}
function notFoundHint() {
    return ("❓ Bu so‘z irregular verbs bazamizda topilmadi.\n\n" +
        "📘 Ingliz <b>zamonlari</b> bo‘yicha ma’lumot uchun pastdagi menyudan tanlang yoki " +
        "<b>🔴 Irregular Verbs</b> bo‘limiga kiring.\n\n" +
        "Yoki bazadagi fe’lni <b>V1, V2 yoki V3</b> shaklida yozing (masalan: <code>went</code>, <code>go</code>).");
}
export function registerVerbHandlers(bot) {
    bot.callbackQuery("iv_menu", async (ctx) => {
        await ctx.answerCallbackQuery();
        await ctx.editMessageText("🔴 <b>Irregular verbs</b>\n\nHarflar oralig‘ini tanlang:", {
            parse_mode: "HTML",
            reply_markup: irregularRangeKeyboard,
        });
    });
    const rangeHandlers = [
        { data: "ad", key: "iv_ad" },
        { data: "ek", key: "iv_ek" },
        { data: "lr", key: "iv_lr" },
        { data: "sz", key: "iv_sz" },
    ];
    for (const { data, key } of rangeHandlers) {
        bot.callbackQuery(key, async (ctx) => {
            await ctx.answerCallbackQuery();
            const html = formatVerbListHtml(data);
            await ctx.editMessageText(html, {
                parse_mode: "HTML",
                reply_markup: irregularListFooterKeyboard,
            });
        });
    }
    bot.on("message:text").filter((ctx) => {
        const t = ctx.message?.text?.trim();
        return Boolean(t && !t.startsWith("/"));
    }, async (ctx) => {
        const raw = ctx.message.text.trim();
        const tokens = raw.split(/\s+/).filter(Boolean);
        let found;
        for (const t of tokens) {
            found = findVerbByAnyForm(t);
            if (found)
                break;
        }
        if (found) {
            await ctx.reply(formatVerbCard(found), { parse_mode: "HTML" });
            return;
        }
        await ctx.reply(notFoundHint(), {
            parse_mode: "HTML",
            reply_markup: mainMenuKeyboard,
        });
    });
}
