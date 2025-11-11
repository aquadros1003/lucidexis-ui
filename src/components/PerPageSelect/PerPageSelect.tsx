import { useState, useRef, useEffect } from 'react';
import './PerPageSelect.scss';

interface PerPageSelectProps {
  value: number;
  onChange: (value: number) => void;
  options?: number[];
}

const DEFAULT_OPTIONS = [10, 20, 30, 40];

const PerPageSelect = ({ value, onChange, options = DEFAULT_OPTIONS }: PerPageSelectProps) => {
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
      <button
        className="per-page-select__trigger"
        onClick={() => setIsOpen(!isOpen)}
        type="button"
      >
        <span className="per-page-select__value">{value} per page</span>
        <svg
          className={`per-page-select__arrow ${isOpen ? 'per-page-select__arrow--open' : ''}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.5 4.5L6 8L9.5 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
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
              {option} per page
              {option === value && (
                <svg
                  className="per-page-select__check"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.5 4L6 11.5L2.5 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
          <div className="per-page-select__divider" />
          <button
            className={`per-page-select__option ${!options.includes(value) ? 'per-page-select__option--active' : ''}`}
            onClick={() => handleSelect(value)}
            type="button"
          >
            Show all
          </button>
        </div>
      )}
    </div>
  );
};

export default PerPageSelect;
