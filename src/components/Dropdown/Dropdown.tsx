import React, { useState, useRef, useEffect } from 'react';
import type { ReactNode } from 'react';
import './Dropdown.scss';

export interface DropdownItem {
  id: string;
  label: string;
  icon?: ReactNode;
  variant?: 'default' | 'danger';
  onClick: () => void;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export function Dropdown({ trigger, items, position = 'bottom-right', className = '', size }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  const handleItemClick = (e: React.MouseEvent, item: DropdownItem) => {
    e.stopPropagation();
    setIsOpen(false);
    item.onClick();
  };

  const triggerElement = React.isValidElement(trigger)
    ? React.cloneElement(
        trigger as React.ReactElement<{
          onClick?: (e: React.MouseEvent) => void;
        }>,
        {
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            const originalOnClick = (
              trigger as React.ReactElement<{
                onClick?: (e: React.MouseEvent) => void;
              }>
            ).props?.onClick;
            if (originalOnClick) {
              originalOnClick(e);
            }
            setIsOpen(!isOpen);
          },
        },
      )
    : trigger;

  return (
    <div className={`dropdown ${className}`} ref={dropdownRef}>
      {triggerElement}

      {isOpen && (
        <div className={`dropdown__menu dropdown__menu--${position}` + (size ? ` dropdown__menu--${size}` : '')}>
          {items.map((item) => (
            <button
              key={item.id}
              className={`dropdown__item ${item.variant === 'danger' ? 'dropdown__item--danger' : ''} ${
                size ? `dropdown__item--${size}` : ''
              }`}
              onClick={(e) => handleItemClick(e, item)}
            >
              {item.icon && <span className="dropdown__item-icon">{item.icon}</span>}
              <span className="dropdown__item-label">{item.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
