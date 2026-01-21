import express from 'express';
import {
  createUser,
  loginUser,
  getUser,
  updateUser,
  updateCode,
  uploadProfileImage,
  deleteUser
} from '../controllers/userController.js';

const router = express.Router();

// تسجيل الدخول
router.post('/login', loginUser);

// إنشاء حساب جديد
router.post('/:userId', createUser);

// الحصول على بيانات المستخدم
router.get('/:userId', getUser);

// تحديث بيانات المستخدم (الاسم، الوصف، اللون، اللغة)
router.patch('/:userId', updateUser);

// تحديث الكود فقط
router.patch('/:userId/code', updateCode);

// رفع صورة البروفايل
router.post('/:userId/upload-image', uploadProfileImage);

// حذف المستخدم
router.delete('/:userId', deleteUser);

export default router;