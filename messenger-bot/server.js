const http = require("http");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");
const { getReply } = require("./bot");

// Minimal .env loader (no dependencies)
try {
  for (const line of fs.readFileSync(path.join(__dirname, ".env"), "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

const { PAGE_ACCESS_TOKEN, VERIFY_TOKEN, APP_SECRET } = process.env;
const PORT = process.env.PORT || 3000;

function validSignature(raw, header) {
  if (!APP_SECRET) return false;
  const expected = "sha256=" + crypto.createHmac("sha256", APP_SECRET).update(raw).digest("hex");
  const a = Buffer.from(expected), b = Buffer.from(header || "");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

async function sendText(psid, text) {
  const res = await fetch(`https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ recipient: { id: psid }, messaging_type: "RESPONSE", message: { text } }),
  });
  if (!res.ok) console.error("Send API error:", res.status, await res.text());
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://localhost");
  if (url.pathname !== "/webhook") { res.writeHead(200); return res.end("Messenger bot running"); }

  // Meta webhook verification
  if (req.method === "GET") {
    if (url.searchParams.get("hub.mode") === "subscribe" && url.searchParams.get("hub.verify_token") === VERIFY_TOKEN) {
      res.writeHead(200); return res.end(url.searchParams.get("hub.challenge"));
    }
    res.writeHead(403); return res.end();
  }

  if (req.method === "POST") {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      const raw = Buffer.concat(chunks);
      if (!validSignature(raw, req.headers["x-hub-signature-256"])) { res.writeHead(403); return res.end(); }
      res.writeHead(200); res.end("EVENT_RECEIVED");
      try {
        const body = JSON.parse(raw.toString());
        if (body.object !== "page") return;
        for (const entry of body.entry || [])
          for (const ev of entry.messaging || [])
            if (ev.message && ev.message.text && !ev.message.is_echo)
              sendText(ev.sender.id, getReply(ev.message.text)).catch(console.error);
      } catch (e) { console.error(e); }
    });
    return;
  }
  res.writeHead(405); res.end();
});

server.listen(PORT, () => console.log(`Listening on :${PORT}`));
