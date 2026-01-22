# Database and User Administration - Summary

This section covers refactoring the GraphQL backend, integrating MongoDB with Mongoose, and implementing user management with authentication.

## Backend Refactoring

### Problem with Monolithic Code

As applications grow, having all code in one file becomes:
- Hard to read and maintain
- Difficult to test
- Poor separation of concerns

### Solution: Modular Structure

Split backend into separate modules:

```
backend/
├── index.js          # Main entry point
├── server.js         # Apollo Server setup
├── schema.js         # GraphQL schema
├── resolvers.js      # GraphQL resolvers
├── db.js            # Database connection
└── models/          # Mongoose models
    ├── person.js
    └── user.js
```

### Schema Module

```js
// schema.js
const typeDefs = /* GraphQL */ `
  type Address {
    street: String!
    city: String!
  }

  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }

  enum YesNo {
    YES
    NO
  }

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person!]!
    findPerson(name: String!): Person
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
    editNumber(name: String!, phone: String!): Person
  }
`

module.exports = typeDefs
```

**Benefits:**
- Single source of truth for schema
- Easy to maintain
- Can be shared or validated

### Resolvers Module

```js
// resolvers.js
const { GraphQLError } = require('graphql')
const Person = require('./models/person')

const resolvers = {
  Query: {
    personCount: async () => Person.collection.countDocuments(),
    allPersons: async (root, args) => {
      if (!args.phone) {
        return Person.find({})
      }
      return Person.find({ phone: { $exists: args.phone === 'YES' } })
    },
    findPerson: async (root, args) => Person.findOne({ name: args.name }),
  },
  Person: {
    address: ({ street, city }) => {
      return { street, city }
    },
  },
  Mutation: {
    addPerson: async (root, args) => {
      // mutation logic
    },
    editNumber: async (root, args) => {
      // mutation logic
    },
  },
}

module.exports = resolvers
```

**Benefits:**
- Separates business logic
- Easier to test
- Clear responsibilities

### Server Module

```js
// server.js
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const resolvers = require('./resolvers')
const typeDefs = require('./schema')

const startServer = (port) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  startStandaloneServer(server, {
    listen: { port },
  }).then(({ url }) => {
    console.log(`Server ready at ${url}`)
  })
}

module.exports = startServer
```

**Benefits:**
- Reusable server setup
- Can be tested independently
- Easy to configure

### Main Entry Point

```js
// index.js
require('dotenv').config()

const connectToDatabase = require('./db')
const startServer = require('./server')

const MONGODB_URI = process.env.MONGODB_URI
const PORT = process.env.PORT || 4000

const main = async () => {
  await connectToDatabase(MONGODB_URI)
  startServer(PORT)
}

main()
```

**Responsibilities:**
- Load environment variables
- Connect to database
- Start server
- Handle startup order

## MongoDB Integration

### Installation

```bash
npm install mongoose
npm install dotenv
```

### Database Connection Module

```js
// db.js
const mongoose = require('mongoose')

const connectToDatabase = async (uri) => {
  console.log('connecting to database URI:', uri)

  try {
    await mongoose.connect(uri)
    console.log('connected to MongoDB')
  } catch (error) {
    console.log('error connection to MongoDB:', error.message)
    process.exit(1)
  }
}

module.exports = connectToDatabase
```

**Features:**
- Async connection handling
- Error handling
- Process exit on failure

### Mongoose Schema

```js
// models/person.js
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5
  },
  phone: {
    type: String,
    minlength: 5
  },
  street: {
    type: String,
    required: true,
    minlength: 5
  },
  city: {
    type: String,
    required: true,
    minlength: 3
  },
})

module.exports = mongoose.model('Person', schema)
```

**Key Points:**
- Schema defines structure
- Validations at database level
- `required: true` for mandatory fields
- `minlength` for string validation

### Environment Variables

```bash
# .env
MONGODB_URI=mongodb://localhost:27017/phonebook
PORT=4000
JWT_SECRET=your-secret-key
```

**Security:**
- Never commit `.env` to version control
- Use different secrets for dev/prod
- Add `.env` to `.gitignore`

### Updating Resolvers for MongoDB

**Before (In-Memory):**
```js
allPersons: () => persons
```

**After (MongoDB):**
```js
allPersons: async (root, args) => {
  if (!args.phone) {
    return Person.find({})
  }
  return Person.find({ phone: { $exists: args.phone === 'YES' } })
}
```

**Key Changes:**
- Resolvers become `async`
- Return promises (Mongoose queries)
- Apollo waits for promises to resolve
- Use Mongoose query methods

### Filtering with MongoDB

```js
allPersons: async (root, args) => {
  if (!args.phone) {
    return Person.find({})
  }
  
  // Filter by phone existence
  return Person.find({ 
    phone: { $exists: args.phone === 'YES' } 
  })
}
```

**MongoDB Operators:**
- `$exists: true` - field exists
- `$exists: false` - field doesn't exist
- `$in` - value in array
- `$gt`, `$lt` - greater/less than

### Automatic ID Conversion

GraphQL automatically converts MongoDB's `_id` to `id`:
- No manual conversion needed
- Works for all objects with `_id`
- Consistent with GraphQL schema

## Validation and Error Handling

### Mongoose Validation

```js
// models/person.js
const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5
  },
  // ...
})
```

**Validation Types:**
- `required: true` - field must exist
- `minlength` - minimum string length
- `maxlength` - maximum string length
- `min` / `max` - number range
- Custom validators

### Error Handling in Mutations

```js
Mutation: {
  addPerson: async (root, args) => {
    const nameExists = await Person.exists({ name: args.name })

    if (nameExists) {
      throw new GraphQLError(`Name must be unique: ${args.name}`, {
        extensions: {
          code: 'BAD_USER_INPUT',
          invalidArgs: args.name,
        },
      })
    }

    const person = new Person({ ...args })

    try {
      await person.save()
    } catch (error) {
      throw new GraphQLError(`Saving person failed: ${error.message}`, {
        extensions: {
          code: 'BAD_USER_INPUT',
          invalidArgs: args.name,
          error
        }
      })
    }

    return person
  },
}
```

**Error Handling Strategy:**
1. Check business rules (e.g., uniqueness)
2. Create model instance
3. Try to save
4. Catch validation errors
5. Throw GraphQLError with details

**Error Extensions:**
- `code`: Error category (BAD_USER_INPUT, UNAUTHENTICATED)
- `invalidArgs`: Which arguments caused error
- `error`: Original error object

## User Management

### User Schema

```js
// models/user.js
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3
  },
  friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Person'
    }
  ],
})

module.exports = mongoose.model('User', schema)
```

**Key Features:**
- `username`: Unique identifier
- `friends`: Array of Person references
- `ref: 'Person'`: Enables population

### Extended GraphQL Schema

```graphql
type User {
  username: String!
  friends: [Person!]!
  id: ID!
}

type Token {
  value: String!
}

type Query {
  # ... existing queries
  me: User
}

type Mutation {
  # ... existing mutations
  createUser(username: String!): User
  login(username: String!, password: String!): Token
  addAsFriend(name: String!): User
}
```

### JWT Authentication

**Installation:**
```bash
npm install jsonwebtoken
```

**Login Mutation:**
```js
const jwt = require('jsonwebtoken')
const User = require('./models/user')

Mutation: {
  login: async (root, args) => {
    const user = await User.findOne({ username: args.username })

    if (!user || args.password !== 'secret') {
      throw new GraphQLError('wrong credentials', {
        extensions: {
          code: 'BAD_USER_INPUT'
        }
      })
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
  },
}
```

**Key Points:**
- Hardcoded password for simplicity (use bcrypt in production)
- JWT token contains user info
- Token signed with secret from environment

### Create User Mutation

```js
Mutation: {
  createUser: async (root, args) => {
    const user = new User({ username: args.username })

    return user.save()
      .catch(error => {
        throw new GraphQLError(`Creating the user failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error
          }
        })
      })
  },
}
```

## GraphQL Context

### What is Context?

Context is an object passed to all resolvers containing:
- Shared data across queries/mutations
- Current user information
- Database connections
- Request metadata

### Setting Up Context

```js
// server.js
const jwt = require('jsonwebtoken')
const User = require('./models/user')

const getUserFromAuthHeader = async (auth) => {
  if (!auth || !auth.startsWith('Bearer ')) {
    return null
  }

  const decodedToken = jwt.verify(
    auth.substring(7), 
    process.env.JWT_SECRET
  )
  
  return User.findById(decodedToken.id).populate('friends')
}

const startServer = (port) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  })

  startStandaloneServer(server, {
    listen: { port },
    context: async ({ req }) => {
      const auth = req.headers.authorization
      const currentUser = await getUserFromAuthHeader(auth)
      return { currentUser }
    },
  }).then(({ url }) => {
    console.log(`Server ready at ${url}`)
  })
}
```

**Context Flow:**
1. Extract `Authorization` header from request
2. Verify JWT token
3. Find user in database
4. Populate friends list
5. Return user object (or null)
6. Make available to all resolvers

### Using Context in Resolvers

```js
Query: {
  me: (root, args, context) => {
    return context.currentUser
  }
}
```

**Resolver Parameters:**
1. `root`: Result from parent resolver
2. `args`: Query/mutation arguments
3. `context`: Shared context object
4. `info`: Query metadata

### Authentication Check

```js
Mutation: {
  addPerson: async (root, args, context) => {
    const currentUser = context.currentUser

    if (!currentUser) {
      throw new GraphQLError('not authenticated', {
        extensions: {
          code: 'UNAUTHENTICATED',
        }
      })
    }

    // ... rest of mutation
  },
}
```

**Error Codes:**
- `UNAUTHENTICATED`: User not logged in
- `BAD_USER_INPUT`: Invalid input data
- `FORBIDDEN`: User lacks permission

### Destructuring Context

```js
// Instead of:
addAsFriend: async (root, args, context) => {
  const currentUser = context.currentUser
  // ...
}

// Use destructuring:
addAsFriend: async (root, args, { currentUser }) => {
  // currentUser is directly available
  // ...
}
```

## Friends List

### Adding Person to Friends

```js
Mutation: {
  addPerson: async (root, args, { currentUser }) => {
    if (!currentUser) {
      throw new GraphQLError('not authenticated', {
        extensions: { code: 'UNAUTHENTICATED' }
      })
    }

    const person = new Person({ ...args })
    await person.save()

    // Add to user's friends list
    currentUser.friends = currentUser.friends.concat(person)
    await currentUser.save()

    return person
  },
}
```

**Key Points:**
- Person automatically added to creator's friends
- Friends list stored in User model
- Use `concat` to add without mutating

### Add As Friend Mutation

```js
Mutation: {
  addAsFriend: async (root, args, { currentUser }) => {
    if (!currentUser) {
      throw new GraphQLError('not authenticated', {
        extensions: { code: 'UNAUTHENTICATED' }
      })
    }

    const person = await Person.findOne({ name: args.name })

    if (!person) {
      throw new GraphQLError("The name didn't found", {
        extensions: {
          code: 'BAD_USER_INPUT',
          invalidArgs: args.name,
        }
      })
    }

    // Check if already a friend
    const nonFriendAlready = (person) =>
      !currentUser.friends
        .map((f) => f._id.toString())
        .includes(person._id.toString())

    if (nonFriendAlready(person)) {
      currentUser.friends = currentUser.friends.concat(person)
      await currentUser.save()
    }

    return currentUser
  },
}
```

**Features:**
- Check if person exists
- Prevent duplicate friends
- Return updated user

### Querying Friends

```graphql
query {
  me {
    username
    friends {
      name
      phone
      address {
        street
        city
      }
    }
  }
}
```

**Population:**
- `populate('friends')` in context loads full Person objects
- GraphQL automatically resolves nested fields
- No additional queries needed

## Best Practices

### 1. Modular Structure

```
✅ Good: Separate files by responsibility
❌ Bad: Everything in one file
```

### 2. Error Handling

```js
✅ Good: Try-catch with GraphQLError
try {
  await person.save()
} catch (error) {
  throw new GraphQLError(`Error: ${error.message}`, {
    extensions: { code: 'BAD_USER_INPUT' }
  })
}

❌ Bad: Let errors propagate unhandled
await person.save() // Might throw unhandled error
```

### 3. Authentication

```js
✅ Good: Check authentication early
if (!currentUser) {
  throw new GraphQLError('not authenticated', {
    extensions: { code: 'UNAUTHENTICATED' }
  })
}

❌ Bad: Assume user is authenticated
// No check - might fail later
```

### 4. Database Validation

```js
✅ Good: Validate at database level
const schema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 5 }
})

❌ Bad: Only validate in GraphQL
// No database constraints
```

### 5. Context Usage

```js
✅ Good: Destructure context
addPerson: async (root, args, { currentUser }) => {
  // ...
}

❌ Bad: Access context directly
addPerson: async (root, args, context) => {
  const user = context.currentUser
  // ...
}
```

## Common Patterns

### Async Resolver Pattern

```js
Query: {
  allPersons: async (root, args) => {
    // Always return promise
    return Person.find({})
  }
}
```

### Authentication Pattern

```js
Mutation: {
  protectedMutation: async (root, args, { currentUser }) => {
    if (!currentUser) {
      throw new GraphQLError('not authenticated', {
        extensions: { code: 'UNAUTHENTICATED' }
      })
    }
    // ... mutation logic
  }
}
```

### Error Handling Pattern

```js
try {
  await model.save()
} catch (error) {
  throw new GraphQLError(`Operation failed: ${error.message}`, {
    extensions: {
      code: 'BAD_USER_INPUT',
      error
    }
  })
}
```

## Exercises

The exercises (8.13-8.16) involve:
- Refactoring library backend
- Integrating MongoDB
- Adding user management
- Implementing authentication
