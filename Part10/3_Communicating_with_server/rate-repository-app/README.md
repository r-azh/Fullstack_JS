# Rate Repository App - Server Communication

A React Native application for rating GitHub repositories with server communication, GraphQL, and authentication.

## Features

- Fetch repositories from GraphQL API
- User authentication (sign in/sign out)
- Token storage with AsyncStorage
- Environment variable configuration
- Apollo Client integration

## Setup

1. Set up rate-repository-api server:
   - Clone/fork the rate-repository-api repository
   - Follow setup instructions in README
   - Start server (GraphQL on port 4000)

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
   - Create `.env` file:
     ```
     ENV=development
     APOLLO_URI=http://YOUR_IP_ADDRESS:4000/graphql
     ```
   - Replace `YOUR_IP_ADDRESS` with your computer's IP

4. Start development server:
```bash
npm start
```

## Key Concepts

- **Fetch API**: HTTP requests in React Native
- **Apollo Client**: GraphQL client for React Native
- **AsyncStorage**: Persistent storage for tokens
- **Environment Variables**: Configuration via app.config.js
- **React Context**: Dependency injection for storage
- **Authentication**: Token-based auth with Apollo

## Project Structure

```
src/
├── components/      # React components
├── hooks/          # Custom hooks (useRepositories, useSignIn, etc.)
├── utils/          # Utilities (apolloClient, authStorage)
├── contexts/       # React contexts
└── graphql/        # GraphQL queries, mutations, fragments
```
