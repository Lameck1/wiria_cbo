import { useEffect, useState } from 'react';

import { useSearchParams } from 'react-router-dom';

import type { Contact } from '@/features/admin/api/contacts.api';
import { archiveContact, getContacts, respondToContact } from '@/features/admin/api/contacts.api';
import { MessageDetailsModal } from '@/features/admin/components/contacts/modals/MessageDetailsModal';
import { ReplyModal } from '@/features/admin/components/contacts/modals/ReplyModal';
import { AdminPageHeader } from '@/features/admin/components/layout/AdminPageHeader';
import { ConfirmDialog } from '@/shared/components/modals/ConfirmDialog';
import type { Column } from '@/shared/components/ui/DataTable';
import { DataTable } from '@/shared/components/ui/DataTable';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';
import { useAdminAction, useAdminData } from '@/shared/hooks/useAdminData';

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-KE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function PendingBanner({ pendingCount }: { pendingCount: number }) {
  if (pendingCount <= 0) return null;
  return (
    <div className="flex items-center gap-2 rounded-xl border border-yellow-100 bg-yellow-50 px-4 py-2 shadow-sm">
      <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-600" />
      <span className="text-sm font-bold text-yellow-700">
        {pendingCount} new message{pendingCount > 1 ? 's' : ''}
      </span>
    </div>
  );
}

function StatusFilterBar({
  statusFilter,
  setStatusFilter,
}: {
  statusFilter: string;
  setStatusFilter: (value: string) => void;
}) {
  const filters = [
    { label: 'All', value: '' },
    { label: 'New', value: 'NEW' },
    { label: 'Responded', value: 'RESPONDED' },
    { label: 'Archived', value: 'ARCHIVED' },
  ];
  return (
    <div className="flex w-fit flex-wrap items-center gap-2 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => setStatusFilter(filter.value)}
          className={`rounded-xl px-6 py-2 text-sm font-bold transition-all ${
            statusFilter === filter.value
              ? 'bg-wiria-blue-dark text-white shadow-md'
              : 'text-gray-500 hover:bg-gray-50 hover:text-wiria-blue-dark'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

function getColumns(
  setSelectedContact: (c: Contact) => void,
  setShowReplyModal: (open: boolean) => void,
  handleArchive: (id: string) => void
): Column<Contact>[] {
  return [
    {
      header: 'Sender',
      key: 'name',
      render: (c) => (
        <div className="space-y-0.5">
          <p className="font-bold text-gray-900">{c.name}</p>
          <p className="max-w-[150px] truncate font-mono text-[10px] text-gray-400">{c.email}</p>
        </div>
      ),
    },
    { header: 'Subject', key: 'subject', className: 'font-medium text-gray-700' },
    {
      header: 'Date',
      key: 'createdAt',
      render: (c) => <span className="text-xs text-gray-500">{formatDate(c.createdAt)}</span>,
    },
    {
      header: 'Status',
      key: 'status',
      render: (c) => <StatusBadge status={c.status} />,
    },
    {
      header: 'Actions',
      key: 'actions',
      align: 'right',
      render: (c) => (
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setSelectedContact(c)}
            className="text-xs font-bold text-wiria-blue-dark hover:underline"
          >
            Details
          </button>
          {c.status === 'NEW' && (
            <button
              onClick={() => {
                setSelectedContact(c);
                setShowReplyModal(true);
              }}
              className="text-xs font-bold text-green-600 hover:underline"
            >
              Reply
            </button>
          )}
          {c.status !== 'ARCHIVED' && (
            <button
              onClick={() => handleArchive(c.id)}
              className="text-xs font-bold text-gray-400 transition-colors hover:text-red-500"
            >
              Archive
            </button>
          )}
        </div>
      ),
    },
  ];
}

export default function ContactManagementPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [statusFilter, setStatusFilter] = useState('');
  const highlightId = searchParams.get('highlight');

  const { items: contacts, isLoading } = useAdminData<Contact>(['contacts', statusFilter], () =>
    getContacts(statusFilter ? { status: statusFilter } : undefined)
  );

  const respondAction = useAdminAction(
    ({ id, text }: { id: string; text: string }) => respondToContact(id, text),
    [['contacts']],
    { successMessage: 'Reply sent successfully' }
  );

  const archiveAction = useAdminAction((id: string) => archiveContact(id), [['contacts']], {
    successMessage: 'Message archived',
  });

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [contactIdToArchive, setContactIdToArchive] = useState<string | null>(null);

  // Auto-open highlighted contact
  useEffect(() => {
    if (!isLoading && highlightId) {
      const target = contacts.find((c) => c.id === highlightId);
      if (target) {
        setSelectedContact(target);
        // Clear the param
        const nextParams = new URLSearchParams(searchParams);
        nextParams.delete('highlight');
        setSearchParams(nextParams, { replace: true });
      }
    }
  }, [highlightId, contacts, isLoading, searchParams, setSearchParams]);

  const handleReply = () => {
    if (!selectedContact || !replyText.trim()) return;
    respondAction.mutate(
      { id: selectedContact.id, text: replyText },
      {
        onSuccess: () => {
          setShowReplyModal(false);
          setReplyText('');
          setSelectedContact(null);
        },
      }
    );
  };

  const handleArchive = (id: string) => {
    setContactIdToArchive(id);
  };

  const handleConfirmArchive = () => {
    if (!contactIdToArchive) return;
    archiveAction.mutate(contactIdToArchive);
    setContactIdToArchive(null);
  };

  const columns = getColumns(
    (c: Contact) => setSelectedContact(c),
    (open: boolean) => setShowReplyModal(open),
    (id: string) => handleArchive(id)
  );

  const pendingCount = contacts.filter((c) => c.status === 'NEW').length;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Contact Messages"
        description="Manage and respond to community inquiries from the contact form."
      >
        <PendingBanner pendingCount={pendingCount} />
      </AdminPageHeader>

      <StatusFilterBar statusFilter={statusFilter} setStatusFilter={setStatusFilter} />

      <DataTable
        columns={columns}
        data={contacts}
        rowKey="id"
        isLoading={isLoading}
        emptyMessage="No messages found for this category."
        rowClassName={(c: Contact) => (c.status === 'NEW' ? 'bg-yellow-50/30' : '')}
      />

      {selectedContact && !showReplyModal && (
        <MessageDetailsModal
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onReply={() => setShowReplyModal(true)}
        />
      )}

      {showReplyModal && selectedContact && (
        <ReplyModal
          contact={selectedContact}
          replyText={replyText}
          isSubmitting={respondAction.isPending}
          setReplyText={setReplyText}
          onReply={handleReply}
          onCancel={() => {
            setShowReplyModal(false);
            setReplyText('');
          }}
        />
      )}
      <ConfirmDialog
        isOpen={contactIdToArchive !== null}
        title="Archive Message"
        message="Are you sure you want to archive this message?"
        confirmLabel="Archive"
        onConfirm={handleConfirmArchive}
        onCancel={() => setContactIdToArchive(null)}
      />
    </div>
  );
}
