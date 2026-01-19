import { useState } from 'react';

import type { AdminUser, UserInvitation } from '@/features/admin/api/users.api';
import { cancelInvitation, getInvitations, getUsers, updateUserStatus } from '@/features/admin/api/users.api';
import { AdminPageHeader } from '@/features/admin/components/layout/AdminPageHeader';
import { InviteUserModal } from '@/features/admin/components/users/modals/InviteUserModal';
import {
  getInviteColumns,
  getUserColumns,
} from '@/features/admin/components/users/UserTableColumns';
import { ConfirmDialog } from '@/shared/components/modals/ConfirmDialog';
import { Button } from '@/shared/components/ui/Button';
import { Card, CardBody } from '@/shared/components/ui/Card';
import { DataTable } from '@/shared/components/ui/DataTable';
import { useAdminAction, useAdminData } from '@/shared/hooks/useAdminData';
import { notificationService } from '@/shared/services/notification/notificationService';

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'PENDING'>('ACTIVE');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [statusChangeEmail, setStatusChangeEmail] = useState<string | null>(null);
  const [statusChangeNextStatus, setStatusChangeNextStatus] = useState<string | null>(null);
  const [invitationIdToCancel, setInvitationIdToCancel] = useState<string | null>(null);

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
    {
      onSuccess: () => {
        notificationService.success('User status updated');
      },
      onError: () => {
        notificationService.error('Failed to update user status');
      },
    }
  );

  const cancelInviteAction = useAdminAction(
    (id: string) => cancelInvitation(id),
    [['invitations']],
    {
      onSuccess: () => {
        notificationService.success('Invitation cancelled');
      },
      onError: () => {
        notificationService.error('Failed to cancel invitation');
      },
    }
  );

  const handleStatusChange = (email: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    setStatusChangeEmail(email);
    setStatusChangeNextStatus(newStatus);
  };

  const handleConfirmStatusChange = () => {
    if (!statusChangeEmail || !statusChangeNextStatus) return;
    updateStatusAction.mutate({ email: statusChangeEmail, status: statusChangeNextStatus });
    setStatusChangeEmail(null);
    setStatusChangeNextStatus(null);
  };

  const handleCancelInvite = (id: string) => {
    setInvitationIdToCancel(id);
  };

  const handleConfirmCancelInvite = () => {
    if (!invitationIdToCancel) return;
    cancelInviteAction.mutate(invitationIdToCancel);
    setInvitationIdToCancel(null);
  };

  const userColumns = getUserColumns(handleStatusChange);
  const inviteColumns = getInviteColumns(handleCancelInvite);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="User Management"
        description="Manage system administrators and staff invitations."
      >
        <Button onClick={() => setShowInviteModal(true)}>+ Invite User</Button>
      </AdminPageHeader>

      <Card className="overflow-hidden border-none shadow-sm">
        <CardBody className="p-0">
          {/* Tabs */}
          <div className="flex border-b bg-gray-50/50">
            <button
              className={`px-8 py-4 text-sm font-bold transition-all ${
                activeTab === 'ACTIVE'
                  ? 'border-b-2 border-wiria-blue-dark bg-white text-wiria-blue-dark'
                  : 'text-gray-500 hover:bg-gray-100/50 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('ACTIVE')}
            >
              Active Users
            </button>
            <button
              className={`px-8 py-4 text-sm font-bold transition-all ${
                activeTab === 'PENDING'
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
      <ConfirmDialog
        isOpen={statusChangeEmail !== null && statusChangeNextStatus !== null}
        title="Change User Status"
        message={`Are you sure you want to change status to ${statusChangeNextStatus}?`}
        confirmLabel="Change Status"
        onConfirm={handleConfirmStatusChange}
        onCancel={() => {
          setStatusChangeEmail(null);
          setStatusChangeNextStatus(null);
        }}
      />
      <ConfirmDialog
        isOpen={invitationIdToCancel !== null}
        title="Cancel Invitation"
        message="Cancel this invitation?"
        confirmLabel="Cancel Invitation"
        onConfirm={handleConfirmCancelInvite}
        onCancel={() => setInvitationIdToCancel(null)}
      />
    </div>
  );
}
