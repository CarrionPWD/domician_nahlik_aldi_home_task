import { defineConfig, devices } from '@playwright/test';

const apiBaseURL = process.env['API_BASE_URL'] ?? 'http://localhost:3000';
const headed = process.env['HEADED'] === '1' || process.argv.includes('--headed');

/**
 * UI tests hit live aldi.us (Friendly Captcha prefers real Chrome over bundled Chromium).
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 1 : 0,
  workers: 1,
  timeout: 120_000,
  expect: {
    timeout: 20_000,
  },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 20_000,
    navigationTimeout: 45_000,
  },
  projects: [
    {
      name: 'ui',
      testMatch: /ui\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        headless: !headed,
        baseURL: 'https://www.aldi.us',
        locale: 'en-US',
        timezoneId: 'America/Chicago',
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
        launchOptions: {
          args: ['--disable-blink-features=AutomationControlled'],
        },
      },
    },
    {
      name: 'api',
      testMatch: /api\/.*\.spec\.ts/,
      use: {
        baseURL: apiBaseURL,
        extraHTTPHeaders: {
          Accept: 'application/json',
        },
      },
    },
  ],
});
