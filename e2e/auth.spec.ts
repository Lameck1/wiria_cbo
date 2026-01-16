import { expect, test, type Page } from '@playwright/test';

async function disableExternalFonts(page: Page) {
  await page.route('https://fonts.googleapis.com/*', (route) => route.abort());
  await page.route('https://fonts.gstatic.com/*', (route) => route.abort());
}

test.describe('Authentication', () => {
  test('should navigate to login page', async ({ page }) => {
    await disableExternalFonts(page);
    await page.goto('/member-login', { waitUntil: 'domcontentloaded' });

    // Should navigate directly to member login page
    await expect(page).toHaveURL(/\/member-login/);
    await expect(
      page.getByRole('heading', { name: /member portal login/i })
    ).toBeVisible();
  });

  test('should show login form', async ({ page }) => {
    await disableExternalFonts(page);
    await page.goto('/member-login', { waitUntil: 'domcontentloaded' });

    // Login form should be present
    const main = page.getByRole('main');
    await expect(main.getByLabel(/email or phone|username or email/i)).toBeVisible();
    await expect(main.getByLabel(/password/i)).toBeVisible();
    await expect(main.getByRole('button', { name: /login|sign in/i })).toBeVisible();
  });

  test('should show validation error for empty form', async ({ page }) => {
    await disableExternalFonts(page);
    await page.goto('/member-login', { waitUntil: 'domcontentloaded' });

    // Try to submit without filling form
    const main = page.getByRole('main');
    const submitButton = main.getByRole('button', { name: /login/i });
    await submitButton.click();

    // Should show validation errors
    await expect(
      page.getByText(/username, email or phone is required/i)
    ).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await disableExternalFonts(page);
    await page.goto('/member-login', { waitUntil: 'domcontentloaded' });

    // Fill form with invalid credentials
    const main = page.getByRole('main');
    await main.getByLabel(/email or phone|username or email/i).fill('invalid@example.com');
    await main.getByLabel(/password/i).fill('wrongpassword');

    // Submit form
    await main.getByRole('button', { name: /login/i }).click();

    // Should show error message (adjust based on actual implementation)
    // This is a placeholder - may need adjustment based on actual error handling
    await page.waitForTimeout(2000); // Wait for potential API call
  });

  test('should navigate to forgot password', async ({ page }) => {
    await disableExternalFonts(page);
    await page.goto('/member-login', { waitUntil: 'domcontentloaded' });

    // Find forgot password link
    const main = page.getByRole('main');
    const forgotPasswordLink = main.getByRole('link', { name: /forgot password\?/i });
    await forgotPasswordLink.click();

    // Should navigate to password reset page
    await expect(page).toHaveURL(/\/reset-password/);
  });
});
