import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Language,
  translations,
  defaultLanguage,
  getSavedLanguage,
  saveLanguage,
  getTranslation
} from '../i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  useEffect(() => {
    // Load saved language on mount
    const savedLanguage = getSavedLanguage();
    setLanguageState(savedLanguage);
  }, []);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    saveLanguage(newLanguage);
    
    // Update document language attribute
    document.documentElement.lang = newLanguage;
    
    // Update document direction (if needed for RTL languages)
    // Ukrainian and English are both LTR, but this is here for future expansion
    document.documentElement.dir = 'ltr';
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    return getTranslation(translations[language], key, params);
  };

  // Check if current language is RTL (Right-to-Left)
  const isRTL = false; // Ukrainian and English are both LTR

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    isRTL
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

// Hook for easier translation access
export const useTranslation = () => {
  const { t } = useLanguage();
  return { t };
};
