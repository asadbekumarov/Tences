import { execSync } from "node:child_process";
import { createReadStream, existsSync, readFileSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Client } from "ssh2";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const USER = process.env.SSH_USER ?? "asadbektg";
const HOST = process.env.SSH_HOST ?? "ssh-asadbektg.alwaysdata.net";
const PASSWORD = process.env.SSH_PASSWORD;
const REMOTE_DIR = process.env.REMOTE_DIR ?? "/home/asadbektg/tences_new";
const ARCHIVE = "tences-deploy.tgz";
const DB_URL = `file:${REMOTE_DIR}/data/tences.db`;

function readLocalBotToken() {
  if (process.env.BOT_TOKEN) return process.env.BOT_TOKEN;
  const envPath = join(root, ".env");
  if (!existsSync(envPath)) return "";
  const match = readFileSync(envPath, "utf8").match(/^BOT_TOKEN=(.+)$/m);
  return match?.[1]?.trim().replace(/^["']|["']$/g, "") ?? "";
}

if (!PASSWORD) {
  console.error("SSH_PASSWORD kerak");
  process.exit(1);
}

execSync("npm run build", { stdio: "inherit", cwd: root });
process.chdir(root);

if (existsSync(ARCHIVE)) unlinkSync(ARCHIVE);

execSync(
  `tar -czf ${ARCHIVE} --exclude=node_modules --exclude=.env --exclude=prisma/dev.db --exclude=.git bot.ts package.json package-lock.json tsconfig.json dist prisma src scripts .env.example`,
  { stdio: "inherit", shell: true },
);

function sshExec(conn, cmd) {
  return new Promise((resolve, reject) => {
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let out = "";
      stream
        .on("close", (code) => (code === 0 ? resolve(out) : reject(new Error(`exit ${code}: ${out}`))))
        .on("data", (d) => {
          process.stdout.write(d);
          out += d;
        })
        .stderr.on("data", (d) => process.stderr.write(d));
    });
  });
}

function sftpUpload(conn, local, remote) {
  return new Promise((resolve, reject) => {
    conn.sftp((err, sftp) => {
      if (err) return reject(err);
      const read = createReadStream(local);
      const write = sftp.createWriteStream(remote);
      read.pipe(write);
      write.on("close", resolve);
      write.on("error", reject);
    });
  });
}

const conn = new Client();

conn
  .on("ready", async () => {
    try {
      console.log("==> Server papkasi...");
      await sshExec(conn, `mkdir -p ${REMOTE_DIR}/data`);

      console.log("==> Yuklash...");
      await sftpUpload(conn, ARCHIVE, `${REMOTE_DIR}/${ARCHIVE}`);

      const botToken = readLocalBotToken();
      const envBody = [
        `BOT_TOKEN=${botToken}`,
        `DATABASE_URL="${DB_URL}"`,
        "PORT=8100",
        "HOST=::",
        "POLLING=false",
        "",
      ].join("\n");
      const envB64 = Buffer.from(envBody).toString("base64");

      console.log("==> O'rnatish...");
      await sshExec(
        conn,
        [
          `cd ${REMOTE_DIR}`,
          "rm -rf dist",
          "tar -xzf " + ARCHIVE,
          "mkdir -p data",
          "rm -f " + ARCHIVE,
          `echo ${envB64} | base64 -d > .env`,
          "export NODE_OPTIONS=--max-old-space-size=192",
          "npm install --omit=dev --no-audit --no-fund --ignore-scripts",
          "npx prisma generate",
          "npx prisma migrate deploy",
          "node scripts/seed-grammar.mjs",
        ].join(" && "),
      );

      console.log("\n==> Tayyor!");
      console.log(`Alwaysdata Command: cd ${REMOTE_DIR} && npm run start:prod`);
      console.log(`DATABASE_URL=file:${REMOTE_DIR}/data/tences.db`);
      conn.end();
      unlinkSync(ARCHIVE);
    } catch (e) {
      console.error(e);
      conn.end();
      process.exit(1);
    }
  })
  .on("error", (e) => {
    console.error(e);
    process.exit(1);
  })
  .connect({
    host: HOST,
    port: 22,
    username: USER,
    password: PASSWORD,
    readyTimeout: 30000,
  });
