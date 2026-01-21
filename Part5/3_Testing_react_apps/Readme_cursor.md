# Testing React Apps - Summary

This section covers setting up and writing tests for React components using Vitest, React Testing Library, and jsdom.

## Testing Tools Setup

### Installing Dependencies

Install the necessary testing libraries:

```bash
npm install --save-dev vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

**Packages:**
- `vitest` - Test runner (alternative to Jest, works well with Vite)
- `jsdom` - Simulates browser DOM environment
- `@testing-library/react` - Utilities for testing React components
- `@testing-library/jest-dom` - Custom matchers for DOM assertions
- `@testing-library/user-event` - Simulates user interactions

### Vite Configuration

Configure Vitest in `vite.config.js`:

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/testSetup.js',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    }
  },
})
```

**Configuration Options:**
- `environment: 'jsdom'` - Use jsdom to simulate browser
- `globals: true` - Enable global test functions (test, describe, expect, etc.)
- `setupFiles` - File to run before each test file

### Test Setup File

Create a setup file to configure testing environment:

```js
// src/testSetup.js
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'

// Cleanup after each test
afterEach(() => {
  cleanup()
})
```

**Purpose:**
- Import jest-dom matchers
- Clean up DOM after each test to prevent test interference

### Package.json Scripts

Add test scripts to `package.json`:

```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

## Writing Tests

### Basic Component Rendering Test

Test that a component renders correctly:

```js
// src/__tests__/Note.test.jsx
import { render, screen } from '@testing-library/react'
import Note from '../components/Note'

test('renders content', () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  render(<Note note={note} />)

  const element = screen.getByText('Component testing is done with react-testing-library')
  expect(element).toBeDefined()
})
```

**Key Functions:**
- `render()` - Renders component into virtual DOM
- `screen` - Object with query methods for finding elements
- `getByText()` - Finds element by text content

### Testing User Interactions

Test button clicks and callbacks:

```js
// src/__tests__/Note.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Note from '../components/Note'

test('clicking the button calls event handler once', async () => {
  const note = {
    content: 'Component testing is done with react-testing-library',
    important: true
  }

  const mockHandler = vi.fn()

  render(
    <Note note={note} toggleImportance={mockHandler} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('make not important')
  await user.click(button)

  expect(mockHandler.mock.calls).toHaveLength(1)
})
```

**Key Concepts:**
- `vi.fn()` - Creates a mock function (Vitest's mock function)
- `userEvent.setup()` - Sets up user event simulator
- `user.click()` - Simulates user click
- `mockHandler.mock.calls` - Array of all calls made to mock function

### Testing Conditional Rendering

Test components that show/hide content:

```js
// src/__tests__/Togglable.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Togglable from '../components/Togglable'

describe('<Togglable />', () => {
  let container

  beforeEach(() => {
    container = render(
      <Togglable buttonLabel="show...">
        <div className="testDiv">
          togglable content
        </div>
      </Togglable>
    ).container
  })

  test('renders its children', () => {
    screen.getByText('togglable content')
  })

  test('at start the children are not displayed', () => {
    const div = container.querySelector('.testDiv')
    expect(div).toHaveStyle({ display: 'none' })
  })

  test('after clicking the button, children are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show...')
    await user.click(button)

    const div = container.querySelector('.testDiv')
    expect(div).not.toHaveStyle({ display: 'none' })
  })

  test('toggled content can be closed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show...')
    await user.click(button)

    const closeButton = screen.getByText('cancel')
    await user.click(closeButton)

    const div = container.querySelector('.testDiv')
    expect(div).toHaveStyle({ display: 'none' })
  })
})
```

**Key Points:**
- `describe()` - Groups related tests
- `beforeEach()` - Runs before each test
- `container` - Access to rendered component's DOM
- `toHaveStyle()` - Checks CSS styles
- `not.toHaveStyle()` - Negates the assertion

### Testing Forms

Test form submission and input handling:

```js
// src/__tests__/NoteForm.test.jsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import NoteForm from '../components/NoteForm'

test('<NoteForm /> updates parent state and calls onSubmit', async () => {
  const createNote = vi.fn()
  const user = userEvent.setup()

  render(<NoteForm createNote={createNote} />)

  const input = screen.getByRole('textbox')
  const sendButton = screen.getByText('save')

  await user.type(input, 'testing a form...')
  await user.click(sendButton)

  expect(createNote.mock.calls).toHaveLength(1)
  expect(createNote.mock.calls[0][0].content).toBe('testing a form...')
})
```

**Key Functions:**
- `getByRole('textbox')` - Finds input by role (better than getByPlaceholderText)
- `user.type()` - Simulates typing
- `mock.calls[0][0]` - First call, first argument

### Element Query Strategies

Prefer queries that reflect user experience:

**Priority Order:**
1. `getByRole` - Most accessible, reflects what users see
2. `getByLabelText` - Good for form fields
3. `getByPlaceholderText` - For inputs with placeholders
4. `getByText` - For text content
5. `getByDisplayValue` - For form field values
6. `getByTestId` - Last resort, requires data-testid attribute

**Example:**

```js
// src/__tests__/NoteForm.test.jsx
test('form resets input after submission', async () => {
  const createNote = vi.fn()
  const user = userEvent.setup()

  render(<NoteForm createNote={createNote} />)

  const input = screen.getByRole('textbox')
  const sendButton = screen.getByText('save')

  await user.type(input, 'testing a form...')
  await user.click(sendButton)

  expect(input).toHaveValue('')
})
```

## Test Coverage

### Running Coverage

Generate test coverage reports:

```bash
npm test -- --coverage
```

Vitest will prompt to install `@vitest/coverage-v8` if not present.

### Coverage Configuration

Add coverage configuration to `vite.config.js`:

```js
// vite.config.js
export default defineConfig({
  // ... other config
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/testSetup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/testSetup.js',
      ]
    }
  },
})
```

**Coverage Reports:**
- `text` - Console output
- `json` - JSON file
- `html` - HTML report (opens in browser)

## Testing Best Practices

### 1. Test User Behavior, Not Implementation

```js
// ✅ GOOD - Tests what user sees
test('displays note content', () => {
  render(<Note note={note} />)
  expect(screen.getByText(note.content)).toBeInTheDocument()
})

// ❌ BAD - Tests implementation details
test('has correct className', () => {
  const { container } = render(<Note note={note} />)
  expect(container.querySelector('.note')).toBeDefined()
})
```

### 2. Use Descriptive Test Names

```js
// ✅ GOOD
test('clicking delete button removes note from list', async () => {
  // ...
})

// ❌ BAD
test('delete works', async () => {
  // ...
})
```

### 3. Test One Thing at a Time

Each test should verify one specific behavior.

### 4. Clean Up Between Tests

The `afterEach` cleanup in `testSetup.js` handles this automatically.

### 5. Use Mock Functions for Callbacks

```js
const mockHandler = vi.fn()
render(<Component onAction={mockHandler} />)
// ... interact with component
expect(mockHandler).toHaveBeenCalledTimes(1)
```

### 6. Test Edge Cases

- Empty states
- Missing props
- Error conditions
- Boundary values

## Common Testing Patterns

### Testing Async Operations

```js
test('displays note after async fetch', async () => {
  render(<App />)
  
  // Wait for async content
  const note = await screen.findByText('async note content')
  expect(note).toBeInTheDocument()
})
```

**Key Difference:**
- `getBy*` - Synchronous, throws if not found
- `findBy*` - Asynchronous, waits for element to appear

### Testing Multiple Elements

```js
test('renders all notes', () => {
  const notes = [
    { content: 'note 1', important: false },
    { content: 'note 2', important: true }
  ]

  render(<NoteList notes={notes} />)

  expect(screen.getByText('note 1')).toBeInTheDocument()
  expect(screen.getByText('note 2')).toBeInTheDocument()
})
```

### Testing Conditional Rendering

```js
test('shows login form when user is not logged in', () => {
  render(<App />)
  expect(screen.getByText('Login')).toBeInTheDocument()
  expect(screen.queryByText('Logout')).not.toBeInTheDocument()
})
```

**Note:** Use `queryBy*` when element might not exist (doesn't throw).

## Debugging Tests

### Screen Debugging

Print current DOM state:

```js
test('debug test', () => {
  render(<Component />)
  screen.debug() // Prints entire DOM
  screen.debug(screen.getByText('specific element')) // Prints specific element
})
```

### Finding Elements

If test fails, check what's available:

```js
test('find elements', () => {
  render(<Component />)
  // Check all available roles
  screen.logTestingPlaygroundURL() // Opens testing playground
})
```

## Exercises

### 5.13: Blog List Tests, step 1
- Set up testing environment with Vitest and React Testing Library
- Write test for Blog component that renders title and author
- Test should check that component renders blog's title and author

### 5.14: Blog List Tests, step 2
- Write test for Blog component that shows URL and likes by default
- Write test that checks URL and likes are shown when button is clicked
- Use Togglable-like functionality or component state

### 5.15: Blog List Tests, step 3
- Write test for BlogForm component
- Test that form calls event handler with right details when new blog is created
- Verify form input values are passed correctly

### 5.16: Blog List Tests, step 4
- Write test for BlogForm that verifies form resets after submission
- Check that input fields are cleared after successful submission

### 5.17: Blog List Tests, step 5
- Expand tests to cover edge cases
- Test with empty inputs
- Test with missing props
- Ensure all tests pass

### 5.18: Blog List Tests, step 6
- Add test coverage reporting
- Aim for good coverage of components
- Fix any issues found
