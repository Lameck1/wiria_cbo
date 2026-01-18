/**
 * Notification Service
 * Centralized toast/notification system using Zustand
 */

import { create } from 'zustand';

import { TIMING } from '@/shared/constants/config';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration: number;
}

interface NotificationStore {
  notifications: Notification[];
  timers: Map<string, ReturnType<typeof setTimeout>>; // Track active timers
  addNotification: (
    notification: Omit<Notification, 'id' | 'duration'> & { duration?: number }
  ) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  clearTimer: (id: string) => void; // Clear specific timer
  clearAllTimers: () => void; // Clear all timers
}

/**
 * Generate a unique notification ID using the Web Crypto API
 * crypto.randomUUID() provides cryptographically strong random UUIDs
 * and is available in all modern browsers (Chrome 92+, Firefox 95+, Safari 15.4+)
 */
const createNotificationId = (): string => {
  return crypto.randomUUID();
};

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  timers: new Map(),
  
  addNotification: (notification) => {
    const id = createNotificationId();
    const duration = notification.duration ?? TIMING.TOAST_DURATION;
    const newNotification: Notification = {
      id,
      type: notification.type,
      message: notification.message,
      duration,
    };

    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    // Auto-remove after duration with timer tracking
    if (duration > 0) {
      const timerId = setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
          timers: (() => {
            const newTimers = new Map(state.timers);
            newTimers.delete(id);
            return newTimers;
          })(),
        }));
      }, duration);
      
      // Track the timer
      set((state) => ({
        timers: new Map(state.timers).set(id, timerId),
      }));
    }
  },
  
  removeNotification: (id) => {
    // Clear timer if exists
    get().clearTimer(id);
    
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }));
  },
  
  clearAll: () => {
    // Clear all timers before clearing notifications
    get().clearAllTimers();
    
    set({ notifications: [] });
  },
  
  clearTimer: (id) => {
    const state = get();
    const timer = state.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      set((state) => {
        const newTimers = new Map(state.timers);
        newTimers.delete(id);
        return { timers: newTimers };
      });
    }
  },
  
  clearAllTimers: () => {
    const state = get();
    state.timers.forEach((timer) => clearTimeout(timer));
    set({ timers: new Map() });
  },
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
