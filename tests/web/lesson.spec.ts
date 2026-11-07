import { test, expect } from '@playwright/test';
for (const width of [390, 768, 1440]) for (const theme of ['light', 'dark'] as const) {
  test(`${width}px ${theme}: lesson interactions`, async ({ page }) => {
    await page.setViewportSize({width,height:900});
    await page.emulateMedia({colorScheme:theme});
    await page.addInitScript(t => localStorage.setItem('genai-theme', t), theme);
    await page.goto('/learn/genai-basics/c2-02');
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBeTruthy();
    await page.getByRole('button', {name:'Next token', exact:false}).click();
    await page.getByRole('button', {name:'Expand workspace'}).click();
    const dialog=page.getByRole('dialog');
    await expect(dialog).toContainText('The sky is');
    await dialog.getByRole('button', {name:'Toggle color theme'}).click();
    await expect(dialog).toContainText('The sky is');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('button', {name:'Expand workspace'})).toBeFocused();
    await expect(page.getByRole('button', {name:'Check answer'})).toBeDisabled();
    await page.getByLabel('It repeatedly predicts and selects a next token.').check();
    await page.getByRole('button', {name:'Check answer'}).click();
    await expect(page.getByText('Correct.', {exact:false})).toBeVisible();
    await page.getByRole('button', {name:'Try again'}).click();
    await expect(page.getByRole('button', {name:'Check answer'})).toBeDisabled();
  });
}
