import { useState } from 'react';
import { SearchIcon, CloseIcon } from '../../assets/icons';
import './SearchBar.scss';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  defaultValue?: string;
}

export function SearchBar({
  placeholder = 'Search by title, description, or tags...',
  onSearch,
  defaultValue = '',
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    // Optional: real-time search
    // onSearch(value);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <SearchIcon className="search-bar__icon" width="20" height="20" />
      <input
        type="text"
        className="search-bar__input"
        placeholder={placeholder}
        value={query}
        onChange={handleChange}
      />
      {query && (
        <button type="button" className="search-bar__clear" onClick={handleClear} aria-label="Clear search">
          <CloseIcon width="16" height="16" />
        </button>
      )}
    </form>
  );
}
