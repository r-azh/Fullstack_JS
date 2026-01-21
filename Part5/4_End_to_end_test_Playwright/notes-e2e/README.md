# Notes E2E Tests with Playwright

End-to-end tests for the notes application using Playwright.

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

2. Install Playwright browsers (if not already installed):
   ```bash
   npx playwright install
   ```

## Running Tests

```bash
# Run all tests
npm test

# Run with UI mode (recommended for development)
npm run test:ui

# Run in debug mode
npm run test:debug

# Run specific browser
npm test -- --project chromium

# Run specific test
npm test -- -g "user can log in"

# View test report
npm run test:report
```

## Test Structure

```
tests/
  ├── helper.js              # Helper functions (login, createNote)
  └── note_app.spec.js       # Main test suite
```

## Key Features

- **Database Reset**: Tests reset database before each test
- **User Creation**: Test user created in beforeEach
- **Helper Functions**: Reusable login and note creation functions
- **Multiple Browsers**: Tests run on Chromium, Firefox (and Webkit if supported)

## Configuration

Tests are configured in `playwright.config.js`:
- `baseURL: 'http://localhost:5173'` - Base URL for all tests
- `timeout: 3000` - Reduced timeout for faster feedback during development
- `workers: 1` - Sequential execution (important for database tests)
- `fullyParallel: false` - Prevents parallel execution issues

## Debugging

### UI Mode
```bash
npm run test:ui
```
Visual interface for running and debugging tests.

### Debug Mode
```bash
npm run test:debug
```
Step through tests with Playwright Inspector.

### Trace Viewer
```bash
npm test -- --trace on
npm run test:report
```
View visual trace of test execution.

### Test Generator
```bash
npx playwright codegen http://localhost:5173/
```
Record user interactions and generate test code.

## Notes

- Tests require both frontend and backend to be running
- Database is reset before each test for consistency
- Tests use helper functions to reduce code duplication
- All tests start from a clean state (database reset + user creation)
