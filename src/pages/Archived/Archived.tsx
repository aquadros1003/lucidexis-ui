import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getDocuments } from '../../api/hooks/documents';
import DocumentCard from '../../components/DocumentCard/DocumentCard';
import { DocumentPreview } from '../../components/DocumentPreview';
import { ConfirmModal } from '../../components/ConfirmModal';
import { Pagination } from '../../components/Pagination';
import { PerPageSelect } from '../../components/PerPageSelect';
import { mapDocumentToCard } from '../../utils/documentMapper';
import {
  useArchiveDocument,
  useUnarchiveDocument,
  useFavoriteDocument,
  useUnfavoriteDocument,
} from '../../hooks/useArchiveDocument';
import { useDeleteDocument } from '../../hooks/useDeleteDocument';
import type { DocumentCardProps } from '../../components/DocumentCard/DocumentCard';
import './Archived.scss';
import { useTranslation } from 'react-i18next';

const DEFAULT_ITEMS_PER_PAGE = 10;

export function Archived() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const itemsPerPage = parseInt(searchParams.get('perPage') || String(DEFAULT_ITEMS_PER_PAGE), 10);
  const searchQuery = searchParams.get('search') || '';
  const [selectedDocument, setSelectedDocument] = useState<DocumentCardProps | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const offset = (currentPage - 1) * itemsPerPage;

  const { data, isLoading, error } = useQuery({
    queryKey: ['archivedDocuments', currentPage, itemsPerPage, searchQuery],
    queryFn: () =>
      getDocuments({
        limit: itemsPerPage,
        offset,
        search: searchQuery,
        isArchived: true,
      }),
  });

  const archiveMutation = useArchiveDocument();
  const unarchiveMutation = useUnarchiveDocument();
  const favoriteMutation = useFavoriteDocument();
  const unfavoriteMutation = useUnfavoriteDocument();
  const deleteMutation = useDeleteDocument();

  const handleCardClick = (id: string) => {
    const document = data?.data.find((doc) => doc.id === id);
    if (document) {
      setSelectedDocument(mapDocumentToCard(document));
    }
  };

  const handleClosePreview = () => {
    setSelectedDocument(null);
  };

  const handleArchive = (id: string, isArchived: boolean) => {
    const mutation = isArchived ? unarchiveMutation : archiveMutation;
    mutation.mutate(id, {
      onSuccess: (updatedDoc) => {
        if (selectedDocument?.id === id) {
          setSelectedDocument(mapDocumentToCard(updatedDoc));
        }
      },
    });
  };

  const handleFavorite = (id: string, isFavorite: boolean) => {
    const mutation = isFavorite ? unfavoriteMutation : favoriteMutation;
    mutation.mutate(id, {
      onSuccess: (updatedDoc) => {
        if (selectedDocument?.id === id) {
          setSelectedDocument(mapDocumentToCard(updatedDoc));
        }
      },
    });
  };

  const handleDelete = (id: string) => {
    const document = data?.data.find((doc) => doc.id === id);
    if (document) {
      setDocumentToDelete({ id: document.id, title: document.filename });
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
        },
      });
    }
  };

  const handleDescriptionUpdate = (id: string, description: string) => {
    if (selectedDocument?.id === id) {
      setSelectedDocument({
        ...selectedDocument,
        description,
      });
    }
  };

  const totalPages = data ? Math.ceil(data.count / itemsPerPage) : 0;

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
      <div className="archived">
        <div className="archived__error">
          <p>{t('errors.somethingWentWrong')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="archived">
      <div className="archived-content">
        {isLoading && (
          <div className="archived__loading-overlay">
            <div className="archived__spinner" />
          </div>
        )}
        {data?.data.length === 0 && !isLoading ? (
          <div className="archived__empty">
            <h2>{t('dashboard.noDocumentsTitle')}</h2>
            <p>{t('dashboard.uploadFirstDocument')}</p>
          </div>
        ) : (
          <>
            <div className="archived__controls">
              <div className="archived__controls-info">
                {t('dashboard.showingDocuments', { count: data?.data.length || 0 })}
              </div>
              <PerPageSelect value={itemsPerPage} onChange={handlePerPageChange} />
            </div>
            <div className="archived__grid">
              {data?.data.map((doc) => (
                <DocumentCard key={doc.id} {...mapDocumentToCard(doc)} onCardClick={handleCardClick} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={data?.count}
            />
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
          onDescriptionUpdate={handleDescriptionUpdate}
        />
      )}

      <ConfirmModal
        isOpen={!!documentToDelete}
        title={t('dashboard.deleteDocument')}
        message={
          <p>
            {t('dashboard.deleteDocumentConfirmation')} <strong>{selectedDocument?.title}</strong>?
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
