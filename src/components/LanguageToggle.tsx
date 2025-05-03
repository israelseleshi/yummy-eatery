import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const LanguageToggle: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'am' : 'en';
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === 'am' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center text-neutral-900 hover:text-primary-500 transition-colors"
      aria-label={`Switch to ${i18n.language === 'en' ? 'Amharic' : 'English'}`}
    >
      <Globe className="h-5 w-5" />
      <span className="ml-2 font-medium">
        {i18n.language === 'en' ? 'አማርኛ' : 'English'}
      </span>
    </button>
  );
};

export default LanguageToggle;