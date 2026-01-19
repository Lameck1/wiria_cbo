import { useEffect, useState, useMemo, useCallback } from 'react';

import { useSearchParams } from 'react-router-dom';

import type { Donation, DonationStatistics } from '@/features/admin/api/donations.api';
import { getDonations, getDonationStatistics } from '@/features/admin/api/donations.api';
import { DonationDetailsModal } from '@/features/admin/components/donations/DonationDetailsModal';
import { DonationStatsGrid } from '@/features/admin/components/donations/DonationStatsGrid';
import { getDonationColumns } from '@/features/admin/components/donations/DonationTableColumns';
import { AdminPageHeader } from '@/features/admin/components/layout/AdminPageHeader';
import { Card, CardBody } from '@/shared/components/ui/Card';
import { DataTable } from '@/shared/components/ui/DataTable';
import { useAdminData } from '@/shared/hooks/useAdminData';

export default function DonationManagementPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedDonationId, setSelectedDonationId] = useState<string | null>(null);
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

  const statistics = statsList[0] ?? null;

  const selectedDonation: Donation | null = useMemo(
    () => donations.find((donation) => donation.id === selectedDonationId) ?? null,
    [donations, selectedDonationId]
  );

  const handleViewDetails = useCallback((donation: Donation) => {
    setSelectedDonationId(donation.id);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedDonationId(null);
  }, []);

  useEffect(() => {
    if (!highlightId || donations.length === 0) return;

    const exists = donations.some((d: Donation) => d.id === highlightId);
    if (!exists) return;

    setSelectedDonationId(highlightId);

    const next = new URLSearchParams(searchParams);
    next.delete('highlight');
    setSearchParams(next, { replace: true });
  }, [donations, highlightId, searchParams, setSearchParams]);

  const columns = useMemo(() => getDonationColumns(handleViewDetails), [handleViewDetails]);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Donation Management"
        description="View and manage all donations received by WIRIA CBO."
      />

      <DonationStatsGrid statistics={statistics} isLoading={isLoadingStats} />

      <Card className="overflow-hidden border-none shadow-sm">
        <CardBody className="p-0">
          <div className="border-b p-4">
            <select
              title="Filter by status"
              aria-label="Filter donations by status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
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

      <DonationDetailsModal donation={selectedDonation} onClose={handleCloseModal} />
    </div>
  );
}
