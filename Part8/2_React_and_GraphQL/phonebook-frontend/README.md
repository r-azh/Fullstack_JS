# Phonebook GraphQL Frontend

A React application using Apollo Client to interact with a GraphQL server.

## Features

- View all persons
- View person details with address
- Add new persons
- Edit phone numbers
- Error handling and notifications
- Automatic cache updates

## Setup

1. Install dependencies:
```bash
npm install
```

2. Make sure the GraphQL server is running on `http://localhost:4000`

3. Start the development server:
```bash
npm run dev
```

## Key Concepts

### Apollo Client Setup
- `ApolloClient` configured with server URI
- `InMemoryCache` for query caching
- `ApolloProvider` wraps the app

### useQuery Hook
- Fetches data from GraphQL server
- Handles loading and error states
- Supports variables and conditional execution

### useMutation Hook
- Executes mutations
- Updates cache with `refetchQueries`
- Error handling with `onError`
- Success handling with `onCompleted`

### Query Organization
- Queries defined in `src/queries.js`
- Reusable across components
- Named queries with variables

## Components

- **App**: Main component, manages error state
- **Persons**: Lists all persons, shows detail view
- **PersonForm**: Form to add new persons
- **PhoneForm**: Form to edit phone numbers
- **Notify**: Error notification component
