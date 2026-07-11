import { InlineKeyboard } from "grammy";
const CALLBACK_PREFIX = "duel";
export function encodeAnswerCallback(duelId, questionId, optionId) {
    return `${CALLBACK_PREFIX}:${duelId}:${questionId}:${optionId}`;
}
export function parseAnswerCallback(data) {
    const parts = data.split(":");
    if (parts.length !== 4 || parts[0] !== CALLBACK_PREFIX)
        return null;
    const questionId = Number.parseInt(parts[2], 10);
    const optionId = Number.parseInt(parts[3], 10);
    if (!Number.isFinite(questionId) || !Number.isFinite(optionId))
        return null;
    return { duelId: parts[1], questionId, optionId };
}
export function createAnswerKeyboard(duel) {
    const question = duel.questions[duel.currentQuestionIndex];
    const keyboard = new InlineKeyboard();
    for (let i = 0; i < question.options.length; i++) {
        const option = question.options[i];
        keyboard.text(option.text, encodeAnswerCallback(duel.id, question.id, option.id));
        if (i % 2 === 1)
            keyboard.row();
    }
    if (question.options.length % 2 !== 0)
        keyboard.row();
    return keyboard;
}
export const gameMenuKeyboard = new InlineKeyboard()
    .text("👥 Do'stni duelga chaqirish", "game_invite")
    .row()
    .text("🎲 Tasodifiy raqib (unit)", "game_random")
    .row()
    .text("🔙 Asosiy menyu", "menu:main");
export function createGameUnitKeyboard(duelId, page = 1) {
    const keyboard = new InlineKeyboard();
    const itemsPerPage = 10;
    const totalUnits = 60;
    const totalPages = Math.ceil(totalUnits / itemsPerPage);
    const start = (page - 1) * itemsPerPage + 1;
    const end = Math.min(page * itemsPerPage, totalUnits);
    let count = 0;
    for (let i = start; i <= end; i++) {
        keyboard.text(`Unit ${i}`, `game_unit:${duelId}:${i}`);
        count++;
        if (count % 4 === 0)
            keyboard.row();
    }
    if (count % 4 !== 0)
        keyboard.row();
    if (page > 1)
        keyboard.text("⬅️", `game_upage:${duelId}:${page - 1}`);
    if (page < totalPages)
        keyboard.text("➡️", `game_upage:${duelId}:${page + 1}`);
    keyboard.row().text("🔙 Game", "game_menu");
    return keyboard;
}
export function createRandomUnitKeyboard(page = 1) {
    const keyboard = new InlineKeyboard();
    const itemsPerPage = 10;
    const totalUnits = 60;
    const totalPages = Math.ceil(totalUnits / itemsPerPage);
    const start = (page - 1) * itemsPerPage + 1;
    const end = Math.min(page * itemsPerPage, totalUnits);
    let count = 0;
    for (let i = start; i <= end; i++) {
        keyboard.text(`⚔️ ${i}`, `duel_unit_${i}`);
        count++;
        if (count % 4 === 0)
            keyboard.row();
    }
    if (count % 4 !== 0)
        keyboard.row();
    if (page > 1)
        keyboard.text("⬅️", `duel_page_${page - 1}`);
    if (page < totalPages)
        keyboard.text("➡️", `duel_page_${page + 1}`);
    keyboard.row().text("🔙 Game", "game_menu");
    return keyboard;
}
export function createReadyKeyboard(duelId, isReady) {
    const keyboard = new InlineKeyboard();
    if (!isReady) {
        keyboard.text("✅ Tayyorman!", `game_ready:${duelId}`);
    }
    else {
        keyboard.text("⏳ Tayyor...", `game_ready_wait:${duelId}`);
    }
    return keyboard;
}
export const duelLeaveQueueKeyboard = new InlineKeyboard().text("❌ Navbatdan chiqish", "duel_leave_queue");
/** @deprecated use createRandomUnitKeyboard */
export function createDuelUnitKeyboard(page = 1) {
    return createRandomUnitKeyboard(page);
}
