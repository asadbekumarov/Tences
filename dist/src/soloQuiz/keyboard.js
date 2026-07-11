import { InlineKeyboard } from "grammy";
export const soloMenuKeyboard = new InlineKeyboard()
    .text("📚 Unit tanlash", "solo_pick_unit")
    .row()
    .text("🏆 Reyting", "solo_leaderboard")
    .row()
    .text("🔙 Asosiy menyu", "menu:main");
export function createSoloUnitKeyboard(page = 1) {
    const keyboard = new InlineKeyboard();
    const perPage = 10;
    const total = 60;
    const pages = Math.ceil(total / perPage);
    const start = (page - 1) * perPage + 1;
    const end = Math.min(page * perPage, total);
    let n = 0;
    for (let i = start; i <= end; i++) {
        keyboard.text(`Unit ${i}`, `solo_unit:${i}`);
        n++;
        if (n % 4 === 0)
            keyboard.row();
    }
    if (n % 4 !== 0)
        keyboard.row();
    if (page > 1)
        keyboard.text("⬅️", `solo_page:${page - 1}`);
    if (page < pages)
        keyboard.text("➡️", `solo_page:${page + 1}`);
    keyboard.row().text("🔙 Game", "game_menu");
    return keyboard;
}
export function createSoloAnswerKeyboard(sessionId, questionIndex, options) {
    const keyboard = new InlineKeyboard();
    const labels = ["A", "B", "C", "D"];
    for (let i = 0; i < options.length; i++) {
        const opt = options[i];
        keyboard.text(`${labels[i]}) ${opt.text}`, `solo_ans:${sessionId}:${questionIndex}:${opt.id}`);
        if (i % 2 === 1)
            keyboard.row();
    }
    if (options.length % 2 !== 0)
        keyboard.row();
    return keyboard;
}
export function soloPlayAgainKeyboard() {
    return new InlineKeyboard()
        .text("🎮 Yana o'ynash", "solo_pick_unit")
        .row()
        .text("🏆 Reyting", "solo_leaderboard")
        .row()
        .text("🔙 Asosiy menyu", "menu:main");
}
