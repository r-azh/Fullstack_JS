# Notes App with Custom Hooks

A notes application demonstrating custom hooks for form handling and API communication.

## Features

- useField hook for form inputs
- useResource hook for API communication
- Create notes and persons
- Reusable hook patterns

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the json-server backend:
```bash
npm run server
```

3. Start the development server (in another terminal):
```bash
npm run dev
```

## Custom Hooks Used

### useField
Manages individual form field state:
- Value management
- onChange handler
- Reset functionality
- Spread operator support

### useResource
Manages API resources:
- Fetching resources
- Creating new resources
- State management
- Error handling

## Project Structure

```
src/
  ├── hooks/
  │   ├── useField.js            # Form field hook
  │   └── useResource.js         # API resource hook
  ├── components/
  │   └── NoteForm.jsx           # Uses useField
  └── App.jsx                    # Uses useResource
```
