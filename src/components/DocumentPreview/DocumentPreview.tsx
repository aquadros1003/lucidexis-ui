import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useAuthContext } from '../../contexts';
import { downloadFile } from '../../utils/downloadFile';
import { updateDocument, getDocumentMarkdownPreview } from '../../api/hooks/documents';
import { formatFullDate } from '../../utils/dateFormatter';
import type { DocumentCardProps } from '../DocumentCard/DocumentCard';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
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
  const { t } = useTranslation();
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(document.description);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'preview'>('details');
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [panelWidth, setPanelWidth] = useState(480);
  const [isResizing, setIsResizing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEditedDescription(document.description);
    // Reset markdown content when document changes
    setMarkdownContent('');
    setPreviewError(null);
    if (activeTab === 'preview') {
      loadMarkdownPreview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document.id]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 400 && newWidth <= window.innerWidth * 0.9) {
        setPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.document.addEventListener('mousemove', handleMouseMove);
      window.document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.document.removeEventListener('mousemove', handleMouseMove);
      window.document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const loadMarkdownPreview = async () => {
    setIsLoadingPreview(true);
    setPreviewError(null);
    try {
      const content = await getDocumentMarkdownPreview(document.id);
      setMarkdownContent(content);
    } catch (error) {
      console.error('Failed to load markdown preview:', error);
      setPreviewError('t(errors.SomethingWentWrong)');
    } finally {
      setIsLoadingPreview(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'preview' && markdownContent === '' && !isLoadingPreview) {
      loadMarkdownPreview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  useEffect(() => {
    if (isEditingDescription) {
      adjustTextareaHeight();
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.select();
      }
    }
  }, [isEditingDescription]);

  useEffect(() => {
    if (isEditingDescription) {
      adjustTextareaHeight();
    }
  }, [editedDescription, isEditingDescription]);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedDescription(e.target.value);
  };

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
      setEditedDescription(document.description);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDescriptionCancel = () => {
    setEditedDescription(document.description);
    setIsEditingDescription(false);
  };

  const handleDescriptionBlur = () => {
    handleDescriptionSave();
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      handleDescriptionCancel();
    }
  };

  const fileType = document.type === 'pdf' ? 'DOCX' : document.type.toUpperCase();
  const fileSize = document.fileSize;
  const author = document.authorName || 'Unknown Author';
  const category = 'Technical';
  const createdDate = formatFullDate(document.date, i18n.language);
  const lastModified = formatFullDate(document.date, typeof navigator !== 'undefined' ? navigator.language : 'en');

  return (
    <div
      ref={panelRef}
      className={`document-preview ${isResizing ? 'resizing' : ''}`}
      style={{ width: `${panelWidth}px` }}
    >
      <div className="document-preview__resize-handle" onMouseDown={handleMouseDown} />
      <div className="document-preview__header">
        <div className="document-preview__header-content">
          <div className="document-preview__icon">
            <DocumentIcon width="24" height="24" />
          </div>
          <div className="document-preview__header-info">
            <h2 className="document-preview__title">{document.title}</h2>
          </div>
        </div>
        <button className="document-preview__close" onClick={onClose} aria-label="Close preview">
          <CloseIcon width="24" height="24" />
        </button>
      </div>

      <div className="document-preview__actions">
        <button
          className={`document-preview__action-btn ${document.isFavorite ? 'document-preview__action-btn--favorite' : ''}`}
          onClick={handleFavorite}
          aria-label={document.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          style={
            {
              '--star-fill': document.isFavorite ? '#FFD700' : 'none',
              '--star-stroke': document.isFavorite ? '#FFD700' : 'currentColor',
            } as React.CSSProperties
          }
        >
          <StarIcon width="16" height="16" />
        </button>
        <button className="document-preview__action-btn" onClick={handleDownload}>
          <DownloadIcon width="16" height="16" />
          {t('documentPreview.download')}
        </button>
        <button className="document-preview__action-btn" onClick={handleArchive}>
          {document.isArchived ? (
            <>
              <UnarchiveIcon width="16" height="16" />
              {t('documentPreview.unarchive')}
            </>
          ) : (
            <>
              <ArchiveIcon width="16" height="16" />
              {t('documentPreview.archive')}
            </>
          )}
        </button>
        <button className="document-preview__action-btn document-preview__action-btn--danger" onClick={handleDelete}>
          <TrashIcon width="16" height="16" />
          {t('documentPreview.delete')}
        </button>
      </div>
      <div className="document-preview__content">
        <div className="document-preview__tabs">
          <button
            className={`document-preview__tab ${activeTab === 'details' ? 'document-preview__tab--active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            {t('documentPreview.details')}
          </button>
          <button
            className={`document-preview__tab ${activeTab === 'preview' ? 'document-preview__tab--active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            {t('documentPreview.preview')}
          </button>
        </div>

        {activeTab === 'details' && (
          <>
            <section className="document-preview__section">
              <h3 className="document-preview__section-title">{t('documentPreview.description')}</h3>
              {isEditingDescription ? (
                <textarea
                  ref={textareaRef}
                  className="document-preview__description-textarea"
                  value={editedDescription}
                  onChange={handleDescriptionChange}
                  onBlur={handleDescriptionBlur}
                  onKeyDown={handleDescriptionKeyDown}
                  disabled={isSaving}
                />
              ) : (
                <p
                  className="document-preview__description document-preview__description--editable"
                  onDoubleClick={handleDescriptionDoubleClick}
                  title={t('documentPreview.editDescriptionTooltip')}
                >
                  {document.description || t('documentPreview.noDescription')}
                </p>
              )}
            </section>

            <section className="document-preview__section">
              <div className="document-preview__info-row">
                <div className="document-preview__info-col">
                  <div className="document-preview__info-item">
                    <FileTypeIcon width="16" height="16" />
                    <div>
                      <div className="document-preview__info-label">{t('documentPreview.fileType')}</div>
                      <div className="document-preview__info-value">{fileType}</div>
                    </div>
                  </div>

                  <div className="document-preview__info-item">
                    <UserIcon width="16" height="16" />
                    <div>
                      <div className="document-preview__info-label">{t('documentPreview.author')}</div>
                      <div className="document-preview__info-value">{author}</div>
                    </div>
                  </div>

                  <div className="document-preview__info-item">
                    <CalendarIcon width="16" height="16" />
                    <div>
                      <div className="document-preview__info-label">{t('documentPreview.createdDate')}</div>
                      <div className="document-preview__info-value">{createdDate}</div>
                    </div>
                  </div>
                </div>

                <div className="document-preview__info-col">
                  <div className="document-preview__info-item">
                    <FileSizeIcon width="16" height="16" />
                    <div>
                      <div className="document-preview__info-label">{t('documentPreview.fileSize')}</div>
                      <div className="document-preview__info-value">{fileSize}</div>
                    </div>
                  </div>

                  <div className="document-preview__info-item">
                    <TagIcon width="16" height="16" />
                    <div>
                      <div className="document-preview__info-label">{t('documentPreview.category')}</div>
                      <div className="document-preview__info-value">
                        <span className="category-badge">{category}</span>
                      </div>
                    </div>
                  </div>

                  <div className="document-preview__info-item">
                    <ClockIcon width="16" height="16" />
                    <div>
                      <div className="document-preview__info-label">{t('documentPreview.lastModified')}</div>
                      <div className="document-preview__info-value">{lastModified}</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {document.tags.length > 0 && (
              <section className="document-preview__section">
                <h3 className="document-preview__section-title">{t('documentPreview.tags')}</h3>
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
          </>
        )}

        {activeTab === 'preview' && (
          <section className="document-preview__section document-preview__markdown-preview">
            {isLoadingPreview && <div className="document-preview__loading">{t('documentPreview.loadingPreview')}</div>}
            {previewError && <div className="document-preview__error">{previewError}</div>}
            {!isLoadingPreview && !previewError && markdownContent && (
              <div className="document-preview__markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownContent}</ReactMarkdown>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default DocumentPreview;
