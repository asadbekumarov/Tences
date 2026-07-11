import { Client } from "ssh2";

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
    console.log("==> Eski node jarayonlar...");
    await run(conn, "pkill -f 'node dist/bot.js' 2>/dev/null || true");
    await run(conn, "sleep 2; ps aux | grep 'node dist' | grep -v grep || echo 'node toxtadi — Alwaysdata paneldan Restart bosing'");
    conn.end();
  })
  .connect({
    host: "ssh-asadbektg.alwaysdata.net",
    port: 22,
    username: "asadbektg",
    password: process.env.SSH_PASSWORD,
  });
