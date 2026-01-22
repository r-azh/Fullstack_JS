# React and GraphQL - Summary

This section covers integrating React applications with GraphQL servers using Apollo Client, the most popular GraphQL client library.

## Apollo Client Setup

### Installation

```bash
npm install @apollo/client graphql
```

### Basic Setup

```js
// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import { ApolloClient, gql, HttpLink, InMemoryCache } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4000',
  }),
  cache: new InMemoryCache(),
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </StrictMode>,
)
```

**Key Components:**
- **ApolloClient**: Creates GraphQL client
- **HttpLink**: Configures HTTP connection to GraphQL server
- **InMemoryCache**: Caches query results
- **ApolloProvider**: Makes client available to all components

### Making Queries Programmatically

```js
// src/main.jsx
import { ApolloClient, gql, HttpLink, InMemoryCache } from '@apollo/client'

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4000',
  }),
  cache: new InMemoryCache(),
})

const query = gql`
  query {
    allPersons {
      name
      phone
      address {
        street
        city
      }
      id
    }
  }
`

client.query({ query }).then((response) => {
  console.log(response.data)
})
```

**gql Tag:**
- Template literal tag for GraphQL queries
- Enables syntax highlighting in VS Code
- Validates queries at build time
- Import from `@apollo/client`

## useQuery Hook

The `useQuery` hook is the primary way to fetch data in React components.

### Basic Usage

```js
// src/App.jsx
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'

const ALL_PERSONS = gql`
  query {
    allPersons {
      name
      phone
      id
    }
  }
`

const App = () => {
  const result = useQuery(ALL_PERSONS)

  if (result.loading) {
    return <div>loading...</div>
  }

  if (result.error) {
    return <div>Error: {result.error.message}</div>
  }

  return (
    <div>
      {result.data.allPersons.map(p => p.name).join(', ')}
    </div>
  )
}

export default App
```

**Result Object Properties:**
- `loading`: Boolean, true while query is in progress
- `error`: Error object if query failed
- `data`: Query result data
- `refetch`: Function to manually refetch query
- `networkStatus`: Current network status

### Loading and Error States

```js
const App = () => {
  const result = useQuery(ALL_PERSONS)

  if (result.loading) {
    return <div>loading...</div>
  }

  if (result.error) {
    return <div>Error: {result.error.message}</div>
  }

  return <Persons persons={result.data.allPersons} />
}
```

## Named Queries and Variables

### Query Variables

Use variables for dynamic queries:

```js
// src/queries.js
import { gql } from '@apollo/client'

export const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      name
      phone
      id
      address {
        street
        city
      }
    }
  }
`
```

**Key Points:**
- Query name: `findPersonByName`
- Variable: `$nameToSearch: String!`
- Variable used in query: `name: $nameToSearch`

### Using Variables with useQuery

```js
// src/components/Persons.jsx
import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { FIND_PERSON } from '../queries'

const Persons = ({ persons }) => {
  const [nameToSearch, setNameToSearch] = useState(null)
  
  const result = useQuery(FIND_PERSON, {
    variables: { nameToSearch },
    skip: !nameToSearch,
  })

  if (nameToSearch && result.data) {
    return (
      <Person
        person={result.data.findPerson}
        onClose={() => setNameToSearch(null)}
      />
    )
  }

  return (
    <div>
      <h2>Persons</h2>
      {persons.map((p) => (
        <div key={p.id}>
          {p.name} {p.phone}
          <button onClick={() => setNameToSearch(p.name)}>
            show address
          </button>
        </div>
      ))}
    </div>
  )
}
```

**useQuery Options:**
- `variables`: Object with query variables
- `skip`: Boolean to conditionally skip query
- `pollInterval`: Number of milliseconds to poll
- `refetchQueries`: Array of queries to refetch after mutation

## Apollo Client Cache

### Automatic Caching

Apollo Client automatically caches query results:

- Same query with same variables → served from cache
- No network request if data in cache
- Improves performance
- Reduces server load

### Cache Behavior

```js
// First query - fetches from server
const result1 = useQuery(FIND_PERSON, {
  variables: { nameToSearch: "Arto Hellas" }
})

// Second query with same variables - uses cache
const result2 = useQuery(FIND_PERSON, {
  variables: { nameToSearch: "Arto Hellas" }
})
```

**Cache Key:**
- Based on query name and variables
- Same query + same variables = cache hit

### Viewing Cache

Use Apollo Client Devtools browser extension to:
- View cached data
- Inspect queries
- Debug cache issues
- Monitor network requests

## Mutations

### useMutation Hook

```js
// src/queries.js
export const CREATE_PERSON = gql`
  mutation createPerson(
    $name: String!
    $street: String!
    $city: String!
    $phone: String
  ) {
    addPerson(name: $name, street: $street, city: $city, phone: $phone) {
      name
      phone
      id
      address {
        street
        city
      }
    }
  }
`
```

```js
// src/components/PersonForm.jsx
import { useState } from 'react'
import { useMutation } from '@apollo/client/react'
import { CREATE_PERSON } from '../queries'

const PersonForm = () => {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [street, setStreet] = useState('')
  const [city, setCity] = useState('')

  const [createPerson] = useMutation(CREATE_PERSON)

  const submit = (event) => {
    event.preventDefault()
    createPerson({ variables: { name, phone, street, city } })
    setName('')
    setPhone('')
    setStreet('')
    setCity('')
  }

  return (
    <form onSubmit={submit}>
      {/* form fields */}
    </form>
  )
}
```

**useMutation Returns:**
- Array: `[mutationFunction, resultObject]`
- `mutationFunction`: Call to execute mutation
- `resultObject`: Contains `loading`, `error`, `data`

## Updating Cache After Mutations

### Problem

After mutation, cache doesn't automatically update. New data doesn't appear until page refresh.

### Solution 1: Polling

```js
const App = () => {
  const result = useQuery(ALL_PERSONS, {
    pollInterval: 2000 // Poll every 2 seconds
  })
  // ...
}
```

**Pros:**
- Simple to implement
- Real-time updates

**Cons:**
- Unnecessary network traffic
- Page flickering
- Not efficient

### Solution 2: refetchQueries

```js
// src/components/PersonForm.jsx
import { ALL_PERSONS } from '../queries'

const PersonForm = () => {
  const [createPerson] = useMutation(CREATE_PERSON, {
    refetchQueries: [{ query: ALL_PERSONS }],
  })
  // ...
}
```

**Pros:**
- No unnecessary traffic
- Updates only when needed
- Can refetch multiple queries

**Cons:**
- Other users don't see updates immediately
- Extra network request after mutation

**Multiple Queries:**
```js
const [createPerson] = useMutation(CREATE_PERSON, {
  refetchQueries: [
    { query: ALL_PERSONS },
    { query: OTHER_QUERY },
    { query: ANOTHER_QUERY },
  ],
})
```

### Solution 3: Update Cache Directly

More advanced - update cache manually (covered in later sections).

## Error Handling

### Mutation Errors

```js
// src/components/PersonForm.jsx
const PersonForm = ({ setError }) => {
  const [createPerson] = useMutation(CREATE_PERSON, {
    refetchQueries: [{ query: ALL_PERSONS }],
    onError: (error) => {
      setError(error.message)
    },
  })
  // ...
}
```

**onError Callback:**
- Called when mutation fails
- Receives error object
- Can display error message

### onCompleted Callback

```js
// src/components/PhoneForm.jsx
const PhoneForm = ({ setError }) => {
  const [changeNumber] = useMutation(EDIT_NUMBER, {
    onCompleted: (data) => {
      if (!data.editNumber) {
        setError('person not found')
      }
    },
  })
  // ...
}
```

**onCompleted Callback:**
- Called when mutation succeeds
- Receives response data
- Useful for handling null responses
- Can check if operation actually succeeded

### Error Notification Component

```js
// src/components/Notify.jsx
const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null
  }
  return (
    <div style={{ color: 'red' }}>
      {errorMessage}
    </div>
  )
}

export default Notify
```

```js
// src/App.jsx
import { useState } from 'react'
import Notify from './components/Notify'

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  return (
    <div>
      <Notify errorMessage={errorMessage} />
      {/* other components */}
    </div>
  )
}
```

## Organizing Queries

### Separate Queries File

```js
// src/queries.js
import { gql } from '@apollo/client'

export const ALL_PERSONS = gql`
  query {
    allPersons {
      name
      phone
      id
    }
  }
`

export const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      name
      phone
      id
      address {
        street
        city
      }
    }
  }
`

export const CREATE_PERSON = gql`
  mutation createPerson(
    $name: String!
    $street: String!
    $city: String!
    $phone: String
  ) {
    addPerson(name: $name, street: $street, city: $city, phone: $phone) {
      name
      phone
      id
      address {
        street
        city
      }
    }
  }
`

export const EDIT_NUMBER = gql`
  mutation editNumber($name: String!, $phone: String!) {
    editNumber(name: $name, phone: $phone) {
      name
      phone
      address {
        street
        city
      }
      id
    }
  }
`
```

**Benefits:**
- Reusable queries
- Single source of truth
- Easier to maintain
- Better organization

## Automatic Cache Updates

### ID-based Updates

When mutations return objects with `id` field, Apollo automatically updates cache:

```js
// Mutation returns person with id
mutation {
  editNumber(name: "Arto", phone: "123") {
    id
    name
    phone
  }
}
```

Apollo finds cached object with same `id` and updates it automatically.

**Requirements:**
- Object must have `id` field
- `id` must be unique
- Mutation must return updated object

## Apollo Client vs Redux

### State Management

**Apollo Client:**
- Manages server state
- Caches GraphQL queries
- Handles loading/error states
- Automatic cache updates

**Redux:**
- Manages client state
- Manual state updates
- More boilerplate
- Better for complex client state

### When to Use What

**Use Apollo Client for:**
- Server data fetching
- GraphQL APIs
- Caching server responses
- Loading/error states

**Use Redux for:**
- Complex client state
- State shared across many components
- State not from server
- When not using GraphQL

**Use Both:**
- Apollo for server state
- Redux for client state
- Can coexist in same app

## Best Practices

### 1. Organize Queries

```js
// ✅ Good: Separate queries file
import { ALL_PERSONS } from './queries'

// ❌ Bad: Inline queries everywhere
const query = gql`query { ... }`
```

### 2. Handle Loading States

```js
// ✅ Good: Show loading indicator
if (result.loading) return <div>loading...</div>

// ❌ Bad: Access data without checking
return <div>{result.data.allPersons.map(...)}</div>
```

### 3. Handle Errors

```js
// ✅ Good: Show error message
if (result.error) return <div>Error: {result.error.message}</div>

// ❌ Bad: Ignore errors
```

### 4. Use Variables for Dynamic Queries

```js
// ✅ Good: Use variables
query findPerson($name: String!) {
  findPerson(name: $name) { ... }
}

// ❌ Bad: Hardcode values
query {
  findPerson(name: "Arto") { ... }
}
```

### 5. Update Cache After Mutations

```js
// ✅ Good: Refetch queries
const [createPerson] = useMutation(CREATE_PERSON, {
  refetchQueries: [{ query: ALL_PERSONS }],
})

// ❌ Bad: Don't update cache
const [createPerson] = useMutation(CREATE_PERSON)
```

### 6. Use Skip for Conditional Queries

```js
// ✅ Good: Skip when not needed
const result = useQuery(FIND_PERSON, {
  variables: { nameToSearch },
  skip: !nameToSearch,
})

// ❌ Bad: Always execute query
const result = useQuery(FIND_PERSON, {
  variables: { nameToSearch: nameToSearch || "" },
})
```

## Common Patterns

### Conditional Rendering

```js
const Component = () => {
  const result = useQuery(QUERY)

  if (result.loading) return <div>Loading...</div>
  if (result.error) return <div>Error: {result.error.message}</div>
  if (!result.data) return null

  return <div>{/* render data */}</div>
}
```

### Form with Mutation

```js
const Form = () => {
  const [formData, setFormData] = useState({})
  const [createItem] = useMutation(CREATE_ITEM, {
    refetchQueries: [{ query: ALL_ITEMS }],
    onError: (error) => console.error(error),
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    createItem({ variables: formData })
    setFormData({})
  }

  return <form onSubmit={handleSubmit}>{/* form fields */}</form>
}
```

### List with Detail View

```js
const List = () => {
  const [selectedId, setSelectedId] = useState(null)
  const listResult = useQuery(ALL_ITEMS)
  const detailResult = useQuery(GET_ITEM, {
    variables: { id: selectedId },
    skip: !selectedId,
  })

  if (listResult.loading) return <div>Loading...</div>

  return (
    <div>
      {listResult.data.allItems.map(item => (
        <div key={item.id} onClick={() => setSelectedId(item.id)}>
          {item.name}
        </div>
      ))}
      {selectedId && detailResult.data && (
        <Detail item={detailResult.data.getItem} />
      )}
    </div>
  )
}
```

## Exercises

The exercises (8.8-8.12) involve implementing a React frontend for the GraphQL library application.
