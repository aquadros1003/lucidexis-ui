import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DocumentPreview } from '../DocumentPreview';
import type { DocumentCardProps } from '../DocumentCard/DocumentCard';
import type { DocumentPrediction } from '../../api/schema/documents';
import { formatRelativeDate } from '../../utils/dateFormatter';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './SemanticSearchResult.scss';
import { FilePdfIcon, FileDocIcon, FileSheetIcon, FileImageIcon, FileOtherIcon } from '../../assets/icons';

const getFileIcon = (type: DocumentCardProps['type']): React.ReactElement => {
  if (type === 'pdf') {
    return <FilePdfIcon />;
  }
  if (['doc', 'docx', 'txt'].includes(type)) {
    return <FileDocIcon />;
  }
  if (['sheet', 'xlsx', 'csv'].includes(type)) {
    return <FileSheetIcon />;
  }
  if (['image', 'jpg', 'jpeg', 'png', 'gif'].includes(type)) {
    return <FileImageIcon />;
  }
  return <FileOtherIcon />;
};

interface SemanticSearchResultProps extends DocumentPrediction {
  onArchive: (id: string, isArchived: boolean) => Promise<void>;
  onFavorite: (id: string, isFavorite: boolean) => Promise<void>;
  onDocumentUpdate: (id: string, updates: { description?: string; category?: string }) => void;
  onDelete: (id: string) => void;
}

export function SemanticSearchResult({
  document,
  chunk_content,
  onArchive,
  onFavorite,
  onDocumentUpdate,
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
      category: document.category,
      isFavorite: document.is_favorite,
      isArchived: document.is_archived,
    };
    setSelectedDocument(docProps);
  };

  const handleClosePreview = () => {
    setSelectedDocument(null);
  };

  return (
    <>
      <div className="semantic-search-result">
        <div className="semantic-search-result__header">
          <div className="semantic-search-result__file-icon">
            {getFileIcon(document.content_type.includes('pdf') ? 'pdf' : 'other')}
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
        </div>
        <div className="semantic-search-result__content">
          ...<ReactMarkdown remarkPlugins={[remarkGfm]}>{chunk_content}</ReactMarkdown>...
        </div>
        <div className="semantic-search-result__footer">
          <button className="semantic-search-result__view-button" onClick={handleViewDocument}>
            {t('semanticSearch.viewDocument')}
          </button>
        </div>
      </div>
      {selectedDocument && (
        <DocumentPreview
          document={selectedDocument}
          onClose={handleClosePreview}
          onArchive={onArchive}
          onFavorite={onFavorite}
          onDocumentUpdate={onDocumentUpdate}
          onDelete={onDelete}
        />
      )}
    </>
  );
}
