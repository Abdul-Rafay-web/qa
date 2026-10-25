# SauceGuard QA Framework

[![Playwright Tests](https://github.com/Rafay-QA/saucedemo/actions/workflows/playwright.yml/badge.svg)](https://github.com/Rafay-QA/saucedemo/actions/workflows/playwright.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Playwright](https://img.shields.io/badge/Playwright-v1.64.1-2EAD33?logo=playwright)](https://playwright.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)](https://www.docker.com/)
[![Allure Report](https://img.shields.io/badge/Report-Allure-F05032?logo=allure)](https://allurereport.org/)

SauceGuard is an enterprise-grade automated testing framework designed to validate critical user journeys, transaction flows, and backend APIs for the SauceDemo e-commerce platform. Built with **Playwright** and **TypeScript**, it provides deterministic, fast, and cross-browser test coverage (UI, API, negative scenarios, performance budgets, and data-driven matrices) to catch regressions before they reach production.

---

## 📊 Live Test Report
- **Allure Interactive Dashboard:** [View Live Allure Report](https://Rafay-QA.github.io/saucedemo/) *(Deploys automatically via GitHub Pages on every push to `main`)*
- **Built-in HTML Report:** Can also be viewed locally with `npm run report:playwright` or directly from GitHub Actions build artifacts.

---

## 🎯 What is Covered

- **UI & Core E-Commerce Workflows:** Catalog exploration, product badge synchronization, cart additions/removals, multi-attribute price sorting, and end-to-end checkout with financial calculations.
- **RESTful API Automation:** Automated CRUD operations, authentication token extraction, authorization boundary enforcement (403 forbidden vs 201 created), and payload verification using the [Restful Booker](https://restful-booker.herokuapp.com) API.
- **Data-Driven & Persona Matrix:** Systematic testing across user personas (`standard_user`, `locked_out_user`, `problem_user`, `performance_glitch_user`, `error_user`, and `visual_user`).
- **Performance Budgets:** Execution timing guards that verify login and page transitions complete within defined SLAs (< 10 seconds under glitch conditions).
- **Cross-Browser Verification:** Parallel execution on both **Chromium (Google Chrome)** and **Firefox** desktop profiles.

---

## 🛠️ Tech Stack & Tooling

| Technology | Purpose |
| :--- | :--- |
| **Playwright (`^1.64.1`)** | Modern headless/headed browser and API test runner with native auto-waiting |
| **TypeScript** | Strict type-safety, autocompletion, and refactor-friendly code structure |
| **Allure Report** | Visual rich reporting dashboard with history, steps, retries, and trends |
| **GitHub Actions** | Automated CI/CD pipeline running cross-browser suites and deploying reports |
| **Docker** | Reproducible containerized execution matching CI environments |

---

## 🚀 How to Run

### 1. Prerequisites
- **Node.js** v18+ or v20+
- **npm** v9+
- *(Optional for Allure viewing locally)* Java JRE/JDK 8+

### 2. Local Setup
```bash
# Clone the repository
git clone https://github.com/Rafay-QA/saucedemo.git
cd saucedemo

# Install dependencies
npm ci

# Install browser binaries
npx playwright install --with-deps chromium firefox
```

### 3. Execution Commands
```bash
# Run all tests (UI + API across Chromium and Firefox)
npm test

# Run only critical path smoke tests (fast validation)
npm run test:smoke

# Run regression test suite
npm run test:regression

# Run API tests only (headless, ultrafast)
npm run test:api

# Run tests in headed browser mode
npm run test:headed
```

### 4. Viewing Reports
```bash
# Built-in Playwright HTML report
npm run report:playwright

# Generate and launch local Allure interactive report
npm run report:allure
```

### 5. Running with Docker
Run the entire suite inside an isolated Linux container identical to GitHub Actions:
```bash
# Build the container image
docker build -t sauceguard-qa .

# Run the test container
docker run --rm sauceguard-qa
```

---

## 💡 Key Design Decisions

1. **Page Object Model (POM):**
   UI locators and domain interactions are strictly encapsulated in separate classes ([`LoginPage`](pages/LoginPage.ts), [`InventoryPage`](pages/InventoryPage.ts), [`CartPage`](pages/CartPage.ts), [`CheckoutPage`](pages/CheckoutPage.ts)). Tests read like human user stories without hardcoded selectors.
2. **Global Auth State Sharing (`.auth/`):**
   Standard user credentials are authenticated once during the `setup` project ([`auth.setup.ts`](tests/setup/auth.setup.ts)) and saved as `storageState`. All dependent inventory and checkout tests run pre-authenticated, drastically reducing test execution time and network strain.
3. **Resilient Locators (`data-test`):**
   Configured `testIdAttribute: 'data-test'` in `playwright.config.ts`. All elements are targeted via `page.getByTestId(...)`, making tests immune to styling, class, or CSS refactors.
4. **Deliberate Known Defect Handling (`test.fail`):**
   Real applications have known open bugs. Instead of skipping or commenting out tests, we use `test.fail(condition, reason)`. The test verifies the defect still exists; if a developer fixes it, Playwright flags it to update the suite.

---

## 🐞 Known Bugs Found & Documented

| Bug ID | Summary | Severity | Status | Spec Reference |
| :--- | :--- | :--- | :--- | :--- |
| [**BUG-001**](known_bugs/BUG-001.md) | `problem_user` sees the same dog image on every catalog product | Medium | Documented (`test.fail`) | [`tests/ui/all-users.spec.ts`](tests/ui/all-users.spec.ts) |

Detailed reproduction steps and assertion logic are documented in the [`known_bugs/`](known_bugs/) folder.

---

## 📄 Documentation
- Detailed Strategy & Test Pyramid: [docs/test-strategy.md](docs/test-strategy.md)
