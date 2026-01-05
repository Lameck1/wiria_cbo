import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@/shared/services/api/client';
import { useAuth } from '@/features/auth/context/AuthContext';
import { ROUTES } from '@/shared/constants/routes';

interface NotificationCounts {
    pendingApplications: number;
    unreadMessages: number;
    criticalCases: number;
}

let cachedCounts: NotificationCounts | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5000; // 5 seconds cache for near real-time updates

export function NotificationBell() {
    const { isAuthenticated, user } = useAuth();
    const [counts, setCounts] = useState<NotificationCounts | null>(cachedCounts);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        let isMounted = true;
        let intervalId: NodeJS.Timeout | undefined;

        const fetchCounts = async (force = false) => {
            // Stop if not authenticated
            if (!isAuthenticated) return;

            // Only fetch counts for staff/admin roles
            const allowedRoles = ['ADMIN', 'SUPER_ADMIN', 'STAFF'];
            if (!user?.role || !allowedRoles.includes(user.role)) {
                return;
            }

            // Use cache if available and fresh (unless forced)
            const now = Date.now();
            if (!force && cachedCounts && now - lastFetchTime < CACHE_DURATION) {
                if (isMounted) setCounts(cachedCounts);
                return;
            }

            try {
                // Fetch in parallel using apiClient
                // Backend responses are wrapped in { success: boolean, data: any }
                const [contactRes, appRes, safeRes] = await Promise.allSettled([
                    apiClient.get<{ data: { new?: number, unread?: number, pending?: number } }>('/contact/statistics'),
                    apiClient.get<{ data: { pending?: number } }>('/admin/applications/statistics'),
                    apiClient.get<{ data: { critical?: number, high?: number } }>('/safeguarding/statistics'),
                ]);

                const newCounts: NotificationCounts = {
                    pendingApplications: 0,
                    unreadMessages: 0,
                    criticalCases: 0,
                };

                // Parse contact stats
                if (contactRes.status === 'fulfilled') {
                    const data = contactRes.value.data || contactRes.value;
                    newCounts.unreadMessages = data.new || data.unread || data.pending || 0;
                } else {
                    console.error('[NotificationBell] Contact stats failed:', contactRes.reason);
                }

                // Parse application stats
                if (appRes.status === 'fulfilled') {
                    const data = appRes.value.data || appRes.value;
                    newCounts.pendingApplications = data.pending || 0;
                } else {
                    console.error('[NotificationBell] Application stats failed:', appRes.reason);
                }

                // Parse safeguarding stats
                if (safeRes.status === 'fulfilled') {
                    const data = safeRes.value.data || safeRes.value;
                    newCounts.criticalCases = data.critical || data.high || 0;
                } else {
                    console.error('[NotificationBell] Safeguarding stats failed:', safeRes.reason);
                }

                if (isMounted) {
                    cachedCounts = newCounts;
                    lastFetchTime = now;
                    setCounts(newCounts);
                }
            } catch (error) {
                console.error('Failed to fetch notification counts:', error);
            }
        };

        // Initial fetch
        if (isAuthenticated) {
            fetchCounts();

            // Auto-refresh every 30 seconds
            intervalId = setInterval(() => {
                if (isMounted) fetchCounts();
            }, 30000);
        }

        // Force refresh when window gains focus
        const handleFocus = () => {
            if (isMounted && isAuthenticated) fetchCounts(true);
        };
        window.addEventListener('focus', handleFocus);

        // Cleanup function
        return () => {
            isMounted = false;
            if (intervalId) clearInterval(intervalId);
            window.removeEventListener('focus', handleFocus);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]); // Rerun when authentication status changes

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const pendingCount = counts
        ? counts.pendingApplications + counts.unreadMessages + counts.criticalCases
        : 0;

    const notifications = counts ? [
        {
            label: 'Pending Applications',
            count: counts.pendingApplications,
            icon: '📋',
            path: `${ROUTES.ADMIN_HR}?tab=applications`,
            color: 'text-blue-600',
        },
        {
            label: 'Unread Messages',
            count: counts.unreadMessages,
            icon: '✉️',
            path: '/admin/contacts',
            color: 'text-yellow-600',
        },
        {
            label: 'Critical Safeguarding',
            count: counts.criticalCases,
            icon: '🚨',
            path: '/admin/safeguarding',
            color: 'text-red-600',
        },
    ].filter(n => n.count > 0) : [];

    // Force refresh when clicking bell by invalidating cache
    const handleBellClick = () => {
        const wasOpen = isOpen;
        setIsOpen(!isOpen);
        if (!wasOpen) {
            // Invalidate cache to force next fetch
            lastFetchTime = 0;
        }
    };

    return (
        <div ref={containerRef} className="relative">
            <button
                onClick={handleBellClick}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Notifications"
            >
                <span className="text-xl">🔔</span>
                {pendingCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {pendingCount > 9 ? '9+' : pendingCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border z-50">
                    <div className="p-3 border-b">
                        <h3 className="font-bold text-gray-700">Notifications</h3>
                    </div>
                    {notifications.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            <span className="text-2xl block mb-2">✅</span>
                            All caught up!
                        </div>
                    ) : (
                        <div className="max-h-80 overflow-y-auto">
                            {notifications.map((n, i) => (
                                <button
                                    key={i}
                                    onClick={() => { navigate(n.path); setIsOpen(false); }}
                                    className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b last:border-0"
                                >
                                    <span className="text-xl">{n.icon}</span>
                                    <div className="flex-1">
                                        <div className="font-semibold text-sm">{n.label}</div>
                                        <div className={`text-lg font-bold ${n.color}`}>{n.count}</div>
                                    </div>
                                    <span className="text-gray-400">→</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
