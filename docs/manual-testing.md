# Task 1: Manual Testing — Add to Cart (aldi.us)

**Application under test:** [https://www.aldi.us](https://www.aldi.us)  
**Feature:** Add to Cart  
**Scope:** Browse products and manage a Cart (positive + negative scenarios)

---

## Test case field definitions

These fields are used for every test case below:

| Field | Purpose |
| --- | --- |
| **Test Case ID** | Unique identifier (e.g. `TC-SL-001`) |
| **Title** | Short description of what is verified |
| **Feature / Module** | Feature area under test |
| **Priority** | `High` / `Medium` / `Low` (business risk) |
| **Type** | `Positive` or `Negative` |
| **Preconditions** | State required before steps (account, store, empty list, etc.) |
| **Test data** | Accounts, products, quantities used |
| **Steps** | Numbered actions to execute |
| **Expected result** | Observable outcome if the feature works |
| **Actual result** | Filled in during execution |
| **Status** | `Pass` / `Fail` / `Blocked` / `Not run` |
| **Environment** | Browser, OS, URL|
| **Notes** | Observations, workarounds, related bugs |

---

## Test Case 1: Add a single product to the Cart

| Field | Value |
| --- | --- |
| **Test Case ID** | `TC-SL-001` |
| **Title** | Add a single product to the Cart |
| **Feature / Module** | Cart |
| **Priority** | High |
| **Type** | Positive |
| **Environment** | Chrome (latest), Windows 11, `https://www.aldi.us`, store selected |
| **Preconditions** | 1) User is logged in. 2) A delivery/pickup/in-store location is selected. 3) Cart is empty (or count is known). 4) Chosen product is in stock for that store. |
| **Test data** | Valid account; product e.g. “Berryhill Grape Jelly” (or any in-stock item) |
| **Steps** | 1. Open aldi.us and confirm the selected store. 2. Search or browse to a single in-stock product. 3. Open the product detail (if required). 4. Click **Add** / **Add to CArt**. 5. Open the Cart (cart icon). |
| **Expected result** | 1) Success feedback is shown (toast, badge, or updated count). 2) Cart contains exactly that product once. 3) Product name, price (if shown), and quantity (default `1`) match the item added. 4) List item count increases by 1. |
| **Actual result** | Pass |
| **Status** | Pass Manually |
| **Notes** | Record product SKU/name and store ZIP for reproducibility. |

---

## Test Case 2: Attempt to add a product without being logged in and then check out

| Field | Value |
| --- | --- |
| **Test Case ID** | `TC-SL-002` |
| **Title** | Attempt to add a product without being logged in |
| **Feature / Module** | Cart / Authentication |
| **Priority** | High |
| **Type** | Negative |
| **Environment** | Chrome (latest), Windows 10/11, `https://www.aldi.us`, guest session (cleared cookies or private window) |
| **Preconditions** | 1) User is **not** logged in. 2) Store/location may or may not be selected (note which). 3) Cart / account list is not accessible as a signed-in user. |
| **Test data** | No account credentials; any visible product with an Add control |
| **Steps** | 1. Open aldi.us in a logged-out session. 2. Locate any product with **Add** / **Add to Cart**. 3. Click the add control. 4. Observe navigation, modals, and list state.  5. Open the Cart view 6. Click on 'Go to Checkout' button at the bottom of Cart view. 7. User should be redirected the login screen. |
| **Expected result** | 1) Product is **not** silently added to a persistent account Cart. 2) User is prompted to **Sign In / Register**, or clearly informed that login is required. 3) After dismissing the prompt without login, the authenticated Cart remains unchanged / inaccessible. 4) No partial corrupt list state for a guest (or guest behavior is documented and consistent). |
| **Actual result** | Pass |
| **Status** | Pass Manually |
| **Notes** | Distinguish “guest cart” vs “account Cart” if the site supports both; document which path was tested. |

---

## Test Case 3: Add multiple products and verify the Cart

| Field | Value |
| --- | --- |
| **Test Case ID** | `TC-SL-003` |
| **Title** | Add multiple products and verify the Cart |
| **Feature / Module** | Cart |
| **Priority** | High |
| **Type** | Positive |
| **Environment** | Chrome (latest), Windows 10/11, `https://www.aldi.us`, fixed store ZIP |
| **Preconditions** | 1) User is logged in. 2) Store selected. 3) Starting Cart count is recorded (`N`). 4) At least three distinct in-stock products are available. |
| **Test data** | Logged-in account; Product A, Product B, Product C (different names); optional: add Product A twice to check quantity vs duplicate lines |
| **Steps** | 1. Note the current Cart count (`N`). 2. Add Product A to the Cart. 3. Add Product B to the Cart. 4. Add Product C to the Cart. 5. Open the Cart. 6. Verify each line item. 7. (Optional) Add Product A again and verify quantity/duplicate handling. |
| **Expected result** | 1) All three products appear in the list. 2) No product is missing or replaced incorrectly. 3) Names and prices (if displayed) match what was added. 4) List count equals `N + 3` (or `N +` total quantity rules if duplicates merge). 5) Order of items is stable and understandable (e.g. newest first or catalog order). 6) Removing one item later does not remove the others (spot-check). |
| **Actual result** | Pass |
| **Status** | Pass Manually |
| **Notes** | Keep a screenshot of the final list; note whether quantities merge on re-add. |

---

## Bug reporting — field definitions

| Field | Purpose |
| --- | --- |
| **Bug ID** | Unique defect id (e.g. `BUG-SL-001`) |
| **Title** | One-line summary of the failure |
| **Severity** | Impact: `Critical` / `Major` / `Minor` / `Trivial` |
| **Priority** | Fix urgency: `P1`–`P4` |
| **Status** | `New` / `Open` / `In progress` / `Fixed` / `Verified` / `Closed` |
| **Environment** | URL, browser, OS, device, store ZIP, account type |
| **Build / Version** | Release, date, or commit if known |
| **Preconditions** | Setup required to see the bug |
| **Steps to reproduce** | Minimal numbered steps |
| **Expected result** | Correct behavior |
| **Actual result** | What happened |
| **Frequency** | `Always` / `Intermittent` (include approx. rate) |
| **Workaround** | If any |
| **Attachments** | Screenshots, video, console logs, DataDog Links |
| **Related test case** | e.g. `TC-SL-003` |
| **Reporter / Date** | Who found it and when |

---

## Sample bug report

### Potential bug (example)

While adding multiple products, the Cart badge count increases, but opening the list shows only the **last** product. Earlier items disappear or are overwritten — data loss for the shopper.

---

| Field | Value |
| --- | --- |
| **Bug ID** | `BUG-SL-001` |
| **Title** | Cart keeps only the last added product; previous items disappear |
| **Severity** | Major |
| **Priority** | P1 |
| **Status** | New |
| **Environment** | `https://www.aldi.us`, Chrome 128, Windows 11, store ZIP `60174`, logged-in account |
| **Build / Version** | Production site — tested on 2026-08-11 |
| **Preconditions** | User logged in; store selected; Cart empty |
| **Steps to reproduce** | 1. Log in to aldi.us and select a store. 2. Add Product A (e.g. Berryhill Grape Jelly) to the Cart. 3. Confirm list/badge shows 1 item. 4. Add Product B (different SKU). 5. Add Product C. 6. Open the Cart. |
| **Expected result** | Cart contains Products A, B, and C (count = 3). |
| **Actual result** | Badge may show 3, but the list UI only displays Product C. Products A and B are missing after refresh. |
| **Frequency** | Always (3/3 attempts) |
| **Workaround** | None reliable; user must re-add lost items. |
| **Attachments** | Screenshot of badge vs list; screen recording of add sequence; browser console errors if present |
| **Related test case** | `TC-SL-003` |
| **Reporter / Date** | QA — 2026-08-11 |

---
