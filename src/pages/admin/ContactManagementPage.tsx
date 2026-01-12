import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  getContacts,
  respondToContact,
  archiveContact,
  Contact,
} from '@/features/admin/api/contacts.api';
import { DataTable, Column } from '@/shared/components/ui/DataTable';
import { useAdminData, useAdminAction } from '@/shared/hooks/useAdminData';
import { MessageDetailsModal } from '@/features/admin/components/contacts/modals/MessageDetailsModal';
import { ReplyModal } from '@/features/admin/components/contacts/modals/ReplyModal';

const STATUS_COLORS: Record<string, string> = {
  NEW: 'bg-yellow-100 text-yellow-700',
  READ: 'bg-blue-100 text-blue-700',
  RESPONDED: 'bg-green-100 text-green-700',
  ARCHIVED: 'bg-gray-100 text-gray-500',
};

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
    if (confirm('Are you sure you want to archive this message?')) archiveAction.mutate(id);
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  const columns: Column<Contact>[] = [
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
      render: (c) => (
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[c.status]}`}
        >
          {c.status}
        </span>
      ),
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

  const pendingCount = contacts.filter((c) => c.status === 'NEW').length;

  return (
    <div className="space-y-8">
      <header className="flex items-start justify-between rounded-2xl border border-gray-100 bg-gray-50/50 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Contact Messages</h1>
          <p className="mt-1 font-medium text-gray-500">
            Manage and respond to community inquiries from the contact form.
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 rounded-xl border border-yellow-100 bg-yellow-50 px-4 py-2 shadow-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-600" />
            <span className="text-sm font-bold text-yellow-700">
              {pendingCount} new message{pendingCount > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </header>

      <div className="flex w-fit flex-wrap items-center gap-2 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
        {[
          { label: 'All', value: '' },
          { label: 'New', value: 'NEW' },
          { label: 'Responded', value: 'RESPONDED' },
          { label: 'Archived', value: 'ARCHIVED' },
        ].map((filter) => (
          <button
            key={filter.value}
            onClick={() => setStatusFilter(filter.value)}
            className={`rounded-xl px-6 py-2 text-sm font-bold transition-all ${statusFilter === filter.value ? 'bg-wiria-blue-dark text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-wiria-blue-dark'}`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <DataTable
        columns={columns}
        data={contacts}
        rowKey="id"
        isLoading={isLoading}
        emptyMessage="No messages found for this category."
        rowClassName={(c) => (c.status === 'NEW' ? 'bg-yellow-50/30' : '')}
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
    </div>
  );
}
