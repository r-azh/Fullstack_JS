# Redux Notes Application with Server Communication

A notes application demonstrating Redux with server communication using Fetch API and Redux Thunk.

## Features

- Fetch notes from json-server backend
- Create new notes and save to backend
- Toggle note importance
- Filter notes (all, important, nonimportant)
- Asynchronous actions with Redux Thunk
- State managed with Redux Toolkit

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

4. Run tests:
```bash
npm test
```

## Project Structure

```
src/
  ├── main.jsx                    # App entry point
  ├── App.jsx                     # Root component (dispatches initializeNotes)
  ├── store.js                    # Store configuration (Redux Toolkit)
  ├── services/
  │   └── notes.js               # Fetch API service layer
  ├── reducers/
  │   ├── noteReducer.js         # Notes slice with async actions
  │   └── filterReducer.js       # Filter slice
  └── components/
      ├── NoteForm.jsx           # Form (dispatches appendNote)
      ├── Notes.jsx              # Notes list with filtering
      └── VisibilityFilter.jsx   # Filter radio buttons
db.json                          # json-server database
```

## Key Concepts Demonstrated

1. **Fetch API**: Native browser API for HTTP requests
2. **Server Communication**: GET and POST requests
3. **Redux Thunk**: Asynchronous action creators
4. **Async Actions**: Action creators that return functions
5. **Service Layer**: Abstraction of server communication
6. **Component Separation**: Components only dispatch actions

## State Structure

```js
{
  notes: [
    { content: '...', important: true, id: 1 },
    { content: '...', important: false, id: 2 }
  ],
  filter: 'ALL' // or 'IMPORTANT' or 'NONIMPORTANT'
}
```

## Async Actions

### initializeNotes
Fetches all notes from server and initializes store:
```js
dispatch(initializeNotes())
```

### appendNote
Creates new note on server and adds to store:
```js
dispatch(appendNote('Note content'))
```

## Fetch API vs Axios

This project uses Fetch API instead of Axios:
- **No dependencies**: Native browser API
- **Smaller bundle**: No external libraries
- **Manual error handling**: Must check `response.ok`
- **Manual JSON parsing**: Must call `response.json()`

## Redux Thunk

Redux Thunk is built into Redux Toolkit's `configureStore`. It allows:
- Action creators to return functions
- Functions receive `dispatch` and `getState`
- Async operations before dispatching actions
- Cleaner component code

## Development

1. Start backend: `npm run server` (port 3001)
2. Start frontend: `npm run dev` (port 5173)
3. Open browser: http://localhost:5173

## Notes

- Backend runs on port 3001
- Frontend runs on port 5173 (Vite default)
- Data persists in `db.json`
- Redux DevTools available for debugging
