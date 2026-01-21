# React Router - Summary

This section covers React Router for building multi-view single-page applications (SPAs) with client-side routing.

## Introduction

React Router enables navigation between different views in a React application without full page reloads. It synchronizes the UI with the URL in the browser's address bar.

### Why React Router?

**Without Router:**
- Manual state-based routing with `useState`
- No URL changes (can't bookmark pages)
- Browser back/forward buttons don't work
- Can't share links to specific views

**With React Router:**
- URL-based routing
- Bookmarkable pages
- Browser navigation works
- Shareable links
- Better user experience

## Installation

```bash
npm install react-router-dom
```

## Basic Setup

### BrowserRouter

Wrap your application with `BrowserRouter` to enable routing:

```js
// src/main.jsx
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
```

**Key Points:**
- `BrowserRouter` uses HTML5 history API
- Must wrap entire app
- Enables URL synchronization

### Routes and Route

Define routes using `Routes` and `Route` components:

```js
// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Notes from './pages/Notes'
import Users from './pages/Users'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </div>
  )
}

export default App
```

**Key Points:**
- `Routes` - container for all routes
- `Route` - defines a single route
- `path` - URL path to match
- `element` - component to render

### Link Component

Use `Link` for navigation instead of anchor tags:

```js
// src/components/Navigation.jsx
import { Link } from 'react-router-dom'

const Navigation = () => {
  return (
    <nav>
      <Link to="/">home</Link>
      <Link to="/notes">notes</Link>
      <Link to="/users">users</Link>
    </nav>
  )
}

export default Navigation
```

**Key Points:**
- `Link` prevents full page reload
- `to` prop specifies the path
- Renders as `<a>` tag but handles routing
- Active state can be styled with CSS

**Link vs Anchor:**
- `Link` - client-side navigation (no reload)
- `<a>` - full page reload (use for external links)

## Parameterized Routes

Routes can have dynamic parameters:

```js
// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Notes from './pages/Notes'
import Note from './pages/Note'

const App = () => {
  return (
    <Routes>
      <Route path="/notes" element={<Notes />} />
      <Route path="/notes/:id" element={<Note />} />
    </Routes>
  )
}

export default App
```

**Key Points:**
- `:id` is a route parameter
- Can have multiple parameters: `/notes/:id/edit`
- Parameters are accessible via `useParams()`

### useParams Hook

Access route parameters in components:

```js
// src/pages/Note.jsx
import { useParams } from 'react-router-dom'

const Note = ({ notes }) => {
  const id = useParams().id
  const note = notes.find(n => n.id === Number(id))

  if (!note) {
    return <div>Note not found</div>
  }

  return (
    <div>
      <h2>{note.content}</h2>
      <div>{note.user}</div>
      <div><strong>{note.important ? 'important' : ''}</strong></div>
    </div>
  )
}

export default Note
```

**Key Points:**
- `useParams()` returns object with route parameters
- Parameters are always strings (convert if needed)
- Use `Number()` or `parseInt()` for numeric IDs

**Destructuring:**
```js
const { id } = useParams()
```

## useMatch Hook

`useMatch` helps find which route matches the current URL:

```js
// src/App.jsx
import { useMatch } from 'react-router-dom'

const App = () => {
  const match = useMatch('/notes/:id')
  const note = match
    ? notes.find(n => n.id === Number(match.params.id))
    : null

  return (
    <div>
      <div>
        <Link to="/notes">notes</Link>
        <Link to="/users">users</Link>
      </div>

      <Routes>
        <Route path="/notes" element={<Notes notes={notes} />} />
        <Route path="/notes/:id" element={<Note note={note} />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </div>
  )
}
```

**Key Points:**
- Returns match object if route matches, `null` otherwise
- Useful for computing data in parent components
- `match.params` contains route parameters
- Can pass computed data to child components

## Navigate Component

Use `Navigate` for conditional redirects:

```js
// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import Users from './pages/Users'
import Login from './pages/Login'

const App = () => {
  const [user, setUser] = useState(null)

  return (
    <Routes>
      <Route
        path="/users"
        element={user ? <Users /> : <Navigate replace to="/login" />}
      />
      <Route path="/login" element={<Login onLogin={setUser} />} />
    </Routes>
  )
}
```

**Key Points:**
- `Navigate` redirects to specified path
- `replace` prop replaces history entry (no back button)
- Useful for protected routes
- Can be used conditionally

## useNavigate Hook

Programmatically navigate after actions:

```js
// src/pages/Login.jsx
import { useNavigate } from 'react-router-dom'

const Login = ({ onLogin }) => {
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    onLogin(event.target.username.value)
    navigate('/')  // Navigate to home after login
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input name="username" />
        <button type="submit">login</button>
      </div>
    </form>
  )
}

export default Login
```

**Key Points:**
- `useNavigate()` returns navigate function
- `navigate(path)` - navigate to path
- `navigate(-1)` - go back
- `navigate(1)` - go forward
- `navigate(path, { replace: true })` - replace history

**Common Use Cases:**
- Redirect after form submission
- Redirect after login/logout
- Navigate after creating resource
- Programmatic navigation based on conditions

## Complete Example: Notes App

### App Component

```js
// src/App.jsx
import { useState, useEffect } from 'react'
import { Routes, Route, Link, useMatch, Navigate } from 'react-router-dom'
import Note from './pages/Note'
import Notes from './pages/Notes'
import Users from './pages/Users'
import Login from './pages/Login'
import noteService from './services/notes'

const App = () => {
  const [notes, setNotes] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    noteService.getAll().then(notes => setNotes(notes))
  }, [])

  const match = useMatch('/notes/:id')
  const note = match
    ? notes.find(n => n.id === Number(match.params.id))
    : null

  return (
    <div>
      <div>
        <Link to="/">home</Link>
        <Link to="/notes">notes</Link>
        <Link to="/users">users</Link>
        {user
          ? <em>{user} logged in</em>
          : <Link to="/login">login</Link>
        }
      </div>

      <Routes>
        <Route path="/notes/:id" element={<Note note={note} />} />
        <Route path="/notes" element={<Notes notes={notes} />} />
        <Route
          path="/users"
          element={user ? <Users /> : <Navigate replace to="/login" />}
        />
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/" element={<div><h2>Home</h2></div>} />
      </Routes>
    </div>
  )
}

export default App
```

### Note Component

```js
// src/pages/Note.jsx
import { useParams, useNavigate } from 'react-router-dom'

const Note = ({ note }) => {
  const navigate = useNavigate()

  if (!note) {
    return null
  }

  return (
    <div>
      <h2>{note.content}</h2>
      <div>{note.user}</div>
      <div><strong>{note.important ? 'important' : ''}</strong></div>
      <button onClick={() => navigate('/notes')}>back</button>
    </div>
  )
}

export default Note
```

### Notes Component

```js
// src/pages/Notes.jsx
import { Link } from 'react-router-dom'

const Notes = ({ notes }) => {
  return (
    <div>
      <h2>Notes</h2>
      <ul>
        {notes.map(note =>
          <li key={note.id}>
            <Link to={`/notes/${note.id}`}>
              {note.content}
            </Link>
          </li>
        )}
      </ul>
    </div>
  )
}

export default Notes
```

## Route Nesting

Routes can be nested for hierarchical navigation:

```js
// src/App.jsx
<Routes>
  <Route path="/notes" element={<Notes />}>
    <Route path=":id" element={<Note />} />
    <Route path="new" element={<NewNote />} />
  </Route>
</Routes>
```

**Key Points:**
- Child routes are relative to parent
- Use `<Outlet />` to render child routes
- Useful for layouts and shared components

## Active Links

Style active links using `NavLink`:

```js
// src/components/Navigation.jsx
import { NavLink } from 'react-router-dom'

const Navigation = () => {
  return (
    <nav>
      <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
        home
      </NavLink>
      <NavLink to="/notes">notes</NavLink>
    </nav>
  )
}
```

**Key Points:**
- `NavLink` adds `active` class when route matches
- `isActive` callback for custom styling
- Better UX for navigation

## Route Configuration

### Exact Matching

By default, routes match if path starts with route:

```js
// This matches both "/" and "/notes"
<Route path="/" element={<Home />} />
<Route path="/notes" element={<Notes />} />
```

Use `end` prop for exact matching:

```js
<Route path="/" element={<Home />} end />
```

### Index Routes

Render default child route:

```js
<Routes>
  <Route path="/notes" element={<NotesLayout />}>
    <Route index element={<NotesList />} />
    <Route path=":id" element={<Note />} />
  </Route>
</Routes>
```

## Common Patterns

### Protected Routes

```js
// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/login" replace />
  }
  return children
}

// Usage:
<Route
  path="/users"
  element={
    <ProtectedRoute user={user}>
      <Users />
    </ProtectedRoute>
  }
/>
```

### Not Found Route

```js
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/notes" element={<Notes />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

**Key Points:**
- `*` matches any path
- Place at end of routes
- Useful for 404 pages

### Redirects

```js
// Redirect old path to new path
<Route path="/old-path" element={<Navigate to="/new-path" replace />} />
```

## Best Practices

1. **Organize Routes**: Keep route definitions in one place
2. **Use Link**: Always use `Link` for internal navigation
3. **Handle Missing Data**: Check if data exists before rendering
4. **Loading States**: Show loading while fetching data
5. **Error Handling**: Handle route errors gracefully
6. **Code Splitting**: Use lazy loading for better performance
7. **Clean URLs**: Use meaningful, RESTful paths

## React Router Hooks Summary

| Hook | Purpose | Returns |
|------|---------|---------|
| `useParams()` | Get route parameters | `{ id: "1" }` |
| `useNavigate()` | Programmatic navigation | `navigate()` function |
| `useMatch(path)` | Check if route matches | Match object or `null` |
| `useLocation()` | Get current location | Location object |
| `useSearchParams()` | Get query parameters | `[searchParams, setSearchParams]` |

## File Structure

```
src/
  ├── main.jsx                    # BrowserRouter setup
  ├── App.jsx                     # Route definitions
  ├── components/
  │   └── Navigation.jsx         # Navigation with Links
  └── pages/
      ├── Home.jsx               # Home page
      ├── Notes.jsx              # Notes list
      ├── Note.jsx               # Single note (uses useParams)
      ├── Users.jsx              # Users page
      └── Login.jsx              # Login page (uses useNavigate)
```

## Exercises

### 7.1: Routed anecdotes, step 1

Add React Router to the anecdotes application. The default view should show the list of anecdotes.

The navigation should work by clicking the links in the menu and the address bar should change when navigating between views.

**Details:**
- Install react-router-dom
- Set up BrowserRouter in main.jsx
- Create Routes for different views
- Add navigation menu with Links
- Default view shows list of anecdotes

### 7.2: Routed anecdotes, step 2

Add a view for showing a single anecdote. Navigating to the page `/anecdotes/:id` should show the anecdote with that id.

**Details:**
- Create route for `/anecdotes/:id`
- Create component to display single anecdote
- Use useParams to get anecdote id
- Link from anecdote list to individual anecdote
- Handle case when anecdote not found

### 7.3: Routed anecdotes, step 3

Use the `useNavigate` hook. If the user is created a new anecdote, the application should automatically navigate to showing the view for all anecdotes and the newly created anecdote should be highlighted for five seconds.

**Details:**
- Use useNavigate in form component
- Navigate to anecdotes list after creation
- Highlight newly created anecdote
- Remove highlight after 5 seconds
- Show notification if needed
