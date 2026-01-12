/**
 * Member Payments Page
 * Payment history for logged-in members
 */

import { useEffect } from 'react';
import { PortalLayout } from '@/features/membership/components/PortalLayout';
import { useMemberData } from '@/features/membership/hooks/useMemberData';
import { Card, CardBody, CardHeader } from '@/shared/components/ui/Card';
import { Spinner } from '@/shared/components/ui/Spinner';

function MemberPaymentsPage() {
  const { payments, isLoading, totalPayments, pendingPayments, fetchPayments } = useMemberData();

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading && payments.length === 0) {
    return (
      <PortalLayout title="Payment History">
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout title="Payment History" subtitle="View all your payment transactions">
      <div className="max-w-5xl">
        {/* Summary Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardBody>
              <p className="mb-1 text-sm text-gray-500">Total Paid</p>
              <p className="text-2xl font-bold text-wiria-blue-dark">
                KES {totalPayments.toLocaleString()}
              </p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="mb-1 text-sm text-gray-500">Total Transactions</p>
              <p className="text-2xl font-bold text-wiria-blue-dark">{payments.length}</p>
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <p className="mb-1 text-sm text-gray-500">Pending Payments</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingPayments}</p>
            </CardBody>
          </Card>
        </div>

        {/* Payments List */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-bold text-wiria-blue-dark">Transaction History</h2>
          </CardHeader>
          <CardBody>
            {payments.length === 0 ? (
              <div className="py-12 text-center">
                <div className="mb-4 text-6xl">💳</div>
                <p className="text-gray-500">No payment records found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="rounded-xl bg-gray-50 p-4 transition-shadow hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-wiria-blue-dark/10 text-xl">
                          {payment.type === 'REGISTRATION'
                            ? '📝'
                            : payment.type === 'RENEWAL'
                              ? '🔄'
                              : '❤️'}
                        </div>
                        <div>
                          <p className="font-semibold capitalize text-gray-800">
                            {payment.type.toLowerCase().replace('_', ' ')} Payment
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(payment.createdAt).toLocaleDateString()} •{' '}
                            {payment.method === 'STK_PUSH' ? 'M-Pesa STK Push' : 'Manual'}
                          </p>
                          {payment.mpesaReceiptNumber && (
                            <p className="text-xs text-gray-400">
                              Receipt: {payment.mpesaReceiptNumber}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ${getStatusBadge(payment.status)}`}
                        >
                          {payment.status}
                        </span>
                        <p className="text-xl font-bold text-wiria-blue-dark">
                          KES {payment.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </PortalLayout>
  );
}

export default MemberPaymentsPage;
