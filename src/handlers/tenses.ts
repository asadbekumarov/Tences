import type { Bot, Context } from "https://deno.land/x/grammy/mod.ts";
import { InlineKeyboard } from "https://deno.land/x/grammy/mod.ts";

const backKeyboard = new InlineKeyboard().text("🔙 Asosiy menyu", "back_to_menu");

const tenseMap: Record<string, string> = {
  present_simple: `
📘 <b>Present Simple</b> (Hozirgi oddiy zamon)

🧠 <b>1. Ta’rifi:</b> Doimiy takrorlanadigan, odatiy harakatlar va umumiy haqiqatlar uchun.
⚙️ <b>2. Tuzilishi:</b>
✅ <b>(+)</b> <code>Subj + V1(s/es)</code>
❌ <b>(-)</b> <code>Subj + do/does not + V1</code>
❓ <b>(?)</b> <code>Do/Does + Subj + V1?</code>
✍️ <b>3. Misol:</b> <i>I work every day. / She works every day.</i>
⏱ <b>4. Signal so‘zlar:</b> <i>always, usually, often, every day, sometimes.</i>`,

  present_continuous: `
📘 <b>Present Continuous</b> (Hozirgi davom etayotgan zamon)

🧠 <b>1. Ta’rifi:</b> Aynan hozir sodir bo'layotgan yoki vaqtincha davom etayotgan harakatlar.
⚙️ <b>2. Tuzilishi:</b>
✅ <b>(+)</b> <code>am/is/are + V-ing</code>
❌ <b>(-)</b> <code>am/is/are + not + V-ing</code>
❓ <b>(?)</b> <code>Am/Is/Are + Subj + V-ing?</code>
✍️ <b>3. Misol:</b> <i>I am studying now. / They are playing football.</i>
⏱ <b>4. Signal so‘zlar:</b> <i>now, right now, at the moment, currently, Look!, Listen!</i>`,

  present_perfect: `
📘 <b>Present Perfect</b> (Hozirgi tugallangan zamon)

🧠 <b>1. Ta’rifi:</b> O'tmishda tugagan, lekin natijasi hozir bilan bog'liq bo'lgan harakatlar.
⚙️ <b>2. Tuzilishi:</b>
✅ <b>(+)</b> <code>have/has + V3 (ed)</code>
❌ <b>(-)</b> <code>have/has + not + V3</code>
❓ <b>(?)</b> <code>Have/Has + Subj + V3?</code>
✍️ <b>3. Misol:</b> <i>I have lost my keys. (Kalitlarim yo'q, natija hozirda).</i>
⏱ <b>4. Signal so‘zlar:</b> <i>just, already, yet, ever, never, since, for.</i>`,

  present_perfect_continuous: `
📘 <b>Present Perfect Continuous</b>

🧠 <b>1. Ta’rifi:</b> O'tmishda boshlanib, hozirgacha to'xtovsiz davom etayotgan harakatlar.
⚙️ <b>2. Tuzilishi:</b>
✅ <b>(+)</b> <code>have/has + been + V-ing</code>
❌ <b>(-)</b> <code>have/has + not + been + V-ing</code>
✍️ <b>3. Misol:</b> <i>It has been raining for two hours. (Hali ham yog'yapti).</i>
⏱ <b>4. Signal so‘zlar:</b> <i>for, since, all day, lately.</i>`,

  // --- PAST TENSES ---
  past_simple: `
📘 <b>Past Simple</b> (O'tgan oddiy zamon)

🧠 <b>1. Ta’rifi:</b> O'tmishda aniq bir vaqtda tugagan harakatlar.
⚙️ <b>2. Tuzilishi:</b>
✅ <b>(+)</b> <code>Subj + V2 (ed)</code>
❌ <b>(-)</b> <code>Subj + did not + V1</code>
❓ <b>(?)</b> <code>Did + Subj + V1?</code>
✍️ <b>3. Misol:</b> <i>I watched a movie yesterday. / We went to Samarkand.</i>
⏱ <b>4. Signal so‘zlar:</b> <i>yesterday, last week, in 2020, ago.</i>`,

  past_continuous: `
📘 <b>Past Continuous</b> (O'tgan davom etayotgan zamon)

🧠 <b>1. Ta’rifi:</b> O'tmishda ma'lum bir vaqtda davom etayotgan harakatlar.
⚙️ <b>2. Tuzilishi:</b>
✅ <b>(+)</b> <code>was/were + V-ing</code>
❌ <b>(-)</b> <code>was/were + not + V-ing</code>
✍️ <b>3. Misol:</b> <i>I was sleeping when you called.</i>
⏱ <b>4. Signal so‘zlar:</b> <i>while, when, at 5 o'clock yesterday.</i>`,

  past_perfect: `
📘 <b>Past Perfect</b> (O‘tgan tugallangan zamon)

🧠 <b>1. Ta’rifi:</b> O‘tmishda bir harakat boshqa bir harakatdan oldin tugaganini bildiradi.
⚙️ <b>2. Tuzilishi:</b>
✅ <b>(+)</b> <code>Subj + had + V3</code>
❌ <b>(-)</b> <code>Subj + had not + V3</code>
❓ <b>(?)</b> <code>Had + Subj + V3?</code>
✍️ <b>3. Misol:</b> <i>I had finished my work before he came. / She had left when I arrived.</i>
⏱ <b>4. Signal so‘zlar:</b> <i>before, after, already, just, by the time, when</i>`,

  past_perfect_continuous: `
📘 <b>Past Perfect Continuous</b> (O‘tgan davom etib tugagan zamon)

🧠 <b>1. Ta’rifi:</b> O‘tmishda bir vaqtgacha davom etib kelgan harakatni bildiradi (boshqa harakatdan oldin davom etgan).
⚙️ <b>2. Tuzilishi:</b>
✅ <b>(+)</b> <code>Subj + had been + V-ing</code>
❌ <b>(-)</b> <code>Subj + had not been + V-ing</code>
❓ <b>(?)</b> <code>Had + Subj + been + V-ing?</code>
✍️ <b>3. Misol:</b> <i>I had been working for 2 hours before he came. / They had been playing when it started to rain.</i>
⏱ <b>4. Signal so‘zlar:</b> <i>for, since, before, when, by the time</i>`,

  // --- FUTURE TENSES ---
  future_simple: `
📘 <b>Future Simple</b> (Kelajak oddiy zamon)

🧠 <b>1. Ta’rifi:</b> Kelajakda sodir bo'ladigan qarorlar, bashoratlar va va'dalar.
⚙️ <b>2. Tuzilishi:</b>
✅ <b>(+)</b> <code>will + V1</code>
❌ <b>(-)</b> <code>will not (won't) + V1</code>
❓ <b>(?)</b> <code>Will + Subj + V1?</code>
✍️ <b>3. Misol:</b> <i>I will help you. / It will rain tomorrow.</i>
⏱ <b>4. Signal so‘zlar:</b> <i>tomorrow, next year, soon, in the future.</i>`,

  future_continuous: `
📘 <b>Future Continuous</b> (Kelasi davom etayotgan zamon)

🧠 <b>1. Ta’rifi:</b> Kelajakda ma’lum bir vaqtda davom etayotgan harakatni bildiradi.
⚙️ <b>2. Tuzilishi:</b>
✅ <b>(+)</b> <code>Subj + will be + V-ing</code>
❌ <b>(-)</b> <code>Subj + will not (won’t) be + V-ing</code>
❓ <b>(?)</b> <code>Will + Subj + be + V-ing?</code>
✍️ <b>3. Misol:</b> <i>I will be studying at 8 PM. / They will be playing football tomorrow.</i>
⏱ <b>4. Signal so‘zlar:</b> <i>at this time tomorrow, at 8 PM, next week, tomorrow, soon</i>`,

  future_perfect: `
📘 <b>Future Perfect</b> (Kelasi tugallangan zamon)

🧠 <b>1. Ta’rifi:</b> Kelajakda ma’lum bir vaqtgacha harakat tugagan bo‘lishini bildiradi.
⚙️ <b>2. Tuzilishi:</b>
✅ <b>(+)</b> <code>Subj + will have + V3</code>
❌ <b>(-)</b> <code>Subj + will not (won’t) have + V3</code>
❓ <b>(?)</b> <code>Will + Subj + have + V3?</code>
✍️ <b>3. Misol:</b> <i>I will have finished my work by 6 PM. / She will have left before you arrive.</i>
⏱ <b>4. Signal so‘zlar:</b> <i>by, by the time, before, until, by tomorrow, by next week</i>`,

  future_perfect_continuous: `
📘 <b>Future Perfect Continuous</b> (Kelasi davom etib tugagan zamon)

🧠 <b>1. Ta’rifi:</b> Kelajakda ma’lum bir vaqtgacha harakat qancha vaqt davom etib kelayotganini bildiradi.
⚙️ <b>2. Tuzilishi:</b>
✅ <b>(+)</b> <code>Subj + will have been + V-ing</code>
❌ <b>(-)</b> <code>Subj + will not (won’t) have been + V-ing</code>
❓ <b>(?)</b> <code>Will + Subj + have been + V-ing?</code>
✍️ <b>3. Misol:</b> <i>By next year, I will have been working here for 5 years. / She will have been studying for 3 hours by 10 PM.</i>
⏱ <b>4. Signal so‘zlar:</b> <i>for, since, by, by the time, by next year, by 10 PM</i>`,
};

export function registerTenseHandlers(bot: Bot<Context>) {
  for (const [key, message] of Object.entries(tenseMap)) {
    bot.callbackQuery(key, async (ctx) => {
      await ctx.answerCallbackQuery();

      await ctx.editMessageText(message, {
        parse_mode: "HTML",
      });
    });
  }
}
