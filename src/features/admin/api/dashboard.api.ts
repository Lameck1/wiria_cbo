/**
 * Dashboard API Service
 * Aggregates statistics from multiple backend endpoints for the admin dashboard
 */

import { apiClient } from '@/shared/services/api/client';
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
      position: app.career?.title || app.opportunity?.title || 'N/A',
      date: app.createdAt,
      status: app.status,
    }));
  } catch (error) {
    console.error('Failed to fetch recent applications:', error);
    return [];
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
      donor: d.donorName || 'Anonymous',
      amount: Number(d.amount),
      date: d.createdAt,
      status: d.status,
    }));
  } catch (error) {
    console.error('Failed to fetch recent donations:', error);
    return [];
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
    console.error('Failed to fetch recent messages:', error);
    return [];
  }
};

/**
 * Aggregates all dashboard statistics into a single response
 * Now uses the optimized consolidated endpoint /admin/statistics
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    const [statsRes, recentApps, recentDonations, recentMessages] = await Promise.all([
      apiClient.get('/admin/statistics'),
      getRecentApplications(),
      getRecentDonations(),
      getRecentMessages(),
    ]);

    const statsData = extractData<DashboardStats>(statsRes);
    if (!statsData) throw new Error('Missing dashboard statistics data');

    return {
      members: statsData.members,
      donations: statsData.donations,
      contacts: statsData.contacts,
      safeguarding: statsData.safeguarding,
      applications: statsData.applications,
      tenders: statsData.tenders,
      news: statsData.news,
      recentApplications: recentApps,
      recentDonations: recentDonations,
      recentMessages: recentMessages,
    };
  } catch (error) {
    console.error('Failed to fetch consolidated dashboard stats:', error);
    // Fallback to empty stats if API fails
    return {
      members: { total: 0, active: 0, pending: 0, expired: 0 },
      donations: {
        total: 0,
        totalAmount: 0,
        completed: 0,
        pending: 0,
        thisMonth: 0,
        thisMonthAmount: 0,
      },
      contacts: { total: 0, unread: 0, responded: 0, pending: 0 },
      safeguarding: { total: 0, open: 0, investigating: 0, resolved: 0, critical: 0 },
      applications: {
        total: 0,
        pending: 0,
        underReview: 0,
        shortlisted: 0,
        accepted: 0,
        rejected: 0,
      },
      tenders: { total: 0, open: 0, closed: 0 },
      news: { total: 0, published: 0, draft: 0 },
      recentApplications: [],
      recentDonations: [],
      recentMessages: [],
    };
  }
};
