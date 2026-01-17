/**
 * useFeeCalculation Hook Tests
 */
import { renderHook } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { MEMBERSHIP_FEES } from '@/shared/constants/membership';
import { useFeeCalculation, useRenewalFeeCalculation } from '@/shared/hooks/useFeeCalculation';

describe('useFeeCalculation', () => {
  describe('INDIVIDUAL membership', () => {
    it('calculates fees for individual membership', () => {
      const { result } = renderHook(() =>
        useFeeCalculation({ membershipType: 'INDIVIDUAL', memberCount: 1 })
      );

      expect(result.current.registration.rate).toBe(MEMBERSHIP_FEES.INDIVIDUAL.registration);
      expect(result.current.registration.count).toBe(1);
      expect(result.current.registration.subtotal).toBe(MEMBERSHIP_FEES.INDIVIDUAL.registration);

      expect(result.current.subscription.rate).toBe(MEMBERSHIP_FEES.INDIVIDUAL.subscription);
      expect(result.current.subscription.count).toBe(1);
      expect(result.current.subscription.subtotal).toBe(MEMBERSHIP_FEES.INDIVIDUAL.subscription);

      const expectedTotal =
        MEMBERSHIP_FEES.INDIVIDUAL.registration + MEMBERSHIP_FEES.INDIVIDUAL.subscription;
      expect(result.current.total).toBe(expectedTotal);
    });

    it('ignores memberCount for individual (always 1)', () => {
      const { result } = renderHook(() =>
        useFeeCalculation({ membershipType: 'INDIVIDUAL', memberCount: 5 })
      );

      expect(result.current.registration.count).toBe(1);
      expect(result.current.subscription.count).toBe(1);
    });
  });

  describe('GROUP membership', () => {
    it('calculates fees for group membership', () => {
      const memberCount = 5;
      const { result } = renderHook(() =>
        useFeeCalculation({ membershipType: 'GROUP', memberCount })
      );

      expect(result.current.registration.rate).toBe(MEMBERSHIP_FEES.GROUP.registration);
      expect(result.current.registration.count).toBe(memberCount);
      expect(result.current.registration.subtotal).toBe(
        MEMBERSHIP_FEES.GROUP.registration * memberCount
      );

      expect(result.current.subscription.rate).toBe(MEMBERSHIP_FEES.GROUP.subscription);
      expect(result.current.subscription.count).toBe(memberCount);
      expect(result.current.subscription.subtotal).toBe(
        MEMBERSHIP_FEES.GROUP.subscription * memberCount
      );
    });

    it('uses minimum of 1 for zero or negative memberCount', () => {
      const { result } = renderHook(() =>
        useFeeCalculation({ membershipType: 'GROUP', memberCount: 0 })
      );

      expect(result.current.registration.count).toBe(1);
      expect(result.current.subscription.count).toBe(1);
    });

    it('calculates correct total for 10 members', () => {
      const memberCount = 10;
      const { result } = renderHook(() =>
        useFeeCalculation({ membershipType: 'GROUP', memberCount })
      );

      const expectedTotal =
        MEMBERSHIP_FEES.GROUP.registration * memberCount +
        MEMBERSHIP_FEES.GROUP.subscription * memberCount;
      expect(result.current.total).toBe(expectedTotal);
    });
  });
});

describe('useRenewalFeeCalculation', () => {
  describe('INDIVIDUAL renewal', () => {
    it('calculates renewal fee for individual', () => {
      const { result } = renderHook(() =>
        useRenewalFeeCalculation({
          membershipType: 'INDIVIDUAL',
          memberCount: 1,
          maxCount: 1,
        })
      );

      expect(result.current.renewal.count).toBe(1);
      expect(result.current.renewal.rate).toBe(MEMBERSHIP_FEES.INDIVIDUAL.subscription);
      expect(result.current.renewal.subtotal).toBe(MEMBERSHIP_FEES.INDIVIDUAL.subscription);

      expect(result.current.newRegistration.count).toBe(0);
      expect(result.current.newRegistration.subtotal).toBe(0);
    });

    it('ignores memberCount changes for individual', () => {
      const { result } = renderHook(() =>
        useRenewalFeeCalculation({
          membershipType: 'INDIVIDUAL',
          memberCount: 5,
          maxCount: 1,
        })
      );

      expect(result.current.renewal.count).toBe(1);
      expect(result.current.newRegistration.count).toBe(0);
    });
  });

  describe('GROUP renewal', () => {
    it('calculates renewal for same member count', () => {
      const { result } = renderHook(() =>
        useRenewalFeeCalculation({
          membershipType: 'GROUP',
          memberCount: 5,
          maxCount: 5,
        })
      );

      expect(result.current.renewal.count).toBe(5);
      expect(result.current.renewal.subtotal).toBe(MEMBERSHIP_FEES.GROUP.subscription * 5);
      expect(result.current.newRegistration.count).toBe(0);
      expect(result.current.newRegistration.subtotal).toBe(0);
    });

    it('calculates incremental registration for new members', () => {
      const { result } = renderHook(() =>
        useRenewalFeeCalculation({
          membershipType: 'GROUP',
          memberCount: 8,
          maxCount: 5,
        })
      );

      // All 8 members pay renewal
      expect(result.current.renewal.count).toBe(8);
      expect(result.current.renewal.subtotal).toBe(MEMBERSHIP_FEES.GROUP.subscription * 8);

      // 3 new members pay registration
      expect(result.current.newRegistration.count).toBe(3);
      expect(result.current.newRegistration.subtotal).toBe(MEMBERSHIP_FEES.GROUP.registration * 3);
    });

    it('calculates total for renewal with new members', () => {
      const { result } = renderHook(() =>
        useRenewalFeeCalculation({
          membershipType: 'GROUP',
          memberCount: 10,
          maxCount: 7,
        })
      );

      const expectedRenewal = MEMBERSHIP_FEES.GROUP.subscription * 10;
      const expectedNewReg = MEMBERSHIP_FEES.GROUP.registration * 3;
      expect(result.current.total).toBe(expectedRenewal + expectedNewReg);
    });

    it('handles reduced member count (no negative registration)', () => {
      const { result } = renderHook(() =>
        useRenewalFeeCalculation({
          membershipType: 'GROUP',
          memberCount: 3,
          maxCount: 5,
        })
      );

      expect(result.current.newRegistration.count).toBe(0);
      expect(result.current.newRegistration.subtotal).toBe(0);
    });

    it('uses minimum of 1 for zero memberCount', () => {
      const { result } = renderHook(() =>
        useRenewalFeeCalculation({
          membershipType: 'GROUP',
          memberCount: 0,
          maxCount: 0,
        })
      );

      expect(result.current.renewal.count).toBe(1);
    });
  });
});
