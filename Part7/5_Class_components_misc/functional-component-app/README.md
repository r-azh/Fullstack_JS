# Functional Component Example

An anecdote application implemented using React functional components with hooks (modern approach).

## Features

- Functional component syntax
- State management with `useState`
- Side effects with `useEffect`
- Modern React patterns

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

1. **Functional Components**: Modern way to create React components
2. **useState**: Hook for state management
3. **useEffect**: Hook for side effects
4. **Hooks**: Reusable stateful logic
5. **No `this`**: Simpler syntax

## Functional Component Structure

```js
const App = () => {
  const [state, setState] = useState(initialValue)

  useEffect(() => {
    // Side effects
  }, [])

  const handleClick = () => {
    setState(newValue)
  }

  return <div>...</div>
}
```

## Comparison

This app demonstrates functional components. See `class-component-app` for the legacy class-based equivalent.
