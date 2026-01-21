# More about Styles - Summary

This section covers different approaches to styling React applications, including UI frameworks (Bootstrap, MaterialUI) and styled-components.

## Introduction

In addition to traditional CSS files and inline styles, there are several modern approaches to styling React applications:
- UI Frameworks (Bootstrap, MaterialUI)
- CSS-in-JS libraries (styled-components)
- Utility-first CSS (Tailwind CSS)

## UI Frameworks

UI frameworks provide ready-made themes and components like buttons, menus, and tables. They help developers create consistent, responsive designs quickly.

### Benefits of UI Frameworks

- **Consistent Design**: Pre-built components with consistent styling
- **Responsive**: Built-in responsive design patterns
- **Time Saving**: No need to write CSS from scratch
- **Accessibility**: Many frameworks include accessibility features
- **Documentation**: Extensive documentation and examples

### Popular UI Frameworks

- Bootstrap
- MaterialUI
- Ant Design
- Chakra UI
- Tailwind CSS
- Semantic UI
- And many more...

## React Bootstrap

React Bootstrap is a React-friendly version of Bootstrap that transforms Bootstrap components into React components.

### Installation

```bash
npm install react-bootstrap
```

### Setup

Add Bootstrap CSS to `public/index.html`:

```html
<!-- public/index.html -->
<head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
    integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
    crossorigin="anonymous"
  />
</head>
```

### Container

Wrap application content in a container:

```js
// src/App.jsx
import { Container } from 'react-bootstrap'

const App = () => {
  return (
    <div className="container">
      {/* or use Container component */}
      <Container>
        {/* app content */}
      </Container>
    </div>
  )
}

export default App
```

**Key Points:**
- `container` class or `Container` component
- Adds margins and padding
- Centers content
- Responsive width

### Tables

Use Bootstrap's Table component:

```js
// src/components/Notes.jsx
import { Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Notes = ({ notes }) => (
  <div>
    <h2>Notes</h2>
    <Table striped>
      <tbody>
        {notes.map(note =>
          <tr key={note.id}>
            <td>
              <Link to={`/notes/${note.id}`}>
                {note.content}
              </Link>
            </td>
            <td>
              {note.user}
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  </div>
)

export default Notes
```

**Key Points:**
- `Table` component with `striped` prop
- No need for custom CSS
- Built-in styling
- Responsive by default

### Forms

Use Bootstrap form components:

```js
// src/components/Login.jsx
import { Form, Button } from 'react-bootstrap'

const Login = ({ onLogin }) => {
  const onSubmit = (event) => {
    event.preventDefault()
    onLogin(event.target.username.value)
  }

  return (
    <div>
      <h2>login</h2>
      <Form onSubmit={onSubmit}>
        <Form.Group>
          <Form.Label>username:</Form.Label>
          <Form.Control
            type="text"
            name="username"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>password:</Form.Label>
          <Form.Control
            type="password"
            name="password"
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          login
        </Button>
      </Form>
    </div>
  )
}

export default Login
```

**Key Points:**
- `Form` component
- `Form.Group` for form fields
- `Form.Label` for labels
- `Form.Control` for inputs
- `Button` with variants

### Alerts

Display notifications with Alert component:

```js
// src/App.jsx
import { Alert } from 'react-bootstrap'

const App = () => {
  const [message, setMessage] = useState(null)

  return (
    <div className="container">
      {message && (
        <Alert variant="success">
          {message}
        </Alert>
      )}
      {/* rest of app */}
    </div>
  )
}

export default App
```

**Key Points:**
- `Alert` component
- `variant` prop: `success`, `danger`, `warning`, `info`
- Auto-dismiss with timeout
- Accessible by default

### Navigation

Use Navbar component for navigation:

```js
// src/components/Navigation.jsx
import { Navbar, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Navigation = ({ user }) => {
  const padding = {
    padding: 5
  }

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="#" as="span">
            <Link style={padding} to="/">home</Link>
          </Nav.Link>
          <Nav.Link href="#" as="span">
            <Link style={padding} to="/notes">notes</Link>
          </Nav.Link>
          <Nav.Link href="#" as="span">
            <Link style={padding} to="/users">users</Link>
          </Nav.Link>
          <Nav.Link href="#" as="span">
            {user
              ? <em style={padding}>{user} logged in</em>
              : <Link style={padding} to="/login">login</Link>
            }
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default Navigation
```

**Key Points:**
- `Navbar` component
- `collapseOnSelect` - collapses on mobile
- `expand="lg"` - expands on large screens
- `bg` and `variant` for styling
- Responsive hamburger menu

## MaterialUI

MaterialUI (MUI) implements Google's Material Design visual language.

### Installation

```bash
npm install @mui/material @emotion/react @emotion/styled
```

### Container

```js
// src/App.jsx
import { Container } from '@mui/material'

const App = () => {
  return (
    <Container>
      {/* app content */}
    </Container>
  )
}

export default App
```

### Tables

```js
// src/components/Notes.jsx
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@mui/material'
import { Link } from 'react-router-dom'

const Notes = ({ notes }) => (
  <div>
    <h2>Notes</h2>
    <TableContainer component={Paper}>
      <Table>
        <TableBody>
          {notes.map(note => (
            <TableRow key={note.id}>
              <TableCell>
                <Link to={`/notes/${note.id}`}>{note.content}</Link>
              </TableCell>
              <TableCell>
                {note.user}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </div>
)

export default Notes
```

**Key Points:**
- Multiple components needed
- `TableContainer` with `Paper` component
- `Table`, `TableBody`, `TableRow`, `TableCell`
- Each component imported separately

### Forms

```js
// src/components/Login.jsx
import { TextField, Button } from '@mui/material'

const Login = ({ onLogin }) => {
  const onSubmit = (event) => {
    event.preventDefault()
    onLogin(event.target.username.value)
  }

  return (
    <div>
      <h2>login</h2>
      <form onSubmit={onSubmit}>
        <div>
          <TextField label="username" name="username" />
        </div>
        <div>
          <TextField label="password" type="password" name="password" />
        </div>
        <div>
          <Button variant="contained" color="primary" type="submit">
            login
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Login
```

**Key Points:**
- `TextField` component
- `Button` with variants
- Uses regular HTML `form` element
- `variant="contained"` for filled button
- `color="primary"` for primary color

### Alerts

```js
// src/App.jsx
import { Alert } from '@mui/material'

const App = () => {
  const [message, setMessage] = useState(null)

  return (
    <Container>
      {message && (
        <Alert severity="success">
          {message}
        </Alert>
      )}
      {/* rest of app */}
    </Container>
  )
}

export default App
```

**Key Points:**
- `Alert` component
- `severity` prop: `success`, `error`, `warning`, `info`
- Similar to Bootstrap Alert

### Navigation

```js
// src/components/Navigation.jsx
import { AppBar, Toolbar, Button } from '@mui/material'
import { Link } from 'react-router-dom'

const Navigation = ({ user }) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          home
        </Button>
        <Button color="inherit" component={Link} to="/notes">
          notes
        </Button>
        <Button color="inherit" component={Link} to="/users">
          users
        </Button>
        {user
          ? <em>{user} logged in</em>
          : <Button color="inherit" component={Link} to="/login">
              login
            </Button>
        }
      </Toolbar>
    </AppBar>
  )
}

export default Navigation
```

**Key Points:**
- `AppBar` component
- `Toolbar` for content
- `component={Link}` prop to use React Router Link
- `color="inherit"` for text color
- Clean integration with React Router

## Styled Components

Styled-components is a CSS-in-JS library that uses tagged template literals to define styles.

### Installation

```bash
npm install styled-components
```

### Basic Usage

```js
// src/components/StyledComponents.jsx
import styled from 'styled-components'

const Button = styled.button`
  background: Bisque;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid Chocolate;
  border-radius: 3px;
`

const Input = styled.input`
  margin: 0.25em;
`

const Login = () => {
  return (
    <div>
      <h2>login</h2>
      <form onSubmit={onSubmit}>
        <div>
          username:
          <Input />
        </div>
        <div>
          password:
          <Input type="password" />
        </div>
        <Button type="submit">login</Button>
      </form>
    </div>
  )
}

export default Login
```

**Key Points:**
- Tagged template literals (backticks)
- CSS written inside template literals
- Creates React components
- Scoped styles (no conflicts)

### Styled Div Elements

```js
// src/App.jsx
import styled from 'styled-components'

const Page = styled.div`
  padding: 1em;
  background: papayawhip;
`

const Navigation = styled.div`
  background: BurlyWood;
  padding: 1em;
`

const Footer = styled.div`
  background: Chocolate;
  padding: 1em;
  margin-top: 1em;
`

const App = () => {
  return (
    <Page>
      <Navigation>
        <Link to="/">home</Link>
        <Link to="/notes">notes</Link>
      </Navigation>
      
      <Routes>
        {/* routes */}
      </Routes>

      <Footer>
        <em>Note app, Department of Computer Science 2022</em>
      </Footer>
    </Page>
  )
}

export default App
```

**Key Points:**
- Style any HTML element
- Use as React components
- Props can be passed
- Dynamic styling based on props

### Props-based Styling

```js
// src/components/Button.jsx
import styled from 'styled-components'

const Button = styled.button`
  background: ${props => props.primary ? 'palevioletred' : 'white'};
  color: ${props => props.primary ? 'white' : 'palevioletred'};
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`

// Usage:
<Button>Normal</Button>
<Button primary>Primary</Button>
```

**Key Points:**
- Access props in template literals
- Conditional styling
- Dynamic styles based on props
- Type-safe with TypeScript

### Extending Styles

```js
// src/components/Button.jsx
import styled from 'styled-components'

const Button = styled.button`
  background: palevioletred;
  color: white;
  font-size: 1em;
  padding: 0.25em 1em;
  border: 2px solid palevioletred;
  border-radius: 3px;
`

const PrimaryButton = styled(Button)`
  background: darkblue;
  border-color: darkblue;
`
```

**Key Points:**
- Extend existing styled components
- Inherit base styles
- Override specific properties
- Composition pattern

## Comparison: Bootstrap vs MaterialUI vs Styled Components

| Feature | Bootstrap | MaterialUI | Styled Components |
|---------|-----------|------------|-------------------|
| **Type** | UI Framework | UI Framework | CSS-in-JS Library |
| **Components** | Pre-built | Pre-built | Custom |
| **Customization** | Limited | Extensive | Full control |
| **Bundle Size** | Medium | Large | Small |
| **Learning Curve** | Easy | Medium | Medium |
| **Documentation** | Good | Excellent | Good |
| **Popularity** | Very High | Very High | High |
| **Best For** | Quick prototypes | Material Design apps | Custom designs |

## Best Practices

### 1. Choose the Right Tool

- **Bootstrap**: Quick prototypes, consistent design needed
- **MaterialUI**: Material Design apps, extensive component library
- **Styled Components**: Custom designs, component-scoped styles

### 2. Consistency

- Stick to one styling approach per project
- Use design system/theme consistently
- Follow framework conventions

### 3. Performance

- Import only needed components
- Use code splitting for large frameworks
- Consider bundle size impact

### 4. Accessibility

- Use semantic HTML
- Follow ARIA guidelines
- Test with screen readers
- Ensure keyboard navigation

### 5. Responsive Design

- Test on multiple screen sizes
- Use framework's responsive utilities
- Mobile-first approach

## Other UI Frameworks

- **Bulma**: Modern CSS framework
- **Ant Design**: Enterprise-class UI design
- **Chakra UI**: Simple and modular
- **Tailwind CSS**: Utility-first CSS
- **Semantic UI**: Human-friendly HTML
- **Mantine**: Full-featured React components
- **Radix UI**: Unstyled, accessible components
- **shadcn/ui**: Re-usable components
- And many more...

## File Structure

```
src/
  ├── App.jsx                    # Main app with Container
  ├── components/
  │   ├── Navigation.jsx        # Navbar/Navigation
  │   ├── Notes.jsx             # Table component
  │   ├── Login.jsx             # Form component
  │   └── Note.jsx              # Individual note
  └── pages/
      ├── Home.jsx              # Home page
      └── Users.jsx             # Users page
```

## Exercises

The exercises for this section are part of the "Extending the bloglist" exercise set at the end of Part 7. They involve:

### Add Bootstrap or MaterialUI

Add Bootstrap or MaterialUI to the bloglist application to improve its appearance.

**Details:**
- Install react-bootstrap or @mui/material
- Add Bootstrap CSS or MaterialUI setup
- Style forms, tables, and navigation
- Use framework components throughout
- Ensure responsive design

### Styled Components

Alternatively, use styled-components to style the bloglist application.

**Details:**
- Install styled-components
- Create styled components for layout
- Style forms and buttons
- Use props for dynamic styling
- Create a cohesive design system

### Responsive Design

Ensure the application works well on mobile devices.

**Details:**
- Test on different screen sizes
- Use responsive utilities
- Mobile-friendly navigation
- Responsive tables and forms
- Touch-friendly buttons
