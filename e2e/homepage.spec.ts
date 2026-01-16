import { expect, test, type Page } from '@playwright/test';

async function disableExternalFonts(page: Page) {
  await page.route('https://fonts.googleapis.com/*', (route) => route.abort());
  await page.route('https://fonts.gstatic.com/*', (route) => route.abort());
}

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await disableExternalFonts(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Check that the page loads
    await expect(page).toHaveTitle(/wiria cbo/i);

    // Check for main navigation elements
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    await disableExternalFonts(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Check navigation links are present
    const nav = page.locator('nav');
    await expect(nav.getByRole('link', { name: /home/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /about/i })).toBeVisible();
    await expect(nav.getByRole('link', { name: /contact/i })).toBeVisible();
  });

  test('should display hero section', async ({ page }) => {
    await disableExternalFonts(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Hero section should be visible
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    await disableExternalFonts(page);
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Page should load on mobile
    await expect(page).toHaveTitle(/wiria cbo/i);

    // Mobile menu button should be visible
    const mobileMenu = page.getByRole('button', { name: /menu/i });
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
      // Menu should expand
      await expect(page.locator('nav')).toBeVisible();
    }
  });
});
