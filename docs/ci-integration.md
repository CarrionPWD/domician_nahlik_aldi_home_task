# Bonus: CI Integration for Automated Tests

## Goal

On every **push** and **pull request**, CI should install dependencies, start (or reuse) the app under test, run the automated suites, and **fail the pipeline** if any test fails — before code merges.

## Recommended process

```text
commit / PR from Developer or QA
    → checkout code
    → install deps (npm ci)
    → (optional) build app / start services
    → run UI tests (Playwright)
    → run API tests (Playwright request) 
    → publish report / artifacts on failure
    → gate merge on green status checks
```

### Practices that keep CI trustworthy

| Practice | Detail |
| --- | --- |
| **Trigger early** | Run on `push` to main branches and on all PRs |
| **Deterministic installs** | `npm ci` (lockfile), pinned browser versions |
| **Ephemeral env** | Fresh container or runner per job |
| **Artifacts** | Upload Playwright HTML report, traces, screenshots on failure |
| **Sharding** | Split slow E2E across parallel jobs as the suite grows |
| **Required checks** | Protect `main` so PRs cannot merge while tests are red |
| **Secrets** | Store API tokens in CI secrets, never in the repo |

## Tools

Common choices:

- **GitHub Actions** — YAML workflows in `.github/workflows/` (used in the example below, we currently use this at my workplace)

## Example: GitHub Actions

We use the same approach, only difference is we use AWS ECR to pull our images that are needed, deploy them to the testing environment and then run our tests against that. If we need to verify a specific Docker Image if it would pass our UI tests we deploy that image to our env first then trigger the UI test runs.

Create `.github/workflows/e2e.yaml`:

```yaml
name: E2E Tests

on:
  push:
    branches: [main, master]
  pull_request:

jobs:
  ui-tests:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Chromium
        run: npx playwright install chromium --with-deps

      - name: Run UI E2E tests
        run: npm run e2e:ui

      - name: Upload Playwright report
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report-ui
          path: playwright-report/
          retention-days: 7

  api-tests:
    runs-on: ubuntu-latest
    # Enable when a real task API is available in CI
    if: false
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: npm
      - run: npm ci
      - name: Run API tests
        env:
          API_BASE_URL: ${{ secrets.API_BASE_URL }}
        run: npm run e2e:api
```

### What this does

1. On each commit/PR, GitHub spins up an Ubuntu runner.
2. Node and Playwright Chromium are installed in a clean environment.
3. `npm run e2e:ui` starts Angular via `playwright.config.ts` `webServer` and runs login tests.
4. Failures upload the HTML report for debugging.
5. Branch protection can require the **E2E Tests** check before merge.

## Familiar tool summary (GitHub Actions)

| Piece | Role |
| --- | --- |
| Workflow YAML | Declares triggers, jobs, steps |
| `actions/checkout` | Clones the PR/commit |
| `actions/setup-node` | Provides Node + npm cache |
| Playwright | Runs UI/API automation |
| Status checks | Block merge until green |
| Artifacts | Preserve reports/traces after the runner is gone |

## Optional: Docker in CI

For stronger parity with local QA setups, replace “setup Node + install browsers” with:

```yaml
- name: Run tests in Docker
  run: docker compose up --build --abort-on-container-exit tests
```

Same image locally and in CI reduces environment drift (see [docker-for-qa.md](./docker-for-qa.md)).
