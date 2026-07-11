import { InlineKeyboard } from "grammy";
export const conditionalsIntro = `<b>📘 If-li gaplar (Conditionals)</b>

<b>If Clause nima?</b>
If clause — bu shartni bildiradigan gap. U 2 qismdan iborat:
1. <b>If clause</b> (shart)
2. <b>Main clause</b> (natija)

✍️ <b>Misol:</b>
<i>If it rains, we will stay at home.</i>
(Agar yomg'ir yog'sa, uyda qolamiz.)

Bu yerda:
• <i>If it rains</i> → shart
• <i>we will stay at home</i> → natija

<b>Eslatma:</b>
Agar gap If bilan boshlansa, vergul (,) qo'yiladi.
✅ <i>If it rains, we will stay at home.</i>

Agar natija oldin kelsa, vergul kerak emas.
✅ <i>We will stay at home if it rains.</i>

Quyidagi bo'limlardan birini tanlang:`;
export const conditionalsContentMap = {
    zero: `<b>📗 0-Conditional (Zero Conditional)</b>

🧠 <b>Ishlatilishi:</b> Doimiy haqiqatlar, ilmiy faktlar va umumiy qonuniyatlar uchun.

⚙️ <b>Tuzilishi:</b>
<code>If + Present Simple, Present Simple</code>

📐 <b>Formula:</b>
<code>If + V1(s/es), V1(s/es)</code>

✍️ <b>Misollar:</b>
<i>If you heat ice, it melts.</i>
(Agar muzni qizdirsangiz, u eriydi.)

<i>If you don't eat, you get hungry.</i>
(Agar ovqat yemangiz, qorningiz ochadi.)

<i>If water reaches 100°C, it boils.</i>
(Agar suv 100°C ga yetsa, qaynaydi.)

⏱ <b>Signal:</b> Natija har doim bir xil bo'ladi.`,
    first: `<b>📘 1-Conditional (First Conditional)</b>

🧠 <b>Ishlatilishi:</b> Kelajakda sodir bo'lishi mumkin bo'lgan real vaziyatlar uchun.

⚙️ <b>Tuzilishi:</b>
<code>If + Present Simple, will + V1</code>

📐 <b>Formula:</b>
<code>If + V1(s/es), will + V1</code>

✍️ <b>Misollar:</b>
<i>If it rains, we will stay at home.</i>
(Agar yomg'ir yog'sa, uyda qolamiz.)

<i>If I study hard, I will pass the exam.</i>
(Agar qattiq o'qisam, imtihondan o'taman.)

<i>If you call me, I will help you.</i>
(Agar menga qo'ng'iroq qilsang, yordam beraman.)

⚠️ <b>Muhim qoida:</b>
❌ <i>If it will rain, we will stay at home.</i>
✅ <i>If it rains, we will stay at home.</i>

If dan keyin odatda <b>will</b> ishlatilmaydi.`,
    second: `<b>📙 2-Conditional (Second Conditional)</b>

🧠 <b>Ishlatilishi:</b> Hozirgi yoki kelajakdagi noreal, tasavvuriy holatlar uchun.

⚙️ <b>Tuzilishi:</b>
<code>If + Past Simple, would + V1</code>

📐 <b>Formula:</b>
<code>If + V2, would + V1</code>

✍️ <b>Misollar:</b>
<i>If I had a million dollars, I would buy a house.</i>
(Agar million dollarim bo'lganda edi, uy sotib olardim.)

<i>If I were rich, I would travel around the world.</i>
(Agar boy bo'lganimda edi, dunyo bo'ylab sayohat qilardim.)

<i>If she knew English, she would get the job.</i>
(Agar u ingliz tilini bilganida edi, ishni olardi.)

⚠️ <b>Muhim qoida:</b> Rasmiy ingliz tilida:
✅ <i>If I were...</i>
❌ <i>If I was...</i>
<b>were</b> ishlatish tavsiya qilinadi.`,
    third: `<b>📕 3-Conditional (Third Conditional)</b>

🧠 <b>Ishlatilishi:</b> O'tmishda bo'lgan, lekin endi o'zgartirib bo'lmaydigan vaziyatlar uchun.

⚙️ <b>Tuzilishi:</b>
<code>If + Past Perfect, would have + V3</code>

📐 <b>Formula:</b>
<code>If + had + V3, would have + V3</code>

✍️ <b>Misollar:</b>
<i>If I had studied harder, I would have passed the exam.</i>
(Agar qattiqroq o'qiganimda, imtihondan o'tgan bo'lardim.)

<i>If she had left earlier, she would have caught the bus.</i>
(Agar ertaroq chiqqanida, avtobusga ulgurgan bo'lardi.)

<i>If we had known, we would have helped you.</i>
(Agar bilganimizda, sizga yordam bergan bo'lardik.)

⏱ <b>Signal:</b> Bu voqealar o'tib ketgan va endi o'zgartirib bo'lmaydi.`,
    unless: `<b>📒 Unless</b>

<b>Unless = If not</b>

✍️ <b>Misollar:</b>
<i>Unless you study, you will fail.</i>
(Agar o'qimasang, yiqilasan.)

<i>If you do not study, you will fail.</i>
(Agar o'qimasang, yiqilasan.)

Ma'nosi bir xil.`,
    table: `<b>📊 Tez yodlash jadvali</b>

<b>0 → Fakt</b>
<code>If + Present → Present</code>
<i>If water boils, it becomes steam.</i>

<b>1 → Real kelajak</b>
<code>If + Present → will + V1</code>
<i>If I study, I will pass.</i>

<b>2 → Tasavvur</b>
<code>If + Past → would + V1</code>
<i>If I were rich, I would buy a Ferrari.</i>

<b>3 → O'tmishdagi afsus</b>
<code>If + Past Perfect → would have + V3</code>
<i>If I had studied, I would have passed.</i>`,
    errors: `<b>⚠️ Eng ko'p uchraydigan xatolar</b>

❌ <i>If it will rain, we will stay home.</i>
✅ <i>If it rains, we will stay home.</i>

❌ <i>If I would have money, I would buy a car.</i>
✅ <i>If I had money, I would buy a car.</i>

❌ <i>If I was rich, I would travel.</i>
✅ <i>If I were rich, I would travel.</i>`,
    summary: `<b>📝 Qisqa xulosa</b>

<b>0-Conditional</b> → Fakt
<b>1-Conditional</b> → Real kelajak
<b>2-Conditional</b> → Tasavvuriy holat
<b>3-Conditional</b> → O'tmishdagi afsus yoki o'zgartirib bo'lmaydigan vaziyat

<b>Conditional turini aniqlash:</b>
• Faktmi? → <b>0</b>
• Kelajakda realmi? → <b>1</b>
• Tasavvurmi? → <b>2</b>
• O'tmishdagi afsusmi? → <b>3</b>`,
};
export const conditionalsMenuKeyboard = new InlineKeyboard()
    .text("0-Conditional", "grammar_cond:zero")
    .text("1-Conditional", "grammar_cond:first")
    .row()
    .text("2-Conditional", "grammar_cond:second")
    .text("3-Conditional", "grammar_cond:third")
    .row()
    .text("Unless", "grammar_cond:unless")
    .row()
    .text("Tez jadval", "grammar_cond:table")
    .text("Xatolar", "grammar_cond:errors")
    .row()
    .text("Xulosa", "grammar_cond:summary")
    .row()
    .text("Ortga", "menu:grammar");
export const conditionalsBackKeyboard = new InlineKeyboard().text("Ortga", "grammar_view:conditionals");
