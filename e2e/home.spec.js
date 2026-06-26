import { expect, test } from '@playwright/test';

test('home page shows only the brain with a loading overlay', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByTestId('viewer-frame')).toBeVisible();
  await expect(page.getByTestId('loading-overlay')).toBeVisible();
  await expect(page.getByTestId('loading-label')).toContainText('Loading full brain');
  await expect(page.getByTestId('source-attribution')).toContainText('PittBrains3D Whole Brain');
  await expect(page.getByRole('link', { name: 'Repository' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'CC BY-SA 4.0' })).toBeVisible();
  await expect(page.getByTestId('selection-card')).toBeHidden();
  await expect(page.getByTestId('loading-overlay')).toBeHidden({ timeout: 180000 });
  await page.locator('#brain-canvas').click({ position: { x: 360, y: 260 } });
  await expect(page.getByTestId('selection-card')).toBeVisible();
  await expect(page.getByTestId('selection-list')).toContainText(/Glutamate|Dopamine|GABA|Serotonin|Acetylcholine|Norepinephrine|Glycine/);
  await page.getByTestId('selection-dismiss').click();
  await expect(page.getByTestId('selection-card')).toBeHidden();
  await page.locator('#brain-canvas').click({ position: { x: 430, y: 250 } });
  await expect(page.getByTestId('selection-card')).toBeVisible();
  await expect(page.locator('input[type="range"]')).toHaveCount(0);
});
