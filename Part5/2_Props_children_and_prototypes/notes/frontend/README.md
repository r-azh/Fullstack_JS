# Notes Frontend with Component Composition

This frontend demonstrates component composition using `props.children`, component extraction, state management, and refs.

## Features

- **LoginForm Component**: Extracted login form with conditional visibility
- **Togglable Component**: Reusable component for showing/hiding content using `props.children`
- **NoteForm Component**: Form component with internal state management
- **useRef & useImperativeHandle**: Accessing component functions from parent
- **ESLint Configuration**: Code style enforcement

## Key Concepts Demonstrated

1. **props.children**: Passing React elements as children to components
2. **Component Extraction**: Separating concerns into focused components
3. **State Lifting**: Moving state to appropriate component level
4. **Refs**: Accessing child component functions from parent
5. **Conditional Rendering**: Showing/hiding components based on state

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

## Project Structure

```
src/
  ├── App.jsx              # Main app with refs and component composition
  ├── main.jsx             # Application entry point
  ├── index.css            # Global styles
  ├── components/
  │   ├── LoginForm.jsx    # Extracted login form component
  │   ├── Togglable.jsx    # Reusable toggle component with props.children
  │   ├── NoteForm.jsx     # Note form with internal state
  │   ├── Note.jsx         # Individual note component
  │   ├── Notification.jsx # Error/success message component
  │   └── Footer.jsx       # Footer component
  └── services/
      ├── login.js         # Login service
      └── notes.js         # Notes service with token management
```

## Improvements Over Previous Version

- Login form extracted into separate component
- Togglable component for reusable show/hide functionality
- NoteForm manages its own state (no state in App)
- Form automatically hides after note creation using refs
- Better component composition and separation of concerns
