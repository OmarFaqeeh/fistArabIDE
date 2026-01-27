import path from "path";
import http from "http";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import WebSocket, { WebSocketServer } from "ws";
import { fileURLToPath } from "url";
import userRoutes from "./routes/userRoutes.js";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// تحديث CORS للسماح بالدومينات المختلفة
const allowedOrigins = [
  'http://localhost:3001',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:5177',
  process.env.FRONTEND_URL // إضافة رابط Frontend من Environment Variables
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    message: "مرحباً! السيرفر يعمل 🚀",
    status: "ok",
    port: process.env.PORT || 3001,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    endpoints: [
      "POST /api/users/login - تسجيل الدخول",
      "POST /api/users/:userId - إنشاء حساب جديد",
      "GET /api/users/:userId - جلب بيانات مستخدم",
      "PATCH /api/users/:userId - تحديث بيانات المستخدم",
      "PATCH /api/users/:userId/code - تحديث الكود",
      "POST /api/users/:userId/upload-image - رفع صورة البروفايل",
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
  ws.user = { 
    name: "مستخدم", 
    id: Math.random().toString(16).slice(2) 
  };

  console.log(`✅ مستخدم جديد متصل: ${ws.user.id}`);

  ws.send(JSON.stringify({ 
    type: "system", 
    text: "تم الاتصال بالسيرفر ✅" 
  }));

  broadcast({ 
    type: "system", 
    text: "مستخدم جديد دخل (اتصال جديد)" 
  });

  ws.on("message", (data) => {
    let payload;
    try {
      payload = JSON.parse(data.toString());
    } catch (err) {
      console.error("❌ خطأ في تحليل الرسالة:", err);
      return;
    }

    if (payload.type === "set_name") {
      const newName = String(payload.name || "").trim().slice(0, 20);
      if (newName) {
        const old = ws.user.name;
        ws.user.name = newName;
        broadcast({ 
          type: "system", 
          text: `تغيير الاسم: ${old} → ${newName}` 
        });
      }
      return;
    }

    if (payload.type === "chat") {
      const text = String(payload.text || "").trim().slice(0, 500);
      if (!text) return;
      
      console.log(`💬 رسالة من ${ws.user.name}: ${text}`);
      
      broadcast({
        type: "chat",
        name: ws.user.name,
        text,
        ts: Date.now(),
      });
    }
  });

  ws.on("close", () => {
    console.log(`❌ مستخدم قطع الاتصال: ${ws.user.id}`);
    broadcast({ 
      type: "system", 
      text: `خرج ${ws.user.name}` 
    });
  });

  ws.on("error", (error) => {
    console.error("❌ خطأ في WebSocket:", error);
  });
});

// تقديم الملفات الثابتة (Static Files)
const distPath = path.join(__dirname, "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

// توجيه جميع الطلبات إلى index.html (للـ SPA)
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  
  if (fs.existsSync(path.join(distPath, "index.html"))) {
    res.sendFile(path.join(distPath, "index.html"), (err) => {
      if (err) next();
    });
  } else {
    next();
  }
});

// معالجة الصفحات غير الموجودة
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: "الصفحة غير موجودة ❌" 
  });
});

// معالجة الأخطاء العامة
app.use((err, req, res, next) => {
  console.error("❌ خطأ في السيرفر:", err);
  res.status(500).json({ 
    success: false, 
    error: "حدث خطأ في السيرفر" 
  });
});

// إعدادات البورت للـ Production
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log('\n' + '='.repeat(60));
  console.log(`✅ السيرفر شغال على http://${HOST}:${PORT}`);
  console.log(`🌐 API متاح على http://${HOST}:${PORT}/api`);
  console.log(`🔌 WebSocket متاح على ws://${HOST}:${PORT}`);
  console.log(`💚 Health Check: http://${HOST}:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('='.repeat(60) + '\n');
});

// معالجة إشارات الإيقاف
process.on('SIGTERM', () => {
  console.log('⚠️ تلقي إشارة SIGTERM، إيقاف السيرفر...');
  server.close(() => {
    console.log('✅ تم إيقاف السيرفر بنجاح');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n⚠️ تلقي إشارة SIGINT، إيقاف السيرفر...');
  server.close(() => {
    console.log('✅ تم إيقاف السيرفر بنجاح');
    process.exit(0);
  });
});

// معالجة الأخطاء غير المتوقعة
process.on('uncaughtException', (error) => {
  console.error('❌ خطأ غير متوقع:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promise مرفوض بدون معالجة:', promise, 'السبب:', reason);
});