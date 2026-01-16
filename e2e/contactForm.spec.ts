import { expect, test, type Page } from '@playwright/test';

async function disableExternalFonts(page: Page) {
  await page.route('https://fonts.googleapis.com/*', (route) => route.abort());
  await page.route('https://fonts.gstatic.com/*', (route) => route.abort());
}

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await disableExternalFonts(page);
    await page.goto('/contact', { waitUntil: 'domcontentloaded' });
  });

  test('should display contact form', async ({ page }) => {
    // Contact form should be visible
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/subject/i)).toBeVisible();
    await expect(page.getByLabel(/message/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /send|submit/i })).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    // Try to submit empty form
    const submitButton = page.getByRole('button', { name: /send|submit/i });
    await submitButton.click();

    // Should show validation errors
    const firstError = page.getByRole('alert').first();
    await expect(firstError).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    // Fill form with invalid email
    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByLabel(/subject/i).fill('Testing email validation');
    await page.getByLabel(/message/i).fill(
      'This is a longer test message to trigger only email validation.'
    );

    // Try to submit
    await page.getByRole('button', { name: /send|submit/i }).click();

    // Should show email validation error
    await expect(
      page.getByText(/please enter a valid email address/i)
    ).toBeVisible();
  });

  test('should submit form with valid data', async ({ page }) => {
    // Fill form with valid data
    await page.getByLabel(/name/i).fill('John Doe');
    await page.getByLabel(/email/i).fill('john@example.com');
    await page.getByLabel(/subject/i).fill('Website contact from Playwright test');
    await page
      .getByLabel(/message/i)
      .fill('This is a test message from E2E testing with enough length.');

    // Submit form
    await page.getByRole('button', { name: /send|submit/i }).click();

    // Should show success message or loading state
    await page.waitForTimeout(2000); // Wait for potential API call

    // Look for success indicator
    const hasSuccess = await page.locator('text=/success|sent|thank you/i').isVisible();
    const hasLoading = await page.locator('text=/sending|loading/i').isVisible();

    expect(hasSuccess || hasLoading).toBeTruthy();
  });

  test('should clear form after successful submission', async ({ page }) => {
    // Fill and submit form
    await page.getByLabel(/name/i).fill('Jane Doe');
    await page.getByLabel(/email/i).fill('jane@example.com');
    await page.getByLabel(/subject/i).fill('Clear form after submit');
    await page
      .getByLabel(/message/i)
      .fill('This is another sufficiently long test message for clearing.');
    await page.getByRole('button', { name: /send|submit/i }).click();

    // Wait for submission and potential success toast
    await page.waitForTimeout(5000);

    const successMessage = page.locator('text=/Message Sent Successfully!/i');
    const hasSuccess = await successMessage.isVisible();

    if (hasSuccess) {
      const nameField = page.getByLabel(/name/i);
      const nameValue = await nameField.inputValue();
      expect(nameValue).toBe('');
    }
  });

  test('should have accessible form fields', async ({ page }) => {
    // All form fields should have proper labels
    const nameField = page.getByLabel(/name/i);
    const emailField = page.getByLabel(/email/i);
    const messageField = page.getByLabel(/message/i);

    await expect(nameField).toBeVisible();
    await expect(emailField).toBeVisible();
    await expect(messageField).toBeVisible();

    // Fields should be focusable
    await nameField.focus();
    await expect(nameField).toBeFocused();
  });
});
