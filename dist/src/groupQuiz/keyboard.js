import { InlineKeyboard } from "grammy";
/** Telegram inline tugma matni maksimum 64 belgi */
const BUTTON_TEXT_MAX = 64;
function truncateButtonText(text) {
    if (text.length <= BUTTON_TEXT_MAX)
        return text;
    return `${text.slice(0, BUTTON_TEXT_MAX - 1)}…`;
}
export function createUnitPickerKeyboard(page = 1) {
    const keyboard = new InlineKeyboard();
    const perPage = 10;
    const total = 60;
    const pages = Math.ceil(total / perPage);
    const start = (page - 1) * perPage + 1;
    const end = Math.min(page * perPage, total);
    let n = 0;
    for (let i = start; i <= end; i++) {
        keyboard.text(`Unit ${i}`, `gq_pick_unit:${i}`);
        n++;
        if (n % 4 === 0)
            keyboard.row();
    }
    if (n % 4 !== 0)
        keyboard.row();
    if (page > 1)
        keyboard.text("⬅️", `gq_unit_page:${page - 1}`);
    if (page < pages)
        keyboard.text("➡️", `gq_unit_page:${page + 1}`);
    return keyboard;
}
export function createJoinKeyboard(gameId) {
    return new InlineKeyboard().text("✅ Qatnashaman", `gq_join:${gameId}`);
}
export function createAnswerKeyboard(gameId, questionIndex, options) {
    const keyboard = new InlineKeyboard();
    const labels = ["A", "B", "C", "D"];
    for (let i = 0; i < options.length; i++) {
        const opt = options[i];
        keyboard.text(truncateButtonText(`${labels[i]}) ${opt.text}`), `gq_ans:${gameId}:${questionIndex}:${opt.id}`);
        if (i % 2 === 1)
            keyboard.row();
    }
    if (options.length % 2 !== 0)
        keyboard.row();
    return keyboard;
}
