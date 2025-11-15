import React, { useState, useRef, useEffect } from 'react';
import { useAuthContext } from '../../contexts';
import { downloadFile } from '../../utils/downloadFile';
import { updateDocument } from '../../api/documents';
import { formatFullDate } from '../../utils/dateFormatter';
import type { DocumentCardProps } from '../DocumentCard/DocumentCard';
import {
  DocumentIcon,
  CloseIcon,
  StarIcon,
  DownloadIcon,
  ArchiveIcon,
  UnarchiveIcon,
  TrashIcon,
  FileTypeIcon,
  UserIcon,
  CalendarIcon,
  FileSizeIcon,
  TagIcon,
  ClockIcon,
} from '../../assets/icons';
import './DocumentPreview.scss';

interface DocumentPreviewProps {
  document: DocumentCardProps;
  onClose: () => void;
  onArchive?: (id: string, isArchived: boolean) => void;
  onFavorite?: (id: string, isFavorite: boolean) => void;
  onDelete?: (id: string) => void;
  onDescriptionUpdate?: (id: string, description: string) => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  document,
  onClose,
  onArchive,
  onFavorite,
  onDelete,
  onDescriptionUpdate,
}) => {
  const { token } = useAuthContext();
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(document.description);
  const [isSaving, setIsSaving] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditedDescription(document.description);
  }, [document.description]);

  useEffect(() => {
    if (isEditingDescription && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditingDescription]);

  const handleDownload = async () => {
    try {
      await downloadFile(document.downloadUrl, document.title, token);
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  };

  const handleArchive = () => {
    if (onArchive) {
      onArchive(document.id, document.isArchived || false);
    }
  };

  const handleFavorite = () => {
    if (onFavorite) {
      onFavorite(document.id, document.isFavorite || false);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(document.id);
    }
  };

  const handleDescriptionDoubleClick = () => {
    setIsEditingDescription(true);
  };

  const handleDescriptionSave = async () => {
    if (editedDescription === document.description) {
      setIsEditingDescription(false);
      return;
    }

    setIsSaving(true);
    try {
      await updateDocument(document.id, { description: editedDescription });
      if (onDescriptionUpdate) {
        onDescriptionUpdate(document.id, editedDescription);
      }
      setIsEditingDescription(false);
    } catch (error) {
      console.error('Failed to update description:', error);
      alert(error instanceof Error ? error.message : 'Failed to update description');
      setEditedDescription(document.description);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDescriptionCancel = () => {
    setEditedDescription(document.description);
    setIsEditingDescription(false);
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleDescriptionSave();
    } else if (e.key === 'Escape') {
      handleDescriptionCancel();
    }
  };

  const fileType = document.type === 'pdf' ? 'DOCX' : document.type.toUpperCase();
  const fileSize = document.fileSize;
  const author = document.authorName || 'Unknown Author';
  const category = 'Technical';
  const createdDate = formatFullDate(document.date);
  const lastModified = formatFullDate(document.date);

  return (
    <div className="document-preview">
      <div className="document-preview__header">
          <div className="document-preview__header-content">
            <div className="document-preview__icon">
              <DocumentIcon width="24" height="24" />
            </div>
            <div className="document-preview__header-info">
              <h2 className="document-preview__title">{document.title}</h2>
            </div>
          </div>
          <button 
            className="document-preview__close" 
            onClick={onClose}
            aria-label="Close preview"
          >
            <CloseIcon width="24" height="24" />
          </button>
        </div>

        <div className="document-preview__actions">
          <button 
            className={`document-preview__action-btn ${document.isFavorite ? 'document-preview__action-btn--favorite' : ''}`}
            onClick={handleFavorite}
            aria-label={document.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            style={{
              '--star-fill': document.isFavorite ? '#FFD700' : 'none',
              '--star-stroke': document.isFavorite ? '#FFD700' : 'currentColor',
            } as React.CSSProperties}
          >
            <StarIcon
              width="16"
              height="16"
            />
          </button>
          <button 
            className="document-preview__action-btn"
            onClick={handleDownload}
          >
            <DownloadIcon width="16" height="16" />
            Download
          </button>
          <button 
            className="document-preview__action-btn"
            onClick={handleArchive}
          >
            {document.isArchived ? (
              <>
                <UnarchiveIcon width="16" height="16" />
                Unarchive
              </>
            ) : (
              <>
                <ArchiveIcon width="16" height="16" />
                Archive
              </>
            )}
          </button>
          <button 
            className="document-preview__action-btn document-preview__action-btn--danger"
            onClick={handleDelete}
          >
            <TrashIcon width="16" height="16" />
            Delete
          </button>
        </div>
        <div className="document-preview__content">
        <div className="document-preview__tabs">
          <button className="document-preview__tab document-preview__tab--active">
            Details
          </button>
          <button className="document-preview__tab">
            Preview
          </button>
        </div>
          <section className="document-preview__section">
            <h3 className="document-preview__section-title">Description</h3>
            {isEditingDescription ? (
              <div className="document-preview__description-editor">
                <textarea
                  ref={textareaRef}
                  className="document-preview__description-textarea"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  onKeyDown={handleDescriptionKeyDown}
                  rows={4}
                  disabled={isSaving}
                />
                <div className="document-preview__description-actions">
                  <button
                    className="document-preview__description-btn document-preview__description-btn--save"
                    onClick={handleDescriptionSave}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    className="document-preview__description-btn document-preview__description-btn--cancel"
                    onClick={handleDescriptionCancel}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p 
                className="document-preview__description document-preview__description--editable"
                onDoubleClick={handleDescriptionDoubleClick}
                title="Double-click to edit"
              >
                {document.description || 'No description. Double-click to add one.'}
              </p>
            )}
          </section>

          <section className="document-preview__section">
            <div className="document-preview__info-row">
              <div className="document-preview__info-col">
                <div className="document-preview__info-item">
                  <FileTypeIcon width="16" height="16" />
                  <div>
                    <div className="document-preview__info-label">File Type</div>
                    <div className="document-preview__info-value">{fileType}</div>
                  </div>
                </div>

                <div className="document-preview__info-item">
                  <UserIcon width="16" height="16" />
                  <div>
                    <div className="document-preview__info-label">Author</div>
                    <div className="document-preview__info-value">{author}</div>
                  </div>
                </div>

                <div className="document-preview__info-item">
                  <CalendarIcon width="16" height="16" />
                  <div>
                    <div className="document-preview__info-label">Created Date</div>
                    <div className="document-preview__info-value">{createdDate}</div>
                  </div>
                </div>
              </div>

              <div className="document-preview__info-col">
                <div className="document-preview__info-item">
                  <FileSizeIcon width="16" height="16" />
                  <div>
                    <div className="document-preview__info-label">File Size</div>
                    <div className="document-preview__info-value">{fileSize}</div>
                  </div>
                </div>

                <div className="document-preview__info-item">
                  <TagIcon width="16" height="16" />
                  <div>
                    <div className="document-preview__info-label">Category</div>
                    <div className="document-preview__info-value">
                      <span className="category-badge">{category}</span>
                    </div>
                  </div>
                </div>

                <div className="document-preview__info-item">
                  <ClockIcon width="16" height="16" />
                  <div>
                    <div className="document-preview__info-label">Last Modified</div>
                    <div className="document-preview__info-value">{lastModified}</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {document.tags.length > 0 && (
            <section className="document-preview__section">
              <h3 className="document-preview__section-title">Tags</h3>
              <div className="document-preview__tags">
                {document.tags.map((tag) => (
                  <span key={tag.id} className="document-preview__tag">
                    <TagIcon width="14" height="14" />
                    {tag.label}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
    </div>
  );
};

export default DocumentPreview;
