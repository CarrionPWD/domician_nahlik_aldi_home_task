import { expect, type Locator, type Page } from '@playwright/test';

/** Test credentials for aldi.us login (override with env vars). */
export const credentials = {
  valid: {
    email: process.env.ALDI_EMAIL ?? 'geseg40542@primetor.com',
    password: process.env.ALDI_PASSWORD ?? 'SuperPassword01!',
  },
  invalidPassword: 'WrongPassword99!',
} as const;

/**
 * Account login form on account.aldi.us
 */
export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get accountHeading(): Locator {
    return this.page.getByRole('heading', { name: /ALDI Account/i });
  }

  get emailInput(): Locator {
    return this.page.locator('[data-id="emailAddress"]');
  }

  get passwordInput(): Locator {
    return this.page.locator('[data-id="password"]');
  }

  get loginButton(): Locator {
    return this.page.locator('.loginButton primary-button')
  }

  get captchaStart(): Locator {
    return this.page.getByText(/Click to start verification/i);
  }

  get captchaVerifying(): Locator {
    return this.page.getByText(/Verifying/i);
  }

  get captchaFailed(): Locator {
    return this.page.getByText(/Verification failed|Browser check failed/i);
  }

  get loginError(): Locator {
    return this.page.locator('.cus_login_fail_err')
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/account\.aldi\.us/i, { timeout: 30_000 });
    await expect(this.accountHeading).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
  }

  async enterEmail(email: string): Promise<void> {
    await this.emailInput.click();
    await this.emailInput.fill(email);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.click();
    await this.passwordInput.fill(password);
  }

  /** Friendly Captcha starts paused — click to verify, retry once on failure. */
  async completeFriendlyCaptcha(): Promise<void> {
    for (let attempt = 1; attempt <= 2; attempt++) {
      if (await this.captchaStart.isVisible().catch(() => false)) {
        await this.captchaStart.click();
      }

      await this.captchaVerifying.waitFor({ state: 'visible', timeout: 10_000 }).catch(() => undefined);

      try {
        await expect(this.loginButton).toBeEnabled({ timeout: 45_000 });
        return;
      } catch {
        if (attempt === 2 || !(await this.captchaFailed.isVisible().catch(() => false))) {
          throw new Error(
            'Friendly Captcha did not enable Log In. ' +
              'ALDI blocks many automated browsers. Try: npm run e2e:headed',
          );
        }
      }
    }
  }

  async clickLogIn(): Promise<void> {
    await this.loginButton.click();
  }

  async expectLeftLoginPage(): Promise<void> {
    await expect(this.page).not.toHaveURL(/account\.aldi\.us\/s\/login/i, { timeout: 60_000 });
  }

  async expectStillOnLoginPage(): Promise<void> {
    await expect(this.page).toHaveURL(/account\.aldi\.us\/s\/login/i);
  }

  async expectErrorVisible(): Promise<void> {
    await expect(this.loginError.first()).toBeVisible({ timeout: 30_000 });
    await expect(this.emailInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }
}
