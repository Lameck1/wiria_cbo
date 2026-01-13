import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  getDonations,
  getDonationStatistics,
  Donation,
  DonationStatistics,
} from '@/features/admin/api/donations.api';
import { AdminPageHeader } from '@/features/admin/components/layout/AdminPageHeader';
import { DataTable, Column } from '@/shared/components/ui/DataTable';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';
import { useAdminData } from '@/shared/hooks/useAdminData';
import { Card, CardBody } from '@/shared/components/ui/Card';
import { Spinner } from '@/shared/components/ui/Spinner';
import { formatCurrency } from '@/shared/utils/helpers';
import { formatDateTime } from '@/shared/utils/dateUtils';

export default function DonationManagementPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const highlightId = searchParams.get('highlight');

  const { items: donations, isLoading: isLoadingDonations } = useAdminData<Donation>(
    ['donations', statusFilter],
    () => getDonations(statusFilter ? { status: statusFilter } : undefined)
  );

  const { items: statsList, isLoading: isLoadingStats } = useAdminData<DonationStatistics>(
    ['donation-stats'],
    async () => {
      const stats = await getDonationStatistics();
      return [stats]; // useAdminData expects an array
    }
  );

  const statistics = statsList[0] || null;

  useEffect(() => {
    if (!highlightId || donations.length === 0) return;

    const target = donations.find((d: Donation) => d.id === highlightId);
    if (!target) return;

    setSelectedDonation(target);

    const next = new URLSearchParams(searchParams);
    next.delete('highlight');
    setSearchParams(next, { replace: true });
  }, [donations, highlightId, searchParams, setSearchParams]);

  const columns = useMemo<Column<Donation>[]>(
    () => [
      {
        header: 'Donor',
        key: 'donorName',
        render: (d) => (
          <div>
            <div className="font-semibold">{d.isAnonymous ? 'Anonymous' : d.donorName}</div>
            {!d.isAnonymous && <div className="text-xs text-gray-500">{d.donorEmail}</div>}
          </div>
        ),
      },
      {
        header: 'Amount',
        key: 'amount',
        render: (d) => (
          <span className="font-bold text-green-600">{formatCurrency(d.amount)}</span>
        ),
      },
      {
        header: 'Method',
        key: 'paymentMethod',
        render: (d) => (
          <span className="text-sm capitalize">{d.paymentMethod.replace('_', ' ').toLowerCase()}</span>
        ),
      },
      {
        header: 'Date',
        key: 'createdAt',
        render: (d) => <span className="text-sm">{formatDateTime(d.createdAt)}</span>,
      },
      {
        header: 'Status',
        key: 'status',
        render: (d) => <StatusBadge status={d.status} />,
      },
      {
        header: 'Actions',
        key: 'actions',
        align: 'right',
        render: (d) => (
          <button
            onClick={() => setSelectedDonation(d)}
            className="text-sm font-bold text-wiria-blue-dark hover:underline"
          >
            View Details
          </button>
        ),
      },
    ],
    []
  );

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Donation Management"
        description="View and manage all donations received by WIRIA CBO."
      />

      {/* Statistics Cards */}
      {isLoadingStats ? (
        <div className="flex justify-center p-8">
          <Spinner />
        </div>
      ) : (
        statistics && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-l-4 border-l-green-500 shadow-sm">
              <CardBody className="p-6">
                <p className="text-xs font-bold uppercase text-gray-500">Total Raised</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(statistics.totalAmount)}
                </p>
                <p className="text-xs text-gray-400">{statistics.total} donations</p>
              </CardBody>
            </Card>
            <Card className="border-l-4 border-l-blue-500 shadow-sm">
              <CardBody className="p-6">
                <p className="text-xs font-bold uppercase text-gray-500">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(statistics.thisMonthAmount || 0)}
                </p>
                <p className="text-xs text-gray-400">{statistics.thisMonth || 0} donations</p>
              </CardBody>
            </Card>
            <Card className="border-l-4 border-l-yellow-500 shadow-sm">
              <CardBody className="p-6">
                <p className="text-xs font-bold uppercase text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.pending}</p>
              </CardBody>
            </Card>
            <Card className="border-l-4 border-l-red-500 shadow-sm">
              <CardBody className="p-6">
                <p className="text-xs font-bold uppercase text-gray-500">Failed</p>
                <p className="text-2xl font-bold text-gray-900">{statistics.failed || 0}</p>
              </CardBody>
            </Card>
          </div>
        )
      )}

      {/* Filters and Table */}
      <Card className="overflow-hidden border-none shadow-sm">
        <CardBody className="p-0">
          <div className="border-b p-4">
            <select
              title="Filter by status"
              aria-label="Filter donations by status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-wiria-blue-dark/20"
            >
              <option value="">All Statuses</option>
              <option value="COMPLETED">Completed</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="FAILED">Failed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>

          <DataTable
            columns={columns}
            data={donations}
            isLoading={isLoadingDonations}
            emptyMessage="No donations found."
            rowKey="id"
          />
        </CardBody>
      </Card>

      {/* Donation Details Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-6">
              <h3 className="text-xl font-bold text-wiria-blue-dark">Donation Details</h3>
              <button
                onClick={() => setSelectedDonation(null)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="space-y-6 p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-bold uppercase text-gray-500">Donor Name</p>
                  <p className="font-semibold">
                    {selectedDonation.isAnonymous ? 'Anonymous' : selectedDonation.donorName}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-gray-500">Amount</p>
                  <p className="text-xl font-bold text-green-600">
                    {formatCurrency(selectedDonation.amount)}
                  </p>
                </div>
                {!selectedDonation.isAnonymous && (
                  <>
                    <div className="col-span-2">
                      <p className="text-xs font-bold uppercase text-gray-500">Email & Phone</p>
                      <p className="text-sm">
                        {selectedDonation.donorEmail} • {selectedDonation.donorPhone}
                      </p>
                    </div>
                  </>
                )}
                <div>
                  <p className="text-xs font-bold uppercase text-gray-500">Payment Method</p>
                  <p className="text-sm capitalize">
                    {selectedDonation.paymentMethod.replace('_', ' ').toLowerCase()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-gray-500">Status</p>
                  <StatusBadge status={selectedDonation.status} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-gray-500">Date</p>
                  <p className="text-sm">{formatDateTime(selectedDonation.createdAt)}</p>
                </div>
                {selectedDonation.mpesaReceiptNumber && (
                  <div>
                    <p className="text-xs font-bold uppercase text-gray-500">M-Pesa Receipt</p>
                    <p className="font-mono text-xs">{selectedDonation.mpesaReceiptNumber}</p>
                  </div>
                )}
              </div>
              {selectedDonation.message && (
                <div className="rounded-xl bg-gray-50 p-4">
                  <p className="mb-2 text-xs font-bold uppercase text-gray-500">Message</p>
                  <p className="text-sm italic text-gray-600">"{selectedDonation.message}"</p>
                </div>
              )}
            </div>
            <div className="border-t p-6">
              <button
                onClick={() => setSelectedDonation(null)}
                className="w-full rounded-xl bg-gray-900 py-3 font-bold text-white shadow-lg transition-all hover:bg-black"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
