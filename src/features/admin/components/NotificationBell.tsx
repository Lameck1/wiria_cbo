import { useState, useEffect, useRef, useMemo } from 'react';

import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/features/auth/context/useAuth';
import { ROUTES } from '@/shared/constants/routes';
import { UserRole } from '@/shared/types';

import { useNotificationCountsQuery } from '../hooks/useNotificationQueries';

export function NotificationBell() {
  const { isAuthenticated, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Only enable query for staff/admin roles
  const isStaff = useMemo(() => {
    const allowedRoles = [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STAFF];
    return isAuthenticated && user?.role && allowedRoles.includes(user.role);
  }, [isAuthenticated, user]);

  const { data: counts, refetch } = useNotificationCountsQuery(isStaff);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pendingCount = useMemo(
    () => (counts ? counts.pendingApplications + counts.unreadMessages + counts.criticalCases : 0),
    [counts]
  );

  const notifications = useMemo(
    () =>
      counts
        ? [
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
          ].filter((n) => n.count > 0)
        : [],
    [counts]
  );

  const handleBellClick = () => {
    const wasOpen = isOpen;
    setIsOpen(!isOpen);
    if (!wasOpen) {
      void refetch();
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={handleBellClick}
        className="relative rounded-lg p-2 transition-colors hover:bg-gray-100"
        aria-label="Notifications"
      >
        <span className="text-xl">🔔</span>
        {pendingCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {pendingCount > 9 ? '9+' : pendingCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-xl border bg-white shadow-xl">
          <div className="border-b p-3">
            <h3 className="font-bold text-gray-700">Notifications</h3>
          </div>
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <span className="mb-2 block text-2xl">✅</span>
              All caught up!
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              {notifications.map((n, index) => (
                <button
                  key={index}
                  onClick={() => {
                    navigate(n.path);
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center gap-3 border-b p-3 text-left last:border-0 hover:bg-gray-50"
                >
                  <span className="text-xl">{n.icon}</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{n.label}</div>
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
