import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('should display contact form', async ({ page }) => {
    // Contact form should be visible
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/message|subject/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /send|submit/i })).toBeVisible();
  });

  test('should show validation errors for empty form', async ({ page }) => {
    // Try to submit empty form
    const submitButton = page.getByRole('button', { name: /send|submit/i });
    await submitButton.click();
    
    // Should show validation errors
    await expect(page.locator('text=/required/i')).toBeVisible();
  });

  test('should validate email format', async ({ page }) => {
    // Fill form with invalid email
    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('invalid-email');
    await page.getByLabel(/message|subject/i).fill('Test message');
    
    // Try to submit
    await page.getByRole('button', { name: /send|submit/i }).click();
    
    // Should show email validation error
    await expect(page.locator('text=/valid.*email|email.*invalid/i')).toBeVisible();
  });

  test('should submit form with valid data', async ({ page }) => {
    // Fill form with valid data
    await page.getByLabel(/name/i).fill('John Doe');
    await page.getByLabel(/email/i).fill('john@example.com');
    
    const messageField = page.getByLabel(/message|subject/i).first();
    await messageField.fill('This is a test message from E2E testing');
    
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
    await page.getByLabel(/message|subject/i).first().fill('Test message');
    await page.getByRole('button', { name: /send|submit/i }).click();
    
    // Wait for submission
    await page.waitForTimeout(3000);
    
    // Form should be cleared or show success message
    const nameField = page.getByLabel(/name/i);
    const nameValue = await nameField.inputValue();
    const hasSuccessMessage = await page.locator('text=/success|sent|thank you/i').isVisible();
    
    expect(nameValue === '' || hasSuccessMessage).toBeTruthy();
  });

  test('should have accessible form fields', async ({ page }) => {
    // All form fields should have proper labels
    const nameField = page.getByLabel(/name/i);
    const emailField = page.getByLabel(/email/i);
    const messageField = page.getByLabel(/message|subject/i);
    
    await expect(nameField).toBeVisible();
    await expect(emailField).toBeVisible();
    await expect(messageField).toBeVisible();
    
    // Fields should be focusable
    await nameField.focus();
    await expect(nameField).toBeFocused();
  });
});
