import { expect, type Locator, type Page } from '@playwright/test';

/**
 * Storefront (aldi.us) — cookies, shopping-mode popup, Sign In entry point.
 */
export class HomePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  get acceptCookiesButton(): Locator {
    return this.page
      .getByRole('button', { name: /^Accept All$/i })
      .or(this.page.locator('#onetrust-accept-btn-handler'));
  }

  get shopPrompt(): Locator {
    return this.page.getByText(/How would you like to shop\?/i);
  }

  get confirmShopButton(): Locator {
    return this.page.getByRole('button', { name: /^Confirm$/i });
  }

  get signInControl(): Locator {
    return this.page
      .getByRole('button', { name: /Sign In\s*\/\s*Register/i })
      .or(this.page.getByRole('link', { name: /Sign In\s*\/\s*Register/i }));
  }

  get signedInIndicator(): Locator {
    return this.page
      .locator('[aria-label="Account Menu"]')
  }

  async open(): Promise<void> {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
  }

  async acceptCookiesIfVisible(): Promise<void> {
    await this.clickIfVisible(this.acceptCookiesButton, 8_000);
  }

  /** Confirm shopping mode without changing Delivery / Pickup / In-Store. */
  async confirmShoppingModeIfVisible(): Promise<void> {
    try {
      await this.shopPrompt.waitFor({ state: 'visible', timeout: 10_000 });
      await this.confirmShopButton.click();
      await this.shopPrompt.waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => undefined);
    } catch {
      // Already dismissed for this session.
    }
  }

  async clickSignIn(): Promise<void> {
    await expect(this.signInControl.first()).toBeVisible({ timeout: 20_000 });
    await this.signInControl.first().click();
  }

  async expectUserSignedIn(): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');

    const signInStillVisible = await this.signInControl
      .first()
      .isVisible()
      .catch(() => false);

    if (signInStillVisible) {
      await expect(this.signedInIndicator.first()).toBeVisible({ timeout: 30_000 });
    } else {
      await expect(this.signInControl).toHaveCount(0);
    }
  }

  private async clickIfVisible(locator: Locator, timeoutMs = 5_000): Promise<boolean> {
    try {
      await locator.first().waitFor({ state: 'visible', timeout: timeoutMs });
      await locator.first().click();
      return true;
    } catch {
      return false;
    }
  }
}
