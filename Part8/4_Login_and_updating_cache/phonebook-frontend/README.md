# Phonebook GraphQL Frontend with Login

A React application using Apollo Client with authentication, token management, and cache updates.

## Features

- User login with JWT tokens
- Token storage in localStorage
- Automatic token inclusion in requests
- Logout functionality
- Cache management (refetchQueries and update callback)
- Validation error handling
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

### Authentication Flow
1. User logs in with username/password
2. Token received and stored in localStorage
3. Token automatically added to all requests
4. Protected mutations require valid token

### Token Management
- Stored in localStorage for persistence
- Added to Authorization header via setContext
- Cleared on logout
- Restored on page reload

### Cache Updates
- **refetchQueries**: Refetches queries after mutation
- **update callback**: Manually updates cache
- **resetStore**: Clears cache on logout

### Error Handling
- Login errors via onError callback
- Validation errors via try-catch
- User-friendly error messages

## Components

- **App**: Main component, manages token and authentication state
- **LoginForm**: Login form with token storage
- **PersonForm**: Add persons with cache update
- **PhoneForm**: Edit phone numbers with error handling
- **Persons**: List and detail view
- **Notify**: Error notification component
