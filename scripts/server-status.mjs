import { Client } from "ssh2";

const REMOTE_DIR = "/home/asadbektg/tences";

function run(conn, cmd) {
  return new Promise((resolve, reject) => {
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      stream.on("data", (d) => process.stdout.write(d));
      stream.stderr.on("data", (d) => process.stderr.write(d));
      stream.on("close", (code) => resolve(code));
    });
  });
}

const conn = new Client();
conn
  .on("ready", async () => {
    await run(conn, `cd ${REMOTE_DIR} && pwd && test -f dist/bot.js && echo 'bot.js OK'`);
    await run(conn, `cd ${REMOTE_DIR} && timeout 5 node dist/bot.js 2>&1 || true`);
    conn.end();
  })
  .connect({
    host: "ssh-asadbektg.alwaysdata.net",
    port: 22,
    username: "asadbektg",
    password: process.env.SSH_PASSWORD,
  });
