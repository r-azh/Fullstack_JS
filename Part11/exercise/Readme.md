# Part 11 Exercises

This file contains exercises for Part 11: CI/CD as they are covered in the course material.

# [Exercise 11.1: Warming up](https://fullstackopen.com/en/part11/introduction_to_ci_cd#exercise-11-1)

Before getting our hands dirty with setting up the CI/CD pipeline, let us reflect a bit on what we have read.

## Task

Think about a hypothetical situation where we have an application being worked on by a team of about 6 people. The application is in active development and will be released soon.

Let us assume that the application is coded with some other language than JavaScript/TypeScript, e.g. in Python, Java, or Ruby. You can freely pick the language. This might even be a language you do not know much yourself.

Write a short text, say 200-300 words, where you answer or discuss some of the points below. You can check the length with https://wordcounter.net/. Save your answer to the file named `exercise1.md` in the root of the repository that you shall create in exercise 11.2.

## Points to Discuss

### 1. CI Tools for Your Chosen Language

Some common steps in a CI setup include _linting_, _testing_, and _building_. What are the specific tools for taking care of these steps in the ecosystem of the language you picked?

**Research:**
- Search for linting tools (e.g., pylint for Python, ESLint for JavaScript)
- Search for testing frameworks (e.g., pytest for Python, JUnit for Java)
- Search for build tools (e.g., Maven for Java, pip for Python)
- Document specific tools and their purposes

**Example for Python:**
- Linting: pylint, flake8, black
- Testing: pytest, unittest, nose
- Building: setuptools, poetry, pip

### 2. CI Platform Alternatives

What alternatives are there to set up the CI besides Jenkins and GitHub Actions?

**Research:**
- Cloud-based platforms (CircleCI, Travis CI, GitLab CI, Azure DevOps, etc.)
- Self-hosted options (GitLab Runner, TeamCity, Bamboo, etc.)
- Compare features and use cases
- Document at least 3-4 alternatives

**Examples:**
- CircleCI: Cloud-based, similar to GitHub Actions
- GitLab CI: Integrated with GitLab, can be self-hosted
- Travis CI: Cloud-based, popular for open source
- Azure DevOps: Microsoft's CI/CD platform

### 3. Self-Hosted vs Cloud-Based

Would this setup be better in a self-hosted or a cloud-based environment? Why? What information would you need to make that decision?

**Consider:**
- Team size (6 people)
- Project stage (active development, releasing soon)
- Budget constraints
- Security requirements
- Resource needs
- Maintenance capabilities

**Factors to Consider:**
- Cost: Cloud-based billed by usage, self-hosted by hardware
- Control: Self-hosted gives full control
- Maintenance: Cloud-based requires no maintenance
- Resources: Self-hosted can scale hardware
- Security: Self-hosted keeps secrets internal
- Setup time: Cloud-based is faster to set up

**Information Needed:**
- Budget for CI/CD
- Expected build frequency
- Build complexity and duration
- Security requirements
- Team's DevOps expertise
- Special hardware requirements

## Writing Guidelines

**Length:**
- 200-300 words
- Check with https://wordcounter.net/
- Be concise but thorough

**Structure:**
- Introduction: Language choice and team context
- CI Tools: List and explain tools for linting, testing, building
- CI Alternatives: Discuss 3-4 alternatives to Jenkins/GitHub Actions
- Self-Hosted vs Cloud: Make recommendation with reasoning
- Conclusion: Summarize key points

**Style:**
- Clear and professional
- Well-organized
- Support arguments with reasoning
- No "right" answers - focus on thoughtful analysis

## Submission

**File Location:**
- Save as `exercise1.md` in the root of the repository
- Repository will be created in exercise 11.2

**Content:**
- Answer all three questions
- Provide reasoning for choices
- Research and cite tools/platforms
- Make informed recommendation

**Remember:**
- There are no 'right' answers
- Focus on thoughtful analysis
- Research is encouraged
- Be prepared to discuss your choices

# [Exercises 11.2-11.9: Getting Started with GitHub Actions](https://fullstackopen.com/en/part11/getting_started_with_git_hub_actions#exercise-11-2)

## 11.2: The example project

Fork the example repository and set up the project locally.

**Details:**
- Fork repository:
  - Go to `full-stack-open-pokedex` repository
  - Click **Fork** button (top-right, next to Star)
  - Wait for fork to complete
  - Repository will be `{github_username}/full-stack-open-pokedex`
- Clone project:
  - Clone forked repository to local machine
  - Use `git clone` command
- Study project:
  - Look at `package.json` first
  - Note: Project uses Node 16 (older project)
  - Frontend and backend in same repository
  - Uses Webpack (not Vite)
  - Uses Jest (not Vitest)
- Run commands:
  - Install dependencies: `npm install`
  - Start development: `npm run dev`
  - Run tests: `npm test`
  - Lint code: `npm run eslint`
  - Build production: `npm run build`
  - Run production: `npm run start-prod`
- Note:
  - Project has broken tests and linting errors
  - **Leave them for now** - fix in later exercises

## 11.3: Hello world!

Create a new workflow that outputs "Hello World!" to the user.

**Details:**
- Create directory:
  - Create `.github/workflows/` directory in repository
- Create workflow file:
  - Create `hello.yml` in `.github/workflows/`
- Workflow content:
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
- Commit and push:
  - Commit workflow file
  - Push to main branch
- Verify:
  - Navigate to **Actions** tab in GitHub
  - Click on "Hello World!" workflow
  - Verify workflow runs and shows "Hello World!" output
  - Check environment information shown

## 11.4: Date and directory contents

Extend the workflow with steps that print the date and current directory content in long format.

**Details:**
- Edit `hello.yml`:
  - Add step to print date: `date`
  - Add step to print directory: `ls -l`
- Updated workflow:
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
        - name: Print date
          run: date
        - name: List directory contents
          run: ls -l
  ```
- Commit and push:
  - Commit changes
  - Push to trigger workflow
- Verify:
  - Check Actions tab
  - Verify date is printed
  - Verify `ls -l` output shows empty directory (no code yet!)

## 11.5: Linting workflow

Implement the "Lint" workflow and commit it to the repository.

**Details:**
- Create workflow file:
  - Create `pipeline.yml` in `.github/workflows/`
- Workflow content:
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
- Commit and push:
  - Commit `pipeline.yml`
  - Push to trigger workflow
- Verify:
  - Check Actions tab
  - Workflow should **fail** (red status)
  - There are linting errors in code

## 11.6: Fix the code

Fix the code issues so that the lint workflow passes.

**Details:**
- Investigate errors:
  - Open workflow logs in Actions tab
  - See what linting errors exist
- Fix issues:
  - **Environment issue:** Specify proper `env` for linting
    - See ESLint documentation for environment configuration
  - **console.log issue:** Silence rule for specific line
    - Use `// eslint-disable-next-line` comment
    - Or configure ESLint to allow console.log
- Make changes:
  - Fix all linting errors in source code
  - Do not change tests yet
- Commit and push:
  - Commit fixes
  - Push to trigger workflow again
- Verify:
  - Check Actions tab
  - Workflow should now **pass** (green status)
  - All linting checks should pass

## 11.7: Building and testing

Expand the workflow to add build and test commands.

**Details:**
- Edit `pipeline.yml`:
  - Add build step after linting
  - Add test step after building
- Updated workflow:
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
- Commit and push:
  - Commit changes
  - Push to trigger workflow
- Verify:
  - Check Actions tab
  - Build should succeed
  - Tests should **fail** (there are broken tests)

## 11.8: Back to green

Investigate which test fails and fix the issue in the code.

**Details:**
- Investigate failure:
  - Open workflow logs
  - Find which test is failing
  - Read error message
- Fix issue:
  - Fix the bug in source code
  - **Do not change the tests**
  - Fix the actual bug causing test failure
- Commit and push:
  - Commit fix
  - Push to trigger workflow
- Verify:
  - Check Actions tab
  - All tests should now pass
  - Workflow should be **green**

## 11.9: Simple end-to-end tests

Write end-to-end tests using Playwright or Cypress.

**Details:**
- Choose framework:
  - **Playwright** (recommended) or **Cypress**
  - Both work well, choose one

### Option A: Playwright

**Setup:**
- Install Playwright:
  ```bash
  npm install --save-dev @playwright/test
  npx playwright install
  ```
- **Note:** Install in same project (not separate like part 5)

**Jest Configuration:**
- Update `package.json`:
  ```json
  {
    "jest": {
      "testEnvironment": "jsdom",
      "testPathIgnorePatterns": ["e2e-tests"]
    }
  }
  ```

**Test File: `e2e-tests/pokedex.spec.js`**
```javascript
const { test, describe, expect } = require('@playwright/test');

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

**NPM Script:**
- Add to `package.json`:
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

**Test Locally:**
- Run: `npm run test:e2e`
- Verify test passes
- App should start automatically

**GitHub Actions Integration:**
- Update `pipeline.yml`:
  ```yaml
  - name: Build
    run: npm run build
  - name: E2E tests
    run: npm run test:e2e
  ```

**Documentation:**
- Playwright GitHub Actions setup

### Option B: Cypress

**Setup:**
- Install Cypress:
  ```bash
  npm install --save-dev cypress
  ```

**Jest Configuration:**
- Update `package.json` (same as Playwright)

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

**NPM Script:**
- Add to `package.json`:
  ```json
  {
    "scripts": {
      "test:e2e": "cypress run"
    }
  }
  ```

**Test Locally:**
- Start app: `npm run start-prod`
- Run tests: `npm run test:e2e`
- Verify test passes

**GitHub Actions Integration:**
- Update `pipeline.yml`:
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

**Options Explained:**
- **command:** How to run Cypress tests
- **start:** NPM script that starts server
- **wait-on:** URL to wait for before running tests

**Important:**
- Must build app before starting in production mode
- Server must be running before tests execute

### Additional Test

**Task:**
- Write another test that navigates from main page to a Pokemon page
- Test for specific Pokemon (e.g., ivysaur)
- Check that page has proper content (e.g., "chlorophyll" for ivysaur)

**Playwright Example:**
```javascript
test('can navigate to pokemon page', async ({ page }) => {
  await page.goto('');
  await page.click('text=ivysaur');
  await expect(page.getByText('chlorophyll')).toBeVisible();
});
```

**Cypress Example:**
```javascript
it('can navigate to pokemon page', function() {
  cy.visit('http://localhost:5000');
  cy.contains('ivysaur').click();
  cy.contains('chlorophyll');
});
```

**Important:**
- Pokemon abilities are lowercase in source
- Test for `chlorophyll` not `Chlorophyll`

**Verify:**
- Test passes locally
- Test passes in GitHub Actions
- Workflow shows green status
- E2E tests take longer but provide confidence

**Note:**
- End-to-end tests are slower
- Whole workflow takes longer now
- But gives confidence software works from user perspective

# [Exercises 11.10-11.12: Deployment](https://fullstackopen.com/en/part11/deployment#exercises-11-10-11-12-fly-io)

## Fly.io Deployment

### 11.10: Deploying your application to Fly.io

Set up your application in Fly.io hosting service and ensure manual deployment works.

**Details:**
- Create Fly.io app:
  - Go to Fly.io dashboard
  - Create new application
  - Note the app name
- Generate API token:
  ```bash
  fly tokens create deploy
  ```
  - Save token securely
  - **Do NOT commit to GitHub**
  - Will use in GitHub Actions later
- Configure fly.toml:
  - Update `fly.toml` with:
    ```toml
    [env]
      PORT = "3000"
    
    [processes]
      app = "node app.js"
    
    [http_service]
      internal_port = 3000
      force_https = true
      auto_stop_machines = true
      auto_start_machines = true
      min_machines_running = 0
      processes = ["app"]
    ```
  - `[processes]` defines command to start app
  - Without this, Fly.io starts React dev server (wrong!)
  - `PORT` environment variable passed to app
- Update .dockerignore:
  - Remove line: `dist`
  - If `dist` is ignored, production build doesn't get uploaded
  - Must include build files
- Add version endpoint:
  - Add to `backend/app.js`:
    ```javascript
    app.get('/version', (req, res) => {
      res.send('1'); // change this to verify deployment
    });
    ```
- Manual deployment:
  ```bash
  npm run build  # Create production build first
  flyctl deploy  # Deploy to Fly.io
  ```
- Verify:
  - App should be accessible
  - Check `/version` endpoint works
  - Ensure manual deployment works before automation

### 11.11: Automatic deployments

Extend the workflow to automatically deploy to Fly.io when code is pushed to main branch.

**Details:**
- Set up GitHub Secret:
  - Go to repository Settings
  - Navigate to Secrets and variables → Actions
  - Click "New repository secret"
  - Name: `FLY_API_TOKEN`
  - Value: Token from `fly tokens create deploy`
  - Click "Add secret"
- Update workflow:
  - Edit `.github/workflows/pipeline.yml`
  - Add deployment steps after build and test:
    ```yaml
    - name: Deploy to Fly.io
      uses: superfly/flyctl-actions/setup-flyctl@master
    - name: Deploy
      run: flyctl deploy --remote-only
      env:
        FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
    ```
- Important:
  - Build must happen before deployment
  - Use `--remote-only` flag
  - Access token via `${{ secrets.FLY_API_TOKEN }}`
- Commit and push:
  - Commit workflow changes
  - Push to main branch
  - Workflow should trigger automatically
- Verify:
  - Check Actions tab for workflow run
  - Verify deployment succeeds
  - Check app is updated
  - Monitor logs: `flyctl logs`

### 11.12: Health check

Implement health check to ensure deployments are actually functional.

**Details:**
- Add health endpoint:
  - Add to `backend/app.js`:
    ```javascript
    app.get('/health', (req, res) => {
      res.send('ok');
    });
    ```
- Configure HTTP check in fly.toml:
  - Add to `fly.toml`:
    ```toml
    [[http_service.http_checks]]
      interval = "10s"
      timeout = "2s"
      grace_period = "5s"
      method = "GET"
      path = "/health"
      protocol = "http"
      tls_skip_verify = false
    ```
- Set deployment strategy:
  - Add to `fly.toml`:
    ```toml
    [deploy]
      strategy = "canary"
    ```
  - Canary deploys to one machine first, checks health, then others
- Commit and push:
  - Commit changes
  - Push to trigger deployment
  - Verify health check works
- Test failure:
  - Simulate broken deployment:
    ```javascript
    app.get('/health', (req, res) => {
      // eslint-disable-next-line no-constant-condition
      if (true) throw('error...');
      res.send('ok');
    });
    ```
  - Commit and push
  - Verify deployment fails
  - Check releases: `flyctl releases`
  - Should show failed status
  - Previous version should keep running
- Fix and verify:
  - Remove broken code
  - Push fix
  - Verify deployment succeeds
  - Ensure app works again

## Render Deployment

### 11.10: Deploying your application to Render

Set up your application in Render and ensure manual deployment works.

**Details:**
- Create Render app:
  - Go to Render dashboard
  - Create new web service
  - Configure settings carefully
- Build settings:
  - **Build Command:** Command to build application
    - Example: `npm install && npm run build`
  - **Start Command:** Command to start application
    - Example: `node backend/app.js`
  - **Environment:** Node.js version
- Build script (optional):
  - Create `build_step.sh`:
    ```bash
    #!/bin/bash
    echo "Build script"
    npm install
    npm run build
    ```
  - Make executable:
    ```bash
    chmod +x build_step.sh
    ```
  - Test: `./build_step.sh`
- Alternative: Pre deploy command:
  - Use Pre deploy command in Render settings
  - Run one additional command before deployment
- Disable auto-deploy:
  - Go to Advanced settings
  - Turn auto-deploy **OFF**
  - We'll control deployment from GitHub Actions
- Manual deploy:
  - Use "Manual deploy" button
  - Keep Logs open to debug issues
  - Ensure app works before automation
- Add version endpoint:
  - Add to `backend/app.js`:
    ```javascript
    app.get('/version', (req, res) => {
      res.send('1');
    });
    ```

### 11.11: Automatic deployments

Automate deployment to Render using deploy hook or custom action.

**Details:**
- Choose method:
  - **Option 1:** Custom action (may be unreliable)
  - **Option 2:** Deploy hook (recommended)

**Option 1: Custom Action**

- Search GitHub Actions marketplace:
  - Search for "render deploy"
  - Choose action with most stars
  - Check if actively maintained
  - **Warning:** `render-action` was unreliable (Jan 2024), avoid it
- Get credentials:
  - **API Key:** Generate from Render dashboard
  - **Service ID:** From app URL (starts with `srv-`)
    ```
    https://dashboard.render.com/web/srv-randomcharachtershere
    ```
- Set up secrets:
  - Create `RENDER_API_KEY` secret
  - Create `RENDER_SERVICE_ID` secret
- Update workflow:
  ```yaml
  - name: Deploy to Render
    uses: some-render-action@v1
    with:
      api_key: ${{ secrets.RENDER_API_KEY }}
      service_id: ${{ secrets.RENDER_SERVICE_ID }}
  ```

**Option 2: Deploy Hook (Recommended)**

- Get deploy hook:
  - Go to app settings in Render dashboard
  - Find "Deploy Hook" section
  - Copy the private URL
- Set up secrets:
  - Create `RENDER_API_KEY` secret
  - Create `RENDER_SERVICE_ID` secret (from URL)
- Update workflow:
  ```yaml
  - name: Trigger Render deployment
    run: |
      curl https://api.render.com/deploy/srv-${{ secrets.RENDER_SERVICE_ID }}?key=${{ secrets.RENDER_API_KEY }}
  ```
- Commit and push:
  - Commit workflow changes
  - Push to main branch
  - Workflow should trigger deployment
- Monitor deployment:
  - Check Events tab in Render dashboard
  - See when new deployment is ready
  - View deployment logs

### 11.12: Health check

Implement health check to ensure deployments are actually functional.

**Details:**
- Add health endpoint:
  - Add to `backend/app.js`:
    ```javascript
    app.get('/health', (req, res) => {
      res.send('ok');
    });
    ```
- Configure health check:
  - Go to Render dashboard
  - Navigate to Settings tab
  - Find "Health Check Path" setting
  - Set to `/health`
- Commit and push:
  - Commit health endpoint
  - Push to GitHub
  - Verify deployment succeeds
  - Check health endpoint is accessible
- Test failure:
  - Simulate broken deployment:
    ```javascript
    app.get('/health', (req, res) => {
      // eslint-disable-next-line no-constant-condition
      if (true) throw('error...');
      res.send('ok');
    });
    ```
  - Commit and push
  - Verify broken version does not deploy
  - Previous version should keep running
  - Health check should fail, deployment rejected
- Fix and verify:
  - Remove broken code
  - Push fix to GitHub
  - Verify deployment succeeds
  - Ensure app works again
- Note:
  - Zero downtime deploys should work
  - May not always work on free accounts (Jan 2024)
  - Health check helps ensure functionality

# [Exercises 11.13-11.17: Keeping Green](https://fullstackopen.com/en/part11/keeping_green#exercises-11-13-11-14)

## 11.13: Pull request

Update the workflow trigger to run on pull requests and create a pull request to test it.

**Details:**
- Update workflow trigger:
  - Edit `.github/workflows/pipeline.yml`
  - Add `pull_request` trigger:
    ```yaml
    on:
      push:
        branches:
          - main
      pull_request:
        branches: [main]
        types: [opened, synchronize]
    ```
  - `pull_request` runs on PRs targeting main
  - `types: [opened, synchronize]` - when PR is opened or updated
- Create new branch:
  ```bash
  git checkout -b test-pr
  ```
- Make a change:
  - Make a small change to code
  - Or just add a comment
- Commit and push:
  ```bash
  git add .
  git commit -m "Test pull request"
  git push origin test-pr
  ```
- Create pull request:
  - Go to GitHub repository
  - Click "Compare & pull request" button
  - **Important:** Select YOUR repository as base (not original!)
  - Default might be original repository - change it!
  - Fill in PR description
  - Submit pull request
- Verify workflow runs:
  - Go to PR page
  - Check "Conversation" tab
  - Should see yellow status for checks in progress
  - Wait for checks to complete
  - Should turn green when all pass
- Do not merge yet:
  - Wait for next exercise
  - Need to fix deployment issue first

## 11.14: Run deployment step only for the main branch

Add condition to deployment step so it only runs on main branch, not on pull requests.

**Details:**
- The problem:
  - Currently deployment runs on PRs too
  - Don't want to deploy PR code
  - Only deploy when merged to main
- Add condition to deployment:
  - Edit `.github/workflows/pipeline.yml`
  - Add `if` condition to deployment steps:
    ```yaml
    - name: Deploy to Fly.io
      if: ${{ github.event_name == 'push' }}
      uses: superfly/flyctl-actions/setup-flyctl@master
    - name: Deploy
      if: ${{ github.event_name == 'push' }}
      run: flyctl deploy --remote-only
      env:
        FLY_API_TOKEN: ${{ secrets.FLY_API_TOKEN }}
    ```
- How it works:
  - `github.event_name` tells what triggered workflow
  - `push` = direct push or PR merge to main
  - `pull_request` = PR opened/updated
  - Only deploy on `push` events
- Test:
  - Push more code to your branch
  - Update PR (workflow runs again)
  - Check Actions tab
  - Deployment step should be **skipped** (gray)
  - Other steps should run
- Merge and verify:
  - Merge PR to main branch
  - Workflow runs again
  - Deployment step should **run** (green)
  - App should be deployed

## 11.15: Adding versioning

Extend workflow to automatically bump version and tag release when PR is merged to main.

**Details:**
- Update workflow structure:
  - Split into two jobs
  - First job: lint, test, build, deploy
  - Second job: version bumping
  - Second job depends on first
- New workflow structure:
  ```yaml
  name: Deployment pipeline
  
  on:
    push:
      branches:
        - main
    pull_request:
      branches: [main]
      types: [opened, synchronize]
  
  jobs:
    simple_deployment_pipeline:
      runs-on: ubuntu-latest
      steps:
        # existing steps (lint, test, build, deploy)
        
    tag_release:
      needs: [simple_deployment_pipeline]
      runs-on: ubuntu-latest
      steps:
        - name: Bump version and push tag
          uses: anothrNick/github-tag-action@1.64.0
          env:
            GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
            DEFAULT_BUMP: patch
          if: ${{ github.event_name == 'push' }}
  ```
- Configure GITHUB_TOKEN:
  - Go to repository Settings
  - Select Actions → General
  - Under "Workflow permissions"
  - Select "Read and write permissions"
  - Save changes
- Action details:
  - `anothrNick/github-tag-action` - third-party action
  - Check action page for most recent version
  - `DEFAULT_BUMP: patch` - increment patch version
  - `GITHUB_TOKEN` - automatically provided
  - Needs write access to create tags
- Job dependency:
  - `needs: [simple_deployment_pipeline]` - wait for first job
  - Only tag if tests pass and deploy succeeds
  - Jobs run in parallel by default
  - Dependency ensures order
- Condition:
  - Only tag on push (not PR)
  - Same condition as deployment
- Test with dry run:
  - Add `DRY_RUN: true` to env
  - See what version would be created
  - Remove before final version
- Commit and push:
  - Commit workflow changes
  - Push to main (or merge PR)
  - Workflow should run
  - Version should be bumped
  - Tag should be created
- Verify tags:
  - Go to repository main page
  - Should see "tags" indicator
  - Click "view all tags"
  - See list of version tags
  - Click individual tag to see commit

## 11.16: Skipping a commit for tagging and deployment

Modify setup so commits with `#skip` in message are not deployed or tagged.

**Details:**
- The need:
  - Sometimes want to skip deployment
  - Documentation-only changes
  - Configuration changes
  - Don't need new version
- Understand GitHub context:
  - Create test workflow to see context:
    ```yaml
    name: Testing stuff
    
    on:
      push:
        branches:
          - main
    
    jobs:
      a_test_job:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v4
          - name: github context
            env:
              GITHUB_CONTEXT: ${{ toJson(github) }}
            run: echo "$GITHUB_CONTEXT"
          - name: commits
            env:
              COMMITS: ${{ toJson(github.event.commits) }}
            run: echo "$COMMITS"
          - name: commit messages
            env:
              COMMIT_MESSAGES: ${{ toJson(github.event.commits.*.message) }}
            run: echo "$COMMIT_MESSAGES"
    ```
  - Push and check logs
  - See what information is available
- Important notes:
  - `github.event.commits` only available on push/merge
  - Empty for pull requests
  - Not needed for PRs anyway
- Create condition:
  - Check if commit message contains `#skip`
  - Use `contains` and `join` functions
  - Join all commit messages
  - Check if contains `#skip`
  - Negate with `!`
- Define reusable condition:
  - Add at workflow level:
    ```yaml
    env:
      SHOULD_DEPLOY: ${{ github.event_name == 'push' && !contains(join(github.event.commits.*.message, ' '), '#skip') }}
    ```
  - Use in deployment and tagging steps
- Update deployment steps:
  ```yaml
  - name: Deploy
    if: ${{ env.SHOULD_DEPLOY == 'true' }}
    run: flyctl deploy --remote-only
  ```
- Update tagging step:
  ```yaml
  tag_release:
    needs: [simple_deployment_pipeline]
    if: ${{ env.SHOULD_DEPLOY == 'true' }}
    steps:
      - name: Bump version and push tag
        uses: anothrNick/github-tag-action@1.64.0
        # ...
  ```
- Test:
  - Make commit with `#skip` in message:
    ```bash
    git commit -m "Update documentation #skip"
    ```
  - Push to main
  - Verify deployment is skipped
  - Verify tagging is skipped
- Test normal commit:
  - Make commit without `#skip`
  - Push to main
  - Verify deployment runs
  - Verify tagging runs
- Note on development:
  - Workflow development is trial and error
  - Consider separate test repository
  - Copy working config to actual repo
  - Can use `act` tool for local testing (but complex)

## 11.17: Adding protection to your main branch

Add branch protection rules to main branch to require PR approval and status checks.

**Details:**
- Navigate to settings:
  - Go to repository Settings
  - Select "Branches" from left menu
- Add protection rule:
  - Click "Add rule" button
  - Type branch name pattern: `main`
  - Select protection options
- Required protections:
  1. **Require pull request approval:**
     - Check "Require a pull request before merging"
     - Set number of approvals (at least 1)
     - Prevents direct merges
  2. **Require status checks to pass:**
     - Check "Require status checks to pass before merging"
     - Check "Require branches to be up to date before merging"
     - Select all relevant status checks:
       - Linting check
       - Testing check
       - Building check
       - Any other checks
- Additional options (optional):
  - Prevent force pushes
  - Prevent branch deletion
  - Require linear history
  - And more
- Save rule:
  - Click "Create" or "Save changes"
  - Rule is now active
- Test protection:
  - Try to push directly to main
  - Should be blocked (if configured)
  - Create PR without approval
  - Should not be able to merge
  - Create PR with failing checks
  - Should not be able to merge
- Administrator override:
  - Administrators can override restrictions
  - Use responsibly
  - Only in emergencies
- Benefits:
  - Prevents broken code in main
  - Ensures code is reviewed
  - Ensures tests pass
  - Keeps main branch green

# [Exercises 11.18-11.21: Expanding Further](https://fullstackopen.com/en/part11/expanding_further#exercise-11-18)

## 11.18: Build success/failure notification action

Set up Discord webhook notifications for build success and failure.

**Details:**
- Register on Discord:
  - If not already registered, create account
  - Join course Discord: https://study.cs.helsinki.fi/discord/join/fullstack
- Get webhook:
  - Go to `fullstack_webhook` channel
  - Find webhook URL in pinned message
  - **Never commit webhook to GitHub!**
- Set up GitHub secret:
  - Go to repository Settings
  - Secrets and variables → Actions
  - New repository secret
  - Name: `DISCORD_WEBHOOK`
  - Value: Webhook URL from Discord
  - Save
- Find Discord action:
  - Search GitHub Actions Marketplace for "discord"
  - Choose action with many stars and good documentation
  - Example: `discord-webhook-notify` or `sarisia/actions-status-discord`
- Add success notification:
  ```yaml
  - name: Notify Discord on success
    if: success() && github.event_name == 'push'
    uses: sarisia/actions-status-discord@v1
    with:
      webhook: ${{ secrets.DISCORD_WEBHOOK }}
      title: "✅ Deployment Successful"
      description: "New version deployed successfully"
      color: 0x00ff00
  ```
- Add failure notification:
  ```yaml
  - name: Notify Discord on failure
    if: failure()
    uses: sarisia/actions-status-discord@v1
    with:
      webhook: ${{ secrets.DISCORD_WEBHOOK }}
      title: "❌ Build Failed"
      description: |
        Build failed for commit: ${{ github.sha }}
        Commit message: ${{ github.event.head_commit.message }}
        Author: ${{ github.event.head_commit.author.name }}
        Branch: ${{ github.ref }}
      color: 0xff0000
  ```
- Check job status:
  - Use `success()` or `failure()` conditions
  - Check action documentation for status checking
  - May need `job.status` or `steps.*.outcome`
- Test:
  - Make successful deployment
  - Verify success notification appears
  - Make a change that breaks build
  - Verify failure notification appears
  - Check notification includes commit info

## 11.19: Periodic health check

Set up a scheduled health check that pings your deployed application regularly.

**Details:**
- Find health check action:
  - Search GitHub Actions Marketplace for "url-health-check"
  - Or use alternative health check action
  - Choose one with good documentation
- Create new workflow file:
  - Create `.github/workflows/health-check.yml`
  - Separate from main pipeline
- Start with push trigger:
  ```yaml
  on:
    schedule:
      - cron: '0 */6 * * *'  # Every 6 hours
    push:  # For testing
      branches:
        - main
  ```
- Configure health check:
  ```yaml
  jobs:
    health_check:
      runs-on: ubuntu-latest
      steps:
        - name: Health check
          uses: url-health-check@v1
          with:
            url: 'https://your-app.fly.dev/health'
            max-attempts: 3
            follow-redirect: true
            timeout: 10000
  ```
- Replace URL:
  - Use your actual application URL
  - Should point to `/health` endpoint
- Test locally:
  - Push to trigger workflow
  - Verify health check runs
  - Check that it works correctly
- Switch to schedule:
  - Once working, can rely on schedule
  - First scheduled run can take ~1 hour
  - Be patient
- Simulate failure:
  - Break your application temporarily
  - Or change health endpoint to fail
  - Verify health check detects problem
  - Fix application
  - Verify health check passes again
- Important notes:
  - First scheduled run takes time (~1 hour)
  - Test with push trigger first
  - Reduce frequency after testing (max once per 24 hours)
  - Or disable to save free hours
  - Health checks consume GitHub Actions minutes

## 11.20: Your own pipeline

Build a similar CI/CD pipeline for one of your own applications.

**Details:**
- Choose application:
  - Phonebook app (parts 2-3)
  - Blog app (parts 4-5)
  - Redux anecdotes (part 6)
  - Your own application
- Create new repository:
  - Create fresh repository on GitHub
  - Easier than modifying existing
  - In real life, do in existing repo
- Copy code:
  - Copy application code to new repo
  - Include both frontend and backend
  - Keep all necessary files
- Restructure if needed:
  - **Recommended:** Frontend and backend in same repo
  - Makes CI/CD simpler
  - Not required but recommended
- Repository structure options:
  - **Option 1:** Backend at root, frontend in subdirectory
    ```
    repository/
      backend/
        app.js
        package.json
      frontend/
        src/
        package.json
      .github/
        workflows/
    ```
  - **Option 2:** Copy example app structure
  - **Option 3:** Structure from part 7
  - Choose what makes sense
- Set up CI/CD pipeline:
  - Linting workflow
  - Testing workflow
  - Building workflow
  - Deployment workflow
  - Versioning workflow
  - All from this part
- Configure deployment:
  - Set up Fly.io or Render
  - Configure secrets
  - Test deployment
- Add health check:
  - Add `/health` endpoint
  - Configure health checks
  - Set up periodic health check
- Protect main branch:
  - Require PR approval
  - Require status checks
  - Prevent direct pushes
- Test everything:
  - Create PR
  - Verify all checks run
  - Merge PR
  - Verify deployment
  - Check version tagging
- This is a long exercise:
  - Common real-world scenario
  - Good practice
  - Apply all knowledge
  - Take your time

## 11.21: Protect your main branch and ask for pull request

Protect the main branch and get a code review from mluukkai.

**Details:**
- Protect main branch:
  - Go to repository Settings
  - Select "Branches" from left menu
  - Add rule for "main"
  - Select protection options:
    - Require pull request approval
    - Require status checks to pass
    - **Prevent administrators from bypassing** (important!)
  - Save rule
- Add collaborator:
  - Go to repository Settings
  - Select "Collaborators" from left menu
  - Click "Add people"
  - Add GitHub user: `mluukkai`
  - Send collaboration invite
  - **Save the collaboration invite link!**
- Create pull request:
  - Create new branch
  - Make some changes
  - Commit and push
  - Open pull request to main
- Request review:
  - Ping in Discord (fullstack_webhook channel)
  - **Include collaboration invite link**
  - **Not the pull request link!**
  - Ask mluukkai to review
- Wait for review:
  - Reviewer will check your code
  - May request changes
  - Address any feedback
- Merge after approval:
  - Once approved, merge PR
  - Verify deployment works
  - Check version tagging
- Important notes:
  - Reviewer must be collaborator
  - Include collaboration invite link in Discord ping
  - Not the PR link
  - Be patient for review

## Submitting Exercises

### Two Repositories

**You have two repositories:**
1. Pokedex (example project from exercises 11.2-11.19)
2. Your own project (from exercise 11.20)

**Submission:**
- Can only submit one repository to submission system
- Put link to other repository in submission form
- Both repositories must be complete

### Requirements

**All Exercises Must Be Completed:**
- Exercises 11.1-11.21
- All must be done
- No partial credit
- Submit via submission system

### Getting Credits

**Steps:**
1. Complete all exercises (11.1-11.21)
2. Ensure both repositories are ready
3. Submit via submission system
4. Include link to second repository in submission form
5. Request credits
6. Download certificate (click flag icon)

**Note:**
- Need registration for course part
- See course information for registration details
- Certificate available after completion
