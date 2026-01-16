interface SafeguardingFiltersProps {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  priorityFilter: string;
  setPriorityFilter: (value: string) => void;
}

export function SafeguardingFilters({
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
}: SafeguardingFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <span className="px-2 text-xs font-bold uppercase tracking-widest text-gray-400">
        Filters:
      </span>
      <select
        value={statusFilter}
        onChange={(event) => setStatusFilter(event.target.value)}
        className="rounded-lg border-none bg-gray-50 px-4 py-2 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-wiria-blue-dark"
        aria-label="Filter by Status"
      >
        <option value="">All Statuses</option>
        <option value="PENDING">Pending</option>
        <option value="UNDER_REVIEW">Under Review</option>
        <option value="INVESTIGATING">Investigating</option>
        <option value="RESOLVED">Resolved</option>
        <option value="CLOSED">Closed</option>
      </select>
      <select
        value={priorityFilter}
        onChange={(event) => setPriorityFilter(event.target.value)}
        className="rounded-lg border-none bg-gray-50 px-4 py-2 text-sm font-medium outline-none transition-all focus:ring-2 focus:ring-wiria-blue-dark"
        aria-label="Filter by Priority"
      >
        <option value="">All Priorities</option>
        <option value="CRITICAL">Critical</option>
        <option value="HIGH">High</option>
        <option value="MEDIUM">Medium</option>
        <option value="LOW">Low</option>
      </select>
    </div>
  );
}
