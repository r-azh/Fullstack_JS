# Notes Frontend with Login

This is the frontend for the notes application with user authentication.

## Features

- User login with username and password
- Token-based authentication
- Persistent login using browser local storage
- Create notes (requires authentication)
- Toggle note importance
- Filter notes by importance

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

The frontend will run on `http://localhost:5173` (or another port if 5173 is taken).

## Project Structure

```
src/
  ├── App.jsx              # Main application component with login logic
  ├── main.jsx             # Application entry point
  ├── index.css            # Global styles
  ├── components/
  │   ├── Note.jsx         # Individual note component
  │   ├── Notification.jsx # Error/success message component
  │   └── Footer.jsx       # Footer component
  └── services/
      ├── login.js         # Login service for authentication
      └── notes.js         # Notes service with token management
```

## Key Implementation Details

- **Login**: Users can log in with username and password. The token is saved to local storage.
- **Token Management**: The token is automatically included in the Authorization header when creating notes.
- **Persistent Login**: User login persists across page refreshes using browser local storage.
- **Conditional Rendering**: Login form is shown when user is not logged in, note form when logged in.

## Backend Requirements

The backend should have:
- `/api/login` endpoint for authentication
- `/api/notes` endpoints that accept Authorization header with Bearer token
