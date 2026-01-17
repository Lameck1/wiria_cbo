# WIRIA CBO - Audit Fixes Implementation Plan

**Status:** In Progress  
**Goal:** Achieve 100% Codebase Quality  
**Total Effort:** 181 hours over 4 phases  
**Start Date:** January 17, 2026

---

## Implementation Status

- [ ] Phase 1 (P0 - Critical): 56 hours - **IN PROGRESS**
- [ ] Phase 2 (P1 - High Priority): 54 hours
- [ ] Phase 3 (P2 - Medium Priority): 52 hours
- [ ] Phase 4 (P3 - Optional): 19 hours

---

## Phase 1: Critical Issues (P0 - Mandatory)

**Timeline:** 1.5 weeks | **Effort:** 56 hours | **Priority:** CRITICAL

### 1.1 Extract Shared Payment Flow Logic (6h)

**Status:** 🔄 In Progress

**Files to Create:**
- `src/shared/hooks/usePaymentFlow.ts` - New shared payment hook
- `src/shared/types/payment.ts` - Shared payment types

**Files to Modify:**
- `src/features/donations/hooks/useDonation.ts` - Use shared hook
- `src/features/membership/hooks/useRegistration.ts` - Use shared hook
- `src/features/membership/hooks/useRenewal.ts` - Use shared hook

**Implementation Steps:**
1. [ ] Create `PaymentStatus` enum with standardized values
2. [ ] Create `usePaymentFlow` hook with:
   - `initiatePayment()` - Unified payment initiation
   - `checkPaymentStatus()` - Unified status checking
   - `pollPaymentStatus()` - Unified polling mechanism
   - Consistent notification handling
   - Proper error handling
3. [ ] Refactor `useDonation` to use shared hook
4. [ ] Refactor `useRegistration` to use shared hook
5. [ ] Refactor `useRenewal` to use shared hook
6. [ ] Remove duplicated code (~400 lines reduction)
7. [ ] Add unit tests for shared hook

**Expected Outcome:**
- Single source of truth for payment logic
- Consistent behavior across all payment flows
- ~400 lines of code eliminated
- Easier to maintain and extend

---

### 1.2 Standardize Payment Status Enums (2h)

**Status:** 🔄 In Progress (combined with 1.1)

**Files to Modify:**
- All payment-related hooks and components

**Implementation:**
- Create shared `PaymentStatus` enum
- Replace all instances of 'SUCCESS' with 'COMPLETED'
- Ensure API response mapping is consistent

---

### 1.3 Fix TypeScript Error Suppression (2h)

**Status:** ⏳ Pending

**File:** `src/shared/components/ui/form/Form.tsx` (line 29)

**Current Issue:**
```typescript
// @ts-expect-error - Zod version mismatch between react-hook-form and zod
resolver: zodResolver(schema),
```

**Implementation Steps:**
1. [ ] Check package.json for react-hook-form and zod versions
2. [ ] Update to compatible versions:
   - `react-hook-form: ^7.54.2`
   - `zod: ^3.23.8`
   - `@hookform/resolvers: ^5.2.2`
3. [ ] Remove `@ts-expect-error` comment
4. [ ] Verify all forms still validate correctly
5. [ ] Run type-check to ensure no errors

---

### 1.4 Fix Logger Service Bug (0.5h)

**Status:** ⏳ Pending

**File:** `src/shared/services/logger.ts` (line 18)

**Current Bug:**
```typescript
debug(message: string, ...args: unknown[]): void {
  if (config.env.isDevelopment()) {
    console.debug(`[DEBUG] ${message}`, ...args);
  } else {
    console.warn(`[DEBUG] ${message}`, ...args); // ❌ Should be console.log
  }
}
```

**Fix:**
```typescript
debug(message: string, ...args: unknown[]): void {
  if (config.env.isDevelopment()) {
    console.debug(`[DEBUG] ${message}`, ...args);
  } else {
    console.log(`[DEBUG] ${message}`, ...args); // ✅ Fixed
  }
}
```

---

### 1.5 Fix Inconsistent API Response Access (3h)

**Status:** ⏳ Pending

**Files to Modify:**
- `src/features/membership/hooks/useRenewal.ts` - Fix response.data access
- Other hooks with inconsistent patterns

**Implementation:**
1. [ ] Audit all API response access patterns
2. [ ] Ensure consistent use of `extractData()` utility
3. [ ] Update useRenewal to properly access `response.data`
4. [ ] Add tests to verify response handling

---

### 1.6 Add Authentication Tests (12h)

**Status:** ⏳ Pending

**Files to Create:**
- `tests/unit/auth/useAuth.test.tsx`
- `tests/unit/auth/AuthContext.test.tsx`
- `tests/unit/auth/useLogin.test.tsx`
- `tests/integration/auth/protected-routes.test.tsx`
- `tests/integration/auth/session-management.test.tsx`

**Test Coverage:**
- [ ] useAuth hook with token persistence
- [ ] AuthContext provider state management
- [ ] useLogin error handling (API failures, network errors)
- [ ] Protected routes and redirects
- [ ] Role-based access control
- [ ] Password reset flow
- [ ] Session management (logout, token refresh)

---

### 1.7 Add Payment Flow Tests (16h)

**Status:** ⏳ Pending

**Files to Create:**
- `tests/unit/payments/usePaymentFlow.test.tsx`
- `tests/integration/payments/registration-payment.test.tsx`
- `tests/integration/payments/renewal-payment.test.tsx`
- `tests/integration/payments/donation-payment.test.tsx`
- `tests/integration/payments/payment-polling.test.tsx`

**Test Coverage:**
- [ ] usePaymentFlow shared hook
- [ ] useRegistration full lifecycle
- [ ] useRenewal full lifecycle
- [ ] useDonation full lifecycle
- [ ] M-Pesa STK Push callback handling
- [ ] Payment timeout scenarios
- [ ] Manual payment verification
- [ ] Payment status polling
- [ ] Error recovery and retry logic

---

### 1.8 Add Safeguarding Tests (14h)

**Status:** ⏳ Pending

**Files to Create:**
- `tests/unit/safeguarding/useSafeguardingReport.test.tsx`
- `tests/integration/safeguarding/report-submission.test.tsx`
- `tests/integration/safeguarding/emailjs-fallback.test.tsx`
- `tests/integration/safeguarding/report-lookup.test.tsx`

**Test Coverage:**
- [ ] useSafeguardingReport hook (130+ lines)
- [ ] Safeguarding API submission
- [ ] EmailJS fallback when backend unavailable
- [ ] Report lookup by reference number
- [ ] Anonymous vs identified reporting
- [ ] File upload with evidence
- [ ] Validation of sensitive data

---

## Phase 2: High Priority Issues (P1)

**Timeline:** 1.5 weeks | **Effort:** 54 hours | **Status:** ⏳ Pending

### 2.1 Extract TokenManager Service (8h)
### 2.2 Implement Service Interfaces & DI (16h)
### 2.3 Add MSW for API Mocking (8h)
### 2.4 Consolidate Header useEffects (4h)
### 2.5 Create ResilientApiClient (8h)
### 2.6 Extract useContactForm Concerns (4h)
### 2.7 Add useMemberData Tests (6h)

---

## Phase 3: Medium Priority Issues (P2)

**Timeline:** 1.5 weeks | **Effort:** 52 hours | **Status:** ⏳ Pending

### 3.1 Remove Unused Exports (6h)
### 3.2 Simplify memberAdapter (12h)
### 3.3 Add Notification Cleanup (3h)
### 3.4 Consolidate Phone Validators (2h)
### 3.5 Split Large Components (16h)
### 3.6 Provider Composition Pattern (4h)
### 3.7 Migrate useDashboard to use() (0.5h)
### 3.8 Improve E2E Tests (8h)

---

## Phase 4: Optional Improvements (P3)

**Timeline:** 0.5 weeks | **Effort:** 19 hours | **Status:** ⏳ Pending

### 4.1 Minor Code Improvements (8h)
### 4.2 Add Accessibility Attributes (2h)
### 4.3 Remove Unused Types (3h)
### 4.4 Update Dev Dependencies (2h)
### 4.5 Other Optional Fixes (4h)

---

## Progress Tracking

### Completed Tasks
- [x] Comprehensive audit completed
- [x] AUDIT_REPORT.md created (1,971 lines)
- [x] Implementation plan created

### In Progress
- [ ] Phase 1.1 - Extract shared payment flow logic

### Metrics Goals

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Test Coverage | 26% | 80%+ | ⏳ In Progress |
| Code Duplication | High | Low | ⏳ In Progress |
| Unused Exports | 67 | 0 | ⏳ Pending |
| Files > 300 LOC | 8 | 0 | ⏳ Pending |
| SOLID Violations | Multiple | 0 | ⏳ In Progress |
| TypeScript Errors | 1 suppressed | 0 | ⏳ Pending |

---

## Notes

- Each phase will be committed separately for review
- Tests will be added alongside code changes
- All changes will be validated with linting and type-checking
- Progress will be reported after each major milestone

---

**Last Updated:** January 17, 2026
