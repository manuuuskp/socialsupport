import { useTranslation } from 'react-i18next';

const LanguageSwitch = () => {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <div>
      <button
        onClick={toggleLanguage}
        aria-label={`Switch to ${i18n.language === 'en' ? 'Arabic' : 'English'}`}
        className="items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {t('language.switch')}
      </button>
    </div>
  );
};

export default LanguageSwitch;
