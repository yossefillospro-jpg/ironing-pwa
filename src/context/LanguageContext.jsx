import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, t as translate } from '../utils/translations';

const LanguageContext = createContext();

const STORAGE_KEY = 'ironing-app-language';

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    // Load from localStorage or default to Hebrew
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved || 'he';
  });

  // Persist language choice
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    
    // Update document direction and lang attribute
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
  }, [language]);

  // Translation helper
  const t = (key, params = {}) => {
    return translate(translations, language, key, params);
  };

  // Check if current language is RTL
  const isRTL = language === 'he';

  const value = {
    language,
    setLanguage,
    t,
    isRTL,
    languages: [
      { code: 'he', name: 'עברית', dir: 'rtl' },
      { code: 'fr', name: 'Français', dir: 'ltr' }
    ]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;
