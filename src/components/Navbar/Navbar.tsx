import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { DocumentUpload } from '../DocumentUpload/DocumentUpload';
import './Navbar.scss';

export function Navbar() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleUploadSuccess = () => {
    // Invalidate documents query to trigger refetch
    queryClient.invalidateQueries({ queryKey: ['documents'] });
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar__content">
          <div className="navbar__left">
            {/* Tu możesz dodać tytuł strony lub breadcrumbs */}
          </div>
          <div className="navbar__right">
            <button
              className="navbar__upload-btn"
              onClick={() => setIsUploadModalOpen(true)}
              title="Upload Document"
            >
              <svg
                className="navbar__upload-icon"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 4v16m8-8H4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Upload Document</span>
            </button>
          </div>
        </div>
      </nav>
      
      <DocumentUpload
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </>
  );
}
