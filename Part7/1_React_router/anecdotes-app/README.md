# Routed Anecdotes Application

An anecdotes application demonstrating React Router with multiple views and navigation.

## Features

- List view of all anecdotes
- Individual anecdote view
- Create new anecdote form
- About page
- Navigation menu
- Automatic redirect after creating anecdote
- Notification system

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Routes

- `/` - List of all anecdotes
- `/anecdotes/:id` - Individual anecdote view
- `/create` - Form to create new anecdote
- `/about` - About page

## Key Concepts Demonstrated

1. **React Router Setup**: BrowserRouter, Routes, Route
2. **Navigation**: Link component for menu
3. **Parameterized Routes**: `/anecdotes/:id` with useParams
4. **Programmatic Navigation**: useNavigate after form submission
5. **Route Matching**: useMatch to find current route
6. **Notifications**: Display success messages

## Project Structure

```
src/
  ├── main.jsx                    # BrowserRouter setup
  ├── App.jsx                     # Main app with routes
  └── components/
      ├── AnecdoteList.jsx       # List view
      ├── Anecdote.jsx           # Single anecdote (uses useParams)
      ├── CreateNew.jsx          # Form (uses useNavigate)
      ├── About.jsx              # About page
      └── Notification.jsx       # Notification component
```
