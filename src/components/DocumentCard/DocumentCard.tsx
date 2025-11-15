import React from 'react';
import { useAuthContext } from '../../contexts';
import { Dropdown, type DropdownItem } from '../Dropdown';
import { downloadFile } from '../../utils/downloadFile';
import { formatRelativeDate } from '../../utils/dateFormatter';
import { DownloadIcon, MenuDotsIcon, TagIcon, CalendarIcon } from '../../assets/icons';
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
  downloadUrl: string;
  description: string;
  fileSize: string;
  status: DocumentStatus;
  type: DocumentType;
  tags: DocumentTag[];
  date: Date;
  authorName?: string;
  isArchived?: boolean;
  isFavorite?: boolean;
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
  downloadUrl,
  type,
  tags,
  date,
  onCardClick,
  onMenuClick,
}) => {
  const { token } = useAuthContext();

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(id);
    }
  };

  const handleDownload = async () => {
    try {
      await downloadFile(downloadUrl, title, token);
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  };

  const dropdownItems: DropdownItem[] = [
    {
      id: 'download',
      label: 'Download',
      icon: <DownloadIcon />,
      onClick: handleDownload,
    },
  ];

  const menuTrigger = (
    <button
      className="document-card__menu"
      onClick={(e) => {
        e.stopPropagation();
        if (onMenuClick) {
          onMenuClick(id);
        }
      }}
      aria-label="Document menu"
    >
      <MenuDotsIcon width="20" height="20" />
    </button>
  );

  return (
    <div className="document-card" onClick={handleCardClick}>
      <div className="document-card__header">
        <div className={`document-card__icon document-card__icon--${type}`}>
          <span className="document-card__icon-emoji">{getFileIcon(type)}</span>
        </div>
        <Dropdown trigger={menuTrigger} items={dropdownItems} position="bottom-right" />
      </div>

      <div className="document-card__content">
        <h3 className="document-card__title">{title}</h3>
        <p className="document-card__description">{description}</p>

        {tags.length > 0 && (
          <div className="document-card__tags">
            {tags.map((tag) => (
              <span key={tag.id} className="document-card__tag">
                <TagIcon width="14" height="14" />
                {tag.label}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="document-card__footer">
        <div className="document-card__date">
          <CalendarIcon width="16" height="16" />
          <span>{formatRelativeDate(date)}</span>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;
