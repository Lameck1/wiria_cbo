import { AdminUser, UserInvitation } from '@/features/admin/api/users.api';
import { Column } from '@/shared/components/ui/DataTable';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';
import { formatDate } from '@/shared/utils/dateUtils';

export const getUserColumns = (
  onStatusChange: (email: string, status: string) => void
): Column<AdminUser>[] => [
  {
    header: 'User',
    key: 'name',
    render: (u) => (
      <div>
        <div className="font-semibold text-gray-900">{`${u.firstName} ${u.lastName}`}</div>
        <div className="text-xs text-gray-500">{u.email}</div>
      </div>
    ),
  },
  {
    header: 'Role',
    key: 'role',
    render: (u) => <StatusBadge status={u.role} />,
  },
  {
    header: 'Status',
    key: 'status',
    render: (u) => <StatusBadge status={u.status} />,
  },
  {
    header: 'Actions',
    key: 'actions',
    align: 'right',
    render: (u) => (
      <button
        onClick={() => onStatusChange(u.email, u.status)}
        className={`text-sm font-bold transition-colors hover:underline ${
          u.status === 'ACTIVE' ? 'text-red-500 hover:text-red-700' : 'text-green-600 hover:text-green-800'
        }`}
      >
        {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
      </button>
    ),
  },
];

export const getInviteColumns = (
  onCancel: (id: string) => void
): Column<UserInvitation>[] => [
  { header: 'Email', key: 'email', className: 'font-medium' },
  {
    header: 'Role',
    key: 'role',
    render: (index) => <StatusBadge status={index.role} />,
  },
  { header: 'Invited By', key: 'inviter', render: (index) => index.inviter?.email ?? 'N/A' },
  {
    header: 'Expires',
    key: 'expiresAt',
    render: (index) => <span className="text-sm">{formatDate(index.expiresAt)}</span>,
  },
  {
    header: 'Actions',
    key: 'actions',
    align: 'right',
    render: (index) => (
      <button
        onClick={() => onCancel(index.id)}
        className="text-sm font-bold text-red-500 transition-colors hover:text-red-700 hover:underline"
      >
        Cancel
      </button>
    ),
  },
];
