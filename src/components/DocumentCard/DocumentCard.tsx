import React from 'react';
import './DocumentCard.scss';

export type DocumentStatus = 'active' | 'draft' | 'archived';
export type DocumentType = 'pdf' | 'doc' | 'sheet' | 'other';

export interface DocumentTag {
  id: string;
  label: string;
}

export interface DocumentCardProps {
  id: string;
  title: string;
  description: string;
  status: DocumentStatus;
  type: DocumentType;
  tags: DocumentTag[];
  date: string;
  onCardClick?: (id: string) => void;
  onMenuClick?: (id: string) => void;
}

const getFileIcon = (type: DocumentType): string => {
  const icons = {
    pdf: '📄',
    doc: '📘',
    sheet: '📊',
    other: '📋',
  };
  return icons[type] || icons.other;
};

const DocumentCard: React.FC<DocumentCardProps> = ({
  id,
  title,
  description,
  type,
  tags,
  date,
  onCardClick,
  onMenuClick,
}) => {
  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(id);
    }
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMenuClick) {
      onMenuClick(id);
    }
  };

  return (
    <div className="document-card" onClick={handleCardClick}>
      <div className="document-card__header">
        <div className={`document-card__icon document-card__icon--${type}`}>
          <span className="document-card__icon-emoji">{getFileIcon(type)}</span>
        </div>
        <button
          className="document-card__menu"
          onClick={handleMenuClick}
          aria-label="Więcej opcji"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="10" cy="4" r="1.5" fill="currentColor" />
            <circle cx="10" cy="10" r="1.5" fill="currentColor" />
            <circle cx="10" cy="16" r="1.5" fill="currentColor" />
          </svg>
        </button>
      </div>

      <div className="document-card__content">
        <h3 className="document-card__title">{title}</h3>
        <p className="document-card__description">{description}</p>

        {tags.length > 0 && (
          <div className="document-card__tags">
            {tags.map((tag) => (
              <span key={tag.id} className="document-card__tag">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.333 7.583L6.125 11.375a.583.583 0 00.825 0l4.375-4.375a.583.583 0 000-.825L7.533 2.383a.583.583 0 00-.825 0L2.333 6.758a.583.583 0 000 .825z"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="5.25" cy="5.25" r="0.583" fill="currentColor" />
                </svg>
                {tag.label}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="document-card__footer">
        <div className="document-card__date">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="2"
              y="3"
              width="12"
              height="11"
              rx="1.5"
              stroke="currentColor"
              strokeWidth="1.2"
            />
            <path
              d="M5 1.5v2M11 1.5v2M2 6h12"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
          <span>{date}</span>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
