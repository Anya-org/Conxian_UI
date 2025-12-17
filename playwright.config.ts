import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:3001',
    headless: true,
    viewport: { width: 1280, height: 720 },
    launchOptions: {
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    },
  },
  webServer: {
    command: 'npm run dev -- -p 3001',
    url: 'http://localhost:3001',
    reuseExistingServer: false,
    timeout: 120 * 1000,
  },
});
