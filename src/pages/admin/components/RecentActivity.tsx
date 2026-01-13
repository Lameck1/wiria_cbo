/**
 * Recent Activity Components
 * Displays recent applications, donations, and messages on the dashboard
 */

import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';
import { StatusBadge } from '@/shared/components/ui/StatusBadge';
import { ActivitySkeleton } from '@/features/admin/components/DashboardSkeletons';
import { formatRelativeTime } from '@/shared/utils/dateUtils';
import { formatCurrency } from '@/features/admin/hooks/useDashboardData';

interface ActivityCardProps {
    title: string;
    viewAllRoute: string;
    isLoading?: boolean;
    isEmpty: boolean;
    emptyMessage: string;
    children: React.ReactNode;
}

function ActivityCard({
    title,
    viewAllRoute,
    isLoading = false,
    isEmpty,
    emptyMessage,
    children,
}: ActivityCardProps) {
    const navigate = useNavigate();

    return (
        <div className="rounded-2xl bg-white p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-wiria-blue-dark">{title}</h2>
                <button
                    onClick={() => navigate(viewAllRoute)}
                    className="text-sm text-wiria-blue-dark hover:underline"
                >
                    View All →
                </button>
            </div>
            {isLoading ? (
                <ActivitySkeleton />
            ) : isEmpty ? (
                <p className="py-4 text-center text-gray-500">{emptyMessage}</p>
            ) : (
                <div className="space-y-3">{children}</div>
            )}
        </div>
    );
}

interface Application {
    id: string;
    name: string;
    position: string;
    status: string;
    date: string;
}

interface RecentApplicationsProps {
    applications: Application[];
    isLoading?: boolean;
}

export function RecentApplications({ applications, isLoading = false }: RecentApplicationsProps) {
    const navigate = useNavigate();

    return (
        <ActivityCard
            title="Recent Applications"
            viewAllRoute={`${ROUTES.ADMIN_HR}?tab=applications`}
            isLoading={isLoading}
            isEmpty={!applications.length}
            emptyMessage="No recent applications"
        >
            {applications.map((app) => (
                <button
                    key={app.id}
                    type="button"
                    onClick={() => navigate(`${ROUTES.ADMIN_HR}?tab=applications&appId=${app.id}`)}
                    className="flex w-full cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-3 text-left transition-colors hover:bg-gray-100"
                >
                    <div>
                        <p className="font-semibold text-gray-900">{app.name}</p>
                        <p className="text-sm text-gray-500">{app.position}</p>
                    </div>
                    <div className="text-right">
                        <StatusBadge status={app.status} />
                        <p className="mt-1 text-xs text-gray-400">{formatRelativeTime(app.date)}</p>
                    </div>
                </button>
            ))}
        </ActivityCard>
    );
}

interface Donation {
    id: string;
    donor: string;
    amount: number;
    status: string;
    date: string;
}

interface RecentDonationsProps {
    donations: Donation[];
    isLoading?: boolean;
}

export function RecentDonations({ donations, isLoading = false }: RecentDonationsProps) {
    return (
        <ActivityCard
            title="Recent Donations"
            viewAllRoute={ROUTES.ADMIN_DONATIONS}
            isLoading={isLoading}
            isEmpty={!donations.length}
            emptyMessage="No recent donations"
        >
            {donations.map((donation) => (
                <div
                    key={donation.id}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                >
                    <div>
                        <p className="font-semibold text-gray-900">{donation.donor}</p>
                        <p className="text-sm font-bold text-green-600">{formatCurrency(donation.amount)}</p>
                    </div>
                    <div className="text-right">
                        <StatusBadge status={donation.status} />
                        <p className="mt-1 text-xs text-gray-400">{formatRelativeTime(donation.date)}</p>
                    </div>
                </div>
            ))}
        </ActivityCard>
    );
}

interface Message {
    id: string;
    name: string;
    subject: string;
    status: string;
    date: string;
}

interface RecentMessagesProps {
    messages: Message[];
    isLoading?: boolean;
}

export function RecentMessages({ messages, isLoading = false }: RecentMessagesProps) {
    return (
        <ActivityCard
            title="Recent Messages"
            viewAllRoute={ROUTES.ADMIN_CONTACTS}
            isLoading={isLoading}
            isEmpty={!messages.length}
            emptyMessage="No recent messages"
        >
            {messages.map((msg) => (
                <div key={msg.id} className="rounded-lg bg-gray-50 p-3">
                    <div className="mb-1 flex items-start justify-between">
                        <p className="text-sm font-semibold text-gray-900">{msg.name}</p>
                        <StatusBadge status={msg.status} />
                    </div>
                    <p className="truncate text-xs text-gray-500">{msg.subject}</p>
                    <p className="mt-1 text-xs text-gray-400">{formatRelativeTime(msg.date)}</p>
                </div>
            ))}
        </ActivityCard>
    );
}
