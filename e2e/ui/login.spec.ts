import { test } from './fixtures';
import { credentials } from './pages/LoginPage';

/**
 * Login feature E2E tests against live https://www.aldi.us
 * Page objects: HomePage (storefront) + LoginPage (account form)
 */
test.describe('Login feature (aldi.us)', () => {
  test('Successful login with valid credentials', async ({ homePage, loginPage }) => {
    await homePage.open();
    await homePage.acceptCookiesIfVisible();
    await homePage.confirmShoppingModeIfVisible();
    await homePage.clickSignIn();

    await loginPage.expectLoaded();
    await loginPage.enterEmail(credentials.valid.email);
    await loginPage.enterPassword(credentials.valid.password);
    await loginPage.completeFriendlyCaptcha();
    await loginPage.clickLogIn();

    await loginPage.expectLeftLoginPage();
    await homePage.expectUserSignedIn();
  });

  test('Invalid password shows an error and stays on login', async ({ homePage, loginPage }) => {
    await homePage.open();
    await homePage.acceptCookiesIfVisible();
    await homePage.confirmShoppingModeIfVisible();
    await homePage.clickSignIn();

    await loginPage.expectLoaded();
    await loginPage.enterEmail(credentials.valid.email);
    await loginPage.enterPassword(credentials.invalidPassword);
    await loginPage.completeFriendlyCaptcha();
    await loginPage.clickLogIn();

    await loginPage.expectStillOnLoginPage();
    await loginPage.expectErrorVisible();
  });
});
