import type { Bot, Context } from "https://deno.land/x/grammy/mod.ts";
import {
  findVerbByAnyForm,
  type IrregularVerb,
  type VerbLetterRange,
  verbsInLetterRange,
} from "../data/verbs.ts";
import {
  irregularListFooterKeyboard,
  irregularRangeKeyboard,
  mainMenuKeyboard,
} from "../keyboard/menu.ts";

const RANGE_LABEL: Record<VerbLetterRange, string> = {
  ad: "A — D",
  ek: "E — K",
  lr: "L — R",
  sz: "S — Z",
};

function formatVerbCard(v: IrregularVerb): string {
  return (
    `🔤 <b>${escapeHtml(v.v1)}</b> — <i>${escapeHtml(v.translation)}</i>\n\n` +
    `<b>V1 (infinitive):</b> <code>${escapeHtml(v.v1)}</code>\n` +
    `<b>V2 (Past Simple):</b> <code>${escapeHtml(v.v2)}</code>\n` +
    `<b>V3 (Past Participle):</b> <code>${escapeHtml(v.v3)}</code>`
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatVerbListHtml(range: VerbLetterRange): string {
  const verbs = verbsInLetterRange(range);
  const title = RANGE_LABEL[range];
  const lines = verbs.map((v, i) => {
    const n = i + 1;
    return (
      `${n}. <b>${escapeHtml(v.v1)}</b> — ` +
      `<code>${escapeHtml(v.v2)}</code> / ` +
      `<code>${escapeHtml(v.v3)}</code> — ` +
      `<i>${escapeHtml(v.translation)}</i>`
    );
  });
  return (
    `🔴 <b>Irregular verbs</b> (${title})\n\n` +
    lines.join("\n")
  );
}

function notFoundHint(): string {
  return (
    "❓ Bu so‘z irregular verbs bazamizda topilmadi.\n\n" +
    "📘 Ingliz <b>zamonlari</b> bo‘yicha ma’lumot uchun pastdagi menyudan tanlang yoki " +
    "<b>🔴 Irregular Verbs</b> bo‘limiga kiring.\n\n" +
    "Yoki bazadagi fe’lni <b>V1, V2 yoki V3</b> shaklida yozing (masalan: <code>went</code>, <code>go</code>)."
  );
}

export function registerVerbHandlers(bot: Bot<Context>) {
  bot.callbackQuery("iv_menu", async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.editMessageText(
      "🔴 <b>Irregular verbs</b>\n\nHarflar oralig‘ini tanlang:",
      {
        parse_mode: "HTML",
        reply_markup: irregularRangeKeyboard,
      },
    );
  });

  const rangeHandlers: { data: VerbLetterRange; key: string }[] = [
    { data: "ad", key: "iv_ad" },
    { data: "ek", key: "iv_ek" },
    { data: "lr", key: "iv_lr" },
    { data: "sz", key: "iv_sz" },
  ];

  for (const { data, key } of rangeHandlers) {
    bot.callbackQuery(key, async (ctx) => {
      await ctx.answerCallbackQuery();
      const html = formatVerbListHtml(data);
      await ctx.editMessageText(html, {
        parse_mode: "HTML",
        reply_markup: irregularListFooterKeyboard,
      });
    });
  }

  bot.on("message:text").filter(
    (ctx) => {
      const t = ctx.message?.text?.trim();
      return Boolean(t && !t.startsWith("/"));
    },
    async (ctx) => {
      const raw = ctx.message.text.trim();
      const tokens = raw.split(/\s+/).filter(Boolean);

      let found: IrregularVerb | undefined;
      for (const t of tokens) {
        found = findVerbByAnyForm(t);
        if (found) break;
      }

      if (found) {
        await ctx.reply(formatVerbCard(found), { parse_mode: "HTML" });
        return;
      }

      await ctx.reply(notFoundHint(), {
        parse_mode: "HTML",
        reply_markup: mainMenuKeyboard,
      });
    },
  );
}
