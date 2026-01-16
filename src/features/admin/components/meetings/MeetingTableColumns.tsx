import { Meeting } from '@/features/admin/api/meetings.api';
import { Column } from '@/shared/components/ui/DataTable';

import { STATUS_COLORS, TYPE_LABELS, formatDate } from './constants';

export const getMeetingColumns = (
  onViewAttendance: (meeting: Meeting) => void
): Column<Meeting>[] => [
  { header: 'Meeting', key: 'title', className: 'font-semibold' },
  {
    header: 'Type',
    key: 'meetingType',
    render: (m) => <span className="text-sm">{TYPE_LABELS[m.meetingType]}</span>,
  },
  {
    header: 'Date',
    key: 'date',
    render: (m) => <span className="text-sm">{formatDate(m.date)}</span>,
  },
  {
    header: 'Attendance',
    key: 'attendanceCount',
    render: (m) => <span className="text-sm">{m.attendanceCount ?? 0} members</span>,
  },
  {
    header: 'Status',
    key: 'status',
    render: (m) => (
      <span className={`rounded-full px-2 py-1 text-xs font-bold ${STATUS_COLORS[m.status]}`}>
        {m.status.replace('_', ' ')}
      </span>
    ),
  },
  {
    header: 'Actions',
    key: 'actions',
    align: 'right',
    render: (m) => (
      <button
        onClick={() => void onViewAttendance(m)}
        className="text-sm font-bold text-wiria-blue-dark hover:underline"
      >
        View Attendance
      </button>
    ),
  },
];
