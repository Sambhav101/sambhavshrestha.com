// Runs the smoke test against index.html opened directly from disk.
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: 'tests',
  reporter: 'list',
  use: { browserName: 'chromium' },
});
