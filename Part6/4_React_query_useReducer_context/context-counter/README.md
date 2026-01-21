# Context API Counter Application

A counter application demonstrating React's Context API for sharing state across components.

## Features

- Increment counter
- Decrement counter
- Reset counter to zero
- State management with useReducer
- State sharing with Context API
- No prop drilling

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

## Key Concepts

1. **Context API**: React's built-in state sharing mechanism
2. **createContext**: Creates a context object
3. **Provider**: Provides context value to children
4. **useContext**: Hook to access context value
5. **Context + useReducer**: Powerful state management pattern

## Project Structure

```
src/
  ├── main.jsx                    # App entry with ContextProvider
  ├── App.jsx                     # Main component (no state)
  ├── CounterContext.jsx          # Context definition and provider
  └── components/
      ├── Display.jsx            # Accesses context with useContext
      └── Button.jsx             # Accesses context with useContext
```

## Context API Benefits

- Avoids prop drilling
- Clean component code
- Centralized state management
- Easy to share state across components
- Works well with useReducer

## Context vs Props

**Context:**
- Share state across many components
- Avoid prop drilling
- Global-like state
- More setup required

**Props:**
- Explicit data flow
- Easier to trace
- Better for simple cases
- Can lead to prop drilling
