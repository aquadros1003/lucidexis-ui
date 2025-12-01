import React from 'react';
import { useTranslation } from 'react-i18next';
import './LanguageSelect.scss';

const languages = [
  { code: 'en', label: '🇬🇧' },
  { code: 'pl', label: '🇵🇱' },
];

export const LanguageSelect: React.FC = () => {
  const { i18n } = useTranslation();
  const current = i18n.language;
  const next = current === 'pl' ? 'en' : 'pl';
  const nextLabel = languages.find((l) => l.code === next)?.label;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    i18n.changeLanguage(next);
  };

  return (
    <button className="language-select__dropdown-btn" onClick={handleClick} title={next} type="button">
      {nextLabel}
    </button>
  );
};
