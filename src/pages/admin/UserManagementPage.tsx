import { useState } from 'react';

import {
  AdminUser,
  UserInvitation,
  cancelInvitation,
  getInvitations,
  getUsers,
  updateUserStatus,
} from '@/features/admin/api/users.api';
import { AdminPageHeader } from '@/features/admin/components/layout/AdminPageHeader';
import { InviteUserModal } from '@/features/admin/components/users/modals/InviteUserModal';
import { getInviteColumns, getUserColumns } from '@/features/admin/components/users/UserTableColumns';
import { Button } from '@/shared/components/ui/Button';
import { Card, CardBody } from '@/shared/components/ui/Card';
import { DataTable } from '@/shared/components/ui/DataTable';
import { useAdminAction, useAdminData } from '@/shared/hooks/useAdminData';

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

  const userColumns = getUserColumns(handleStatusChange);
  const inviteColumns = getInviteColumns(handleCancelInvite);

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
