import { Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/context/AuthContext';
import { DashboardTrendCharts } from '@/features/admin/components/TrendChart';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { ROUTES } from '@/shared/constants/routes';
import { StatCardSkeleton, DashboardTrendSkeleton } from '@/features/admin/components/DashboardSkeletons';
import { StatCard } from '@/features/admin/components/StatCard';
import {
  useSuspenseDashboardStats,
  useSuspenseDashboardTrends,
  canAccessModule
} from '@/features/admin/hooks/useDashboardData';
import {
  QuickActionsPanel,
  RecentApplications,
  RecentDonations,
  RecentMessages,
  QuickStatsSummary,
} from './admin/components';

function DashboardStatsGrid() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: stats } = useSuspenseDashboardStats();

  const canAccess = (module: string) => canAccessModule(user?.role, module);

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {canAccess('members') && (
        <StatCard
          title="Active Members"
          value={stats.members.active}
          subtitle={`${stats.members.pending} pending`}
          borderColor="border-blue-600"
          onClick={() => navigate(ROUTES.ADMIN_MEMBERS)}
        />
      )}
      <StatCard
        title="Applications"
        value={stats.applications.pending}
        subtitle={`${stats.applications.total} total`}
        borderColor="border-yellow-500"
        onClick={() => navigate(`${ROUTES.ADMIN_HR}?tab=applications`)}
      />
      <StatCard
        title="Unread Messages"
        value={stats.contacts.unread}
        subtitle={`${stats.contacts.total} total`}
        borderColor="border-indigo-500"
        onClick={() => navigate(ROUTES.ADMIN_CONTACTS)}
      />
      {canAccess('safeguarding') && (
        <StatCard
          title="Open Cases"
          value={stats.safeguarding.open}
          subtitle={`${stats.safeguarding.critical} critical`}
          borderColor="border-red-500"
          onClick={() => navigate(ROUTES.ADMIN_SAFEGUARDING)}
        />
      )}
      <StatCard
        title="Active Tenders"
        value={stats.tenders.open}
        subtitle={`${stats.tenders.total} total`}
        borderColor="border-green-500"
        onClick={() => navigate(ROUTES.ADMIN_TENDERS)}
      />
      <StatCard
        title="Published News"
        value={stats.news.published}
        subtitle={`${stats.news.total} total`}
        borderColor="border-purple-500"
        onClick={() => navigate(ROUTES.ADMIN_NEWS)}
      />
    </div>
  );
}

function DashboardTrends() {
  const { data: trends } = useSuspenseDashboardTrends();
  return <DashboardTrendCharts donationData={trends.donations} memberData={trends.members} />;
}

function RecentActivitySection() {
  const { data: stats } = useSuspenseDashboardStats();
  return (
    <div className="space-y-6 lg:col-span-2">
      <RecentApplications applications={stats.recentApplications || []} />
      <RecentDonations donations={stats.recentDonations || []} />
    </div>
  );
}

function SecondaryDashboardInfo() {
  const { user } = useAuth();
  const { data: stats } = useSuspenseDashboardStats();
  const canAccess = (module: string) => canAccessModule(user?.role, module);

  return (
    <div className="space-y-6">
      <QuickActionsPanel canAccessMembers={canAccess('members')} />
      <RecentMessages messages={stats.recentMessages || []} />
      <QuickStatsSummary stats={stats} />
    </div>
  );
}

function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <>
      {/* React 19 Native Metadata */}
      <title>Admin Dashboard | WIRIA CBO</title>
      <meta name="description" content="Overview of WIRIA CBO administrative activities, statistics, and trends." />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-wiria-blue-dark">Dashboard Overview</h1>
        <p className="text-gray-600">
          Welcome back, {user?.firstName || 'Admin'}. Here's what's happening at WIRIA CBO.
        </p>
      </div>

      <ErrorBoundary>
        <Suspense fallback={
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => <StatCardSkeleton key={i} />)}
          </div>
        }>
          <DashboardStatsGrid />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary>
        <Suspense fallback={<DashboardTrendSkeleton />}>
          <DashboardTrends />
        </Suspense>
      </ErrorBoundary>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <ErrorBoundary>
          <Suspense fallback={<div className="lg:col-span-2 space-y-6">Loading activity...</div>}>
            <RecentActivitySection />
          </Suspense>
        </ErrorBoundary>

        <ErrorBoundary>
          <Suspense fallback={<div className="space-y-6">Loading actions...</div>}>
            <SecondaryDashboardInfo />
          </Suspense>
        </ErrorBoundary>
      </div>
    </>
  );
}

export default AdminDashboardPage;
