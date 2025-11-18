import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入翻译资源
import translationZH from './locales/zh.json';
import translationEN from './locales/en.json';

// 翻译资源
const resources = {
  zh: {
    translation: translationZH,
  },
  en: {
    translation: translationEN,
  },
};

i18n
  // 检测用户语言
  .use(LanguageDetector)
  // 将 i18n 实例传递给 react-i18next
  .use(initReactI18next)
  // 初始化 i18next
  .init({
    resources,
    fallbackLng: 'zh', // 默认语言
    debug: false, // 开发环境可设为 true

    interpolation: {
      escapeValue: false, // React 已经安全处理了
    },

    detection: {
      // 检测顺序
      order: ['localStorage', 'navigator', 'htmlTag'],
      // 缓存用户语言
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

export default i18n;
