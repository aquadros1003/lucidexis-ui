import { useTranslation } from 'react-i18next';
import './SearchResultsHeader.scss';

interface SearchResultsHeaderProps {
  resultsCount: number;
  searchQuery: string;
}

export function SearchResultsHeader({ resultsCount, searchQuery }: SearchResultsHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="search-results-header">
      <div className="search-results-header__icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="search-results-header__content">
        <h1 className="search-results-header__title">{t('semanticSearch.searchResults')}</h1>
        <p className="search-results-header__subtitle">
          {t('semanticSearch.semanticSearchResultsFor')} "
          <span className="search-results-header__query">{searchQuery}</span>"
        </p>
      </div>
      <div className="search-results-header__count">
        <span className="search-results-header__count-icon">Q</span>
        <span className="search-results-header__count-number">{resultsCount}</span>
      </div>
    </div>
  );
}
