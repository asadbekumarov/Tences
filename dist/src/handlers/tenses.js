import { InlineKeyboard } from "grammy";
import { mainMenuCaption } from "../commands/start.js";
import { createUnitKeyboard, mainMenuKeyboard } from "../keyboard/menu.js";
const backKeyboard = new InlineKeyboard().text("🔙 Asosiy menyu", "back_to_menu");
const vocabBackKeyboard = new InlineKeyboard().text("🔙 Lug'at menyusi", "vocab_menu").row().text("🔙 Asosiy menyu", "back_to_menu");
const tenseMap = {
    present_simple: `
<b>📘 PRESENT SIMPLE</b>

🧠 <b>1. Ta’rifi:</b> Doimiy takrorlanadigan, odatiy harakatlar va umumiy haqiqatlar uchun.
⚙️ <b>2. Tuzilishi:</b>
<code>✅ (+) Subj + V1(s/es)
❌ (-) Subj + do/does not + V1
❓ (?) Do/Does + Subj + V1?</code>
✍️ <b>3. Misol:</b>
<i>I work every day.</i>
<i>She works every day.</i>
⏱ <b>4. Signal so‘zlar:</b> <code>always</code>, <code>usually</code>, <code>often</code>, <code>every day</code>, <code>sometimes</code>`,
    present_continuous: `
<b>📘 PRESENT CONTINUOUS</b>

🧠 <b>1. Ta’rifi:</b> Aynan hozir sodir bo'layotgan yoki vaqtincha davom etayotgan harakatlar.
⚙️ <b>2. Tuzilishi:</b>
<code>✅ (+) am/is/are + V-ing
❌ (-) am/is/are + not + V-ing
❓ (?) Am/Is/Are + Subj + V-ing?</code>
✍️ <b>3. Misol:</b>
<i>I am studying now.</i>
<i>They are playing football.</i>
⏱ <b>4. Signal so‘zlar:</b> <code>now</code>, <code>right now</code>, <code>at the moment</code>, <code>currently</code>, <code>Look!</code>, <code>Listen!</code>`,
    present_perfect: `
<b>📘 PRESENT PERFECT</b>

🧠 <b>1. Ta’rifi:</b> O'tmishda tugagan, lekin natijasi hozir bilan bog'liq bo'lgan harakatlar.
⚙️ <b>2. Tuzilishi:</b>
<code>✅ (+) have/has + V3 (ed)
❌ (-) have/has + not + V3
❓ (?) Have/Has + Subj + V3?</code>
✍️ <b>3. Misol:</b>
<i>I have lost my keys. (Kalitlarim yo'q, natija hozirda).</i>
⏱ <b>4. Signal so‘zlar:</b> <code>just</code>, <code>already</code>, <code>yet</code>, <code>ever</code>, <code>never</code>, <code>since</code>, <code>for</code>`,
    present_perfect_continuous: `
<b>📘 PRESENT PERFECT CONTINUOUS</b>

🧠 <b>1. Ta’rifi:</b> O'tmishda boshlanib, hozirgacha to'xtovsiz davom etayotgan harakatlar.
⚙️ <b>2. Tuzilishi:</b>
<code>✅ (+) have/has + been + V-ing
❌ (-) have/has + not + been + V-ing</code>
✍️ <b>3. Misol:</b>
<i>It has been raining for two hours. (Hali ham yog'yapti).</i>
⏱ <b>4. Signal so‘zlar:</b> <code>for</code>, <code>since</code>, <code>all day</code>, <code>lately</code>`,
    past_simple: `
<b>📘 PAST SIMPLE</b>

🧠 <b>1. Ta’rifi:</b> O'tmishda aniq bir vaqtda tugagan harakatlar.
⚙️ <b>2. Tuzilishi:</b>
<code>✅ (+) Subj + V2 (ed)
❌ (-) Subj + did not + V1
❓ (?) Did + Subj + V1?</code>
✍️ <b>3. Misol:</b>
<i>I watched a movie yesterday.</i>
<i>We went to Samarkand.</i>
⏱ <b>4. Signal so‘zlar:</b> <code>yesterday</code>, <code>last week</code>, <code>in 2020</code>, <code>ago</code>`,
    past_continuous: `
<b>📘 PAST CONTINUOUS</b>

🧠 <b>1. Ta’rifi:</b> O'tmishda ma'lum bir vaqtda davom etayotgan harakatlar.
⚙️ <b>2. Tuzilishi:</b>
<code>✅ (+) was/were + V-ing
❌ (-) was/were + not + V-ing</code>
✍️ <b>3. Misol:</b>
<i>I was sleeping when you called.</i>
⏱ <b>4. Signal so‘zlar:</b> <code>while</code>, <code>when</code>, <code>at 5 o'clock yesterday</code>`,
    past_perfect: `
<b>📘 PAST PERFECT</b>

🧠 <b>1. Ta’rifi:</b> O‘tmishda bir harakat boshqa bir harakatdan oldin tugaganini bildiradi.
⚙️ <b>2. Tuzilishi:</b>
<code>✅ (+) Subj + had + V3
❌ (-) Subj + had not + V3
❓ (?) Had + Subj + V3?</code>
✍️ <b>3. Misol:</b>
<i>I had finished my work before he came.</i>
<i>She had left when I arrived.</i>
⏱ <b>4. Signal so‘zlar:</b> <code>before</code>, <code>after</code>, <code>already</code>, <code>just</code>, <code>by the time</code>, <code>when</code>`,
    past_perfect_continuous: `
<b>📘 PAST PERFECT CONTINUOUS</b>

🧠 <b>1. Ta’rifi:</b> O‘tmishda bir vaqtgacha davom etib kelgan harakatni bildiradi (boshqa harakatdan oldin davom etgan).
⚙️ <b>2. Tuzilishi:</b>
<code>✅ (+) Subj + had been + V-ing
❌ (-) Subj + had not been + V-ing
❓ (?) Had + Subj + been + V-ing?</code>
✍️ <b>3. Misol:</b>
<i>I had been working for 2 hours before he came.</i>
<i>They had been playing when it started to rain.</i>
⏱ <b>4. Signal so‘zlar:</b> <code>for</code>, <code>since</code>, <code>before</code>, <code>when</code>, <code>by the time</code>`,
    future_simple: `
<b>📘 FUTURE SIMPLE</b>

🧠 <b>1. Ta’rifi:</b> Kelajakda sodir bo'ladigan qarorlar, bashoratlar va va'dalar.
⚙️ <b>2. Tuzilishi:</b>
<code>✅ (+) will + V1
❌ (-) will not (won't) + V1
❓ (?) Will + Subj + V1?</code>
✍️ <b>3. Misol:</b>
<i>I will help you.</i>
<i>It will rain tomorrow.</i>
⏱ <b>4. Signal so‘zlar:</b> <code>tomorrow</code>, <code>next year</code>, <code>soon</code>, <code>in the future</code>`,
    future_continuous: `
<b>📘 FUTURE CONTINUOUS</b>

🧠 <b>1. Ta’rifi:</b> Kelajakda ma’lum bir vaqtda davom etayotgan harakatni bildiradi.
⚙️ <b>2. Tuzilishi:</b>
<code>✅ (+) Subj + will be + V-ing
❌ (-) Subj + will not (won’t) be + V-ing
❓ (?) Will + Subj + be + V-ing?</code>
✍️ <b>3. Misol:</b>
<i>I will be studying at 8 PM.</i>
<i>They will be playing football tomorrow.</i>
⏱ <b>4. Signal so‘zlar:</b> <code>at this time tomorrow</code>, <code>at 8 PM</code>, <code>next week</code>, <code>tomorrow</code>, <code>soon</code>`,
    future_perfect: `
<b>📘 FUTURE PERFECT</b>

🧠 <b>1. Ta’rifi:</b> Kelajakda ma’lum bir vaqtgacha harakat tugagan bo‘lishini bildiradi.
⚙️ <b>2. Tuzilishi:</b>
<code>✅ (+) Subj + will have + V3
❌ (-) Subj + will not (won’t) have + V3
❓ (?) Will + Subj + have + V3?</code>
✍️ <b>3. Misol:</b>
<i>I will have finished my work by 6 PM.</i>
<i>She will have left before you arrive.</i>
⏱ <b>4. Signal so‘zlar:</b> <code>by</code>, <code>by the time</code>, <code>before</code>, <code>until</code>, <code>by tomorrow</code>, <code>by next week</code>`,
    future_perfect_continuous: `
<b>📘 FUTURE PERFECT CONTINUOUS</b>

🧠 <b>1. Ta’rifi:</b> Kelajakda ma’lum bir vaqtgacha harakat qancha vaqt davom etib kelayotganini bildiradi.
⚙️ <b>2. Tuzilishi:</b>
<code>✅ (+) Subj + will have been + V-ing
❌ (-) Subj + will not (won’t) have been + V-ing
❓ (?) Will + Subj + have been + V-ing?</code>
✍️ <b>3. Misol:</b>
<i>By next year, I will have been working here for 5 years.</i>
<i>She will have been studying for 3 hours by 10 PM.</i>
⏱ <b>4. Signal so‘zlar:</b> <code>for</code>, <code>since</code>, <code>by</code>, <code>by the time</code>, <code>by next year</code>, <code>by 10 PM</code>`,
};
export function registerTenseHandlers(bot) {
    bot.callbackQuery("back_to_menu", async (ctx) => {
        await ctx.answerCallbackQuery();
        const name = ctx.from?.first_name ?? "do'stim";
        await ctx.editMessageText(mainMenuCaption(name), {
            reply_markup: mainMenuKeyboard,
        });
    });
    bot.callbackQuery("vocab_menu", async (ctx) => {
        await ctx.answerCallbackQuery();
        await ctx.editMessageText("📚 <b>Lug'at (Unitlar)</b>\n\nUnitni tanlang:", {
            parse_mode: "HTML",
            reply_markup: createUnitKeyboard(1),
        });
    });
    bot.callbackQuery(/^vocab_page_(\d+)$/, async (ctx) => {
        const page = parseInt(ctx.match[1]);
        await ctx.answerCallbackQuery();
        await ctx.editMessageText("📚 <b>Lug'at (Unitlar)</b>\n\nUnitni tanlang:", {
            parse_mode: "HTML",
            reply_markup: createUnitKeyboard(page),
        });
    });
    bot.callbackQuery(/^unit_(\d+)$/, async (ctx) => {
        const unitNumber = parseInt(ctx.match[1]);
        await ctx.answerCallbackQuery();
        const loadingMsg = await ctx.reply("⏳ Yuklanmoqda...");
        try {
            const response = await fetch("https://api.sheety.co/0232f558770bc97ab6fe06068d70d781/vacab/varaq1");
            const data = await response.json();
            if (!data || !data.varaq1) {
                throw new Error("Ma'lumot topilmadi");
            }
            const filteredWords = data.varaq1.filter((item) => item.unit === unitNumber);
            if (filteredWords.length === 0) {
                await ctx.api.deleteMessage(ctx.chat.id, loadingMsg.message_id);
                await ctx.reply(`❌ Unit ${unitNumber} bo'yicha so'zlar topilmadi.`, {
                    reply_markup: vocabBackKeyboard,
                });
                return;
            }
            let messageText = `📚 <b>Unit ${unitNumber}</b>\n\n`;
            filteredWords.forEach((item) => {
                messageText += `🔹 <code>${item.word}</code> — ${item.translation}\n`;
            });
            messageText += `\n💡 <i>So'z ustiga bossangiz, nusxa olinadi.</i>`;
            await ctx.api.deleteMessage(ctx.chat.id, loadingMsg.message_id);
            await ctx.reply(messageText, {
                parse_mode: "HTML",
                reply_markup: vocabBackKeyboard,
            });
        }
        catch (error) {
            console.error("API error:", error);
            await ctx.api.deleteMessage(ctx.chat.id, loadingMsg.message_id);
            await ctx.reply("❌ Ma'lumotlarni yuklashda xatolik yuz berdi.", {
                reply_markup: vocabBackKeyboard,
            });
        }
    });
    for (const [key, message] of Object.entries(tenseMap)) {
        bot.callbackQuery(key, async (ctx) => {
            await ctx.answerCallbackQuery();
            await ctx.editMessageText(message, {
                parse_mode: "HTML",
                reply_markup: backKeyboard,
            });
        });
    }
}
