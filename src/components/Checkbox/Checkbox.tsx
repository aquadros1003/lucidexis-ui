import React from 'react';
import './Checkbox.scss';

type CheckboxProps = {
  id?: string;
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
};

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  checked = false,
  onChange,
  disabled = false,
  className = '',
}) => {
  const inputId = id ?? `lx-checkbox-${Math.random().toString(36).slice(2, 9)}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.checked);
  };

  return (
    <label className={`lx-checkbox ${className} ${disabled ? 'lx-checkbox--disabled' : ''}`} htmlFor={inputId}>
      <input
        id={inputId}
        className="lx-checkbox__input"
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />

      <span className={`lx-checkbox__box ${checked ? 'is-checked' : ''}`} aria-hidden="true">
        <svg className="lx-checkbox__icon" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
          <path
            d="M20 6L9 17l-5-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>

      {label && <span className="lx-checkbox__label">{label}</span>}
    </label>
  );
};

export default Checkbox;
