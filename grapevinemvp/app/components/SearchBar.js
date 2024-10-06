import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (query.trim()) {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('Search failed');
        }
        const results = await response.json();
        onSearch(results);
      } catch (error) {
        console.error('Error during search:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mx-auto mb-8 mt-3">
      <div className="relative">
        <input
          type="text"
          placeholder="Search projects..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white border rounded-full focus:outline-none focus:border-purple-500"
        />
        <button type="submit" className="absolute top-0 left-0 mt-3 ml-3 text-gray-400">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </div>
    </form>
  );
};

export default SearchBar;