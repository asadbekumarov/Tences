import { Client } from "ssh2";

function run(conn, cmd) {
  return new Promise((resolve, reject) => {
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      let out = "";
      stream.on("data", (d) => {
        out += d;
        process.stdout.write(d);
      });
      stream.stderr.on("data", (d) => process.stderr.write(d));
      stream.on("close", (code) => resolve({ code, out }));
    });
  });
}

const conn = new Client();
conn
  .on("ready", async () => {
    await run(conn, "echo '=== node processes ==='; ps aux | grep node | grep -v grep");
    await run(conn, "echo '=== find menu.js ==='; find /home/asadbektg -name menu.js -path '*/keyboard/*' 2>/dev/null");
    await run(conn, "echo '=== grep Duel in each ==='; for f in $(find /home/asadbektg -name menu.js -path '*/keyboard/*' 2>/dev/null); do echo \"-- $f\"; grep Duel \"$f\" || echo '(no Duel)'; done");
    await run(conn, "echo '=== tences subdirs ==='; ls -la /home/asadbektg/tences/; ls -la /home/asadbektg/tences/tences/ 2>/dev/null || true");
    conn.end();
  })
  .connect({
    host: "ssh-asadbektg.alwaysdata.net",
    port: 22,
    username: "asadbektg",
    password: process.env.SSH_PASSWORD,
  });
