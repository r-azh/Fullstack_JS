# Custom Hooks - Summary

This section covers creating custom React hooks to extract and reuse stateful logic across components.

## Introduction

Custom hooks are JavaScript functions that start with "use" and can call other hooks. They allow you to extract component logic into reusable functions.

### Rules of Hooks

1. **Only call hooks at the top level** - Don't call hooks inside loops, conditions, or nested functions
2. **Only call hooks from React functions** - Call hooks from React function components or custom hooks
3. **Custom hooks must start with "use"** - This is a convention that helps React identify hooks

### Why Custom Hooks?

**Benefits:**
- Reuse stateful logic between components
- Extract complex logic from components
- Make components cleaner and more readable
- Share logic without changing component hierarchy
- Test hooks independently

## Basic Custom Hook Example

### Without Custom Hook

```js
// src/components/Counter.jsx
import { useState } from 'react'

const Counter = () => {
  const [value, setValue] = useState(0)

  const increase = () => {
    setValue(value + 1)
  }

  const decrease = () => {
    setValue(value - 1)
  }

  const zero = () => {
    setValue(0)
  }

  return (
    <div>
      <div>{value}</div>
      <button onClick={increase}>+</button>
      <button onClick={decrease}>-</button>
      <button onClick={zero}>0</button>
    </div>
  )
}

export default Counter
```

### With Custom Hook

```js
// src/hooks/useCounter.js
import { useState } from 'react'

const useCounter = () => {
  const [value, setValue] = useState(0)

  const increase = () => {
    setValue(value + 1)
  }

  const decrease = () => {
    setValue(value - 1)
  }

  const zero = () => {
    setValue(0)
  }

  return {
    value,
    increase,
    decrease,
    zero
  }
}

export default useCounter
```

```js
// src/components/Counter.jsx
import useCounter from '../hooks/useCounter'

const Counter = () => {
  const { value, increase, decrease, zero } = useCounter()

  return (
    <div>
      <div>{value}</div>
      <button onClick={increase}>+</button>
      <button onClick={decrease}>-</button>
      <button onClick={zero}>0</button>
    </div>
  )
}

export default Counter
```

**Key Points:**
- Custom hook encapsulates state and logic
- Component becomes simpler
- Hook can be reused in multiple components
- Returns object with values and functions

## useField Hook

A common pattern is extracting form field logic:

```js
// src/hooks/useField.js
import { useState } from 'react'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    reset
  }
}

export default useField
```

**Usage:**

```js
// src/components/LoginForm.jsx
import useField from '../hooks/useField'

const LoginForm = () => {
  const username = useField('text')
  const password = useField('password')

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('username:', username.value)
    console.log('password:', password.value)
    username.reset()
    password.reset()
  }

  // Destructure to exclude reset when spreading (avoids warning)
  const { reset: resetUsername, ...usernameProps } = username
  const { reset: resetPassword, ...passwordProps } = password

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input {...usernameProps} />
      </div>
      <div>
        <input {...passwordProps} />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

export default LoginForm
```

**Key Points:**
- Spread operator `{...usernameProps}` spreads properties
- Exclude `reset` when spreading (not a valid HTML attribute)
- Includes `type`, `value`, `onChange`
- `reset` function for clearing fields
- Reusable for any input type

**Note:** When spreading useField, destructure to exclude `reset` to avoid React warnings about invalid DOM attributes.

## useResource Hook

Hook for fetching and managing resources from API:

```js
// src/hooks/useResource.js
import { useState, useEffect } from 'react'
import axios from 'axios'

const useResource = (baseUrl) => {
  const [resources, setResources] = useState([])

  useEffect(() => {
    axios.get(baseUrl).then(response => {
      setResources(response.data)
    })
  }, [baseUrl])

  const create = async (resource) => {
    const response = await axios.post(baseUrl, resource)
    setResources(resources.concat(response.data))
    return response.data
  }

  const service = {
    create
  }

  return [resources, service]
}

export default useResource
```

**Usage:**

```js
// src/App.jsx
import useResource from './hooks/useResource'

const App = () => {
  const [notes, noteService] = useResource('http://localhost:3001/notes')
  const [persons, personService] = useResource('http://localhost:3001/persons')

  const handleNoteSubmit = async (event) => {
    event.preventDefault()
    const content = event.target.note.value
    await noteService.create({ content, important: true })
  }

  return (
    <div>
      <h2>notes</h2>
      <form onSubmit={handleNoteSubmit}>
        <input name="note" />
        <button>create</button>
      </form>
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      {persons.map(p => <p key={p.id}>{p.name}</p>)}
    </div>
  )
}

export default App
```

**Key Points:**
- Returns array: `[resources, service]`
- Handles fetching and creating resources
- Reusable for any API endpoint
- Similar to React Query but simpler

## useFetch Hook

Hook for fetching data with loading and error states:

```js
// src/hooks/useFetch.js
import { useState, useEffect } from 'react'

const useFetch = (url) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Failed to fetch')
        }
        const json = await response.json()
        setData(json)
        setError(null)
      } catch (err) {
        setError(err.message)
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [url])

  return { data, loading, error }
}

export default useFetch
```

**Usage:**

```js
// src/components/UserProfile.jsx
import useFetch from '../hooks/useFetch'

const UserProfile = ({ userId }) => {
  const { data, loading, error } = useFetch(`/api/users/${userId}`)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!data) return null

  return (
    <div>
      <h2>{data.name}</h2>
      <p>{data.email}</p>
    </div>
  )
}

export default UserProfile
```

## useLocalStorage Hook

Hook for syncing state with localStorage:

```js
// src/hooks/useLocalStorage.js
import { useState, useEffect } from 'react'

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      return initialValue
    }
  })

  const setValue = (value) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(error)
    }
  }

  return [storedValue, setValue]
}

export default useLocalStorage
```

**Usage:**

```js
// src/components/Settings.jsx
import useLocalStorage from '../hooks/useLocalStorage'

const Settings = () => {
  const [theme, setTheme] = useLocalStorage('theme', 'light')
  const [language, setLanguage] = useLocalStorage('language', 'en')

  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Spanish</option>
      </select>
    </div>
  )
}

export default Settings
```

## useToggle Hook

Simple hook for boolean state:

```js
// src/hooks/useToggle.js
import { useState } from 'react'

const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue)

  const toggle = () => {
    setValue(!value)
  }

  return [value, toggle]
}

export default useToggle
```

**Usage:**

```js
// src/components/Modal.jsx
import useToggle from '../hooks/useToggle'

const Modal = () => {
  const [isOpen, toggle] = useToggle(false)

  return (
    <div>
      <button onClick={toggle}>Toggle Modal</button>
      {isOpen && (
        <div className="modal">
          <p>Modal content</p>
          <button onClick={toggle}>Close</button>
        </div>
      )}
    </div>
  )
}

export default Modal
```

## useDebounce Hook

Hook for debouncing values:

```js
// src/hooks/useDebounce.js
import { useState, useEffect } from 'react'

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
```

**Usage:**

```js
// src/components/Search.jsx
import { useState } from 'react'
import useDebounce from '../hooks/useDebounce'

const Search = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Perform search API call
      console.log('Searching for:', debouncedSearchTerm)
    }
  }, [debouncedSearchTerm])

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  )
}

export default Search
```

## useCountry Hook

Hook for fetching country data from REST Countries API:

```js
// src/hooks/useCountry.js
import { useState, useEffect } from 'react'

const useCountry = (name) => {
  const [country, setCountry] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!name) {
      setCountry(null)
      return
    }

    const fetchCountry = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(
          `https://restcountries.com/v3.1/name/${name}?fullText=true`
        )
        
        if (!response.ok) {
          throw new Error('Country not found')
        }

        const data = await response.json()
        setCountry(data[0])
      } catch (err) {
        setError(err.message)
        setCountry(null)
      } finally {
        setLoading(false)
      }
    }

    fetchCountry()
  }, [name])

  return { country, loading, error }
}

export default useCountry
```

**Usage:**

```js
// src/components/CountryInfo.jsx
import { useState } from 'react'
import useCountry from '../hooks/useCountry'

const CountryInfo = () => {
  const [name, setName] = useState('')
  const { country, loading, error } = useCountry(name)

  const handleSubmit = (event) => {
    event.preventDefault()
    setName(event.target.country.value)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input name="country" />
        <button>find</button>
      </form>

      {country && (
        <div>
          <h3>{country.name.common}</h3>
          <p>capital {country.capital[0]}</p>
          <p>population {country.population}</p>
          <img
            src={country.flags.png}
            alt={`flag of ${country.name.common}`}
            height="100"
          />
        </div>
      )}
    </div>
  )
}

export default CountryInfo
```

**Key Points:**
- Fetches country data from REST Countries API
- Handles loading and error states
- Returns country object with data
- Only fetches when name changes
- Handles case when country not found

## Custom Hook Best Practices

### 1. Naming Convention

Always start custom hooks with "use":

```js
// ✅ Good
const useCounter = () => { ... }
const useField = () => { ... }

// ❌ Bad
const counter = () => { ... }
const field = () => { ... }
```

### 2. Return Values

Return objects or arrays consistently:

```js
// Object return (named properties)
const useCounter = () => {
  return { value, increase, decrease }
}

// Array return (destructured)
const useCounter = () => {
  return [value, increase, decrease]
}
```

### 3. Single Responsibility

Each hook should do one thing:

```js
// ✅ Good - Single responsibility
const useCounter = () => { ... }
const useField = () => { ... }

// ❌ Bad - Multiple responsibilities
const useCounterAndField = () => { ... }
```

### 4. Extract Complex Logic

Move complex logic from components to hooks:

```js
// Before: Complex logic in component
const Component = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Complex fetching logic...
  }, [])

  // Component logic...
}

// After: Logic in custom hook
const Component = () => {
  const { data, loading, error } = useFetch('/api/data')
  // Clean component logic...
}
```

### 5. Reusability

Design hooks to be reusable:

```js
// ✅ Good - Reusable
const useField = (type) => {
  // Works for any input type
}

// ❌ Bad - Too specific
const useUsernameField = () => {
  // Only works for username
}
```

## Complete Example: Notes App with Custom Hooks

### useField Hook

```js
// src/hooks/useField.js
import { useState } from 'react'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const reset = () => {
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    reset
  }
}

export default useField
```

### NoteForm Component

```js
// src/components/NoteForm.jsx
import useField from '../hooks/useField'

const NoteForm = ({ createNote }) => {
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')

  const handleSubmit = (event) => {
    event.preventDefault()
    createNote({
      content: content.value,
      author: author.value,
      info: info.value
    })
    content.reset()
    author.reset()
    info.reset()
  }

  // Destructure to exclude reset when spreading
  const { reset: resetContent, ...contentProps } = content
  const { reset: resetAuthor, ...authorProps } = author
  const { reset: resetInfo, ...infoProps } = info

  return (
    <div>
      <h2>create a new note</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...contentProps} />
        </div>
        <div>
          author
          <input {...authorProps} />
        </div>
        <div>
          url for more info
          <input {...infoProps} />
        </div>
        <button>create</button>
      </form>
    </div>
  )
}

export default NoteForm
```

## Testing Custom Hooks

Custom hooks can be tested using `@testing-library/react-hooks`:

```js
// src/hooks/useCounter.test.js
import { renderHook, act } from '@testing-library/react-hooks'
import useCounter from './useCounter'

test('should increment counter', () => {
  const { result } = renderHook(() => useCounter())

  act(() => {
    result.current.increase()
  })

  expect(result.current.value).toBe(1)
})
```

## Common Custom Hook Patterns

### 1. State Management

```js
const useCounter = () => {
  const [value, setValue] = useState(0)
  // ... logic
  return { value, increase, decrease }
}
```

### 2. API Calls

```js
const useFetch = (url) => {
  const [data, setData] = useState(null)
  // ... fetching logic
  return { data, loading, error }
}
```

### 3. Form Handling

```js
const useField = (type) => {
  const [value, setValue] = useState('')
  // ... form logic
  return { type, value, onChange, reset }
}
```

### 4. Browser APIs

```js
const useLocalStorage = (key, initialValue) => {
  // ... localStorage logic
  return [value, setValue]
}
```

### 5. Event Listeners

```js
const useWindowSize = () => {
  const [size, setSize] = useState({ width: 0, height: 0 })
  // ... window resize logic
  return size
}
```

## File Structure

```
src/
  ├── hooks/
  │   ├── useCounter.js          # Counter logic
  │   ├── useField.js            # Form field logic
  │   ├── useResource.js         # API resource logic
  │   ├── useFetch.js            # Fetching logic
  │   └── useLocalStorage.js     # localStorage logic
  ├── components/
  │   ├── Counter.jsx           # Uses useCounter
  │   ├── NoteForm.jsx           # Uses useField
  │   └── UserProfile.jsx        # Uses useFetch
  └── App.jsx                    # Main app
```

## Exercises

### 7.4: Custom hooks step 1

Create a custom hook called `useField` for managing the state of a form field.

The hook should return an object with the properties `type`, `value`, `onChange`, and `reset`.

**Details:**
- Create useField hook
- Accept type as parameter
- Return object with type, value, onChange, reset
- Use in form components
- Test with different input types

### 7.5: Custom hooks step 2

Spread the attributes of the `useField` hook in the form inputs.

**Details:**
- Use spread operator with useField
- Apply to all form inputs
- Verify all attributes are passed correctly
- Clean up form code

### 7.6: Custom hooks step 3

If you haven't done so already, extract the logic for communicating with the backend into its own custom hook.

**Details:**
- Create useResource hook
- Handle fetching and creating resources
- Return resources and service object
- Use in multiple components
- Support different API endpoints

### 7.7: Ultimate hooks

The code of the application responsible for communicating with the backend of the application should be moved to its own file under the directory `services`.

**Details:**
- Move API communication to services directory
- Create service modules for different resources
- Import and use services in hooks
- Keep hooks focused on state management

### 7.8: Ultimate hooks

Create a custom hook called `useCountry` for fetching country data from the REST Countries API.

The hook should take a country name as a parameter and return the country data.

**Details:**
- Create useCountry hook
- Fetch data from REST Countries API
- Handle loading and error states
- Return country data
- Use in components to display country information
