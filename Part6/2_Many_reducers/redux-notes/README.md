# Redux Notes Application with Multiple Reducers

A notes application demonstrating Redux with multiple reducers, filtering, and Redux Toolkit.

## Features

- Add new notes
- Toggle note importance
- Filter notes (all, important, nonimportant)
- State managed with Redux Toolkit
- Multiple reducers combined
- Redux DevTools integration

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
  ├── main.jsx                    # App entry point
  ├── App.jsx                     # Root component
  ├── store.js                    # Store configuration (Redux Toolkit)
  ├── reducers/
  │   ├── noteReducer.js         # Notes slice (createSlice)
  │   ├── noteReducer.test.js    # Tests
  │   └── filterReducer.js       # Filter slice (createSlice)
  └── components/
      ├── NoteForm.jsx           # Form component
      ├── Notes.jsx              # Notes list with filtering
      └── VisibilityFilter.jsx   # Filter radio buttons
```

## Key Concepts Demonstrated

1. **Multiple Reducers**: Using `combineReducers` or `configureStore` to combine reducers
2. **Complex State**: Store with multiple properties (`notes`, `filter`)
3. **Redux Toolkit**: Using `configureStore` and `createSlice`
4. **Immer**: Safe state mutations with Redux Toolkit
5. **Filtering**: Filtering data in selectors
6. **Redux DevTools**: Automatic integration for debugging

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

## Redux Toolkit Benefits

- Less boilerplate code
- Automatic action creator generation
- Immer integration for safe mutations
- Automatic Redux DevTools setup
- Better TypeScript support

## Redux DevTools

Install the Redux DevTools Chrome extension to:
- Inspect store state
- Time-travel debugging
- Dispatch actions manually
- View action history

No additional configuration needed when using `configureStore`!
