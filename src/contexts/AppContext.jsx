import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();
const API_URL = 'http://localhost:3001/api';

export const AppProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');
    const [themeMode, setThemeMode] = useState('deepBlue');
    const [loading, setLoading] = useState(true);

    // جلب الإعدادات من Firebase عند تحميل التطبيق
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const userData = localStorage.getItem('userData');
                if (!userData) {
                    setLoading(false);
                    return;
                }

                const user = JSON.parse(userData);
                if (!user.email) {
                    setLoading(false);
                    return;
                }

                const userId = user.email.replace(/[@.]/g, '_');
                const response = await fetch(`${API_URL}/users/${userId}`);

                if (response.ok) {
                    const result = await response.json();
                    if (result.success && result.data) {
                        // تحديث اللغة
                        setLanguage(result.data.language || 'en');
                        
                        // تحديث الثيم
                      // في useEffect اللي يجلب الإعدادات
const savedColor = result.data.themeColor;
if (savedColor) {
    const themeMap = {
        '#007FFF': 'deepBlue',
        '#FF0055': 'cyberRed',
        '#00FF99': 'neonGreen',
        '#B026FF': 'voidPurple',
        '#FFD700': 'goldenEra',
    };
    setThemeMode(themeMap[savedColor] || 'deepBlue');
}
                        console.log('✅ تم جلب الإعدادات:', {
                            language: result.data.language,
                            themeColor: result.data.themeColor
                        });
                    }
                }
            } catch (err) {
                console.error('❌ خطأ في جلب الإعدادات:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
    };

    const changeTheme = (newTheme) => {
        setThemeMode(newTheme);
    };

   const t = (key) => {
    const translations = {
        ar: {
            // الإعدادات
            'settings.title': 'الإعدادات',
            'settings.lang': 'لغة النظام',
            'settings.theme': 'ثيم الواجهة',
            'settings.themeDesc': 'اختر الواجهة المرئية. التغييرات تطبق فوراً.',
            
            // القائمة
            'selectPath': 'اختر المسار',
            'network': 'الشبكة',
            'files': 'الملفات',
            'profile': 'الملف الشخصي',
            'settings': 'الإعدادات',
            
            // المسارات
            'path.title': 'اختر مسارك',
            'path.subtitle': 'اختر تخصصاً لتبدأ تدريبك.',
            'path.missions': 'المهمات',
            'path.intro_js.title': 'مقدمة في JS',
            'path.intro_js.desc': 'المتغيرات، الأنواع، وبناء الجمل الأساسية.',
            'path.control_flow.title': 'التحكم في التدفق',
            'path.control_flow.desc': 'الجمل الشرطية، الحلقات، وجمل التبديل.',
            'path.data_structures.title': 'هياكل البيانات',
            'path.data_structures.desc': 'المصفوفات، الكائنات، الخرائط، والمجموعات.',
            'path.functions_scope.title': 'الدوال والنطاق',
            'path.functions_scope.desc': 'الدوال السهمية، الإغلاقات، والمزيد.',
        },
        en: {
            // Settings
            'settings.title': 'SETTINGS',
            'settings.lang': 'System Language',
            'settings.theme': 'Interface Theme',
            'settings.themeDesc': 'Select your visual interface. Changes apply immediately.',
            
            // Navigation
            'selectPath': 'Select Path',
            'network': 'Network',
            'files': 'Files',
            'profile': 'Profile',
            'settings': 'Settings',
            
            // Paths
            'path.title': 'SELECT YOUR PATH',
            'path.subtitle': 'Choose a specialization to begin your training, Agent.',
            'path.missions': 'Missions',
            'path.intro_js.title': 'Introduction to JS',
            'path.intro_js.desc': 'Variables, Types, and Basic Syntax.',
            'path.control_flow.title': 'Control Flow',
            'path.control_flow.desc': 'Conditionals, Loops, and Switch statements.',
            'path.data_structures.title': 'Data Structures',
            'path.data_structures.desc': 'Arrays, Objects, Maps, and Sets.',
            'path.functions_scope.title': 'Functions & Scope',
            'path.functions_scope.desc': 'Arrow functions, Closures, and more.',
        }
    };

    return translations[language]?.[key] || key;
};
    return (
        <AppContext.Provider value={{ 
            language, 
            toggleLanguage, 
            themeMode, 
            changeTheme, 
            t,
            loading 
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = () => useContext(AppContext);