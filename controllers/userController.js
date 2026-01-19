import { admin, db, bucket } from '../config/firebase.js';
import multer from 'multer';
import path from 'path';

// إعداد رفع الصور
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('الصور فقط مسموحة!'));
  }
}).single('profileImage');

// إنشاء أو تحديث بيانات المستخدم
export const createOrUpdateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, description, themeColor, language, code } = req.body;

    const userData = {
      name: name || '',
      description: description || '',
      themeColor: themeColor || '#2196F3',
      language: language || 'ar',
      code: code || '',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    // إذا كان مستخدم جديد
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      userData.createdAt = admin.firestore.FieldValue.serverTimestamp();
      userData.profileImage = '';
    }

    await db.collection('users').doc(userId).set(userData, { merge: true });

    res.json({ 
      success: true, 
      message: 'تم حفظ البيانات بنجاح ✅',
      data: userData 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// رفع صورة المستخدم
export const uploadProfileImage = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ success: false, error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'لم يتم اختيار صورة' });
    }

    try {
      const { userId } = req.params;
      const file = req.file;
      
      const fileName = `profile-images/${userId}/${Date.now()}_${file.originalname}`;
      const fileUpload = bucket.file(fileName);

      await fileUpload.save(file.buffer, {
        metadata: { contentType: file.mimetype },
        public: true
      });

      const imageUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      await db.collection('users').doc(userId).update({
        profileImage: imageUrl,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      res.json({ 
        success: true, 
        message: 'تم رفع الصورة بنجاح ✅',
        imageUrl 
      });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
};

// الحصول على بيانات المستخدم
export const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const userDoc = await db.collection('users').doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ 
        success: false, 
        error: 'المستخدم غير موجود ❌' 
      });
    }

    res.json({ 
      success: true, 
      data: userDoc.data() 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// تحديث الكود فقط
export const updateCode = async (req, res) => {
  try {
    const { userId } = req.params;
    const { code } = req.body;

    await db.collection('users').doc(userId).update({
      code: code || '',
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ 
      success: true, 
      message: 'تم حفظ الكود بنجاح ✅' 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// تحديث أي حقل
export const updateUserField = async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    updates.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await db.collection('users').doc(userId).update(updates);

    res.json({ 
      success: true, 
      message: 'تم التحديث بنجاح ✅' 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// حذف المستخدم
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    await db.collection('users').doc(userId).delete();

    res.json({ 
      success: true, 
      message: 'تم حذف المستخدم بنجاح ✅' 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
