import path from "path";
import http from "http";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import WebSocket, { WebSocketServer } from "ws";
import { fileURLToPath } from "url";
import userRoutes from "./routes/userRoutes.js";
import fs from "fs";
import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ CORS Configuration - Fixed for Production
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? true  // في Production: اسمح لكل المصادر
  : [
      'http://localhost:3003',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:5176',
      'http://localhost:5177'
    ];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);

app.get("/api/health", (req, res) => {
  res.json({
    message: "مرحباً! السيرفر يعمل 🚀",
    status: "ok",
    port: server.address()?.port,
    timestamp: new Date().toISOString(),
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

const distPath = path.join(__dirname, "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
}

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

app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: "الصفحة غير موجودة ❌" 
  });
});

app.use((err, req, res, next) => {
  console.error("❌ خطأ في السيرفر:", err);
  res.status(500).json({ 
    success: false, 
    error: "حدث خطأ في السيرفر" 
  });
});

// 🔥 قتل البروسس القديم على البورت تلقائياً (Windows فقط)
async function killProcessOnPort(port) {
  try {
    const { stdout } = await execPromise(`netstat -ano | findstr :${port}`);
    const lines = stdout.split('\n');
    
    for (const line of lines) {
      if (line.includes('LISTENING')) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        
        if (pid && !isNaN(pid)) {
          console.log(`🔪 قتل البروسس ${pid} على البورت ${port}...`);
          await execPromise(`taskkill /PID ${pid} /F`);
          await new Promise(resolve => setTimeout(resolve, 500));
          return true;
        }
      }
    }
  } catch (err) {
    // تجاهل الأخطاء - قد لا يكون هناك بروسس
  }
  return false;
}

// البحث عن بورت متاح
const PORT_FILE = path.join(__dirname, '.port');
const PUBLIC_PORT_FILE = path.join(__dirname, 'public', '.port');
const START_PORT = process.env.PORT || 3001;
const MAX_PORT = START_PORT + 20;

async function findAvailablePort(startPort) {
  let currentPort = parseInt(startPort);
  
  while (currentPort <= MAX_PORT) {
    try {
      // محاولة قتل البروسس القديم أولاً
      if (currentPort === parseInt(START_PORT)) {
        await killProcessOnPort(currentPort);
      }
      
      await new Promise((resolve, reject) => {
        const testServer = http.createServer();
        
        testServer.once('error', (err) => {
          if (err.code === 'EADDRINUSE') {
            reject(err);
          } else {
            reject(err);
          }
        });
        
        testServer.once('listening', () => {
          testServer.close(() => {
            resolve();
          });
        });
        
        testServer.listen(currentPort);
      });
      
      return currentPort;
    } catch (err) {
      if (err.code === 'EADDRINUSE') {
        console.log(`⚠️  البورت ${currentPort} مستخدم، جاري تجربة ${currentPort + 1}...`);
        currentPort++;
      } else {
        throw err;
      }
    }
  }
  
  throw new Error(`لم يتم العثور على بورت متاح بين ${startPort} و ${MAX_PORT}`);
}

async function startServer() {
  try {
    console.log('🔍 جاري البحث عن بورت متاح...\n');
    
    const availablePort = await findAvailablePort(START_PORT);
    
    server.listen(availablePort, () => {
      console.log('\n' + '='.repeat(60));
      console.log(`✅ السيرفر شغال على http://localhost:${availablePort}`);
      console.log(`🌐 API متاح على http://localhost:${availablePort}/api`);
      console.log(`🔌 WebSocket متاح على ws://localhost:${availablePort}`);
      console.log(`💚 Health Check: http://localhost:${availablePort}/api/health`);
      console.log('='.repeat(60) + '\n');
      
      // حفظ البورت في ملفين
      fs.writeFileSync(PORT_FILE, availablePort.toString(), 'utf8');
      
      // حفظ في مجلد public أيضاً
      const publicDir = path.join(__dirname, 'public');
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      fs.writeFileSync(PUBLIC_PORT_FILE, availablePort.toString(), 'utf8');
      
      console.log(`📝 تم حفظ البورت ${availablePort} في الملفات\n`);
    });
    
  } catch (error) {
    console.error('❌ فشل تشغيل السيرفر:', error.message);
    process.exit(1);
  }
}

startServer();

process.on('SIGTERM', () => {
  console.log('⚠️ تلقي إشارة SIGTERM، إيقاف السيرفر...');
  server.close(() => {
    console.log('✅ تم إيقاف السيرفر بنجاح');
    if (fs.existsSync(PORT_FILE)) {
      fs.unlinkSync(PORT_FILE);
    }
    if (fs.existsSync(PUBLIC_PORT_FILE)) {
      fs.unlinkSync(PUBLIC_PORT_FILE);
    }
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n⚠️ تلقي إشارة SIGINT، إيقاف السيرفر...');
  server.close(() => {
    console.log('✅ تم إيقاف السيرفر بنجاح');
    if (fs.existsSync(PORT_FILE)) {
      fs.unlinkSync(PORT_FILE);
    }
    if (fs.existsSync(PUBLIC_PORT_FILE)) {
      fs.unlinkSync(PUBLIC_PORT_FILE);
    }
    process.exit(0);
  });
});