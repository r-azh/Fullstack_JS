# End to End Testing: Cypress - Summary

Cypress is an E2E testing library that runs tests completely within the browser, making it easy to use and debug.

## Introduction to Cypress

### What is Cypress?

Cypress is an E2E testing library that:
- Runs tests completely within the browser (unlike Playwright which runs in Node process)
- Provides excellent developer experience with time-travel debugging
- Has comprehensive documentation
- Has been popular for years, though Playwright is gaining ground

**Key Difference from Playwright:**
- Cypress: Tests run entirely within the browser
- Playwright: Tests run in Node process, connected to browser via API

## Setting Up Cypress

### Creating a Separate Test Project

E2E tests don't need to be in the same npm project. Create a separate project:

```bash
mkdir notes-e2e
cd notes-e2e
npm init -y
npm install --save-dev cypress
```

### Package.json Scripts

```json
// notes-e2e/package.json
{
  "scripts": {
    "cypress:open": "cypress open",
    "test:e2e": "cypress run"
  }
}
```

### Starting Cypress

```bash
npm run cypress:open
```

Cypress asks what type of tests - select "E2E Testing".

### Backend Test Mode

Add script to backend for test mode:

```json
// backend/package.json
{
  "scripts": {
    "start:test": "cross-env NODE_ENV=test node --watch index.js"
  }
}
```

## Basic Test Structure

### Simple Test Example

```js
// cypress/e2e/note_app.cy.js
describe('Note app', function() {
  it('front page can be opened', function() {
    cy.visit('http://localhost:5173')
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2025')
  })
})
```

**Key Concepts:**
- `describe()` - Groups tests (from Mocha)
- `it()` - Defines a test case (from Mocha)
- `cy.visit()` - Navigate to URL
- `cy.contains()` - Search for text on page

**Note:** Mocha recommends using regular functions instead of arrow functions to avoid issues.

### Using beforeEach

Extract common setup:

```js
// cypress/e2e/note_app.cy.js
describe('Note app', function() {
  beforeEach(function() {
    cy.visit('http://localhost:5173')
  })

  it('front page can be opened', function() {
    cy.contains('Notes')
    cy.contains('Note app, Department of Computer Science, University of Helsinki 2025')
  })
})
```

## Testing User Interactions

### Testing Login

```js
// cypress/e2e/note_app.cy.js
describe('Note app', function() {
  // ...

  it('user can login', function() {
    cy.contains('button', 'login').click()
    cy.contains('label', 'username').type('mluukkai')
    cy.contains('label', 'password').type('salainen')
    cy.get('#login-button').click()
    cy.contains('Matti Luukkainen logged in')
  })
})
```

**Key Methods:**
- `cy.contains('button', 'login')` - Find button with text
- `cy.contains('label', 'username')` - Find input by label (preferred)
- `.type()` - Type into input field
- `.click()` - Click element
- `cy.get('#login-button')` - Find by ID (CSS selector)

### Finding Elements by Label

**Preferred method** - use labels instead of CSS selectors:

```js
// ✅ GOOD - Uses label (user-visible)
cy.contains('label', 'username').type('mluukkai')

// ❌ BAD - Relies on order
cy.get('input:first').type('mluukkai')
cy.get('input:last').type('salainen')
```

### Adding ID to Login Button

To avoid clicking wrong button, add ID to login form button:

```js
// src/components/LoginForm.jsx
<button id="login-button" type="submit">
  login
</button>
```

Then use in test:

```js
cy.get('#login-button').click()
```

## Testing Note Creation

```js
// cypress/e2e/note_app.cy.js
describe('Note app', function() {
  // ...

  describe('when logged in', function() {
    beforeEach(function() {
      cy.contains('button', 'login').click()
      cy.contains('label', 'username').type('mluukkai')
      cy.contains('label', 'password').type('salainen')
      cy.get('#login-button').click()
    })

    it('a new note can be created', function() {
      cy.contains('new note').click()
      cy.get('input').type('a note created by cypress')
      cy.contains('save').click()
      cy.contains('a note created by cypress')
    })
  })
})
```

**Note:** Each test starts from zero - browser state is reset after each test.

## Database State Management

### Creating Test Endpoint

Create a testing router for resetting database:

```js
// backend/controllers/testing.js
const testingRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

testingRouter.post('/reset', async (request, response) => {
  await Note.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = testingRouter
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
// cypress/e2e/note_app.cy.js
describe('Note app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:5173')
  })
  
  // ... tests
})
```

**Key Method:**
- `cy.request()` - Make HTTP requests to backend

## Testing Note Importance Change

```js
// cypress/e2e/note_app.cy.js
describe('when logged in', function() {
  // ...

  describe('and a note exists', function() {
    beforeEach(function() {
      cy.contains('new note').click()
      cy.get('input').type('another note cypress')
      cy.contains('save').click()
    })

    it('it can be made not important', function() {
      cy.contains('another note cypress')
        .contains('button', 'make not important')
        .click()

      cy.contains('another note cypress')
        .contains('button', 'make important')
    })
  })
})
```

**Key Concept:**
- Chained `cy.contains()` - Second contains searches within first element
- This ensures we click the button for the correct note

## Testing Failed Login

```js
// cypress/e2e/note_app.cy.js
it('login fails with wrong password', function() {
  cy.contains('button', 'login').click()
  cy.contains('label', 'username').type('mluukkai')
  cy.contains('label', 'password').type('wrong')
  cy.get('#login-button').click()

  cy.get('.error').contains('wrong credentials')
})
```

### Using should for Assertions

```js
// cypress/e2e/note_app.cy.js
it('login fails with wrong password', function() {
  // ...

  cy.get('.error')
    .should('contain', 'wrong credentials')
    .and('have.css', 'color', 'rgb(255, 0, 0)')
    .and('have.css', 'border-style', 'solid')
})
```

**Key Methods:**
- `.should('contain', 'text')` - Check text content
- `.should('have.css', 'property', 'value')` - Check CSS properties
- `.and()` - Chain additional assertions
- Colors must be in rgb format

### Checking Element Doesn't Exist

```js
// cypress/e2e/note_app.cy.js
it('login fails with wrong password', function() {
  // ...

  cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
  // Or
  cy.contains('Matti Luukkainen logged in').should('not.exist')
})
```

## Bypassing the UI with Custom Commands

### Creating Custom Login Command

Instead of logging in via UI each time, create a custom command:

```js
// cypress/support/commands.js
Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', 'http://localhost:3001/api/login', {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('loggedNoteappUser', JSON.stringify(body))
    cy.visit('http://localhost:5173')
  })
})
```

**Benefits:**
- Much faster than filling form
- Reduces code duplication
- More reliable

### Using Custom Command

```js
// cypress/e2e/note_app.cy.js
describe('when logged in', function() {
  beforeEach(function() {
    cy.login({ username: 'mluukkai', password: 'salainen' })
  })

  it('a new note can be created', function() {
    // ...
  })
})
```

### Creating Custom Note Command

```js
// cypress/support/commands.js
Cypress.Commands.add('createNote', ({ content, important }) => {
  cy.request({
    url: 'http://localhost:3001/api/notes',
    method: 'POST',
    body: { content, important },
    headers: {
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('loggedNoteappUser')).token}`
    }
  })

  cy.visit('http://localhost:5173')
})
```

**Usage:**

```js
// cypress/e2e/note_app.cy.js
describe('and a note exists', function() {
  beforeEach(function() {
    cy.createNote({
      content: 'another note cypress',
      important: true
    })
  })

  it('it can be made important', function() {
    // ...
  })
})
```

## Configuration

### Setting baseURL

Configure baseURL in `cypress.config.js`:

```js
// cypress.config.js
const { defineConfig } = require("cypress")

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
    },
    baseUrl: 'http://localhost:5173'
  },
})
```

Then use relative URLs:

```js
cy.visit('') // Instead of full URL
cy.request('POST', '/api/testing/reset') // Instead of full URL
```

## Advanced Testing Patterns

### Testing Multiple Notes

```js
// cypress/e2e/note_app.cy.js
describe('and several notes exist', function() {
  beforeEach(function() {
    cy.createNote({ content: 'first note', important: true })
    cy.createNote({ content: 'second note', important: true })
    cy.createNote({ content: 'third note', important: true })
  })

  it('one of those can be made non important', function() {
    cy.contains('second note')
      .contains('button', 'make not important')
      .click()

    cy.contains('second note')
      .contains('button', 'make important')
  })
})
```

### Handling Component Structure Changes

If note text is wrapped in a span:

```js
// src/components/Note.jsx
<li className='note'>
  <span>{note.content}</span>
  <button onClick={toggleImportance}>{label}</button>
</li>
```

Update test to use parent:

```js
// cypress/e2e/note_app.cy.js
it('one of those can be made non important', function() {
  cy.contains('second note').parent().find('button').click()
  cy.contains('second note')
    .parent()
    .find('button')
    .should('contain', 'make important')
})
```

**Key Methods:**
- `.parent()` - Get parent element
- `.find('button')` - Find button within element (not `cy.get()` which searches whole page)

### Using Aliases

Avoid repetition with aliases:

```js
// cypress/e2e/note_app.cy.js
it('one of those can be made non important', function() {
  cy.contains('second note').parent().find('button').as('theButton')
  cy.get('@theButton').click()
  cy.get('@theButton').should('contain', 'make important')
})
```

**Key Method:**
- `.as('aliasName')` - Save element as alias
- `cy.get('@aliasName')` - Retrieve aliased element

## How Cypress Works

### Command Queue

Cypress commands are **not** executed immediately. They're added to a queue:

```js
// ❌ WRONG - This won't work
const button = cy.contains('button', 'login')
button.click() // Error: button is undefined

// ✅ CORRECT - Commands are queued
cy.contains('button', 'login').click()
```

### Accessing Return Values

Use `.then()` to access command return values:

```js
// cypress/e2e/note_app.cy.js
it('then example', function() {
  cy.get('button').then(buttons => {
    console.log('number of buttons', buttons.length)
    cy.wrap(buttons[0]).click()
  })
})
```

**Key Methods:**
- `.then()` - Access return value
- `cy.wrap()` - Wrap DOM element to use with Cypress commands

## Debugging Tests

### Running Single Test

```js
// Run only this test
it.only('login fails with wrong password', function() {
  // ...
})
```

**Remember:** Remove `.only` when done!

### Developer Console

Open Cypress Test Runner's developer console to:
- See HTTP requests on Network tab
- View console output
- Use debugger (only works if console is open)

### Command Line Testing

```bash
npm run test:e2e
```

Runs tests headlessly from command line (useful for CI/CD).

### Video Recording

Cypress can record videos of test execution (disabled by default). Useful for debugging and CI/CD pipelines.

## Best Practices

### 1. Use Labels for Form Fields

```js
// ✅ GOOD
cy.contains('label', 'username').type('mluukkai')

// ❌ BAD
cy.get('input:first').type('mluukkai')
```

### 2. Use Custom Commands

Create custom commands for repeated operations (login, createNote).

### 3. Reset Database Before Each Test

Ensure consistent test state.

### 4. Use baseURL

Configure baseURL to avoid hardcoding URLs.

### 5. Chain Commands Carefully

```js
// ✅ GOOD - Second contains searches within first
cy.contains('second note')
  .contains('button', 'make not important')
  .click()

// ❌ BAD - Second contains searches whole page
cy.contains('second note')
cy.contains('button', 'make not important').click() // Wrong button!
```

### 6. Test User Behavior

Test what users see and do, not implementation details.

## Common Issues

### Issue: Multiple Elements Found

**Solution:** Use more specific selectors (labels, IDs, chained contains).

### Issue: Test Clicks Wrong Element

**Solution:** Chain commands to search within specific containers.

### Issue: Element Not Found

**Solution:** 
- Check if element is actually rendered
- Use `.should('be.visible')` for async content
- Check Cypress Test Runner to see what it sees

### Issue: CSS Properties Different in Firefox

Some CSS properties (border-style, border-radius, padding) may behave differently in Firefox. Test in multiple browsers or adjust assertions.

## Exercises

### 5.17: Blog List End To End Testing, step 1
- Configure Cypress for project
- Make test for checking login form is displayed by default
- Structure: `describe('Blog app')` with `beforeEach` visiting URL

### 5.18: Blog List End To End Testing, step 2
- Make tests for logging in (successful and unsuccessful)
- Create user in beforeEach block
- Empty database before each test
- Optional: Check notification is red for failed login

### 5.19: Blog List End To End Testing, step 3
- Make test that logged-in user can create new blog
- Ensure new blog is added to list of all blogs
- Structure: `describe('When logged in')` with `beforeEach` for login

### 5.20: Blog List End To End Testing, step 4
- Make test that confirms users can like a blog

### 5.21: Blog List End To End Testing, step 5
- Make test for ensuring user who created blog can delete it
- Handle window.confirm dialog if used

### 5.22: Blog List End To End Testing, step 6
- Make test that only creator can see delete button of a blog

### 5.23: Blog List End To End Testing, step 7
- Make test that blogs are ordered by likes (most liked first)
- This is quite a bit trickier
- Use `.eq(index)` to get blog at specific index
- Wait for likes to update between clicks
