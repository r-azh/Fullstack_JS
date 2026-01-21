# React Query, useReducer and the Context - Summary

This section covers alternative state management solutions: React Query for server state, useReducer for local state, and Context API for sharing state across components.

## React Query (TanStack Query)

React Query is a library for managing server state and asynchronous operations. It acts as a cache for server data and simplifies data fetching.

### Installation

```bash
npm install @tanstack/react-query
```

### Setup

```js
// src/main.jsx
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
)
```

**Key Points:**
- `QueryClient` - manages queries and mutations
- `QueryClientProvider` - provides query client to entire app
- Wraps entire application

### Fetching Data with useQuery

```js
// src/App.jsx
import { useQuery } from '@tanstack/react-query'
import { getNotes } from './requests'

const App = () => {
  const result = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  if (result.isError) {
    return <div>an error occurred</div>
  }

  const notes = result.data

  return (
    <div>
      {notes.map(note => (
        <li key={note.id}>{note.content}</li>
      ))}
    </div>
  )
}
```

**Key Points:**
- `queryKey` - unique identifier for the query (array)
- `queryFn` - function that fetches data
- `result.isLoading` - query is in progress
- `result.isError` - query failed
- `result.data` - fetched data
- No need for `useState` or `useEffect`

### Query Object Properties

```js
const result = useQuery({
  queryKey: ['notes'],
  queryFn: getNotes
})

// result properties:
// - isLoading: boolean (initial loading)
// - isError: boolean (query failed)
// - isSuccess: boolean (query succeeded)
// - data: any (query result)
// - error: Error (error object if failed)
// - refetch: function (manually refetch)
```

### Service Layer

```js
// src/requests.js
const baseUrl = 'http://localhost:3001/notes'

export const getNotes = async () => {
  const response = await fetch(baseUrl)
  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }
  return await response.json()
}
```

**Benefits:**
- Separates API logic from components
- Reusable functions
- Easier to test

### Mutations with useMutation

Mutations are used for creating, updating, or deleting data.

```js
// src/requests.js
export const createNote = async (newNote) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newNote)
  }

  const response = await fetch(baseUrl, options)

  if (!response.ok) {
    throw new Error('Failed to create note')
  }

  return await response.json()
}
```

```js
// src/App.jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getNotes, createNote } from './requests'

const App = () => {
  const queryClient = useQueryClient()

  const newNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    }
  })

  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    newNoteMutation.mutate({ content, important: true })
  }

  // ...
}
```

**Key Points:**
- `useMutation` - hook for mutations
- `mutationFn` - function that performs mutation
- `mutate` - function to trigger mutation
- `onSuccess` - callback after successful mutation
- `invalidateQueries` - refetches queries after mutation

### Updating Data

```js
// src/requests.js
export const updateNote = async (updatedNote) => {
  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedNote)
  }

  const response = await fetch(`${baseUrl}/${updatedNote.id}`, options)

  if (!response.ok) {
    throw new Error('Failed to update note')
  }

  return await response.json()
}
```

```js
// src/App.jsx
const updateNoteMutation = useMutation({
  mutationFn: updateNote,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['notes'] })
  }
})

const toggleImportance = (note) => {
  updateNoteMutation.mutate({
    ...note,
    important: !note.important
  })
}
```

### Optimistic Updates

Instead of invalidating and refetching, manually update the cache:

```js
const newNoteMutation = useMutation({
  mutationFn: createNote,
  onSuccess: (newNote) => {
    const notes = queryClient.getQueryData(['notes'])
    queryClient.setQueryData(['notes'], notes.concat(newNote))
  }
})
```

**Benefits:**
- No extra GET request after mutation
- Faster UI updates
- Better performance

**Trade-offs:**
- More complex code
- Must handle errors manually
- Risk of cache inconsistency

### Query Configuration

```js
const result = useQuery({
  queryKey: ['notes'],
  queryFn: getNotes,
  refetchOnWindowFocus: false,  // Don't refetch on window focus
  retry: false,                 // Don't retry on failure
  retry: 1,                     // Retry once on failure
  staleTime: 5000,              // Data is fresh for 5 seconds
  cacheTime: 10000              // Cache data for 10 seconds
})
```

**Common Options:**
- `refetchOnWindowFocus` - refetch when window gains focus
- `retry` - number of retries on failure
- `staleTime` - how long data is considered fresh
- `cacheTime` - how long unused data stays in cache

### Error Handling

```js
const result = useQuery({
  queryKey: ['notes'],
  queryFn: getNotes,
  retry: false
})

if (result.isError) {
  return <div>Error: {result.error.message}</div>
}
```

**Mutation Error Handling:**

```js
const newNoteMutation = useMutation({
  mutationFn: createNote,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['notes'] })
  },
  onError: (error) => {
    console.error('Failed to create note:', error)
  }
})
```

### React Query vs Redux

**React Query:**
- Server-state library
- Manages asynchronous operations
- Acts as cache for server data
- Simplifies data fetching

**Redux:**
- Client-state library
- Manages application state
- Can store server data (but inefficient)
- More complex setup

**Use Together:**
- React Query for server state
- Redux for client state (forms, UI state)
- Both can coexist in same application

## useReducer Hook

`useReducer` is React's built-in hook for managing complex state, similar to Redux reducers.

### Basic Counter Example

```js
// src/App.jsx
import { useReducer } from 'react'

const counterReducer = (state, action) => {
  switch (action.type) {
    case 'INC':
      return state + 1
    case 'DEC':
      return state - 1
    case 'ZERO':
      return 0
    default:
      return state
  }
}

const App = () => {
  const [counter, counterDispatch] = useReducer(counterReducer, 0)

  return (
    <div>
      <div>{counter}</div>
      <div>
        <button onClick={() => counterDispatch({ type: 'INC' })}>+</button>
        <button onClick={() => counterDispatch({ type: 'DEC' })}>-</button>
        <button onClick={() => counterDispatch({ type: 'ZERO' })}>0</button>
      </div>
    </div>
  )
}

export default App
```

**Key Points:**
- `useReducer(reducer, initialState)` - creates state and dispatch
- `reducer(state, action)` - pure function that returns new state
- `dispatch(action)` - function to trigger state changes
- Similar to Redux pattern

### Reducer Function

```js
const counterReducer = (state, action) => {
  switch (action.type) {
    case 'INC':
      return state + 1
    case 'DEC':
      return state - 1
    case 'ZERO':
      return 0
    default:
      return state
  }
}
```

**Rules:**
- Must be pure function
- No side effects
- Returns new state (immutable)
- Handles all action types

### Actions with Payload

```js
const counterReducer = (state, action) => {
  switch (action.type) {
    case 'INC':
      return state + 1
    case 'SET_VALUE':
      return action.payload  // Use payload
    default:
      return state
  }
}

// Usage:
counterDispatch({ type: 'SET_VALUE', payload: 10 })
```

### Complex State

```js
const noteReducer = (state, action) => {
  switch (action.type) {
    case 'SET_NOTES':
      return action.payload
    case 'ADD_NOTE':
      return [...state, action.payload]
    case 'TOGGLE_IMPORTANCE':
      return state.map(note =>
        note.id === action.payload
          ? { ...note, important: !note.important }
          : note
      )
    default:
      return state
  }
}

const [notes, notesDispatch] = useReducer(noteReducer, [])
```

### Passing State via Props

```js
// src/components/Display.jsx
const Display = ({ counter }) => {
  return <div>{counter}</div>
}

export default Display
```

```js
// src/components/Button.jsx
const Button = ({ dispatch, type, label }) => {
  return (
    <button onClick={() => dispatch({ type })}>
      {label}
    </button>
  )
}

export default Button
```

```js
// src/App.jsx
const App = () => {
  const [counter, counterDispatch] = useReducer(counterReducer, 0)

  return (
    <div>
      <Display counter={counter} />
      <div>
        <Button dispatch={counterDispatch} type="INC" label="+" />
        <Button dispatch={counterDispatch} type="DEC" label="-" />
        <Button dispatch={counterDispatch} type="ZERO" label="0" />
      </div>
    </div>
  )
}
```

**Problem: Prop Drilling**
- Must pass state and dispatch through multiple components
- Components in between may not need the state
- Makes code harder to maintain

## Context API

React's Context API provides a way to share state across components without prop drilling.

### Creating Context

```js
// src/CounterContext.jsx
import { createContext } from 'react'

const CounterContext = createContext()

export default CounterContext
```

### Providing Context

```js
// src/App.jsx
import { useReducer } from 'react'
import CounterContext from './CounterContext'
import Button from './components/Button'
import Display from './components/Display'

const App = () => {
  const [counter, counterDispatch] = useReducer(counterReducer, 0)

  return (
    <CounterContext.Provider value={{ counter, counterDispatch }}>
      <Display />
      <div>
        <Button type="INC" label="+" />
        <Button type="DEC" label="-" />
        <Button type="ZERO" label="0" />
      </div>
    </CounterContext.Provider>
  )
}
```

**Key Points:**
- `Provider` - wraps components that need context
- `value` - object with context data
- All children can access context

### Consuming Context

```js
// src/components/Display.jsx
import { useContext } from 'react'
import CounterContext from '../CounterContext'

const Display = () => {
  const { counter } = useContext(CounterContext)
  return <div>{counter}</div>
}

export default Display
```

```js
// src/components/Button.jsx
import { useContext } from 'react'
import CounterContext from '../CounterContext'

const Button = ({ type, label }) => {
  const { counterDispatch } = useContext(CounterContext)
  return (
    <button onClick={() => counterDispatch({ type })}>
      {label}
    </button>
  )
}

export default Button
```

**Key Points:**
- `useContext(Context)` - hook to access context
- Destructure needed values
- No props needed

### Context Provider Component

Better organization: move reducer logic to context file.

```js
// src/CounterContext.jsx
import { createContext, useReducer } from 'react'

const counterReducer = (state, action) => {
  switch (action.type) {
    case 'INC':
      return state + 1
    case 'DEC':
      return state - 1
    case 'ZERO':
      return 0
    default:
      return state
  }
}

const CounterContext = createContext()

export const CounterContextProvider = (props) => {
  const [counter, counterDispatch] = useReducer(counterReducer, 0)

  return (
    <CounterContext.Provider value={{ counter, counterDispatch }}>
      {props.children}
    </CounterContext.Provider>
  )
}

export default CounterContext
```

```js
// src/main.jsx
import { createRoot } from 'react-dom/client'
import App from './App'
import { CounterContextProvider } from './CounterContext'

createRoot(document.getElementById('root')).render(
  <CounterContextProvider>
    <App />
  </CounterContextProvider>
)
```

```js
// src/App.jsx
import Button from './components/Button'
import Display from './components/Display'

const App = () => {
  return (
    <div>
      <Display />
      <div>
        <Button type="INC" label="+" />
        <Button type="DEC" label="-" />
        <Button type="ZERO" label="0" />
      </div>
    </div>
  )
}

export default App
```

**Benefits:**
- State management isolated in one file
- Cleaner component code
- Easy to reuse context
- No prop drilling

## Complete Examples

### React Query Notes App

```js
// src/requests.js
const baseUrl = 'http://localhost:3001/notes'

export const getNotes = async () => {
  const response = await fetch(baseUrl)
  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }
  return await response.json()
}

export const createNote = async (newNote) => {
  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newNote)
  }
  const response = await fetch(baseUrl, options)
  if (!response.ok) {
    throw new Error('Failed to create note')
  }
  return await response.json()
}

export const updateNote = async (updatedNote) => {
  const options = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedNote)
  }
  const response = await fetch(`${baseUrl}/${updatedNote.id}`, options)
  if (!response.ok) {
    throw new Error('Failed to update note')
  }
  return await response.json()
}
```

```js
// src/App.jsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getNotes, createNote, updateNote } from './requests'

const App = () => {
  const queryClient = useQueryClient()

  const result = useQuery({
    queryKey: ['notes'],
    queryFn: getNotes
  })

  const newNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    }
  })

  const updateNoteMutation = useMutation({
    mutationFn: updateNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    }
  })

  if (result.isLoading) {
    return <div>loading data...</div>
  }

  const notes = result.data

  const addNote = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    newNoteMutation.mutate({ content, important: true })
  }

  const toggleImportance = (note) => {
    updateNoteMutation.mutate({
      ...note,
      important: !note.important
    })
  }

  return (
    <div>
      <h2>Notes app</h2>
      <form onSubmit={addNote}>
        <input name="note" />
        <button type="submit">add</button>
      </form>
      {notes.map((note) => (
        <li key={note.id} onClick={() => toggleImportance(note)}>
          {note.content}
          <strong> {note.important ? 'important' : ''}</strong>
        </li>
      ))}
    </div>
  )
}

export default App
```

## When to Use What?

### useState
- Simple local component state
- Form inputs
- UI toggles
- Small applications

### useReducer
- Complex state logic
- Multiple related state values
- State updates depend on previous state
- Redux-like pattern without Redux

### Context API
- Sharing state across many components
- Avoiding prop drilling
- Theme, authentication, user preferences
- Combined with useReducer

### React Query
- Server state management
- Data fetching and caching
- Synchronizing with server
- Replaces useState + useEffect for API calls

### Redux
- Large applications
- Complex state management
- Time-travel debugging
- Predictable state updates
- When Context + useReducer isn't enough

## Best Practices

1. **Start Simple**: Use `useState` for simple state
2. **Server State**: Use React Query for API calls
3. **Complex State**: Use `useReducer` for complex logic
4. **Shared State**: Use Context API to avoid prop drilling
5. **Combine Solutions**: Use multiple approaches together
6. **Don't Over-Engineer**: Choose simplest solution that works

## Exercises

### 6.20: Anecdotes and React Query, step 1
- Implement retrieving anecdotes using React Query
- Display error page if server communication fails
- Handle loading and error states
- Configure retry behavior

### 6.21: Anecdotes and React Query, step 2
- Implement adding new anecdotes using React Query
- Use mutations for POST requests
- Invalidate queries after successful mutation
- Note: Server requires content >= 5 characters

### 6.22: Anecdotes and React Query, step 3
- Implement voting using React Query
- Use mutations for PUT requests
- Automatically update vote count
- Invalidate queries after voting

### 6.23: Anecdotes and Context, step 1
- Implement notification state with useReducer
- Create NotificationContext
- Display notifications for 5 seconds
- Show notification when creating or voting

### 6.24: Anecdotes and Context, step 2
- Add error handling for POST requests
- Display error notification if content < 5 characters
- Handle mutation errors in onError callback
- Show user-friendly error messages
