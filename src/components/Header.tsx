import { useTranslation } from "react-i18next";
import LanguageSwitch from "./LanguageSwitch";

const Header = () => {
    
    const {t} = useTranslation();

    return (
        <div className="h-16 flex items-center p-4 border-gray-300 border-b justify-between">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{t('app.title')}</h1>
            <LanguageSwitch />
        </div>
    )
}

export default Header;