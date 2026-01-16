/**
 * Member Portal Page (Dashboard)
 * Main dashboard for logged-in members
 */

import { useEffect } from 'react';

import { Link } from 'react-router-dom';

import { PortalLayout } from '@/features/membership/components/PortalLayout';
import {
  useMemberData,
  type MemberProfile,
  type Meeting,
  type Activity,
} from '@/features/membership/hooks/useMemberData';
import { Button } from '@/shared/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/shared/components/ui/Card';
import { Spinner } from '@/shared/components/ui/Spinner';

// --- Sub-components ---

interface MemberProfileCardProps {
  profile: MemberProfile | null;
  statusText: string;
  statusTextColor: string;
  statusColor: string;
}

const MemberProfileCard = ({
  profile,
  statusText,
  statusTextColor,
  statusColor,
}: MemberProfileCardProps) => (
  <Card>
    <CardBody>
      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-wiria-blue-dark text-2xl font-bold text-white">
          {profile?.firstName?.[0]}
          {profile?.lastName?.[0]}
        </div>
        <div>
          <h2 className="text-xl font-bold text-wiria-blue-dark">
            {profile?.firstName} {profile?.lastName}
          </h2>
          <p className="text-sm text-gray-500">{profile?.email}</p>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Member ID:</span>
          <span className="font-semibold text-gray-800">{profile?.memberNumber ?? '--'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Status:</span>
          <span
            className={`rounded px-2 py-0.5 text-xs font-bold uppercase ${statusTextColor} ${statusColor}`}
          >
            {statusText}
          </span>
        </div>
      </div>
      <Link to="/member-profile">
        <Button className="mt-4 w-full" variant="primary">
          View Profile
        </Button>
      </Link>
    </CardBody>
  </Card>
);

interface MembershipStatusCardProps {
  isExpired: boolean;
  daysUntilExpiry: number | null;
  joinedAt?: string;
}

const MembershipStatusCard = ({
  isExpired,
  daysUntilExpiry,
  joinedAt,
}: MembershipStatusCardProps) => (
  <Card
    className={`bg-gradient-to-br from-wiria-blue-dark to-blue-900 text-white ${isExpired ? 'ring-2 ring-red-500' : ''}`}
  >
    <CardBody>
      <h3 className="mb-2 text-lg font-bold">Membership</h3>
      <p className="mb-4 text-sm text-blue-100">
        {isExpired
          ? 'Your membership has expired'
          : daysUntilExpiry === null
            ? 'Checking status...'
            : `Expires in ${daysUntilExpiry} days`}
      </p>
      <div className="mb-4">
        <div className="mb-1 flex justify-between text-xs">
          <span>Joined</span>
          <span>{joinedAt ? new Date(joinedAt).toLocaleDateString() : '--'}</span>
        </div>
      </div>
      <Link to="/member-renewal">
        <Button className="w-full bg-wiria-yellow font-bold text-white shadow-lg transition-all hover:scale-105">
          Renew Membership
        </Button>
      </Link>
    </CardBody>
  </Card>
);

interface DashboardStatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
}

const DashboardStatCard = ({
  title,
  value,
  subtitle,
  icon,
  iconBgColor,
  iconColor,
}: DashboardStatCardProps) => (
  <Card>
    <CardBody className="flex items-center justify-between">
      <div>
        <p className="mb-1 text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-wiria-blue-dark">{value}</p>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBgColor} text-2xl ${iconColor}`}
      >
        {icon}
      </div>
    </CardBody>
  </Card>
);

interface UpcomingMeetingsListProps {
  meetings: Meeting[];
}

const UpcomingMeetingsList = ({ meetings }: UpcomingMeetingsListProps) => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-wiria-blue-dark">Upcoming Meetings</h3>
        <Link
          to="/member-meetings"
          className="text-sm text-wiria-blue-dark hover:text-wiria-yellow"
        >
          View All →
        </Link>
      </div>
    </CardHeader>
    <CardBody>
      <div className="space-y-3">
        {meetings.length === 0 ? (
          <p className="text-sm italic text-gray-500">No upcoming meetings</p>
        ) : (
          meetings.slice(0, 3).map((meeting) => (
            <div key={meeting.id} className="rounded-lg bg-gray-50 p-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-800">{meeting.title}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(meeting.date).toLocaleDateString()} at {meeting.time}
                  </p>
                </div>
                <span className="rounded bg-blue-100 px-2 py-1 text-xs text-blue-800">
                  {meeting.type}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </CardBody>
  </Card>
);

interface RecentActivityListProps {
  activity: Activity[];
}

const RecentActivityList = ({ activity }: RecentActivityListProps) => (
  <Card>
    <CardHeader>
      <h3 className="text-xl font-bold text-wiria-blue-dark">Recent Activity</h3>
    </CardHeader>
    <CardBody>
      <div className="space-y-3">
        {activity.length === 0 ? (
          <p className="text-sm italic text-gray-500">No recent activity</p>
        ) : (
          activity.slice(0, 5).map((item) => (
            <div key={item.id} className="flex items-start gap-3 text-sm">
              <div className="mt-2 h-2 w-2 rounded-full bg-wiria-blue-dark" />
              <div>
                <p className="text-gray-800">{item.description}</p>
                <p className="text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </CardBody>
  </Card>
);

// --- Main Component ---

function MemberPortalPage() {
  const {
    profile,
    payments,
    meetings,
    activity,
    isLoading,
    totalPayments,
    upcomingMeetings,
    daysUntilExpiry,
    isExpired,
    isExpiringSoon,
    fetchAll,
  } = useMemberData();

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  if (isLoading && !profile) {
    return (
      <PortalLayout title="Member Portal" subtitle="Loading your dashboard...">
        <div className="flex items-center justify-center py-20">
          <Spinner size="lg" />
        </div>
      </PortalLayout>
    );
  }

  const statusColor = isExpired
    ? 'border-red-200 bg-red-50'
    : isExpiringSoon
      ? 'border-yellow-200 bg-yellow-50'
      : 'border-green-200 bg-green-50';

  const statusText = isExpired
    ? 'Expired'
    : isExpiringSoon
      ? 'Expiring Soon'
      : (profile?.status ?? 'Active');
  const statusTextColor = isExpired
    ? 'text-red-700'
    : isExpiringSoon
      ? 'text-yellow-700'
      : 'text-green-700';

  return (
    <PortalLayout title="Welcome Back!" subtitle="Here's what's happening with your membership">
      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MemberProfileCard
          profile={profile}
          statusText={statusText}
          statusTextColor={statusTextColor}
          statusColor={statusColor}
        />

        <MembershipStatusCard
          isExpired={isExpired}
          daysUntilExpiry={daysUntilExpiry}
          joinedAt={profile?.joinedAt}
        />

        <DashboardStatCard
          title="Total Payments"
          value={`KES ${totalPayments.toLocaleString()}`}
          subtitle={`${payments.length} transactions`}
          icon="💳"
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />

        <DashboardStatCard
          title="Upcoming Meetings"
          value={upcomingMeetings}
          subtitle="This month"
          icon="📅"
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <UpcomingMeetingsList meetings={meetings} />
        <RecentActivityList activity={activity} />
      </div>
    </PortalLayout>
  );
}

export default MemberPortalPage;
