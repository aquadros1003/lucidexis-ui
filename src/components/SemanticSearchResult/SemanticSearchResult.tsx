import { useTranslation } from 'react-i18next';
import type { DocumentCardProps } from '../DocumentCard/DocumentCard';
import type { DocumentPrediction } from '../../api/schema/documents';
import { formatRelativeDate } from '../../utils/dateFormatter';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './SemanticSearchResult.scss';
import { useNavigate } from 'react-router-dom';
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

export function SemanticSearchResult({
  document,
  chunk_content,
  accuracy,
}: {
  document: DocumentPrediction['document'];
  chunk_content: string;
  accuracy: number;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getAccuracyColor = (acc: number): string => {
    if (acc >= 0.8) return 'high';
    if (acc >= 0.6) return 'medium';
    return 'low';
  };

  const accuracyPercentage = Math.round(accuracy * 100);
  const accuracyColor = getAccuracyColor(accuracy);

  const handleViewDocument = () => {
    navigate(`/document/${document.id}`);
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
          <div className={`semantic-search-result__accuracy semantic-search-result__accuracy--${accuracyColor}`}>
            {accuracyPercentage}%
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
    </>
  );
}
