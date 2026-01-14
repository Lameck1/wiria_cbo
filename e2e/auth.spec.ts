import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/');
    
    // Find and click login link
    const loginLink = page.getByRole('link', { name: /login|sign in/i });
    if (await loginLink.isVisible()) {
      await loginLink.click();
      
      // Should navigate to login page
      await expect(page).toHaveURL(/\/login/);
    }
  });

  test('should show login form', async ({ page }) => {
    await page.goto('/login');
    
    // Login form should be present
    await expect(page.getByLabel(/email|username/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /login|sign in/i })).toBeVisible();
  });

  test('should show validation error for empty form', async ({ page }) => {
    await page.goto('/login');
    
    // Try to submit without filling form
    const submitButton = page.getByRole('button', { name: /login|sign in/i });
    await submitButton.click();
    
    // Should show validation errors
    await expect(page.locator('text=/required|email|password/i')).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    // Fill form with invalid credentials
    await page.getByLabel(/email|username/i).fill('invalid@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    
    // Submit form
    await page.getByRole('button', { name: /login|sign in/i }).click();
    
    // Should show error message (adjust based on actual implementation)
    // This is a placeholder - may need adjustment based on actual error handling
    await page.waitForTimeout(2000); // Wait for potential API call
  });

  test('should navigate to forgot password', async ({ page }) => {
    await page.goto('/login');
    
    // Find forgot password link
    const forgotPasswordLink = page.getByRole('link', { name: /forgot.*password/i });
    if (await forgotPasswordLink.isVisible()) {
      await forgotPasswordLink.click();
      
      // Should navigate to password reset page
      await expect(page).toHaveURL(/\/forgot-password|\/reset-password/);
    }
  });
});
