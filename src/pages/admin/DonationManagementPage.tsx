/**
 * Donation Management Page
 * Admin view for managing donations
 */

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  getDonations,
  getDonationStatistics,
  Donation,
  DonationStatistics,
} from '@/features/admin/api/donations.api';
import { notificationService } from '@/shared/services/notification/notificationService';

const STATUS_COLORS: Record<string, string> = {
  COMPLETED: 'bg-green-100 text-green-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  PROCESSING: 'bg-blue-100 text-blue-700',
  FAILED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-100 text-gray-700',
  REFUNDED: 'bg-purple-100 text-purple-700',
};

export default function DonationManagementPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [statistics, setStatistics] = useState<DonationStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const highlightId = searchParams.get('highlight');

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [donationsRes, statsRes] = await Promise.all([
        getDonations(statusFilter ? { status: statusFilter } : undefined),
        getDonationStatistics(),
      ]);
      setDonations(donationsRes);
      setStatistics(statsRes);
    } catch (error) {
      console.error(error);
      notificationService.error('Failed to load donations');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    if (!highlightId) return;

    const target = donations.find((d: Donation) => d.id === highlightId);
    if (!target) return;

    setSelectedDonation(target);

    const next = new URLSearchParams(searchParams);
    next.delete('highlight');
    setSearchParams(next, { replace: true });
  }, [donations, highlightId, searchParams, setSearchParams]);

  const formatCurrency = (amount: number) => `KES ${amount.toLocaleString()}`;
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div>
      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold text-wiria-blue-dark">Donation Management</h2>
        <p className="text-gray-600">View and manage all donations received by WIRIA CBO.</p>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border-l-4 border-green-500 bg-white p-6 shadow">
            <p className="text-xs font-bold uppercase text-gray-500">Total Raised</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(statistics.totalAmount)}
            </p>
            <p className="text-xs text-gray-400">{statistics.total} donations</p>
          </div>
          <div className="rounded-xl border-l-4 border-blue-500 bg-white p-6 shadow">
            <p className="text-xs font-bold uppercase text-gray-500">This Month</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(statistics.thisMonthAmount || 0)}
            </p>
            <p className="text-xs text-gray-400">{statistics.thisMonth || 0} donations</p>
          </div>
          <div className="rounded-xl border-l-4 border-yellow-500 bg-white p-6 shadow">
            <p className="text-xs font-bold uppercase text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-gray-900">{statistics.pending}</p>
          </div>
          <div className="rounded-xl border-l-4 border-red-500 bg-white p-6 shadow">
            <p className="text-xs font-bold uppercase text-gray-500">Failed</p>
            <p className="text-2xl font-bold text-gray-900">{statistics.failed || 0}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <label htmlFor="donation-status-filter" className="sr-only">
          Filter donations by status
        </label>
        <select
          id="donation-status-filter"
          aria-label="Filter donations by status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border px-4 py-2"
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

      {/* Donations Table */}
      <div className="overflow-hidden rounded-xl bg-white shadow">
        {isLoading ? (
          <div className="p-8 text-center">Loading donations...</div>
        ) : donations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No donations found.</div>
        ) : (
          <table className="w-full border-collapse text-left">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-4">Donor</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {donations.map((donation) => (
                <tr key={donation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-semibold">
                      {donation.isAnonymous ? 'Anonymous' : donation.donorName}
                    </div>
                    {!donation.isAnonymous && (
                      <div className="text-xs text-gray-500">{donation.donorEmail}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-bold text-green-600">
                    {formatCurrency(donation.amount)}
                  </td>
                  <td className="px-6 py-4 text-sm capitalize">
                    {donation.paymentMethod.replace('_', ' ').toLowerCase()}
                  </td>
                  <td className="px-6 py-4 text-sm">{formatDate(donation.createdAt)}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-bold ${STATUS_COLORS[donation.status] || 'bg-gray-100'}`}
                    >
                      {donation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setSelectedDonation(donation)}
                      className="text-sm font-bold text-wiria-blue-dark hover:underline"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Donation Details Modal */}
      {selectedDonation && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b p-6">
              <h3 className="text-xl font-bold">Donation Details</h3>
              <button
                onClick={() => setSelectedDonation(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4 p-6">
              <div className="grid grid-cols-2 gap-4">
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
                    <div>
                      <p className="text-xs font-bold uppercase text-gray-500">Email</p>
                      <p>{selectedDonation.donorEmail}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-gray-500">Phone</p>
                      <p>{selectedDonation.donorPhone}</p>
                    </div>
                  </>
                )}
                <div>
                  <p className="text-xs font-bold uppercase text-gray-500">Payment Method</p>
                  <p className="capitalize">
                    {selectedDonation.paymentMethod.replace('_', ' ').toLowerCase()}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-gray-500">Status</p>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-bold ${STATUS_COLORS[selectedDonation.status]}`}
                  >
                    {selectedDonation.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-gray-500">Date</p>
                  <p>{formatDate(selectedDonation.createdAt)}</p>
                </div>
                {selectedDonation.mpesaReceiptNumber && (
                  <div>
                    <p className="text-xs font-bold uppercase text-gray-500">M-Pesa Receipt</p>
                    <p className="font-mono">{selectedDonation.mpesaReceiptNumber}</p>
                  </div>
                )}
              </div>
              {selectedDonation.message && (
                <div>
                  <p className="mb-1 text-xs font-bold uppercase text-gray-500">Message</p>
                  <p className="rounded-lg bg-gray-50 p-3 text-sm">{selectedDonation.message}</p>
                </div>
              )}
            </div>
            <div className="border-t p-6">
              <button
                onClick={() => setSelectedDonation(null)}
                className="w-full rounded-lg bg-gray-100 py-3 font-bold text-gray-700 transition-colors hover:bg-gray-200"
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
