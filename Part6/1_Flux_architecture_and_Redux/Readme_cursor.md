# Flux Architecture and Redux - Summary

This section introduces Flux architecture and Redux for managing application state in React applications.

## Flux Architecture

### What is Flux?

Flux is an architecture pattern developed by Facebook to make state management of React apps easier.

**Key Concepts:**
- State is separated from React components into **stores**
- State is not changed directly, but with **actions**
- When action changes store state, views are re-rendered

**Flow:**
1. Action → Dispatcher → Store → View
2. User interaction triggers action
3. Action updates store
4. Store change triggers view re-render

## Redux

Redux is a library that implements Flux principles but is simpler. Facebook now uses Redux instead of their original Flux.

### Core Concepts

1. **Store**: Single JavaScript object containing entire application state
2. **Actions**: Objects with at least a `type` field (and optional `payload`)
3. **Reducers**: Pure functions that return new state based on current state and action

### Basic Counter Example

#### Installing Redux

```bash
npm install redux
```

#### Creating a Reducer

```js
// src/reducers/counterReducer.js
const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return state + 1
    case 'DECREMENT':
      return state - 1
    case 'ZERO':
      return 0
    default:
      return state
  }
}

export default counterReducer
```

**Key Points:**
- Default parameter `state = 0` handles initial state
- Switch statement is common pattern for reducers
- Always return state in default case
- Reducer must be a pure function

#### Creating the Store

```js
// src/main.jsx
import { createStore } from 'redux'
import counterReducer from './reducers/counterReducer'

const store = createStore(counterReducer)
```

**Note:** `createStore` is deprecated but still works. We'll use `configureStore` from Redux Toolkit later.

#### Store Methods

**dispatch**: Send actions to store
```js
store.dispatch({ type: 'INCREMENT' })
```

**getState**: Get current state
```js
console.log(store.getState()) // 0
```

**subscribe**: Listen for state changes
```js
store.subscribe(() => {
  const storeNow = store.getState()
  console.log(storeNow)
})
```

#### Basic Counter App

```js
// src/main.jsx
import ReactDOM from 'react-dom/client'
import { createStore } from 'redux'
import counterReducer from './reducers/counterReducer'

const store = createStore(counterReducer)

const App = () => {
  return (
    <div>
      <div>{store.getState()}</div>
      <button onClick={() => store.dispatch({ type: 'INCREMENT' })}>
        plus
      </button>
      <button onClick={() => store.dispatch({ type: 'DECREMENT' })}>
        minus
      </button>
      <button onClick={() => store.dispatch({ type: 'ZERO' })}>
        zero
      </button>
    </div>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'))

const renderApp = () => {
  root.render(<App />)
}

renderApp()
store.subscribe(renderApp)
```

**Important:** React doesn't automatically re-render when Redux state changes, so we subscribe to store changes and re-render manually.

## Redux Notes Application

### Initial Reducer

```js
// src/reducers/noteReducer.js
const noteReducer = (state = [], action) => {
  switch (action.type) {
    case 'NEW_NOTE':
      return state.concat(action.payload)
    default:
      return state
  }
}

export default noteReducer
```

**Action Structure:**
```js
{
  type: 'NEW_NOTE',
  payload: {
    content: 'state changes are made with actions',
    important: false,
    id: 2
  }
}
```

### Pure Functions and Immutability

**Problem:** Mutating state directly
```js
// ❌ BAD - Mutates state
case 'NEW_NOTE':
  state.push(action.payload)
  return state
```

**Solution:** Return new state
```js
// ✅ GOOD - Returns new array
case 'NEW_NOTE':
  return state.concat(action.payload)
  // Or using spread syntax:
  return [...state, action.payload]
```

**Key Rules:**
- Reducers must be pure functions (no side effects)
- State must be immutable (create new objects/arrays)
- Same input always produces same output

### Array Spread Syntax

```js
// Creating new array with spread
const numbers = [1, 2, 3]
[...numbers, 4, 5]  // [1, 2, 3, 4, 5]
[numbers, 4, 5]   // [[1, 2, 3], 4, 5] - wrong!

// Using in reducer
case 'NEW_NOTE':
  return [...state, action.payload]
```

**Destructuring with rest:**
```js
const numbers = [1, 2, 3, 4, 5, 6]
const [first, second, ...rest] = numbers
// first = 1, second = 2, rest = [3, 4, 5, 6]
```

### Toggle Importance Action

```js
// src/reducers/noteReducer.js
const noteReducer = (state = [], action) => {
  switch(action.type) {
    case 'NEW_NOTE':
      return [...state, action.payload]
    case 'TOGGLE_IMPORTANCE': {
      const id = action.payload.id
      const noteToChange = state.find(n => n.id === id)
      const changedNote = {
        ...noteToChange,
        important: !noteToChange.important
      }
      return state.map(note => 
        note.id !== id ? note : changedNote
      )
    }
    default:
      return state
  }
}
```

**Action:**
```js
{
  type: 'TOGGLE_IMPORTANCE',
  payload: {
    id: 2
  }
}
```

## Testing Reducers

### Setting Up Tests

Install testing dependencies:

```bash
npm install --save-dev vitest deep-freeze
```

Add test script to `package.json`:

```json
// package.json
{
  "scripts": {
    "test": "vitest"
  }
}
```

### Writing Tests

```js
// src/reducers/noteReducer.test.js
import deepFreeze from 'deep-freeze'
import { describe, expect, test } from 'vitest'
import noteReducer from './noteReducer'

describe('noteReducer', () => {
  test('returns new state with action NEW_NOTE', () => {
    const state = []
    const action = {
      type: 'NEW_NOTE',
      payload: {
        content: 'the app state is in redux store',
        important: true,
        id: 1
      }
    }

    deepFreeze(state)
    const newState = noteReducer(state, action)

    expect(newState).toHaveLength(1)
    expect(newState).toContainEqual(action.payload)
  })

  test('returns new state with action TOGGLE_IMPORTANCE', () => {
    const state = [
      {
        content: 'the app state is in redux store',
        important: true,
        id: 1
      },
      {
        content: 'state changes are made with actions',
        important: false,
        id: 2
      }
    ]

    const action = {
      type: 'TOGGLE_IMPORTANCE',
      payload: {
        id: 2
      }
    }

    deepFreeze(state)
    const newState = noteReducer(state, action)

    expect(newState).toHaveLength(2)
    expect(newState).toContainEqual(state[0])
    expect(newState).toContainEqual({
      content: 'state changes are made with actions',
      important: true,
      id: 2
    })
  })
})
```

**Key Points:**
- `deepFreeze` ensures reducer doesn't mutate state
- Tests verify immutability
- Tests verify correct state transformations

## Uncontrolled Forms

### Adding Notes with Uncontrolled Form

```js
// src/App.jsx
const generateId = () => Number((Math.random() * 1000000).toFixed(0))

const App = () => {
  const addNote = event => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    store.dispatch({
      type: 'NEW_NOTE',
      payload: {
        content,
        important: false,
        id: generateId()
      }
    })
  }

  const toggleImportance = id => {
    store.dispatch({
      type: 'TOGGLE_IMPORTANCE',
      payload: { id }
    })
  }

  return (
    <div>
      <form onSubmit={addNote}>
        <input name="note" />
        <button type="submit">add</button>
      </form>
      <ul>
        {store.getState().map(note => (
          <li key={note.id} onClick={() => toggleImportance(note.id)}>
            {note.content} <strong>{note.important ? 'important' : ''}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

**Key Points:**
- Form fields not bound to component state
- Access values via `event.target.fieldName.value`
- Input must have `name` attribute
- Simpler for basic forms, but limited (no dynamic validation, etc.)

## Action Creators

Separate action creation into functions:

```js
// src/reducers/noteReducer.js
const generateId = () => Number((Math.random() * 1000000).toFixed(0))

export const createNote = content => {
  return {
    type: 'NEW_NOTE',
    payload: {
      content,
      important: false,
      id: generateId()
    }
  }
}

export const toggleImportanceOf = id => {
  return {
    type: 'TOGGLE_IMPORTANCE',
    payload: { id }
  }
}
```

**Benefits:**
- Components don't need to know action structure
- Easier to maintain
- Can add logic to action creators

**Usage:**
```js
// src/App.jsx
import { createNote, toggleImportanceOf } from './reducers/noteReducer'

const App = () => {
  const addNote = event => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    store.dispatch(createNote(content))
  }

  const toggleImportance = id => {
    store.dispatch(toggleImportanceOf(id))
  }
  // ...
}
```

## React-Redux

### Installing React-Redux

```bash
npm install react-redux
```

### Provider Component

Wrap app with Provider to make store available to all components:

```js
// src/main.jsx
import ReactDOM from 'react-dom/client'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './App'
import noteReducer from './reducers/noteReducer'

const store = createStore(noteReducer)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

### useSelector Hook

Access Redux state in components:

```js
// src/App.jsx
import { useSelector } from 'react-redux'

const App = () => {
  const notes = useSelector(state => state)
  // ...
}
```

**Selecting specific data:**
```js
// Get all notes
const notes = useSelector(state => state)

// Get only important notes
const importantNotes = useSelector(state => 
  state.filter(note => note.important)
)
```

### useDispatch Hook

Dispatch actions from components:

```js
// src/App.jsx
import { useSelector, useDispatch } from 'react-redux'
import { createNote, toggleImportanceOf } from './reducers/noteReducer'

const App = () => {
  const dispatch = useDispatch()
  const notes = useSelector(state => state)

  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    dispatch(createNote(content))
  }

  const toggleImportance = (id) => {
    dispatch(toggleImportanceOf(id))
  }
  // ...
}
```

**Key Changes:**
- No need for `store.subscribe()` - React-Redux handles re-renders
- Use `useDispatch()` instead of `store.dispatch()`
- Use `useSelector()` instead of `store.getState()`

## Component Structure

### Separating Components

**NoteForm Component:**
```js
// src/components/NoteForm.jsx
import { useDispatch } from 'react-redux'
import { createNote } from '../reducers/noteReducer'

const NoteForm = () => {
  const dispatch = useDispatch()

  const addNote = (event) => {
    event.preventDefault()
    const content = event.target.note.value
    event.target.note.value = ''
    dispatch(createNote(content))
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

**Notes Component:**
```js
// src/components/Notes.jsx
import { useDispatch, useSelector } from 'react-redux'
import { toggleImportanceOf } from '../reducers/noteReducer'

const Note = ({ note, handleClick }) => {
  return (
    <li onClick={handleClick}>
      {note.content}
      <strong> {note.important ? 'important' : ''}</strong>
    </li>
  )
}

const Notes = () => {
  const dispatch = useDispatch()
  const notes = useSelector(state => state)

  return (
    <ul>
      {notes.map(note => (
        <Note
          key={note.id}
          note={note}
          handleClick={() => dispatch(toggleImportanceOf(note.id))}
        />
      ))}
    </ul>
  )
}

export default Notes
```

**App Component:**
```js
// src/App.jsx
import NoteForm from './components/NoteForm'
import Notes from './components/Notes'

const App = () => {
  return (
    <div>
      <NoteForm />
      <Notes />
    </div>
  )
}

export default App
```

### Component Types

**Presentational Components:**
- Don't know about Redux
- Receive data and callbacks via props
- Example: `Note` component

**Container Components:**
- Know about Redux
- Use `useDispatch` and `useSelector`
- Define event handlers
- Example: `Notes` component

## Complete File Structure

```
src/
  ├── main.jsx                    # Store setup and Provider
  ├── App.jsx                     # Root component
  ├── reducers/
  │   ├── noteReducer.js         # Reducer and action creators
  │   └── noteReducer.test.js    # Reducer tests
  └── components/
      ├── NoteForm.jsx           # Form component
      └── Notes.jsx              # Notes list component
```

## Key Redux Principles

1. **Single Source of Truth**: Entire app state in one store
2. **State is Read-Only**: Only changed through actions
3. **Changes are Made with Pure Functions**: Reducers are pure functions
4. **Immutable Updates**: Always return new state, never mutate

## Benefits of Redux

1. **Predictable State Management**: All state changes follow same pattern
2. **Time-Travel Debugging**: Can replay actions
3. **Centralized State**: Easy to see entire app state
4. **Testable**: Reducers are pure functions, easy to test
5. **Scalable**: Works well for large applications

## Exercises

### 6.1: Unicafe Revisited, step 1
- Implement reducer for feedback counter
- State shape: `{ good: 5, ok: 4, bad: 2 }`
- Actions: `GOOD`, `OK`, `BAD`, `RESET`
- Write tests using deep-freeze
- Ensure reducer is immutable

### 6.2: Unicafe Revisited, step 2
- Implement UI for feedback application
- Buttons for good, ok, bad
- Display counts for each type
- Reset button

### 6.3: Anecdotes, step 1
- Implement voting functionality
- Votes saved to Redux store
- Clone redux-anecdotes repository

### 6.4: Anecdotes, step 2
- Implement adding new anecdotes
- Use uncontrolled form

### 6.5: Anecdotes, step 3
- Order anecdotes by number of votes
- Most votes first

### 6.6: Anecdotes, step 4
- Separate action creators into functions
- Place in `src/reducers/anecdoteReducer.js`

### 6.7: Anecdotes, step 5
- Separate new anecdote creation into `AnecdoteForm` component
- Move all creation logic to this component

### 6.8: Anecdotes, step 6
- Separate anecdote list into `AnecdoteList` component
- Move voting logic to this component
- App should only render `AnecdoteForm` and `AnecdoteList`
