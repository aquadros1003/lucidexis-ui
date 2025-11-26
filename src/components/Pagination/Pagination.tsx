import './Pagination.scss';
import { useTranslation } from 'react-i18next';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage?: number;
  totalItems?: number;
}

const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage = 10, totalItems }: PaginationProps) => {
  const { t } = useTranslation();
  const handleFirst = () => {
    if (currentPage > 1) {
      onPageChange(1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleLast = () => {
    if (currentPage < totalPages) {
      onPageChange(totalPages);
    }
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems || currentPage * itemsPerPage);

  return (
    <div className="pagination">
      <div className="pagination-info">
        {t('pagination.showing')} <strong>{startItem}</strong> {t('pagination.to')} <strong>{endItem}</strong>{' '}
        {t('pagination.of')} <strong>{totalItems || endItem}</strong> {t('pagination.documents')}{' '}
      </div>
      <div className="pagination-controls">
        <button
          onClick={handleFirst}
          disabled={currentPage === 1}
          className="pagination-btn pagination-btn--first"
          aria-label="First page"
        >
          «
        </button>
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="pagination-btn pagination-btn--prev"
          aria-label="Previous page"
        >
          ‹
        </button>
        <button className="pagination-btn pagination-btn--active">{currentPage}</button>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="pagination-btn pagination-btn--next"
          aria-label="Next page"
        >
          ›
        </button>
        <button
          onClick={handleLast}
          disabled={currentPage === totalPages}
          className="pagination-btn pagination-btn--last"
          aria-label="Last page"
        >
          »
        </button>
      </div>
    </div>
  );
};

export default Pagination;
