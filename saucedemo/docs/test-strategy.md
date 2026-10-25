# SauceGuard QA Test Strategy

## 1. Executive Summary & Goals
The **SauceGuard QA Framework** is an automated testing solution built to validate the core user journeys, data integrity, and system resilience of SauceDemo and associated backend APIs. The primary objective is to catch regressions early, enable confident deployments, and provide fast, actionable feedback to engineering teams through CI/CD automation and rich reporting.

---

## 2. Test Scope

### In Scope
- **Core User Journeys (E2E / UI):** Complete e-commerce flows including single sign-on/authentication, catalog inspection, multi-attribute sorting, cart state persistence, and multi-step checkout.
- **Data-Driven & Persona Matrix:** Testing across multiple persona archetypes (`standard_user`, `locked_out_user`, `problem_user`, `performance_glitch_user`, `error_user`, `visual_user`).
- **RESTful API Integration:** CRUD validation on bookings, status codes, payload contracts, authentication token lifecycle, and unauthorized rejection handling using [Restful Booker](https://restful-booker.herokuapp.com).
- **Performance Budgets:** Ensuring high-latency or slow-loading conditions (such as simulated glitch scenarios) stay within defined response time thresholds (< 10s budget).
- **Cross-Browser Verification:** Parallel execution on Chromium (Google Chrome) and Firefox engines.

### Out of Scope
- Direct stress/DDoS testing of third-party public hosting providers.
- Payment gateway card authorization against real financial institutions (simulated via mock values).
- Legacy, deprecated desktop browsers (e.g. Internet Explorer).

---

## 3. Test Types & Pyramid Distribution

| Test Type | Scope / Target | Framework / Tooling | Execution Frequency |
| :--- | :--- | :--- | :--- |
| **Smoke (`@smoke`)** | Critical path (Login, Catalog Display, Add to Cart, Happy-path Checkout, Core API) | Playwright, TypeScript | Every PR & commit; under 2 minutes |
| **Regression (`@regression`)** | Negative logins, edge validation, multi-user image assertions, sorting accuracy, cart removal | Playwright, Allure | Nightly & Pre-release merges |
| **API (`@api`)** | Endpoint status, token headers, schema validation, HTTP methods (GET, POST, DELETE) | Playwright `request` | Every build (fast, headless) |
| **Performance** | Page transition budgets, SLA monitoring for glitch user | Playwright timing hooks | Regression suite |

---

## 4. Tagging Strategy: Smoke vs. Regression

We maintain a strict separation between rapid smoke feedback and exhaustive regression sweeps using Playwright tags:

- **`@smoke`**: Focused exclusively on critical revenue paths (blocking issues). If a `@smoke` test fails, the build is rejected immediately.
  - *Examples:* Standard login succeeds, inventory loads 6 items, item can be added to cart and checked out.
- **`@regression`**: Exhaustive checks covering boundary values, negative error messages, data sorting math, and user-specific quirks.
  - *Examples:* Form error states when fields are missing, sorting prices ascending/descending, empty cart validation.
- **`@api`**: Independent headless API checks that validate backend services without browser overhead.

---

## 5. Handling Known Bugs & Defects

In legacy or live production systems, known platform bugs exist that cannot be immediately fixed by the test engineering team. SauceGuard handles this deliberately:

1. **`test.fail()` Declarations:**
   Rather than commenting out or skipping a test, known defects (e.g., `BUG-001: problem_user sees the same image on every product`) are wrapped in `test.fail(condition, reason)`.
   - If the bug is present, Playwright marks the test as **expected failure** (CI stays green).
   - If the bug is ever fixed or disappears unexpectedly, the test will fail, alerting QA to update or remove the expected defect flag.
2. **Standardized Bug Catalog (`known_bugs/`):**
   Every defect has a corresponding markdown report detailing severity, environment, step-by-step reproduction, and code pointers.

---

## 6. Architecture & Design Principles

- **Page Object Model (POM):** UI selectors and user actions are encapsulated inside strongly typed classes in `pages/` (e.g. `LoginPage`, `InventoryPage`, `CartPage`, `CheckoutPage`).
- **Resilient Locators:** Use `page.getByTestId(...)` mapping to `data-test` attributes to prevent test brittleness from CSS/DOM restyling.
- **Authentication State Sharing (`.auth/`):** Storage state is generated once in `auth.setup.ts` and reused across parallel worker threads to avoid redundant login overhead on every spec.
- **Zero-Wait Flakiness:** Playwright auto-waiting assertions (`toBeVisible()`, `toHaveText()`, `toHaveURL()`) replace hardcoded sleep timers.

---

## 7. Future Roadmap & Enhancements

1. **Visual Regression Testing:** Implement Playwright snapshot testing (`toHaveScreenshot()`) or Percy integration to catch CSS and layout shifts automatically.
2. **CI Test Sharding:** Split test suites across multiple parallel GitHub Actions runner instances (`--shard=1/3`, `--shard=2/3`, `--shard=3/3`) as the test count scales.
3. **Accessibility Audits:** Integrate `@axe-core/playwright` to automatically scan pages for WCAG 2.1 AA accessibility violations during smoke runs.
4. **Mocked Network Fixtures:** Utilize `page.route()` to test offline modes, slow networks (3G throttling), and mock 500 error server responses.
