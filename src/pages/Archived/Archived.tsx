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

export function Archived() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selectedDocument, setSelectedDocument] = useState<DocumentCardProps | null>(null);
  const [documentToDelete, setDocumentToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const offset = (currentPage - 1) * perPage;

  const { data, isLoading, error } = useQuery({
    queryKey: ['archivedDocuments', currentPage, perPage, searchQuery],
    queryFn: () =>
      getDocuments({
        limit: perPage,
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

  const totalPages = data ? Math.ceil(data.count / perPage) : 0;

  if (error) {
    return (
      <div className="archived">
        <div className="archived__error">
          <p>Failed to load archived documents. Please try again.</p>
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
            <p>No archived documents yet.</p>
            <p className="archived__empty-hint">Archive documents to keep your workspace organized.</p>
          </div>
        ) : (
          <>
            <div className="archived__controls">
              <div className="archived__controls-info">
                Showing {data?.data.length} document
                {data?.data.length !== 1 ? 's' : ''}
              </div>
              <PerPageSelect value={perPage} onChange={setPerPage} />
            </div>
            <div className="archived__grid">
              {data?.data.map((doc) => (
                <DocumentCard key={doc.id} {...mapDocumentToCard(doc)} onCardClick={handleCardClick} />
              ))}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={perPage}
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
        title="Delete Document"
        message={
          <>
            Are you sure you want to delete <strong>{documentToDelete?.title}</strong>? This action cannot be undone.
          </>
        }
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDocumentToDelete(null)}
        isLoading={deleteMutation.isPending}
        variant="danger"
      />
    </div>
  );
}
