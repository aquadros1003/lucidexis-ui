import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { DocumentUpload } from '../DocumentUpload/DocumentUpload';
import { SearchBar } from '../SearchBar';
import { useSearchParams } from 'react-router-dom';
import { PlusIcon } from '../../assets/icons';
import { useTranslation } from 'react-i18next';
import './Navbar.scss';

export function Navbar() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleUploadSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['documents'] });
  };

  const handleSearch = (query: string) => {
    if (query) {
      navigate(`/search?search=${encodeURIComponent(query)}`);
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar__content">
          <div className="navbar__row navbar__row--top">
            <SearchBar
              onSearch={handleSearch}
              placeholder={t('navbar.searchPlaceholder')}
              defaultValue={searchParams.get('search') || ''}
            />
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
