import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, CheckIcon } from '../../assets/icons';
import { useTranslation } from 'react-i18next';
import './PerPageSelect.scss';

interface PerPageSelectProps {
  value: number;
  onChange: (value: number) => void;
  options?: number[];
}

const DEFAULT_OPTIONS = [10, 20, 30, 40];

const PerPageSelect = ({ value, onChange, options = DEFAULT_OPTIONS }: PerPageSelectProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (option: number) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="per-page-select" ref={selectRef}>
      <button className="per-page-select__trigger" onClick={() => setIsOpen(!isOpen)} type="button">
        <span className="per-page-select__value">{t('perPageSelect.option', { count: value })}</span>
        <ChevronDownIcon
          className={`per-page-select__arrow ${isOpen ? 'per-page-select__arrow--open' : ''}`}
          width="12"
          height="12"
        />
      </button>

      {isOpen && (
        <div className="per-page-select__menu">
          {options.map((option) => (
            <button
              key={option}
              className={`per-page-select__option ${option === value ? 'per-page-select__option--active' : ''}`}
              onClick={() => handleSelect(option)}
              type="button"
            >
              {t('perPageSelect.option', { count: option })}
              {option === value && <CheckIcon className="per-page-select__check" width="16" height="16" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default PerPageSelect;
