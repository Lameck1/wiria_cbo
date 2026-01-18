/**
 * Dashboard API Service
 * Aggregates statistics from multiple backend endpoints for the admin dashboard
 */

import { apiClient } from '@/shared/services/api/client';
import { logger } from '@/shared/services/logger';
import { extractData } from '@/shared/utils/apiUtils';

// Types for dashboard statistics
export interface MemberStats {
  total: number;
  active: number;
  pending: number;
  expired: number;
}

export interface DonationStats {
  total: number;
  totalAmount: number;
  completed: number;
  pending: number;
  thisMonth: number;
  thisMonthAmount: number;
}

export interface ContactStats {
  total: number;
  unread: number;
  responded: number;
  pending: number;
}

export interface SafeguardingStats {
  total: number;
  open: number;
  investigating: number;
  resolved: number;
  critical: number;
}

export interface ApplicationStats {
  total: number;
  pending: number;
  underReview: number;
  shortlisted: number;
  accepted: number;
  rejected: number;
}

export interface TenderStats {
  total: number;
  open: number;
  closed: number;
}

export interface NewsStats {
  total: number;
  published: number;
  draft: number;
}

export interface DashboardStats {
  members: MemberStats;
  donations: DonationStats;
  contacts: ContactStats;
  safeguarding: SafeguardingStats;
  applications: ApplicationStats;
  tenders: TenderStats;
  news: NewsStats;
  recentApplications: RecentApplication[];
  recentDonations: RecentDonation[];
  recentMessages: RecentMessage[];
}

export interface RecentApplication {
  id: string;
  name: string;
  type: string;
  position: string;
  date: string;
  status: string;
}

export interface RecentDonation {
  id: string;
  donor: string;
  amount: number;
  date: string;
  status: string;
}

export interface RecentMessage {
  id: string;
  name: string;
  subject: string;
  date: string;
  status: string;
}

/**
 * Aggregates all dashboard statistics into a single response
 * Uses the optimized consolidated endpoint /admin/statistics
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const statsResponse = await apiClient.get('/admin/statistics');
    const statsData = extractData<DashboardStats>(statsResponse);

    if (!statsData) {
      throw new Error('Missing dashboard statistics data');
    }

    return {
      members: statsData.members,
      donations: statsData.donations,
      contacts: statsData.contacts,
      safeguarding: statsData.safeguarding,
      applications: statsData.applications,
      tenders: statsData.tenders,
      news: statsData.news,
      recentApplications: statsData.recentApplications ?? [],
      recentDonations: statsData.recentDonations ?? [],
      recentMessages: statsData.recentMessages ?? [],
    };
  } catch (error) {
    logger.error('Failed to fetch consolidated dashboard stats:', error);
    throw new Error('Failed to load dashboard statistics. Please refresh the page.');
  }
};
