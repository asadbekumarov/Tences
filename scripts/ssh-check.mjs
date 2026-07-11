import { Client } from "ssh2";

const conn = new Client();
const PASSWORD = process.env.SSH_PASSWORD;
const REMOTE_DIR = "/home/asadbektg/tences";

function run(cmd) {
  return new Promise((resolve, reject) => {
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      stream.on("data", (d) => process.stdout.write(d));
      stream.stderr.on("data", (d) => process.stderr.write(d));
      stream.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`exit ${code}`))));
    });
  });
}

conn
  .on("ready", async () => {
    try {
      await run(`ls -la ${REMOTE_DIR}/dist/src/data/`);
      await run(`cd ${REMOTE_DIR} && timeout 4 node dist/bot.js 2>&1 || true`);
      conn.end();
    } catch (e) {
      console.error(e);
      conn.end();
      process.exit(1);
    }
  })
  .connect({ host: "ssh-asadbektg.alwaysdata.net", port: 22, username: "asadbektg", password: PASSWORD });