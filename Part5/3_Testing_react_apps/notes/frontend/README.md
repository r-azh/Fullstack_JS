# Notes Frontend with Testing

This frontend demonstrates testing React components using Vitest, React Testing Library, and jsdom.

## Features

- **Unit Tests**: Test component rendering, user interactions, and form submissions
- **Vitest**: Fast test runner that works seamlessly with Vite
- **React Testing Library**: Utilities for testing React components from user perspective
- **jsdom**: Simulates browser DOM environment for testing
- **Test Coverage**: Generate coverage reports to see what's tested

## Setup

1. Install dependencies:
```bash
npm install
```

2. Make sure the backend is running on `http://localhost:3001`

3. Start the development server:
```bash
npm run dev
```

## Running Tests

```bash
# Run tests once
npm test

# Run tests in watch mode (recommended during development)
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## Test Structure

```
src/
  ├── __tests__/
  │   ├── Note.test.jsx          # Tests for Note component
  │   ├── NoteForm.test.jsx      # Tests for NoteForm component
  │   └── Togglable.test.jsx     # Tests for Togglable component
  ├── testSetup.js               # Test configuration and cleanup
  └── components/                # Components being tested
```

## Testing Tools

- **Vitest**: Test runner (alternative to Jest, works with Vite)
- **React Testing Library**: Query and interact with components
- **@testing-library/user-event**: Simulate user interactions
- **@testing-library/jest-dom**: Custom DOM matchers (toBeInTheDocument, etc.)
- **jsdom**: Browser environment simulation

## Key Testing Concepts

1. **Render Components**: Use `render()` to render components in virtual DOM
2. **Query Elements**: Use `screen.getBy*` to find elements
3. **User Interactions**: Use `userEvent` to simulate clicks, typing, etc.
4. **Mock Functions**: Use `vi.fn()` to create mock callbacks
5. **Assertions**: Use `expect()` with jest-dom matchers

## Example Test

```js
test('renders content', () => {
  const note = { content: 'Test note', important: true }
  render(<Note note={note} />)
  expect(screen.getByText('Test note')).toBeInTheDocument()
})
```
