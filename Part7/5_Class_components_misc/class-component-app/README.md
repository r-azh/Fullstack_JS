# Class Component Example

An anecdote application implemented using React class components (legacy approach).

## Features

- Class component syntax
- State management with `this.state`
- Lifecycle method `componentDidMount`
- State updates with `setState`
- Event handlers with arrow functions

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

1. **Class Components**: Legacy way to create React components
2. **State**: Single `this.state` object
3. **setState**: Method to update state
4. **Lifecycle Methods**: `componentDidMount` for side effects
5. **Arrow Functions**: Bind `this` in event handlers

## Class Component Structure

```js
class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = { ... }
  }

  componentDidMount = () => {
    // Side effects
  }

  handleClick = () => {
    this.setState({ ... })
  }

  render() {
    return <div>...</div>
  }
}
```

## Comparison

This app demonstrates class components. See `functional-component-app` for the modern hooks-based equivalent.
