# Tences — Ingliz tili grammatikasi va lug'at bot

Telegram orqali **ingliz tili zamonlari (tenses)**, **noto'g'ri fe'llar (irregular verbs)** va **lug'at (vocabulary)** bo'yicha ma'lumotlarni o'zbek tilida taqdim etuvchi bot. Loyiha Node.js (ESM) muhitida TypeScript yordamida yaratilgan.

---

## 🚀 Texnologiyalar

| Texnologiya | Vazifasi |
|-------------|----------|
| **Node.js (v20+)** | Asosiy runtime muhiti |
| **TypeScript** | Loyiha to'liq TypeScriptda yozilgan |
| **[grammY](https://grammy.dev/)** | Telegram Bot API bilan ishlash uchun |
| **`node:http`** | Webhook rejimi uchun HTTP server |
| **TSX** | Local rivojlantirish va build-siz ishga tushirish uchun |

---

## ✨ Imkoniyatlar

1.  **📘 Ingliz tili zamonlari (12 ta)**:
    - Har bir zamon uchun ta'rif, formula, misollar va signal so'zlar.
    - Chiroyli formatlangan va o'qishga qulay xabarlar.
2.  **🔴 Irregular Verbs (Noto'g'ri fe'llar)**:
    - Harflar diapazoni bo'yicha guruhlangan (A-D, E-K, L-R, S-Z).
    - V1, V2, V3 shakllari ustunlar bo'yicha tekislangan (monospaced format).
    - So'z qidirish imkoniyati (shakllari bo'yicha).
3.  **📚 Lug'at (Vocabulary)**:
    - 1 dan 60 gacha unitlar bo'yicha so'zlar.
    - Sahifalash (pagination) tizimi (har bir sahifada 10 tadan unit).
    - Sheety API orqali real-time ma'lumot olish.
    - Nusxa olish qulayligi (code format).

---

## 🤖 Bot buyruqlari (Commands)

- `/start` — Botni qayta ishga tushirish
- `/tenses` — Ingliz tili zamonlari menyusi
- `/vocabulary` — Lug'at unitlari (1-60)
- `/verbs` — Noto'g'ri fe'llar ro'yxati
- `/help` — Yordam va dasturchi bilan bog'lanish (@asad_umarov)

---

## 📂 Loyiha tuzilishi

```
tences/
├── bot.ts                 # Kirish nuqtasi: webhook/polling, server sozlamalari
├── package.json           # Skriptlar va dependency-lar
├── tsconfig.json          # TypeScript sozlamalari (Node.js ESM uchun)
├── dist/                  # Build qilingan JavaScript fayllari (server uchun)
├── src/
│   ├── commands/
│   │   └── start.ts       # /start va /help buyruqlari
│   ├── handlers/
│   │   ├── tenses.ts      # Zamonlar va Lug'at handlerlari
│   │   └── verbs.ts       # Noto'g'ri fe'llar handleri
│   ├── keyboard/
│   │   └── menu.ts        # Barcha Inline klaviaturalar
│   └── data/
│       └── verbs.ts       # Fe'llar bazasi
└── README.md
```

---

## 🛠 O'rnatish va Ishga tushirish

### 1. Talablar
- Node.js v20 yoki undan yuqori.
- npm (Node Package Manager).

### 2. O'rnatish
```bash
git clone https://github.com/asadbekumarov/Tences.git
cd Tences
npm install
```

### 3. Atrof-muhit o'zgaruvchilari (.env)
`.env` faylini yarating va quyidagilarni kiriting:
```env
BOT_TOKEN=sizning_bot_tokeningiz
PORT=8100
HOST=::
POLLING=false
```

### 4. Ishga tushirish
- **Development (Polling)**: `POLLING=true npm run dev`
- **Build**: `npm run build` (dist papkasini yaratadi)
- **Production (Webhook)**: `npm start`

---

## 🌐 Deploy (Alwaysdata uchun)

Loyiha Alwaysdata-ga moslashtirilgan. Deploy qilish uchun:

1.  Localda build qiling: `npx tsc`
2.  `dist` papkasini serverga yuboring:
    ```bash
    scp -r dist asadbektg@ssh-asadbektg.alwaysdata.net:/home/asadbektg/tences_new/
    ```
3.  Alwaysdata panelida botni ishga tushirish buyrug'i:
    `npx tsx /home/asadbektg/tences_new/bot.ts` (yoki dist orqali `node dist/bot.js`)

---

## 📝 Muallif va Litsenziya
Loyiha shaxsiy o'quv maqsadlarida yaratilgan.
Muallif: **Asadbek Umarov**
