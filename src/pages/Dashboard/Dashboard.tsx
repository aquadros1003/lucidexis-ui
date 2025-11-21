import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import DocumentCard from '../../components/DocumentCard/DocumentCard';
import type { DocumentCardProps } from '../../components/DocumentCard/DocumentCard';
import { DocumentPreview } from '../../components/DocumentPreview';
import { ConfirmModal } from '../../components/ConfirmModal';
import { getDocuments } from '../../api/hooks/documents';
import { mapDocumentsToCards } from '../../utils/documentMapper';
import { Pagination } from '../../components/Pagination';
import { PerPageSelect } from '../../components/PerPageSelect';
import {
  useArchiveDocument,
  useUnarchiveDocument,
  useFavoriteDocument,
  useUnfavoriteDocument,
  useDeleteDocument,
} from '../../hooks';
import './Dashboard.scss';

const DEFAULT_ITEMS_PER_PAGE = 10;

function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const itemsPerPage = parseInt(searchParams.get('perPage') || String(DEFAULT_ITEMS_PER_PAGE), 10);
  const searchQuery = searchParams.get('search') || '';
  const [selectedDocument, setSelectedDocument] = useState<DocumentCardProps | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const archiveMutation = useArchiveDocument();
  const unarchiveMutation = useUnarchiveDocument();
  const favoriteMutation = useFavoriteDocument();
  const unfavoriteMutation = useUnfavoriteDocument();
  const deleteMutation = useDeleteDocument();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['documents', currentPage, itemsPerPage, searchQuery],
    queryFn: async () => {
      const offset = (currentPage - 1) * itemsPerPage;
      const response = await getDocuments({
        limit: itemsPerPage,
        offset,
        search: searchQuery || undefined,
      });
      return {
        documents: mapDocumentsToCards(response.data),
        totalCount: response.count,
      };
    },
  });

  const documents: DocumentCardProps[] = data?.documents || [];
  const totalPages = data ? Math.ceil(data.totalCount / itemsPerPage) : 1;

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

  const handleDescriptionUpdate = (id: string, description: string) => {
    if (selectedDocument && selectedDocument.id === id) {
      setSelectedDocument({
        ...selectedDocument,
        description,
      });
    }
    refetch();
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
      <div className="dashboard">
        <div className="dashboard-content">
          <div className="dashboard-error">
            <h2>Error Loading Documents</h2>
            <p>{error instanceof Error ? error.message : 'Failed to load documents'}</p>
            <button onClick={() => refetch()} className="dashboard-retry-btn">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        <div className="dashboard-section">
          {isLoading && (
            <div className="dashboard__loading-overlay">
              <div className="dashboard__spinner" />
            </div>
          )}
          {documents.length === 0 && !isLoading ? (
            <div className="dashboard-empty">
              <h2>No documents yet</h2>
              <p>Upload your first document to get started</p>
            </div>
          ) : (
            <>
              <div className="dashboard-controls">
                <div className="dashboard-controls__info">Showing {documents.length} documents</div>
                <PerPageSelect value={itemsPerPage} onChange={handlePerPageChange} />
              </div>
              <div className="documents-grid">
                {documents.map((doc) => (
                  <DocumentCard key={doc.id} {...doc} onCardClick={handleCardClick} />
                ))}
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={data?.totalCount}
              />
            </>
          )}
        </div>
      </div>

      {selectedDocument && (
        <DocumentPreview
          document={selectedDocument}
          onClose={handleClosePreview}
          onArchive={handleArchive}
          onFavorite={handleFavorite}
          onDescriptionUpdate={handleDescriptionUpdate}
          onDelete={handleDelete}
        />
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Document"
        message={
          <>
            Are you sure you want to delete <strong>{selectedDocument?.title}</strong>? This action cannot be undone.
          </>
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}

export default Dashboard;
