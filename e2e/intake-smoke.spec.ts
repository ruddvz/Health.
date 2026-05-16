import { expect, test } from '@playwright/test';

test.describe('Intake smoke', () => {
	test('home shows intake first step', async ({ page }) => {
		await page.goto('.');
		await expect(page.getByText('About you').first()).toBeVisible();
		await expect(page.getByText('Answers save automatically on this device.')).toBeVisible();
	});
});
