import { useState } from 'react';

import {
  Career,
  deleteCareer,
  getAdminCareers as getCareers,
} from '@/features/admin/api/careers.api';
import {
  Application,
  deleteOpportunity,
  getApplications,
  getAdminOpportunities as getOpportunities,
  Opportunity,
} from '@/features/admin/api/opportunities.api';
import { ApplicationsList, CareersTab, OpportunitiesTab } from '@/features/admin/components/hr';
import { HRModals } from '@/features/admin/components/hr/HrModals';
import { HRTab, HRTabs } from '@/features/admin/components/hr/HrTabs';
import { AdminPageHeader } from '@/features/admin/components/layout/AdminPageHeader';
import { useAdminAction, useAdminData } from '@/shared/hooks/useAdminData';
import { ConfirmDialog } from '@/shared/components/modals/ConfirmDialog';

export default function HRManagementPage() {
  const [activeTab, setActiveTab] = useState<HRTab>('CAREERS');
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showCareerModal, setShowCareerModal] = useState(false);
  const [showOpportunityModal, setShowOpportunityModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [careerIdToDelete, setCareerIdToDelete] = useState<string | null>(null);
  const [opportunityIdToDelete, setOpportunityIdToDelete] = useState<string | null>(null);

  // Data Fetching
  const { items: careers, isLoading: isLoadingCareers } = useAdminData<Career>(
    ['careers'],
    getCareers,
    { enabled: activeTab === 'CAREERS' || activeTab === 'APPLICATIONS' }
  );
  const { items: opportunities, isLoading: isLoadingOpps } = useAdminData<Opportunity>(
    ['opportunities'],
    getOpportunities,
    { enabled: activeTab === 'OPPORTUNITIES' || activeTab === 'APPLICATIONS' }
  );
  const { items: applications, isLoading: isLoadingApps } = useAdminData<Application>(
    ['applications'],
    getApplications
  );

  // Actions
  const deleteCareerAction = useAdminAction((id: string) => deleteCareer(id), [['careers']], {
    successMessage: 'Job posting deleted',
  });
  const deleteOppAction = useAdminAction(
    (id: string) => deleteOpportunity(id),
    [['opportunities']],
    { successMessage: 'Opportunity deleted' }
  );

  const handleDeleteCareer = (id: string) => {
    setCareerIdToDelete(id);
  };

  const handleDeleteOpp = (id: string) => {
    setOpportunityIdToDelete(id);
  };

  const handleConfirmDeleteCareer = () => {
    if (!careerIdToDelete) return;
    deleteCareerAction.mutate(careerIdToDelete);
    setCareerIdToDelete(null);
  };

  const handleConfirmDeleteOpp = () => {
    if (!opportunityIdToDelete) return;
    deleteOppAction.mutate(opportunityIdToDelete);
    setOpportunityIdToDelete(null);
  };

  const handleReviewApplication = (app: Application) => {
    setSelectedApplication(app);
    setShowApplicationModal(true);
  };

  const isLoading = isLoadingCareers || isLoadingOpps || isLoadingApps;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="HR & Talent Management"
        description="Manage job postings, volunteer opportunities, and applications"
      >
        <HRTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </AdminPageHeader>

      <main className="min-h-[400px]">
        {isLoading ? (
          <div className="flex items-center justify-center p-20">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-wiria-blue-dark"></div>
          </div>
        ) : (
          <>
            {activeTab === 'CAREERS' && (
              <CareersTab
                careers={careers}
                applications={applications}
                onEdit={(c) => {
                  setSelectedCareer(c);
                  setShowCareerModal(true);
                }}
                onDelete={handleDeleteCareer}
                onCreate={() => {
                  setSelectedCareer(null);
                  setShowCareerModal(true);
                }}
              />
            )}
            {activeTab === 'OPPORTUNITIES' && (
              <OpportunitiesTab
                opportunities={opportunities}
                applications={applications}
                onEdit={(o) => {
                  setSelectedOpportunity(o);
                  setShowOpportunityModal(true);
                }}
                onDelete={handleDeleteOpp}
                onCreate={() => {
                  setSelectedOpportunity(null);
                  setShowOpportunityModal(true);
                }}
              />
            )}
            {activeTab === 'APPLICATIONS' && (
              <ApplicationsList applications={applications} onReview={handleReviewApplication} />
            )}
          </>
        )}
      </main>
      <HRModals
        showCareerModal={showCareerModal}
        selectedCareer={selectedCareer}
        onCloseCareerModal={() => {
          setShowCareerModal(false);
          setSelectedCareer(null);
        }}
        showOpportunityModal={showOpportunityModal}
        selectedOpportunity={selectedOpportunity}
        onCloseOpportunityModal={() => {
          setShowOpportunityModal(false);
          setSelectedOpportunity(null);
        }}
        showApplicationModal={showApplicationModal}
        selectedApplication={selectedApplication}
        onCloseApplicationModal={() => {
          setShowApplicationModal(false);
          setSelectedApplication(null);
        }}
      />
      <ConfirmDialog
        isOpen={careerIdToDelete !== null}
        title="Delete Job Posting"
        message="Are you sure you want to delete this job posting? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleConfirmDeleteCareer}
        onCancel={() => setCareerIdToDelete(null)}
      />
      <ConfirmDialog
        isOpen={opportunityIdToDelete !== null}
        title="Delete Opportunity"
        message="Are you sure you want to delete this opportunity? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleConfirmDeleteOpp}
        onCancel={() => setOpportunityIdToDelete(null)}
      />
    </div>
  );
}
