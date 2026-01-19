import express from 'express';
import {
  createOrUpdateUser,
  uploadProfileImage,
  getUser,
  updateCode,
  updateUserField,
  deleteUser
} from '../controllers/userController.js';

const router = express.Router();

// إنشاء/تحديث بيانات المستخدم
router.post('/:userId', createOrUpdateUser);

// رفع صورة
router.post('/:userId/upload-image', uploadProfileImage);

// الحصول على بيانات المستخدم
router.get('/:userId', getUser);

// تحديث الكود
router.patch('/:userId/code', updateCode);

// تحديث أي حقل
router.patch('/:userId', updateUserField);

// حذف المستخدم
router.delete('/:userId', deleteUser);

export default router;