import { test, expect } from '@playwright/test';

test('take screenshot of homepage', async ({ page }) => {
  await page.goto('/');
  await page.screenshot({ path: 'docs/images/homepage.png', fullPage: true });
});
