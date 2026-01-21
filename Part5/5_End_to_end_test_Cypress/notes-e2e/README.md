# Notes E2E Tests with Cypress

End-to-end tests for the notes application using Cypress.

## Prerequisites

1. Backend must be running in test mode:
   ```bash
   cd ../notes/backend
   npm run start:test
   ```

2. Frontend must be running:
   ```bash
   cd ../notes/frontend
   npm run dev
   ```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Open Cypress:
   ```bash
   npm run cypress:open
   ```

   Select "E2E Testing" and choose a browser.

## Running Tests

```bash
# Open Cypress Test Runner (interactive)
npm run cypress:open

# Run tests from command line (headless)
npm run test:e2e
```

## Test Structure

```
cypress/
  ├── e2e/
  │   └── note_app.cy.js       # Main test suite
  └── support/
      ├── commands.js           # Custom commands (login, createNote)
      └── e2e.js                # Support file (imports commands)
```

## Key Features

- **Database Reset**: Tests reset database before each test
- **User Creation**: Test user created in beforeEach
- **Custom Commands**: Reusable login and note creation functions
- **Time-Travel Debugging**: Cypress provides excellent debugging experience

## Custom Commands

### cy.login()

Logs in a user via HTTP request (faster than UI):

```js
cy.login({ username: 'mluukkai', password: 'salainen' })
```

### cy.createNote()

Creates a note via HTTP request:

```js
cy.createNote({ content: 'note content', important: true })
```

## Configuration

Tests are configured in `cypress.config.js`:
- `baseUrl: 'http://localhost:5173'` - Base URL for all tests
- Allows using relative URLs: `cy.visit('')` instead of full URL

## Debugging

### Running Single Test

```js
it.only('test name', function() {
  // Only this test runs
})
```

**Remember:** Remove `.only` when done!

### Developer Console

Open Cypress Test Runner's developer console to:
- See HTTP requests on Network tab
- View console output
- Use debugger (only works if console is open)

### Test Runner

Cypress Test Runner shows:
- Visual representation of test execution
- Time-travel debugging
- Element highlighting
- Command execution in real-time

## Notes

- Tests require both frontend and backend to be running
- Database is reset before each test for consistency
- Tests use custom commands to reduce code duplication
- All tests start from a clean state (database reset + user creation)
- Cypress runs tests completely within the browser
- Commands are queued and executed asynchronously

## Best Practices

1. Use labels for form fields instead of CSS selectors
2. Use custom commands for repeated operations
3. Chain commands to search within specific containers
4. Reset database before each test
5. Use baseURL to avoid hardcoding URLs
