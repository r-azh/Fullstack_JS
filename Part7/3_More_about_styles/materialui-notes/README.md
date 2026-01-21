# Notes App with MaterialUI

A notes application demonstrating MaterialUI (MUI) for styling.

## Features

- MaterialUI components (Table, TextField, Button, Alert, AppBar)
- Material Design visual language
- Responsive navigation
- Styled forms and tables
- Alert notifications

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

1. **MaterialUI**: Material Design components
2. **Container**: Wraps app content
3. **Table**: Table with Paper container
4. **TextField**: Material input fields
5. **AppBar**: Navigation bar
6. **Alert**: Notification component
7. **component prop**: Use React Router Link

## Project Structure

```
src/
  ├── App.jsx                    # Main app with Container and AppBar
  ├── pages/
  │   ├── Notes.jsx             # Table component
  │   ├── Login.jsx             # Form with TextField
  │   ├── Note.jsx              # Individual note
  │   └── Users.jsx             # Users page
  └── services/
      └── notes.js              # API service
```

## MaterialUI vs Bootstrap

- More components to import
- Better documentation
- Material Design aesthetic
- `component` prop for React Router integration
