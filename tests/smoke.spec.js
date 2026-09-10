const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// index.html is opened straight from disk; no server needed.
const ROOT = path.resolve(__dirname, '..');
const URL = 'file://' + path.join(ROOT, 'index.html');

test('page loads with the right title and no console errors', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(URL);
  await expect(page).toHaveTitle('Sambhav Shrestha');
  expect(errors).toEqual([]);
});

test('has the header and all five section ids', async ({ page }) => {
  await page.goto(URL);
  await expect(page.locator('.site-header')).toHaveCount(1);
  for (const id of ['top', 'work', 'projects', 'education', 'contact']) {
    await expect(page.locator('#' + id)).toHaveCount(1);
  }
});

test('work has four rows and education has two cards', async ({ page }) => {
  await page.goto(URL);
  await expect(page.locator('#work .row')).toHaveCount(4);
  await expect(page.locator('#education .card')).toHaveCount(2);
});

test('show all reveals eight project cards and hides the button', async ({ page }) => {
  await page.goto(URL);
  await expect(page.locator('#projects .card')).toHaveCount(8);
  await expect(page.locator('#projects .card:visible')).toHaveCount(4);
  const button = page.locator('button#show-all');
  await button.click();
  await expect(page.locator('#projects .card:visible')).toHaveCount(8);
  await expect(button).toBeHidden();
});

test('no horizontal scroll at phone width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(URL);
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(width).toBeLessThanOrEqual(390);
});

test('every logo image resolves and is 160px or smaller', async ({ page }) => {
  await page.goto(URL);
  const sources = await page.locator('img').evaluateAll((imgs) => imgs.map((i) => i.getAttribute('src')));
  expect(sources.length).toBeGreaterThan(0);
  for (const src of sources) {
    expect(fs.existsSync(path.join(ROOT, src))).toBe(true);
  }
  const broken = await page.locator('img').evaluateAll((imgs) =>
    imgs.filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.getAttribute('src')));
  expect(broken).toEqual([]);
  const oversized = await page.locator('img').evaluateAll((imgs) =>
    imgs.filter((i) => Math.max(i.naturalWidth, i.naturalHeight) > 160).map((i) => i.getAttribute('src')));
  expect(oversized).toEqual([]);
});

test('outbound links are well formed and the resume exists', async ({ page }) => {
  await page.goto(URL);
  const hrefs = await page.locator('a[href]').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  const allowed = /^(#[a-z]+|mailto:[^@\s]+@[^@\s]+|https:\/\/(github\.com|linkedin\.com)\/\S+|\.\/resume\.pdf)$/;
  for (const href of hrefs) {
    expect(href, `unexpected href ${href}`).toMatch(allowed);
  }
  expect(fs.existsSync(path.join(ROOT, 'resume.pdf'))).toBe(true);
});
