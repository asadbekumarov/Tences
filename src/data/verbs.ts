// /**
//  * Eng ko‘p ishlatiladigan 50 ta irregular verb (V1, V2, V3 + o‘zbekcha).
//  */

// export interface IrregularVerb {
//   /** Infinitive / V1 */
//   v1: string;
//   /** Past Simple / V2 */
//   v2: string;
//   /** Past Participle / V3 */
//   v3: string;
//   /** O‘zbekcha ma’no */
//   translation: string;
// }

// export const IRREGULAR_VERBS: IrregularVerb[] = [
//   { v1: "be", v2: "was/were", v3: "been", translation: "bo‘lmoq" },
//   { v1: "become", v2: "became", v3: "become", translation: "bo‘lmoq (o‘zgarib)" },
//   { v1: "begin", v2: "began", v3: "begun", translation: "boshlamoq" },
//   { v1: "break", v2: "broke", v3: "broken", translation: "sindirmoq" },
//   { v1: "bring", v2: "brought", v3: "brought", translation: "olib kelmoq" },
//   { v1: "build", v2: "built", v3: "built", translation: "qurmoq" },
//   { v1: "buy", v2: "bought", v3: "bought", translation: "sotib olmoq" },
//   { v1: "catch", v2: "caught", v3: "caught", translation: "tutmoq" },
//   { v1: "choose", v2: "chose", v3: "chosen", translation: "tanlamoq" },
//   { v1: "come", v2: "came", v3: "come", translation: "kelmoq" },
//   { v1: "do", v2: "did", v3: "done", translation: "qilmoq" },
//   { v1: "eat", v2: "ate", v3: "eaten", translation: "yemoq" },
//   { v1: "fall", v2: "fell", v3: "fallen", translation: "yiqilmoq" },
//   { v1: "feel", v2: "felt", v3: "felt", translation: "his qilmoq" },
//   { v1: "find", v2: "found", v3: "found", translation: "topmoq" },
//   { v1: "get", v2: "got", v3: "got/gotten", translation: "olmoq, bo‘lmoq" },
//   { v1: "give", v2: "gave", v3: "given", translation: "bermoq" },
//   { v1: "go", v2: "went", v3: "gone", translation: "bormoq" },
//   { v1: "have", v2: "had", v3: "had", translation: "ega bo‘lmoq" },
//   { v1: "hear", v2: "heard", v3: "heard", translation: "eshitmoq" },
//   { v1: "hit", v2: "hit", v3: "hit", translation: "urmoq" },
//   { v1: "hold", v2: "held", v3: "held", translation: "ushlab turmoq" },
//   { v1: "keep", v2: "kept", v3: "kept", translation: "saqlamoq" },
//   { v1: "know", v2: "knew", v3: "known", translation: "bilmoq" },
//   { v1: "leave", v2: "left", v3: "left", translation: "tark etmoq" },
//   { v1: "lose", v2: "lost", v3: "lost", translation: "yo‘qotmoq" },
//   { v1: "make", v2: "made", v3: "made", translation: "qilmoq, yasamoq" },
//   { v1: "meet", v2: "met", v3: "met", translation: "uchrashmoq" },
//   { v1: "pay", v2: "paid", v3: "paid", translation: "to‘lamoq" },
//   { v1: "put", v2: "put", v3: "put", translation: "qo‘ymoq" },
//   { v1: "read", v2: "read", v3: "read", translation: "o‘qimoq" },
//   { v1: "run", v2: "ran", v3: "run", translation: "yugurmoq" },
//   { v1: "say", v2: "said", v3: "said", translation: "aytmoq" },
//   { v1: "see", v2: "saw", v3: "seen", translation: "ko‘rmoq" },
//   { v1: "sell", v2: "sold", v3: "sold", translation: "sotmoq" },
//   { v1: "send", v2: "sent", v3: "sent", translation: "yubormoq" },
//   { v1: "show", v2: "showed", v3: "shown", translation: "ko‘rsatmoq" },
//   { v1: "sit", v2: "sat", v3: "sat", translation: "o‘tirmoq" },
//   { v1: "sleep", v2: "slept", v3: "slept", translation: "uxlamoq" },
//   { v1: "speak", v2: "spoke", v3: "spoken", translation: "gapirmoq" },
//   { v1: "take", v2: "took", v3: "taken", translation: "olmoq" },
//   { v1: "teach", v2: "taught", v3: "taught", translation: "o‘qitmoq" },
//   { v1: "tell", v2: "told", v3: "told", translation: "aytmoq, aytib bermoq" },
//   { v1: "think", v2: "thought", v3: "thought", translation: "o‘ylamoq" },
//   { v1: "throw", v2: "threw", v3: "thrown", translation: "otmoq" },
//   { v1: "understand", v2: "understood", v3: "understood", translation: "tushunmoq" },
//   { v1: "wake", v2: "woke", v3: "woken", translation: "uyg‘onmoq" },
//   { v1: "wear", v2: "wore", v3: "worn", translation: "kiymoq" },
//   { v1: "win", v2: "won", v3: "won", translation: "yutmoq" },
//   { v1: "write", v2: "wrote", v3: "written", translation: "yozmoq" },
// ];

// function firstLetterLower(v1: string): string {
//   return v1.trim().toLowerCase().charAt(0);
// }

// export type VerbLetterRange = "ad" | "ek" | "lr" | "sz";

// export function verbsInLetterRange(range: VerbLetterRange): IrregularVerb[] {
//   return IRREGULAR_VERBS.filter((v) => {
//     const c = firstLetterLower(v.v1);
//     switch (range) {
//       case "ad":
//         return c >= "a" && c <= "d";
//       case "ek":
//         return c >= "e" && c <= "k";
//       case "lr":
//         return c >= "l" && c <= "r";
//       case "sz":
//         return c >= "s" && c <= "z";
//       default:
//         return false;
//     }
//   });
// }

// /** V2/V3 ichidagi "/" bilan ajratilgan shakllarni ham hisobga oladi */
// function allSurfaceForms(v: IrregularVerb): Set<string> {
//   const s = new Set<string>();
//   const add = (x: string) => {
//     x.split("/").forEach((p) => {
//       const t = p.trim().toLowerCase();
//       if (t) s.add(t);
//     });
//   };
//   add(v.v1);
//   add(v.v2);
//   add(v.v3);
//   return s;
// }

// /** V1/V2/V3 shakllaridan biriga mos keladigan fe’lni qidirish */
// export function findVerbByAnyForm(raw: string): IrregularVerb | undefined {
//   const w = raw.trim().toLowerCase();
//   if (!w) return undefined;
//   for (const v of IRREGULAR_VERBS) {
//     if (allSurfaceForms(v).has(w)) return v;
//   }
//   return undefined;
// }


/**
 * Eng ko‘p ishlatiladigan va asosiy 300 ga yaqin irregular verb (V1, V2, V3 + o‘zbekcha).
 * Hech qanday takrorlanishlarsiz (no duplicates).
 */

export interface IrregularVerb {
  /** Infinitive / V1 */
  v1: string;
  /** Past Simple / V2 */
  v2: string;
  /** Past Participle / V3 */
  v3: string;
  /** O‘zbekcha ma’no */
  translation: string;
}

export const IRREGULAR_VERBS: IrregularVerb[] = [
  { v1: "abide", v2: "abode/abided", v3: "abode/abided", translation: "bo‘ysunmoq, chidamoq" },
  { v1: "arise", v2: "arose", v3: "arisen", translation: "vujudga kelmoq, paydo bo‘lmoq" },
  { v1: "awake", v2: "awoke", v3: "awoken", translation: "uyg‘onmoq, uyg‘otmoq" },
  { v1: "backbite", v2: "backbit", v3: "backbitten", translation: "g‘iybat qilmoq" },
  { v1: "backslide", v2: "backslid", v3: "backslid/backslidden", translation: "orqaga qaytmoq (yomon odatga)" },
  { v1: "be", v2: "was/were", v3: "been", translation: "bo‘lmoq" },
  { v1: "bear", v2: "bore", v3: "borne/born", translation: "ko‘tarmoq, chidamoq, tug‘moq" },
  { v1: "beat", v2: "beat", v3: "beaten", translation: "urmoq, yengmoq" },
  { v1: "become", v2: "became", v3: "become", translation: "bo‘lmoq (aylanmoq)" },
  { v1: "befall", v2: "befell", v3: "befallen", translation: "yuz bermoq (sodir bo‘lmoq)" },
  { v1: "beget", v2: "begot", v3: "begotten", translation: "keltirib chiqarmoq, tug‘moq" },
  { v1: "begin", v2: "began", v3: "begun", translation: "boshlamoq" },
  { v1: "begird", v2: "begirt/begirded", v3: "begirt/begirded", translation: "qamrab olmoq, o‘ramoq" },
  { v1: "behold", v2: "beheld", v3: "beheld", translation: "ko‘rmoq, guvoh bo‘lmoq" },
  { v1: "bend", v2: "bent", v3: "bent", translation: "bukmoq, egmoq" },
  { v1: "bereave", v2: "bereft/bereaved", v3: "bereft/bereaved", translation: "mahrum qilmoq" },
  { v1: "beseech", v2: "besought/beseeched", v3: "besought/beseeched", translation: "yalinmoq, yolvormoq" },
  { v1: "beset", v2: "beset", v3: "beset", translation: "qurshab olmoq, qiynamoq" },
  { v1: "bespeak", v2: "bespoke", v3: "bespoken", translation: "oldindan buyurtma bermoq, ko‘rsatmoq" },
  { v1: "bestride", v2: "bestrode", v3: "bestridden", translation: "minib o‘tirmoq" },
  { v1: "bet", v2: "bet/betted", v3: "bet/betted", translation: "garov tikmoq" },
  { v1: "betake", v2: "betook", v3: "betaken", translation: "bormoq, yo‘l olmoq" },
  { v1: "bethink", v2: "bethought", v3: "bethought", translation: "eslamoq, o‘ylab ko‘rmoq" },
  { v1: "bid", v2: "bid/bade", v3: "bid/bidden", translation: "taklif qilmoq, buyurmoq" },
  { v1: "bind", v2: "bound", v3: "bound", translation: "bog‘lamoq" },
  { v1: "bite", v2: "bit", v3: "bitten", translation: "tishlamoq" },
  { v1: "bleed", v2: "bled", v3: "bled", translation: "qonamoq" },
  { v1: "blend", v2: "blent/blended", v3: "blent/blended", translation: "aralashtirmoq" },
  { v1: "bless", v2: "blest/blessed", v3: "blest/blessed", translation: "duo qilmoq, yorlaqamoq" },
  { v1: "blow", v2: "blew", v3: "blown", translation: "pufalamoq, esmoq" },
  { v1: "break", v2: "broke", v3: "broken", translation: "sindirmoq, buzmoq" },
  { v1: "breed", v2: "bred", v3: "bred", translation: "ko‘paytirmoq (hayvonlarni)" },
  { v1: "bring", v2: "brought", v3: "brought", translation: "olib kelmoq" },
  { v1: "broadcast", v2: "broadcast/broadcasted", v3: "broadcast/broadcasted", translation: "efirga uzatmoq" },
  { v1: "browbeat", v2: "browbeat", v3: "browbeaten", translation: "qo‘rqitmoq, do‘q urmoq" },
  { v1: "build", v2: "built", v3: "built", translation: "qurmoq" },
  { v1: "burn", v2: "burnt/burned", v3: "burnt/burned", translation: "yonmoq, yoqmoq" },
  { v1: "burst", v2: "burst", v3: "burst", translation: "yorilmoq, portlamoq" },
  { v1: "bust", v2: "bust/busted", v3: "bust/busted", translation: "buzmoq, sindirmoq" },
  { v1: "buy", v2: "bought", v3: "bought", translation: "sotib olmoq" },
  { v1: "cast", v2: "cast", v3: "cast", translation: "tashlamoq, otmoq" },
  { v1: "catch", v2: "caught", v3: "caught", translation: "tutmoq, ushlamoq" },
  { v1: "chide", v2: "chid/chided", v3: "chidden/chided", translation: "tanbeh bermoq" },
  { v1: "choose", v2: "chose", v3: "chosen", translation: "tanlamoq" },
  { v1: "cleave", v2: "cleft/cleaved/clove", v3: "cleft/cleaved/cloven", translation: "yormoq, bo‘lmoq" },
  { v1: "cling", v2: "clung", v3: "clung", translation: "yopishmoq" },
  { v1: "clothe", v2: "clad/clothed", v3: "clad/clothed", translation: "kiyintirmoq" },
  { v1: "come", v2: "came", v3: "come", translation: "kelmoq" },
  { v1: "cost", v2: "cost", v3: "cost", translation: "narx turmoq" },
  { v1: "creep", v2: "crept", v3: "crept", translation: "emaklamoq" },
  { v1: "crossbreed", v2: "crossbred", v3: "crossbred", translation: "chatishtirmoq" },
  { v1: "cut", v2: "cut", v3: "cut", translation: "kesmoq" },
  { v1: "dare", v2: "durst/dared", v3: "dared", translation: "jur'at etmoq" },
  { v1: "deal", v2: "dealt", v3: "dealt", translation: "shug‘ullanmoq, kelishmoq" },
  { v1: "dig", v2: "dug", v3: "dug", translation: "qazimoq" },
  { v1: "dive", v2: "dove/dived", v3: "dived", translation: "sho‘ng‘imoq" },
  { v1: "do", v2: "did", v3: "done", translation: "qilmoq, bajarmoq" },
  { v1: "draw", v2: "drew", v3: "drawn", translation: "chizmoq, tortmoq" },
  { v1: "dream", v2: "dreamt/dreamed", v3: "dreamt/dreamed", translation: "orzu qilmoq, tush ko‘rmoq" },
  { v1: "drink", v2: "drank", v3: "drunk", translation: "ichmoq" },
  { v1: "drive", v2: "drove", v3: "driven", translation: "haydamoq (mashina)" },
  { v1: "dwell", v2: "dwelt/dwelled", v3: "dwelt/dwelled", translation: "yashamoq, istiqomat qilmoq" },
  { v1: "eat", v2: "ate", v3: "eaten", translation: "yemoq" },
  { v1: "fall", v2: "fell", v3: "fallen", translation: "yiqilmoq" },
  { v1: "feed", v2: "fed", v3: "fed", translation: "boqmoq, ovqatlantirmoq" },
  { v1: "feel", v2: "felt", v3: "felt", translation: "his qilmoq" },
  { v1: "fight", v2: "fought", v3: "fought", translation: "kurashmoq, jang qilmoq" },
  { v1: "find", v2: "found", v3: "found", translation: "topmoq" },
  { v1: "fit", v2: "fit/fitted", v3: "fit/fitted", translation: "mos kelmoq, sig‘moq" },
  { v1: "flee", v2: "fled", v3: "fled", translation: "qochmoq" },
  { v1: "fling", v2: "flung", v3: "flung", translation: "otmoq, uloqtirmoq" },
  { v1: "fly", v2: "flew", v3: "flown", translation: "uchmoq" },
  { v1: "forbear", v2: "forbore", v3: "forborne", translation: "o‘zini tiymoq" },
  { v1: "forbid", v2: "forbad/forbade", v3: "forbidden", translation: "taqiqlamoq" },
  { v1: "forecast", v2: "forecast/forecasted", v3: "forecast/forecasted", translation: "bashorat qilmoq" },
  { v1: "foreknow", v2: "foreknew", v3: "foreknown", translation: "oldindan bilmoq" },
  { v1: "forerun", v2: "foreran", v3: "forerun", translation: "oldindan kelmoq, kashshof bo‘lmoq" },
  { v1: "foresee", v2: "foresaw", v3: "foreseen", translation: "oldindan ko‘rmoq" },
  { v1: "foretell", v2: "foretold", v3: "foretold", translation: "oldindan aytib bermoq" },
  { v1: "forget", v2: "forgot", v3: "forgotten", translation: "unutmoq" },
  { v1: "forgive", v2: "forgave", v3: "forgiven", translation: "kechirmoq" },
  { v1: "forsake", v2: "forsook", v3: "forsaken", translation: "tark etmoq, voz kechmoq" },
  { v1: "forswear", v2: "forswore", v3: "forsworn", translation: "qasamyod qilib voz kechmoq" },
  { v1: "freeze", v2: "froze", v3: "frozen", translation: "muzlamoq" },
  { v1: "frostbite", v2: "frostbit", v3: "frostbitten", translation: "sovuq urmoq" },
  { v1: "gainsay", v2: "gainsaid", v3: "gainsaid", translation: "inkor etmoq, qarshi chiqmoq" },
  { v1: "get", v2: "got", v3: "got/gotten", translation: "olmoq, bo‘lmoq" },
  { v1: "gild", v2: "gilt/gilded", v3: "gilt/gilded", translation: "zarhal qilmoq" },
  { v1: "gird", v2: "girt/girded", v3: "girt/girded", translation: "bog‘lamoq (kamar)" },
  { v1: "give", v2: "gave", v3: "given", translation: "bermoq" },
  { v1: "go", v2: "went", v3: "gone", translation: "bormoq" },
  { v1: "grave", v2: "graved", v3: "graven/graved", translation: "o‘ymoq, naqsh solmoq" },
  { v1: "grind", v2: "ground", v3: "ground", translation: "maydalamoq, yanchmoq" },
  { v1: "grow", v2: "grew", v3: "grown", translation: "o‘smoq, yetishtirmoq" },
  { v1: "hamstring", v2: "hamstrung", v3: "hamstrung", translation: "cho‘loq qilmoq, zaiflashtirmoq" },
  { v1: "hang", v2: "hung/hanged", v3: "hung/hanged", translation: "osmoq" },
  { v1: "have", v2: "had", v3: "had", translation: "ega bo‘lmoq" },
  { v1: "hear", v2: "heard", v3: "heard", translation: "eshitmoq" },
  { v1: "heave", v2: "hove/heaved", v3: "hove/heaved", translation: "ko‘tarmoq (og‘ir narsani)" },
  { v1: "hew", v2: "hewed", v3: "hewn/hewed", translation: "chopmoq, kesmoq" },
  { v1: "hide", v2: "hid", v3: "hidden", translation: "yashirmoq" },
  { v1: "hit", v2: "hit", v3: "hit", translation: "urmoq" },
  { v1: "hold", v2: "held", v3: "held", translation: "ushlab turmoq" },
  { v1: "hurt", v2: "hurt", v3: "hurt", translation: "og‘ritmoq, jarohatlamoq" },
  { v1: "inbreed", v2: "inbred", v3: "inbred", translation: "qon-qarindoshlarni chatishtirmoq" },
  { v1: "inlay", v2: "inlaid", v3: "inlaid", translation: "naqsh solmoq, qoplamoq" },
  { v1: "input", v2: "input/inputted", v3: "input/inputted", translation: "kiritmoq (ma'lumot)" },
  { v1: "inset", v2: "inset", v3: "inset", translation: "ichiga joylashtirmoq" },
  { v1: "interbreed", v2: "interbred", v3: "interbred", translation: "chatishtirmoq" },
  { v1: "interweave", v2: "interwove", v3: "interwoven", translation: "aralashtirib to‘qimoq" },
  { v1: "keep", v2: "kept", v3: "kept", translation: "saqlamoq" },
  { v1: "kneel", v2: "knelt/kneeled", v3: "knelt/kneeled", translation: "tiz cho‘kmoq" },
  { v1: "knit", v2: "knit/knitted", v3: "knit/knitted", translation: "to‘qimoq" },
  { v1: "know", v2: "knew", v3: "known", translation: "bilmoq" },
  { v1: "lade", v2: "laded", v3: "laden/laded", translation: "yuk ortmoq" },
  { v1: "lay", v2: "laid", v3: "laid", translation: "yotqizmoq, qo‘ymoq" },
  { v1: "lead", v2: "led", v3: "led", translation: "boshqarmoq, olib bormoq" },
  { v1: "lean", v2: "leant/leaned", v3: "leant/leaned", translation: "suyanmoq, egilmoq" },
  { v1: "leap", v2: "leapt/leaped", v3: "leapt/leaped", translation: "sakramoq" },
  { v1: "learn", v2: "learnt/learned", v3: "learnt/learned", translation: "o‘rganmoq" },
  { v1: "leave", v2: "left", v3: "left", translation: "tark etmoq" },
  { v1: "lend", v2: "lent", v3: "lent", translation: "qarzga bermoq" },
  { v1: "let", v2: "let", v3: "let", translation: "ruxsat bermoq" },
  { v1: "lie", v2: "lay", v3: "lain", translation: "yotmoq" },
  { v1: "light", v2: "lit/lighted", v3: "lit/lighted", translation: "yoqmoq (olov, chiroq)" },
  { v1: "lip-read", v2: "lip-read", v3: "lip-read", translation: "labga qarab o‘qimoq" },
  { v1: "lose", v2: "lost", v3: "lost", translation: "yo‘qotmoq, yutqazmoq" },
  { v1: "make", v2: "made", v3: "made", translation: "qilmoq, yasamoq" },
  { v1: "mean", v2: "meant", v3: "meant", translation: "ma'no anglatmoq" },
  { v1: "meet", v2: "met", v3: "met", translation: "uchrashmoq" },
  { v1: "melt", v2: "melted", v3: "molten/melted", translation: "erimoq" },
  { v1: "miscast", v2: "miscast", v3: "miscast", translation: "noto‘g‘ri rol bermoq" },
  { v1: "misdeal", v2: "misdealt", v3: "misdealt", translation: "noto‘g‘ri taqsimlamoq" },
  { v1: "misdo", v2: "misdid", v3: "misdone", translation: "xato qilmoq" },
  { v1: "mishear", v2: "misheard", v3: "misheard", translation: "noto‘g‘ri eshitmoq" },
  { v1: "mislay", v2: "mislaid", v3: "mislaid", translation: "boshqa joyga qo‘yib yo‘qotmoq" },
  { v1: "mislead", v2: "misled", v3: "misled", translation: "adashishga olib kelmoq" },
  { v1: "misread", v2: "misread", v3: "misread", translation: "noto‘g‘ri o‘qimoq/tushunmoq" },
  { v1: "misspell", v2: "misspelt/misspelled", v3: "misspelt/misspelled", translation: "imlosida xato qilmoq" },
  { v1: "misspend", v2: "misspent", v3: "misspent", translation: "behuda sarflamoq" },
  { v1: "mistake", v2: "mistook", v3: "mistaken", translation: "adashmoq, xato qilmoq" },
  { v1: "misunderstand", v2: "misunderstood", v3: "misunderstood", translation: "noto‘g‘ri tushunmoq" },
  { v1: "mow", v2: "mowed", v3: "mown/mowed", translation: "o‘rmoq (o‘t)" },
  { v1: "offset", v2: "offset", v3: "offset", translation: "qoplamoq (zararni)" },
  { v1: "outbid", v2: "outbid", v3: "outbid", translation: "kimoshdida ko‘proq narx taklif qilmoq" },
  { v1: "outdo", v2: "outdid", v3: "outdone", translation: "oshib tushmoq (yaxshiroq qilmoq)" },
  { v1: "outdraw", v2: "outdrew", v3: "outdrawn", translation: "tezroq qurol tortmoq, ko‘p odam yig‘moq" },
  { v1: "outfight", v2: "outfought", v3: "outfought", translation: "jangda yengmoq" },
  { v1: "outgrow", v2: "outgrew", v3: "outgrown", translation: "o‘sib kiyimiga sig‘may qolmoq" },
  { v1: "output", v2: "output/outputted", v3: "output/outputted", translation: "ishlab chiqarmoq (ma'lumot)" },
  { v1: "outrun", v2: "outran", v3: "outrun", translation: "o‘zib ketmoq (yugurishda)" },
  { v1: "outsell", v2: "outsold", v3: "outsold", translation: "ko‘proq sotmoq" },
  { v1: "outshine", v2: "outshone", v3: "outshone", translation: "yarqirab o‘zib ketmoq" },
  { v1: "outwear", v2: "outwore", v3: "outworn", translation: "to‘zib ketguncha kiymoq" },
  { v1: "overbid", v2: "overbid", v3: "overbid", translation: "haddan ortiq narx aytmoq" },
  { v1: "overbuild", v2: "overbuilt", v3: "overbuilt", translation: "haddan ortiq qurmoq" },
  { v1: "overcome", v2: "overcame", v3: "overcome", translation: "yengib o‘tmoq" },
  { v1: "overdo", v2: "overdid", v3: "overdone", translation: "oshirib yubormoq" },
  { v1: "overdraw", v2: "overdrew", v3: "overdrawn", translation: "hisobdan ortiqcha pul yechmoq" },
  { v1: "overeat", v2: "overate", v3: "overeaten", translation: "ko‘p yeb yubormoq" },
  { v1: "overfly", v2: "overflew", v3: "overflown", translation: "tepasidan uchib o‘tmoq" },
  { v1: "overhang", v2: "overhung", v3: "overhung", translation: "tepasida osilib turmoq" },
  { v1: "overhear", v2: "overheard", v3: "overheard", translation: "tasodifan eshitib qolmoq" },
  { v1: "overlay", v2: "overlaid", v3: "overlaid", translation: "ustidan qoplamoq" },
  { v1: "overpay", v2: "overpaid", v3: "overpaid", translation: "ortiqcha to‘lamoq" },
  { v1: "override", v2: "overrode", v3: "overridden", translation: "bekor qilmoq, ustidan o‘tmoq" },
  { v1: "overrun", v2: "overran", v3: "overrun", translation: "bosib ketmoq (dushman)" },
  { v1: "oversee", v2: "oversaw", v3: "overseen", translation: "nazorat qilmoq" },
  { v1: "oversell", v2: "oversold", v3: "oversold", translation: "ortig‘i bilan sotmoq" },
  { v1: "overshoot", v2: "overshot", v3: "overshot", translation: "mo‘ljaldan o‘tib ketmoq" },
  { v1: "oversleep", v2: "overslept", v3: "overslept", translation: "uxlab qolmoq" },
  { v1: "overtake", v2: "overtook", v3: "overtaken", translation: "quvib o‘tmoq" },
  { v1: "overthrow", v2: "overthrew", v3: "overthrown", translation: "ag‘darmoq (hukumatni)" },
  { v1: "overwrite", v2: "overwrote", v3: "overwritten", translation: "ustidan yozib yubormoq" },
  { v1: "partake", v2: "partook", v3: "partaken", translation: "qatnashmoq, tatib ko‘rmoq" },
  { v1: "pay", v2: "paid", v3: "paid", translation: "to‘lamoq" },
  { v1: "plead", v2: "pled/pleaded", v3: "pled/pleaded", translation: "iltimos qilmoq, oqlamoq" },
  { v1: "prepay", v2: "prepaid", v3: "prepaid", translation: "oldindan to‘lamoq" },
  { v1: "prove", v2: "proved", v3: "proven/proved", translation: "isbotlamoq" },
  { v1: "put", v2: "put", v3: "put", translation: "qo‘ymoq" },
  { v1: "quit", v2: "quit/quitted", v3: "quit/quitted", translation: "to‘xtatmoq, tark etmoq" },
  { v1: "read", v2: "read", v3: "read", translation: "o‘qimoq" },
  { v1: "rebind", v2: "rebound", v3: "rebound", translation: "qayta muqovalamoq" },
  { v1: "rebuild", v2: "rebuilt", v3: "rebuilt", translation: "qayta qurmoq" },
  { v1: "recast", v2: "recast", v3: "recast", translation: "rollarni qayta taqsimlamoq" },
  { v1: "redo", v2: "redid", v3: "redone", translation: "qaytadan qilmoq" },
  { v1: "relay", v2: "relaid", v3: "relaid", translation: "qayta joylashtirmoq (uzatmoq emas)" },
  { v1: "remake", v2: "remade", v3: "remade", translation: "qayta yasamoq" },
  { v1: "rend", v2: "rent", v3: "rent", translation: "yirtmoq, bo‘laklamoq" },
  { v1: "repay", v2: "repaid", v3: "repaid", translation: "qaytarib to‘lamoq" },
  { v1: "rerun", v2: "reran", v3: "rerun", translation: "qayta yugurmoq/namoyish etmoq" },
  { v1: "resell", v2: "resold", v3: "resold", translation: "qayta sotmoq" },
  { v1: "resend", v2: "resent", v3: "resent", translation: "qayta yubormoq" },
  { v1: "reset", v2: "reset", v3: "reset", translation: "qayta o‘rnatmoq" },
  { v1: "retake", v2: "retook", v3: "retaken", translation: "qayta qabul qilmoq/olmoq" },
  { v1: "retell", v2: "retold", v3: "retold", translation: "qayta so‘zlab bermoq" },
  { v1: "rewrite", v2: "rewrote", v3: "rewritten", translation: "qaytadan yozmoq" },
  { v1: "rid", v2: "rid", v3: "rid", translation: "xalos qilmoq" },
  { v1: "ride", v2: "rode", v3: "ridden", translation: "minmoq (ot, velosiped)" },
  { v1: "ring", v2: "rang", v3: "rung", translation: "jiringlamoq, qo‘ng‘iroq qilmoq" },
  { v1: "rise", v2: "rose", v3: "risen", translation: "ko‘tarilmoq (quyosh)" },
  { v1: "rive", v2: "rived", v3: "riven/rived", translation: "ikliga yormoq" },
  { v1: "run", v2: "ran", v3: "run", translation: "yugurmoq" },
  { v1: "saw", v2: "sawed", v3: "sawn/sawed", translation: "arralamoq" },
  { v1: "say", v2: "said", v3: "said", translation: "aytmoq" },
  { v1: "see", v2: "saw", v3: "seen", translation: "ko‘rmoq" },
  { v1: "seek", v2: "sought", v3: "sought", translation: "qidirmoq, izlamoq" },
  { v1: "sell", v2: "sold", v3: "sold", translation: "sotmoq" },
  { v1: "send", v2: "sent", v3: "sent", translation: "yubormoq" },
  { v1: "set", v2: "set", v3: "set", translation: "o‘rnatmoq, qo‘ymoq" },
  { v1: "sew", v2: "sewed", v3: "sewn/sewed", translation: "tikmoq (kiyim)" },
  { v1: "shake", v2: "shook", v3: "shaken", translation: "silkitmoq" },
  { v1: "shave", v2: "shaved", v3: "shaven/shaved", translation: "soqol olmoq" },
  { v1: "shear", v2: "sheared", v3: "shorn/sheared", translation: "qirqmoq (jun)" },
  { v1: "shed", v2: "shed", v3: "shed", translation: "to‘kmoq (yosh, barg)" },
  { v1: "shine", v2: "shone", v3: "shone", translation: "nur sochmoq, porlamoq" },
  { v1: "shoe", v2: "shod", v3: "shod", translation: "taqalamoq, poyabzal kiydirmoq" },
  { v1: "shoot", v2: "shot", v3: "shot", translation: "otmoq (qurol)" },
  { v1: "show", v2: "showed", v3: "shown", translation: "ko‘rsatmoq" },
  { v1: "shrink", v2: "shrank", v3: "shrunk", translation: "kichraymoq, qisqarmoq" },
  { v1: "shut", v2: "shut", v3: "shut", translation: "yopmoq" },
  { v1: "sing", v2: "sang", v3: "sung", translation: "kuylamoq" },
  { v1: "sink", v2: "sank", v3: "sunk", translation: "cho‘kmoq" },
  { v1: "sit", v2: "sat", v3: "sat", translation: "o‘tirmoq" },
  { v1: "slay", v2: "slew", v3: "slain", translation: "o‘ldirmoq" },
  { v1: "sleep", v2: "slept", v3: "slept", translation: "uxlamoq" },
  { v1: "slide", v2: "slid", v3: "slid", translation: "sirpanmoq" },
  { v1: "sling", v2: "slung", v3: "slung", translation: "uloqtirmoq" },
  { v1: "slink", v2: "slunk", v3: "slunk", translation: "baktirlab/yashirinib yurmoq" },
  { v1: "slit", v2: "slit", v3: "slit", translation: "tilmoq, yormoq" },
  { v1: "smell", v2: "smelt/smelled", v3: "smelt/smelled", translation: "hidlamoq" },
  { v1: "smite", v2: "smote", v3: "smitten", translation: "qattiq urmoq/jazolamoq" },
  { v1: "sow", v2: "sowed", v3: "sown/sowed", translation: "ekmoq (urug‘)" },
  { v1: "speak", v2: "spoke", v3: "spoken", translation: "gapirmoq" },
  { v1: "speed", v2: "sped/speeded", v3: "sped/speeded", translation: "tezlashmoq" },
  { v1: "spell", v2: "spelt/spelled", v3: "spelt/spelled", translation: "harflab aytmoq" },
  { v1: "spend", v2: "spent", v3: "spent", translation: "sarflamoq (pul, vaqt)" },
  { v1: "spill", v2: "spilt/spilled", v3: "spilt/spilled", translation: "to‘kib yubormoq (suyuqlik)" },
  { v1: "spin", v2: "spun", v3: "spun", translation: "aylanmoq, yigirmoq" },
  { v1: "spit", v2: "spat/spit", v3: "spat/spit", translation: "tupurmoq" },
  { v1: "split", v2: "split", v3: "split", translation: "bo‘linmoq, yorilmoq" },
  { v1: "spoil", v2: "spoilt/spoiled", v3: "spoilt/spoiled", translation: "buzmoq, erkalatmoq" },
  { v1: "spoon-feed", v2: "spoon-fed", v3: "spoon-fed", translation: "qoshiqlab yedirmoq" },
  { v1: "spread", v2: "spread", v3: "spread", translation: "tarqalmoq, yoymoq" },
  { v1: "spring", v2: "sprang/sprung", v3: "sprung", translation: "sakramoq, otilib chiqmoq" },
  { v1: "stand", v2: "stood", v3: "stood", translation: "turmoq" },
  { v1: "stave", v2: "stove/staved", v3: "stove/staved", translation: "teshib yubormoq" },
  { v1: "steal", v2: "stole", v3: "stolen", translation: "o‘g‘irlamoq" },
  { v1: "stick", v2: "stuck", v3: "stuck", translation: "yopishtirmoq, sanchmoq" },
  { v1: "sting", v2: "stung", v3: "stung", translation: "chaqmoq (ari)" },
  { v1: "stink", v2: "stank", v3: "stunk", translation: "badbo‘y hid taratmoq" },
  { v1: "strew", v2: "strewed", v3: "strewn/strewed", translation: "sochmoq" },
  { v1: "stride", v2: "strode", v3: "stridden", translation: "keng qadam tashlamoq" },
  { v1: "strike", v2: "struck", v3: "struck/stricken", translation: "urmoq, zarba bermoq" },
  { v1: "string", v2: "strung", v3: "strung", translation: "ipga tizmoq" },
  { v1: "strive", v2: "strove", v3: "striven", translation: "intilmoq, tirishmoq" },
  { v1: "sublet", v2: "sublet", v3: "sublet", translation: "ijaraga berilgan joyni boshqaga berish" },
  { v1: "swear", v2: "swore", v3: "sworn", translation: "qasamyod qilmoq, so‘kinmoq" },
  { v1: "sweep", v2: "swept", v3: "swept", translation: "supurmoq" },
  { v1: "swell", v2: "swelled", v3: "swollen/swelled", translation: "ishmoq, ko‘pchimoq" },
  { v1: "swim", v2: "swam", v3: "swum", translation: "suzmoq" },
  { v1: "swing", v2: "swung", v3: "swung", translation: "tebranmoq" },
  { v1: "take", v2: "took", v3: "taken", translation: "olmoq" },
  { v1: "teach", v2: "taught", v3: "taught", translation: "o‘qitmoq, o‘rgatmoq" },
  { v1: "tear", v2: "tore", v3: "torn", translation: "yirtmoq" },
  { v1: "tell", v2: "told", v3: "told", translation: "aytmoq, aytib bermoq" },
  { v1: "think", v2: "thought", v3: "thought", translation: "o‘ylamoq" },
  { v1: "thrive", v2: "throve/thrived", v3: "thriven/thrived", translation: "gullab-yashnamoq" },
  { v1: "throw", v2: "threw", v3: "thrown", translation: "otmoq, irg‘itmoq" },
  { v1: "thrust", v2: "thrust", v3: "thrust", translation: "tiqmoq, itarmoq" },
  { v1: "tread", v2: "trod", v3: "trodden/trod", translation: "bosmoq, qadam bosmoq" },
  { v1: "unbend", v2: "unbent", v3: "unbent", translation: "to‘g‘rilamoq, yumshamoq" },
  { v1: "unbind", v2: "unbound", v3: "unbound", translation: "yechib yubormoq" },
  { v1: "underbid", v2: "underbid", v3: "underbid", translation: "arzonroq narx taklif qilmoq" },
  { v1: "undergo", v2: "underwent", v3: "undergone", translation: "boshdan kechirmoq" },
  { v1: "understand", v2: "understood", v3: "understood", translation: "tushunmoq" },
  { v1: "undertake", v2: "undertook", v3: "undertaken", translation: "o‘z zimmasiga olmoq" },
  { v1: "underwrite", v2: "underwrote", v3: "underwritten", translation: "kafolat bermoq (moliyaviy)" },
  { v1: "undo", v2: "undid", v3: "undone", translation: "bekor qilmoq, yechmoq" },
  { v1: "unfreeze", v2: "unfroze", v3: "unfrozen", translation: "eritmoq (muzdan)" },
  { v1: "unlearn", v2: "unlearnt/unlearned", v3: "unlearnt/unlearned", translation: "esdan chiqarmoq (odatlarni)" },
  { v1: "unmake", v2: "unmade", v3: "unmade", translation: "buzmoq, bekor qilmoq" },
  { v1: "unplug", v2: "unplugged", v3: "unplugged", translation: "rozetkadan sug‘urmoq" },
  { v1: "unroll", v2: "unrolled", v3: "unrolled", translation: "yoymoq, ochmoq (o‘ramni)" },
  { v1: "unscrew", v2: "unscrewed", v3: "unscrewed", translation: "burab yechmoq" },
  { v1: "unstick", v2: "unstuck", v3: "unstuck", translation: "ko‘chirib olmoq (yopishganni)" },
  { v1: "unweave", v2: "unwove", v3: "unwoven", translation: "so‘kmoq, ajratmoq (to‘qimani)" },
  { v1: "unwind", v2: "unwound", v3: "unwound", translation: "tarqatmoq, dam olmoq" },
  { v1: "uphold", v2: "upheld", v3: "upheld", translation: "qo‘llab-quvvatlamoq" },
  { v1: "upset", v2: "upset", v3: "upset", translation: "xafa qilmoq, to‘kib yubormoq" },
  { v1: "wake", v2: "woke", v3: "woken", translation: "uyg‘onmoq, uyg‘otmoq" },
  { v1: "waylay", v2: "waylaid", v3: "waylaid", translation: "pistirma qo‘yib poylamoq" },
  { v1: "wear", v2: "wore", v3: "worn", translation: "kiymoq" },
  { v1: "weave", v2: "wove", v3: "woven", translation: "to‘qimoq" },
  { v1: "wed", v2: "wed/wedded", v3: "wed/wedded", translation: "to‘y qilmoq, nikohdan o‘tmoq" },
  { v1: "weep", v2: "wept", v3: "wept", translation: "yig‘lamoq" },
  { v1: "wend", v2: "wended/went", v3: "wended/went", translation: "yo‘l olmoq" },
  { v1: "wet", v2: "wet/wetted", v3: "wet/wetted", translation: "ho‘llamoq" },
  { v1: "win", v2: "won", v3: "won", translation: "g‘alaba qozonmoq" },
  { v1: "wind", v2: "wound", v3: "wound", translation: "o‘ramoq, buramoq" },
  { v1: "withdraw", v2: "withdrew", v3: "withdrawn", translation: "qaytarib olmoq, chekinmoq" },
  { v1: "withhold", v2: "withheld", v3: "withheld", translation: "ushlab qolmoq, bermaslik" },
  { v1: "withstand", v2: "withstood", v3: "withstood", translation: "qarshilik ko‘rsatmoq, chidamoq" },
  { v1: "wring", v2: "wrung", v3: "wrung", translation: "siqmoq, buramoq" },
  { v1: "write", v2: "wrote", v3: "written", translation: "yozmoq" },
];

function firstLetterLower(v1: string): string {
  return v1.trim().toLowerCase().charAt(0);
}

export type VerbLetterRange = "ad" | "ek" | "lr" | "sz";

export function verbsInLetterRange(range: VerbLetterRange): IrregularVerb[] {
  return IRREGULAR_VERBS.filter((v) => {
    const c = firstLetterLower(v.v1);
    switch (range) {
      case "ad":
        return c >= "a" && c <= "d";
      case "ek":
        return c >= "e" && c <= "k";
      case "lr":
        return c >= "l" && c <= "r";
      case "sz":
        return c >= "s" && c <= "z";
      default:
        return false;
    }
  });
}

/** V2/V3 ichidagi "/" bilan ajratilgan shakllarni ham hisobga oladi */
function allSurfaceForms(v: IrregularVerb): Set<string> {
  const s = new Set<string>();
  const add = (x: string) => {
    x.split("/").forEach((p) => {
      const t = p.trim().toLowerCase();
      if (t) s.add(t);
    });
  };
  add(v.v1);
  add(v.v2);
  add(v.v3);
  return s;
}

/** V1/V2/V3 shakllaridan biriga mos keladigan fe’lni qidirish */
export function findVerbByAnyForm(raw: string): IrregularVerb | undefined {
  const w = raw.trim().toLowerCase();
  if (!w) return undefined;
  for (const v of IRREGULAR_VERBS) {
    if (allSurfaceForms(v).has(w)) return v;
  }
  return undefined;
}