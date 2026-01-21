# Custom Hooks Examples

Examples demonstrating various custom React hooks.

## Features

- useCounter hook - Counter state management
- useField hook - Form field state management
- useResource hook - API resource management
- Example components using each hook

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Custom Hooks

### useCounter
Manages counter state with increment, decrement, and reset functions.

### useField
Manages form field state with value, onChange, and reset functionality.

### useResource
Manages API resources with fetching and creation capabilities.

## Project Structure

```
src/
  ├── hooks/
  │   ├── useCounter.js          # Counter hook
  │   ├── useField.js            # Form field hook
  │   └── useResource.js         # API resource hook
  ├── components/
  │   ├── Counter.jsx           # Uses useCounter
  │   └── LoginForm.jsx         # Uses useField
  └── App.jsx                    # Main app
```
