# Phonebook GraphQL Frontend with Fragments and Subscriptions

A React application using Apollo Client with GraphQL fragments and real-time subscriptions.

## Features

- GraphQL fragments for reusable field selections
- Real-time subscriptions with WebSockets
- Automatic cache updates
- Duplicate prevention in cache
- Login and authentication
- Protected mutations

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

### Fragments
- Reusable field selections
- Defined once, used many times
- Consistent field selection
- Easier maintenance

### Subscriptions
- Real-time updates via WebSockets
- Server pushes updates to clients
- Automatic cache updates
- Live notifications

### Cache Management
- Helper function prevents duplicates
- Checks before adding to cache
- Works with mutations and subscriptions
- Consistent cache state

## Components

- **App**: Main component with subscription
- **PersonForm**: Add persons with cache update
- **Persons**: List and detail view
- **LoginForm**: Authentication
- **PhoneForm**: Edit phone numbers
- **Notify**: Error notifications
