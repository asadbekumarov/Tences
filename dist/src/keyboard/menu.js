import { InlineKeyboard } from "grammy";
export const mainMenuKeyboard = new InlineKeyboard()
    .text("Present Simple", "present_simple")
    .text("Present Continuous", "present_continuous")
    .row()
    .text("Present Perfect", "present_perfect")
    .text("Present Perfect Continuous", "present_perfect_continuous")
    .row()
    .text("Past Simple", "past_simple")
    .text("Past Continuous", "past_continuous")
    .row()
    .text("Past Perfect", "past_perfect")
    .text("Past Perfect Continuous", "past_perfect_continuous")
    .row()
    .text("Future Simple", "future_simple")
    .text("Future Continuous", "future_continuous")
    .row()
    .text("Future Perfect", "future_perfect")
    .text("Future Perfect Continuous", "future_perfect_continuous")
    .row()
    .text("📚 Lug'at", "vocab_menu")
    .text("🔴 Irregular Verbs", "iv_menu");
/** 1 dan 60 gacha Unitlar uchun sahifalash (pagination) bilan klaviatura */
export function createUnitKeyboard(page = 1) {
    const keyboard = new InlineKeyboard();
    const itemsPerPage = 10;
    const totalUnits = 60;
    const totalPages = Math.ceil(totalUnits / itemsPerPage);
    const start = (page - 1) * itemsPerPage + 1;
    const end = Math.min(page * itemsPerPage, totalUnits);
    // Unit raqamlari (har bir qatorda 4 tadan)
    let count = 0;
    for (let i = start; i <= end; i++) {
        keyboard.text(i.toString(), `unit_${i}`);
        count++;
        if (count % 4 === 0)
            keyboard.row();
    }
    // Sahifalash tugmalari
    if (count % 4 !== 0)
        keyboard.row();
    if (page > 1) {
        keyboard.text("⬅️ Oldingi", `vocab_page_${page - 1}`);
    }
    if (page < totalPages) {
        keyboard.text("Keyingi ➡️", `vocab_page_${page + 1}`);
    }
    keyboard.row().text("🔙 Asosiy menyu", "back_to_menu");
    return keyboard;
}
/** Harflar bo‘yicha irregular verb guruhlari */
export const irregularRangeKeyboard = new InlineKeyboard()
    .text("A — D", "iv_ad")
    .text("E — K", "iv_ek")
    .row()
    .text("L — R", "iv_lr")
    .text("S — Z", "iv_sz")
    .row()
    .text("🔙 Asosiy menyu", "back_to_menu");
/** Ro‘yxatdan keyin: harflar menyusi yoki asosiy menyu */
export const irregularListFooterKeyboard = new InlineKeyboard()
    .text("🔙 Harflar guruhi", "iv_menu")
    .row()
    .text("🔙 Asosiy menyu", "back_to_menu");
