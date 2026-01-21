# Notes App with React Router

A notes application demonstrating React Router for client-side routing.

## Features

- Multiple views (Home, Notes, Users, Login)
- Parameterized routes for individual notes
- Protected routes (Users page requires login)
- Programmatic navigation
- URL-based routing

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

## Key Concepts Demonstrated

1. **BrowserRouter**: Enables routing in the app
2. **Routes & Route**: Define which component renders at which path
3. **Link**: Client-side navigation without page reload
4. **useParams**: Access route parameters
5. **useNavigate**: Programmatic navigation
6. **useMatch**: Check if route matches current URL
7. **Navigate**: Conditional redirects

## Routes

- `/` - Home page
- `/notes` - List of all notes
- `/notes/:id` - Individual note view
- `/users` - Users page (protected, requires login)
- `/login` - Login page

## Project Structure

```
src/
  ├── main.jsx                    # BrowserRouter setup
  ├── App.jsx                     # Route definitions
  ├── services/
  │   └── notes.js               # API service layer
  └── pages/
      ├── Note.jsx               # Single note (uses useParams)
      ├── Notes.jsx              # Notes list
      ├── Users.jsx              # Users page
      └── Login.jsx              # Login (uses useNavigate)
```
