import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { DocumentCardProps } from '../../components/DocumentCard/DocumentCard';
import { DocumentPreview } from '../../components/DocumentPreview';
import { ConfirmModal } from '../../components/ConfirmModal';
import { SemanticSearchResult } from '../../components/SemanticSearchResult';
import { SearchResultsHeader } from '../../components/SearchResultsHeader';
import { EmptyState } from '../../components/EmptyState';
import { SearchXIcon } from '../../assets/icons';
import {
  useArchiveDocument,
  useUnarchiveDocument,
  useFavoriteDocument,
  useUnfavoriteDocument,
  useDeleteDocument,
  useSemanticSearch,
} from '../../hooks';
import './Search.scss';
import { useTranslation } from 'react-i18next';

function Search() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [selectedDocument, setSelectedDocument] = useState<DocumentCardProps | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const archiveMutation = useArchiveDocument();
  const unarchiveMutation = useUnarchiveDocument();
  const favoriteMutation = useFavoriteDocument();
  const unfavoriteMutation = useUnfavoriteDocument();
  const deleteMutation = useDeleteDocument();
  const semanticSearchMutation = useSemanticSearch();

  // Trigger semantic search when search query changes
  useEffect(() => {
    if (searchQuery) {
      semanticSearchMutation.mutate(searchQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleClosePreview = () => {
    setSelectedDocument(null);
  };

  const handleArchive = async (id: string, isArchived: boolean) => {
    try {
      const result = isArchived ? await unarchiveMutation.mutateAsync(id) : await archiveMutation.mutateAsync(id);

      if (selectedDocument && selectedDocument.id === id) {
        setSelectedDocument({
          ...selectedDocument,
          isArchived: result.is_archived,
          isFavorite: result.is_favorite,
        });
      }
    } catch (error) {
      console.error('Failed to update document:', error);
    }
  };

  const handleFavorite = async (id: string, isFavorite: boolean) => {
    try {
      const result = isFavorite ? await unfavoriteMutation.mutateAsync(id) : await favoriteMutation.mutateAsync(id);

      if (selectedDocument && selectedDocument.id === id) {
        setSelectedDocument({
          ...selectedDocument,
          isFavorite: result.is_favorite,
        });
      }
    } catch (error) {
      console.error('Failed to update document:', error);
    }
  };

  const handleDocumentUpdate = (
    id: string,
    updates: { description?: string; category?: string; isProcessed?: boolean },
  ) => {
    if (selectedDocument && selectedDocument.id === id) {
      setSelectedDocument({
        ...selectedDocument,
        ...updates,
      });
    }
    queryClient.invalidateQueries({ queryKey: ['documentStats'] });
    if (searchQuery) {
      semanticSearchMutation.mutate(searchQuery);
    }
  };

  const handleDelete = (id: string) => {
    setDocumentToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!documentToDelete) return;

    try {
      await deleteMutation.mutateAsync(documentToDelete);
      setIsDeleteModalOpen(false);
      setDocumentToDelete(null);
      setSelectedDocument(null);
    } catch (error) {
      console.error('Failed to delete document:', error);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDocumentToDelete(null);
  };

  return (
    <div className="search">
      <div className="search-content">
        <div className="search-section">
          {/* Semantic search results */}
          {searchQuery ? (
            <>
              {semanticSearchMutation.isPending && (
                <div className="search__loading-overlay">
                  <div className="search__spinner" />
                  <p>{t('semanticSearch.searching')}</p>
                </div>
              )}
              {semanticSearchMutation.isSuccess && (
                <div className="semantic-search-results">
                  <SearchResultsHeader
                    resultsCount={semanticSearchMutation.data.predictions.length}
                    searchQuery={searchQuery}
                  />
                  {semanticSearchMutation.data.predictions.length === 0 ? (
                    <EmptyState
                      title={t('semanticSearch.noResults')}
                      description={t('semanticSearch.noResultsDescription')}
                      icon={<SearchXIcon className="empty-state__illustration" />}
                    />
                  ) : (
                    <div className="semantic-search-results__list">
                      {semanticSearchMutation.data.predictions.map((prediction, index) => (
                        <SemanticSearchResult
                          key={`${prediction.document.id}-${index}`}
                          document={prediction.document}
                          chunk_content={prediction.chunk_content}
                          accuracy={prediction.accuracy}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
              {semanticSearchMutation.isError && (
                <div className="search-error">
                  <p>{t('errors.somethingWentWrong')}</p>
                </div>
              )}
            </>
          ) : (
            <div className="search-empty">
              <h2>{t('semanticSearch.startSearchTitle')}</h2>
              <p>{t('semanticSearch.startSearchDescription')}</p>
            </div>
          )}
        </div>
      </div>
      {selectedDocument && (
        <DocumentPreview
          document={selectedDocument}
          onClose={handleClosePreview}
          onArchive={handleArchive}
          onFavorite={handleFavorite}
          onDocumentUpdate={handleDocumentUpdate}
          onDelete={handleDelete}
          onRefresh={() => semanticSearchMutation.mutate(searchQuery)}
        />
      )}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title={t('dashboard.deleteDocument')}
        message={
          <p>
            {t('dashboard.deleteDocumentConfirmation')} <strong>{selectedDocument?.title}</strong>?
          </p>
        }
        confirmText={t('dashboard.delete')}
        cancelText={t('dashboard.cancel')}
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

export default Search;
