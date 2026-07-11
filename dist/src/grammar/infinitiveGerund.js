import { InlineKeyboard } from "grammy";
export const infinitiveGerundIntro = `<b>📘 Infinitive va Gerund</b>

Ingliz tilida fe'ldan keyin yana bir fe'l kelganda, ikkinchi fe'l odatda ikki xil shaklda ishlatiladi:

<b>1. Infinitive</b> — <code>to + verb</code>
<i>to go, to eat, to study, to play</i>

<b>2. Gerund</b> — <code>verb + ing</code>
<i>going, eating, studying, playing</i>

Taqqoslang:
✅ <i>I want to go.</i>
✅ <i>I enjoy going.</i>

Bu yerda ikkalasi ham fe'l, lekin shakli har xil.

Quyidagi bo'limlardan birini tanlang:`;
export const infinitiveGerundContentMap = {
    infinitive: `<b>📗 Infinitive nima?</b>

Infinitive — fe'lning asosiy shakli bo'lib, oldidan <b>to</b> keladi.

⚙️ <b>Formula:</b>
<code>to + verb</code>

✍️ <b>Misollar:</b>
<code>to work, to read, to sleep, to learn</code>

📌 <b>Gaplarda:</b>
<i>I want to study English.</i>
<i>She decided to leave.</i>
<i>We hope to win.</i>
<i>He needs to rest.</i>

Bu gaplarda ikkinchi fe'l infinitive shaklida kelgan.`,
    gerund: `<b>📘 Gerund nima?</b>

Gerund — fe'lga <b>-ing</b> qo'shilib, ot kabi ishlatiladigan shakl.

⚙️ <b>Formula:</b>
<code>verb + ing</code>

✍️ <b>Misollar:</b>
<code>reading, swimming, playing, learning</code>

📌 <b>Gaplarda:</b>
<i>I enjoy reading.</i>
<i>She loves swimming.</i>
<i>They dislike waiting.</i>
<i>We finished working.</i>

Bu gaplarda ikkinchi fe'l gerund shaklida kelgan.`,
    difference: `<b>📙 Asosiy farq</b>

Taqqoslang:

<b>Infinitive</b>
<i>I want to learn English.</i>
(Men ingliz tilini o'rganishni xohlayman.)

<b>Gerund</b>
<i>I enjoy learning English.</i>
(Men ingliz tilini o'rganishdan zavqlanaman.)

Ikkinchi fe'lning shakli o'zgardi, chunki birinchi fe'l boshqacha.`,
    inf_verbs: `<b>📗 Infinitive oladigan eng muhim fe'llar</b>

Quyidagi fe'llardan keyin odatda <code>to + verb</code> ishlatiladi.

<code>want</code> → <i>I want to go.</i>
<code>need</code> → <i>I need to study.</i>
<code>hope</code> → <i>I hope to win.</i>
<code>decide</code> → <i>She decided to leave.</i>
<code>plan</code> → <i>We plan to travel.</i>
<code>learn</code> → <i>He learned to drive.</i>
<code>agree</code> → <i>They agreed to help.</i>
<code>promise</code> → <i>She promised to come.</i>
<code>expect</code> → <i>I expect to pass.</i>
<code>choose</code> → <i>He chose to stay.</i>

✍️ <b>Qo'shimcha misollar:</b>
<i>I want to eat.</i>
<i>She hopes to find a job.</i>
<i>We decided to go home.</i>
<i>They agreed to help us.</i>
<i>He promised to call me.</i>`,
    ger_verbs: `<b>📘 Gerund oladigan eng muhim fe'llar</b>

Quyidagi fe'llardan keyin odatda <code>verb + ing</code> ishlatiladi.

<code>enjoy</code> → <i>I enjoy reading.</i>
<code>like</code> → <i>She likes dancing.</i>
<code>love</code> → <i>We love traveling.</i>
<code>hate</code> → <i>He hates waiting.</i>
<code>avoid</code> → <i>They avoid talking.</i>
<code>finish</code> → <i>I finished working.</i>
<code>mind</code> → <i>Do you mind helping?</i>
<code>suggest</code> → <i>She suggested going.</i>
<code>keep</code> → <i>Keep studying.</i>
<code>practice</code> → <i>Practice speaking.</i>

✍️ <b>Qo'shimcha misollar:</b>
<i>I enjoy reading books.</i>
<i>She likes swimming.</i>
<i>We love watching movies.</i>
<i>He hates waiting.</i>
<i>They finished cleaning.</i>`,
    memory_rule: `<b>📒 Eslab qolish uchun qoida</b>

<b>Xohish, reja, maqsad bo'lsa → Infinitive</b>
<code>want, need, hope, decide, plan</code>

✍️ <b>Misollar:</b>
<i>I want to learn English.</i>
<i>We plan to travel.</i>
<i>She decided to stay.</i>

<b>Hissiyot, yoqtirish, faoliyat haqida bo'lsa → Gerund</b>
<code>enjoy, like, love, hate, practice</code>

✍️ <b>Misollar:</b>
<i>I enjoy reading.</i>
<i>She loves dancing.</i>
<i>They practice speaking English.</i>`,
    both_forms: `<b>📙 Ba'zi fe'llar ikkala shakl bilan ham keladi</b>

<b>Like</b>
<i>I like to swim.</i>
<i>I like swimming.</i>
Ikkalasi ham to'g'ri.

<b>Love</b>
<i>I love to travel.</i>
<i>I love traveling.</i>
Ikkalasi ham to'g'ri.

<b>Hate</b>
<i>I hate to wait.</i>
<i>I hate waiting.</i>
Ikkalasi ham to'g'ri.`,
    meaning_change: `<b>📕 Ma'nosi o'zgaradigan fe'llar</b>

<b>Remember</b>
<code>remember to do</code> — biror ishni unutmasdan qilish
<i>Remember to call me.</i>
(Menga qo'ng'iroq qilishni unutma.)

<code>remember doing</code> — oldin qilgan ishni eslash
<i>I remember meeting him.</i>
(U bilan uchrashganim esimda.)

<b>Stop</b>
<code>stop to do</code> — bir ishni to'xtatib, boshqa ish qilish
<i>He stopped to drink water.</i>
(U suv ichish uchun to'xtadi.)

<code>stop doing</code> — ishni butunlay to'xtatish
<i>He stopped smoking.</i>
(U chekishni tashladi.)

<b>Try</b>
<code>try to do</code> — harakat qilmoq
<i>Try to open the door.</i>
(Eshikni ochishga harakat qil.)

<code>try doing</code> — sinab ko'rmoq
<i>Try using this app.</i>
(Bu ilovani sinab ko'r.)`,
    prep_gerund: `<b>📒 Gerund predloglardan keyin ishlatiladi</b>

⚙️ <b>Muhim qoida:</b>
<code>Preposition + Gerund</code>

Predloglar:
<code>in, on, at, after, before, without, by, for</code>

✍️ <b>Misollar:</b>
<i>Thank you for helping me.</i>
<i>She left without saying goodbye.</i>
<i>After finishing work, he went home.</i>
<i>Before going to bed, I read a book.</i>
<i>He improved by practicing every day.</i>

❌ <i>Thank you for help me.</i>
✅ <i>Thank you for helping me.</i>`,
    subject_gerund: `<b>📗 Subject sifatida Gerund</b>

Gerund gap boshida ham kelishi mumkin.

✍️ <b>Misollar:</b>
<i>Reading is important.</i>
<i>Learning English takes time.</i>
<i>Swimming is good exercise.</i>
<i>Traveling is exciting.</i>

Bu yerda gerund ot vazifasida ishlatilgan.`,
    errors: `<b>⚠️ Eng ko'p uchraydigan xatolar</b>

❌ <i>I enjoy to read.</i>
✅ <i>I enjoy reading.</i>

❌ <i>She finished to work.</i>
✅ <i>She finished working.</i>

❌ <i>I want going.</i>
✅ <i>I want to go.</i>

❌ <i>We decided going.</i>
✅ <i>We decided to go.</i>

❌ <i>He hopes passing the exam.</i>
✅ <i>He hopes to pass the exam.</i>`,
    summary: `<b>📝 Qisqa xulosa</b>

<b>Infinitive</b>
<code>to + verb</code>
<i>want to go, need to study, decide to leave, hope to win</i>

<b>Gerund</b>
<code>verb + ing</code>
<i>enjoy reading, like swimming, finish working, practice speaking</i>

<b>Eng muhim qoida:</b>
<code>want → to do</code>
<code>need → to do</code>
<code>hope → to do</code>
<code>decide → to do</code>
<code>enjoy → doing</code>
<code>finish → doing</code>
<code>avoid → doing</code>
<code>practice → doing</code>`,
    table: `<b>📊 Tezkor jadval</b>

<code>want    → to do</code>
<code>need    → to do</code>
<code>hope    → to do</code>
<code>decide  → to do</code>
<code>plan    → to do</code>
<code>enjoy   → doing</code>
<code>finish  → doing</code>
<code>avoid   → doing</code>
<code>practice → doing</code>
<code>suggest → doing</code>`,
};
export const infinitiveGerundMenuKeyboard = new InlineKeyboard()
    .text("Infinitive", "grammar_ig:infinitive")
    .text("Gerund", "grammar_ig:gerund")
    .row()
    .text("Asosiy farq", "grammar_ig:difference")
    .row()
    .text("Inf. fe'llar", "grammar_ig:inf_verbs")
    .text("Ger. fe'llar", "grammar_ig:ger_verbs")
    .row()
    .text("Eslab qolish", "grammar_ig:memory_rule")
    .text("Ikkala shakl", "grammar_ig:both_forms")
    .row()
    .text("Ma'no farqi", "grammar_ig:meaning_change")
    .row()
    .text("Predlog + ing", "grammar_ig:prep_gerund")
    .text("Subject ing", "grammar_ig:subject_gerund")
    .row()
    .text("Xatolar", "grammar_ig:errors")
    .text("Tez jadval", "grammar_ig:table")
    .row()
    .text("Xulosa", "grammar_ig:summary")
    .row()
    .text("Ortga", "menu:grammar");
export const infinitiveGerundBackKeyboard = new InlineKeyboard().text("Ortga", "grammar_view:infinitive-gerund");
