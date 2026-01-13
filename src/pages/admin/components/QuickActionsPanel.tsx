/**
 * Quick Actions Panel Component
 * Provides quick navigation buttons for common admin tasks
 */

import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';

interface QuickAction {
    label: string;
    icon: string;
    route: string;
    hoverColor: string;
}

const QUICK_ACTIONS: QuickAction[] = [
    { label: 'Manage News', icon: '📰', route: ROUTES.ADMIN_NEWS, hoverColor: 'hover:bg-wiria-blue-dark' },
    { label: 'Manage Tenders', icon: '📜', route: ROUTES.ADMIN_TENDERS, hoverColor: 'hover:bg-wiria-yellow' },
    { label: 'Review Applications', icon: '💼', route: `${ROUTES.ADMIN_HR}?tab=applications`, hoverColor: 'hover:bg-green-500' },
    { label: 'Reply to Messages', icon: '✉️', route: ROUTES.ADMIN_CONTACTS, hoverColor: 'hover:bg-indigo-500' },
    { label: 'Schedule Meeting', icon: '📅', route: ROUTES.ADMIN_MEETINGS, hoverColor: 'hover:bg-purple-500' },
    { label: 'Manage Opportunities', icon: '🤝', route: `${ROUTES.ADMIN_HR}?tab=opportunities`, hoverColor: 'hover:bg-teal-500' },
];

interface QuickActionsPanelProps {
    canAccessMembers?: boolean;
}

export function QuickActionsPanel({ canAccessMembers }: QuickActionsPanelProps) {
    const navigate = useNavigate();

    return (
        <div className="rounded-2xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold text-wiria-blue-dark">Quick Actions</h2>
            <div className="space-y-3">
                {QUICK_ACTIONS.map((action) => (
                    <button
                        key={action.label}
                        onClick={() => navigate(action.route)}
                        className={`flex w-full items-center rounded-xl bg-gray-50 p-3 text-left font-semibold transition-all ${action.hoverColor} hover:text-white`}
                    >
                        <span className="mr-3">{action.icon}</span> {action.label}
                    </button>
                ))}
                {canAccessMembers && (
                    <button
                        onClick={() => navigate(ROUTES.ADMIN_MEMBERS)}
                        className="flex w-full items-center rounded-xl bg-gray-50 p-3 text-left font-semibold transition-all hover:bg-blue-500 hover:text-white"
                    >
                        <span className="mr-3">👤</span> View Members
                    </button>
                )}
            </div>
        </div>
    );
}
