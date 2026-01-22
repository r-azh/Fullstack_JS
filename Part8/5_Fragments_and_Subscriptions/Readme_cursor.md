# Fragments and Subscriptions - Summary

This section covers GraphQL fragments for reusable field selections and subscriptions for real-time updates using WebSockets.

## GraphQL Fragments

### Problem: Repeated Field Selections

Multiple queries often need the same fields:

```graphql
query {
  findPerson(name: "Pekka Mikkola") {
    name
    phone
    address {
      street
      city
    }
  }
}

query {
  allPersons {
    name
    phone
    address {
      street
      city
    }
  }
}
```

**Issues:**
- Duplicate field definitions
- Hard to maintain
- Easy to miss fields
- Inconsistent selections

### Solution: Fragments

Fragments allow reusable field selections:

```graphql
fragment PersonDetails on Person {
  name
  phone
  address {
    street
    city
  }
}
```

**Usage:**
```graphql
query {
  allPersons {
    ...PersonDetails
  }
}

query {
  findPerson(name: "Pekka Mikkola") {
    ...PersonDetails
  }
}
```

### Fragment Definition

```js
// src/queries.js
const PERSON_DETAILS = gql`
  fragment PersonDetails on Person {
    id
    name
    phone
    address {
      street
      city
    }
  }
`
```

**Key Points:**
- Defined in client code (not schema)
- Must specify type (`on Person`)
- Can include nested fields
- Reusable across queries

### Using Fragments in Queries

**Method 1: Inline Fragment**
```js
export const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      ...PersonDetails
    }
  }

  fragment PersonDetails on Person {
    id
    name
    phone
    address {
      street
      city
    }
  }
`
```

**Method 2: Separate Fragment Variable**
```js
const PERSON_DETAILS = gql`
  fragment PersonDetails on Person {
    id
    name
    phone
    address {
      street
      city
    }
  }
`

export const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      ...PersonDetails
    }
  }

  ${PERSON_DETAILS}
`
```

**Benefits:**
- Single source of truth
- Easier maintenance
- Consistent field selection
- Reusable across queries/mutations

## Subscriptions

### What are Subscriptions?

Subscriptions enable real-time updates from server to client:
- Client subscribes to events
- Server pushes updates when events occur
- Uses WebSockets (not HTTP)
- Bidirectional communication

### Use Cases

- Real-time notifications
- Live data updates
- Chat applications
- Collaborative editing
- Live feeds

### Server Setup

#### Install Dependencies

```bash
npm install express cors @as-integrations/express5
npm install graphql-ws ws @graphql-tools/schema
npm install graphql-subscriptions
```

#### Express Middleware Setup

```js
// server.js
const { ApolloServer } = require('@apollo/server')
const { ApolloServerPluginDrainHttpServer } = require('@apollo/server/plugin/drainHttpServer')
const { expressMiddleware } = require('@as-integrations/express5')
const cors = require('cors')
const express = require('express')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const http = require('http')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/use/ws')

const resolvers = require('./resolvers')
const typeDefs = require('./schema')
const User = require('./models/user')

const getUserFromAuthHeader = async (auth) => {
  if (!auth || !auth.startsWith('Bearer ')) {
    return null
  }
  const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
  return User.findById(decodedToken.id).populate('friends')
}

const startServer = async (port) => {
  const app = express()
  const httpServer = http.createServer(app)

  // WebSocket server setup
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/',
  })

  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const serverCleanup = useServer({ schema }, wsServer)

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose()
            },
          }
        },
      },
    ],
  })

  await server.start()

  app.use(
    '/',
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req.headers.authorization
        const currentUser = await getUserFromAuthHeader(auth)
        return { currentUser }
      },
    }),
  )

  httpServer.listen(port, () =>
    console.log(`Server is now running on http://localhost:${port}`)
  )
}

module.exports = startServer
```

**Key Changes:**
- Express server instead of standalone
- WebSocket server for subscriptions
- `makeExecutableSchema` for schema
- `ApolloServerPluginDrainHttpServer` for cleanup
- Async function for server startup

### Subscription Schema

```graphql
type Subscription {
  personAdded: Person!
}
```

**Key Points:**
- Returns Person object
- Triggered when person added
- Real-time updates

### Subscription Resolver

```js
// resolvers.js
const { PubSub } = require('graphql-subscriptions')

const pubsub = new PubSub()

const resolvers = {
  // ...
  Mutation: {
    addPerson: async (root, args, context) => {
      // ... add person logic
      
      pubsub.publish('PERSON_ADDED', { personAdded: person })
      return person
    },
  },
  Subscription: {
    personAdded: {
      subscribe: () => pubsub.asyncIterableIterator('PERSON_ADDED')
    },
  },
}
```

**How It Works:**
1. Client subscribes to `personAdded`
2. Subscription resolver creates iterator
3. When mutation publishes event, all subscribers notified
4. WebSocket sends update to clients

### PubSub Pattern

**Publish:**
```js
pubsub.publish('PERSON_ADDED', { personAdded: person })
```

**Subscribe:**
```js
subscribe: () => pubsub.asyncIterableIterator('PERSON_ADDED')
```

**Key Points:**
- Event name: `'PERSON_ADDED'` (convention: uppercase)
- Payload: `{ personAdded: person }`
- Iterator manages subscribers
- Automatic cleanup

## Client Setup

### Install Dependencies

```bash
npm install graphql-ws
```

### Apollo Client Configuration

```js
// src/main.jsx
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import { setContext } from '@apollo/client/link/context'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { createClient } from 'graphql-ws'

const authLink = setContext(({ headers }) => {
  const token = localStorage.getItem('phonebook-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  }
})

const httpLink = new HttpLink({ uri: 'http://localhost:4000' })

const wsLink = new GraphQLWsLink(
  createClient({
    url: 'ws://localhost:4000',
  }),
)

const splitLink = ApolloLink.split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  authLink.concat(httpLink),
)

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: splitLink,
})
```

**Key Components:**
- `httpLink`: HTTP for queries/mutations
- `wsLink`: WebSocket for subscriptions
- `splitLink`: Routes operations to correct link
- `getMainDefinition`: Determines operation type

### Using Subscriptions

#### Define Subscription

```js
// src/queries.js
export const PERSON_ADDED = gql`
  subscription {
    personAdded {
      ...PersonDetails
    }
  }

  ${PERSON_DETAILS}
`
```

#### useSubscription Hook

```js
// src/App.jsx
import { useSubscription } from '@apollo/client/react'
import { PERSON_ADDED } from './queries'

const App = () => {
  useSubscription(PERSON_ADDED, {
    onData: ({ data }) => {
      const addedPerson = data.data.personAdded
      console.log(addedPerson)
      notify(`${addedPerson.name} added`)
    },
  })

  // ...
}
```

**Hook Parameters:**
- Subscription query
- Options object:
  - `onData`: Called when data received
  - `onError`: Called on error
  - `onComplete`: Called when subscription ends

## Cache Management with Subscriptions

### Problem: Duplicate Updates

When person added:
1. Mutation updates cache
2. Subscription also updates cache
3. Person appears twice

### Solution: Check Before Adding

```js
// src/utils/apolloCache.js
import { ALL_PERSONS } from '../queries'

export const addPersonToCache = (cache, personToAdd) => {
  cache.updateQuery({ query: ALL_PERSONS }, ({ allPersons }) => {
    const personExists = allPersons.some(
      (person) => person.id === personToAdd.id
    )

    if (personExists) {
      return { allPersons }
    }

    return {
      allPersons: allPersons.concat(personToAdd),
    }
  })
}
```

**How It Works:**
1. Check if person already in cache
2. If exists, return cache unchanged
3. If not, add person to cache
4. Prevents duplicates

### Using Helper Function

**In Subscription:**
```js
import { addPersonToCache } from './utils/apolloCache'

useSubscription(PERSON_ADDED, {
  onData: ({ data }) => {
    const addedPerson = data.data.personAdded
    notify(`${addedPerson.name} added`)
    addPersonToCache(client.cache, addedPerson)
  },
})
```

**In Mutation:**
```js
import { addPersonToCache } from '../utils/apolloCache'

const [createPerson] = useMutation(CREATE_PERSON, {
  onError: (error) => setError(error.message),
  update: (cache, response) => {
    const addedPerson = response.data.addPerson
    addPersonToCache(cache, addedPerson)
  },
})
```

**Benefits:**
- Single source of truth
- Prevents duplicates
- Consistent cache updates
- Reusable logic

## n+1 Problem

### What is n+1 Problem?

**Example:**
```graphql
query {
  allPersons {
    name
    friendOf {
      username
    }
  }
}
```

**Database Queries:**
```
Person.find()           # 1 query
User.find()             # Query for person 1
User.find()             # Query for person 2
User.find()             # Query for person 3
User.find()             # Query for person 4
User.find()             # Query for person 5
```

**Total: 1 + n queries** (where n = number of persons)

### Why It Happens

```js
Person: {
  friendOf: async (root) => {
    const friends = await User.find({
      friends: { $in: [root._id] }
    })
    return friends
  }
}
```

Each person triggers separate database query.

### Solutions

#### Solution 1: Populate in Query

```js
Query: {
  allPersons: async (root, args) => {
    if (!args.phone) {
      return Person.find({}).populate('friendOf')
    }
    return Person.find({ phone: { $exists: args.phone === 'YES' } })
      .populate('friendOf')
  },
}
```

**Benefits:**
- Single query with join
- Efficient
- Simple

**Drawbacks:**
- Always fetches related data
- May fetch unnecessary data

#### Solution 2: Store in Database

```js
// models/person.js
const schema = new mongoose.Schema({
  // ... other fields
  friendOf: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
})
```

Then populate when needed:
```js
Person.find({}).populate('friendOf')
```

#### Solution 3: DataLoader

DataLoader batches and caches queries:

```bash
npm install dataloader
```

```js
const DataLoader = require('dataloader')

const userLoader = new DataLoader(async (userIds) => {
  const users = await User.find({ _id: { $in: userIds } })
  return userIds.map(id => users.find(u => u._id.toString() === id))
})

Person: {
  friendOf: async (root) => {
    const users = await User.find({
      friends: { $in: [root._id] }
    })
    return userLoader.loadMany(users.map(u => u._id))
  }
}
```

**Benefits:**
- Automatic batching
- Caching
- Efficient
- Handles complex cases

### When to Optimize

**Don't optimize prematurely:**
- Only optimize when needed
- Measure performance first
- Consider trade-offs

**Optimize when:**
- Performance is actually a problem
- Profiling shows bottleneck
- User experience affected

## Best Practices

### Fragments

1. **Define once, use many:**
```js
// ✅ Good: Reusable fragment
const PERSON_DETAILS = gql`...`
export const FIND_PERSON = gql`... ${PERSON_DETAILS}`

// ❌ Bad: Duplicate fields
export const FIND_PERSON = gql`... name phone address ...`
```

2. **Use descriptive names:**
```js
// ✅ Good
fragment PersonDetails on Person { ... }

// ❌ Bad
fragment P on Person { ... }
```

3. **Keep fragments focused:**
```js
// ✅ Good: Specific fragment
fragment PersonBasic on Person {
  name
  phone
}

// ❌ Bad: Too broad
fragment Everything on Person {
  name phone address id friendOf ...
}
```

### Subscriptions

1. **Update cache carefully:**
```js
// ✅ Good: Check before adding
const personExists = allPersons.some(p => p.id === person.id)
if (!personExists) {
  // add to cache
}

// ❌ Bad: Always add
allPersons.concat(person)
```

2. **Handle errors:**
```js
// ✅ Good: Error handling
useSubscription(PERSON_ADDED, {
  onData: ({ data }) => { ... },
  onError: (error) => { ... }
})

// ❌ Bad: No error handling
useSubscription(PERSON_ADDED, {
  onData: ({ data }) => { ... }
})
```

3. **Clean up subscriptions:**
- Apollo handles cleanup automatically
- WebSocket closes when component unmounts
- No manual cleanup needed

### n+1 Problem

1. **Measure first:**
```js
// Add logging
console.log('Person.find')
console.log('User.find')
```

2. **Optimize when needed:**
- Only if performance is issue
- Consider trade-offs
- Test thoroughly

3. **Use appropriate solution:**
- Simple cases: populate
- Complex cases: DataLoader
- Store relationships when makes sense

## Common Patterns

### Fragment Pattern

```js
// Define fragment
const FRAGMENT = gql`
  fragment FragmentName on Type {
    field1
    field2
  }
`

// Use in query
export const QUERY = gql`
  query {
    field {
      ...FragmentName
    }
  }
  ${FRAGMENT}
`
```

### Subscription Pattern

```js
// Define subscription
export const SUBSCRIPTION = gql`
  subscription {
    eventName {
      ...FragmentName
    }
  }
  ${FRAGMENT}
`

// Use in component
useSubscription(SUBSCRIPTION, {
  onData: ({ data }) => {
    // Handle data
  },
})
```

### Cache Update Pattern

```js
const updateCache = (cache, newItem) => {
  cache.updateQuery({ query: ALL_ITEMS }, ({ allItems }) => {
    const exists = allItems.some(item => item.id === newItem.id)
    if (exists) return { allItems }
    return { allItems: allItems.concat(newItem) }
  })
}
```

## Exercises

The exercises (8.23-8.26) involve:
- Implementing bookAdded subscription
- Using subscriptions in client
- Keeping book view updated
- Solving n+1 problem
