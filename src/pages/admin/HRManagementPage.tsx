import { useState } from 'react';

import {
  getAdminCareers as getCareers,
  deleteCareer,
  Career,
} from '@/features/admin/api/careers.api';
import {
  getAdminOpportunities as getOpportunities,
  deleteOpportunity,
  Opportunity,
  getApplications,
  Application,
} from '@/features/admin/api/opportunities.api';
import { ApplicationReviewModal } from '@/features/admin/components/applications/ApplicationReviewModal';
import { CareersTab, OpportunitiesTab, ApplicationsList } from '@/features/admin/components/hr';
import { CareerModal } from '@/features/admin/components/hr/modals/CareerModal';
import { OpportunityModal } from '@/features/admin/components/hr/modals/OpportunityModal';
import { useAdminData, useAdminAction } from '@/shared/hooks/useAdminData';

type HRTab = 'CAREERS' | 'OPPORTUNITIES' | 'APPLICATIONS';

export default function HRManagementPage() {
  const [activeTab, setActiveTab] = useState<HRTab>('CAREERS');
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showCareerModal, setShowCareerModal] = useState(false);
  const [showOpportunityModal, setShowOpportunityModal] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

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
    if (confirm('Are you sure you want to delete this job posting?')) deleteCareerAction.mutate(id);
  };

  const handleDeleteOpp = (id: string) => {
    if (confirm('Are you sure you want to delete this opportunity?')) deleteOppAction.mutate(id);
  };

  const handleReviewApplication = (app: Application) => {
    setSelectedApplication(app);
    setShowApplicationModal(true);
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50/50 p-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            HR & Talent Management
          </h1>
          <p className="mt-1 font-medium text-gray-500">
            Manage job postings, volunteer opportunities, and applications
          </p>
        </div>
        <div className="flex gap-1 rounded-xl border border-gray-100 bg-white p-1 shadow-sm">
          {(['CAREERS', 'OPPORTUNITIES', 'APPLICATIONS'] as HRTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-lg px-6 py-2 text-sm font-bold transition-all ${activeTab === tab ? 'bg-wiria-blue-dark text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-wiria-blue-dark'}`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </header>

      <main className="min-h-[400px]">
        {isLoadingCareers || isLoadingOpps || isLoadingApps ? (
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

      {showCareerModal && (
        <CareerModal
          career={selectedCareer}
          onClose={() => {
            setShowCareerModal(false);
            setSelectedCareer(null);
          }}
          onSuccess={() => {
            setShowCareerModal(false);
            setSelectedCareer(null);
          }}
        />
      )}

      {showOpportunityModal && (
        <OpportunityModal
          opportunity={selectedOpportunity}
          onClose={() => {
            setShowOpportunityModal(false);
            setSelectedOpportunity(null);
          }}
          onSuccess={() => {
            setShowOpportunityModal(false);
            setSelectedOpportunity(null);
          }}
        />
      )}

      {showApplicationModal && selectedApplication && (
        <ApplicationReviewModal
          application={selectedApplication}
          onClose={() => {
            setShowApplicationModal(false);
            setSelectedApplication(null);
          }}
          onSuccess={() => {
            setShowApplicationModal(false);
            setSelectedApplication(null);
          }}
        />
      )}
    </div>
  );
}
