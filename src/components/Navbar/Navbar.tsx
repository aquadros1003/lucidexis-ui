import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import { DocumentUpload } from '../DocumentUpload/DocumentUpload';
import { SearchBar } from '../SearchBar';
import { PlusIcon } from '../../assets/icons';
import { useTranslation } from 'react-i18next';
import './Navbar.scss';

export function Navbar() {
  const { t } = useTranslation();
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
            <SearchBar onSearch={handleSearch} />
            <button
              className="navbar__upload-btn"
              onClick={() => setIsUploadModalOpen(true)}
              title={t('navbar.newDocument')}
            >
              <PlusIcon className="navbar__upload-icon" />
              <span>{t('navbar.newDocument')}</span>
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
