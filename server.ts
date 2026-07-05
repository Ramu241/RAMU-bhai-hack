import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const KEYS_FILE = path.join(process.cwd(), "keys.json");

interface GeneratedKey {
  key: string;
  game: string;
  duration: string;
  expiresAt: number;
}

// Robust file-based database for keys to persist across restarts/redeploys
function loadKeys(): GeneratedKey[] {
  try {
    if (fs.existsSync(KEYS_FILE)) {
      const data = fs.readFileSync(KEYS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("Error loading keys database:", err);
  }
  return [];
}

function saveKeys(keys: GeneratedKey[]) {
  try {
    fs.writeFileSync(KEYS_FILE, JSON.stringify(keys, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving keys database:", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route to proxy the Bingo history to prevent CORS issues
  app.get("/api/bingo-history", async (req, res) => {
    try {
      const response = await fetch("https://draw.ar-lottery01.com/WinGo/WinGo_1M/GetHistoryIssuePage.json", {
        headers: {
          "accept": "application/json, text/plain, */*",
          "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch history: ${response.statusText}`);
      }
      const data = await response.json();
      res.json(data);
    } catch (error: any) {
      console.error("Error fetching Bingo history proxy:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  // GET /api/keys - Retrieve all keys (Requires Admin Authorization)
  app.get("/api/keys", (req, res) => {
    const auth = req.headers.authorization;
    const securePin = "RAMU_BHAI_ADMIN_SECURE_BYPASS_9090_#@!";
    if (auth !== securePin) {
      return res.status(401).json({ error: "Unauthorized access" });
    }
    const keys = loadKeys();
    res.json(keys);
  });

  // POST /api/keys - Create a new key (Requires Admin Authorization)
  app.post("/api/keys", (req, res) => {
    const auth = req.headers.authorization;
    const securePin = "RAMU_BHAI_ADMIN_SECURE_BYPASS_9090_#@!";
    if (auth !== securePin) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const { key, game, duration, expiresAt } = req.body;
    if (!key || !game || !duration || !expiresAt) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const keys = loadKeys();
    const now = Date.now();
    // Keep clean by filtering expired keys older than 2 days
    const activeKeys = keys.filter(k => k.expiresAt > (now - 172800000));

    const newKeyObj: GeneratedKey = { key, game, duration, expiresAt };
    activeKeys.unshift(newKeyObj);
    saveKeys(activeKeys);

    res.json({ success: true, keys: activeKeys });
  });

  // DELETE /api/keys/:key - Delete an active key (Requires Admin Authorization)
  app.delete("/api/keys/:key", (req, res) => {
    const auth = req.headers.authorization;
    const securePin = "RAMU_BHAI_ADMIN_SECURE_BYPASS_9090_#@!";
    if (auth !== securePin) {
      return res.status(401).json({ error: "Unauthorized access" });
    }

    const keyToDelete = req.params.key;
    const keys = loadKeys();
    const updatedKeys = keys.filter(k => k.key !== keyToDelete);
    saveKeys(updatedKeys);

    res.json({ success: true, keys: updatedKeys });
  });

  // POST /api/keys/verify - Public endpoint for users to verify key on any device
  app.post("/api/keys/verify", (req, res) => {
    const { key, game } = req.body;
    if (!key || !game) {
      return res.status(400).json({ error: "Missing passcode or game type" });
    }

    const keys = loadKeys();
    const now = Date.now();

    // Verify if passcode matches active keys list and has not expired
    const matchedKey = keys.find(
      k => k.key === key && (k.game === game || k.game === "all") && k.expiresAt > now
    );

    if (matchedKey) {
      res.json({ success: true, key: matchedKey });
    } else {
      res.status(400).json({ error: "गलत पासकोड! कृपया वैध और सक्रिय पासकोड दर्ज करें। / Invalid or Expired Passcode!" });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
