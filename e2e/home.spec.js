import { expect, test } from '@playwright/test';

test('home page shows only the brain with a loading overlay', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('viewer-frame')).toBeVisible();
  await expect(page.getByTestId('loading-overlay')).toBeVisible();
  await expect(page.getByTestId('loading-label')).toContainText('Loading full brain');
  await expect(page.getByTestId('source-attribution')).toContainText('PittBrains3D Whole Brain');
  await expect(page.getByRole('link', { name: 'Repository' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'CC BY-SA 4.0' })).toBeVisible();
  await expect(page.getByTestId('loading-overlay')).toBeHidden({ timeout: 180000 });
  await expect(page.locator('h1')).toHaveCount(0);
  await expect(page.getByRole('button')).toHaveCount(0);
  await expect(page.locator('input[type="range"]')).toHaveCount(0);
});
