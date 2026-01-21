# Many Reducers - Summary

This section covers combining multiple reducers, creating complex state structures, and using Redux Toolkit to simplify Redux code.

## Store with Complex State

When the application grows, we need to store more than just one type of data. Instead of a simple array, the store can have multiple properties.

### Example: Notes with Filter

Store structure with both notes and filter:

```js
{
  notes: [
    { content: 'reducer defines how redux store works', important: true, id: 1},
    { content: 'state of store can contain any data', important: false, id: 2}
  ],
  filter: 'IMPORTANT'
}
```

## Combined Reducers

Instead of modifying one reducer to handle all state, create separate reducers and combine them.

### Creating Filter Reducer

```js
// src/reducers/filterReducer.js
const filterReducer = (state = 'ALL', action) => {
  switch (action.type) {
    case 'SET_FILTER':
      return action.payload
    default:
      return state
  }
}

export const filterChange = filter => {
  return {
    type: 'SET_FILTER',
    payload: filter
  }
}

export default filterReducer
```

**Action:**
```js
{
  type: 'SET_FILTER',
  payload: 'IMPORTANT'
}
```

### Combining Reducers with combineReducers

```js
// src/main.jsx
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { createStore, combineReducers } from 'redux'

import App from './App'
import filterReducer from './reducers/filterReducer'
import noteReducer from './reducers/noteReducer'

const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer
})

const store = createStore(reducer)

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

**Key Points:**
- `combineReducers` creates a single reducer from multiple reducers
- Each reducer manages its own part of the state
- State shape: `{ notes: [...], filter: 'ALL' }`
- Each reducer receives ALL actions, but typically only one handles each action

### Updating Selectors

When state structure changes, update selectors:

```js
// Before: state was an array
const notes = useSelector(state => state)

// After: state is an object with notes property
const notes = useSelector(state => state.notes)
```

### Filtering Notes

Update Notes component to filter based on store state:

```js
// src/components/Notes.jsx
const Notes = () => {
  const dispatch = useDispatch()
  const notes = useSelector(({ filter, notes }) => {
    if (filter === 'ALL') {
      return notes
    }
    return filter === 'IMPORTANT' 
      ? notes.filter(note => note.important)
      : notes.filter(note => !note.important)
  })

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
```

**Key Points:**
- Destructure state in selector: `({ filter, notes })`
- Filter logic in selector function
- Returns filtered array based on filter value

### VisibilityFilter Component

```js
// src/components/VisibilityFilter.jsx
import { useDispatch } from 'react-redux'
import { filterChange } from '../reducers/filterReducer'

const VisibilityFilter = () => {
  const dispatch = useDispatch()

  return (
    <div>
      <input
        type="radio"
        name="filter"
        onChange={() => dispatch(filterChange('ALL'))}
      />
      all
      <input
        type="radio"
        name="filter"
        onChange={() => dispatch(filterChange('IMPORTANT'))}
      />
      important
      <input
        type="radio"
        name="filter"
        onChange={() => dispatch(filterChange('NONIMPORTANT'))}
      />
      nonimportant
    </div>
  )
}

export default VisibilityFilter
```

**Updated App:**
```js
// src/App.jsx
import NoteForm from './components/NoteForm'
import Notes from './components/Notes'
import VisibilityFilter from './components/VisibilityFilter'

const App = () => {
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

## Redux Toolkit

Redux Toolkit simplifies Redux configuration and reduces boilerplate code.

### Installing Redux Toolkit

```bash
npm install @reduxjs/toolkit
```

### configureStore

Replace `createStore` and `combineReducers` with `configureStore`:

```js
// src/main.jsx (old way)
import { createStore, combineReducers } from 'redux'

const reducer = combineReducers({
  notes: noteReducer,
  filter: filterReducer
})

const store = createStore(reducer)
```

```js
// src/main.jsx (Redux Toolkit way)
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({
  reducer: {
    notes: noteReducer,
    filter: filterReducer
  }
})
```

**Benefits:**
- No need for `combineReducers`
- Automatic Redux DevTools integration
- Better defaults and error handling

### Moving Store to Separate File

```js
// src/store.js
import { configureStore } from '@reduxjs/toolkit'

import noteReducer from './reducers/noteReducer'
import filterReducer from './reducers/filterReducer'

const store = configureStore({
  reducer: {
    notes: noteReducer,
    filter: filterReducer
  }
})

export default store
```

```js
// src/main.jsx
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import store from './store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

## createSlice

`createSlice` automatically generates action creators and action types.

### Refactoring noteReducer with createSlice

```js
// src/reducers/noteReducer.js
import { createSlice } from '@reduxjs/toolkit'

const initialState = [
  {
    content: 'reducer defines how redux store works',
    important: true,
    id: 1,
  },
  {
    content: 'state of store can contain any data',
    important: false,
    id: 2,
  },
]

const generateId = () =>
  Number((Math.random() * 1000000).toFixed(0))

const noteSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    createNote(state, action) {
      const content = action.payload
      state.push({
        content,
        important: false,
        id: generateId(),
      })
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
    }
  },
})

export const { createNote, toggleImportanceOf } = noteSlice.actions
export default noteSlice.reducer
```

**Key Points:**
- `name`: Prefix for action types (e.g., 'notes/createNote')
- `initialState`: Initial state value
- `reducers`: Object with reducer functions
- Action creators automatically generated
- Action types: `notes/createNote`, `notes/toggleImportanceOf`

### Mutating State with Immer

Redux Toolkit uses Immer, allowing "mutations" that are actually immutable:

```js
// This looks like mutation but is actually immutable
createNote(state, action) {
  state.push({
    content: action.payload,
    important: false,
    id: generateId(),
  })
}
```

**How it works:**
- Immer tracks mutations
- Creates new immutable state from mutations
- Can still return new state directly if preferred

### Updating Tests

Action types change when using createSlice:

```js
// src/reducers/noteReducer.test.js
import deepFreeze from 'deep-freeze'
import { describe, expect, test } from 'vitest'
import noteReducer, { createNote, toggleImportanceOf } from './noteReducer'

describe('noteReducer', () => {
  test('returns new state with action notes/createNote', () => {
    const state = []
    const action = {
      type: 'notes/createNote',
      payload: 'the app state is in redux store'
    }

    deepFreeze(state)
    const newState = noteReducer(state, action)

    expect(newState).toHaveLength(1)
    expect(newState.map(note => note.content)).toContainEqual(action.payload)
  })

  test('returns new state with action notes/toggleImportanceOf', () => {
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
      type: 'notes/toggleImportanceOf',
      payload: 2
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

**Changes:**
- Action types: `notes/createNote` instead of `NEW_NOTE`
- Payload: Direct value instead of object with payload property
- Can import action creators directly

### Refactoring filterReducer with createSlice

```js
// src/reducers/filterReducer.js
import { createSlice } from '@reduxjs/toolkit'

const filterSlice = createSlice({
  name: 'filter',
  initialState: 'ALL',
  reducers: {
    filterChange(state, action) {
      return action.payload
    }
  },
})

export const { filterChange } = filterSlice.actions
export default filterSlice.reducer
```

## Redux Toolkit and console.log

When using createSlice, state is wrapped by Immer. Use `current` to log readable state:

```js
// src/reducers/noteReducer.js
import { createSlice, current } from '@reduxjs/toolkit'

const noteSlice = createSlice({
  // ...
  reducers: {
    toggleImportanceOf(state, action) {
      // ...
      console.log(current(state))  // Human-readable state
      return state.map(note =>
        note.id !== id ? note : changedNote
      )
    }
  },
})
```

## Redux DevTools

Redux DevTools is a Chrome extension for debugging Redux applications.

### Features

- Inspect Redux store state
- Time-travel debugging
- Dispatch actions manually
- View action history

### Setup

No additional configuration needed when using `configureStore` - it's automatically enabled.

### Usage

1. Install Redux DevTools Chrome extension
2. Open browser DevTools
3. Click "Redux" tab
4. Inspect state, actions, and dispatch new actions

## Benefits of Redux Toolkit

1. **Less Boilerplate**: No need for action type constants
2. **Automatic Action Creators**: Generated from reducer functions
3. **Immer Integration**: Can "mutate" state safely
4. **Better DevTools**: Automatic integration
5. **Better Defaults**: Sensible defaults for common use cases
6. **Type Safety**: Better TypeScript support

## Complete File Structure

```
src/
  ├── main.jsx                    # App entry point
  ├── App.jsx                     # Root component
  ├── store.js                    # Store configuration
  ├── reducers/
  │   ├── noteReducer.js         # Notes slice (createSlice)
  │   ├── noteReducer.test.js    # Tests
  │   ├── filterReducer.js       # Filter slice (createSlice)
  │   └── filterReducer.test.js  # Tests
  └── components/
      ├── NoteForm.jsx           # Form component
      ├── Notes.jsx              # Notes list with filtering
      └── VisibilityFilter.jsx   # Filter radio buttons
```

## Exercises

### 6.9: Anecdotes, step 7
- Implement filtering for anecdotes
- Store filter state in Redux store
- Create new reducer, action creators, and combined reducer
- Create Filter component with input field
- Filter anecdotes based on input

### 6.10: Anecdotes, step 8
- Install Redux Toolkit
- Move store creation to `store.js`
- Use `configureStore` instead of `createStore`
- Change filter reducer to use `createSlice`
- Start using Redux DevTools

### 6.11: Anecdotes, step 9
- Change anecdote reducer to use `createSlice`
- Update action creators
- Update tests if needed

### 6.12: Anecdotes, step 10
- Extend Notification component to render message from Redux store
- Create notificationReducer using `createSlice`
- Store initial message in reducer
- Component doesn't need to be smart yet, just display initial value

### 6.13: Anecdotes, step 11
- Use Notification component to display message for 5 seconds
- Show message when voting for anecdote
- Show message when creating new anecdote
- Create action creators for setting and removing notifications
- Use setTimeout to remove notification after 5 seconds
