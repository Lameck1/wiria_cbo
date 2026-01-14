import { lazy } from 'react';

import { createBrowserRouter, Link, Outlet } from 'react-router-dom';

import { AdminLayout } from '@/features/admin/components/layout/AdminLayout';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { ErrorBoundary } from '@/shared/components/ErrorBoundary';
import { AppProviders } from '@/shared/components/layout/AppProviders';
import { Layout } from '@/shared/components/layout/Layout';
import { ROUTES } from '@/shared/constants/routes';
import { UserRole } from '@/shared/types';

import { createMemberRoute } from './routeProtection';

// Lazy load all pages for optimal code splitting
const HomePage = lazy(() => import('@/pages/HomePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ProgramsPage = lazy(() => import('@/pages/ProgramsPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
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

// Member Portal Pages
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
const HRManagementPage = lazy(() => import('@/pages/admin/hrManagementPage'));
const DonationManagementPage = lazy(() => import('@/pages/admin/DonationManagementPage'));
const ContactManagementPage = lazy(() => import('@/pages/admin/ContactManagementPage'));
const SafeguardingManagementPage = lazy(() => import('@/pages/admin/SafeguardingManagementPage'));
const MeetingManagementPage = lazy(() => import('@/pages/admin/MeetingManagementPage'));

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <AppProviders />,
      errorElement: (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
          <ErrorBoundary>
            <div className="text-center">
              <h1 className="mb-4 text-4xl font-bold text-gray-800">Critical Error</h1>
              <p className="mb-6 text-gray-600">The application encountered a fatal error.</p>
              <Link to="/" className="text-wiria-blue-dark hover:underline">Return to Home</Link>
            </div>
          </ErrorBoundary>
        </div>
      ),
      children: [
        // Public pages nested under Layout
        {
          element: (
            <Layout>
              <Outlet />
            </Layout>
          ),
          children: [
            { index: true, element: <HomePage /> },
            { path: ROUTES.ABOUT, element: <AboutPage /> },
            { path: ROUTES.CONTACT, element: <ContactPage /> },
            { path: ROUTES.PROGRAMS, element: <ProgramsPage /> },
            { path: ROUTES.RESOURCES, element: <ResourcesPage /> },
            { path: ROUTES.OPPORTUNITIES, element: <OpportunitiesPage /> },
            { path: ROUTES.CAREERS, element: <CareersPage /> },
            { path: ROUTES.DONATIONS, element: <DonationsPage /> },
            { path: ROUTES.MEMBERSHIP, element: <MembershipPage /> },
            { path: ROUTES.SAFEGUARDING, element: <SafeguardingPage /> },

            // Auth routes
            { path: ROUTES.MEMBER_LOGIN, element: <MemberLoginPage /> },
            { path: ROUTES.STAFF_LOGIN, element: <StaffLoginPage /> },
            { path: ROUTES.RESET_PASSWORD, element: <ResetPasswordPage /> },
            { path: ROUTES.ACCEPT_INVITE, element: <AcceptInvitePage /> },
          ]
        },

        // Protected Member Portal
        {
          element: (
            <Layout>
              <Outlet />
            </Layout>
          ),
          children: [
            createMemberRoute(ROUTES.MEMBER_PORTAL, <MemberPortalPage />),
            createMemberRoute(ROUTES.MEMBER_PROFILE, <MemberProfilePage />),
            createMemberRoute(ROUTES.MEMBER_RENEWAL, <MemberRenewalPage />),
            createMemberRoute(ROUTES.MEMBER_PAYMENTS, <MemberPaymentsPage />),
            createMemberRoute(ROUTES.MEMBER_MEETINGS, <MemberMeetingsPage />),
          ]
        },

        // Protected Admin/Staff
        {
          path: ROUTES.ADMIN,
          element: (
            <ProtectedRoute
              allowedRoles={[UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF]}
              redirectTo={ROUTES.STAFF_LOGIN}
            >
              <AdminLayout>
                <Outlet />
              </AdminLayout>
            </ProtectedRoute>
          ),
          children: [
            { index: true, element: <AdminDashboardPage /> },
            { path: 'members', element: <MemberManagementPage /> },
            { path: 'news', element: <NewsManagementPage /> },
            { path: 'tenders', element: <TenderManagementPage /> },
            { path: 'hr', element: <HRManagementPage /> },
            { path: 'donations', element: <DonationManagementPage /> },
            { path: 'safeguarding', element: <SafeguardingManagementPage /> },
            { path: 'contacts', element: <ContactManagementPage /> },
            { path: 'users', element: <UserManagementPage /> },
            { path: 'resources', element: <ResourceManagementPage /> },
            { path: 'meetings', element: <MeetingManagementPage /> },
          ],
        },

        // 404
        {
          path: '*',
          element: (
            <Layout>
              <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="mb-4 text-6xl font-bold text-gray-300">404</h1>
                  <p className="text-2xl text-gray-600">Page Not Found</p>
                  <Link to="/" className="mt-4 block text-wiria-blue-dark hover:underline">
                    Back to Home
                  </Link>
                </div>
              </div>
            </Layout>
          ),
        },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);
