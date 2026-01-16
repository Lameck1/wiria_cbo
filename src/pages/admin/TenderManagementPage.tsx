import { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { Tender, getTenders, deleteTender } from '@/features/admin/api/tenders.api';
import { TenderModal } from '@/features/admin/components/tenders/modals/TenderModal';
import { ConfirmDialog } from '@/shared/components/modals/ConfirmDialog';
import { Button } from '@/shared/components/ui/Button';
import { DataTable, Column } from '@/shared/components/ui/DataTable';
import { useAdminData, useAdminAction } from '@/shared/hooks/useAdminData';

export default function TenderManagementPage() {
  const queryClient = useQueryClient();
  const { items: tenders, isLoading } = useAdminData<Tender>(['tenders', { all: true }], () =>
    getTenders({ all: true })
  );
  const deleteAction = useAdminAction((id: string) => deleteTender(id), [['tenders']], {
    successMessage: 'Tender deleted successfully',
    onSuccess: () => { void queryClient.invalidateQueries({ queryKey: ['tenders'] }); },
  });

  const [editingTender, setEditingTender] = useState<Tender | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [tenderIdToDelete, setTenderIdToDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setTenderIdToDelete(id);
  };

  const handleConfirmDelete = () => {
    if (!tenderIdToDelete) return;
    deleteAction.mutate(tenderIdToDelete);
    setTenderIdToDelete(null);
  };

  const columns: Column<Tender>[] = [
    { header: 'Ref No', key: 'refNo', className: 'font-mono text-xs' },
    { header: 'Title', key: 'title', className: 'font-semibold' },
    {
      header: 'Deadline',
      key: 'deadline',
      render: (t) => <span className="text-sm">{new Date(t.deadline).toLocaleDateString()}</span>,
    },
    {
      header: 'Document',
      key: 'downloadUrl',
      render: (t) =>
        t.downloadUrl ? (
          <span className="inline-flex items-center gap-1 rounded bg-green-100 px-2 py-0.5 text-[10px] font-bold uppercase text-green-700">
            ✓ Uploaded
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded bg-yellow-100 px-2 py-0.5 text-[10px] font-bold uppercase text-yellow-700">
            ⚠ Missing
          </span>
        ),
    },
    {
      header: 'Status',
      key: 'status',
      render: (t) => <TenderStatusBadge tender={t} />,
    },
    {
      header: 'Actions',
      key: 'actions',
      align: 'right',
      render: (t) => (
        <div className="flex justify-end gap-3">
          <button
            onClick={() => {
              setEditingTender(t);
              setShowModal(true);
            }}
            className="text-sm font-bold text-wiria-blue-dark hover:underline"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(t.id)}
            className="text-sm font-bold text-red-600 hover:underline"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/50 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Tender Management</h1>
          <p className="mt-1 font-medium text-gray-500">
            Advertise and manage organization procurement opportunities.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingTender(null);
            setShowModal(true);
          }}
        >
          + Advertise New Tender
        </Button>
      </header>

      <DataTable
        columns={columns}
        data={tenders}
        rowKey="id"
        isLoading={isLoading}
        emptyMessage="No tenders advertised yet."
      />

      {showModal && (
        <TenderModal
          tender={editingTender}
          onClose={() => setShowModal(false)}
          onSuccess={() => setShowModal(false)}
        />
      )}
      <ConfirmDialog
        isOpen={tenderIdToDelete !== null}
        title="Delete Tender"
        message="Are you sure you want to delete this tender?"
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setTenderIdToDelete(null)}
      />
    </div>
  );
}

function TenderStatusBadge({ tender }: { tender: Tender }) {
  const isExpired = tender.status === 'OPEN' && new Date(tender.deadline) < new Date();
  const status = isExpired ? 'EXPIRED' : tender.status;

  const styles: Record<string, string> = {
    OPEN: 'bg-green-100 text-green-700',
    CLOSED: 'bg-red-100 text-red-700',
    AWARDED: 'bg-blue-100 text-blue-700',
    CANCELLED: 'bg-gray-100 text-gray-700',
    EXPIRED: 'bg-yellow-100 text-yellow-700',
  };
  return (
    <span
      className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${styles[status] ?? 'bg-gray-100'}`}
    >
      {status}
    </span>
  );
}
