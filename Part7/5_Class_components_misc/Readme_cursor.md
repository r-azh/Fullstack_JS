# Class Components, Miscellaneous - Summary

This section covers React class components (legacy) and miscellaneous topics including code organization, security, and current trends.

## Class Components

Class components were the original way to create stateful React components before hooks were introduced in React 16.8.

### Basic Class Component

```js
// src/App.js
import React from 'react'

class App extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div>
        <h1>anecdote of the day</h1>
      </div>
    )
  }
}

export default App
```

**Key Points:**
- Extends `React.Component`
- `constructor(props)`: Initialize component
- `super(props)`: Call parent constructor
- `render()`: Returns JSX (required method)

### State in Class Components

```js
// src/App.js
import React from 'react'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      anecdotes: [],
      current: 0
    }
  }

  render() {
    if (this.state.anecdotes.length === 0) {
      return <div>no anecdotes...</div>
    }

    return (
      <div>
        <h1>anecdote of the day</h1>
        <div>
          {this.state.anecdotes[this.state.current].content}
        </div>
        <button>next</button>
      </div>
    )
  }
}

export default App
```

**Key Points:**
- Single state object: `this.state = { ... }`
- Access state: `this.state.propertyName`
- All state in one object (unlike hooks with multiple `useState`)

### Lifecycle Methods

#### componentDidMount

Equivalent to `useEffect(() => {...}, [])` - runs after first render:

```js
// src/App.js
import React from 'react'
import axios from 'axios'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      anecdotes: [],
      current: 0
    }
  }

  componentDidMount = () => {
    axios.get('http://localhost:3001/anecdotes').then(response => {
      this.setState({ anecdotes: response.data })
    })
  }

  render() {
    // ...
  }
}

export default App
```

**Key Points:**
- Runs once after component mounts
- Good place for API calls
- Use arrow function to bind `this`

### Updating State

Use `setState` method to update state:

```js
// src/App.js
class App extends React.Component {
  // ...

  handleClick = () => {
    const current = Math.floor(
      Math.random() * this.state.anecdotes.length
    )
    this.setState({ current })
  }

  render() {
    return (
      <div>
        <h1>anecdote of the day</h1>
        <div>{this.state.anecdotes[this.state.current].content}</div>
        <button onClick={this.handleClick}>next</button>
      </div>
    )
  }
}
```

**Key Points:**
- `this.setState({ key: value })`: Updates state
- Only updates specified keys (merges with existing state)
- Triggers re-render automatically
- Use arrow functions for event handlers (binds `this`)

### Complete Class Component Example

```js
// src/App.js
import React from 'react'
import axios from 'axios'

class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      anecdotes: [],
      current: 0
    }
  }

  componentDidMount = () => {
    axios.get('http://localhost:3001/anecdotes').then(response => {
      this.setState({ anecdotes: response.data })
    })
  }

  handleClick = () => {
    const current = Math.floor(
      Math.random() * this.state.anecdotes.length
    )
    this.setState({ current })
  }

  render() {
    if (this.state.anecdotes.length === 0) {
      return <div>no anecdotes...</div>
    }

    return (
      <div>
        <h1>anecdote of the day</h1>
        <div>{this.state.anecdotes[this.state.current].content}</div>
        <button onClick={this.handleClick}>next</button>
      </div>
    )
  }
}

export default App
```

### Functional Component Equivalent

```js
// src/App.js
import React, { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [anecdotes, setAnecdotes] = useState([])
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    axios.get('http://localhost:3001/anecdotes').then(response => {
      setAnecdotes(response.data)
    })
  }, [])

  const handleClick = () => {
    setCurrent(Math.floor(Math.random() * anecdotes.length)))
  }

  if (anecdotes.length === 0) {
    return <div>no anecdotes...</div>
  }

  return (
    <div>
      <h1>anecdote of the day</h1>
      <div>{anecdotes[current].content}</div>
      <button onClick={handleClick}>next</button>
    </div>
  )
}

export default App
```

## Class Components vs Functional Components

| Feature | Class Components | Functional Components |
|---------|------------------|----------------------|
| **State** | Single `this.state` object | Multiple `useState` hooks |
| **Update State** | `this.setState()` | Individual setter functions |
| **Lifecycle** | `componentDidMount`, etc. | `useEffect` hook |
| **`this` binding** | Need to bind or use arrow functions | No `this` needed |
| **Syntax** | More verbose | More concise |
| **Hooks** | Cannot use hooks | Can use all hooks |
| **Error Boundaries** | Supported | Not yet (as of React 16.8) |

### When to Use Class Components?

**Use Functional Components (with hooks):**
- New projects (React 16.8+)
- Most use cases
- Simpler syntax
- Better performance

**Class Components:**
- Legacy code maintenance
- Error boundaries (until functional components support them)
- Projects that haven't migrated yet

**Don't Rewrite:**
- No need to rewrite existing class components
- Both can coexist in same project
- Focus on new code using functional components

## Code Organization

### Common Structure

```
src/
├── components/          # Reusable components
├── pages/              # Page-level components
├── services/           # API communication
├── reducers/           # Redux reducers
├── hooks/              # Custom hooks
└── utils/              # Utility functions
```

### Alternative Structures

**Feature-based:**
```
src/
├── features/
│   ├── notes/
│   │   ├── components/
│   │   ├── services/
│   │   └── hooks/
│   └── users/
│       ├── components/
│       └── services/
```

**Domain-driven:**
```
src/
├── domain/
│   ├── notes/
│   └── users/
├── infrastructure/
│   └── api/
└── presentation/
    └── components/
```

**Key Points:**
- No single "correct" way
- Choose based on project size
- Start simple, refactor as needed
- Consistency is important

## Frontend and Backend in Same Repository

### Monorepo Structure

```
project-root/
├── package.json        # Root package.json
├── webpack.config.js   # Root webpack config
├── client/             # Frontend code
│   ├── src/
│   └── package.json
└── server/             # Backend code
    ├── src/
    └── package.json
```

**Benefits:**
- Shared code between frontend/backend
- Single repository
- Easier to coordinate changes
- Common tooling

**Drawbacks:**
- Larger repository
- More complex setup
- Deployment complexity

## Real-time Updates

### Polling

Repeatedly request data from server:

```js
// src/App.js
useEffect(() => {
  const interval = setInterval(() => {
    fetchNotes()
  }, 5000) // Poll every 5 seconds

  return () => clearInterval(interval)
}, [])
```

**Drawbacks:**
- Wastes bandwidth
- Not real-time
- Server load

### WebSockets

Two-way communication channel:

```js
// Using Socket.io
import io from 'socket.io-client'

const socket = io('http://localhost:3001')

socket.on('noteCreated', (note) => {
  setNotes(notes.concat(note))
})
```

**Benefits:**
- Real-time updates
- Efficient
- Two-way communication

**Libraries:**
- Socket.io (with fallbacks)
- Native WebSocket API
- ws (Node.js)

## Virtual DOM

### What is Virtual DOM?

Virtual DOM is a JavaScript representation of the real DOM.

**How it works:**
1. React creates virtual DOM from components
2. Virtual DOM stored in memory
3. React compares old and new virtual DOM
4. React updates only changed parts in real DOM

### Example

```js
// Virtual DOM (JavaScript objects)
const element = <h1>Hello, world</h1>

// React converts to:
{
  type: 'h1',
  props: {
    children: 'Hello, world'
  }
}
```

**Benefits:**
- Faster updates
- Efficient diffing
- Declarative programming
- Cross-browser compatibility

## React's Role

### React is a Library, Not a Framework

**React:**
- Focuses on View layer
- Manages component rendering
- Not opinionated about other layers
- Can be used with any backend

**Frameworks (Angular, etc.):**
- Full MVC architecture
- Routing, state management, etc.
- More opinionated
- All-in-one solution

### MVC Pattern

**Model**: Data and business logic
**View**: UI (React's domain)
**Controller**: Handles user input

**In React:**
- Small apps: Component state = Model
- Redux apps: Redux store = Model
- React = View layer only

## Security

### OWASP Top 10

Common web application security risks:
1. Injection
2. Broken Authentication
3. Sensitive Data Exposure
4. XML External Entities (XXE)
5. Broken Access Control
6. Security Misconfiguration
7. Cross-Site Scripting (XSS)
8. Insecure Deserialization
9. Using Components with Known Vulnerabilities
10. Insufficient Logging & Monitoring

### SQL Injection

**Vulnerable:**
```js
let query = "SELECT * FROM Users WHERE name = '" + userName + "';"
// If userName = "Arto'; DROP TABLE Users; --"
// Results in: SELECT * FROM Users WHERE name = 'Arto'; DROP TABLE Users; --'
```

**Safe (Parameterized Queries):**
```js
execute("SELECT * FROM Users WHERE name = ?", [userName])
```

**MongoDB (Mongoose):**
- Automatically sanitizes queries
- Prevents NoSQL injection
- Use parameterized queries

### Cross-Site Scripting (XSS)

**Attack:**
```html
<script>
  alert('Evil XSS attack')
</script>
```

**React Protection:**
- Automatically escapes content
- Prevents script execution
- Renders as text

**Still Vulnerable:**
- `dangerouslySetInnerHTML`
- Third-party libraries
- Old React versions

### Security Best Practices

#### 1. Keep Dependencies Updated

```bash
# Check outdated packages
npm outdated --depth 0

# Update package.json
npm install -g npm-check-updates
ncu -u
npm install

# Check for vulnerabilities
npm audit
npm audit fix
```

#### 2. Use HTTPS

- Encrypt all traffic
- Protect authentication tokens
- Prevent man-in-the-middle attacks

#### 3. Validate on Server

- Never trust client-side validation
- Always validate on server
- Don't hide features, secure them

#### 4. Use Security Middleware

```js
// Express security
const helmet = require('helmet')
app.use(helmet())
```

#### 5. ESLint Security Plugin

```bash
npm install --save-dev eslint-plugin-security
```

## Current Trends

### TypeScript

Typed version of JavaScript:

**Benefits:**
- Type safety
- Better IDE support
- Catch errors early
- Better documentation

**Example:**
```typescript
interface Note {
  id: string
  content: string
  important: boolean
}

const note: Note = {
  id: '1',
  content: 'TypeScript is great',
  important: true
}
```

### Server-Side Rendering (SSR)

**What it is:**
- Render React on server
- Send HTML to browser
- Hydrate with JavaScript

**Benefits:**
- Better SEO
- Faster initial load
- Works without JavaScript

**Frameworks:**
- Next.js (most popular)
- Remix
- Gatsby

### Progressive Web Apps (PWA)

**Features:**
- Works offline
- Installable
- Responsive
- Fast loading
- HTTPS required

**Technologies:**
- Service Workers
- Web App Manifest
- Cache API

### Microservices

**Monolithic:**
```
Frontend → Backend (single service) → Database
```

**Microservices:**
```
Frontend → API Gateway → [Service 1, Service 2, Service 3] → [DB1, DB2, DB3]
```

**Benefits:**
- Independent scaling
- Technology diversity
- Team autonomy
- Fault isolation

**Challenges:**
- Complexity
- Network latency
- Data consistency
- Deployment complexity

**When to Use:**
- Large applications
- Multiple teams
- Different scaling needs
- Start with monolith, split when needed

### Serverless

**What it is:**
- Functions as a Service (FaaS)
- No server management
- Pay per execution
- Auto-scaling

**Providers:**
- AWS Lambda
- Google Cloud Functions
- Azure Functions
- Vercel Functions

**Benefits:**
- No server management
- Auto-scaling
- Cost-effective
- Fast deployment

**Use Cases:**
- API endpoints
- Event processing
- Scheduled tasks
- Webhooks

## Useful Libraries

### Data Handling

- **lodash**: Utility functions for data manipulation
- **ramda**: Functional programming utilities
- **date-fns**: Date manipulation library

### Forms

- **React Hook Form**: Form handling library
- **Formik**: Form state management

### Charts

- **recharts**: React charting library
- **highcharts**: Advanced charting library

### State Management

- **Immer**: Immutable state updates
- **Redux-saga**: Alternative to Redux Thunk

### Analytics

- **React Google Analytics 4**: Analytics for SPAs

### Mobile

- **React Native**: Mobile app development with React

## JavaScript Tool Evolution

**Timeline:**
- 2011: Bower
- 2012: Grunt
- 2013-14: Gulp
- 2012-14: Browserify
- 2015-2023: Webpack
- 2023-: esbuild, Vite

**Current Trend:**
- Faster bundlers (esbuild, Vite)
- Less configuration
- Better developer experience

## Resources

- **React Patterns**: <https://reactpatterns.com/>
- **React Bits**: React best practices
- **Reactiflux**: React community on Discord
- **OWASP**: Security best practices
- **MDN Security Guide**: Web security documentation

## Exercises

The exercises for this section are part of the "Extending the bloglist" exercise set at the end of Part 7. They involve:

- Understanding class components (for legacy code)
- Code organization best practices
- Security considerations
- Understanding current trends in web development
