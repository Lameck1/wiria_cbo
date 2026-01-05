/**
 * Professional Admin Dashboard Page
 * Displays real-time statistics and activity from the database
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import {
    getDashboardStats,
    DashboardStats,
} from '@/features/admin/api/dashboard.api';
import { apiClient } from '@/shared/services/api/client';
import { DashboardTrendCharts } from '@/features/admin/components/TrendChart';
import { formatRelativeTime } from '@/shared/utils/dateFormat';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { ROUTES } from '@/shared/constants/routes';

// Loading skeleton component
function StatCardSkeleton() {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-gray-200 animate-pulse">
            <div className="h-3 bg-gray-200 rounded w-24 mb-3"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
        </div>
    );
}

function ActivitySkeleton() {
    return (
        <div className="space-y-3">
            {[1, 2, 3].map((i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
            ))}
        </div>
    );
}

// Status badge component
function StatusBadge({ status, type }: { status: string; type?: 'success' | 'warning' | 'danger' | 'info' }) {
    const colors = {
        success: 'bg-green-100 text-green-700',
        warning: 'bg-yellow-100 text-yellow-700',
        danger: 'bg-red-100 text-red-700',
        info: 'bg-blue-100 text-blue-700',
    };
    const colorClass = type ? colors[type] : colors.info;
    return (
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${colorClass}`}>
            {status}
        </span>
    );
}

function AdminDashboardPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [trends, setTrends] = useState<{ donations: { month: string; amount: number }[]; members: { month: string; count: number }[] } | null>(null);

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
                const data = await apiClient.get<{ donations: { month: string; amount: number }[]; members: { month: string; count: number }[] }>('/admin/trends');
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

    // Get status type for badges
    const getStatusType = (status: string): 'success' | 'warning' | 'danger' | 'info' => {
        const types: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
            COMPLETED: 'success',
            ACTIVE: 'success',
            ACCEPTED: 'success',
            RESOLVED: 'success',
            RESPONDED: 'success',
            PENDING: 'warning',
            UNDER_REVIEW: 'warning',
            INVESTIGATING: 'warning',
            REJECTED: 'danger',
            FAILED: 'danger',
            CRITICAL: 'danger',
            SHORTLISTED: 'info',
        };
        return types[status] || 'info';
    };

    return (
        <>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-wiria-blue-dark">Dashboard Overview</h1>
                <p className="text-gray-600">Welcome back, {user?.firstName || 'Admin'}. Here's what's happening at WIRIA CBO.</p>
            </div>

            {/* Error State */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center justify-between">
                    <span>{error}</span>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Stats Grid */}
            <ErrorBoundary>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
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
                                    className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-blue-600 cursor-pointer hover:shadow-xl transition-shadow"
                                    onClick={() => navigate(ROUTES.ADMIN_MEMBERS)}
                                >
                                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">Active Members</p>
                                    <div className="text-3xl font-bold text-gray-900">{stats.members.active}</div>
                                    <p className="text-xs text-gray-400 mt-1">{stats.members.pending} pending</p>
                                </div>
                            )}

                            {/* Pending Applications */}
                            <div
                                className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-yellow-500 cursor-pointer hover:shadow-xl transition-shadow"
                                onClick={() => navigate(`${ROUTES.ADMIN_HR}?tab=applications`)}
                            >
                                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Applications</p>
                                <div className="text-3xl font-bold text-gray-900">{stats.applications.pending}</div>
                                <p className="text-xs text-gray-400 mt-1">{stats.applications.total} total</p>
                            </div>

                            {/* Unread Messages */}
                            <div
                                className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-indigo-500 cursor-pointer hover:shadow-xl transition-shadow"
                                onClick={() => navigate(ROUTES.ADMIN_CONTACTS)}
                            >
                                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Unread Messages</p>
                                <div className="text-3xl font-bold text-gray-900">{stats.contacts.unread}</div>
                                <p className="text-xs text-gray-400 mt-1">{stats.contacts.total} total</p>
                            </div>

                            {/* Safeguarding Cases */}
                            {canAccess('safeguarding') && (
                                <div
                                    className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-red-500 cursor-pointer hover:shadow-xl transition-shadow"
                                    onClick={() => navigate(ROUTES.ADMIN_SAFEGUARDING)}
                                >
                                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">Open Cases</p>
                                    <div className="text-3xl font-bold text-gray-900">{stats.safeguarding.open}</div>
                                    <p className="text-xs text-gray-400 mt-1">{stats.safeguarding.critical} critical</p>
                                </div>
                            )}

                            {/* Active Tenders */}
                            <div
                                className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-green-500 cursor-pointer hover:shadow-xl transition-shadow"
                                onClick={() => navigate(ROUTES.ADMIN_TENDERS)}
                            >
                                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Active Tenders</p>
                                <div className="text-3xl font-bold text-gray-900">{stats.tenders.open}</div>
                                <p className="text-xs text-gray-400 mt-1">{stats.tenders.total} total</p>
                            </div>

                            {/* News Articles */}
                            <div
                                className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-purple-500 cursor-pointer hover:shadow-xl transition-shadow"
                                onClick={() => navigate(ROUTES.ADMIN_NEWS)}
                            >
                                <p className="text-xs text-gray-500 font-bold uppercase mb-1">Published News</p>
                                <div className="text-3xl font-bold text-gray-900">{stats.news.published}</div>
                                <p className="text-xs text-gray-400 mt-1">{stats.news.total} total</p>
                            </div>
                        </>
                    ) : null}
                </div>
            </ErrorBoundary>

            {/* Trend Charts */}
            {trends && (
                <DashboardTrendCharts
                    donationData={trends.donations}
                    memberData={trends.members}
                />
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity - 2 columns */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Recent Applications */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <div className="flex justify-between items-center mb-4">
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
                                            onClick={() => navigate(`${ROUTES.ADMIN_HR}?tab=applications&appId=${app.id}`)}
                                            className="p-3 bg-gray-50 rounded-lg flex items-center justify-between cursor-pointer hover:bg-gray-100 transition-colors"
                                        >
                                            <div>
                                                <p className="font-semibold text-gray-900">{app.name}</p>
                                                <p className="text-sm text-gray-500">{app.position}</p>
                                            </div>
                                            <div className="text-right">
                                                <StatusBadge status={app.status} type={getStatusType(app.status)} />
                                                <p className="text-xs text-gray-400 mt-1">{formatDate(app.date)}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No recent applications</p>
                        )}
                    </div>

                    {/* Recent Donations */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <div className="flex justify-between items-center mb-4">
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
                                    <div key={donation.id} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-900">{donation.donor}</p>
                                            <p className="text-sm text-green-600 font-bold">{formatCurrency(donation.amount)}</p>
                                        </div>
                                        <div className="text-right">
                                            <StatusBadge status={donation.status} type={getStatusType(donation.status)} />
                                            <p className="text-xs text-gray-400 mt-1">{formatDate(donation.date)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No recent donations</p>
                        )}
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <h2 className="text-lg font-bold text-wiria-blue-dark mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate(ROUTES.ADMIN_NEWS)}
                                className="w-full p-3 bg-gray-50 rounded-xl hover:bg-wiria-blue-dark hover:text-white transition-all text-left font-semibold flex items-center"
                            >
                                <span className="mr-3">📰</span> Manage News
                            </button>
                            <button
                                onClick={() => navigate(ROUTES.ADMIN_TENDERS)}
                                className="w-full p-3 bg-gray-50 rounded-xl hover:bg-wiria-yellow hover:text-white transition-all text-left font-semibold flex items-center"
                            >
                                <span className="mr-3">📜</span> Manage Tenders
                            </button>
                            <button
                                onClick={() => navigate(`${ROUTES.ADMIN_HR}?tab=applications`)}
                                className="w-full p-3 bg-gray-50 rounded-xl hover:bg-green-500 hover:text-white transition-all text-left font-semibold flex items-center"
                            >
                                <span className="mr-3">💼</span> Review Applications
                            </button>
                            <button
                                onClick={() => navigate(ROUTES.ADMIN_CONTACTS)}
                                className="w-full p-3 bg-gray-50 rounded-xl hover:bg-indigo-500 hover:text-white transition-all text-left font-semibold flex items-center"
                            >
                                <span className="mr-3">✉️</span> Reply to Messages
                            </button>
                            {canAccess('members') && (
                                <button
                                    onClick={() => navigate(ROUTES.ADMIN_MEMBERS)}
                                    className="w-full p-3 bg-gray-50 rounded-xl hover:bg-blue-500 hover:text-white transition-all text-left font-semibold flex items-center"
                                >
                                    <span className="mr-3">👤</span> View Members
                                </button>
                            )}
                            <button
                                onClick={() => navigate(ROUTES.ADMIN_MEETINGS)}
                                className="w-full p-3 bg-gray-50 rounded-xl hover:bg-purple-500 hover:text-white transition-all text-left font-semibold flex items-center"
                            >
                                <span className="mr-3">📅</span> Schedule Meeting
                            </button>
                            <button
                                onClick={() => navigate(`${ROUTES.ADMIN_HR}?tab=opportunities`)}
                                className="w-full p-3 bg-gray-50 rounded-xl hover:bg-teal-500 hover:text-white transition-all text-left font-semibold flex items-center"
                            >
                                <span className="mr-3">🤝</span> Manage Opportunities
                            </button>
                        </div>
                    </div>

                    {/* Recent Messages */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg">
                        <div className="flex justify-between items-center mb-4">
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
                                    <div key={msg.id} className="p-3 bg-gray-50 rounded-lg">
                                        <div className="flex justify-between items-start mb-1">
                                            <p className="font-semibold text-gray-900 text-sm">{msg.name}</p>
                                            <StatusBadge status={msg.status} type={getStatusType(msg.status)} />
                                        </div>
                                        <p className="text-xs text-gray-500 truncate">{msg.subject}</p>
                                        <p className="text-xs text-gray-400 mt-1">{formatDate(msg.date)}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No recent messages</p>
                        )}
                    </div>

                    {/* Summary Stats */}
                    <div className="bg-gradient-to-br from-wiria-blue-dark to-blue-900 p-6 rounded-2xl shadow-lg text-white">
                        <h2 className="text-lg font-bold mb-4">Quick Stats</h2>
                        {isLoading ? (
                            <div className="space-y-3 animate-pulse">
                                <div className="h-4 bg-white bg-opacity-20 rounded w-3/4"></div>
                                <div className="h-4 bg-white bg-opacity-20 rounded w-1/2"></div>
                                <div className="h-4 bg-white bg-opacity-20 rounded w-2/3"></div>
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
            </div >
        </>
    );
}

export default AdminDashboardPage;
