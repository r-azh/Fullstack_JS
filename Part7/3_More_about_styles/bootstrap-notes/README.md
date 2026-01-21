# Notes App with React Bootstrap

A notes application demonstrating React Bootstrap for styling.

## Features

- Bootstrap components (Table, Form, Button, Alert, Navbar)
- Responsive navigation with hamburger menu
- Styled forms and tables
- Alert notifications
- Container layout

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the json-server backend:
```bash
npm run server
```

3. Start the development server:
```bash
npm run dev
```

## Key Concepts

1. **React Bootstrap**: React-friendly Bootstrap components
2. **Container**: Wraps app content
3. **Table**: Styled table component
4. **Form**: Form components with labels
5. **Navbar**: Responsive navigation
6. **Alert**: Notification component

## Bootstrap CSS

Bootstrap CSS is loaded from CDN in `public/index.html`. This is required for React Bootstrap to work.

## Project Structure

```
src/
  ├── App.jsx                    # Main app with Container and Navbar
  ├── pages/
  │   ├── Notes.jsx             # Table component
  │   ├── Login.jsx             # Form component
  │   ├── Note.jsx              # Individual note
  │   └── Users.jsx             # Users page
  └── services/
      └── notes.js              # API service
public/
  └── index.html                # Bootstrap CSS link
```
