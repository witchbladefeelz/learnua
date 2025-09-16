import { uk } from './locales/uk';
import { en } from './locales/en';

export type Language = 'uk' | 'en';

export const translations = {
  uk,
  en
};

export type TranslationKey = keyof typeof uk;
export type NestedTranslationKey<T> = T extends object 
  ? { [K in keyof T]: K extends string 
      ? T[K] extends object 
        ? `${K}.${NestedTranslationKey<T[K]>}` 
        : K 
      : never 
    }[keyof T]
  : never;

export type TranslationPath = NestedTranslationKey<typeof uk>;

export const supportedLanguages: { code: Language; name: string; flag: string }[] = [
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'en', name: 'English', flag: '🇺🇸' }
];

export const defaultLanguage: Language = 'uk';

// Get translation value by path (e.g., 'auth.login')
export const getTranslation = (
  translations: typeof uk,
  path: string,
  params?: Record<string, string | number>
): string => {
  const keys = path.split('.');
  let value: any = translations;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return path; // Return path if translation not found
    }
  }
  
  if (typeof value !== 'string') {
    return path;
  }
  
  // Replace parameters {param} with actual values
  if (params) {
    return Object.entries(params).reduce((text, [key, val]) => {
      return text.replace(new RegExp(`\\{${key}\\}`, 'g'), String(val));
    }, value);
  }
  
  return value;
};

// Get browser language preference
export const getBrowserLanguage = (): Language => {
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('uk')) return 'uk';
  if (browserLang.startsWith('en')) return 'en';
  return defaultLanguage;
};

// Get saved language from localStorage
export const getSavedLanguage = (): Language => {
  const saved = localStorage.getItem('language') as Language;
  return saved && supportedLanguages.find(l => l.code === saved) ? saved : getBrowserLanguage();
};

// Save language to localStorage
export const saveLanguage = (language: Language): void => {
  localStorage.setItem('language', language);
};
