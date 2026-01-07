import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams, useLocation, useParams } from 'react-router-dom';
import { getDocuments } from '../../api/hooks/documents';
import DocumentCard from '../../components/DocumentCard/DocumentCard';
import { DocumentPreview } from '../../components/DocumentPreview';
import { ConfirmModal } from '../../components/ConfirmModal';
import { Pagination } from '../../components/Pagination';
import { PerPageSelect } from '../../components/PerPageSelect';
import { EmptyState } from '../../components/EmptyState';
import { mapDocumentsToCards, mapDocumentToCard } from '../../utils/documentMapper';
import {
  useArchiveDocument,
  useUnarchiveDocument,
  useFavoriteDocument,
  useUnfavoriteDocument,
  useDeleteDocument,
} from '../../hooks';
import type { DocumentCardProps } from '../../components/DocumentCard/DocumentCard';
import './Documents.scss';
import { useTranslation } from 'react-i18next';

const DEFAULT_ITEMS_PER_PAGE = 20;

type DocumentFilter = 'all' | 'favorites' | 'archived' | 'recently_visited';

function getFilterFromPath(pathname: string): DocumentFilter {
  if (pathname === '/favorites') return 'favorites';
  if (pathname === '/archived') return 'archived';
  if (pathname === '/recent') return 'recently_visited';
  return 'all';
}

export function Documents() {
  const { t } = useTranslation();
  const location = useLocation();
  const { category } = useParams<{ category?: string }>();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const itemsPerPage = parseInt(searchParams.get('perPage') || String(DEFAULT_ITEMS_PER_PAGE), 10);
  const searchQuery = searchParams.get('search') || '';
  const [selectedDocument, setSelectedDocument] = useState<DocumentCardProps | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const filter = getFilterFromPath(location.pathname);
  const offset = (currentPage - 1) * itemsPerPage;

  const archiveMutation = useArchiveDocument();
  const unarchiveMutation = useUnarchiveDocument();
  const favoriteMutation = useFavoriteDocument();
  const unfavoriteMutation = useUnfavoriteDocument();
  const deleteMutation = useDeleteDocument();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['documents', filter, currentPage, itemsPerPage, searchQuery, category],
    queryFn: async () => {
      const params: {
        limit: number;
        offset: number;
        search: string;
        isFavorite?: boolean;
        isArchived?: boolean;
        recentlyVisited?: boolean;
        categories?: string[];
      } = {
        limit: itemsPerPage,
        offset,
        search: searchQuery,
      };

      if (filter === 'favorites') {
        params.isFavorite = true;
      } else if (filter === 'archived') {
        params.isArchived = true;
      } else if (filter === 'recently_visited') {
        params.recentlyVisited = true;
      }

      if (category) {
        params.categories = [category];
      }

      const response = await getDocuments(params);
      return {
        documents: filter === 'all' ? mapDocumentsToCards(response.data) : response.data.map(mapDocumentToCard),
        totalCount: response.count,
      };
    },
  });

  const documents: DocumentCardProps[] = data?.documents || [];
  const totalPages = data ? Math.ceil(data.totalCount / itemsPerPage) : 0;

  const handleCardClick = (id: string) => {
    const doc = documents.find((d) => d.id === id);
    if (doc) {
      setSelectedDocument(doc);
    }
  };

  const handleClosePreview = () => {
    setSelectedDocument(null);
  };

  const handleArchive = async (id: string, isArchived: boolean) => {
    const mutation = isArchived ? unarchiveMutation : archiveMutation;
    mutation.mutate(id, {
      onSuccess: (updatedDoc) => {
        if (selectedDocument?.id === id) {
          setSelectedDocument(mapDocumentToCard(updatedDoc));
        }
        if (isArchived || filter === 'archived') {
          queryClient.invalidateQueries({ queryKey: ['documents'] });
        }
        queryClient.invalidateQueries({ queryKey: ['documentStats'] });
        refetch();
      },
    });
  };

  const handleFavorite = async (id: string, isFavorite: boolean) => {
    const mutation = isFavorite ? unfavoriteMutation : favoriteMutation;
    mutation.mutate(id, {
      onSuccess: (updatedDoc) => {
        if (selectedDocument?.id === id) {
          setSelectedDocument(mapDocumentToCard(updatedDoc));
        }
        queryClient.invalidateQueries({ queryKey: ['documentStats'] });
        refetch();
      },
    });
  };

  const handleDelete = (id: string) => {
    const document = documents.find((doc) => doc.id === id);
    if (document) {
      setDocumentToDelete({ id: document.id, title: document.title });
    }
  };

  const handleConfirmDelete = () => {
    if (documentToDelete) {
      deleteMutation.mutate(documentToDelete.id, {
        onSuccess: () => {
          setDocumentToDelete(null);
          if (selectedDocument?.id === documentToDelete.id) {
            setSelectedDocument(null);
          }
          refetch();
        },
      });
    }
  };

  const handleDocumentUpdate = (id: string, updates: { description?: string; category?: string }) => {
    if (selectedDocument?.id === id) {
      setSelectedDocument({
        ...selectedDocument,
        ...updates,
      });
    }
    queryClient.invalidateQueries({ queryKey: ['documentStats'] });
    refetch();
  };

  const handlePageChange = (page: number) => {
    const params: Record<string, string> = { page: page.toString() };
    if (itemsPerPage !== DEFAULT_ITEMS_PER_PAGE) {
      params.perPage = itemsPerPage.toString();
    }
    setSearchParams(params);
  };

  const handlePerPageChange = (perPage: number) => {
    const params: Record<string, string> = { page: '1' };
    if (perPage !== DEFAULT_ITEMS_PER_PAGE) {
      params.perPage = perPage.toString();
    }
    setSearchParams(params);
  };

  if (error) {
    return (
      <div className="documents">
        <div className="documents__content">
          <div className="documents__error">
            <p>{t('errors.somethingWentWrong')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="documents">
      <div className="documents__content">
        {isLoading && (
          <div className="documents__loading-overlay">
            <div className="documents__spinner" />
          </div>
        )}
        {documents.length === 0 && !isLoading ? (
          <EmptyState title={t('dashboard.noDocumentsTitle')} description={t('dashboard.uploadFirstDocument')} />
        ) : (
          <>
            <div className="documents__main">
              <div className="documents__controls">
                <div className="documents__controls-info">
                  {t('dashboard.showingDocuments', { count: documents.length })}
                </div>
                <PerPageSelect value={itemsPerPage} onChange={handlePerPageChange} />
              </div>
              <div className="documents__grid">
                {documents.map((doc) => (
                  <DocumentCard key={doc.id} {...doc} onCardClick={handleCardClick} onArchive={handleArchive} />
                ))}
              </div>
            </div>
            <div className="documents__pagination-wrapper">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={data?.totalCount}
              />
            </div>
          </>
        )}
      </div>

      {selectedDocument && (
        <DocumentPreview
          document={selectedDocument}
          onClose={handleClosePreview}
          onArchive={handleArchive}
          onFavorite={handleFavorite}
          onDelete={handleDelete}
          onDocumentUpdate={handleDocumentUpdate}
        />
      )}

      <ConfirmModal
        isOpen={!!documentToDelete}
        title={t('dashboard.deleteDocument')}
        message={
          <p>
            {t('dashboard.deleteDocumentConfirmation')} <strong>{documentToDelete?.title}</strong>?
          </p>
        }
        confirmText={t('dashboard.delete')}
        cancelText={t('dashboard.cancel')}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDocumentToDelete(null)}
        isLoading={deleteMutation.isPending}
        variant="danger"
      />
    </div>
  );
}
