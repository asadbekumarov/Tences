import { InlineKeyboard } from "grammy";
import { isGroupAdmin } from "../utils/chat.js";
export function groupGameCaption(isAdmin) {
    const base = "🎮 <b>Guruh Quiz Battle</b>\n\n" +
        "👥 Barcha ishtirokchilar bir xil savollarga javob beradi.\n" +
        "⚡ Birinchi to'g'ri javob — <b>+1 ball</b>\n" +
        "📊 Unitdagi barcha so'zlar, har 5 savolda reyting\n\n" +
        "1️⃣ Admin unit tanlaydi\n" +
        "2️⃣ 60 soniya — <b>✅ Qatnashaman</b> (soniya real vaqtda kamayadi)\n" +
        "3️⃣ So'zlar tugagach — natija!";
    if (isAdmin) {
        return base + "\n\n👑 <i>Siz admin — quyidagi tugma orqali boshlang.</i>";
    }
    return base + "\n\n⏳ Admin o'yin boshlashini kuting.";
}
export function createGroupGameMenuKeyboard(isAdmin) {
    const keyboard = new InlineKeyboard();
    if (isAdmin) {
        keyboard.text("🚀 O'yin boshlash", "gq_admin_start");
    }
    return keyboard;
}
export async function sendGroupGameMenu(ctx, edit = false) {
    const admin = await isGroupAdmin(ctx);
    const text = groupGameCaption(admin);
    const reply_markup = createGroupGameMenuKeyboard(admin);
    const opts = { parse_mode: "HTML", reply_markup };
    if (edit && ctx.callbackQuery) {
        await ctx.editMessageText(text, opts);
    }
    else {
        await ctx.reply(text, opts);
    }
}
