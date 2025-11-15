import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { DocumentUpload } from '../DocumentUpload/DocumentUpload';
import { PlusIcon } from '../../assets/icons';
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
          </div>
          <div className="navbar__right">
            <button
              className="navbar__upload-btn"
              onClick={() => setIsUploadModalOpen(true)}
              title="Upload Document"
            >
              <PlusIcon className="navbar__upload-icon" />
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
