import { useTranslation } from 'react-i18next';

const LanguageSwitch = () => {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);

    const dir = i18n.dir(newLang);
    const htmlElement = document.documentElement;
    htmlElement.setAttribute('dir', dir);
    htmlElement.setAttribute('lang', newLang);
  };

  return (
    <div className="flex items-center">
      <button
        onClick={toggleLanguage}
        aria-label={`Switch to ${i18n.language === 'en' ? 'Arabic' : 'English'}`}
        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
          />
        </svg>
        {t('language.switch')}
      </button>
    </div>
  );
};

export default LanguageSwitch;
