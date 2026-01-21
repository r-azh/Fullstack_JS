# Notes App with Styled Components

A notes application demonstrating styled-components for CSS-in-JS styling.

## Features

- Styled components for layout
- Custom styled buttons and inputs
- Component-scoped styles
- No CSS files needed
- Dynamic styling with props

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

1. **styled-components**: CSS-in-JS library
2. **Tagged Template Literals**: CSS in backticks
3. **Styled Elements**: Create styled versions of HTML elements
4. **Component Scoping**: Styles scoped to components
5. **Props-based Styling**: Dynamic styles based on props

## Project Structure

```
src/
  ├── App.jsx                    # Main app with styled Page, Navigation, Footer
  ├── pages/
  │   ├── Notes.jsx             # Notes list
  │   ├── Login.jsx             # Form with styled Input and Button
  │   ├── Note.jsx              # Individual note
  │   └── Users.jsx             # Users page
  └── services/
      └── notes.js              # API service
```

## Styled Components Benefits

- No CSS file conflicts
- Component-scoped styles
- Dynamic styling with props
- Type-safe with TypeScript
- Easy to maintain
