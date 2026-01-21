# Communicating with Server in a Redux Application - Summary

This section covers integrating Redux applications with backend servers, using the Fetch API, and implementing asynchronous actions with Redux Thunk.

## Setting up JSON Server

Use json-server to create a simple backend for development.

### Database File

```json
// db.json
{
  "notes": [
    {
      "content": "the app state is in redux store",
      "important": true,
      "id": 1
    },
    {
      "content": "state changes are made with actions",
      "important": false,
      "id": 2
    }
  ]
}
```

### Installation and Script

```bash
npm install json-server --save-dev
```

```json
// package.json
{
  "scripts": {
    "server": "json-server -p 3001 db.json",
    // ...
  }
}
```

Start server: `npm run server`

## Fetch API vs Axios

### Why Fetch API?

**Advantages:**
- Native browser API, no external dependencies
- Smaller bundle size (Axios installs 20+ packages)
- Better security (smaller attack surface)
- Easier maintenance (fewer dependencies to update)

**Considerations:**
- More verbose than Axios
- Manual error handling required
- Manual JSON parsing required
- No automatic request/response interceptors

### Fetch API Basics

```js
// Basic GET request
const response = await fetch('http://localhost:3001/notes')
const data = await response.json()
```

**Key Differences from Axios:**
- `fetch()` doesn't throw errors for HTTP error status codes
- Must manually check `response.ok`
- Must manually call `response.json()`
- Must manually stringify JSON in POST requests

## Getting Data from Backend

### Notes Service with Fetch API

```js
// src/services/notes.js
const baseUrl = 'http://localhost:3001/notes'

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }

  return await response.json()
}

export default { getAll }
```

**Key Points:**
- `response.ok` is `true` for status codes 200-299
- Must manually check for errors (fetch doesn't throw on 404/500)
- `response.json()` is async, requires `await`
- Returns parsed JSON data

### Error Handling

```js
if (!response.ok) {
  throw new Error('Failed to fetch notes')
}
```

**Status Codes:**
- 200-299: `response.ok === true` (success)
- 400-599: `response.ok === false` (error)
- fetch() doesn't throw automatically, must check manually

## Initializing Store with Server Data

### Updating Reducer

Change initial state to empty array and add `setNotes` action:

```js
// src/reducers/noteReducer.js
import { createSlice } from '@reduxjs/toolkit'

const noteSlice = createSlice({
  name: 'notes',
  initialState: [],  // Empty array, data from server
  reducers: {
    createNote(state, action) {
      state.push(action.payload)
    },
    toggleImportanceOf(state, action) {
      const id = action.payload
      const noteToChange = state.find(n => n.id === id)
      const changedNote = {
        ...noteToChange,
        important: !noteToChange.important
      }
      return state.map(note =>
        note.id !== id ? note : changedNote
      )
    },
    setNotes(state, action) {
      return action.payload
    }
  },
})

export const { createNote, toggleImportanceOf, setNotes } = noteSlice.actions
export default noteSlice.reducer
```

**Key Changes:**
- `initialState: []` - empty array instead of hardcoded data
- `setNotes` action - replaces entire notes array
- Used for initializing store with server data

### Fetching in Component

```js
// src/App.jsx
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import NoteForm from './components/NoteForm'
import Notes from './components/Notes'
import VisibilityFilter from './components/VisibilityFilter'
import { setNotes } from './reducers/noteReducer'
import noteService from './services/notes'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    noteService.getAll().then(notes => dispatch(setNotes(notes)))
  }, [dispatch])

  return (
    <div>
      <NoteForm />
      <VisibilityFilter />
      <Notes />
    </div>
  )
}

export default App
```

**Key Points:**
- Use `useEffect` to fetch data on component mount
- Include `dispatch` in dependency array (ESLint requirement)
- Dispatch `setNotes` action with fetched data
- Data fetched once when component mounts

**Why include `dispatch` in dependencies?**
- ESLint rule requires all used variables/functions
- `dispatch` is stable (same reference), but good practice to include
- Prevents potential bugs if dispatch changes

## Sending Data to Backend

### POST Request with Fetch API

```js
// src/services/notes.js
const baseUrl = 'http://localhost:3001/notes'

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }

  return await response.json()
}

const createNew = async (content) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, important: false }),
  }

  const response = await fetch(baseUrl, options)

  if (!response.ok) {
    throw new Error('Failed to create note')
  }

  return await response.json()
}

export default { getAll, createNew }
```

**Key Points:**
- `method: 'POST'` - specifies HTTP method
- `headers` - tells server data is JSON
- `body` - must stringify JavaScript object
- Server returns created note with generated `id`
- Must parse response with `response.json()`

### Updating NoteForm Component

```js
// src/components/NoteForm.jsx
import { useDispatch } from 'react-redux'
import { createNote } from '../reducers/noteReducer'
import noteService from '../services/notes'

const NoteForm = () => {
  const dispatch = useDispatch()

  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    const newNote = await noteService.createNew(content)
    dispatch(createNote(newNote))
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}

export default NoteForm
```

**Key Changes:**
- `addNote` is now `async`
- Call `noteService.createNew(content)` first
- Server returns note with `id`
- Dispatch `createNote` with server-returned note

### Updating Reducer

```js
// src/reducers/noteReducer.js
const noteSlice = createSlice({
  name: 'notes',
  initialState: [],
  reducers: {
    createNote(state, action) {
      state.push(action.payload)  // Payload is full note object from server
    },
    // ...
  },
})
```

**Key Change:**
- `action.payload` is now the complete note object (with `id`)
- No need to generate `id` in reducer
- Server generates unique `id`

## Asynchronous Actions and Redux Thunk

### Problem with Current Approach

**Current Issues:**
- Server communication happens in components
- Components need to know about service layer
- Mixing UI logic with data fetching logic

**Better Approach:**
- Abstract server communication to action creators
- Components only dispatch actions
- Action creators handle async operations

### Redux Thunk

**What is Redux Thunk?**
- Middleware that allows action creators to return functions
- Functions receive `dispatch` and `getState` as parameters
- Enables asynchronous action creators
- Built into Redux Toolkit's `configureStore`

**How it works:**
- Normal action creator returns action object
- Thunk action creator returns function
- Function is called with `dispatch` and `getState`
- Function can perform async operations
- Function dispatches actions when ready

### Implementing Async Action Creators

```js
// src/reducers/noteReducer.js
import { createSlice } from '@reduxjs/toolkit'
import noteService from '../services/notes'

const noteSlice = createSlice({
  name: 'notes',
  initialState: [],
  reducers: {
    createNote(state, action) {
      state.push(action.payload)
    },
    toggleImportanceOf(state, action) {
      const id = action.payload
      const noteToChange = state.find(n => n.id === id)
      const changedNote = {
        ...noteToChange,
        important: !noteToChange.important
      }
      return state.map(note =>
        note.id !== id ? note : changedNote
      )
    },
    setNotes(state, action) {
      return action.payload
    }
  },
})

// Extract setNotes for internal use
const { setNotes, createNote } = noteSlice.actions

// Async action creator - returns function
export const initializeNotes = () => {
  return async (dispatch) => {
    const notes = await noteService.getAll()
    dispatch(setNotes(notes))
  }
}

// Async action creator for creating notes
export const appendNote = (content) => {
  return async (dispatch) => {
    const newNote = await noteService.createNew(content)
    dispatch(createNote(newNote))
  }
}

// Export other actions
export const { toggleImportanceOf } = noteSlice.actions
export default noteSlice.reducer
```

**Key Points:**
- `initializeNotes` returns async function
- Function receives `dispatch` automatically
- Fetch data, then dispatch action
- `setNotes` and `createNote` not exported (internal use)
- `appendNote` handles server communication

### Updated Components

```js
// src/App.jsx
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import NoteForm from './components/NoteForm'
import Notes from './components/Notes'
import VisibilityFilter from './components/VisibilityFilter'
import { initializeNotes } from './reducers/noteReducer'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeNotes())
  }, [dispatch])

  return (
    <div>
      <NoteForm />
      <VisibilityFilter />
      <Notes />
    </div>
  )
}

export default App
```

```js
// src/components/NoteForm.jsx
import { useDispatch } from 'react-redux'
import { appendNote } from '../reducers/noteReducer'

const NoteForm = () => {
  const dispatch = useDispatch()

  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    dispatch(appendNote(content))
  }

  return (
    <form onSubmit={addNote}>
      <input name="note" />
      <button type="submit">add</button>
    </form>
  )
}

export default NoteForm
```

**Benefits:**
- Components don't know about server communication
- Cleaner separation of concerns
- Easier to test and maintain
- Server logic centralized in reducers

### Redux Thunk Function Signature

```js
// Thunk action creator pattern
export const asyncActionCreator = (param) => {
  return async (dispatch, getState) => {
    // Async operations
    const data = await someAsyncOperation()
    
    // Access current state if needed
    const currentState = getState()
    
    // Dispatch actions
    dispatch(someAction(data))
  }
}
```

**Parameters:**
- `dispatch` - function to dispatch actions
- `getState` - function to get current state (optional)

## Complete File Structure

```
src/
  ├── main.jsx                    # App entry point
  ├── App.jsx                     # Root component (dispatches initializeNotes)
  ├── store.js                    # Store configuration
  ├── services/
  │   └── notes.js               # Fetch API service layer
  ├── reducers/
  │   ├── noteReducer.js         # Notes slice with async actions
  │   └── filterReducer.js       # Filter slice
  └── components/
      ├── NoteForm.jsx           # Form (dispatches appendNote)
      ├── Notes.jsx              # Notes list
      └── VisibilityFilter.jsx   # Filter radio buttons
```

## Fetch API vs Axios Comparison

| Feature | Fetch API | Axios |
|---------|-----------|-------|
| Installation | Native (no install) | `npm install axios` |
| Bundle Size | 0 KB | ~13 KB + dependencies |
| Error Handling | Manual (`response.ok`) | Automatic (throws on 4xx/5xx) |
| JSON Parsing | Manual (`response.json()`) | Automatic |
| Request Body | Manual (`JSON.stringify()`) | Automatic |
| Interceptors | Not available | Available |
| Timeout | Manual (AbortController) | Built-in |
| Request Cancellation | AbortController | Built-in |

## Best Practices

1. **Use Fetch API for simple projects** - Less dependencies, native support
2. **Use Axios for complex projects** - Better error handling, interceptors
3. **Abstract server communication** - Use async action creators (Redux Thunk)
4. **Keep components simple** - Components should only dispatch actions
5. **Handle errors properly** - Check `response.ok`, throw errors
6. **Use TypeScript** - Better type safety for API responses

## Redux Toolkit Async Tools

Redux Toolkit provides additional tools for async operations:

1. **createAsyncThunk** - Simplified async action creators
2. **RTK Query** - Data fetching and caching solution
3. **Redux Thunk** - Built-in (what we're using)

For complex applications, consider `createAsyncThunk` or `RTK Query` instead of manual thunks.

## Exercises

### 6.14: Anecdotes and the Backend, step 1
- Fetch anecdotes from json-server on app launch
- Use Fetch API for HTTP requests
- Initialize Redux store with server data

### 6.15: Anecdotes and the Backend, step 2
- Modify anecdote creation to save to backend
- Use Fetch API for POST requests
- Update reducer to use server-returned data

### 6.16: Anecdotes and the Backend, step 3
- Use Redux Thunk for async actions
- Create `initializeAnecdotes` async action creator
- Move server communication out of components

### 6.17: Anecdotes and the Backend, step 4
- Create `appendAnecdote` async action creator
- Move anecdote creation logic to reducer
- Update component to use async action

### 6.18: Anecdotes and the Backend, step 5
- Implement voting that saves to backend
- Create `updateAnecdote` service method
- Create async action creator for voting
- Use PUT/PATCH request to update backend

### 6.19: Anecdotes and the Backend, step 6
- Improve notification action creator
- Accept message and timeout as parameters
- Automatically clear notification after timeout
- Replace manual `setTimeout` calls
