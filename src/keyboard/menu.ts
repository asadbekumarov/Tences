import { InlineKeyboard } from "https://deno.land/x/grammy/mod.ts";

export const mainMenuKeyboard = new InlineKeyboard()
  .text("Present Simple", "present_simple")
  .text("Present Continuous", "present_continuous")
  .row()
  .text("Present Perfect", "present_perfect")
  .text("Present Perfect Continuous", "present_perfect_continuous")
  .row()
  .text("Past Simple", "past_simple")
  .text("Past Continuous", "past_continuous")
  .row()
  .text("Past Perfect", "past_perfect")
  .text("Past Perfect Continuous", "past_perfect_continuous")
  .row()
  .text("Future Simple", "future_simple")
  .text("Future Continuous", "future_continuous")
  .row()
  .text("Future Perfect", "future_perfect")
  .text("Future Perfect Continuous", "future_perfect_continuous")
  .row()
  .text("🔴 Irregular Verbs", "iv_menu");

/** Harflar bo‘yicha irregular verb guruhlari */
export const irregularRangeKeyboard = new InlineKeyboard()
  .text("A — D", "iv_ad")
  .text("E — K", "iv_ek")
  .row()
  .text("L — R", "iv_lr")
  .text("S — Z", "iv_sz")
  .row()
  .text("🔙 Asosiy menyu", "back_to_menu");

/** Ro‘yxatdan keyin: harflar menyusi yoki asosiy menyu */
export const irregularListFooterKeyboard = new InlineKeyboard()
  .text("🔙 Harflar guruhi", "iv_menu")
  .row()
  .text("🔙 Asosiy menyu", "back_to_menu");
