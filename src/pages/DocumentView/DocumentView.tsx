import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getDocument, getDocumentMarkdownPreview } from '../../api/hooks/documents';
import { useAuthContext } from '../../contexts';
import { downloadFile } from '../../utils/downloadFile';
import { useFavoriteDocument, useUnfavoriteDocument } from '../../hooks';
import { StarIcon, DownloadIcon, ArrowLeftToLineIcon } from '../../assets/icons';
import { useTranslation } from 'react-i18next';
import './DocumentView.scss';
import { useNavigate } from 'react-router-dom';

export function DocumentView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { token } = useAuthContext();
  const queryClient = useQueryClient();
  const [markdownContent, setMarkdownContent] = useState<string>('');
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const handleBack = () => {
    navigate(-1);
  };

  const favoriteMutation = useFavoriteDocument();
  const unfavoriteMutation = useUnfavoriteDocument();

  const { data: document, isLoading } = useQuery({
    queryKey: ['document', id],
    queryFn: async () => {
      if (!id) throw new Error('No document ID');
      return await getDocument(id);
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (id && document) {
      loadMarkdownPreview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, document]);

  const loadMarkdownPreview = async () => {
    if (!id) return;
    setIsLoadingPreview(true);
    setPreviewError(null);
    try {
      const content = await getDocumentMarkdownPreview(id);
      setMarkdownContent(content);
    } catch (error) {
      console.error('Failed to load markdown preview:', error);
      setPreviewError(t('errors.somethingWentWrong'));
    } finally {
      setIsLoadingPreview(false);
    }
  };
  const handleFavorite = async () => {
    if (!document) return;
    const mutation = document.is_favorite ? unfavoriteMutation : favoriteMutation;
    mutation.mutate(document.id, {
      onSuccess: () => {
        document.is_favorite = !document.is_favorite;
        queryClient.invalidateQueries({ queryKey: ['documentStats'] });
      },
    });
  };
  const handleDownload = async () => {
    if (!document) return;
    try {
      await downloadFile(document.download_url, document.filename, token);
    } catch (error) {
      console.error('Failed to download file:', error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileType = (contentType: string): string => {
    if (contentType.includes('pdf')) return 'PDF';
    if (contentType.includes('csv')) return 'CSV';
    if (contentType.includes('markdown')) return 'MD';
    return contentType.split('/')[1]?.toUpperCase() || 'FILE';
  };

  if (isLoading) {
    return (
      <div className="document-view">
        <div className="document-view__loading">
          <div className="document-view__spinner" />
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="document-view">
        <div className="document-view__error">
          <p>{t('errors.somethingWentWrong')}</p>
        </div>
      </div>
    );
  }

  const fileType = getFileType(document.content_type);
  const fileSize = formatFileSize(document.file_size);
  const title = document.filename;

  return (
    <div className="document-view">
      <div className="document-view__header">
        <div className="document-view__header-left">
          <button className="document-view__back-btn" onClick={handleBack} aria-label="Go back">
            <ArrowLeftToLineIcon width="20" height="20" />
          </button>
          <div className="document-view__meta">
            <span className="document-view__title">{title}</span>
            <div className="document-view__submeta">
              <span className="document-view__meta-item">{fileType}</span>
              <span className="document-view__meta-separator"> • </span>
              <span className="document-view__meta-item">{fileSize}</span>
            </div>
          </div>
        </div>
        <div className="document-view__actions">
          <button
            className={`document-view__action-btn ${document.is_favorite ? 'document-view__action-btn--favorite' : ''}`}
            onClick={handleFavorite}
            aria-label={document.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
            style={
              {
                '--star-fill': document.is_favorite ? '#FFD700' : 'none',
                '--star-stroke': document.is_favorite ? '#FFD700' : 'currentColor',
                maxWidth: 'fit-content',
              } as React.CSSProperties
            }
          >
            <StarIcon width="16" height="16" />
          </button>
          <button className="document-view__action-btn" onClick={handleDownload} aria-label="Download">
            <DownloadIcon width="16" height="16" />
            {t('documentPreview.download')}
          </button>
        </div>
      </div>

      <div className="document-view__content">
        {isLoadingPreview && (
          <div className="document-view__preview-loading">
            <div className="document-view__spinner" />
            <p>{t('documentPreview.loadingPreview')}</p>
          </div>
        )}

        {previewError && (
          <div className="document-view__preview-error">
            <p>{previewError}</p>
          </div>
        )}

        {!isLoadingPreview && !previewError && markdownContent && (
          <div className="document-view__preview">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdownContent}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
