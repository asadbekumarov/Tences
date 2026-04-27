/**
 * Eng ko‘p ishlatiladigan irregular verb (V1, V2, V3 + o‘zbekcha).
 * Foydalanuvchi taqdim etgan 13 ta guruh asosida.
 */
export const IRREGULAR_VERBS = [
    // 1-guruh
    { v1: "think", v2: "thought", v3: "thought", translation: "O‘ylamoq" },
    { v1: "catch", v2: "caught", v3: "caught", translation: "Tutmoq" },
    { v1: "bring", v2: "brought", v3: "brought", translation: "Olib kelmoq" },
    { v1: "buy", v2: "bought", v3: "bought", translation: "Sotib olmoq" },
    { v1: "fight", v2: "fought", v3: "fought", translation: "Urushmoq" },
    { v1: "teach", v2: "taught", v3: "taught", translation: "O‘rgatmoq" },
    { v1: "seek", v2: "sought", v3: "sought", translation: "Qidirmoq" },
    // 2-guruh
    { v1: "dream", v2: "dreamt", v3: "dreamt", translation: "Orzu qilmoq" },
    { v1: "sleep", v2: "slept", v3: "slept", translation: "Uxlamoq" },
    { v1: "keep", v2: "kept", v3: "kept", translation: "Saqlamoq" },
    { v1: "deal", v2: "dealt", v3: "dealt", translation: "Taqsimlamoq" },
    { v1: "mean", v2: "meant", v3: "meant", translation: "Ma’no bildirmoq" },
    { v1: "leave", v2: "left", v3: "left", translation: "Tark etmoq" },
    { v1: "feel", v2: "felt", v3: "felt", translation: "His qilmoq" },
    { v1: "sweep", v2: "swept", v3: "swept", translation: "Supurmoq" },
    { v1: "bend", v2: "bent", v3: "bent", translation: "Egmoq" },
    { v1: "build", v2: "built", v3: "built", translation: "Qurmoq" },
    { v1: "lend", v2: "lent", v3: "lent", translation: "Qarz bermoq" },
    { v1: "lose", v2: "lost", v3: "lost", translation: "Yo‘qotmoq" },
    { v1: "send", v2: "sent", v3: "sent", translation: "Jo‘natmoq" },
    { v1: "spend", v2: "spent", v3: "spent", translation: "Sarflamoq" },
    // 3-guruh
    { v1: "stick", v2: "stuck", v3: "stuck", translation: "Yopishtirmoq" },
    { v1: "dig", v2: "dug", v3: "dug", translation: "Kavlamoq" },
    { v1: "sting", v2: "stung", v3: "stung", translation: "Chaqmoq" },
    { v1: "swing", v2: "swung", v3: "swung", translation: "Tebratmoq" },
    { v1: "hang", v2: "hung", v3: "hung", translation: "Osib qo‘ymoq" },
    // 4-guruh
    { v1: "cut", v2: "cut", v3: "cut", translation: "Kesmoq" },
    { v1: "put", v2: "put", v3: "put", translation: "Qo‘ymoq" },
    { v1: "quit", v2: "quit", v3: "quit", translation: "Tashlab ketmoq" },
    { v1: "bet", v2: "bet", v3: "bet", translation: "Garov o‘ynamoq" },
    { v1: "cost", v2: "cost", v3: "cost", translation: "Narx turmoq" },
    { v1: "sweat", v2: "sweat", v3: "sweat", translation: "Terlamoq" },
    { v1: "spread", v2: "spread", v3: "spread", translation: "Tarqalmoq" },
    { v1: "let", v2: "let", v3: "let", translation: "Ruxsat bermoq" },
    { v1: "broadcast", v2: "broadcast", v3: "broadcast", translation: "Uzatmoq" },
    { v1: "hit", v2: "hit", v3: "hit", translation: "Zarba bermoq" },
    { v1: "hurt", v2: "hurt", v3: "hurt", translation: "Zarar yetmoq" },
    { v1: "read", v2: "read", v3: "read", translation: "O‘qimoq" },
    { v1: "set", v2: "set", v3: "set", translation: "O‘rnatmoq" },
    { v1: "shut", v2: "shut", v3: "shut", translation: "Berkitmoq" },
    { v1: "split", v2: "split", v3: "split", translation: "Tilmoq" },
    { v1: "burst", v2: "burst", v3: "burst", translation: "Yorilmoq" },
    { v1: "fit", v2: "fit", v3: "fit", translation: "To‘g‘ri kelmoq" },
    // 5-guruh
    { v1: "ring", v2: "rang", v3: "rung", translation: "Qo‘ng‘iroq qilmoq" },
    { v1: "sing", v2: "sang", v3: "sung", translation: "Kuylamoq" },
    { v1: "sink", v2: "sank", v3: "sunk", translation: "Cho‘kmoq" },
    { v1: "drink", v2: "drank", v3: "drunk", translation: "Ichmoq" },
    { v1: "swim", v2: "swam", v3: "swum", translation: "Suzmoq" },
    { v1: "begin", v2: "began", v3: "begun", translation: "Boshlamoq" },
    { v1: "run", v2: "ran", v3: "run", translation: "Yugurmoq" },
    { v1: "shrink", v2: "shrank", v3: "shrunk", translation: "Qisqarmoq" },
    { v1: "spring", v2: "sprang", v3: "sprung", translation: "Sakramoq" },
    { v1: "stink", v2: "stank", v3: "stunk", translation: "Sasimoq" },
    // 6-guruh
    { v1: "speak", v2: "spoke", v3: "spoken", translation: "Gapirmoq" },
    { v1: "choose", v2: "chose", v3: "chosen", translation: "Tanlamoq" },
    { v1: "break", v2: "broke", v3: "broken", translation: "Sindirmoq" },
    { v1: "drive", v2: "drove", v3: "driven", translation: "Haydamoq" },
    { v1: "freeze", v2: "froze", v3: "frozen", translation: "Muzlamoq" },
    { v1: "steal", v2: "stole", v3: "stolen", translation: "O‘g‘irlamoq" },
    { v1: "wake", v2: "woke", v3: "woken", translation: "Uyg‘otmoq" },
    { v1: "write", v2: "wrote", v3: "written", translation: "Yozmoq" },
    { v1: "rise", v2: "rose", v3: "risen", translation: "Ko‘tarilmoq" },
    { v1: "ride", v2: "rode", v3: "ridden", translation: "Minmoq" },
    // 7-guruh
    { v1: "beat", v2: "beat", v3: "beaten", translation: "Urmoq" },
    { v1: "bite", v2: "bit", v3: "bitten", translation: "Maydalamoq" },
    { v1: "hide", v2: "hid", v3: "hidden", translation: "Yashirmoq" },
    { v1: "forbid", v2: "forbade", v3: "forbidden", translation: "Ta’qiqlamoq" },
    { v1: "forget", v2: "forgot", v3: "forgotten", translation: "Unutmoq" },
    { v1: "get", v2: "got", v3: "gotten", translation: "Olmoq" },
    { v1: "fall", v2: "fell", v3: "fallen", translation: "Qulamoq" },
    { v1: "eat", v2: "ate", v3: "eaten", translation: "Yemoq" },
    { v1: "shake", v2: "shook", v3: "shaken", translation: "Qaltiramoq" },
    { v1: "take", v2: "took", v3: "taken", translation: "Olmoq" },
    // 8-guruh
    { v1: "become", v2: "became", v3: "become", translation: "Bo‘lmoq" },
    { v1: "come", v2: "came", v3: "come", translation: "Kelmoq" },
    // 9-guruh
    { v1: "blow", v2: "blew", v3: "blown", translation: "Esmoq" },
    { v1: "draw", v2: "drew", v3: "drawn", translation: "Chizmoq" },
    { v1: "fly", v2: "flew", v3: "flown", translation: "Uchmoq" },
    { v1: "grow", v2: "grew", v3: "grown", translation: "O‘smoq" },
    { v1: "know", v2: "knew", v3: "known", translation: "Bilmoq" },
    { v1: "throw", v2: "threw", v3: "thrown", translation: "Otmoq" },
    { v1: "show", v2: "showed", v3: "shown", translation: "Ko‘rsatmoq" },
    { v1: "sew", v2: "sewed", v3: "sewn/sewed", translation: "Tikmoq" },
    // 10-guruh
    { v1: "feed", v2: "fed", v3: "fed", translation: "Boqmoq" },
    { v1: "find", v2: "found", v3: "found", translation: "Topmoq" },
    { v1: "have", v2: "had", v3: "had", translation: "Ega bo‘lmoq" },
    { v1: "hear", v2: "heard", v3: "heard", translation: "Eshitmoq" },
    { v1: "hold", v2: "held", v3: "held", translation: "Ushlamoq" },
    { v1: "lay", v2: "laid", v3: "laid", translation: "Qo‘ymoq" },
    { v1: "lead", v2: "led", v3: "led", translation: "Olib bormoq" },
    { v1: "light", v2: "lit", v3: "lit", translation: "Yoqmoq" },
    { v1: "make", v2: "made", v3: "made", translation: "Qilmoq" },
    { v1: "meet", v2: "met", v3: "met", translation: "Uchrashmoq" },
    { v1: "pay", v2: "paid", v3: "paid", translation: "To‘lamoq" },
    { v1: "say", v2: "said", v3: "said", translation: "Gapirmoq" },
    { v1: "sell", v2: "sold", v3: "sold", translation: "Sotmoq" },
    { v1: "shine", v2: "shone", v3: "shone", translation: "Nur sochmoq" },
    { v1: "shoot", v2: "shot", v3: "shot", translation: "Otib tashlamoq" },
    { v1: "sit", v2: "sat", v3: "sat", translation: "O‘tirmoq" },
    { v1: "stand", v2: "stood", v3: "stood", translation: "Turmoq" },
    { v1: "tell", v2: "told", v3: "told", translation: "Aytib bermoq" },
    { v1: "understand", v2: "understood", v3: "understood", translation: "Tushunmoq" },
    { v1: "win", v2: "won", v3: "won", translation: "Yutmoq" },
    // 11-guruh
    { v1: "be", v2: "was/were", v3: "been", translation: "Bo‘lmoq" },
    { v1: "do", v2: "did", v3: "done", translation: "Qilmoq" },
    { v1: "go", v2: "went", v3: "gone", translation: "Bormoq" },
    { v1: "see", v2: "saw", v3: "seen", translation: "Ko‘rmoq" },
    { v1: "lie", v2: "lay", v3: "lain", translation: "Yotmoq" },
    // 12-guruh
    { v1: "forgive", v2: "forgave", v3: "forgiven", translation: "Kechirmoq" },
    { v1: "give", v2: "gave", v3: "given", translation: "Bermoq" },
    // 13-guruh
    { v1: "swear", v2: "swore", v3: "sworn", translation: "So‘kinmoq" },
    { v1: "tear", v2: "tore", v3: "torn", translation: "Yirtmoq" },
    { v1: "wear", v2: "wore", v3: "worn", translation: "Kiyib yurmoq" },
];
function firstLetterLower(v1) {
    return v1.trim().toLowerCase().charAt(0);
}
export function verbsInLetterRange(range) {
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
function allSurfaceForms(v) {
    const s = new Set();
    const add = (x) => {
        x.split("/").forEach((p) => {
            const t = p.trim().toLowerCase();
            if (t)
                s.add(t);
        });
    };
    add(v.v1);
    add(v.v2);
    add(v.v3);
    return s;
}
export function findVerbByAnyForm(raw) {
    const w = raw.trim().toLowerCase();
    if (!w)
        return undefined;
    for (const v of IRREGULAR_VERBS) {
        if (allSurfaceForms(v).has(w))
            return v;
    }
    return undefined;
}
