import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "ssh2";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const REMOTE_DIR = "/home/asadbektg/tences";
const PASSWORD = process.env.SSH_PASSWORD;

function botToken() {
  if (process.env.BOT_TOKEN) return process.env.BOT_TOKEN;
  const env = readFileSync(join(root, ".env"), "utf8");
  return env.match(/^BOT_TOKEN=(.+)$/m)?.[1]?.trim() ?? "";
}

const envContent = `BOT_TOKEN=${botToken()}
DATABASE_URL="file:${REMOTE_DIR}/data/tences.db"
PORT=8100
HOST=::
POLLING=false
`;

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
    try {
      const b64 = Buffer.from(envContent).toString("base64");
      await run(conn, `echo ${b64} | base64 -d > ${REMOTE_DIR}/.env`);
      await run(
        conn,
        `cd ${REMOTE_DIR} && export NODE_OPTIONS=--max-old-space-size=192 && npx prisma migrate deploy && node dist/bot.js &`,
      );
      console.log("\n==> .env tuzatildi, migrate va bot ishga tushirildi");
      conn.end();
    } catch (e) {
      console.error(e);
      conn.end();
      process.exit(1);
    }
  })
  .connect({ host: "ssh-asadbektg.alwaysdata.net", port: 22, username: "asadbektg", password: PASSWORD });
