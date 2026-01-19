// @vitest-environment jsdom

/**
 * Enhanced E2E Tests for Complete Membership Registration Flow
 * Tests the entire user journey from landing to registration completion
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HelmetProvider } from 'react-helmet-async';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { AuthProvider } from '@/features/auth/context/AuthContext';
import MembershipPage from '@/pages/MembershipPage';
import { ServiceProvider, createMockServiceContainer } from '@/shared/services/di';
import { useBackendStatus } from '@/shared/services/useBackendStatus';

vi.mock('@/shared/services/useBackendStatus', () => ({
  useBackendStatus: vi.fn(() => ({
    isBackendConnected: true,
    isChecking: false,
  })),
}));

const mockServices = createMockServiceContainer({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    setTokenResolver: vi.fn(),
    setUnauthorizedCallback: vi.fn(),
  },
  notificationService: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
    clearAll: vi.fn(),
  },
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  },
  storageService: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
});

function renderWithRouter(ui: React.ReactElement, { route = '/' } = {}) {
  return render(
    <ServiceProvider services={mockServices}>
      <HelmetProvider>
        <MemoryRouter initialEntries={[route]}>
          <AuthProvider>
            <Routes>
              <Route path={route} element={ui} />
              <Route path="/membership/success" element={<div>Registration Success</div>} />
              <Route path="/membership/error" element={<div>Registration Error</div>} />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      </HelmetProvider>
    </ServiceProvider>
  );
}

describe('Complete Membership Registration Flow', () => {
  // Set longer timeout for E2E tests
  vi.setConfig({ testTimeout: 30000 });

  beforeEach(() => {
    vi.setConfig({ testTimeout: 30000 });
    vi.clearAllMocks();

    vi.mocked(useBackendStatus).mockReturnValue({
      isBackendConnected: true,
      isChecking: false,
    });

    // Mock successful API responses
    mockServices.apiClient.post = vi.fn().mockResolvedValue({
      data: {
        member: { 
          id: 'member-123', 
          membershipNumber: 'M001',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@example.com',
          phone: '0712345678',
          membershipStatus: 'PENDING',
        },
        checkoutRequestId: 'checkout-456',
        message: 'Registration successful',
      },
    });
  });

  it('completes full individual membership registration', async () => {
    const user = userEvent.setup();

    // 1. User lands on membership page
    renderWithRouter(<MembershipPage />, { route: '/membership' });

    // 2. Verify membership page loads correctly
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /become a member/i })).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /membership registration/i })).toBeInTheDocument();
    });

    // 3. User selects individual membership
    const individualOption = screen.getByRole('button', { name: /individual/i });
    await user.click(individualOption);

    // 4. User fills in personal details
    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const phoneInput = screen.getByLabelText(/phone number/i);
    const idNumberInput = screen.getByLabelText(/national id number/i);

    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');
    await user.type(emailInput, 'john.doe@example.com');
    await user.type(phoneInput, '0712345678');
    await user.type(idNumberInput, '12345678');

    // 5. User fills in address details
    const countyInput = screen.getByLabelText(/^county$/i);
    const subCountyInput = screen.getByLabelText(/sub-county/i);
    const wardInput = screen.getByLabelText(/ward/i);
    const villageInput = screen.getByLabelText(/village/i);

    await user.type(countyInput, 'Nairobi');
    await user.type(subCountyInput, 'Westlands');
    await user.type(wardInput, 'Kangemi');
    await user.type(villageInput, 'Village Name');

    // 5b. User fills in other required personal details
    const dobInput = screen.getByLabelText(/date of birth/i);
    const genderSelect = screen.getByLabelText(/gender/i);
    await user.type(dobInput, '1990-01-01');
    await user.selectOptions(genderSelect, 'MALE');

    // 6. User accepts terms and conditions
    const termsCheckbox = screen.getByRole('checkbox', { name: /i agree to the terms/i });
    const consentCheckbox = screen.getByRole('checkbox', { name: /consent to the processing/i });
    
    await user.click(termsCheckbox);
    await user.click(consentCheckbox);

    // 7. User submits registration form
    const submitButton = screen.getByRole('button', { name: /complete registration/i });
    await user.click(submitButton);

    // 8. Verify API call was made
    await waitFor(() => {
      expect(mockServices.apiClient.post).toHaveBeenCalled();
      
      const calls = vi.mocked(mockServices.apiClient.post).mock.calls;
      const lastCall = calls.at(-1);
      if (!lastCall) throw new Error('No calls found');
      const [url, data] = lastCall;
      
      expect(url).toBe('/members/register');
      expect(data).toMatchObject({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phoneNumber: '+254712345678',
        nationalId: '12345678',
        county: 'Nairobi',
        subCounty: 'Westlands',
        ward: 'Kangemi',
        village: 'Village Name',
        dateOfBirth: '1990-01-01',
        gender: 'MALE',
        membershipType: 'INDIVIDUAL',
      });
    });

    // 9. Verify success notification
    await waitFor(() => {
      expect(mockServices.notificationService.success).toHaveBeenCalledWith(
        expect.stringMatching(/stk push sent to your phone/i)
      );
    });
  });

  it('completes full group membership registration', async () => {
    const user = userEvent.setup();

    renderWithRouter(<MembershipPage />, { route: '/membership' });

    // Select group membership
    const groupOption = screen.getByRole('button', { name: /group/i });
    await user.click(groupOption);

    // Fill group details
    const groupNameInput = screen.getByLabelText(/group name/i);
    const memberCountInput = screen.getByLabelText(/initial member count/i);

    await user.type(groupNameInput, 'Kangemi Youth Group');
    await user.clear(memberCountInput);
    await user.type(memberCountInput, '25');

    // Fill representative details
    const repFirstNameInput = screen.getByLabelText(/first name/i);
    const repLastNameInput = screen.getByLabelText(/last name/i);
    const repEmailInput = screen.getByLabelText(/email address/i);
    const repPhoneInput = screen.getByLabelText(/phone number/i);

    await user.type(repFirstNameInput, 'Alice');
    await user.type(repLastNameInput, 'Smith');
    await user.type(repEmailInput, 'alice.smith@example.com');
    await user.type(repPhoneInput, '0722000000');

    // Fill address details
    const countyInput = screen.getByLabelText(/^county$/i);
    await user.type(countyInput, 'Kiambu');

    const subCountyInput = screen.getByLabelText(/sub-county/i);
    const wardInput = screen.getByLabelText(/ward/i);
    const villageInput = screen.getByLabelText(/village/i);

    await user.type(subCountyInput, 'Limuru');
    await user.type(wardInput, 'Ndeiya');
    await user.type(villageInput, 'Village Name');

    // Accept terms
    const termsCheckbox = screen.getByRole('checkbox', { name: /i agree to the terms/i });
    const consentCheckbox = screen.getByRole('checkbox', { name: /consent to the processing/i });
    
    await user.click(termsCheckbox);
    await user.click(consentCheckbox);

    // Submit registration
    const submitButton = screen.getByRole('button', { name: /complete registration/i });
    await user.click(submitButton);

    // Verify API call
    await waitFor(() => {
      expect(mockServices.apiClient.post).toHaveBeenCalled();
      
      const calls = vi.mocked(mockServices.apiClient.post).mock.calls;
      const lastCall = calls.at(-1);
      if (!lastCall) throw new Error('No calls found');
      const [url, data] = lastCall;
      
      expect(url).toBe('/members/register');
      expect(data).toMatchObject({
        groupName: 'Kangemi Youth Group',
        memberCount: 25,
        firstName: 'Alice',
        lastName: 'Smith',
        email: 'alice.smith@example.com',
        phoneNumber: '+254722000000',
        county: 'Kiambu',
        subCounty: 'Limuru',
        ward: 'Ndeiya',
        village: 'Village Name',
        membershipType: 'GROUP',
      });
    });
  });

  it('validates required fields before submission', async () => {
    const user = userEvent.setup();

    renderWithRouter(<MembershipPage />, { route: '/membership' });

    // Try to submit without filling any fields
    const submitButton = screen.getByRole('button', { name: /complete registration/i });
    await user.click(submitButton);

    // Verify no API call was made
    expect(mockServices.apiClient.post).not.toHaveBeenCalled();

    // Verify validation errors are displayed (if implemented)
    // This would depend on the actual validation implementation
  });

  it('handles API errors gracefully', async () => {
    const user = userEvent.setup();

    // Mock API error
    mockServices.apiClient.post = vi.fn().mockRejectedValue(new Error('Network error'));

    renderWithRouter(<MembershipPage />, { route: '/membership' });

    // Fill and submit form
    const individualOption = screen.getByRole('button', { name: /individual/i });
    await user.click(individualOption);

    const firstNameInput = screen.getByLabelText(/first name/i);
    const lastNameInput = screen.getByLabelText(/last name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const phoneInput = screen.getByLabelText(/phone number/i);

    await user.type(firstNameInput, 'Test');
    await user.type(lastNameInput, 'User');
    await user.type(emailInput, 'test@example.com');
    await user.type(phoneInput, '0733000000');

    // Fill remaining required fields to pass validation
    const dobInput = screen.getByLabelText(/date of birth/i);
    const genderSelect = screen.getByLabelText(/gender/i);
    const idNumberInput = screen.getByLabelText(/national id number/i);
    const countyInput = screen.getByLabelText(/^county$/i);
    const subCountyInput = screen.getByLabelText(/sub-county/i);
    const wardInput = screen.getByLabelText(/ward/i);
    const villageInput = screen.getByLabelText(/village/i);
    const consentCheckbox = screen.getByRole('checkbox', { name: /consent to the processing/i });

    await user.type(dobInput, '1990-01-01');
    await user.selectOptions(genderSelect, 'MALE');
    await user.type(idNumberInput, '12345678');
    await user.type(countyInput, 'Nairobi');
    await user.type(subCountyInput, 'Westlands');
    await user.type(wardInput, 'Parklands');
    await user.type(villageInput, 'Village');
    await user.click(consentCheckbox);

    const termsCheckbox = screen.getByRole('checkbox', { name: /i agree to the terms/i });
    await user.click(termsCheckbox);

    const submitButton = screen.getByRole('button', { name: /complete registration/i });
    await user.click(submitButton);

    // Verify error handling
    await waitFor(() => {
      expect(mockServices.notificationService.error).toHaveBeenCalledWith(
        expect.stringMatching(/failed/i)
      );
    });
  });

  it('calculates fees correctly for different membership types', async () => {
    const user = userEvent.setup();

    renderWithRouter(<MembershipPage />, { route: '/membership' });

    // Select individual membership
    const individualOption = screen.getByRole('button', { name: /individual/i });
    await user.click(individualOption);

    // Verify individual fee is displayed (Registration: 500 + Subscription: 1000 = 1500)
    await waitFor(() => {
      expect(screen.getByText(/kes 1,500/i)).toBeInTheDocument();
    });

    // Select group membership
    const groupOption = screen.getByRole('button', { name: /group/i });
    await user.click(groupOption);

    // Enter member count
    const memberCountInput = screen.getByLabelText(/initial member count/i);
    await user.clear(memberCountInput);
    await user.type(memberCountInput, '10');

    // Verify group fee is calculated correctly
    // Registration: 250 * 10 = 2500
    // Subscription: 500 * 10 = 5000
    // Total: 7500
    await waitFor(() => {
      expect(screen.getByText(/kes 7,500/i)).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});
