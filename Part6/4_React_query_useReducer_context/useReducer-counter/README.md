# useReducer Counter Application

A simple counter application demonstrating React's `useReducer` hook for state management.

## Features

- Increment counter
- Decrement counter
- Reset counter to zero
- State management with useReducer
- Component composition with props

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

1. **useReducer**: Hook for managing complex state
2. **Reducer Function**: Pure function that returns new state
3. **Actions**: Objects describing state changes
4. **Dispatch**: Function to trigger state changes
5. **Prop Drilling**: Passing state through multiple components

## Project Structure

```
src/
  ├── main.jsx                    # App entry point
  ├── App.jsx                     # Main component with useReducer
  └── components/
      ├── Display.jsx            # Displays counter value
      └── Button.jsx             # Button component
```

## useReducer vs useState

**useReducer:**
- Better for complex state logic
- Multiple related state values
- State updates depend on previous state
- Redux-like pattern

**useState:**
- Simpler for basic state
- Single state values
- Direct state updates
