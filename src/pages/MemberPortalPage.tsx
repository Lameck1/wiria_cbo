/**
 * Member Portal Page (Dashboard)
 * Main dashboard for logged-in members
 */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PortalLayout } from '@/features/membership/components/PortalLayout';
import { useMemberData } from '@/features/membership/hooks/useMemberData';
import { Card, CardBody, CardHeader } from '@/shared/components/ui/Card';
import { Button } from '@/shared/components/ui/Button';
import { Spinner } from '@/shared/components/ui/Spinner';

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
        fetchAll();
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

    const statusText = isExpired ? 'Expired' : isExpiringSoon ? 'Expiring Soon' : profile?.status || 'Active';
    const statusTextColor = isExpired ? 'text-red-700' : isExpiringSoon ? 'text-yellow-700' : 'text-green-700';

    return (
        <PortalLayout title="Welcome Back!" subtitle="Here's what's happening with your membership">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Profile Card */}
                <Card>
                    <CardBody>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-wiria-blue-dark text-white rounded-full flex items-center justify-center font-bold text-2xl">
                                {profile?.firstName?.[0]}{profile?.lastName?.[0]}
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
                                <span className="font-semibold text-gray-800">{profile?.memberNumber || '--'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">Status:</span>
                                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${statusTextColor} ${statusColor}`}>
                                    {statusText}
                                </span>
                            </div>
                        </div>
                        <Link to="/member-profile">
                            <Button className="w-full mt-4" variant="primary">View Profile</Button>
                        </Link>
                    </CardBody>
                </Card>

                {/* Membership Status Card */}
                <Card className={`bg-gradient-to-br from-wiria-blue-dark to-blue-900 text-white ${isExpired ? 'ring-2 ring-red-500' : ''}`}>
                    <CardBody>
                        <h3 className="text-lg font-bold mb-2">Membership</h3>
                        <p className="text-blue-100 mb-4 text-sm">
                            {isExpired
                                ? 'Your membership has expired'
                                : daysUntilExpiry !== null
                                    ? `Expires in ${daysUntilExpiry} days`
                                    : 'Checking status...'}
                        </p>
                        <div className="mb-4">
                            <div className="flex justify-between text-xs mb-1">
                                <span>Joined</span>
                                <span>
                                    {profile?.joinedAt
                                        ? new Date(profile.joinedAt).toLocaleDateString()
                                        : '--'}
                                </span>
                            </div>
                        </div>
                        <Link to="/member-renewal">
                            <Button
                                className="w-full bg-wiria-yellow text-white font-bold shadow-lg hover:scale-105 transition-all"
                            >
                                Renew Membership
                            </Button>
                        </Link>
                    </CardBody>
                </Card>

                {/* Payments Summary */}
                <Card>
                    <CardBody className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm mb-1">Total Payments</p>
                            <p className="text-2xl font-bold text-wiria-blue-dark">
                                KES {totalPayments.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">{payments.length} transactions</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center text-2xl">
                            💳
                        </div>
                    </CardBody>
                </Card>

                {/* Meetings Count */}
                <Card>
                    <CardBody className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm mb-1">Upcoming Meetings</p>
                            <p className="text-2xl font-bold text-wiria-blue-dark">{upcomingMeetings}</p>
                            <p className="text-xs text-gray-500">This month</p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl">
                            📅
                        </div>
                    </CardBody>
                </Card>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Upcoming Meetings */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <h3 className="text-xl font-bold text-wiria-blue-dark">Upcoming Meetings</h3>
                            <Link to="/member-meetings" className="text-sm text-wiria-blue-dark hover:text-wiria-yellow">
                                View All →
                            </Link>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-3">
                            {meetings.length === 0 ? (
                                <p className="text-gray-500 italic text-sm">No upcoming meetings</p>
                            ) : (
                                meetings.slice(0, 3).map((meeting) => (
                                    <div key={meeting.id} className="p-3 bg-gray-50 rounded-lg">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-semibold text-gray-800">{meeting.title}</p>
                                                <p className="text-xs text-gray-500">
                                                    {new Date(meeting.date).toLocaleDateString()} at {meeting.time}
                                                </p>
                                            </div>
                                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                                {meeting.type}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardBody>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <h3 className="text-xl font-bold text-wiria-blue-dark">Recent Activity</h3>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-3">
                            {activity.length === 0 ? (
                                <p className="text-gray-500 italic text-sm">No recent activity</p>
                            ) : (
                                activity.slice(0, 5).map((item) => (
                                    <div key={item.id} className="flex items-start gap-3 text-sm">
                                        <div className="w-2 h-2 bg-wiria-blue-dark rounded-full mt-2" />
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
            </div>
        </PortalLayout>
    );
}

export default MemberPortalPage;
