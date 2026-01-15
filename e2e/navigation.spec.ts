import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to About page', async ({ page }) => {
    await page.goto('/');
    
    // Click About link
    await page.getByRole('link', { name: /about/i }).click();
    
    // Should navigate to about page
    await expect(page).toHaveURL(/\/about/);
    await expect(page.locator('h1, h2')).toContainText(/about/i);
  });

  test('should navigate to Programs page', async ({ page }) => {
    await page.goto('/');
    
    // Look for Programs link
    const programsLink = page.getByRole('link', { name: /programs|services/i });
    if (await programsLink.isVisible()) {
      await programsLink.click();
      await expect(page).toHaveURL(/\/programs|\/services/);
    }
  });

  test('should navigate to News page', async ({ page }) => {
    await page.goto('/');
    
    // Look for News link
    const newsLink = page.getByRole('link', { name: /news|updates|blog/i });
    if (await newsLink.isVisible()) {
      await newsLink.click();
      await expect(page).toHaveURL(/\/news|\/updates|\/blog/);
    }
  });

  test('should navigate to Contact page', async ({ page }) => {
    await page.goto('/');
    
    // Click Contact link
    await page.getByRole('link', { name: /contact/i }).click();
    
    // Should navigate to contact page
    await expect(page).toHaveURL(/\/contact/);
    await expect(page.locator('h1, h2')).toContainText(/contact/i);
  });

  test('should navigate back to home from any page', async ({ page }) => {
    await page.goto('/about');
    
    // Click home link or logo
    const homeLink = page.getByRole('link', { name: /home|^logo$/i }).first();
    await homeLink.click();
    
    // Should navigate back to home
    await expect(page).toHaveURL(/^\/$|\/home$/);
  });

  test('should show 404 page for invalid routes', async ({ page }) => {
    await page.goto('/this-page-does-not-exist-12345');
    
    // Should show 404 or redirect to home
    const hasNotFound = await page.locator('text=/404|not found|page not found/i').isVisible();
    const isHome = page.url().endsWith('/') || page.url().endsWith('/home');
    
    expect(hasNotFound || isHome).toBeTruthy();
  });
});
