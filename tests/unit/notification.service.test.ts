// @vitest-environment jsdom

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  notificationService,
  useNotificationStore,
} from '@/shared/services/notification/notificationService';

describe('notificationService (Zustand)', () => {
  beforeEach(() => {
    useNotificationStore.setState({ notifications: [] });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('adds a success notification', () => {
    notificationService.success('Test success');
    const { notifications } = useNotificationStore.getState();
    expect(notifications).toHaveLength(1);
    const first = notifications[0];
    if (!first) throw new Error('Expected a notification to exist');
    expect(first.type).toBe('success');
    expect(first.message).toBe('Test success');
  });

  it('adds an error notification', () => {
    notificationService.error('Test error');
    const { notifications } = useNotificationStore.getState();
    expect(notifications).toHaveLength(1);
    const first = notifications[0];
    if (!first) throw new Error('Expected a notification to exist');
    expect(first.type).toBe('error');
  });

  it('auto-removes notifications after duration', () => {
    notificationService.info('Will disappear', 100);
    expect(useNotificationStore.getState().notifications).toHaveLength(1);

    vi.advanceTimersByTime(100);
    expect(useNotificationStore.getState().notifications).toHaveLength(0);
  });

  it('removes notifications by id', () => {
    useNotificationStore.getState().addNotification({ type: 'info', message: 'A' });
    const [notification] = useNotificationStore.getState().notifications;
    expect(notification).toBeTruthy();
    if (!notification) throw new Error('Expected a notification to exist');

    useNotificationStore.getState().removeNotification(notification.id);
    expect(useNotificationStore.getState().notifications).toHaveLength(0);
  });

  it('clears all notifications', () => {
    notificationService.success('1');
    notificationService.error('2');
    expect(useNotificationStore.getState().notifications).toHaveLength(2);

    useNotificationStore.getState().clearAll();
    expect(useNotificationStore.getState().notifications).toHaveLength(0);
  });
});
