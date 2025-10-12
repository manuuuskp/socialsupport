import { useTranslation } from "react-i18next";
import LanguageSwitch from "./LanguageSwitch";

const Header = () => {
    
    const {t} = useTranslation();

    return (
        <div className="h-16 flex items-center px-3 py-2 sm:px-4 sm:py-3 justify-between">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 truncate">{t('app.title')}</h1>
            <LanguageSwitch />
        </div>
    )
}

export default Header;