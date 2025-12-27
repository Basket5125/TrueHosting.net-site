import express from "express";
import bodyParser from "body-parser";
import fs from "fs";
import fetch from "node-fetch";

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// 🔑 Twoje dane Cloudflare
const CLOUDFLARE_API = "https://api.cloudflare.com/client/v4";
const CLOUDFLARE_ZONE_ID = "TWOJE_ZONE_ID"; 
const CLOUDFLARE_TOKEN = "TWOJ_API_TOKEN";

app.post("/register", async (req, res) => {
  const { email, username, egg, servername } = req.body;
  const subdomain = `${servername}.truehosting.net`;

  try {
    // 1. Tworzenie subdomeny w Cloudflare
    await fetch(`${CLOUDFLARE_API}/zones/${CLOUDFLARE_ZONE_ID}/dns_records`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${CLOUDFLARE_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type: "A",
        name: subdomain,
        content: "93.154.128.151",
        ttl: 120,
        proxied: false
      })
    });

    // 2. Dodanie forced host do velocity.toml
    const velocityFile = "/var/lib/pelican/volumes/4fed7159-e92c-4ef3-bcf7-db6b470118c9/velocity.toml";
    const configLine = `\n"${subdomain}" = "lobby" # przypisany serwer\n`;
    fs.appendFileSync(velocityFile, configLine);

    // 3. Odpowiedź
    res.send(`
      <h1>✅ Serwer zarejestrowany!</h1>
      <p>Twoja subdomena: <b>${subdomain}</b></p>
      <a href="/">Powrót</a>
    `);

  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Wystąpił błąd przy tworzeniu serwera.");
  }
});

app.listen(3000, () => console.log("🚀 Server działa na porcie 3000"));
