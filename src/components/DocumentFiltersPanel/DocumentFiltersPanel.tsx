import React, { useMemo, useState } from 'react';
import Checkbox from '../Checkbox';
import './DocumentFiltersPanel.scss';

type DocumentFiltersProps = {
  onClose?: () => void;
  onApply?: (selected: string[]) => void;
  initial?: string[];
};

const DEFAULT_CATEGORIES = ['Technical', 'Marketing', 'Sales', 'HR', 'Finance', 'Legal', 'Product'];

const DocumentFiltersPanel: React.FC<DocumentFiltersProps> = ({ onClose, onApply, initial = [] }) => {
  const [selected, setSelected] = useState<Set<string>>(() => new Set(initial));

  const categories = useMemo(() => DEFAULT_CATEGORIES, []);

  const toggle = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const clear = () => setSelected(new Set());

  const apply = () => onApply?.(Array.from(selected));

  return (
    <div className="filters">
      <div className="filters__header">
        <div>
          <h3 className="filters__title">Advanced Filters</h3>
          <p className="filters__subtitle">Refine your search with advanced filtering options</p>
        </div>

        <button className="filters__close" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>

      <div className="filters__body">
        <h4 className="filters__section-title">Categories</h4>

        <div className="filters__list">
          {categories.map((c) => (
            <div className="filters__item" key={c}>
              <Checkbox label={c} checked={selected.has(c)} onChange={() => toggle(c)} />
            </div>
          ))}
        </div>
      </div>

      <div className="filters__footer">
        <button className="filters__btn filters__btn--ghost" onClick={clear} type="button">
          Clear
        </button>

        <button className="filters__btn filters__btn--primary" onClick={apply} type="button">
          Apply
        </button>
      </div>
    </div>
  );
};

export default DocumentFiltersPanel;
