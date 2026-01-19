import type { Tender } from '@/features/resources/hooks/useTenders';

export const TenderSubmissionInfo = ({ tender }: { tender: Tender }) => (
  <div className="space-y-3 rounded-lg bg-wiria-blue-dark/5 p-4">
    <h4 className="font-semibold text-wiria-blue-dark">Submission Information</h4>
    <div className="space-y-2 text-sm text-gray-600">
      <p>
        <span className="font-medium">Method:</span> {tender.submissionMethod}
      </p>
      <p>
        <span className="font-medium">Address:</span> {tender.submissionAddress}
      </p>
      <p>
        <span className="font-medium">Email:</span>{' '}
        <a href={`mailto:${tender.submissionEmail}`} className="text-wiria-blue-dark hover:underline">
          {tender.submissionEmail}
        </a>
      </p>
      <p>
        <span className="font-medium">Contact:</span> {tender.contactPerson} ({tender.contactPhone})
      </p>
    </div>
  </div>
);
