export interface SearchResult {
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

export interface SearchResults {
  members: SearchResult[];
  donations: SearchResult[];
  contacts: SearchResult[];
}
