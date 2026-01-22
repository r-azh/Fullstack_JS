# Phonebook GraphQL Server

A GraphQL server implementation for a phonebook application using Apollo Server.

## Features

- Query persons by name
- Get all persons with optional phone filter
- Add new persons
- Edit phone numbers
- Nested address objects
- Error handling for duplicate names

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

3. Open Apollo Studio Explorer:
Visit `http://localhost:4000` in your browser

## Example Queries

### Get person count
```graphql
query {
  personCount
}
```

### Get all persons
```graphql
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

### Find person by name
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

### Filter by phone
```graphql
query {
  allPersons(phone: YES) {
    name
    phone
  }
}
```

### Add person
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

### Edit phone number
```graphql
mutation {
  editNumber(
    name: "Arto Hellas"
    phone: "040-1111111"
  ) {
    name
    phone
  }
}
```

## Key Concepts

- **Schema**: Defines types and operations
- **Resolvers**: Functions that resolve queries/mutations
- **Nested Objects**: Address type nested in Person
- **Enums**: YesNo enum for filtering
- **Error Handling**: GraphQLError for validation
