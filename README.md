# Aldi Interview Home Task Solution Domicián Náhlik

The home task needs to be delivered as a public GitHub repo. For this reason the answers for the additional questions and the TCs for the Manual Testing task will be delivered as markdown files for better readability directly on GitHub.

## First task: Manual Testing

You can find the test cases, description and answers in the docs folder -> manual-testing.md

## Credentials (UI login)

Due to the ask to create an executable Playwright UI test, I decided to use aldi.us as the target webpage. I used a temporary e-mail provider for registration and created a test user which can be used for the asked automated login solution. You can find the credentials here: (not sure if it's a good idea to upload a test user's credentials for a live service in a public github repo but what can go wrong)

| Email | `geseg40542@primetor.com` |
| Password | `SuperPassword01!` |

Override with `ALDI_EMAIL` / `ALDI_PASSWORD` if needed as environment variables., usually I would store the credentials this way, it wasn't asked specifically in this task but added it as an option.

## Setup

Requires **Google Chrome** installed (Friendly Captcha on `account.aldi.us` rejects bundled Chromium).

```bash
npm install
```

## Run tests

```bash
# UI login against aldi.us (uses real Chrome)
npm run e2e
npm run e2e:ui

# Watch the browser
npm run e2e:headed

# API boilerplate (needs a real API at API_BASE_URL or localhost:3000)
npm run e2e:api
```

### UI login flow covered

Describing the login flow since it's a little complicated. Usually the site asks for cookies and asks me how I would like to shop (store, delivery, pick-up) so it needed to be an extra acceptance step when developing the automated solution. After that the login contains a FriendlyCaptcha which seems to fail in bundled Chromium so I decided to use a real Google Chrome browser.

1. Open `https://www.aldi.us`
2. Accept cookies if shown
3. Confirm **How would you like to shop?** without changing selection
4. Open **Sign In / Register**
5. Complete Friendly Captcha (“Click to start verification”)
6. Assert success (valid password) or error (invalid password)

## Layout

```text
e2e/ui/login.spec.ts       Login E2E against aldi.us
e2e/ui/pages/              Page files to make POM possible
e2e/api/tasks.spec.ts      Task API CRUD boilerplate
e2e/api/types.ts           Shared API types
docs/                      Manual testing + bonus Q&A
playwright.config.ts       UI + API projects
```
