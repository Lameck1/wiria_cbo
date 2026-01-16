import { useReducer } from 'react';

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
import { ConfirmDialog } from '@/shared/components/modals/ConfirmDialog';
import { useAdminAction, useAdminData } from '@/shared/hooks/useAdminData';

type HRState = {
  activeTab: HRTab;
  selectedCareer: Career | null;
  selectedOpportunity: Opportunity | null;
  selectedApplication: Application | null;
  showCareerModal: boolean;
  showOpportunityModal: boolean;
  showApplicationModal: boolean;
  careerIdToDelete: string | null;
  opportunityIdToDelete: string | null;
};

type HRAction =
  | { type: 'SET_TAB'; tab: HRTab }
  | { type: 'OPEN_CAREER_MODAL'; career: Career | null }
  | { type: 'OPEN_OPPORTUNITY_MODAL'; opportunity: Opportunity | null }
  | { type: 'OPEN_APPLICATION_MODAL'; application: Application }
  | { type: 'CLOSE_CAREER_MODAL' }
  | { type: 'CLOSE_OPPORTUNITY_MODAL' }
  | { type: 'CLOSE_APPLICATION_MODAL' }
  | { type: 'SET_CAREER_ID_TO_DELETE'; id: string | null }
  | { type: 'SET_OPPORTUNITY_ID_TO_DELETE'; id: string | null };

function hrReducer(state: HRState, action: HRAction): HRState {
  switch (action.type) {
    case 'SET_TAB':
      return { ...state, activeTab: action.tab };
    case 'OPEN_CAREER_MODAL':
      return {
        ...state,
        selectedCareer: action.career,
        showCareerModal: true,
      };
    case 'OPEN_OPPORTUNITY_MODAL':
      return {
        ...state,
        selectedOpportunity: action.opportunity,
        showOpportunityModal: true,
      };
    case 'OPEN_APPLICATION_MODAL':
      return {
        ...state,
        selectedApplication: action.application,
        showApplicationModal: true,
      };
    case 'CLOSE_CAREER_MODAL':
      return {
        ...state,
        selectedCareer: null,
        showCareerModal: false,
      };
    case 'CLOSE_OPPORTUNITY_MODAL':
      return {
        ...state,
        selectedOpportunity: null,
        showOpportunityModal: false,
      };
    case 'CLOSE_APPLICATION_MODAL':
      return {
        ...state,
        selectedApplication: null,
        showApplicationModal: false,
      };
    case 'SET_CAREER_ID_TO_DELETE':
      return {
        ...state,
        careerIdToDelete: action.id,
      };
    case 'SET_OPPORTUNITY_ID_TO_DELETE':
      return {
        ...state,
        opportunityIdToDelete: action.id,
      };
    default:
      return state;
  }
}

export default function HRManagementPage() {
  const [state, dispatch] = useReducer(
    hrReducer,
    {
      activeTab: 'CAREERS',
      selectedCareer: null,
      selectedOpportunity: null,
      selectedApplication: null,
      showCareerModal: false,
      showOpportunityModal: false,
      showApplicationModal: false,
      careerIdToDelete: null,
      opportunityIdToDelete: null,
    }
  );

  const {
    activeTab,
    selectedCareer,
    selectedOpportunity,
    selectedApplication,
    showCareerModal,
    showOpportunityModal,
    showApplicationModal,
    careerIdToDelete,
    opportunityIdToDelete,
  } = state;

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
    dispatch({ type: 'SET_CAREER_ID_TO_DELETE', id });
  };

  const handleDeleteOpp = (id: string) => {
    dispatch({ type: 'SET_OPPORTUNITY_ID_TO_DELETE', id });
  };

  const handleConfirmDeleteCareer = () => {
    if (!careerIdToDelete) return;
    deleteCareerAction.mutate(careerIdToDelete);
    dispatch({ type: 'SET_CAREER_ID_TO_DELETE', id: null });
  };

  const handleConfirmDeleteOpp = () => {
    if (!opportunityIdToDelete) return;
    deleteOppAction.mutate(opportunityIdToDelete);
    dispatch({ type: 'SET_OPPORTUNITY_ID_TO_DELETE', id: null });
  };

  const handleReviewApplication = (app: Application) => {
    dispatch({ type: 'OPEN_APPLICATION_MODAL', application: app });
  };

  const isLoading = isLoadingCareers || isLoadingOpps || isLoadingApps;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="HR & Talent Management"
        description="Manage job postings, volunteer opportunities, and applications"
      >
        <HRTabs
          activeTab={activeTab}
          setActiveTab={(tab) => {
            dispatch({ type: 'SET_TAB', tab });
          }}
        />
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
                  dispatch({ type: 'OPEN_CAREER_MODAL', career: c });
                }}
                onDelete={handleDeleteCareer}
                onCreate={() => {
                  dispatch({ type: 'OPEN_CAREER_MODAL', career: null });
                }}
              />
            )}
            {activeTab === 'OPPORTUNITIES' && (
              <OpportunitiesTab
                opportunities={opportunities}
                applications={applications}
                onEdit={(o) => {
                  dispatch({ type: 'OPEN_OPPORTUNITY_MODAL', opportunity: o });
                }}
                onDelete={handleDeleteOpp}
                onCreate={() => {
                  dispatch({ type: 'OPEN_OPPORTUNITY_MODAL', opportunity: null });
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
          dispatch({ type: 'CLOSE_CAREER_MODAL' });
        }}
        showOpportunityModal={showOpportunityModal}
        selectedOpportunity={selectedOpportunity}
        onCloseOpportunityModal={() => {
          dispatch({ type: 'CLOSE_OPPORTUNITY_MODAL' });
        }}
        showApplicationModal={showApplicationModal}
        selectedApplication={selectedApplication}
        onCloseApplicationModal={() => {
          dispatch({ type: 'CLOSE_APPLICATION_MODAL' });
        }}
      />
      <ConfirmDialog
        isOpen={careerIdToDelete !== null}
        title="Delete Job Posting"
        message="Are you sure you want to delete this job posting? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleConfirmDeleteCareer}
        onCancel={() => {
          dispatch({ type: 'SET_CAREER_ID_TO_DELETE', id: null });
        }}
      />
      <ConfirmDialog
        isOpen={opportunityIdToDelete !== null}
        title="Delete Opportunity"
        message="Are you sure you want to delete this opportunity? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleConfirmDeleteOpp}
        onCancel={() => {
          dispatch({ type: 'SET_OPPORTUNITY_ID_TO_DELETE', id: null });
        }}
      />
    </div>
  );
}
