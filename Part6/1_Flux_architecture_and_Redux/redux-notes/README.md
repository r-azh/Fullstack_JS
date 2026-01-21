# Redux Notes Application

A simple notes application demonstrating Redux state management with React.

## Features

- Add new notes
- Toggle note importance
- State managed with Redux
- Component separation (presentational vs container)
- Reducer tests with deep-freeze

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Run tests:
```bash
npm test
```

## Project Structure

```
src/
  ├── main.jsx                    # Store setup with Provider
  ├── App.jsx                     # Root component
  ├── reducers/
  │   ├── noteReducer.js         # Reducer and action creators
  │   └── noteReducer.test.js    # Reducer tests
  └── components/
      ├── NoteForm.jsx           # Form component (container)
      └── Notes.jsx              # Notes list (container + presentational)
```

## Key Concepts Demonstrated

1. **Redux Store**: Single source of truth for application state
2. **Actions**: Objects describing state changes
3. **Reducers**: Pure functions that return new state
4. **Action Creators**: Functions that create actions
5. **React-Redux**: Hooks for connecting React to Redux
   - `useSelector`: Access Redux state
   - `useDispatch`: Dispatch actions
6. **Provider**: Makes store available to all components
7. **Immutability**: State updates create new objects/arrays
8. **Pure Functions**: Reducers have no side effects

## Redux Flow

1. User interaction triggers action
2. Action dispatched via `dispatch(action)`
3. Reducer receives action and current state
4. Reducer returns new state
5. Store updates
6. Components using `useSelector` re-render automatically

## Testing

Tests use `deep-freeze` to ensure reducers are immutable:

```bash
npm test
```

Tests verify:
- Reducers return new state (not mutated)
- Actions transform state correctly
- Default state handling
