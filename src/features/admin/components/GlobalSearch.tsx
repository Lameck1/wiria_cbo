/**
 * Global Search Component
 * Search across members, donations, and contacts
 */

import { useDeferredValue, useEffect, useRef, useState } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { apiClient } from '@/shared/services/api/client';

import { SearchResultsList } from './SearchResultsList';

import type { SearchResult, SearchResults } from '../types';

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const deferredQuery = useDeferredValue(query);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { data: results, isLoading } = useQuery({
    queryKey: ['admin', 'search', deferredQuery],
    queryFn: async () => {
      if (deferredQuery.length < 2) return null;
      return apiClient.get<SearchResults>(`/admin/search?q=${encodeURIComponent(deferredQuery)}`);
    },
    enabled: deferredQuery.length >= 2,
    staleTime: 1000 * 60, // Cache for 1 minute
  });

  // Open dropdown when results arrive
  useEffect(() => {
    if (results) {
      setIsOpen(true);
    }
  }, [results]);

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    setQuery('');
    // Navigate to the specific item using query params for highlighting
    switch (result.type) {
      case 'member': {
        // Just pass the ID, don't filter - let the page load all and find the member
        navigate(`/admin/members?highlight=${result.id}`);
        break;
      }
      case 'donation': {
        navigate(`/admin/donations?highlight=${result.id}`);
        break;
      }
      case 'contact': {
        navigate(`/admin/contacts?highlight=${result.id}`);
        break;
      }
    }
  };

  const totalResults = results
    ? results.members.length + results.donations.length + results.contacts.length
    : 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => results && setIsOpen(true)}
          placeholder="Search members, donations, messages..."
          className="w-full rounded-lg border bg-gray-50 py-2 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-wiria-blue-dark"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="search-results"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        {isLoading && (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400"
            role="status"
            aria-live="polite"
          >
            <span className="sr-only">Loading results...</span>
            ⏳
          </span>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && results && (
        <div
          id="search-results"
          role="listbox"
          aria-live="polite"
          aria-atomic="true"
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-96 overflow-y-auto rounded-lg border bg-white shadow-xl"
        >
          <SearchResultsList
            results={results}
            totalResults={totalResults}
            onResultClick={handleResultClick}
          />
        </div>
      )}
    </div>
  );
}
