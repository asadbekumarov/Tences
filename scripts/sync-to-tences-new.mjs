import { Client } from "ssh2";

const SRC = "/home/asadbektg/tences";
const DST = "/home/asadbektg/tences_new";

function run(conn, cmd) {
  return new Promise((resolve, reject) => {
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      stream.on("data", (d) => process.stdout.write(d));
      stream.stderr.on("data", (d) => process.stderr.write(d));
      stream.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`exit ${code}`))));
    });
  });
}

const conn = new Client();
conn
  .on("ready", async () => {
    await run(
      conn,
      [
        `mkdir -p ${DST}/data ${DST}/dist ${DST}/src`,
        `rsync -a --delete ${SRC}/dist/ ${DST}/dist/`,
        `rsync -a ${SRC}/src/duel/ ${DST}/src/duel/`,
        `rsync -a ${SRC}/src/handlers/game.js ${DST}/src/handlers/`,
        `rsync -a ${SRC}/src/handlers/duel.js ${DST}/src/handlers/`,
        `rsync -a ${SRC}/src/commands/ ${DST}/src/commands/`,
        `rsync -a ${SRC}/src/keyboard/ ${DST}/src/keyboard/`,
        `rsync -a ${SRC}/src/data/ ${DST}/src/data/`,
        `rsync -a ${SRC}/src/db/ ${DST}/src/db/`,
        `cp -f ${SRC}/dist/bot.js ${DST}/dist/bot.js`,
        `cp -f ${SRC}/.env ${DST}/.env`,
        `sed -i 's|/home/asadbektg/tences|/home/asadbektg/tences_new|g' ${DST}/.env`,
        `grep -n game_menu ${DST}/dist/src/keyboard/menu.js`,
        `grep -n registerGameHandlers ${DST}/dist/bot.js`,
      ].join(" && "),
    );
    console.log("\n==> tences_new yangilandi. Paneldan Restart qiling.");
    conn.end();
  })
  .connect({
    host: "ssh-asadbektg.alwaysdata.net",
    port: 22,
    username: "asadbektg",
    password: process.env.SSH_PASSWORD,
  });
