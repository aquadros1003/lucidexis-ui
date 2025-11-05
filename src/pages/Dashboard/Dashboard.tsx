import { useQuery } from '@tanstack/react-query';
import DocumentCard from '../../components/DocumentCard/DocumentCard';
import type { DocumentCardProps } from '../../components/DocumentCard/DocumentCard';
import { getDocuments } from '../../api/documents';
import { mapDocumentsToCards } from '../../utils/documentMapper';
import { Loader } from '../../components/Loader';
import './Dashboard.scss';

function Dashboard() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const response = await getDocuments(100, 0);
      return mapDocumentsToCards(response.data);
    },
  });

  const documents: DocumentCardProps[] = data || [];

  const handleCardClick = (id: string) => {
    console.log('Document clicked:', id);
    const doc = documents.find(d => d.id === id);
    if (doc) {
      // TODO: Navigate to document detail page or open download
      console.log('Document data:', doc);
    }
  };

  const handleMenuClick = (id: string) => {
    console.log('Menu clicked for document:', id);
    // TODO: Show context menu with options (download, delete, etc.)
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
    <div className="dashboard">
      <div className="dashboard-content">
        <div className="dashboard-section">
          {documents.length === 0 ? (
            <div className="dashboard-empty">
              <h2>No documents yet</h2>
              <p>Upload your first document to get started</p>
            </div>
          ) : (
            <div className="documents-grid">
              {documents.map((doc) => (
                <DocumentCard
                  key={doc.id}
                  {...doc}
                  onCardClick={handleCardClick}
                  onMenuClick={handleMenuClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
