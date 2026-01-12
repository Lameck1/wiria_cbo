/**
 * Global Search Component
 * Search across members, donations, and contacts
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/shared/services/api/client';

interface SearchResult {
  id: string;
  type: 'member' | 'donation' | 'contact';
  // Member fields
  firstName?: string;
  lastName?: string;
  memberNumber?: string;
  // Donation fields
  donorName?: string;
  amount?: number;
  status?: string;
  // Contact fields
  name?: string;
  subject?: string;
  email?: string;
}

interface SearchResults {
  members: SearchResult[];
  donations: SearchResult[];
  contacts: SearchResult[];
}

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await apiClient.get<SearchResults>(
          `/admin/search?q=${encodeURIComponent(query)}`
        );
        setResults(data);
        setIsOpen(true);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    setQuery('');
    // Navigate to the specific item using query params for highlighting
    switch (result.type) {
      case 'member':
        // Just pass the ID, don't filter - let the page load all and find the member
        navigate(`/admin/members?highlight=${result.id}`);
        break;
      case 'donation':
        navigate(`/admin/donations?highlight=${result.id}`);
        break;
      case 'contact':
        navigate(`/admin/contacts?highlight=${result.id}`);
        break;
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
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results && setIsOpen(true)}
          placeholder="Search members, donations, messages..."
          className="w-full rounded-lg border bg-gray-50 py-2 pl-10 pr-4 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-wiria-blue-dark"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        {isLoading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400">
            ⏳
          </span>
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && results && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-96 overflow-y-auto rounded-lg border bg-white shadow-xl">
          {totalResults === 0 ? (
            <div className="p-4 text-center text-gray-500">No results found</div>
          ) : (
            <>
              {results.members.length > 0 && (
                <div>
                  <div className="bg-gray-50 px-3 py-2 text-xs font-bold uppercase text-gray-500">
                    Members ({results.members.length})
                  </div>
                  {results.members.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => handleResultClick(m)}
                      className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-gray-100"
                    >
                      <span className="text-lg">👤</span>
                      <div>
                        <div className="font-semibold">
                          {m.firstName} {m.lastName}
                        </div>
                        <div className="text-xs text-gray-500">{m.memberNumber}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {results.donations.length > 0 && (
                <div>
                  <div className="bg-gray-50 px-3 py-2 text-xs font-bold uppercase text-gray-500">
                    Donations ({results.donations.length})
                  </div>
                  {results.donations.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => handleResultClick(d)}
                      className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-gray-100"
                    >
                      <span className="text-lg">💰</span>
                      <div>
                        <div className="font-semibold">{d.donorName}</div>
                        <div className="text-xs text-gray-500">
                          KES {d.amount?.toLocaleString()}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {results.contacts.length > 0 && (
                <div>
                  <div className="bg-gray-50 px-3 py-2 text-xs font-bold uppercase text-gray-500">
                    Messages ({results.contacts.length})
                  </div>
                  {results.contacts.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleResultClick(c)}
                      className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-gray-100"
                    >
                      <span className="text-lg">✉️</span>
                      <div>
                        <div className="font-semibold">{c.name}</div>
                        <div className="truncate text-xs text-gray-500">{c.subject}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
