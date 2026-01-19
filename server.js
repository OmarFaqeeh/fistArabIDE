import path from "path";
import http from "http";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import WebSocket, { WebSocketServer } from "ws";
import { fileURLToPath } from "url";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    message: "مرحباً! السيرفر يعمل 🚀",
    endpoints: [
      "POST /api/users/:userId - إنشاء/تحديث مستخدم",
      "GET /api/users/:userId - جلب بيانات مستخدم",
      "PATCH /api/users/:userId/code - تحديث الكود",
      "PATCH /api/users/:userId - تحديث أي حقل",
      "POST /api/users/:userId/upload-image - رفع صورة",
      "DELETE /api/users/:userId - حذف مستخدم"
    ]
  });
});

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

function broadcast(obj) {
  const msg = JSON.stringify(obj);
  for (const client of wss.clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  }
}

wss.on("connection", (ws) => {
  ws.user = { name: "مستخدم", id: Math.random().toString(16).slice(2) };

  ws.send(JSON.stringify({ type: "system", text: "تم الاتصال بالسيرفر ✅" }));
  broadcast({ type: "system", text: "مستخدم جديد دخل (اتصال جديد)" });

  ws.on("message", (data) => {
    let payload;
    try {
      payload = JSON.parse(data.toString());
    } catch (err) {
      return err;
    }

    if (payload.type === "set_name") {
      const newName = String(payload.name || "").trim().slice(0, 20);
      if (newName) {
        const old = ws.user.name;
        ws.user.name = newName;
        broadcast({ type: "system", text: `تغيير الاسم: ${old} → ${newName}` });
      }
      return;
    }

    if (payload.type === "chat") {
      const text = String(payload.text || "").trim().slice(0, 500);
      if (!text) return;
      broadcast({
        type: "chat",
        name: ws.user.name,
        text,
        ts: Date.now(),
      });
    }
  });

  ws.on("close", () => {
    broadcast({ type: "system", text: `خرج ${ws.user.name}` });
  });
});

const distPath = path.join(__dirname, "dist");
app.use(express.static(distPath));

// استخدم middleware عادي بدلاً من wildcard route
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  res.sendFile(path.join(distPath, "index.html"), (err) => {
    if (err) next();
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`✅ السيرفر شغال على http://localhost:${PORT}`);
});