const token = process.env.BOT_TOKEN ?? "8619070730:AAHKvow8feeJgpGZNCoexImTymHVPnTfApU";

const commands = [
  { command: "start", description: "Botni qayta ishga tushirish" },
  { command: "tenses", description: "Ingliz tili zamonlari" },
  { command: "vocabulary", description: "Lug'at unitlari (1-60)" },
  { command: "verbs", description: "Noto'g'ri fe'llar ro'yxati" },
  { command: "game", description: "1v1 do'st bilan duel" },
  { command: "duel", description: "1v1 duel (game)" },
  { command: "help", description: "@asad_umarov" },
];

const res = await fetch(`https://api.telegram.org/bot${token}/setMyCommands`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ commands }),
});

const data = await res.json();
console.log(JSON.stringify(data, null, 2));

const list = await fetch(`https://api.telegram.org/bot${token}/getMyCommands`);
console.log(JSON.stringify(await list.json(), null, 2));
