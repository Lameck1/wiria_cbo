import { useState } from 'react';

import {
  AdminUser,
  UserInvitation,
  getUsers,
  getInvitations,
  updateUserStatus,
  cancelInvitation,
  inviteUser,
} from '@/features/admin/api/users.api';
import { AdminPageHeader } from '@/features/admin/components/layout/AdminPageHeader';
import { Button } from '@/shared/components/ui/Button';
import { Card, CardBody } from '@/shared/components/ui/Card';
import { DataTable, Column } from '@/shared/components/ui/DataTable';
import { Modal } from '@/shared/components/ui/Modal';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';
import { useAdminData, useAdminAction } from '@/shared/hooks/useAdminData';
import { notificationService } from '@/shared/services/notification/notificationService';
import { UserRole } from '@/shared/types';
import { getErrorMessage } from '@/shared/utils/apiUtils';
import { formatDate } from '@/shared/utils/dateUtils';

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'PENDING'>('ACTIVE');
  const [showInviteModal, setShowInviteModal] = useState(false);

  const { items: users, isLoading: isLoadingUsers } = useAdminData<AdminUser>(['users'], getUsers, {
    enabled: activeTab === 'ACTIVE',
  });

  const { items: invitations, isLoading: isLoadingInvites } = useAdminData<UserInvitation>(
    ['invitations'],
    getInvitations,
    { enabled: activeTab === 'PENDING' }
  );

  const updateStatusAction = useAdminAction(
    ({ email, status }: { email: string; status: string }) => updateUserStatus(email, status),
    [['users']],
    { successMessage: 'User status updated' }
  );

  const cancelInviteAction = useAdminAction(
    (id: string) => cancelInvitation(id),
    [['invitations']],
    { successMessage: 'Invitation cancelled' }
  );

  const handleStatusChange = (email: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) return;
    updateStatusAction.mutate({ email, status: newStatus });
  };

  const handleCancelInvite = (id: string) => {
    if (!window.confirm('Cancel this invitation?')) return;
    cancelInviteAction.mutate(id);
  };

  const userColumns: Column<AdminUser>[] = [
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
          onClick={() => handleStatusChange(u.email, u.status)}
          className={`text-sm font-bold transition-colors hover:underline ${u.status === 'ACTIVE' ? 'text-red-500 hover:text-red-700' : 'text-green-600 hover:text-green-800'
            }`}
        >
          {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
        </button>
      ),
    },
  ];

  const inviteColumns: Column<UserInvitation>[] = [
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
          onClick={() => handleCancelInvite(index.id)}
          className="text-sm font-bold text-red-500 transition-colors hover:text-red-700 hover:underline"
        >
          Cancel
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="User Management"
        description="Manage system administrators and staff invitations."
      >
        <Button onClick={() => setShowInviteModal(true)}>
          + Invite User
        </Button>
      </AdminPageHeader>

      <Card className="overflow-hidden border-none shadow-sm">
        <CardBody className="p-0">
          {/* Tabs */}
          <div className="flex border-b bg-gray-50/50">
            <button
              className={`px-8 py-4 text-sm font-bold transition-all ${activeTab === 'ACTIVE'
                ? 'border-b-2 border-wiria-blue-dark bg-white text-wiria-blue-dark'
                : 'text-gray-500 hover:bg-gray-100/50 hover:text-gray-700'
                }`}
              onClick={() => setActiveTab('ACTIVE')}
            >
              Active Users
            </button>
            <button
              className={`px-8 py-4 text-sm font-bold transition-all ${activeTab === 'PENDING'
                ? 'border-b-2 border-wiria-blue-dark bg-white text-wiria-blue-dark'
                : 'text-gray-500 hover:bg-gray-100/50 hover:text-gray-700'
                }`}
              onClick={() => setActiveTab('PENDING')}
            >
              Pending Invitations
            </button>
          </div>

          {activeTab === 'ACTIVE' ? (
            <DataTable
              columns={userColumns}
              data={users}
              isLoading={isLoadingUsers}
              rowKey="id"
              emptyMessage="No active users found."
              className="rounded-none border-none shadow-none"
            />
          ) : (
            <DataTable
              columns={inviteColumns}
              data={invitations}
              isLoading={isLoadingInvites}
              rowKey="id"
              emptyMessage="No pending invitations."
              className="rounded-none border-none shadow-none"
            />
          )}
        </CardBody>
      </Card>

      {showInviteModal && (
        <InviteUserModal
          onClose={() => setShowInviteModal(false)}
          onSuccess={() => {
            setShowInviteModal(false);
            setActiveTab('PENDING');
          }}
        />
      )}
    </div>
  );
}

function InviteUserModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const data = {
      email: formData.get('email') as string,
      role: formData.get('role') as UserRole,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
    };

    try {
      await inviteUser(data);
      notificationService.success(`Invitation sent to ${data.email}`);
      onSuccess();
    } catch (error: unknown) {
      const message = getErrorMessage(error, 'Failed to send invitation');
      if (message.includes('session is no longer valid')) {
        notificationService.error('Session expired: Please log out and back in.');
      } else {
        notificationService.error(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Invite New User" size="2xl">
      <form onSubmit={(e) => void handleSubmit(e)} className="space-y-6 p-2">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500" htmlFor="invite-email">
              Email Address *
            </label>
            <input
              id="invite-email"
              name="email"
              type="email"
              required
              placeholder="e.g. staff@wiria.org"
              className="w-full rounded-xl border-gray-200 bg-gray-50 p-3 outline-none focus:border-wiria-blue-dark focus:ring-2 focus:ring-wiria-blue-dark/20 transition-all"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500" htmlFor="invite-firstName"
            >
              First Name
            </label>
            <input
              id="invite-firstName"
              name="firstName"
              placeholder="e.g. Jane"
              className="w-full rounded-xl border-gray-200 bg-gray-50 p-3 outline-none focus:border-wiria-blue-dark focus:ring-2 focus:ring-wiria-blue-dark/20 transition-all"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500" htmlFor="invite-lastName">
              Last Name
            </label>
            <input
              id="invite-lastName"
              name="lastName"
              placeholder="e.g. Doe"
              className="w-full rounded-xl border-gray-200 bg-gray-50 p-3 outline-none focus:border-wiria-blue-dark focus:ring-2 focus:ring-wiria-blue-dark/20 transition-all"
              disabled={isLoading}
            />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500" htmlFor="invite-role">
              System Role *
            </label>
            <select
              id="invite-role"
              name="role"
              required
              className="w-full rounded-xl border-gray-200 bg-gray-50 p-3 outline-none focus:border-wiria-blue-dark focus:ring-2 focus:ring-wiria-blue-dark/20 transition-all appearance-none"
              disabled={isLoading}
            >
              <option value="">Select a role...</option>
              <option value={UserRole.STAFF}>Staff Member</option>
              <option value={UserRole.ADMIN}>Administrator</option>
              <option value={UserRole.VOLUNTEER}>Volunteer Coordinator</option>
              <option value={UserRole.SUPER_ADMIN}>Super Administrator</option>
            </select>
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <Button type="submit" fullWidth isLoading={isLoading} className="h-12 text-lg">
            Send Invitation
          </Button>
          <Button
            type="button"
            variant="outline"
            fullWidth
            onClick={onClose}
            disabled={isLoading}
            className="h-12 text-lg"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
