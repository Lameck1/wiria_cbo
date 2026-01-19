import type { SearchResult } from '../types'; // I need to define types or export them

interface SearchResultsListProps {
  results: {
    members: SearchResult[];
    donations: SearchResult[];
    contacts: SearchResult[];
  };
  totalResults: number;
  onResultClick: (result: SearchResult) => void;
}

export function SearchResultsList({ results, totalResults, onResultClick }: SearchResultsListProps) {
  if (totalResults === 0) {
    return <div className="p-4 text-center text-gray-500">No results found</div>;
  }

  return (
    <>
      {results.members.length > 0 && (
        <div>
          <div className="bg-gray-50 px-3 py-2 text-xs font-bold uppercase text-gray-500">
            Members ({results.members.length})
          </div>
          {results.members.map((m) => (
            <button
              key={m.id}
              onClick={() => onResultClick(m)}
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
              onClick={() => onResultClick(d)}
              className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-gray-100"
            >
              <span className="text-lg">💰</span>
              <div>
                <div className="font-semibold">{d.donorName}</div>
                <div className="text-xs text-gray-500">KES {d.amount?.toLocaleString()}</div>
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
              onClick={() => onResultClick(c)}
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
  );
}
