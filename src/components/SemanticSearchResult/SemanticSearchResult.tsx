import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DocumentPreview } from '../DocumentPreview';
import type { DocumentCardProps } from '../DocumentCard/DocumentCard';
import type { DocumentPrediction } from '../../api/schema/documents';
import { formatRelativeDate } from '../../utils/dateFormatter';
import './SemanticSearchResult.scss';

interface SemanticSearchResultProps extends DocumentPrediction {
  onArchive: (id: string, isArchived: boolean) => Promise<void>;
  onFavorite: (id: string, isFavorite: boolean) => Promise<void>;
  onDescriptionUpdate: (id: string, description: string) => void;
  onDelete: (id: string) => void;
}

export function SemanticSearchResult({
  document,
  chunk_content,
  onArchive,
  onFavorite,
  onDescriptionUpdate,
  onDelete,
}: SemanticSearchResultProps) {
  const { t } = useTranslation();
  const [selectedDocument, setSelectedDocument] = useState<DocumentCardProps | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleViewDocument = () => {
    const docProps: DocumentCardProps = {
      id: document.id,
      title: document.filename,
      downloadUrl: document.download_url,
      description: document.description,
      fileSize: formatFileSize(document.file_size),
      status: document.is_archived ? 'archived' : 'active',
      type: document.content_type.includes('pdf') ? 'pdf' : 'other',
      tags: [],
      date: new Date(document.created_at),
      authorName: document.owner?.full_name || 'Unknown',
      isFavorite: document.is_favorite,
      isArchived: document.is_archived,
    };
    setSelectedDocument(docProps);
  };

  const handleClosePreview = () => {
    setSelectedDocument(null);
  };

  const getFileExtension = (filename: string) => {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : 'FILE';
  };

  return (
    <>
      <div className="semantic-search-result">
        <div className="semantic-search-result__header">
          <div className="semantic-search-result__file-icon">
            <span className="semantic-search-result__file-type">{getFileExtension(document.filename)}</span>
          </div>
          <div className="semantic-search-result__info">
            <h3 className="semantic-search-result__title">{document.filename}</h3>
            <div className="semantic-search-result__metadata">
              <span className="semantic-search-result__author">{document.owner?.full_name || 'Unknown'}</span>
              <span className="semantic-search-result__separator">•</span>
              <span className="semantic-search-result__date">
                {formatRelativeDate(new Date(document.created_at), t)}
              </span>
              <span className="semantic-search-result__separator">•</span>
              <span className="semantic-search-result__size">{formatFileSize(document.file_size)}</span>
            </div>
          </div>
          <button className="semantic-search-result__view-button" onClick={handleViewDocument}>
            {t('semanticSearch.viewDocument')}
          </button>
        </div>
        <div className="semantic-search-result__content">
          <p className="semantic-search-result__chunk">{chunk_content}</p>
        </div>
        {document.description && (
          <div className="semantic-search-result__description">
            <strong>{t('documentPreview.description')}:</strong> {document.description}
          </div>
        )}
      </div>
      {selectedDocument && (
        <DocumentPreview
          document={selectedDocument}
          onClose={handleClosePreview}
          onArchive={onArchive}
          onFavorite={onFavorite}
          onDescriptionUpdate={onDescriptionUpdate}
          onDelete={onDelete}
        />
      )}
    </>
  );
}
