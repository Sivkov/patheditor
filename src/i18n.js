import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from './translations/ru.js' 

const settedLang  = localStorage.getItem('lng') || 'en'

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {       
      },
    },
    ru: {
      translation: ru
    }
  },
  lng: settedLang, // Язык по умолчанию
  fallbackLng: 'en', // Язык, если перевод не найден
  interpolation: {
    escapeValue: false, // Не экранировать HTML
  },
});

export default i18n;