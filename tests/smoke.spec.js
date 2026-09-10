const { test, expect } = require('@playwright/test');
const path = require('path');

// index.html is opened straight from disk; no server needed.
const URL = 'file://' + path.resolve(__dirname, '..', 'index.html');

test('page loads with the right title', async ({ page }) => {
  await page.goto(URL);
  await expect(page).toHaveTitle('Sambhav Shrestha');
});
