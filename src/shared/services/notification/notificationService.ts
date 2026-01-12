/**
 * Notification Service
 * Centralized toast/notification system using Zustand
 */

import { create } from 'zustand';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration: number;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (
    notification: Omit<Notification, 'id' | 'duration'> & { duration?: number }
  ) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (notification) => {
    const id = Math.random().toString(36).substring(2, 9);
    const duration = notification.duration ?? 5000;
    const newNotification: Notification = {
      id,
      type: notification.type,
      message: notification.message,
      duration,
    };

    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    // Auto-remove after duration
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, duration);
    }
  },
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clearAll: () => set({ notifications: [] }),
}));

// Convenience functions
export const notificationService = {
  success: (message: string, duration?: number) => {
    useNotificationStore.getState().addNotification({ type: 'success', message, duration });
  },
  error: (message: string, duration?: number) => {
    useNotificationStore.getState().addNotification({ type: 'error', message, duration });
  },
  warning: (message: string, duration?: number) => {
    useNotificationStore.getState().addNotification({ type: 'warning', message, duration });
  },
  info: (message: string, duration?: number) => {
    useNotificationStore.getState().addNotification({ type: 'info', message, duration });
  },
  handleError: (error: unknown) => {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    useNotificationStore.getState().addNotification({ type: 'error', message });
  },
};
