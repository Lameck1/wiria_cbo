// @vitest-environment jsdom

/**
 * Enhanced E2E Tests for Complete Membership Registration Flow
 * Tests the entire user journey from landing to registration completion
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import MembershipPage from '@/pages/MembershipPage';
import { ServiceProvider, createMockServiceContainer } from '@/shared/services/di';

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
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path={route} element={ui} />
          <Route path="/membership/success" element={<div>Registration Success</div>} />
          <Route path="/membership/error" element={<div>Registration Error</div>} />
        </Routes>
      </MemoryRouter>
    </ServiceProvider>
  );
}

describe('Complete Membership Registration Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
      expect(screen.getByText(/membership information/i)).toBeInTheDocument();
    });

    // 3. User selects individual membership
    const individualOption = screen.getByRole('radio', { name: /individual/i });
    await user.click(individualOption);

    // 4. User fills in personal details
    const firstNameInput = screen.getByPlaceholderText(/first name/i);
    const lastNameInput = screen.getByPlaceholderText(/last name/i);
    const emailInput = screen.getByPlaceholderText(/email address/i);
    const phoneInput = screen.getByPlaceholderText(/phone number/i);
    const idNumberInput = screen.getByPlaceholderText(/id number/i);

    await user.type(firstNameInput, 'John');
    await user.type(lastNameInput, 'Doe');
    await user.type(emailInput, 'john.doe@example.com');
    await user.type(phoneInput, '0712345678');
    await user.type(idNumberInput, '12345678');

    // 5. User fills in address details
    const countySelect = screen.getByLabelText(/county/i);
    const subCountyInput = screen.getByPlaceholderText(/sub-county/i);
    const wardInput = screen.getByPlaceholderText(/ward/i);

    await user.selectOptions(countySelect, 'Nairobi');
    await user.type(subCountyInput, 'Westlands');
    await user.type(wardInput, 'Kangemi');

    // 6. User accepts terms and conditions
    const termsCheckbox = screen.getByRole('checkbox', { name: /i agree to the terms/i });
    await user.click(termsCheckbox);

    // 7. User submits registration form
    const submitButton = screen.getByRole('button', { name: /register now/i });
    await user.click(submitButton);

    // 8. Verify API call was made
    await waitFor(() => {
      expect(mockServices.apiClient.post).toHaveBeenCalledWith('/members/register', expect.objectContaining({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '0712345678',
        idNumber: '12345678',
        county: 'Nairobi',
        subCounty: 'Westlands',
        ward: 'Kangemi',
        membershipType: 'INDIVIDUAL',
      }));
    });

    // 9. Verify success notification
    await waitFor(() => {
      expect(mockServices.notificationService.success).toHaveBeenCalledWith(
        expect.stringContaining('Registration successful')
      );
    });
  });

  it('completes full group membership registration', async () => {
    const user = userEvent.setup();

    renderWithRouter(<MembershipPage />, { route: '/membership' });

    // Select group membership
    const groupOption = screen.getByRole('radio', { name: /group/i });
    await user.click(groupOption);

    // Fill group details
    const groupNameInput = screen.getByPlaceholderText(/group name/i);
    const groupTypeSelect = screen.getByLabelText(/group type/i);
    const memberCountInput = screen.getByPlaceholderText(/number of members/i);

    await user.type(groupNameInput, 'Kangemi Youth Group');
    await user.selectOptions(groupTypeSelect, 'YOUTH');
    await user.type(memberCountInput, '25');

    // Fill representative details
    const repFirstNameInput = screen.getByPlaceholderText(/representative first name/i);
    const repLastNameInput = screen.getByPlaceholderText(/representative last name/i);
    const repEmailInput = screen.getByPlaceholderText(/representative email/i);
    const repPhoneInput = screen.getByPlaceholderText(/representative phone/i);

    await user.type(repFirstNameInput, 'Alice');
    await user.type(repLastNameInput, 'Smith');
    await user.type(repEmailInput, 'alice.smith@example.com');
    await user.type(repPhoneInput, '0722000000');

    // Fill address details
    const countySelect = screen.getByLabelText(/county/i);
    await user.selectOptions(countySelect, 'Kiambu');

    const subCountyInput = screen.getByPlaceholderText(/sub-county/i);
    const wardInput = screen.getByPlaceholderText(/ward/i);

    await user.type(subCountyInput, 'Limuru');
    await user.type(wardInput, 'Ndeiya');

    // Accept terms
    const termsCheckbox = screen.getByRole('checkbox', { name: /i agree to the terms/i });
    await user.click(termsCheckbox);

    // Submit registration
    const submitButton = screen.getByRole('button', { name: /register now/i });
    await user.click(submitButton);

    // Verify API call
    await waitFor(() => {
      expect(mockServices.apiClient.post).toHaveBeenCalledWith('/members/register', expect.objectContaining({
        groupName: 'Kangemi Youth Group',
        groupType: 'YOUTH',
        memberCount: 25,
        representativeFirstName: 'Alice',
        representativeLastName: 'Smith',
        representativeEmail: 'alice.smith@example.com',
        representativePhone: '0722000000',
        county: 'Kiambu',
        subCounty: 'Limuru',
        ward: 'Ndeiya',
        membershipType: 'GROUP',
      }));
    });
  });

  it('validates required fields before submission', async () => {
    const user = userEvent.setup();

    renderWithRouter(<MembershipPage />, { route: '/membership' });

    // Try to submit without filling any fields
    const submitButton = screen.getByRole('button', { name: /register now/i });
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
    const individualOption = screen.getByRole('radio', { name: /individual/i });
    await user.click(individualOption);

    const firstNameInput = screen.getByPlaceholderText(/first name/i);
    const lastNameInput = screen.getByPlaceholderText(/last name/i);
    const emailInput = screen.getByPlaceholderText(/email address/i);
    const phoneInput = screen.getByPlaceholderText(/phone number/i);

    await user.type(firstNameInput, 'Test');
    await user.type(lastNameInput, 'User');
    await user.type(emailInput, 'test@example.com');
    await user.type(phoneInput, '0733000000');

    const termsCheckbox = screen.getByRole('checkbox', { name: /i agree to the terms/i });
    await user.click(termsCheckbox);

    const submitButton = screen.getByRole('button', { name: /register now/i });
    await user.click(submitButton);

    // Verify error handling
    await waitFor(() => {
      expect(mockServices.notificationService.error).toHaveBeenCalledWith(
        expect.stringContaining('Failed')
      );
    });
  });

  it('calculates fees correctly for different membership types', async () => {
    const user = userEvent.setup();

    renderWithRouter(<MembershipPage />, { route: '/membership' });

    // Select individual membership
    const individualOption = screen.getByRole('radio', { name: /individual/i });
    await user.click(individualOption);

    // Verify individual fee is displayed
    await waitFor(() => {
      expect(screen.getByText(/ksh 1,000/i)).toBeInTheDocument();
    });

    // Select group membership
    const groupOption = screen.getByRole('radio', { name: /group/i });
    await user.click(groupOption);

    // Enter member count
    const memberCountInput = screen.getByPlaceholderText(/number of members/i);
    await user.type(memberCountInput, '10');

    // Verify group fee is calculated correctly (KES 500 per member)
    await waitFor(() => {
      expect(screen.getByText(/ksh 5,000/i)).toBeInTheDocument();
    });
  });
});
