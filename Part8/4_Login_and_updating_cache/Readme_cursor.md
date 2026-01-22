# Login and Updating the Cache - Summary

This section covers implementing login functionality in the React frontend, managing authentication tokens, updating Apollo Client cache, and handling validation errors.

## User Login

### Login Mutation

```js
// src/queries.js
import { gql } from '@apollo/client'

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`
```

**Key Points:**
- Named mutation with variables
- Returns Token object with value field
- Variables for username and password

### LoginForm Component

```js
// src/components/LoginForm.jsx
import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { LOGIN } from '../queries'

const LoginForm = ({ setError, setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data.login.value
      setToken(token)
      localStorage.setItem('phonebook-user-token', token)
    },
    onError: (error) => {
      setError(error.message)
    }
  })

  const submit = (event) => {
    event.preventDefault()
    login({ variables: { username, password } })
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password <input
            type='password'
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default LoginForm
```

**Key Features:**
- `onCompleted`: Called when mutation succeeds
- Stores token in state and localStorage
- `onError`: Handles login errors
- Password input type for security

## Token Management

### Storing Token in localStorage

```js
// Store token after login
localStorage.setItem('phonebook-user-token', token)

// Retrieve token on app load
const [token, setToken] = useState(
  localStorage.getItem('phonebook-user-token')
)
```

**Benefits:**
- Persists across page reloads
- User stays logged in
- Simple key-value storage

**Security Considerations:**
- localStorage is accessible to JavaScript
- Vulnerable to XSS attacks
- Consider httpOnly cookies for production

### Conditional Rendering Based on Token

```js
// src/App.jsx
const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem('phonebook-user-token')
  )
  const [errorMessage, setErrorMessage] = useState(null)
  const result = useQuery(ALL_PERSONS)

  if (result.loading) {
    return <div>loading...</div>
  }

  if (!token) {
    return (
      <div>
        <Notify errorMessage={errorMessage} />
        <h2>Login</h2>
        <LoginForm
          setToken={setToken}
          setError={notify}
        />
      </div>
    )
  }

  return (
    <div>
      {/* Main app content */}
    </div>
  )
}
```

**Flow:**
1. Check if token exists
2. If no token → show login form
3. If token exists → show main app

## Adding Token to Requests

### Apollo Client Configuration

```js
// src/main.jsx
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import { setContext } from '@apollo/client/link/context'

const authLink = setContext(({ headers }) => {
  const token = localStorage.getItem('phonebook-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    }
  }
})

const httpLink = new HttpLink({ uri: 'http://localhost:4000' })

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(httpLink)
})
```

**Key Components:**
- `setContext`: Creates link that modifies request headers
- Reads token from localStorage
- Adds `Authorization: Bearer <token>` header
- Concatenates with HttpLink

**How It Works:**
1. `setContext` runs before each request
2. Reads token from localStorage
3. Adds authorization header if token exists
4. Request sent with header to server

### setContext Link

```js
const authLink = setContext(({ headers }) => {
  const token = localStorage.getItem('phonebook-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    }
  }
})
```

**Parameters:**
- `headers`: Existing request headers
- Returns new headers object

**Benefits:**
- Automatic token inclusion
- No manual header management
- Works for all queries/mutations

## Logout Functionality

### Logout Implementation

```js
// src/App.jsx
import { useApolloClient } from '@apollo/client/react'

const App = () => {
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  const onLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <>
      <button onClick={onLogout}>logout</button>
      {/* rest of app */}
    </>
  )
}
```

**Logout Steps:**
1. Set token to null (triggers re-render)
2. Clear localStorage (remove token)
3. Reset Apollo cache (clear cached data)

**Why Reset Cache:**
- Cached data may be user-specific
- Prevents unauthorized data access
- Ensures fresh data on next login

### useApolloClient Hook

```js
import { useApolloClient } from '@apollo/client/react'

const client = useApolloClient()
client.resetStore() // Clears entire cache
```

**Available Methods:**
- `resetStore()`: Clears all cached data
- `clearStore()`: Clears cache and refetches active queries
- `writeQuery()`: Manually write to cache
- `readQuery()`: Read from cache

## Fixing Validation Issues

### Empty String vs Undefined

**Problem:**
- Form sends empty string `""` for optional fields
- Backend validation fails on empty string
- Should send `undefined` instead

**Solution:**
```js
// src/components/PersonForm.jsx
const submit = async (event) => {
  event.preventDefault()

  createPerson({
    variables: {
      name,
      street,
      city,
      phone: phone.length > 0 ? phone : undefined,
    },
  })
}
```

**Key Point:**
- Check if field has value
- Send `undefined` if empty
- Backend treats `undefined` as missing field

### Handling Validation Errors

**Problem:**
- Database validation errors not shown
- Mutation fails silently
- User doesn't know what went wrong

**Solution:**
```js
// src/components/PhoneForm.jsx
const PhoneForm = ({ setError }) => {
  const [changeNumber] = useMutation(EDIT_NUMBER)

  const submit = async (event) => {
    event.preventDefault()

    try {
      await changeNumber({ variables: { name, phone } })
    } catch (error) {
      setError(error.message)
    }

    setName('')
    setPhone('')
  }
}
```

**Key Points:**
- Wrap mutation in try-catch
- Catch block handles errors
- Display error message to user
- Clear form after submission

## Cache Updates

### Method 1: refetchQueries

```js
// src/components/PersonForm.jsx
const [createPerson] = useMutation(CREATE_PERSON, {
  onError: (error) => setError(error.message),
  refetchQueries: [{ query: ALL_PERSONS }],
})
```

**How It Works:**
- After mutation completes
- Refetches specified queries
- Updates cache with fresh data

**Pros:**
- Simple to implement
- Always gets latest data
- Works for any query

**Cons:**
- Extra network request
- Slower than manual update
- May refetch unnecessary data

### Method 2: update Callback

```js
// src/components/PersonForm.jsx
const [createPerson] = useMutation(CREATE_PERSON, {
  onError: (error) => setError(error.message),
  update: (cache, response) => {
    cache.updateQuery({ query: ALL_PERSONS }, ({ allPersons }) => {
      return {
        allPersons: allPersons.concat(response.data.addPerson),
      }
    })
  },
})
```

**How It Works:**
- Called after mutation completes
- Receives cache and response data
- Manually updates cache
- No network request needed

**Pros:**
- No extra network request
- Faster than refetch
- More control over update

**Cons:**
- More complex code
- Must match cache structure
- Can get out of sync if not careful

### updateQuery Method

```js
cache.updateQuery(
  { query: ALL_PERSONS },
  ({ allPersons }) => {
    return {
      allPersons: allPersons.concat(newPerson)
    }
  }
)
```

**Parameters:**
1. Query object to update
2. Update function:
   - Receives current cached data
   - Returns new data structure

**Use Cases:**
- Adding new items to list
- Updating specific items
- Removing items from list

### When to Use Each Method

**Use refetchQueries when:**
- Simple updates needed
- Want to ensure data freshness
- Multiple queries need updating
- Complex cache structure

**Use update callback when:**
- Performance is critical
- Simple list additions
- Want to avoid network requests
- Cache structure is simple

## Cache Management Best Practices

### 1. Always Update Cache After Mutations

```js
// ✅ Good: Update cache
const [createPerson] = useMutation(CREATE_PERSON, {
  refetchQueries: [{ query: ALL_PERSONS }],
})

// ❌ Bad: Cache not updated
const [createPerson] = useMutation(CREATE_PERSON)
```

### 2. Reset Cache on Logout

```js
// ✅ Good: Clear cache on logout
const onLogout = () => {
  setToken(null)
  localStorage.clear()
  client.resetStore()
}

// ❌ Bad: Cache persists after logout
const onLogout = () => {
  setToken(null)
  localStorage.clear()
}
```

### 3. Handle Empty Values Correctly

```js
// ✅ Good: Send undefined for empty fields
phone: phone.length > 0 ? phone : undefined

// ❌ Bad: Send empty string
phone: phone // Might be ""
```

### 4. Catch Validation Errors

```js
// ✅ Good: Handle errors
try {
  await changeNumber({ variables: { name, phone } })
} catch (error) {
  setError(error.message)
}

// ❌ Bad: Ignore errors
await changeNumber({ variables: { name, phone } })
```

## Common Patterns

### Login Flow

```js
1. User enters credentials
2. Login mutation executed
3. Token received in onCompleted
4. Token stored in state and localStorage
5. App re-renders with authenticated view
```

### Logout Flow

```js
1. User clicks logout
2. Token set to null
3. localStorage cleared
4. Cache reset
5. App re-renders with login view
```

### Protected Mutation Flow

```js
1. User performs action (e.g., add person)
2. Mutation sent with auth header
3. Server validates token
4. Mutation executes
5. Cache updated
6. UI reflects changes
```

## Error Handling

### Login Errors

```js
const [login] = useMutation(LOGIN, {
  onError: (error) => {
    setError(error.message)
  }
})
```

**Common Errors:**
- Wrong credentials
- Network errors
- Server errors

### Validation Errors

```js
try {
  await changeNumber({ variables: { name, phone } })
} catch (error) {
  setError(error.message)
}
```

**Common Errors:**
- Field too short
- Field required
- Invalid format

### Network Errors

Apollo Client automatically handles:
- Network failures
- Timeout errors
- Server errors

Display to user via error callbacks.

## Security Considerations

### Token Storage

**localStorage:**
- ✅ Simple to use
- ✅ Persists across sessions
- ❌ Vulnerable to XSS
- ❌ Accessible to all scripts

**Alternatives:**
- httpOnly cookies (more secure)
- Session storage (cleared on tab close)
- Memory only (cleared on refresh)

### Token Transmission

**Always use HTTPS:**
- Prevents token interception
- Encrypts all traffic
- Required for production

### Token Expiration

**Current Implementation:**
- Tokens don't expire
- Valid until logout

**Production Should:**
- Set token expiration
- Refresh tokens automatically
- Handle expired tokens gracefully

## Exercises

The exercises (8.17-8.22) involve:
- Fixing broken book list
- Implementing login functionality
- Genre filtering
- Cache management
- Book recommendations
