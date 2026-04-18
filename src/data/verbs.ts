/**
 * Eng ko‘p ishlatiladigan 50 ta irregular verb (V1, V2, V3 + o‘zbekcha).
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
  { v1: "be", v2: "was/were", v3: "been", translation: "bo‘lmoq" },
  { v1: "become", v2: "became", v3: "become", translation: "bo‘lmoq (o‘zgarib)" },
  { v1: "begin", v2: "began", v3: "begun", translation: "boshlamoq" },
  { v1: "break", v2: "broke", v3: "broken", translation: "sindirmoq" },
  { v1: "bring", v2: "brought", v3: "brought", translation: "olib kelmoq" },
  { v1: "build", v2: "built", v3: "built", translation: "qurmoq" },
  { v1: "buy", v2: "bought", v3: "bought", translation: "sotib olmoq" },
  { v1: "catch", v2: "caught", v3: "caught", translation: "tutmoq" },
  { v1: "choose", v2: "chose", v3: "chosen", translation: "tanlamoq" },
  { v1: "come", v2: "came", v3: "come", translation: "kelmoq" },
  { v1: "do", v2: "did", v3: "done", translation: "qilmoq" },
  { v1: "eat", v2: "ate", v3: "eaten", translation: "yemoq" },
  { v1: "fall", v2: "fell", v3: "fallen", translation: "yiqilmoq" },
  { v1: "feel", v2: "felt", v3: "felt", translation: "his qilmoq" },
  { v1: "find", v2: "found", v3: "found", translation: "topmoq" },
  { v1: "get", v2: "got", v3: "got/gotten", translation: "olmoq, bo‘lmoq" },
  { v1: "give", v2: "gave", v3: "given", translation: "bermoq" },
  { v1: "go", v2: "went", v3: "gone", translation: "bormoq" },
  { v1: "have", v2: "had", v3: "had", translation: "ega bo‘lmoq" },
  { v1: "hear", v2: "heard", v3: "heard", translation: "eshitmoq" },
  { v1: "hit", v2: "hit", v3: "hit", translation: "urmoq" },
  { v1: "hold", v2: "held", v3: "held", translation: "ushlab turmoq" },
  { v1: "keep", v2: "kept", v3: "kept", translation: "saqlamoq" },
  { v1: "know", v2: "knew", v3: "known", translation: "bilmoq" },
  { v1: "leave", v2: "left", v3: "left", translation: "tark etmoq" },
  { v1: "lose", v2: "lost", v3: "lost", translation: "yo‘qotmoq" },
  { v1: "make", v2: "made", v3: "made", translation: "qilmoq, yasamoq" },
  { v1: "meet", v2: "met", v3: "met", translation: "uchrashmoq" },
  { v1: "pay", v2: "paid", v3: "paid", translation: "to‘lamoq" },
  { v1: "put", v2: "put", v3: "put", translation: "qo‘ymoq" },
  { v1: "read", v2: "read", v3: "read", translation: "o‘qimoq" },
  { v1: "run", v2: "ran", v3: "run", translation: "yugurmoq" },
  { v1: "say", v2: "said", v3: "said", translation: "aytmoq" },
  { v1: "see", v2: "saw", v3: "seen", translation: "ko‘rmoq" },
  { v1: "sell", v2: "sold", v3: "sold", translation: "sotmoq" },
  { v1: "send", v2: "sent", v3: "sent", translation: "yubormoq" },
  { v1: "show", v2: "showed", v3: "shown", translation: "ko‘rsatmoq" },
  { v1: "sit", v2: "sat", v3: "sat", translation: "o‘tirmoq" },
  { v1: "sleep", v2: "slept", v3: "slept", translation: "uxlamoq" },
  { v1: "speak", v2: "spoke", v3: "spoken", translation: "gapirmoq" },
  { v1: "take", v2: "took", v3: "taken", translation: "olmoq" },
  { v1: "teach", v2: "taught", v3: "taught", translation: "o‘qitmoq" },
  { v1: "tell", v2: "told", v3: "told", translation: "aytmoq, aytib bermoq" },
  { v1: "think", v2: "thought", v3: "thought", translation: "o‘ylamoq" },
  { v1: "throw", v2: "threw", v3: "thrown", translation: "otmoq" },
  { v1: "understand", v2: "understood", v3: "understood", translation: "tushunmoq" },
  { v1: "wake", v2: "woke", v3: "woken", translation: "uyg‘onmoq" },
  { v1: "wear", v2: "wore", v3: "worn", translation: "kiymoq" },
  { v1: "win", v2: "won", v3: "won", translation: "yutmoq" },
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
