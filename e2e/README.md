# E2E Tests with Playwright

This directory contains end-to-end (E2E) tests for the WIRIA CBO application using Playwright.

## Test Structure

- `homepage.spec.ts` - Homepage functionality and responsiveness tests
- `auth.spec.ts` - Authentication flow tests (login, registration, password reset)
- `navigation.spec.ts` - Navigation and routing tests
- `contact-form.spec.ts` - Contact form submission and validation tests

## Running Tests

### Run all E2E tests
```bash
npm run test:e2e
```

### Run tests in UI mode (interactive)
```bash
npm run test:e2e:ui
```

### Run tests in specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run specific test file
```bash
npx playwright test e2e/homepage.spec.ts
```

### Run tests in headed mode (see browser)
```bash
npx playwright test --headed
```

### Debug tests
```bash
npx playwright test --debug
```

## Configuration

Tests are configured in `playwright.config.ts` at the project root.

**Key settings:**
- Base URL: `http://localhost:5173`
- Browsers: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- Automatic dev server start before tests
- Screenshots on failure
- Traces on first retry

## Writing Tests

### Test Structure
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/path');
    await expect(page.locator('selector')).toBeVisible();
  });
});
```

### Best Practices

1. **Use data-testid attributes** for stable selectors
2. **Use Role-based selectors** when possible (`getByRole`, `getByLabel`)
3. **Wait for elements** explicitly with `waitFor` or `expect`
4. **Isolate tests** - each test should be independent
5. **Clean up** after tests when necessary
6. **Use descriptive test names** that explain what is being tested

### Selectors Priority
1. `page.getByRole()` - Best for accessibility
2. `page.getByLabel()` - For form fields
3. `page.getByTestId()` - For stable custom attributes
4. `page.locator()` - As last resort

## CI Integration

E2E tests run automatically in GitHub Actions on:
- Push to main branch
- Pull requests
- Manual workflow dispatch

## Debugging Failed Tests

1. **Check the screenshot** - automatically captured on failure
2. **View the trace** - run with `--trace on` flag
3. **Run in headed mode** - see what's happening: `--headed`
4. **Use debug mode** - pause execution: `--debug`

## Coverage

Current E2E test coverage:
- ✅ Homepage loading and responsiveness
- ✅ Authentication flows
- ✅ Navigation between pages
- ✅ Contact form submission
- 🚧 Admin panel (future)
- 🚧 Member portal (future)
- 🚧 Donation flow (future)

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-test)
