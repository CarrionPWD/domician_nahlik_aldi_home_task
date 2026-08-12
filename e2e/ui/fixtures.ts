import { test as base } from '@playwright/test';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';

type UiFixtures = {
  homePage: HomePage;
  loginPage: LoginPage;
};

/**
 * UI fixtures: mask automation signals for Friendly Captcha and provide page objects.
 */
export const test = base.extend<UiFixtures>({
  context: async ({ context }, use) => {
    await context.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const win = window as any;
      win.chrome = win.chrome || { runtime: {} };

      const originalQuery = window.navigator.permissions?.query?.bind(window.navigator.permissions);
      if (originalQuery) {
        window.navigator.permissions.query = (parameters: PermissionDescriptor) =>
          parameters.name === 'notifications'
            ? Promise.resolve({ state: Notification.permission } as PermissionStatus)
            : originalQuery(parameters);
      }
    });
    await use(context);
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
});

export { expect } from '@playwright/test';
