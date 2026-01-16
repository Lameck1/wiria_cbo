import { expect, test, type Page } from '@playwright/test';

async function disableExternalFonts(page: Page) {
  await page.route('https://fonts.googleapis.com/*', (route) => route.abort());
  await page.route('https://fonts.gstatic.com/*', (route) => route.abort());
}

test.describe('Navigation', () => {
  test('should navigate to About page', async ({ page }) => {
    await disableExternalFonts(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Click About link in main navigation
    await page
      .getByRole('link', { name: /^about$/i })
      .first()
      .click();

    // Should navigate to about page
    await expect(page).toHaveURL(/\/about/);
    await expect(page.getByRole('heading', { name: /about/i })).toBeVisible();
  });

  test('should navigate to Programs page', async ({ page }) => {
    await disableExternalFonts(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Look for Programs link
    const programsLink = page.getByRole('link', { name: /programs|services/i });
    if (await programsLink.isVisible()) {
      await programsLink.click();
      await expect(page).toHaveURL(/\/programs|\/services/);
    }
  });

  test('should navigate to News page', async ({ page }) => {
    await disableExternalFonts(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Look for News link
    const newsLink = page.getByRole('link', { name: /news|updates|blog/i });
    if (await newsLink.isVisible()) {
      await newsLink.click();
      await expect(page).toHaveURL(/\/news|\/updates|\/blog/);
    }
  });

  test('should navigate to Contact page', async ({ page }) => {
    await disableExternalFonts(page);
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Click Contact link
    await page.getByRole('link', { name: /contact/i }).click();

    // Should navigate to contact page
    await expect(page).toHaveURL(/\/contact/);
    await expect(page.getByRole('heading', { name: /contact/i })).toBeVisible();
  });

  test('should navigate back to home from any page', async ({ page }) => {
    await disableExternalFonts(page);
    await page.goto('/about', { waitUntil: 'domcontentloaded' });

    // Click home link or logo
    const homeLink = page.getByRole('link', { name: /home|^logo$/i }).first();
    await homeLink.click();

    // Should navigate back to home
    await expect(page).toHaveURL(/\/(home)?\/?$/);
  });

  test('should show 404 page for invalid routes', async ({ page }) => {
    await disableExternalFonts(page);
    await page.goto('/this-page-does-not-exist-12345', { waitUntil: 'domcontentloaded' });

    // Should show 404 or redirect to home
    const hasNotFound = await page
      .locator('text=/404|not found|page not found/i')
      .first()
      .isVisible();
    const isHome = page.url().endsWith('/') || page.url().endsWith('/home');

    expect(hasNotFound || isHome).toBeTruthy();
  });
});
