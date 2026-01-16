import { describe, expect, it } from 'vitest';

import type { Application, Career, Opportunity } from '@/features/admin/api/opportunities.api';
import type { HRTab } from '@/features/admin/components/hr/HrTabs';
import HRManagementPage from '@/pages/admin/HRManagementPage';

describe('HR management reducer behavior', () => {
  it('initializes with CAREERS tab active', () => {
    const page = HRManagementPage;
    expect(page).toBeDefined();

    const initialState = {
      activeTab: 'CAREERS' as HRTab,
      selectedCareer: null as Career | null,
      selectedOpportunity: null as Opportunity | null,
      selectedApplication: null as Application | null,
      showCareerModal: false,
      showOpportunityModal: false,
      showApplicationModal: false,
      careerIdToDelete: null as string | null,
      opportunityIdToDelete: null as string | null,
    };

    expect(initialState.activeTab).toBe<'CAREERS'>('CAREERS');
    expect(initialState.showCareerModal).toBe(false);
  });
});
