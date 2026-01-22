# GraphQL Server - Summary

This section introduces GraphQL as an alternative to REST for building APIs. GraphQL allows clients to request exactly the data they need with a single query.

## GraphQL vs REST

### REST Philosophy

**Resource-based:**
- Each resource has its own URL (e.g., `/users/10`)
- Operations depend on HTTP method (GET, POST, PUT, DELETE)
- Multiple requests often needed for complex data
- Returns fixed data structure

**Example REST Problem:**
To get blogs from users who commented on blogs of followed users:
- Multiple HTTP requests required
- Lots of unnecessary data returned
- Complex client-side code

### GraphQL Philosophy

**Query-based:**
- Single endpoint for all queries
- Client specifies exactly what data it needs
- One request can fetch complex, nested data
- Returns only requested fields

**Example GraphQL Solution:**
```graphql
query FetchBlogsQuery {
  user(username: "mluukkai") {
    followedUsers {
      blogs {
        comments {
          user {
            blogs {
              title
            }
          }
        }
      }
    }
  }
}
```

**Benefits:**
- Single query gets all needed data
- No over-fetching or under-fetching
- Simple client code
- Self-documenting API

## GraphQL Basics

### Schema

The schema describes the data structure and available operations.

**Example Schema:**
```graphql
type Person {
  name: String!
  phone: String
  street: String!
  city: String!
  id: ID!
}

type Query {
  personCount: Int!
  allPersons: [Person!]!
  findPerson(name: String!): Person
}
```

**Key Concepts:**
- **Types**: Define data structures (e.g., `Person`)
- **Fields**: Properties of types (e.g., `name`, `phone`)
- **Scalar Types**: Built-in types (`String`, `Int`, `ID`, `Boolean`, `Float`)
- **Non-Null**: `!` means field is required
- **Lists**: `[Type!]!` means list of non-null items, list itself is non-null
- **Query**: Defines what queries can be made

### Queries

**Simple Query:**
```graphql
query {
  personCount
}
```

**Response:**
```json
{
  "data": {
    "personCount": 3
  }
}
```

**Query with Fields:**
```graphql
query {
  allPersons {
    name
    phone
  }
}
```

**Response:**
```json
{
  "data": {
    "allPersons": [
      {
        "name": "Arto Hellas",
        "phone": "040-123543"
      },
      {
        "name": "Matti Luukkainen",
        "phone": "040-432342"
      }
    ]
  }
}
```

**Query with Parameters:**
```graphql
query {
  findPerson(name: "Arto Hellas") {
    phone
    city
    street
    id
  }
}
```

**Response:**
```json
{
  "data": {
    "findPerson": {
      "phone": "040-123543",
      "city": "Espoo",
      "street": "Tapiolankatu 5 A",
      "id": "3d594650-3436-11e9-bc57-8b80ba54c431"
    }
  }
}
```

**Nullable Return:**
If person not found:
```json
{
  "data": {
    "findPerson": null
  }
}
```

## Apollo Server Setup

### Installation

```bash
npm install @apollo/server graphql
```

### Basic Server

```js
// index.js
const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')

let persons = [
  {
    name: "Arto Hellas",
    phone: "040-123543",
    street: "Tapiolankatu 5 A",
    city: "Espoo",
    id: "3d594650-3436-11e9-bc57-8b80ba54c431"
  },
  // ... more persons
]

const typeDefs = `
  type Person {
    name: String!
    phone: String
    street: String!
    city: String!
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons: [Person!]!
    findPerson(name: String!): Person
  }
`

const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) =>
      persons.find(p => p.name === args.name)
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
```

**Key Components:**
1. **typeDefs**: GraphQL schema as string
2. **resolvers**: Functions that resolve queries
3. **ApolloServer**: Creates GraphQL server
4. **startStandaloneServer**: Starts server

### Apollo Studio Explorer

When server runs, visit `http://localhost:4000` for GraphQL Studio Explorer:
- Interactive query editor
- Auto-generated API documentation
- Test queries visually

### VS Code Syntax Highlighting

Add `/* GraphQL */` comment before schema string:

```js
const typeDefs = /* GraphQL */ `
  type Person {
    name: String!
    phone: String
  }
`
```

Install "GraphQL: Language Feature Support" extension for:
- Syntax highlighting
- Autocompletion
- Formatting with Prettier

## Resolvers

### Resolver Parameters

Resolvers receive four parameters:

```js
resolver: (root, args, context, info) => {
  // root: Result from parent resolver
  // args: Arguments passed to query
  // context: Shared context (auth, db, etc.)
  // info: Query metadata
}
```

**Example:**
```js
findPerson: (root, args) => {
  return persons.find(p => p.name === args.name)
}
```

### Default Resolvers

Apollo provides default resolvers for fields:

```js
const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) => persons.find(p => p.name === args.name)
  },
  Person: {
    // Default resolvers (automatically provided)
    name: (root) => root.name,
    phone: (root) => root.phone,
    street: (root) => root.street,
    city: (root) => root.city,
    id: (root) => root.id
  }
}
```

**Custom Resolver:**
```js
Person: {
  street: (root) => "Manhattan",
  city: (root) => "New York"
}
```

## Nested Objects

### Schema with Nested Type

```graphql
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
```

### Resolver for Nested Field

```js
const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) => persons.find(p => p.name === args.name)
  },
  Person: {
    address: ({ street, city }) => {
      return {
        street,
        city
      }
    }
  }
}
```

**Query:**
```graphql
query {
  findPerson(name: "Arto Hellas") {
    phone
    address {
      city
      street
    }
  }
}
```

**Response:**
```json
{
  "data": {
    "findPerson": {
      "phone": "040-123543",
      "address": {
        "city": "Espoo",
        "street": "Tapiolankatu 5 A"
      }
    }
  }
}
```

## Mutations

Mutations are used to modify data (create, update, delete).

### Schema

```graphql
type Mutation {
  addPerson(
    name: String!
    phone: String
    street: String!
    city: String!
  ): Person
}
```

### Resolver

```js
const { v1: uuid } = require('uuid')

const resolvers = {
  Query: {
    // ... queries
  },
  Mutation: {
    addPerson: (root, args) => {
      const person = { ...args, id: uuid() }
      persons = persons.concat(person)
      return person
    }
  }
}
```

### Mutation Query

```graphql
mutation {
  addPerson(
    name: "Pekka Mikkola"
    phone: "045-2374321"
    street: "Vilppulantie 25"
    city: "Helsinki"
  ) {
    name
    phone
    address {
      city
      street
    }
    id
  }
}
```

**Response:**
```json
{
  "data": {
    "addPerson": {
      "name": "Pekka Mikkola",
      "phone": "045-2374321",
      "address": {
        "city": "Helsinki",
        "street": "Vilppulantie 25"
      },
      "id": "2b24e0b0-343c-11e9-8c2a-cb57c2bf804f"
    }
  }
}
```

## Error Handling

### GraphQL Validation

GraphQL automatically validates queries against schema:

```graphql
mutation {
  addPerson(name: "Test") {
    # Missing required fields: street, city
  }
}
```

Returns validation error automatically.

### Custom Errors

Throw `GraphQLError` for custom validation:

```js
const { GraphQLError } = require('graphql')

const resolvers = {
  Mutation: {
    addPerson: (root, args) => {
      if (persons.find(p => p.name === args.name)) {
        throw new GraphQLError(`Name must be unique: ${args.name}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name
          }
        })
      }
      const person = { ...args, id: uuid() }
      persons = persons.concat(person)
      return person
    }
  }
}
```

**Error Response:**
```json
{
  "errors": [
    {
      "message": "Name must be unique: Arto Hellas",
      "extensions": {
        "code": "BAD_USER_INPUT",
        "invalidArgs": "Arto Hellas"
      }
    }
  ]
}
```

## Enums

Enums define a set of allowed values.

### Schema

```graphql
enum YesNo {
  YES
  NO
}

type Query {
  personCount: Int!
  allPersons(phone: YesNo): [Person!]!
  findPerson(name: String!): Person
}
```

### Resolver

```js
const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: (root, args) => {
      if (!args.phone) {
        return persons
      }
      const byPhone = (person) =>
        args.phone === 'YES' ? person.phone : !person.phone
      return persons.filter(byPhone)
    },
    findPerson: (root, args) => persons.find(p => p.name === args.name)
  }
}
```

### Query with Enum

```graphql
query {
  allPersons(phone: YES) {
    name
    phone
  }
}
```

## Multiple Queries

Combine multiple queries in one request:

```graphql
query {
  personCount
  allPersons {
    name
  }
}
```

**Response:**
```json
{
  "data": {
    "personCount": 3,
    "allPersons": [
      { "name": "Arto Hellas" },
      { "name": "Matti Luukkainen" },
      { "name": "Venla Ruuska" }
    ]
  }
}
```

### Named Queries

Use aliases for multiple queries of same type:

```graphql
query {
  havePhone: allPersons(phone: YES) {
    name
  }
  phoneless: allPersons(phone: NO) {
    name
  }
}
```

**Response:**
```json
{
  "data": {
    "havePhone": [
      { "name": "Arto Hellas" },
      { "name": "Matti Luukkainen" }
    ],
    "phoneless": [
      { "name": "Venla Ruuska" }
    ]
  }
}
```

## GraphQL vs REST Summary

| Feature | REST | GraphQL |
|---------|------|---------|
| **Endpoints** | Multiple (one per resource) | Single endpoint |
| **HTTP Method** | GET, POST, PUT, DELETE | POST (for all operations) |
| **Data Shape** | Fixed by endpoint | Client specifies |
| **Over-fetching** | Common | Avoided |
| **Under-fetching** | Common (multiple requests) | Avoided |
| **Versioning** | URL versioning | Schema evolution |
| **Documentation** | Separate (Swagger, etc.) | Self-documenting |
| **Caching** | HTTP caching | More complex |

## Key Takeaways

1. **GraphQL is query language**, not database query language
2. **Client specifies data needs** in query
3. **Single endpoint** for all operations
4. **Type system** ensures data consistency
5. **Resolvers** define how data is fetched
6. **Mutations** for data modifications
7. **Self-documenting** through schema
8. **Flexible** - can use any data source

## Exercises

The exercises (8.1-8.7) involve implementing a GraphQL backend for a library application with books and authors.
