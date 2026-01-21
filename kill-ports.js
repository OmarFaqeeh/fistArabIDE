import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

// قائمة البورتات المراد تنظيفها
const ports = [3001, 3002, 3003, 3004, 3005, 3006, 3007, 3008, 3009, 3010];

console.log('🧹 جاري تنظيف البورتات...\n');

async function killPort(port) {
  try {
    const { stdout } = await execPromise(`netstat -ano | findstr :${port}`);
    const lines = stdout.split('\n');
    
    for (const line of lines) {
      if (line.includes('LISTENING')) {
        const parts = line.trim().split(/\s+/);
        const pid = parts[parts.length - 1];
        
        if (pid && !isNaN(pid)) {
          try {
            await execPromise(`taskkill /PID ${pid} /F`);
            console.log(`✅ تم قتل البروسس ${pid} على البورت ${port}`);
          } catch (err) {
            console.log(`❌ فشل قتل البروسس ${pid} على البورت ${port}`);
          }
        }
      }
    }
  } catch (err) {
    // لا يوجد بروسس على هذا البورت
  }
}

async function cleanAllPorts() {
  for (const port of ports) {
    await killPort(port);
  }
  
  console.log('\n✅ تم تنظيف جميع البورتات!\n');
  console.log('💡 الآن يمكنك تشغيل السيرفر بأمان: node server.js\n');
}

cleanAllPorts();