import type { Career } from '@/features/admin/api/careers.api';
import type { Application, Opportunity } from '@/features/admin/api/opportunities.api';
import { ApplicationReviewModal } from '@/features/admin/components/applications/ApplicationReviewModal';
import { CareerModal } from '@/features/admin/components/hr/modals/CareerModal';
import { OpportunityModal } from '@/features/admin/components/hr/modals/OpportunityModal';

interface HRModalsProps {
  showCareerModal: boolean;
  selectedCareer: Career | null;
  onCloseCareerModal: () => void;

  showOpportunityModal: boolean;
  selectedOpportunity: Opportunity | null;
  onCloseOpportunityModal: () => void;

  showApplicationModal: boolean;
  selectedApplication: Application | null;
  onCloseApplicationModal: () => void;
}

export function HRModals({
  showCareerModal,
  selectedCareer,
  onCloseCareerModal,
  showOpportunityModal,
  selectedOpportunity,
  onCloseOpportunityModal,
  showApplicationModal,
  selectedApplication,
  onCloseApplicationModal,
}: HRModalsProps) {
  return (
    <>
      {showCareerModal && (
        <CareerModal
          career={selectedCareer}
          onClose={onCloseCareerModal}
          onSuccess={onCloseCareerModal}
        />
      )}

      {showOpportunityModal && (
        <OpportunityModal
          opportunity={selectedOpportunity}
          onClose={onCloseOpportunityModal}
          onSuccess={onCloseOpportunityModal}
        />
      )}

      {showApplicationModal && selectedApplication && (
        <ApplicationReviewModal
          application={selectedApplication}
          onClose={onCloseApplicationModal}
          onSuccess={onCloseApplicationModal}
        />
      )}
    </>
  );
}
