import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config();

let serviceAccount;

try {
  const raw = readFileSync('./serviceAccountKey.json', 'utf8');
  const cleaned = raw.replace(/^\uFEFF/, ''); // إزالة BOM إن وجد
  serviceAccount = JSON.parse(cleaned);
} catch (err) {
  console.error('⛔ Failed to load Firebase service account JSON.');
  console.error('Make sure ./serviceAccountKey.json exists and is valid JSON.');
  console.error(err);
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

export { admin, db, bucket };