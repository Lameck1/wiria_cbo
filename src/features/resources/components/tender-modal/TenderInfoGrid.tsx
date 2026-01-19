import type { Tender } from '@/features/resources/hooks/useTenders';

interface TenderInfoGridProps {
  tender: Tender;
  deadlineDate: Date;
}

export const TenderInfoGrid = ({ tender, deadlineDate }: TenderInfoGridProps) => (
  <div className="grid grid-cols-2 gap-4 rounded-lg bg-gray-50 p-4">
    <div>
      <p className="text-xs uppercase text-gray-500">Category</p>
      <p className="font-semibold text-gray-700">{tender.category}</p>
    </div>
    <div>
      <p className="text-xs uppercase text-gray-500">Estimated Value</p>
      <p className="font-semibold text-gray-700">{tender.estimatedValue}</p>
    </div>
    <div>
      <p className="text-xs uppercase text-gray-500">Deadline</p>
      <p className="font-semibold text-red-600">
        {deadlineDate.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </p>
    </div>
    <div>
      <p className="text-xs uppercase text-gray-500">Status</p>
      <span
        className={`inline-block rounded px-2 py-1 text-xs font-semibold ${
          tender.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
        }`}
      >
        {tender.status}
      </span>
    </div>
  </div>
);
