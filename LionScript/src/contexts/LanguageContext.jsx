import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('ar'); // Default to Arabic as per requirement implied by "Jordanian IDE" or just choice. Let's start with 'ar' or 'en'? prompt said "Bilingual", usually 'en' is default but 'LionScript: برمج بقوة الأسد' is first. Let's default to 'en' for global appeal, or 'ar' if local. I'll default to 'en' to match the "clean" tech vibe initially, but make it persistent.
    // Actually, let's default to 'ar' since it's a "Jordanian IDE".

    useEffect(() => {
        document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = language;
    }, [language]);

    const t = translations[language];

    const toggleLanguage = () => {
        setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
