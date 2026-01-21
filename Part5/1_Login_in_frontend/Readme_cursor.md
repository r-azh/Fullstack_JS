# Login in Frontend - Summary

The frontend from part 2 doesn't support the user management implemented in the backend in part 4. We need to add login functionality to the frontend so users can authenticate and create notes with their token.

## Adding a Login Form

A login form is added to the top of the page with username and password fields.

### App Component State

Add state for username, password, and user:

```js
// src/App.jsx
const App = () => {
  const [notes, setNotes] = useState([]) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  
  // ...
}
```

### Login Form JSX

The login form is added to the component:

```js
// src/App.jsx
return (
  <div>
    <h1>Notes</h1>
    <Notification message={errorMessage} />
    
    <h2>Login</h2>
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
    // ... rest of component
  </div>
)
```

The form fields use event handlers that destructure `target` from the event parameter:

```js
// src/App.jsx
({ target }) => setUsername(target.value)
```

## Adding Logic to the Login Form

### Creating Login Service

Create a service module for login requests:

```js
// src/services/login.js
import axios from 'axios'

const baseUrl = '/api/login'

const login = async credentials => {
  const response = await axios.post(baseUrl, credentials)
  return response.data
}

export default { login }
```

### Implementing handleLogin

The login handler uses async/await:

```js
// src/App.jsx
import loginService from './services/login'

const App = () => {
  // ... state declarations

  const handleLogin = async event => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  // ...
}
```

- On successful login: saves user (including token) to state and clears form fields
- On failed login: shows error message for 5 seconds

## Conditional Rendering of the Login Form

Show login form only when user is not logged in, and note form only when user is logged in.

### Helper Functions

Create helper functions for forms:

```js
// src/App.jsx
const App = () => {
  // ...

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  const noteForm = () => (
    <form onSubmit={addNote}>
      <input value={newNote} onChange={handleNoteChange} />
      <button type="submit">save</button>
    </form>
  )

  return (
    // ...
  )
}
```

### Conditional Rendering

Use conditional rendering with logical AND:

```js
// src/App.jsx
return (
  <div>
    <h1>Notes</h1>
    <Notification message={errorMessage} />

    {!user && loginForm()}
    {user && noteForm()}
    
    <div>
      <button onClick={() => setShowAll(!showAll)}>
        show {showAll ? 'important' : 'all'}
      </button>
    </div>
    <ul>
      {notesToShow.map(note => (
        <Note
          key={note.id}
          note={note}
          toggleImportance={() => toggleImportanceOf(note.id)}
        />
      ))}
    </ul>

    <Footer />
  </div>
)
```

### Showing User Name

Display logged-in user's name:

```js
// src/App.jsx
return (
  <div>
    <h1>Notes</h1>
    <Notification message={errorMessage} />

    {!user && loginForm()}
    {user && (
      <div>
        <p>{user.name} logged in</p>
        {noteForm()}
      </div>
    )}
    // ... rest of component
  </div>
)
```

## Note on Using the Label Element

The `label` element is used for accessibility:

```js
// src/App.jsx
<div>
  <label>
    username
    <input
      type="text"
      value={username}
      onChange={({ target }) => setUsername(target.value)}
    />
  </label>
</div>
```

**Why use label?**
- Provides programmatic description for screen readers
- Clicking label text focuses the input field
- Improves form accessibility
- Placing input inside label automatically associates them

## Creating New Notes

The token from login must be included in the Authorization header when creating notes.

### Updating noteService

Add token management to the notes service:

```js
// src/services/notes.js
import axios from 'axios'

const baseUrl = '/api/notes'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async newObject => {
  const config = {
    headers: { Authorization: token }
  }
  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default { getAll, create, update, setToken }
```

- `token` is a private module variable
- `setToken` function exports the ability to set the token
- `create` uses async/await and includes token in Authorization header
- Header is passed as third parameter to axios.post

### Updating handleLogin

Call `setToken` after successful login:

```js
// src/App.jsx
import loginService from './services/login'
import noteService from './services/notes'

const handleLogin = async (event) => {
  event.preventDefault()

  try {
    const user = await loginService.login({ username, password })
    noteService.setToken(user.token)
    setUser(user)
    setUsername('')
    setPassword('')
  } catch {
    setErrorMessage('wrong credentials')
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }
}
```

## Saving the Token to Browser's Local Storage

If the browser is refreshed, login information disappears. Save login details to local storage to persist across page reloads.

### Local Storage Basics

Local Storage is a key-value database in the browser:

```js
// Save value
window.localStorage.setItem('name', 'juha tauriainen')

// Get value
window.localStorage.getItem('name')

// Remove key
window.localStorage.removeItem('name')
```

- Values persist across page reloads
- Storage is origin-specific (each web app has its own)
- Values are DOMstrings (must stringify/parse JSON objects)

### Saving User to Local Storage

Update handleLogin to save user:

```js
// src/App.jsx
const handleLogin = async (event) => {
  event.preventDefault()
  try {
    const user = await loginService.login({ username, password })

    window.localStorage.setItem(
      'loggedNoteappUser', JSON.stringify(user)
    )
    noteService.setToken(user.token)
    setUser(user)
    setUsername('')
    setPassword('')
  } catch (exception) {
    setErrorMessage('wrong credentials')
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }
}
```

### Loading User from Local Storage

Use an effect hook to check for saved user on component mount:

```js
// src/App.jsx
const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    noteService.getAll().then(initialNotes => {
      setNotes(initialNotes)
    })
  }, [])
  
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])

  // ...
}
```

- Empty dependency array ensures effect runs only on first render
- Checks for saved user and restores state and token if found

### Logging Out

To log out, remove from local storage:

```js
// In browser console
window.localStorage.removeItem('loggedNoteappUser')

// Or clear all local storage
window.localStorage.clear()
```

## A Note on Using Local Storage

### Security Considerations

**Token Validity:**
- Limit token validity period (forces re-login)
- Save validity info in backend database (server-side session)

**XSS Attacks:**
- Local storage might contain security risk if app has XSS vulnerability
- React sanitizes rendered text, preventing most XSS attacks
- If token leakage would have tragic consequences, consider not storing in local storage

**Alternative: httpOnly Cookies:**
- Save user identity as httpOnly cookies (JavaScript can't access)
- Makes SPA implementation more complex (separate login page needed)
- Note: httpOnly cookies are not necessarily safer than local storage

**Most Important:**
- Minimize risk of XSS attacks altogether
- No solution is 100% secure

## Exercises

### 5.1: Blog List Frontend, step 1
- Clone bloglist-frontend from GitHub
- Remove git configuration: `rm -rf .git`
- Install dependencies: `npm install`
- Implement login functionality
- Token saved to application state `user`
- If user not logged in: only login form visible
- If user logged in: show user name and list of blogs
- User details don't need to be saved to local storage yet

**Conditional rendering example:**
```js
// src/App.jsx
if (user === null) {
  return (
    <div>
      <h2>Log in to application</h2>
      <form>
        //...
      </form>
    </div>
  )
}

return (
  <div>
    <h2>blogs</h2>
    {blogs.map(blog =>
      <Blog key={blog.id} blog={blog} />
    )}
  </div>
)
```

### 5.2: Blog List Frontend, step 2
- Make login 'permanent' using local storage
- Implement logout functionality
- Ensure browser doesn't remember user details after logout

### 5.3: Blog List Frontend, step 3
- Allow logged-in user to add new blogs
- Show form for creating new blogs when user is logged in

### 5.4: Blog List Frontend, step 4
- Implement notifications for successful and unsuccessful operations
- Show notifications at top of page
- Notifications visible for a few seconds
- Examples:
  - Success: "a new blog 'title' by author added"
  - Failure: "wrong username or password"
- Colors not compulsory
