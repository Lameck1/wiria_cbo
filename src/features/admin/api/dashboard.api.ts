/**
 * Dashboard API Service
 * Aggregates statistics from multiple backend endpoints for the admin dashboard
 */

import { apiClient } from '@/shared/services/api/client';
import { logger } from '@/shared/services/logger';
import { extractArray, extractData } from '@/shared/utils/apiUtils';

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

interface ApplicationResponse {
  id: string;
  firstName: string;
  lastName: string;
  type: string;
  career?: { title: string };
  opportunity?: { title: string };
  createdAt: string;
  status: string;
}

interface DonationResponse {
  id: string;
  donorName: string;
  amount: number;
  createdAt: string;
  status: string;
}

interface MessageResponse {
  id: string;
  name: string;
  subject: string;
  createdAt: string;
  status: string;
}

/**
 * Fetches recent applications for dashboard activity feed
 */
export const getRecentApplications = async (limit = 5): Promise<RecentApplication[]> => {
  try {
    const response = await apiClient.get('/admin/applications');
    const applications = extractArray<ApplicationResponse>(response);
    return applications.slice(0, limit).map((app) => ({
      id: app.id,
      name: `${app.firstName} ${app.lastName}`,
      type: app.type,
      position: app.career?.title ?? app.opportunity?.title ?? 'N/A',
      date: app.createdAt,
      status: app.status,
    }));
  } catch (error) {
    logger.error('Failed to fetch recent applications:', error);
    throw new Error('Failed to load recent applications. Please try again.');
  }
};

/**
 * Fetches recent donations for dashboard activity feed
 */
export const getRecentDonations = async (limit = 5): Promise<RecentDonation[]> => {
  try {
    const response = await apiClient.get('/donations');
    const donations = extractArray<DonationResponse>(response);
    return donations.slice(0, limit).map((d) => ({
      id: d.id,
      donor: d.donorName ?? 'Anonymous',
      amount: Number(d.amount),
      date: d.createdAt,
      status: d.status,
    }));
  } catch (error) {
    logger.error('Failed to fetch recent donations:', error);
    throw new Error('Failed to load recent donations. Please try again.');
  }
};

/**
 * Fetches recent messages for dashboard activity feed
 */
export const getRecentMessages = async (limit = 5): Promise<RecentMessage[]> => {
  try {
    const response = await apiClient.get('/contact');
    const messages = extractArray<MessageResponse>(response);
    return messages.slice(0, limit).map((m) => ({
      id: m.id,
      name: m.name,
      subject: m.subject,
      date: m.createdAt,
      status: m.status,
    }));
  } catch (error) {
    logger.error('Failed to fetch recent messages:', error);
    throw new Error('Failed to load recent messages. Please try again.');
  }
};

/**
 * Aggregates all dashboard statistics into a single response
 * Now uses the optimized consolidated endpoint /admin/statistics
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const [statsResponse, recentApps, recentDonations, recentMessages] = await Promise.allSettled([
      apiClient.get('/admin/statistics'),
      getRecentApplications(),
      getRecentDonations(),
      getRecentMessages(),
    ]);

    // Extract stats data
    const statsData =
      statsResponse.status === 'fulfilled'
        ? extractData<DashboardStats>(statsResponse.value)
        : null;
    if (!statsData) throw new Error('Missing dashboard statistics data');

    // Use fallback empty arrays for failed requests
    return {
      members: statsData.members,
      donations: statsData.donations,
      contacts: statsData.contacts,
      safeguarding: statsData.safeguarding,
      applications: statsData.applications,
      tenders: statsData.tenders,
      news: statsData.news,
      recentApplications: recentApps.status === 'fulfilled' ? recentApps.value : [],
      recentDonations: recentDonations.status === 'fulfilled' ? recentDonations.value : [],
      recentMessages: recentMessages.status === 'fulfilled' ? recentMessages.value : [],
    };
  } catch (error) {
    logger.error('Failed to fetch consolidated dashboard stats:', error);
    throw new Error('Failed to load dashboard statistics. Please refresh the page.');
  }
};
