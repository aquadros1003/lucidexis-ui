import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { DocumentUpload } from '../DocumentUpload/DocumentUpload';
import { SearchBar } from '../SearchBar';
import { PlusIcon, FilterIcon } from '../../assets/icons';
import './Navbar.scss';

export function Navbar() {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();

  const handleUploadSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['documents'] });
  };

  const handleSearch = (query: string) => {
    const params = new URLSearchParams(location.search);
    if (query) {
      params.set('search', query);
      params.set('page', '1');
    } else {
      params.delete('search');
    }
    navigate(`${location.pathname}?${params.toString()}`);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar__content">
          <div className="navbar__row navbar__row--top">
            <div className="navbar__left">
              <h1 className="navbar__title">Document Library</h1>
              <p className="navbar__subtitle">Manage and search your knowledge base</p>
            </div>
            <button
              className="navbar__upload-btn"
              onClick={() => setIsUploadModalOpen(true)}
              title="Upload Document"
            >
              <PlusIcon className="navbar__upload-icon" />
              <span>Upload</span>
            </button>
          </div>
          <div className="navbar__row navbar__row--bottom">
            <SearchBar onSearch={handleSearch} />
            <button
              className="navbar__filters-btn"
              onClick={() => {/* TODO: Implement filters */}}
              title="Advanced Filters"
            >
              <FilterIcon width="20" height="20" />
              <span>Advanced Filters</span>
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
