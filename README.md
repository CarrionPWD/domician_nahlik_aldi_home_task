# ALDI US — Playwright tests

Playwright suites against live [aldi.us](https://www.aldi.us/) (UI login) plus REST task-management API boilerplate.

## Credentials (UI login)

| Field | Value |
| --- | --- |
| Email | `geseg40542@primetor.com` |
| Password | `SuperPassword01!` |

Override with `ALDI_EMAIL` / `ALDI_PASSWORD` if needed.

## Setup

Requires **Google Chrome** installed (Friendly Captcha on `account.aldi.us` rejects bundled Chromium).

```bash
npm.cmd install
```

> On PowerShell, if `npm` is blocked by execution policy, use `npm.cmd`.

## Run tests

```bash
# UI login against aldi.us (uses real Chrome)
npm.cmd run e2e
npm.cmd run e2e:ui

# Watch the browser
npm.cmd run e2e:headed

# API boilerplate (needs a real API at API_BASE_URL or localhost:3000)
npm.cmd run e2e:api
```

### UI login flow covered

1. Open `https://www.aldi.us`
2. Accept cookies if shown
3. Confirm **How would you like to shop?** without changing selection
4. Open **Sign In / Register**
5. Complete Friendly Captcha (“Click to start verification”)
6. Assert success (valid password) or error (invalid password)

## Task docs

| Task | Document |
| --- | --- |
| Task 1 — Manual testing | [docs/manual-testing-add-to-shopping-list.md](docs/manual-testing-add-to-shopping-list.md) |
| Task 2 — UI E2E | `e2e/ui/login.spec.ts` |
| Task 3 — API boilerplate | `e2e/api/tasks.spec.ts` |
| Docs index | [docs/README.md](docs/README.md) |

## Bonus write-ups

| Topic | Doc |
| --- | --- |
| Docker for QA | [docs/docker-for-qa.md](docs/docker-for-qa.md) |
| JUnit + Selenium (Delete Task) | [docs/junit-selenium-delete-task.md](docs/junit-selenium-delete-task.md) |
| CI integration | [docs/ci-integration.md](docs/ci-integration.md) |

## Layout

```text
e2e/ui/login.spec.ts       Login E2E against aldi.us
e2e/api/tasks.spec.ts      Task API CRUD boilerplate
e2e/api/types.ts           Shared API types
docs/                      Manual testing + bonus Q&A
playwright.config.ts       UI + API projects
```
