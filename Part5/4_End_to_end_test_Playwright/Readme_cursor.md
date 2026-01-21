# End to End Testing: Playwright - Summary

End-to-End (E2E) tests test the system through the same interface as real users use, making them potentially the most useful category of tests.

## Introduction to E2E Testing

### What are E2E Tests?

E2E tests test the entire system through a browser interface, simulating real user interactions.

**Advantages:**
- Test system through same interface as users
- Catch integration issues between frontend and backend
- Verify complete user workflows

**Disadvantages:**
- More challenging to configure than unit/integration tests
- Slower execution (minutes or hours for large systems)
- Can be flaky (sometimes pass, sometimes fail)
- Require system to be running during tests

### Playwright vs Cypress

- **Playwright**: Newer, supports Chrome, Firefox, and Webkit (Safari)
- **Cypress**: Older, tests run entirely within browser
- **Playwright**: Tests run in Node process, connected to browser via APIs
- Playwright surpassed Cypress in popularity during 2024

## Setting Up Playwright

### Creating a Separate Test Project

E2E tests don't need to be in the same npm project. Create a separate project:

```bash
mkdir notes-e2e
cd notes-e2e
npm init -y
npm init playwright@latest
```

**Installation Questions:**
- Language: JavaScript
- Tests location: tests
- Add GitHub Actions: false
- Install browsers: true

### Package.json Scripts

```json
// notes-e2e/package.json
{
  "scripts": {
    "test": "playwright test",
    "test:report": "playwright show-report"
  }
}
```

### Running Tests

```bash
# Run all tests
npm test

# Run with UI mode
npm test -- --ui

# Run specific browser
npm test -- --project chromium

# Run specific test
npm test -- -g "test name"

# Run in debug mode
npm test -- --debug
```

## Basic Test Structure

### Simple Test Example

```js
// tests/example.spec.js
import { test, expect } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/')
  await expect(page).toHaveTitle(/Playwright/)
})

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/')
  await page.getByRole('link', { name: 'Get started' }).click()
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible()
})
```

**Key Concepts:**
- `test()` - Defines a test
- `page` - Browser page object
- `page.goto()` - Navigate to URL
- `page.getByRole()` - Find element by role
- `expect()` - Assertions

## Testing Our Application

### Prerequisites

Tests assume the system is running. Start backend in test mode:

```json
// backend/package.json
{
  "scripts": {
    "start:test": "cross-env NODE_ENV=test node --watch index.js"
  }
}
```

### Basic Test Structure

```js
// tests/note_app.spec.js
const { test, describe, expect, beforeEach } = require('@playwright/test')

describe('Note app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  test('front page can be opened', async ({ page }) => {
    const locator = page.getByText('Notes')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Note app, Department of Computer Science, University of Helsinki 2025')).toBeVisible()
  })
})
```

### Playwright Configuration

```js
// playwright.config.js
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  timeout: 3000,
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: 'http://localhost:5173',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Comment out problematic browsers if needed
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
})
```

**Configuration Options:**
- `timeout: 3000` - Reduce wait time during development (default 30s)
- `fullyParallel: false` - Run tests sequentially
- `workers: 1` - Single worker (important for database tests)
- `baseURL` - Base URL for all tests

## Testing User Interactions

### Testing Login

```js
// tests/note_app.spec.js
test('user can log in', async ({ page }) => {
  await page.goto('http://localhost:5173')

  await page.getByRole('button', { name: 'login' }).click()
  await page.getByLabel('username').fill('mluukkai')
  await page.getByLabel('password').fill('salainen')
  await page.getByRole('button', { name: 'login' }).click()

  await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
})
```

**Key Methods:**
- `getByRole('button', { name: 'login' })` - Find button by role and text
- `getByLabel('username')` - Find input by label (preferred method)
- `fill()` - Fill input field
- `click()` - Click element

### Handling Multiple Elements

If multiple elements match, use `.first()`, `.last()`, or `.all()`:

```js
// If multiple textboxes exist
await page.getByRole('textbox').first().fill('mluukkai')
await page.getByRole('textbox').last().fill('salainen')

// Or use array indexing
const textboxes = await page.getByRole('textbox').all()
await textboxes[0].fill('mluukkai')
await textboxes[1].fill('salainen')
```

**Best Practice:** Use `getByLabel()` for form fields instead of relying on order.

### Testing Note Creation

```js
// tests/note_app.spec.js
describe('when logged in', () => {
  beforeEach(async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click()
    await page.getByLabel('username').fill('mluukkai')
    await page.getByLabel('password').fill('salainen')
    await page.getByRole('button', { name: 'login' }).click()
  })

  test('a new note can be created', async ({ page }) => {
    await page.getByRole('button', { name: 'new note' }).click()
    await page.getByRole('textbox').fill('a note created by playwright')
    await page.getByRole('button', { name: 'save' }).click()
    await expect(page.getByText('a note created by playwright')).toBeVisible()
  })
})
```

## Database State Management

### Creating Test Endpoint

Create a testing router for resetting database:

```js
// backend/controllers/testing.js
const router = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

router.post('/reset', async (request, response) => {
  await Note.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = router
```

### Adding Router to App

```js
// backend/app.js
// ... other routes

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
```

### Resetting Database in Tests

```js
// tests/note_app.spec.js
describe('Note app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:5173/api/testing/reset')
    await request.post('http://localhost:5173/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('/')
  })
  
  // ... tests
})
```

**Key Points:**
- `request` - API for making HTTP requests
- Database reset before each test ensures consistent state
- User created in beforeEach for each test

## Advanced Testing Patterns

### Testing Note Importance Change

```js
// tests/note_app.spec.js
describe('and several notes exists', () => {
  beforeEach(async ({ page }) => {
    await createNote(page, 'first note')
    await createNote(page, 'second note')
    await createNote(page, 'third note')
  })

  test('one of those can be made nonimportant', async ({ page }) => {
    const otherNoteText = page.getByText('second note')
    const otherNoteElement = otherNoteText.locator('..')
    
    await otherNoteElement.getByRole('button', { name: 'make not important' }).click()
    await expect(otherNoteElement.getByText('make important')).toBeVisible()
  })
})
```

**Key Concepts:**
- `locator('..')` - Get parent element (XPath selector)
- Finding elements within specific containers
- Testing state changes

### Testing Failed Login

```js
// tests/note_app.spec.js
test('login fails with wrong password', async ({ page }) => {
  await page.getByRole('button', { name: 'login' }).click()
  await page.getByLabel('username').fill('mluukkai')
  await page.getByLabel('password').fill('wrong')
  await page.getByRole('button', { name: 'login' }).click()

  const errorDiv = page.locator('.error')
  await expect(errorDiv).toContainText('wrong credentials')
  await expect(errorDiv).toHaveCSS('border-style', 'solid')
  await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
  await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
})
```

**Key Methods:**
- `page.locator('.error')` - Find by CSS class
- `toContainText()` - Check text content
- `toHaveCSS()` - Check CSS properties
- `not.toBeVisible()` - Negate assertion

## Helper Functions

### Creating Helper Functions

```js
// tests/helper.js
const loginWith = async (page, username, password) => {
  await page.getByRole('button', { name: 'login' }).click()
  await page.getByLabel('username').fill(username)
  await page.getByLabel('password').fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const createNote = async (page, content) => {
  await page.getByRole('button', { name: 'new note' }).click()
  await page.getByRole('textbox').fill(content)
  await page.getByRole('button', { name: 'save' }).click()
  await page.getByText(content).waitFor()
}

export { loginWith, createNote }
```

### Using Helper Functions

```js
// tests/note_app.spec.js
const { loginWith, createNote } = require('./helper')

describe('Note app', () => {
  test('user can log in', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'salainen')
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })

  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new note can be created', async ({ page }) => {
      await createNote(page, 'a note created by playwright')
      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })
  })
})
```

**Benefits:**
- Reduces code duplication
- Makes tests more readable
- Easier to maintain

## Debugging Tests

### Running Single Test

```js
// Run only this test
test.only('login fails with wrong password', async ({ page }) => {
  // ...
})
```

**Remember:** Remove `.only` when done!

### Debug Mode

```bash
npm test -- -g "test name" --debug
```

Opens Playwright Inspector showing test execution step by step.

### Using page.pause()

```js
test('one of those can be made nonimportant', async ({ page }) => {
  await page.pause() // Execution stops here
  const otherNoteText = page.getByText('second note')
  // ...
})
```

### UI Mode

```bash
npm test -- --ui
```

Visual interface for running and debugging tests.

### Trace Viewer

```bash
# Run with trace
npm test -- --trace on

# View trace
npm run test:report
```

Saves visual trace of test execution for later review.

### Locator Assistant

In UI mode or Trace Viewer, use the locator assistant (double circle icon) to find elements. Click on UI elements to get suggested locators.

### Test Generator (Codegen)

```bash
npx playwright codegen http://localhost:5173/
```

Records user interactions and generates test code.

## Best Practices

### 1. Use Descriptive Locators

```js
// ✅ GOOD - Uses label (user-visible)
await page.getByLabel('username').fill('mluukkai')

// ❌ BAD - Relies on order
await page.getByRole('textbox').first().fill('mluukkai')
```

### 2. Wait for Elements

```js
// Wait for element to appear
await page.getByText(content).waitFor()
```

### 3. Use baseURL

Configure baseURL in `playwright.config.js`:

```js
use: {
  baseURL: 'http://localhost:5173',
}
```

Then use relative URLs:

```js
await page.goto('/') // Instead of full URL
await request.post('/api/testing/reset')
```

### 4. Reset State Between Tests

Always reset database in `beforeEach` to ensure test independence.

### 5. Use Helper Functions

Extract common operations (login, create note) into helper functions.

### 6. Test User Behavior

Test what users see and do, not implementation details.

## Element Query Strategies

**Priority Order:**
1. `getByRole()` - Most accessible, reflects user experience
2. `getByLabel()` - For form fields
3. `getByText()` - For text content
4. `getByPlaceholderText()` - For inputs with placeholders
5. `locator()` - For CSS selectors (last resort)

**Example:**

```js
// ✅ GOOD
page.getByRole('button', { name: 'login' })
page.getByLabel('username')
page.locator('li').filter({ hasText: 'third note' }).getByRole('button')

// ❌ AVOID (unless necessary)
page.locator('.login-button')
page.locator('#username-input')
```

## Common Issues and Solutions

### Issue: Tests Run Too Slow

**Solution:** Reduce timeout and run with single browser during development:

```js
// playwright.config.js
timeout: 3000,
workers: 1,
```

### Issue: Tests Are Flaky

**Solution:** 
- Wait for elements to appear: `await page.getByText(content).waitFor()`
- Ensure database is reset before each test
- Run tests sequentially (`fullyParallel: false`)

### Issue: Multiple Elements Found

**Solution:** Use more specific locators:

```js
// Instead of
page.getByRole('textbox')

// Use
page.getByLabel('username')
page.locator('li').filter({ hasText: 'note content' }).getByRole('textbox')
```

### Issue: Element Not Found

**Solution:**
- Check if element is actually rendered
- Use `waitFor()` for async content
- Use UI mode to see what Playwright sees
- Check if element is hidden (use `toBeVisible()`)

## Exercises

### 5.17: Blog List End To End Testing, step 1
- Create new npm project for tests
- Configure Playwright
- Make test to ensure login form is displayed by default

### 5.18: Blog List End To End Testing, step 2
- Do tests for login (successful and failed)
- Create user in beforeEach block
- Empty database before each test

### 5.19: Blog List End To End Testing, step 3
- Create test that logged in user can create a blog
- Ensure created blog is visible in list

### 5.20: Blog List End To End Testing, step 4
- Make test that ensures blog can be liked

### 5.21: Blog List End To End Testing, step 5
- Make test that user who added blog can delete it
- Handle window.confirm dialog if used

### 5.22: Blog List End To End Testing, step 6
- Make test that only user who added blog sees delete button

### 5.23: Blog List End To End Testing, step 7
- Do test that blogs are arranged by likes (most likes first)
- This is significantly more challenging
