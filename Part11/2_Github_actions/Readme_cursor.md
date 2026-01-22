# Getting Started with GitHub Actions - Summary

This section covers setting up GitHub Actions workflows, understanding workflow structure, and implementing CI/CD pipelines with linting, testing, building, and end-to-end testing.

## Overview

GitHub Actions operate on **workflows** - a series of jobs that run when specific events trigger them. Each job contains steps that tell GitHub Actions what to do.

**Workflow Execution:**
1. Triggering event happens (e.g., push to main branch)
2. Workflow with that trigger is executed
3. Cleanup

## Basic Needs for CI

To have CI operate on a repository, we need:

1. **A repository** (obviously)
2. **Definition of what CI needs to do:**
   - Can be a file in repository (`.github/workflows/`)
   - Or defined in CI system
3. **CI awareness:**
   - CI must know repository exists
   - CI must know about configuration file
4. **CI access:**
   - CI must be able to access repository
5. **CI permissions:**
   - CI needs credentials for actions (e.g., deployment)

**GitHub Actions Advantage:**
- Repository and CI platform are both on GitHub
- If actions are enabled, GitHub already knows about workflows
- No separate configuration needed

## Workflow Structure

### Hierarchy

```
Workflow
├── Job
│   ├── Step
│   └── Step
└── Job
    └── Step
```

**Key Points:**
- Each workflow must have at least one Job
- Jobs run in **parallel**
- Steps in each job run **sequentially**
- Steps can run custom commands or use pre-defined actions

### Workflow Location

**File Location:**
- Workflows must be in `.github/workflows/` folder
- Each workflow is a separate YAML file
- GitHub automatically recognizes these files

### YAML Format

**YAML (YAML Ain't Markup Language):**
- Human-readable
- Commonly used for configuration files
- **Important:** Indentations are critical!

**Learn More:**
- YAML syntax documentation

## Basic Workflow Elements

A basic workflow contains three elements:

1. **name:** The name of the workflow
2. **on (triggers):** Events that trigger the workflow
3. **jobs:** Separate jobs that the workflow will execute

### Simple Workflow Example

**File: `.github/workflows/hello.yml`**
```yaml
name: Hello World!

on:
  push:
    branches:
      - main

jobs:
  hello_world_job:
    runs-on: ubuntu-latest
    steps:
      - name: Say hello
        run: |
          echo "Hello World!"
```

**Explanation:**
- **name:** "Hello World!" - workflow name
- **on:** Triggers on push to main branch
- **jobs:** One job named `hello_world_job`
- **runs-on:** Ubuntu 20.04 virtual environment
- **steps:** One step that echoes "Hello World!"

## Workflow Triggers

Workflows can be triggered by:

1. **GitHub Events:**
   - Push to repository
   - Pull request created
   - Issue created
   - Many other events

2. **Scheduled Events:**
   - Using cron syntax
   - Example: Run daily at midnight

3. **External Events:**
   - Command in external app (Slack, Discord)
   - Webhook triggers

**Documentation:**
- GitHub Actions events documentation

## Setting Up the Environment

### Example Project Setup

**Project:**
- Fork `full-stack-open-pokedex` repository
- Contains both frontend and backend in same repository
- Uses Node 16 (older project)
- Uses Webpack (not Vite)
- Uses Jest (not Vitest)

**Initial Steps:**
1. Fork repository
2. Clone to local machine
3. Install dependencies: `npm install`
4. Start development: `npm run dev`
5. Run tests: `npm test`
6. Lint code: `npm run eslint`
7. Build production: `npm run build`
8. Run production: `npm run start-prod`

**Note:**
- Project has broken tests and linting errors initially
- Leave them for now, fix in exercises

### Environment Setup Steps

**File: `.github/workflows/pipeline.yml`**
```yaml
name: Deployment pipeline

on:
  push:
    branches:
      - main

jobs:
  simple_deployment_pipeline:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm install
```

### Step-by-Step Explanation

**1. Checkout Code:**
```yaml
- uses: actions/checkout@v4
```

**Purpose:**
- Checkout project source code from Git
- By default, virtual environment has no code
- Must checkout before doing anything

**Key Points:**
- `uses` keyword tells workflow to run an action
- Actions are reusable pieces of code (like functions)
- Can be public actions or custom actions
- `@v4` specifies version to avoid breaking changes

**2. Setup Node.js:**
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
```

**Purpose:**
- Set up Node.js environment
- Required for JavaScript/TypeScript projects
- Version `20` matches production environment

**Key Points:**
- `with` keyword provides parameters to action
- `node-version` specifies Node.js version
- Important to match production version

**3. Install Dependencies:**
```yaml
- name: Install dependencies
  run: npm install
```

**Purpose:**
- Install project dependencies
- Same as running locally

**Key Points:**
- `run` keyword executes shell command
- `name` is optional (command used as default name)
- Can run any npm script after this

## Linting

### Adding Lint Step

**File: `.github/workflows/pipeline.yml`**
```yaml
name: Deployment pipeline

on:
  push:
    branches:
      - main

jobs:
  simple_deployment_pipeline:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm install
      - name: Check style
        run: npm run eslint
```

**Purpose:**
- Run linting to check code style
- If checks fail, workflow shows red status
- Prevents bad code from being merged

**Note:**
- Can also write without name:
  ```yaml
  - run: npm run eslint
  ```

## Building and Testing

### Adding Build and Test Steps

**File: `.github/workflows/pipeline.yml`**
```yaml
name: Deployment pipeline

on:
  push:
    branches:
      - main

jobs:
  simple_deployment_pipeline:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm install
      - name: Check style
        run: npm run eslint
      - name: Build
        run: npm run build
      - name: Test
        run: npm test
```

**Purpose:**
- **Build:** Create production bundle
- **Test:** Run unit tests
- Both must pass for workflow to succeed

## End-to-End Testing

### Why E2E Tests?

**Component Tests:**
- Test React components in isolation
- Useful but doesn't ensure system works as whole

**E2E Tests:**
- Test system from end user's perspective
- More confidence in overall functionality
- Slower feedback time

### Jest Configuration

**File: `package.json`**
```json
{
  "jest": {
    "testEnvironment": "jsdom",
    "testPathIgnorePatterns": ["e2e-tests"]
  }
}
```

**Purpose:**
- Prevent Jest from running e2e tests
- E2E tests use different framework (Playwright/Cypress)
- Jest only runs unit tests

### Playwright Setup

**Installation:**
```bash
npm install --save-dev @playwright/test
npx playwright install
```

**Note:**
- Install Playwright in same project (not separate)
- Different from part 5 setup

**Test File: `e2e-tests/pokedex.spec.js`**
```javascript
const { test, describe, expect, beforeEach } = require('@playwright/test');

describe('Pokedex', () => {
  test('front page can be opened', async ({ page }) => {
    await page.goto('');
    await expect(page.getByText('ivysaur')).toBeVisible();
    await expect(page.getByText('Pokémon and Pokémon character names are trademarks of Nintendo.')).toBeVisible();
  });
});
```

**Important Notes:**
- Pokemon names are lowercase in source (capitalization is CSS)
- Test for `ivysaur` not `Ivysaur`
- Test for `chlorophyll` not `Chlorophyll`

**NPM Script: `package.json`**
```json
{
  "scripts": {
    "test:e2e": "playwright test"
  }
}
```

**Playwright Config: `playwright.config.js`**
```javascript
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './e2e-tests',
  use: {
    baseURL: 'http://localhost:5000',
  },
  webServer: {
    command: 'npm run start-prod',
    url: 'http://localhost:5000',
    reuseExistingServer: !process.env.CI,
  },
});
```

**Purpose:**
- Configure Playwright development server
- Automatically start app before tests
- No need to start app manually

**GitHub Actions Integration:**
```yaml
- name: Build
  run: npm run build
- name: E2E tests
  run: npm run test:e2e
```

**Documentation:**
- Playwright GitHub Actions setup

### Cypress Setup

**Installation:**
```bash
npm install --save-dev cypress
```

**Test File: `cypress/e2e/pokedex.cy.js`**
```javascript
describe('Pokedex', function() {
  it('front page can be opened', function() {
    cy.visit('http://localhost:5000');
    cy.contains('ivysaur');
    cy.contains('Pokémon and Pokémon character names are trademarks of Nintendo.');
  });
});
```

**NPM Script: `package.json`**
```json
{
  "scripts": {
    "test:e2e": "cypress run"
  }
}
```

**GitHub Actions Integration:**
```yaml
- name: Build
  run: npm run build
- name: E2E tests
  uses: cypress-io/github-action@v5
  with:
    command: npm run test:e2e
    start: npm run start-prod
    wait-on: http://localhost:5000
```

**Options:**
- **command:** How to run Cypress tests
- **start:** NPM script that starts server
- **wait-on:** URL to wait for before running tests

**Important:**
- Must build app before starting in production mode
- Server must be running before tests execute

## Complete Workflow Example

**File: `.github/workflows/pipeline.yml`**
```yaml
name: Deployment pipeline

on:
  push:
    branches:
      - main

jobs:
  simple_deployment_pipeline:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install dependencies
        run: npm install
      - name: Check style
        run: npm run eslint
      - name: Build
        run: npm run build
      - name: Test
        run: npm test
      - name: E2E tests
        run: npm run test:e2e
```

## Viewing Workflow Results

### Actions Tab

**Location:**
- Navigate to **Actions** tab in GitHub
- See all workflows in repository
- View workflow runs and steps

**Information Shown:**
- Workflow execution status (green/red)
- Steps that were executed
- Output of each step
- Environment information (OS, setup)
- Execution time

**Benefits:**
- Easy debugging if something fails
- Can reproduce steps locally
- See exact environment where workflow ran

## Best Practices

### 1. Use Specific Action Versions

```yaml
# ✅ Good: Specific version
- uses: actions/checkout@v4

# ❌ Bad: Latest (may break)
- uses: actions/checkout@latest
```

### 2. Match Production Environment

```yaml
# ✅ Good: Match production
runs-on: ubuntu-latest
node-version: '20'

# ❌ Bad: Different environment
runs-on: windows-latest
node-version: '18'
```

### 3. Name Steps Clearly

```yaml
# ✅ Good: Clear name
- name: Install dependencies
  run: npm install

# ❌ Bad: Unclear
- run: npm install
```

### 4. Run Steps in Logical Order

```yaml
# ✅ Good: Logical order
1. Checkout code
2. Setup Node.js
3. Install dependencies
4. Lint
5. Build
6. Test
7. E2E tests

# ❌ Bad: Wrong order
1. Test (before installing dependencies!)
2. Install dependencies
```

### 5. Handle E2E Tests Properly

```yaml
# ✅ Good: Build before E2E
- name: Build
  run: npm run build
- name: E2E tests
  run: npm run test:e2e

# ❌ Bad: E2E without build
- name: E2E tests
  run: npm run test:e2e
```

## Common Issues and Solutions

### Issue: Workflow Not Triggering

**Solution:**
- Check file is in `.github/workflows/`
- Check YAML syntax (indentation!)
- Check trigger conditions
- Check branch name matches

### Issue: "No code in environment"

**Solution:**
- Add `actions/checkout@v4` step
- Must be first step (or early)

### Issue: "Command not found: npm"

**Solution:**
- Add `actions/setup-node@v4` step
- Specify correct Node.js version

### Issue: E2E Tests Fail

**Solution:**
- Ensure app is built before tests
- Ensure server starts before tests
- Check Playwright/Cypress config
- Verify test URLs are correct

### Issue: Linting Errors

**Solution:**
- Fix code issues
- Add proper env configuration
- Silence specific rules if needed
- Use `// eslint-disable-next-line` for console.log

## Exercises

The exercises (11.2-11.9) involve:
- Forking example project
- Creating Hello World workflow
- Extending workflow with date and directory
- Setting up linting workflow
- Fixing code issues
- Adding build and test steps
- Fixing failing tests
- Implementing end-to-end tests
