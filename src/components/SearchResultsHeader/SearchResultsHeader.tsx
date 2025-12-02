import { useTranslation } from 'react-i18next';
import { SparkleIcon, SearchIcon } from '../../assets/icons';
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
        <SparkleIcon />
      </div>
      <div className="search-results-header__content">
        <div className="search-results-header__header">
          <h1 className="search-results-header__title">{t('semanticSearch.searchResults')}</h1>
          <div className="search-results-header__count">
            <span className="search-results-header__count-icon">
              <SearchIcon />
            </span>
            <span className="search-results-header__count-number">{resultsCount}</span>
          </div>
        </div>
        <p className="search-results-header__subtitle">
          {t('semanticSearch.semanticSearchResultsFor')}
          <span className="search-results-header__query">"{searchQuery}"</span>
        </p>
      </div>
    </div>
  );
}
