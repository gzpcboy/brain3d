import { expect, test } from '@playwright/test';

test('home page shows the version badge and loaded viewer shell', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('version-pill')).toContainText('Version');
  await expect(page.getByRole('heading', { name: 'Brain3D' })).toBeVisible();
  await expect(page.getByTestId('viewer-frame')).toBeVisible();
  await expect(page.getByTestId('source-copy')).toContainText('PittBrains3D');
  await expect(page.getByTestId('model-stats')).toContainText('Reduced triangles');
  await expect(page.getByTestId('status-line')).toContainText('Rotate, zoom, and inspect');
});
