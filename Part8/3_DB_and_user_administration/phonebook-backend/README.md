# Phonebook GraphQL Backend with MongoDB

A refactored GraphQL backend using MongoDB with Mongoose, featuring user management and authentication.

## Features

- Modular code structure
- MongoDB integration with Mongoose
- User management and authentication
- JWT token-based authentication
- Friends list functionality
- Database validation
- Error handling

## Project Structure

```
phonebook-backend/
├── index.js          # Main entry point
├── server.js         # Apollo Server setup
├── schema.js         # GraphQL schema
├── resolvers.js      # GraphQL resolvers
├── db.js            # Database connection
├── models/          # Mongoose models
│   ├── person.js
│   └── user.js
└── package.json
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your MongoDB URI and JWT secret:
```
MONGODB_URI=mongodb://localhost:27017/phonebook
PORT=4000
JWT_SECRET=your-secret-key-here
```

4. Make sure MongoDB is running

5. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

## Key Concepts

### Modular Structure
- **index.js**: Main entry point, handles startup
- **server.js**: Apollo Server configuration
- **schema.js**: GraphQL type definitions
- **resolvers.js**: Query and mutation logic
- **db.js**: Database connection
- **models/**: Mongoose schemas

### Authentication
- JWT tokens for authentication
- Context provides current user to resolvers
- Protected mutations require authentication

### Friends List
- Users can have friends (Person references)
- Adding a person automatically adds to creator's friends
- `addAsFriend` mutation to add existing persons

## Example Queries

### Create User
```graphql
mutation {
  createUser(username: "mluukkai") {
    username
    id
  }
}
```

### Login
```graphql
mutation {
  login(username: "mluukkai", password: "secret") {
    value
  }
}
```

### Get Current User
```graphql
query {
  me {
    username
    friends {
      name
      phone
    }
  }
}
```

### Add Person (requires authentication)
```graphql
mutation {
  addPerson(
    name: "Arto Hellas"
    phone: "040-123543"
    street: "Tapiolankatu 5 A"
    city: "Espoo"
  ) {
    name
    phone
    id
  }
}
```

**Note:** Include Authorization header:
```
Authorization: Bearer <token>
```
