import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import ar from './ar.json';
import { RTL_LANG_LIST } from '../utils/constants/constants';

const resources = {
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
};

i18n.dir = (lang = i18n.language) => (RTL_LANG_LIST.includes(lang) ? 'rtl': 'ltr')

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    react: {
      useSuspense: false,
    },
  });

export default i18n;