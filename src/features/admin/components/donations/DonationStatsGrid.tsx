import { DonationStatistics } from '@/features/admin/api/donations.api';
import { Card, CardBody } from '@/shared/components/ui/Card';
import { Spinner } from '@/shared/components/ui/Spinner';
import { formatCurrency } from '@/shared/utils/helpers';

interface DonationStatsGridProps {
  statistics: DonationStatistics | null;
  isLoading: boolean;
}

export function DonationStatsGrid({ statistics, isLoading }: DonationStatsGridProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );
  }

  if (!statistics) {
    return null;
  }

  return (
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
  );
}
