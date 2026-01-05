/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-non-null-assertion */
/**
 * Contact Form Hook Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useContactForm } from '@/features/contact/hooks/useContactForm';
import { apiClient } from '@/shared/services/api/client';
import { notificationService } from '@/shared/services/notification/notificationService';

vi.mock('@/shared/services/api/client');
vi.mock('@/shared/services/notification/notificationService');

describe('useContactForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should successfully submit contact form', async () => {
        vi.mocked(apiClient.post).mockResolvedValue({ data: { success: true } });

        const { result } = renderHook(() => useContactForm());

        const formData = {
            name: 'Test User',
            email: 'test@example.com',
            subject: 'Test Subject',
            message: 'Test message content',
        };

        expect(result.current.isSubmitting).toBe(false);

        let submitResult;
        await act(async () => {
            submitResult = await result.current.submitContactForm(formData);
        });

        expect(apiClient.post).toHaveBeenCalledWith('/contact', formData);
        expect(notificationService.success).toHaveBeenCalledWith(
            'Thank you for your message! We will get back to you soon.'
        );
        expect(submitResult).toBe(true);
        expect(result.current.isSubmitting).toBe(false);
    });

    it('should handle form submission failure', async () => {
        vi.mocked(apiClient.post).mockRejectedValue(new Error('Network error'));

        const { result } = renderHook(() => useContactForm());

        const formData = {
            name: 'Test User',
            email: 'test@example.com',
            subject: 'Test Subject',
            message: 'Test message',
        };

        let submitResult;
        await act(async () => {
            submitResult = await result.current.submitContactForm(formData);
        });

        expect(notificationService.error).toHaveBeenCalledWith(
            'Failed to send message. Please try again.'
        );
        expect(submitResult).toBe(false);
        expect(result.current.isSubmitting).toBe(false);
    });

    it('should set isSubmitting to true during submission', async () => {
        let resolvePromise: (value: unknown) => void;
        const promise = new Promise((resolve) => {
            resolvePromise = resolve;
        });

        vi.mocked(apiClient.post).mockReturnValue(promise as any);

        const { result } = renderHook(() => useContactForm());

        const formData = {
            name: 'Test',
            email: 'test@example.com',
            subject: 'Subject',
            message: 'Message',
        };

        act(() => {
            result.current.submitContactForm(formData);
        });

        expect(result.current.isSubmitting).toBe(true);

        await act(async () => {
            resolvePromise!({ data: { success: true } });
            await promise;
        });

        expect(result.current.isSubmitting).toBe(false);
    });
});
