# Tences — Telegram bot (Ingliz zamonlari)

Telegram orqali **ingliz tili zamonlari (tenses)** bo‘yicha qisqa qoidalarni, tuzilishlarni va misollarni **o‘zbek tilida** ko‘rsatadigan bot. Maqsad — foydalanuvchi menyudan zamonni tanlaydi, bot esa shu zamon uchun formatlangan matn yuboradi.

---

## Texnologiyalar

| Texnologiya | Vazifasi |
|-------------|----------|
| **[Deno](https://deno.land/)** | Runtime va paketlar (npm yo‘q, URL importlar) |
| **TypeScript** | Butun loyiha TypeScriptda |
| **[grammY](https://grammy.dev/)** | Telegram Bot API (`https://deno.land/x/grammy/mod.ts`) |
| **`Deno.serve`** | HTTP server — **webhook** rejimi (long polling ishlatilmaydi) |

Qisqacha: bot yangilanishlarni Telegram **webhook** orqali oladi: serveringiz ochiq HTTPS manzilida turadi, Telegram `POST` so‘rovlarini `/<BOT_TOKEN>` pathiga yuboradi, grammY ularni qayta ishlaydi.

---

## Bot nima qiladi?

1. **`/start`** — foydalanuvchini ismi bilan salomlaydi va **asosiy menyu** (inline tugmalar) chiqaradi.
2. **`/help`** — qisqa yo‘riqnoma (`/start`, `/help`, tugmalar haqida).
3. **Inline menyu** — 12 ta ingliz zamonlari tugmalari (Present / Past / Future guruhlari bo‘yicha).
4. **Tugmani bosish** — tanlangan zamon uchun batafsil matn (ta’rif, tuzilish, misollar, signal so‘zlar) **HTML** formatida xabar sifatida yuboriladi.
5. **«Asosiy menyu»** — tense matnidan keyin qaytish tugmasi orqali yana bosh menyuga qaytish.

Kontent `src/handlers/tenses.ts` ichidagi `tenseMap` obyektida saqlanadi (har bir `callback_data` kaliti uchun matn).

---

## Loyiha tuzilishi

```
tences/
├── bot.ts                 # Kirish nuqtasi: token, webhook, Deno.serve
├── deno.json              # Import map (grammy), tasks, fmt/lint
├── deno-globals.d.ts      # IDE uchun minimal Deno/grammY tiplari (ixtiyoriy)
├── tsconfig.json          # Editor TypeScript sozlamalari
├── .env.example           # Namuna muhit o‘zgaruvchilari
├── src/
│   ├── commands/
│   │   └── start.ts       # /start, /help, mainMenuCaption()
│   ├── handlers/
│   │   └── tenses.ts      # callback_query: tense matnlari, «asosiy menyu»
│   └── keyboard/
│       └── menu.ts        # InlineKeyboard — asosiy menyu tugmalari
└── README.md
```

---

## Muhit o‘zgaruvchilari

| O‘zgaruvchi | Majburiy | Tavsif |
|-------------|----------|--------|
| `BOT_TOKEN` | Ha | [@BotFather](https://t.me/BotFather) dan olingan bot tokeni |
| `PORT` | Yo‘q | HTTP server porti (standart **8000**; Deno Deploy odatda avtomatik) |

`.env` faylini `.env.example`dan nusxalab to‘ldiring. **Tokenni git ga qo‘shmang** (`.gitignore`da `.env` bo‘lishi kerak).

---

## O‘rnatish va ishga tushirish

### Talab

- [Deno](https://docs.deno.com/runtime/manual/getting_started/installation/) (1.38+ tavsiya etiladi, `--env` uchun)

### 1. Repozitoriy va muhit

```bash
cd tences
cp .env.example .env
# .env ichida BOT_TOKEN=... ni yozing
```

### 2. Ishga tushirish

`.env`ni avtomatik o‘qish uchun:

```bash
deno task start
```

Yoki qayta yuklanadigan dev rejim (`.env` bilan):

```bash
deno task dev:env
```

Faqat muhitda token bo‘lsa (`export` / PowerShell `$env:BOT_TOKEN=...`):

```bash
deno task dev
```

Kerakli ruxsatlar task ichida: `--allow-net`, `--allow-env`; `.env` uchun `start` / `dev:env`da `--env` bor.

---

## Webhook sozlash

Bot **faqat webhook** bilan ishlaydi — Telegram serveringizga **HTTPS** orqali ulanishi kerak.

1. Loyihangizni internetga chiqaring (masalan [Deno Deploy](https://deno.com/deploy), boshqa hosting yoki tunnel: ngrok, Cloudflare Tunnel).
2. Webhook URL (odatda token pathda):

   `https://<sizning-domen>/<BOT_TOKEN>`

3. Telegramda o‘rnating (tokenni o‘zingizniki bilan almashtiring):

   ```text
   https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=https://<domen>/<BOT_TOKEN>
   ```

4. Brauzerda tekshirish: `https://api.telegram.org/bot<BOT_TOKEN>/getWebhookInfo`

Boshqa so‘rovlar (masalan, GET) uchun server oddiy `Bot is running!` javobini qaytaradi.

---

## Xavfsizlik qisqacha

- Tokenni hech qayerda ochiq joylamang; chiqib qolsa — BotFather orqali **tokenni yangilang**.
- Webhook URLda token path ishlatilgani loglarda ko‘rinishi mumkin; ishlab chiqarishda qo‘shimcha ravishda Telegram **secret token** (`X-Telegram-Bot-Api-Secret-Token`) ishlatish tavsiya etiladi (keyingi rivojlantirish).

---

## Muallif va litsenziya

Loyiha shaxsiy/o‘quv maqsadida. grammY va Deno ularning litsenziyalariga amal qiladi.
