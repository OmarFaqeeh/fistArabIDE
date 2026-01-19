const API_URL = 'http://localhost:3001/api';

// جلب بيانات المستخدم من Firebase
export const getUserData = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`);
    if (!response.ok) throw new Error('فشل جلب البيانات');
    return await response.json();
  } catch (error) {
    console.error('خطأ في جلب بيانات المستخدم:', error);
    throw error;
  }
};