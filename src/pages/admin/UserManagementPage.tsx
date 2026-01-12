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
import { Button } from '@/shared/components/ui/Button';
import { DataTable, Column } from '@/shared/components/ui/DataTable';
import { useAdminData, useAdminAction } from '@/shared/hooks/useAdminData';
import { notificationService } from '@/shared/services/notification/notificationService';
import { UserRole } from '@/shared/types';
import { Modal } from '@/shared/components/ui/Modal';
import { getErrorMessage } from '@/shared/utils/apiUtils';

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

  const handleStatusChange = async (email: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    if (!confirm(`Are you sure you want to change status to ${newStatus}?`)) return;
    updateStatusAction.mutate({ email, status: newStatus });
  };

  const handleCancelInvite = async (id: string) => {
    if (!confirm('Cancel this invitation?')) return;
    cancelInviteAction.mutate(id);
  };

  const userColumns: Column<AdminUser>[] = [
    { header: 'Name', key: 'name', render: (u) => `${u.firstName} ${u.lastName}` },
    { header: 'Email', key: 'email' },
    {
      header: 'Role',
      key: 'role',
      render: (u) => {
        const styles: Record<string, string> = {
          SUPER_ADMIN: 'bg-purple-100 text-purple-700',
          ADMIN: 'bg-blue-100 text-blue-700',
          STAFF: 'bg-green-100 text-green-700',
          VOLUNTEER: 'bg-orange-100 text-orange-700',
        };
        return (
          <span
            className={`rounded-full px-2 py-1 text-xs font-bold ${styles[u.role] || 'bg-gray-100'}`}
          >
            {u.role}
          </span>
        );
      },
    },
    {
      header: 'Status',
      key: 'status',
      render: (u) => (
        <span
          className={`inline-flex items-center gap-2 ${u.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'}`}
        >
          <span
            className={`h-2 w-2 rounded-full ${u.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'}`}
          />
          {u.status}
        </span>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      align: 'right',
      render: (u) => (
        <button
          onClick={() => handleStatusChange(u.email, u.status)}
          className={`text-sm font-semibold hover:underline ${u.status === 'ACTIVE' ? 'text-red-600' : 'text-green-600'}`}
        >
          {u.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
        </button>
      ),
    },
  ];

  const inviteColumns: Column<UserInvitation>[] = [
    { header: 'Email', key: 'email' },
    { header: 'Role', key: 'role' },
    { header: 'Invited By', key: 'inviter', render: (i) => i.inviter?.email || 'N/A' },
    {
      header: 'Expires',
      key: 'expiresAt',
      render: (i) => new Date(i.expiresAt).toLocaleDateString(),
    },
    {
      header: 'Actions',
      key: 'actions',
      align: 'right',
      render: (i) => (
        <button
          onClick={() => handleCancelInvite(i.id)}
          className="text-sm font-semibold text-red-600 hover:text-red-800"
        >
          Cancel
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-wiria-blue-dark">Staff & Admin Management</h1>
          <p className="mt-1 text-gray-600">Manage staff accounts, roles, and permissions</p>
        </div>
        <Button onClick={() => setShowInviteModal(true)}>
          <span className="mr-2">+</span> Invite New User
        </Button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-4 border-b">
        <button
          className={`border-b-2 px-4 py-2 font-semibold transition-colors ${activeTab === 'ACTIVE' ? 'border-wiria-blue-dark text-wiria-blue-dark' : 'border-transparent text-gray-600 hover:text-wiria-blue-dark'}`}
          onClick={() => setActiveTab('ACTIVE')}
        >
          Active Users
        </button>
        <button
          className={`border-b-2 px-4 py-2 font-semibold transition-colors ${activeTab === 'PENDING' ? 'border-wiria-blue-dark text-wiria-blue-dark' : 'border-transparent text-gray-600 hover:text-wiria-blue-dark'}`}
          onClick={() => setActiveTab('PENDING')}
        >
          Pending Invitations
        </button>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow">
        {activeTab === 'ACTIVE' ? (
          <DataTable
            columns={userColumns}
            data={users}
            isLoading={isLoadingUsers}
            rowKey="id"
            emptyMessage="No active users found."
          />
        ) : (
          <DataTable
            columns={inviteColumns}
            data={invitations}
            isLoading={isLoadingInvites}
            rowKey="id"
            emptyMessage="No pending invitations."
          />
        )}
      </div>

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
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
      <form onSubmit={handleSubmit} className="p-2">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-bold" htmlFor="invite-email">
              Email *
            </label>
            <input
              id="invite-email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border p-2"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold" htmlFor="invite-firstName">
              First Name
            </label>
            <input
              id="invite-firstName"
              name="firstName"
              className="w-full rounded-lg border p-2"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold" htmlFor="invite-lastName">
              Last Name
            </label>
            <input
              id="invite-lastName"
              name="lastName"
              className="w-full rounded-lg border p-2"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-bold" htmlFor="invite-role">
              Role *
            </label>
            <select
              id="invite-role"
              name="role"
              required
              className="w-full rounded-lg border p-2"
              disabled={isLoading}
            >
              <option value="">Select a role...</option>
              <option value={UserRole.STAFF}>Staff</option>
              <option value={UserRole.ADMIN}>Admin</option>
              <option value={UserRole.VOLUNTEER}>Volunteer</option>
              <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
            </select>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Invitation'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
