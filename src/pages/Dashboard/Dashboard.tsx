import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import DocumentCard from '../../components/DocumentCard/DocumentCard';
import type { DocumentCardProps } from '../../components/DocumentCard/DocumentCard';
import { DocumentPreview } from '../../components/DocumentPreview';
import { getDocuments } from '../../api/documents';
import { mapDocumentsToCards } from '../../utils/documentMapper';
import { Loader } from '../../components/Loader';
import { Pagination } from '../../components/Pagination';
import { PerPageSelect } from '../../components/PerPageSelect';
import './Dashboard.scss';

const DEFAULT_ITEMS_PER_PAGE = 10;

function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const itemsPerPage = parseInt(searchParams.get('perPage') || String(DEFAULT_ITEMS_PER_PAGE), 10);
  const [selectedDocument, setSelectedDocument] = useState<DocumentCardProps | null>(null);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['documents', currentPage, itemsPerPage],
    queryFn: async () => {
      const offset = (currentPage - 1) * itemsPerPage;
      const response = await getDocuments(itemsPerPage, offset);
      return {
        documents: mapDocumentsToCards(response.data),
        totalCount: response.count,
      };
    },
  });

  const documents: DocumentCardProps[] = data?.documents || [];
  const totalPages = data ? Math.ceil(data.totalCount / itemsPerPage) : 1;

  const handleCardClick = (id: string) => {
    const doc = documents.find(d => d.id === id);
    if (doc) {
      setSelectedDocument(doc);
    }
  };

  const handleClosePreview = () => {
    setSelectedDocument(null);
  };

  const handleArchive = (id: string) => {
    console.log('Archive document:', id);
    // TODO: Implement archive functionality
    setSelectedDocument(null);
  };

  const handleDelete = (id: string) => {
    console.log('Delete document:', id);
    // TODO: Implement delete functionality
    setSelectedDocument(null);
  };

  const handlePageChange = (page: number) => {
    const params: Record<string, string> = { page: page.toString() };
    if (itemsPerPage !== DEFAULT_ITEMS_PER_PAGE) {
      params.perPage = itemsPerPage.toString();
    }
    setSearchParams(params);
  };

  const handlePerPageChange = (perPage: number) => {
    // Reset to page 1 when changing items per page
    const params: Record<string, string> = { page: '1' };
    if (perPage !== DEFAULT_ITEMS_PER_PAGE) {
      params.perPage = perPage.toString();
    }
    setSearchParams(params);
  };

  if (isLoading) {
    return (
      <div className="dashboard">
        <div className="dashboard-content">
          <Loader message="Loading documents..." />
        </div>
      </div>
    );
  }

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
    <div className={`dashboard ${selectedDocument ? 'dashboard--with-preview' : ''}`}>
      <div className="dashboard-content">
        <div className="dashboard-section">
          {documents.length === 0 ? (
            <div className="dashboard-empty">
              <h2>No documents yet</h2>
              <p>Upload your first document to get started</p>
            </div>
          ) : (
            <>
              <div className="dashboard-controls">
                <div className="dashboard-controls__info">
                  Showing {documents.length} documents
                </div>
                <PerPageSelect
                  value={itemsPerPage}
                  onChange={handlePerPageChange}
                />
              </div>
              <div className="documents-grid">
                {documents.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    {...doc}
                    onCardClick={handleCardClick}
                  />
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
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default Dashboard;
