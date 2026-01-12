import { Routes, Route, Outlet, Link } from 'react-router-dom';
import { lazy } from 'react';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { UserRole } from '@/shared/types';
import { AdminLayout } from '@/features/admin/components/layout/AdminLayout';
import { useBackendStatus } from '@/shared/services/backendStatus';

// Eagerly load frequently visited pages for instant navigation
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import ProgramsPage from '@/pages/ProgramsPage';
import ContactPage from '@/pages/ContactPage';

// Lazy load less frequently visited pages
const ResourcesPage = lazy(() => import('@/pages/ResourcesPage'));
const OpportunitiesPage = lazy(() => import('@/pages/OpportunitiesPage'));
const CareersPage = lazy(() => import('@/pages/CareersPage'));
const DonationsPage = lazy(() => import('@/pages/DonationsPage'));
const MembershipPage = lazy(() => import('@/pages/MembershipPage'));
const MemberLoginPage = lazy(() => import('@/pages/MemberLoginPage'));
const StaffLoginPage = lazy(() => import('@/pages/StaffLoginPage'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));
const SafeguardingPage = lazy(() => import('@/pages/SafeguardingPage'));
const AcceptInvitePage = lazy(() => import('@/pages/AcceptInvitePage'));

// Member Portal Pages (lazy loaded, protected)
const MemberPortalPage = lazy(() => import('@/pages/MemberPortalPage'));
const MemberProfilePage = lazy(() => import('@/pages/MemberProfilePage'));
const MemberRenewalPage = lazy(() => import('@/pages/MemberRenewalPage'));
const MemberPaymentsPage = lazy(() => import('@/pages/MemberPaymentsPage'));
const MemberMeetingsPage = lazy(() => import('@/pages/MemberMeetingsPage'));

// Admin Pages
const AdminDashboardPage = lazy(() => import('@/pages/AdminDashboardPage'));
const MemberManagementPage = lazy(() => import('@/pages/admin/MemberManagementPage'));
const UserManagementPage = lazy(() => import('@/pages/admin/UserManagementPage'));
const NewsManagementPage = lazy(() => import('@/pages/admin/NewsManagementPage'));
const ResourceManagementPage = lazy(() => import('@/pages/admin/ResourceManagementPage'));
const TenderManagementPage = lazy(() => import('@/pages/admin/TenderManagementPage'));
const HRManagementPage = lazy(() => import('@/pages/admin/HRManagementPage'));
const DonationManagementPage = lazy(() => import('@/pages/admin/DonationManagementPage'));
const ContactManagementPage = lazy(() => import('@/pages/admin/ContactManagementPage'));
const SafeguardingManagementPage = lazy(() => import('@/pages/admin/SafeguardingManagementPage'));
const MeetingManagementPage = lazy(() => import('@/pages/admin/MeetingManagementPage'));

import { ROUTES } from '@/shared/constants/routes';

function AppRouter() {
  const { isBackendConnected } = useBackendStatus();

  return (
    <Routes>
      {/* Public routes - always available */}
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.ABOUT} element={<AboutPage />} />
      <Route path={ROUTES.CONTACT} element={<ContactPage />} />
      <Route path={ROUTES.PROGRAMS} element={<ProgramsPage />} />
      <Route path={ROUTES.RESOURCES} element={<ResourcesPage />} />
      <Route path={ROUTES.OPPORTUNITIES} element={<OpportunitiesPage />} />
      <Route path={ROUTES.CAREERS} element={<CareersPage />} />
      <Route path={ROUTES.DONATIONS} element={<DonationsPage />} />
      <Route path={ROUTES.MEMBERSHIP} element={<MembershipPage />} />
      <Route path={ROUTES.SAFEGUARDING} element={<SafeguardingPage />} />

      {/* Auth routes - only available when backend is connected */}
      {isBackendConnected && (
        <>
          <Route path={ROUTES.MEMBER_LOGIN} element={<MemberLoginPage />} />
          <Route path={ROUTES.STAFF_LOGIN} element={<StaffLoginPage />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
          <Route path={ROUTES.ACCEPT_INVITE} element={<AcceptInvitePage />} />

          {/* Protected routes - Member Portal */}
          <Route
            path={ROUTES.MEMBER_PORTAL}
            element={
              <ProtectedRoute allowedRoles={[UserRole.MEMBER]} redirectTo={ROUTES.MEMBER_LOGIN}>
                <MemberPortalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.MEMBER_PROFILE}
            element={
              <ProtectedRoute allowedRoles={[UserRole.MEMBER]} redirectTo={ROUTES.MEMBER_LOGIN}>
                <MemberProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.MEMBER_RENEWAL}
            element={
              <ProtectedRoute allowedRoles={[UserRole.MEMBER]} redirectTo={ROUTES.MEMBER_LOGIN}>
                <MemberRenewalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.MEMBER_PAYMENTS}
            element={
              <ProtectedRoute allowedRoles={[UserRole.MEMBER]} redirectTo={ROUTES.MEMBER_LOGIN}>
                <MemberPaymentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.MEMBER_MEETINGS}
            element={
              <ProtectedRoute allowedRoles={[UserRole.MEMBER]} redirectTo={ROUTES.MEMBER_LOGIN}>
                <MemberMeetingsPage />
              </ProtectedRoute>
            }
          />

          {/* Protected routes - Staff/Admin */}
          <Route
            path={ROUTES.ADMIN}
            element={
              <ProtectedRoute
                allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF]}
                redirectTo={ROUTES.STAFF_LOGIN}
              >
                <AdminLayout>
                  <Outlet />
                </AdminLayout>
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboardPage />} />
            <Route path="members" element={<MemberManagementPage />} />
            <Route path="news" element={<NewsManagementPage />} />
            <Route path="tenders" element={<TenderManagementPage />} />
            <Route path="hr" element={<HRManagementPage />} />
            <Route path="donations" element={<DonationManagementPage />} />
            <Route path="safeguarding" element={<SafeguardingManagementPage />} />
            <Route path="contacts" element={<ContactManagementPage />} />
            <Route path="users" element={<UserManagementPage />} />
            <Route path="resources" element={<ResourceManagementPage />} />
            <Route path="meetings" element={<MeetingManagementPage />} />
          </Route>
        </>
      )}

      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="mb-4 text-6xl font-bold text-gray-300">404</h1>
              <p className="text-2xl text-gray-600">Page Not Found</p>
              <Link to={ROUTES.HOME} className="mt-4 block text-wiria-blue-dark hover:underline">
                Back to Home
              </Link>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

export default AppRouter;
