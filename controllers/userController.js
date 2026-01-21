import { admin, db, bucket } from '../config/firebase.js';
import multer from 'multer';
import path from 'path';
import bcrypt from 'bcrypt';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 },
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

// التحقق من تكرار الاسم أو البريد
export const checkDuplicateUser = async (name, email, excludeUserId = null) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    
    for (const doc of usersSnapshot.docs) {
      if (excludeUserId && doc.id === excludeUserId) continue;
      
      const userData = doc.data();
      
      if (userData.name && name && userData.name.toLowerCase() === name.toLowerCase()) {
        return { exists: true, field: 'name' };
      }
      
      if (userData.email && email && userData.email.toLowerCase() === email.toLowerCase()) {
        return { exists: true, field: 'email' };
      }
    }
    
    return { exists: false };
  } catch (error) {
    console.error('❌ خطأ في التحقق:', error);
    throw error;
  }
};

// إنشاء حساب جديد
export const createUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, description, themeColor, language, code, email, password } = req.body;

    console.log('📝 طلب إنشاء حساب جديد:', { userId, name, email });

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'الرجاء إدخال جميع البيانات المطلوبة (الاسم، البريد، كلمة المرور)'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'
      });
    }

    const userDoc = await db.collection('users').doc(userId).get();
    if (userDoc.exists) {
      return res.status(400).json({
        success: false,
        error: 'هذا المستخدم موجود بالفعل'
      });
    }

    const duplicate = await checkDuplicateUser(name, email);
    
    if (duplicate.exists) {
      console.log('❌ بيانات مكررة:', duplicate.field);
      
      const errorMessage = duplicate.field === 'name' 
        ? 'هذا الاسم مستخدم من قبل شخص آخر'
        : 'هذا البريد الإلكتروني مسجل مسبقاً';
      
      return res.status(400).json({
        success: false,
        error: errorMessage
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      name: name.trim(),
      description: description || 'LionScript Developer',
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      themeColor: themeColor || '#007FFF',
      language: language || 'en',
      code: code || '// Welcome to LionScript!\nconsole.log("Hello, World!");',
      profileImage: '',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await db.collection('users').doc(userId).set(userData);

    console.log('✅ تم إنشاء المستخدم بنجاح:', userId);

    const { password: _, ...userDataWithoutPassword } = userData;

    res.json({ 
      success: true, 
      message: 'تم إنشاء الحساب بنجاح ✅',
      data: { ...userDataWithoutPassword, id: userId }
    });
  } catch (error) {
    console.error('❌ خطأ في createUser:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// تسجيل الدخول
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔍 محاولة تسجيل دخول للبريد:', email);

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'الرجاء إدخال البريد الإلكتروني وكلمة المرور'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    const usersSnapshot = await db.collection('users').get();
    
    console.log(`📊 عدد المستخدمين في قاعدة البيانات: ${usersSnapshot.size}`);
    
    let foundUser = null;
    let foundUserId = null;

    for (const doc of usersSnapshot.docs) {
      const userData = doc.data();
      const userEmail = userData.email ? userData.email.toLowerCase().trim() : '';
      
      if (userEmail === cleanEmail) {
        const isPasswordValid = await bcrypt.compare(password, userData.password);
        
        if (isPasswordValid) {
          foundUser = userData;
          foundUserId = doc.id;
          console.log('✅ تم العثور على المستخدم:', userData.name);
          break;
        }
      }
    }

    if (!foundUser) {
      console.log('❌ البريد أو كلمة المرور غير صحيحة');
      return res.status(401).json({ 
        success: false, 
        error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
      });
    }

    const { password: _, ...userDataWithoutPassword } = foundUser;

    res.json({ 
      success: true, 
      message: 'تم تسجيل الدخول بنجاح ✅',
      data: { ...userDataWithoutPassword, id: foundUserId }
    });
  } catch (error) {
    console.error('❌ خطأ في loginUser:', error);
    res.status(500).json({ 
      success: false, 
      error: 'حدث خطأ في السيرفر، حاول مرة أخرى'
    });
  }
};

// رفع صورة البروفايل
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
      console.error('❌ خطأ في رفع الصورة:', error);
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

    const userData = userDoc.data();
    const { password: _, ...userDataWithoutPassword } = userData;

    res.json({ 
      success: true, 
      data: { ...userDataWithoutPassword, id: userId }
    });
  } catch (error) {
    console.error('❌ خطأ في getUser:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// تحديث بيانات المستخدم
export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, description, themeColor, language } = req.body;

    const updateData = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    if (name) {
      const duplicate = await checkDuplicateUser(name, null, userId);
      if (duplicate.exists && duplicate.field === 'name') {
        return res.status(400).json({
          success: false,
          error: 'هذا الاسم مستخدم من قبل شخص آخر'
        });
      }
      updateData.name = name.trim();
    }
    
    if (description) updateData.description = description;
    if (themeColor) updateData.themeColor = themeColor;
    if (language) updateData.language = language;
    
    await db.collection('users').doc(userId).update(updateData);
    
    const updatedDoc = await db.collection('users').doc(userId).get();
    const userData = updatedDoc.data();
    const { password: _, ...userDataWithoutPassword } = userData;
    
    res.json({ 
      success: true, 
      message: 'تم تحديث البيانات بنجاح ✅',
      data: { ...userDataWithoutPassword, id: userId }
    });
  } catch (error) {
    console.error('❌ خطأ في updateUser:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// تحديث الكود
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
    console.error('❌ خطأ في updateCode:', error);
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
    console.error('❌ خطأ في deleteUser:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};