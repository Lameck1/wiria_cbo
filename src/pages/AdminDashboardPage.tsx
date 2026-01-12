/**
 * Professional Admin Dashboard Page
 * Displays real-time statistics and activity from the database
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { getDashboardStats, DashboardStats } from '@/features/admin/api/dashboard.api';
import { apiClient } from '@/shared/services/api/client';
import { DashboardTrendCharts } from '@/features/admin/components/TrendChart';
import { formatRelativeTime } from '@/shared/utils/dateUtils';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { ROUTES } from '@/shared/constants/routes';

import { StatCardSkeleton, ActivitySkeleton } from '@/features/admin/components/DashboardSkeletons';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';

function AdminDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trends, setTrends] = useState<{
    donations: { month: string; amount: number }[];
    members: { month: string; count: number }[];
  } | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();

    // Fetch trends separately
    const fetchTrends = async () => {
      try {
        const data = await apiClient.get<{
          donations: { month: string; amount: number }[];
          members: { month: string; count: number }[];
        }>('/admin/trends');
        setTrends(data);
      } catch (err) {
        console.error('Failed to fetch trends:', err);
      }
    };
    fetchTrends();
  }, []);

  // Helper for role-based access
  const canAccess = (module: string) => {
    if (user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') return true;
    const restricted = ['members', 'users', 'safeguarding'];
    return !restricted.includes(module);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `KES ${amount.toLocaleString()}`;
  };

  // Format date - use relative time for recency
  const formatDate = (dateStr: string) => formatRelativeTime(dateStr);

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-wiria-blue-dark">Dashboard Overview</h1>
        <p className="text-gray-600">
          Welcome back, {user?.firstName || 'Admin'}. Here's what's happening at WIRIA CBO.
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">
          <span>{error}</span>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <ErrorBoundary>
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {isLoading ? (
            <>
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
              <StatCardSkeleton />
            </>
          ) : stats ? (
            <>
              {/* Active Members */}
              {canAccess('members') && (
                <div
                  className="cursor-pointer rounded-2xl border-t-4 border-blue-600 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
                  onClick={() => navigate(ROUTES.ADMIN_MEMBERS)}
                >
                  <p className="mb-1 text-xs font-bold uppercase text-gray-500">Active Members</p>
                  <div className="text-3xl font-bold text-gray-900">{stats.members.active}</div>
                  <p className="mt-1 text-xs text-gray-400">{stats.members.pending} pending</p>
                </div>
              )}

              {/* Pending Applications */}
              <div
                className="cursor-pointer rounded-2xl border-t-4 border-yellow-500 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
                onClick={() => navigate(`${ROUTES.ADMIN_HR}?tab=applications`)}
              >
                <p className="mb-1 text-xs font-bold uppercase text-gray-500">Applications</p>
                <div className="text-3xl font-bold text-gray-900">{stats.applications.pending}</div>
                <p className="mt-1 text-xs text-gray-400">{stats.applications.total} total</p>
              </div>

              {/* Unread Messages */}
              <div
                className="cursor-pointer rounded-2xl border-t-4 border-indigo-500 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
                onClick={() => navigate(ROUTES.ADMIN_CONTACTS)}
              >
                <p className="mb-1 text-xs font-bold uppercase text-gray-500">Unread Messages</p>
                <div className="text-3xl font-bold text-gray-900">{stats.contacts.unread}</div>
                <p className="mt-1 text-xs text-gray-400">{stats.contacts.total} total</p>
              </div>

              {/* Safeguarding Cases */}
              {canAccess('safeguarding') && (
                <div
                  className="cursor-pointer rounded-2xl border-t-4 border-red-500 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
                  onClick={() => navigate(ROUTES.ADMIN_SAFEGUARDING)}
                >
                  <p className="mb-1 text-xs font-bold uppercase text-gray-500">Open Cases</p>
                  <div className="text-3xl font-bold text-gray-900">{stats.safeguarding.open}</div>
                  <p className="mt-1 text-xs text-gray-400">
                    {stats.safeguarding.critical} critical
                  </p>
                </div>
              )}

              {/* Active Tenders */}
              <div
                className="cursor-pointer rounded-2xl border-t-4 border-green-500 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
                onClick={() => navigate(ROUTES.ADMIN_TENDERS)}
              >
                <p className="mb-1 text-xs font-bold uppercase text-gray-500">Active Tenders</p>
                <div className="text-3xl font-bold text-gray-900">{stats.tenders.open}</div>
                <p className="mt-1 text-xs text-gray-400">{stats.tenders.total} total</p>
              </div>

              {/* News Articles */}
              <div
                className="cursor-pointer rounded-2xl border-t-4 border-purple-500 bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
                onClick={() => navigate(ROUTES.ADMIN_NEWS)}
              >
                <p className="mb-1 text-xs font-bold uppercase text-gray-500">Published News</p>
                <div className="text-3xl font-bold text-gray-900">{stats.news.published}</div>
                <p className="mt-1 text-xs text-gray-400">{stats.news.total} total</p>
              </div>
            </>
          ) : null}
        </div>
      </ErrorBoundary>

      {/* Trend Charts */}
      {trends && (
        <DashboardTrendCharts donationData={trends.donations} memberData={trends.members} />
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Recent Activity - 2 columns */}
        <div className="space-y-6 lg:col-span-2">
          {/* Recent Applications */}
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-wiria-blue-dark">Recent Applications</h2>
              <button
                onClick={() => navigate(`${ROUTES.ADMIN_HR}?tab=applications`)}
                className="text-sm text-wiria-blue-dark hover:underline"
              >
                View All →
              </button>
            </div>
            {isLoading ? (
              <ActivitySkeleton />
            ) : stats?.recentApplications.length ? (
              <div className="space-y-3">
                {stats.recentApplications.map((app) => {
                  return (
                    <div
                      key={app.id}
                      onClick={() =>
                        navigate(`${ROUTES.ADMIN_HR}?tab=applications&appId=${app.id}`)
                      }
                      className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-3 transition-colors hover:bg-gray-100"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">{app.name}</p>
                        <p className="text-sm text-gray-500">{app.position}</p>
                      </div>
                      <div className="text-right">
                        <StatusBadge status={app.status} />
                        <p className="mt-1 text-xs text-gray-400">{formatDate(app.date)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="py-4 text-center text-gray-500">No recent applications</p>
            )}
          </div>

          {/* Recent Donations */}
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-wiria-blue-dark">Recent Donations</h2>
              <button
                onClick={() => navigate(ROUTES.ADMIN_DONATIONS)}
                className="text-sm text-wiria-blue-dark hover:underline"
              >
                View All →
              </button>
            </div>
            {isLoading ? (
              <ActivitySkeleton />
            ) : stats?.recentDonations.length ? (
              <div className="space-y-3">
                {stats.recentDonations.map((donation) => (
                  <div
                    key={donation.id}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">{donation.donor}</p>
                      <p className="text-sm font-bold text-green-600">
                        {formatCurrency(donation.amount)}
                      </p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={donation.status} />
                      <p className="mt-1 text-xs text-gray-400">{formatDate(donation.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-gray-500">No recent donations</p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold text-wiria-blue-dark">Quick Actions</h2>
            <div className="space-y-3">
              <button
                onClick={() => navigate(ROUTES.ADMIN_NEWS)}
                className="flex w-full items-center rounded-xl bg-gray-50 p-3 text-left font-semibold transition-all hover:bg-wiria-blue-dark hover:text-white"
              >
                <span className="mr-3">📰</span> Manage News
              </button>
              <button
                onClick={() => navigate(ROUTES.ADMIN_TENDERS)}
                className="flex w-full items-center rounded-xl bg-gray-50 p-3 text-left font-semibold transition-all hover:bg-wiria-yellow hover:text-white"
              >
                <span className="mr-3">📜</span> Manage Tenders
              </button>
              <button
                onClick={() => navigate(`${ROUTES.ADMIN_HR}?tab=applications`)}
                className="flex w-full items-center rounded-xl bg-gray-50 p-3 text-left font-semibold transition-all hover:bg-green-500 hover:text-white"
              >
                <span className="mr-3">💼</span> Review Applications
              </button>
              <button
                onClick={() => navigate(ROUTES.ADMIN_CONTACTS)}
                className="flex w-full items-center rounded-xl bg-gray-50 p-3 text-left font-semibold transition-all hover:bg-indigo-500 hover:text-white"
              >
                <span className="mr-3">✉️</span> Reply to Messages
              </button>
              {canAccess('members') && (
                <button
                  onClick={() => navigate(ROUTES.ADMIN_MEMBERS)}
                  className="flex w-full items-center rounded-xl bg-gray-50 p-3 text-left font-semibold transition-all hover:bg-blue-500 hover:text-white"
                >
                  <span className="mr-3">👤</span> View Members
                </button>
              )}
              <button
                onClick={() => navigate(ROUTES.ADMIN_MEETINGS)}
                className="flex w-full items-center rounded-xl bg-gray-50 p-3 text-left font-semibold transition-all hover:bg-purple-500 hover:text-white"
              >
                <span className="mr-3">📅</span> Schedule Meeting
              </button>
              <button
                onClick={() => navigate(`${ROUTES.ADMIN_HR}?tab=opportunities`)}
                className="flex w-full items-center rounded-xl bg-gray-50 p-3 text-left font-semibold transition-all hover:bg-teal-500 hover:text-white"
              >
                <span className="mr-3">🤝</span> Manage Opportunities
              </button>
            </div>
          </div>

          {/* Recent Messages */}
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-wiria-blue-dark">Recent Messages</h2>
              <button
                onClick={() => navigate(ROUTES.ADMIN_CONTACTS)}
                className="text-sm text-wiria-blue-dark hover:underline"
              >
                View All →
              </button>
            </div>
            {isLoading ? (
              <ActivitySkeleton />
            ) : stats?.recentMessages.length ? (
              <div className="space-y-3">
                {stats.recentMessages.map((msg) => (
                  <div key={msg.id} className="rounded-lg bg-gray-50 p-3">
                    <div className="mb-1 flex items-start justify-between">
                      <p className="text-sm font-semibold text-gray-900">{msg.name}</p>
                      <StatusBadge status={msg.status} />
                    </div>
                    <p className="truncate text-xs text-gray-500">{msg.subject}</p>
                    <p className="mt-1 text-xs text-gray-400">{formatDate(msg.date)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-gray-500">No recent messages</p>
            )}
          </div>

          {/* Summary Stats */}
          <div className="rounded-2xl bg-gradient-to-br from-wiria-blue-dark to-blue-900 p-6 text-white shadow-lg">
            <h2 className="mb-4 text-lg font-bold">Quick Stats</h2>
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-4 w-3/4 rounded bg-white bg-opacity-20"></div>
                <div className="h-4 w-1/2 rounded bg-white bg-opacity-20"></div>
                <div className="h-4 w-2/3 rounded bg-white bg-opacity-20"></div>
              </div>
            ) : stats ? (
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="opacity-80">Total Members</span>
                  <span className="font-bold">{stats.members.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-80">Total Applications</span>
                  <span className="font-bold">{stats.applications.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-80">Published News</span>
                  <span className="font-bold">{stats.news.published}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-80">Total Tenders</span>
                  <span className="font-bold">{stats.tenders.total}</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboardPage;
