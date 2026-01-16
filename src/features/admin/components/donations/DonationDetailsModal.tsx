import type { Donation } from '@/features/admin/api/donations.api';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';
import { formatDateTime } from '@/shared/utils/dateUtils';
import { formatCurrency } from '@/shared/utils/helpers';

interface DonationDetailsModalProps {
  donation: Donation | null;
  onClose: () => void;
}

export function DonationDetailsModal({ donation, onClose }: DonationDetailsModalProps) {
  if (!donation) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-6">
          <h3 className="text-xl font-bold text-wiria-blue-dark">Donation Details</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        <div className="space-y-6 p-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-bold uppercase text-gray-500">Donor Name</p>
              <p className="font-semibold">
                {donation.isAnonymous ? 'Anonymous' : donation.donorName}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-gray-500">Amount</p>
              <p className="text-xl font-bold text-green-600">{formatCurrency(donation.amount)}</p>
            </div>
            {!donation.isAnonymous && (
              <>
                <div className="col-span-2">
                  <p className="text-xs font-bold uppercase text-gray-500">Email & Phone</p>
                  <p className="text-sm">
                    {donation.donorEmail} • {donation.donorPhone}
                  </p>
                </div>
              </>
            )}
            <div>
              <p className="text-xs font-bold uppercase text-gray-500">Payment Method</p>
              <p className="text-sm capitalize">
                {donation.paymentMethod.replace('_', ' ').toLowerCase()}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-gray-500">Status</p>
              <StatusBadge status={donation.status} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-gray-500">Date</p>
              <p className="text-sm">{formatDateTime(donation.createdAt)}</p>
            </div>
            {donation.mpesaReceiptNumber && (
              <div>
                <p className="text-xs font-bold uppercase text-gray-500">M-Pesa Receipt</p>
                <p className="font-mono text-xs">{donation.mpesaReceiptNumber}</p>
              </div>
            )}
          </div>
          {donation.message && (
            <div className="rounded-xl bg-gray-50 p-4">
              <p className="mb-2 text-xs font-bold uppercase text-gray-500">Message</p>
              <p className="text-sm italic text-gray-600">"{donation.message}"</p>
            </div>
          )}
        </div>
        <div className="border-t p-6">
          <button
            onClick={onClose}
            className="w-full rounded-xl bg-gray-900 py-3 font-bold text-white shadow-lg transition-all hover:bg-black"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
