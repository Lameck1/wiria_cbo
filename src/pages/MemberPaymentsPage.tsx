import { useEffect } from 'react';
import { PortalLayout } from '@/features/membership/components/PortalLayout';
import { useMemberData } from '@/features/membership/hooks/useMemberData';
import { Card, CardBody, CardHeader } from '@/shared/components/ui/Card';
import { Spinner } from '@/shared/components/ui/Spinner';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';

function MemberPaymentsPage() {
  const { payments, isLoading, totalPayments, pendingPayments, fetchPayments } = useMemberData();

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

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
          <Card className="border-none shadow-sm">
            <CardBody className="p-6">
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-500">Total Paid</p>
              <p className="text-3xl font-bold text-wiria-blue-dark">
                KES {totalPayments.toLocaleString()}
              </p>
            </CardBody>
          </Card>
          <Card className="border-none shadow-sm">
            <CardBody className="p-6">
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-500">Total Transactions</p>
              <p className="text-3xl font-bold text-wiria-blue-dark">{payments.length}</p>
            </CardBody>
          </Card>
          <Card className="border-none shadow-sm">
            <CardBody className="p-6">
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-500">Pending Payments</p>
              <p className="text-3xl font-bold text-yellow-600">{pendingPayments}</p>
            </CardBody>
          </Card>
        </div>

        {/* Payments List */}
        <Card className="border-none shadow-sm">
          <CardHeader className="border-b bg-gray-50/50 p-6">
            <h2 className="text-xl font-bold text-wiria-blue-dark">Transaction History</h2>
          </CardHeader>
          <CardBody className="p-0">
            {payments.length === 0 ? (
              <div className="py-20 text-center">
                <div className="mb-6 text-6xl opacity-20">💳</div>
                <p className="text-gray-500">No payment records found</p>
              </div>
            ) : (
              <div className="divide-y">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="p-6 transition-colors hover:bg-gray-50/80"
                  >
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-wiria-blue-dark/5 text-2xl shadow-inner">
                          {payment.type === 'REGISTRATION'
                            ? '📝'
                            : payment.type === 'RENEWAL'
                              ? '🔄'
                              : '❤️'}
                        </div>
                        <div className="space-y-1">
                          <p className="text-lg font-bold capitalize text-gray-900 leading-tight">
                            {payment.type.toLowerCase().replace('_', ' ')} Payment
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(payment.createdAt).toLocaleDateString('en-KE', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })} •{' '}
                            {payment.method === 'STK_PUSH' ? 'M-Pesa STK Push' : 'Manual Deposit'}
                          </p>
                          {payment.mpesaReceiptNumber && (
                            <p className="inline-flex rounded-lg bg-gray-100 px-2 py-0.5 text-xs font-mono text-gray-600">
                              Receipt: {payment.mpesaReceiptNumber}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-row items-center justify-between gap-6 md:flex-col md:items-end md:justify-center md:gap-2">
                        <StatusBadge status={payment.status} />
                        <p className="text-2xl font-bold text-wiria-blue-dark">
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
