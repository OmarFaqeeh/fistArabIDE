import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// نقرأ بيانات الحساب الخدمي من Environment Variables بدل الملف
const serviceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID || 'ide-d0338',
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || 'eb434c47571a0dcb006d933a0cbeaffd52f93771',
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDMx2oj/h5Fr0Ku\nYmqFd3J2PiXZnJGFyYAdGV4uCZBtGcu/pLSCjRi8Ew3JB+iM34km6mv0Klpgy/C7\n+pjjTDckI5EMCfOHRVwK67cg0kBo2Lq7wVqx8FoyelW4a4v87FlH1VSvYAKeAM9n\nmt4opVKVOym7S2nuuDyFTNgDSYeARroeS7fjrZOIFMzFgRNTBHexyg22vpwfoW6w\ny4YGJPSUfVQS70zqWgOsFJICEkJf3dKIffSiyGO8Tp0jHFGoXjxBtkqYkHYxBY2i\nFVB5tW8nAVX8fEnue+q0K9EFsIfWHqTiD2/fY8gMX0J/PbiOvp7r7QF735eIwRoG\nzS7Ax1ZDAgMBAAECggEAB3blAEV4KzhNjD3x8RLrqeWJC3e6eQlHyyFZSzQcPuw+\nS5DAgObz9fZIPdtoCpG8lgRC7B/Xf7v49sX8z06mm4G6Y0x0XPcJX5KJCdnwJBvZ\niEeIVU0g4Vv2Bo0EPM0NHuIaJKX+Ym3YIZT5FruaZe5fdPOb4gPdA0tL4nUwyo54\npajBeXm7hbwBhSuub0eGwQjm5RhE1o17jbmjtFTNmBpdCGoiHHerqn95mEpk8lXm\nm3ROUEu+oVYab3SyOgLgHwqsDBk+xpptQwBiTEaS6DsU99ms1yn1smRXTW4R75ZP\nRsG2jnLdJhj7Cjsrj1b5YwuSzeS/dOvdTVG64fagOQKBgQD/6WOF26icwIgZRggA\nmLF8/xhtA1mAcT3jwMgMWwGxrQKRONSXs5qgOKSjfWjvMYO4PUBy2BM0GGgDQUL3\nDm+t27nEcwMR43R5Zg19N2uFuGvv2Ko9YBjscD2Ree1Rh6qF7En+PDgBpooeq4cJ\n4eKSkdHzOvxhPtjFxBjeVUaV+QKBgQDM2YILcxWgwM5aiMkBQ7tXT9SlK3alpn0f\nJyN7QfUHX/o0le5qOLtov4SgIfdTCd5sEER3G4i2AJpxou5An9YWbajzBtckxaGN\nu2jUHt0nmKgcEN6cBVj3j+pWX+dqS6Qcs9idI37j7NUdT25vOS9Xt5ZtI3SHit32\ny5yI3O7tGwKBgFJWZz0ERaXZlHB9RcnbVw/ei59Xeo6G4ODMgBDpnwvpnG/ZFx2Q\nHen7D43CpeZ/yd+XZYsN1m/mgmC5uLAApxILJiP81ToGMs10dlaZZDDr+156GZwR\ntTMtkcGityaKPeVE9zGjcmmlib8AdTxKvzllTWWyzs0DCX/n7hBq44ERAoGAIEUT\na2JRweUdnL13jK9yz6pPwUU7h5TWmRW9TSlyxBqme6oyyKDvRO0Go4M2RuqDE1rs\nria0PpeRvN0B00RaoWXc+4vUUIKhlIY1WVUTWa1+rg0qREHDZhxRuhGZjvEjhTH/\nqaFx183zNI7SwsqrXpIZLFAthzylAr/IhPbo3IkCgYBsyrIK5ehQjuV2jFWcPCDV\naUrtAvDYqnQnJOZ48RR0u8fHFYlEimi8AatOU8TKGrYzobYjwWizYA3HI3dturLo\noFcQrcYaGWAKf6pcuh4jmzlddgfFaE6oz5XMKCweMjMhIf9w1m7ialOq0lXmF1eH\noDRJCi4HVSpnWm5hgQpDSg==\n-----END PRIVATE KEY-----\n',
  client_email: process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-fbsvc@ide-d0338.iam.gserviceaccount.com',
  client_id: process.env.FIREBASE_CLIENT_ID || '103117011241123148432',
  auth_uri: 'https://accounts.google.com/o/oauth2/auth',
  token_uri: 'https://oauth2.googleapis.com/token',
  auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL || 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40ide-d0338.iam.gserviceaccount.com',
};

try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
    });

    console.log('✅ Firebase initialized successfully');
  }
} catch (err) {
  console.error('⛔ Failed to initialize Firebase from env vars.');
  console.error(err);
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

export { admin, db, bucket };