# props.children and PropTypes - Summary

This section covers component composition using `props.children`, extracting components, moving state to appropriate components, and using refs to access component functions from outside.

## Displaying the Login Form Only When Appropriate

Instead of always showing the login form, we can make it appear only when the user clicks a "login" button, and hide it with a "cancel" button.

### Extracting LoginForm Component

Extract the login form into its own component:

```js
// src/components/LoginForm.jsx
const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {
  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          username
          <input
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm
```

**Key Points:**
- Props are destructured directly in the function parameters
- State and handlers are passed as props from parent component
- Component is reusable and focused on presentation

### Conditional Visibility with State

Add state to control login form visibility:

```js
// src/App.jsx
const App = () => {
  const [loginVisible, setLoginVisible] = useState(false)
  // ...

  const loginForm = () => {
    const hideWhenVisible = { display: loginVisible ? 'none' : '' }
    const showWhenVisible = { display: loginVisible ? '' : 'none' }

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>log in</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    )
  }

  // ...
}
```

**Inline Styles:**
- `display: 'none'` hides the element
- Empty string `''` shows the element normally
- Ternary operator controls visibility based on state

## The Components Children, aka. props.children

Create a reusable `Togglable` component that can wrap any content and control its visibility.

### Togglable Component

```js
// src/components/Togglable.jsx
import { useState } from 'react'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
}

export default Togglable
```

**Key Concepts:**
- `props.children` contains React elements between opening and closing tags
- Automatically provided by React
- If component is self-closing (`<Component />`), `children` is empty array
- Allows flexible component composition

### Using Togglable

```js
// src/App.jsx
<Togglable buttonLabel='login'>
  <LoginForm
    username={username}
    password={password}
    handleUsernameChange={({ target }) => setUsername(target.value)}
    handlePasswordChange={({ target }) => setPassword(target.value)}
    handleSubmit={handleLogin}
  />
</Togglable>
```

Multiple elements can be children:

```js
<Togglable buttonLabel="reveal">
  <p>this line is at start hidden</p>
  <p>also this is hidden</p>
</Togglable>
```

### Extracting NoteForm Component

Extract the note creation form into its own component:

```js
// src/components/NoteForm.jsx
const NoteForm = ({ onSubmit, handleChange, value }) => {
  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={onSubmit}>
        <input
          value={value}
          onChange={handleChange}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default NoteForm
```

Use it with Togglable:

```js
// src/App.jsx
<Togglable buttonLabel="new note">
  <NoteForm
    onSubmit={addNote}
    value={newNote}
    handleChange={handleNoteChange}
  />
</Togglable>
```

## State of the Forms

According to React documentation: *"Sometimes, you want the state of two components to always change together. To do it, remove state from both of them, move it to their closest common parent, and then pass it down to them via props. This is known as lifting state up."*

However, if the parent component doesn't need the form state, we can move it into the form component itself.

### Moving State to NoteForm

```js
// src/components/NoteForm.jsx
import { useState } from 'react'

const NoteForm = ({ createNote }) => {
  const [newNote, setNewNote] = useState('')

  const addNote = (event) => {
    event.preventDefault()
    createNote({
      content: newNote,
      important: true
    })

    setNewNote('')
  }

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={event => setNewNote(event.target.value)}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default NoteForm
```

**Benefits:**
- State is encapsulated in the component
- Parent component is simpler (no `newNote` state or `handleNoteChange`)
- Component is more self-contained

### Updated App Component

```js
// src/App.jsx
const App = () => {
  // ... other state (no newNote state)

  const addNote = (noteObject) => {
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
  }

  const noteForm = () => (
    <Togglable buttonLabel='new note'>
      <NoteForm createNote={addNote} />
    </Togglable>
  )

  // ...
}
```

## References to Components with ref

After creating a note, we want to hide the form. Since visibility is controlled by `Togglable`'s internal state, we need a way to access its `toggleVisibility` function from outside.

### Using useRef and useImperativeHandle

**App Component:**

```js
// src/App.jsx
import { useState, useEffect, useRef } from 'react'

const App = () => {
  // ...
  const noteFormRef = useRef()

  const noteForm = () => (
    <Togglable buttonLabel='new note' ref={noteFormRef}>
      <NoteForm createNote={addNote} />
    </Togglable>
  )

  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility()
    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
      })
  }

  // ...
}
```

**Togglable Component:**

```js
// src/components/Togglable.jsx
import { useState, useImperativeHandle, forwardRef } from 'react'

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return { toggleVisibility }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})

Togglable.displayName = 'Togglable'

export default Togglable
```

**Key Points:**
- `useRef` creates a reference that persists across re-renders
- `forwardRef` allows component to receive ref prop
- `useImperativeHandle` exposes specific functions to parent
- `displayName` helps with React DevTools debugging

**Note:** This pattern works but is less elegant than class components. We'll see class components in part 7.

### Multiple Component Instances

Each component instance has its own separate state:

```js
<div>
  <Togglable buttonLabel="1" ref={togglable1}>
    first
  </Togglable>

  <Togglable buttonLabel="2" ref={togglable2}>
    second
  </Togglable>

  <Togglable buttonLabel="3" ref={togglable3}>
    third
  </Togglable>
</div>
```

Each `Togglable` instance maintains its own `visible` state independently.

## The Updated Full Stack Developer's Oath

Full stack development is _extremely hard_, that is why I will use all the possible means to make it easier:

* I will have my browser developer console open all the time
* I will use the network tab of the browser dev tools to ensure that frontend and backend are communicating as I expect
* I will constantly keep an eye on the state of the server to make sure that the data sent there by the frontend is saved there as I expect
* I will keep an eye on the database: does the backend save data there in the right format
* I progress with small steps
* _when I suspect that there is a bug in the frontend, I'll make sure that the backend works as expected_
* _when I suspect that there is a bug in the backend, I'll make sure that the frontend works as expected_
* I will write lots of _console.log_ statements to make sure I understand how the code and the tests behave and to help pinpoint problems
* If my code does not work, I will not write more code. Instead, I'll start deleting it until it works or will just return to a state where everything was still working
* If a test does not pass, I'll make sure that the tested functionality works properly in the application
* When I ask for help in the course Discord channel or elsewhere I formulate my questions properly

## ESLint Configuration

Configure ESLint for the frontend with consistent code style rules.

### eslint.config.js

```js
// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module'
      }
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 'off'
    }
  }
]
```

### Running ESLint

```bash
npm run lint
```

Or use the ESLint plugin in your editor.

**VS Code Configuration:**
If you see `Failed to load plugin react: Cannot find module 'eslint-plugin-react'`, add to settings.json:

```json
{
  "eslint.workingDirectories": [{ "mode": "auto" }]
}
```

## Exercises

### 5.5: Blog List Frontend, step 5
- Change form for creating blog posts to only display when appropriate
- Use Togglable component or similar functionality
- Form hidden by default
- Expands when "create new blog" button clicked
- Hides after blog created or cancel pressed

### 5.6: Blog List Frontend, step 6
- Separate form for creating new blog into its own component
- Move all states required for creating blog to this component
- Component works like NoteForm from material

### 5.7: Blog List Frontend, step 7
- Add button to each blog to control whether details are shown
- Full details shown when button clicked
- Details hidden when button clicked again
- Like button doesn't need to work yet
- Use inline styles for appearance

### 5.8: Blog List Frontend, step 8
- Implement functionality for like button
- Likes increased by HTTP PUT request to blog's unique address
- Must send all fields in request body (backend replaces entire blog)
- Backend needs to handle user reference

### 5.9: Blog List Frontend, step 9
- Fix issue: when blog is liked, user name not shown in details
- Name appears after browser reload
- Find and fix the problem

### 5.10: Blog List Frontend, step 10
- Modify application to sort blog posts by number of likes
- Use array sort method

### 5.11: Blog List Frontend, step 11
- Add button for deleting blog posts
- Implement deletion logic in frontend
- Use window.confirm for confirmation dialog
- Show delete button only if blog was added by the user

### 5.12: Blog List Frontend, step 12
- Add ESLint to project
- Define configuration according to preferences
- Fix all linter errors
- Vite has ESLint installed by default, just configure eslint.config.js
