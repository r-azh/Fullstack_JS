# Communicating with Server - Summary

This section covers HTTP requests, GraphQL with Apollo Client, environment variables, AsyncStorage, and authentication in React Native applications.

## Server Setup

### rate-repository-api Server

**Repository:** rate-repository-api

**Features:**
- SQLite database (no setup needed)
- Apollo GraphQL API
- REST API endpoints
- Provides all API needs for this part

**Setup:**
- Follow setup instructions in repository README
- If using emulator: run server and emulator on same computer
- Eases network requests

**Endpoints:**
- GraphQL: `http://localhost:4000/graphql`
- REST: `http://localhost:5000/api/repositories`
- Apollo Sandbox: `http://localhost:4000`

## HTTP Requests

### Fetch API

**Available APIs:**
- Fetch API (recommended)
- XMLHttpRequest API (supports Axios)

**Basic Usage:**
```javascript
fetch('https://my-api.com/get-end-point');
```

**POST Request:**
```javascript
fetch('https://my-api.com/post-end-point', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstParam: 'firstValue',
    secondParam: 'secondValue',
  }),
});
```

**Key Points:**
- Lower level than Axios
- No automatic serialization
- Must set Content-Type header
- Must use JSON.stringify for body
- Error status codes (400, 500) are NOT rejected

### Response Handling

**Parsing JSON:**
```javascript
const fetchMovies = async () => {
  const response = await fetch('https://reactnative.dev/movies.json');
  const json = await response.json();
  return json;
};
```

**Error Handling:**
```javascript
const fetchData = async () => {
  try {
    const response = await fetch('https://api.example.com/data');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
```

### Network Configuration

**Problem:**
- Can't use `localhost` on physical device
- Need IP address from local network

**Solution:**
1. Run `npm start`
2. Find IP address in Expo console
3. Look for URL: `exp://<IP_ADDRESS>:...`
4. Copy IP address (e.g., `192.168.1.33`)
5. Use: `http://<IP_ADDRESS>:5000/api/repositories`

**Example:**
```javascript
// Replace with your IP address
const response = await fetch('http://192.168.1.33:5000/api/repositories');
```

**Important:**
- Device and computer must be on same Wi-Fi network
- If not possible, use emulator on same computer
- Or use tunnel (e.g., Ngrok)

### Fetching Repositories

**File: `src/components/RepositoryList.jsx`**
```javascript
import { useState, useEffect } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import RepositoryItem from './RepositoryItem';

const styles = StyleSheet.create({
  separator: {
    height: 10,
  },
});

const ItemSeparator = () => <View style={styles.separator} />;

const RepositoryList = () => {
  const [repositories, setRepositories] = useState();

  const fetchRepositories = async () => {
    // Replace the IP address part with your own IP address!
    const response = await fetch('http://192.168.1.33:5000/api/repositories');
    const json = await response.json();

    console.log(json);

    setRepositories(json);
  };

  useEffect(() => {
    fetchRepositories();
  }, []);

  // Get the nodes from the edges array
  const repositoryNodes = repositories
    ? repositories.edges.map(edge => edge.node)
    : [];

  return (
    <FlatList
      data={repositoryNodes}
      ItemSeparatorComponent={ItemSeparator}
      renderItem={({ item }) => <RepositoryItem item={item} />}
      keyExtractor={item => item.id}
    />
  );
};

export default RepositoryList;
```

**Key Points:**
- Use `useState` for data
- Use `useEffect` to fetch on mount
- Extract nodes from edges array (pagination format)
- Log response for debugging

### Custom Hook Pattern

**File: `src/hooks/useRepositories.js`**
```javascript
import { useState, useEffect } from 'react';

const useRepositories = () => {
  const [repositories, setRepositories] = useState();
  const [loading, setLoading] = useState(false);

  const fetchRepositories = async () => {
    setLoading(true);

    // Replace the IP address part with your own IP address!
    const response = await fetch('http://192.168.1.33:5000/api/repositories');
    const json = await response.json();

    setLoading(false);
    setRepositories(json);
  };

  useEffect(() => {
    fetchRepositories();
  }, []);

  return { repositories, loading, refetch: fetchRepositories };
};

export default useRepositories;
```

**Usage:**
```javascript
// src/components/RepositoryList.jsx
import useRepositories from '../hooks/useRepositories';

const RepositoryList = () => {
  const { repositories, loading } = useRepositories();
  const repositoryNodes = repositories
    ? repositories.edges.map(edge => edge.node)
    : [];

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <FlatList
      data={repositoryNodes}
      // Other props
    />
  );
};
```

**Benefits:**
- Separation of concerns
- Reusable logic
- Component doesn't know about network details
- Easy to switch to GraphQL later

## GraphQL and Apollo Client

### Installation

**Dependencies:**
```bash
npm install @apollo/client graphql
npm install @expo/metro-config@0.17.4
```

**Metro Configuration:**
```javascript
// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

defaultConfig.resolver.sourceExts.push('cjs');

module.exports = defaultConfig;
```

**Important:**
- Restart Expo after Metro config changes
- `.cjs` extension needed for Apollo Client

### Apollo Client Setup

**File: `src/utils/apolloClient.js`**
```javascript
import { ApolloClient, InMemoryCache } from '@apollo/client';

const createApolloClient = () => {
  return new ApolloClient({
    uri: 'http://192.168.1.100:4000/graphql',
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;
```

**App Setup:**
```javascript
// App.js
import { NativeRouter } from 'react-router-native';
import { ApolloProvider } from '@apollo/client/react';
import Main from './src/components/Main';
import createApolloClient from './src/utils/apolloClient';

const apolloClient = createApolloClient();

const App = () => {
  return (
    <NativeRouter>
      <ApolloProvider client={apolloClient}>
        <Main />
      </ApolloProvider>
    </NativeRouter>
  );
};

export default App;
```

**Key Points:**
- Same library as React web apps
- Port 4000 for GraphQL
- Path `/graphql`
- Wrap app with `ApolloProvider`

### Apollo Sandbox

**Access:**
- URL: `http://localhost:4000`
- Tool for testing GraphQL queries
- Inspect schema and documentation
- Test queries before implementing

**Best Practice:**
- Always test queries in Apollo Sandbox first
- Easier to debug than in application
- Check documentation for available queries

## Organizing GraphQL Code

### Recommended Structure

```
src/
├── graphql/
│   ├── queries.js
│   ├── mutations.js
│   └── fragments.js
```

**File: `src/graphql/queries.js`**
```javascript
import { gql } from '@apollo/client';

export const GET_REPOSITORIES = gql`
  query {
    repositories {
      edges {
        node {
          id
          fullName
          description
          language
          forksCount
          stargazersCount
          ratingAverage
          reviewCount
          ownerAvatarUrl
        }
      }
    }
  }
`;

// other queries...
```

**Usage:**
```javascript
import { useQuery } from '@apollo/client/react';
import { GET_REPOSITORIES } from '../graphql/queries';

const Component = () => {
  const { data, error, loading } = useQuery(GET_REPOSITORIES);
  // ...
};
```

**Benefits:**
- Centralized queries
- Reusable
- Easy to maintain
- Use fragments to avoid repetition

### Fragments

**File: `src/graphql/fragments.js`**
```javascript
import { gql } from '@apollo/client';

export const REPOSITORY_FRAGMENT = gql`
  fragment RepositoryDetails on Repository {
    id
    fullName
    description
    language
    forksCount
    stargazersCount
    ratingAverage
    reviewCount
    ownerAvatarUrl
  }
`;
```

**Usage in Query:**
```javascript
import { gql } from '@apollo/client';
import { REPOSITORY_FRAGMENT } from './fragments';

export const GET_REPOSITORIES = gql`
  query {
    repositories {
      edges {
        node {
          ...RepositoryDetails
        }
      }
    }
  }
  ${REPOSITORY_FRAGMENT}
`;
```

## Evolving Structure

### When Files Grow Too Large

**Option 1: Flat Structure**
```
components/
  A.jsx
  B.jsx
  C.jsx
```

**Option 2: Directory Structure**
```
components/
  A/
    B.jsx
    C.jsx
    index.jsx
```

**Benefits of Option 2:**
- More modular
- Doesn't break imports (`./A` matches both `A.jsx` and `A/index.jsx`)
- Keeps related components together
- Doesn't bloat components directory

## Environment Variables

### Problem

**Hardcoded Values:**
- Server URLs are environment-dependent
- Development vs production
- Different databases, APIs, etc.

**Solution:**
- Use Expo configuration
- Access via `Constants.expoConfig`

### app.config.js

**Convert app.json to app.config.js:**
```javascript
// app.json (before)
{
  "expo": {
    "name": "rate-repository-app",
    // ...
  }
}

// app.config.js (after)
export default {
  name: 'rate-repository-app',
  // rest of the configuration...
  extra: {
    env: 'development',
  },
};
```

**Access Configuration:**
```javascript
import Constants from 'expo-constants';

const App = () => {
  console.log(Constants.expoConfig.extra.env);
  // ...
};
```

### Using Environment Variables

**With process.env:**
```javascript
// app.config.js
export default {
  name: 'rate-repository-app',
  extra: {
    env: process.env.ENV,
  },
};
```

**Command Line:**
```bash
ENV=test npm start
```

**With .env File:**
```bash
npm install dotenv
```

**.env file:**
```text
ENV=development
APOLLO_URI=http://192.168.1.33:4000/graphql
```

**app.config.js:**
```javascript
import 'dotenv/config';

export default {
  name: 'rate-repository-app',
  extra: {
    env: process.env.ENV,
    apolloUri: process.env.APOLLO_URI,
  },
};
```

**Usage:**
```javascript
// src/utils/apolloClient.js
import Constants from 'expo-constants';

const { apolloUri } = Constants.expoConfig.extra;

const createApolloClient = () => {
  return new ApolloClient({
    uri: apolloUri,
    cache: new InMemoryCache(),
  });
};
```

**Important Notes:**
- Don't access `process.env` outside `app.config.js`
- Don't import `dotenv` outside `app.config.js`
- Use `Constants.expoConfig.extra` to access values
- Restart Expo after config changes
- May need `npx expo start --clear` to clear cache

**Security:**
- Never put sensitive data in configuration
- Users can reverse engineer apps
- Configuration is bundled with app

## AsyncStorage

### Installation

```bash
npx expo install @react-native-async-storage/async-storage
```

### API Overview

**Similar to localStorage:**
- Key-value storage
- Similar methods
- **Difference:** All operations are asynchronous

**Methods:**
- `setItem(key, value)`: Store item
- `getItem(key)`: Retrieve item
- `removeItem(key)`: Remove item

**Important:**
- Keys are global namespace
- Values must be strings
- Use JSON.stringify/parse for objects

### Storage Abstraction

**File: `src/utils/authStorage.js`**
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthStorage {
  constructor(namespace = 'auth') {
    this.namespace = namespace;
  }

  async getAccessToken() {
    const rawToken = await AsyncStorage.getItem(
      `${this.namespace}:accessToken`
    );
    return rawToken ? JSON.parse(rawToken) : null;
  }

  async setAccessToken(accessToken) {
    await AsyncStorage.setItem(
      `${this.namespace}:accessToken`,
      JSON.stringify(accessToken)
    );
  }

  async removeAccessToken() {
    await AsyncStorage.removeItem(`${this.namespace}:accessToken`);
  }
}

export default AuthStorage;
```

**Benefits:**
- Namespace prevents key collisions
- Encapsulates storage logic
- Easy to test and maintain
- Type-safe interface

**Usage:**
```javascript
const authStorage = new AuthStorage('auth');

await authStorage.setAccessToken('token123');
const token = await authStorage.getAccessToken();
await authStorage.removeAccessToken();
```

### SecureStore

**Alternative:**
- `expo-secure-store`
- Encrypts stored data
- Better for sensitive data (credit cards, etc.)
- Similar API to AsyncStorage

## Apollo Client Authentication

### Setting Authorization Header

**File: `src/utils/apolloClient.js`**
```javascript
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import Constants from 'expo-constants';
import { setContext } from '@apollo/client/link/context';

const { apolloUri } = Constants.expoConfig.extra;

const httpLink = createHttpLink({
  uri: apolloUri,
});

const createApolloClient = (authStorage) => {
  const authLink = setContext(async (_, { headers }) => {
    try {
      const accessToken = await authStorage.getAccessToken();
      return {
        headers: {
          ...headers,
          authorization: accessToken ? `Bearer ${accessToken}` : '',
        },
      };
    } catch (e) {
      console.log(e);
      return { headers };
    }
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
  });
};

export default createApolloClient;
```

**App Setup:**
```javascript
// App.js
import AuthStorage from './src/utils/authStorage';
import createApolloClient from './src/utils/apolloClient';

const authStorage = new AuthStorage();
const apolloClient = createApolloClient(authStorage);

const App = () => {
  return (
    <NativeRouter>
      <ApolloProvider client={apolloClient}>
        <Main />
      </ApolloProvider>
    </NativeRouter>
  );
};
```

**How It Works:**
- `setContext` runs before each request
- Gets access token from storage
- Adds `Authorization: Bearer <token>` header
- Concatenates with httpLink

## React Context for Dependency Injection

### Creating Context

**File: `src/contexts/AuthStorageContext.js`**
```javascript
import { createContext } from 'react';

const AuthStorageContext = createContext();

export default AuthStorageContext;
```

### Providing Context

**File: `App.js`**
```javascript
import AuthStorageContext from './src/contexts/AuthStorageContext';

const authStorage = new AuthStorage();
const apolloClient = createApolloClient(authStorage);

const App = () => {
  return (
    <NativeRouter>
      <ApolloProvider client={apolloClient}>
        <AuthStorageContext.Provider value={authStorage}>
          <Main />
        </AuthStorageContext.Provider>
      </ApolloProvider>
    </NativeRouter>
  );
};
```

### Using Context

**File: `src/hooks/useAuthStorage.js`**
```javascript
import { useContext } from 'react';
import AuthStorageContext from '../contexts/AuthStorageContext';

const useAuthStorage = () => {
  return useContext(AuthStorageContext);
};

export default useAuthStorage;
```

**Usage in Hook:**
```javascript
// src/hooks/useSignIn.js
import useAuthStorage from './useAuthStorage';

const useSignIn = () => {
  const authStorage = useAuthStorage();
  // ...
};
```

**Benefits:**
- Clean abstraction
- Hides implementation details
- Easy to use
- Better readability

## Sign In Implementation

### useSignIn Hook

**File: `src/hooks/useSignIn.js`**
```javascript
import { useMutation } from '@apollo/client/react';
import { useApolloClient } from '@apollo/client/react';
import { useNavigate } from 'react-router-native';
import { AUTHENTICATE } from '../graphql/mutations';
import useAuthStorage from './useAuthStorage';

const useSignIn = () => {
  const [mutate, result] = useMutation(AUTHENTICATE);
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();

  const signIn = async ({ username, password }) => {
    const { data } = await mutate({
      variables: {
        credentials: {
          username,
          password,
        },
      },
    });

    await authStorage.setAccessToken(data.authenticate.accessToken);
    await apolloClient.resetStore();

    return data;
  };

  return [signIn, result];
};

export default useSignIn;
```

**Usage:**
```javascript
// src/components/SignIn.jsx
import { useNavigate } from 'react-router-native';
import useSignIn from '../hooks/useSignIn';

const SignIn = () => {
  const [signIn] = useSignIn();
  const navigate = useNavigate();

  const onSubmit = async (values) => {
    try {
      await signIn(values);
      navigate('/');
    } catch (e) {
      console.log(e);
    }
  };

  // ...
};
```

**Key Points:**
- Returns tuple `[signIn, result]`
- Stores token after successful mutation
- Resets Apollo cache
- Order matters: store token before reset

### Sign Out Implementation

**File: `src/hooks/useSignOut.js`**
```javascript
import { useApolloClient } from '@apollo/client/react';
import useAuthStorage from './useAuthStorage';

const useSignOut = () => {
  const authStorage = useAuthStorage();
  const apolloClient = useApolloClient();

  const signOut = async () => {
    await authStorage.removeAccessToken();
    await apolloClient.resetStore();
  };

  return signOut;
};

export default useSignOut;
```

**Usage in AppBar:**
```javascript
// src/components/AppBar.jsx
import { useQuery } from '@apollo/client/react';
import { ME } from '../graphql/queries';
import useSignOut from '../hooks/useSignOut';

const AppBar = () => {
  const { data } = useQuery(ME);
  const signOut = useSignOut();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <View>
      {data?.me ? (
        <Pressable onPress={handleSignOut}>
          <Text>Sign out</Text>
        </Pressable>
      ) : (
        <Link to="/signin">
          <Text>Sign in</Text>
        </Link>
      )}
    </View>
  );
};
```

## Best Practices

### 1. Use Custom Hooks

```javascript
// ✅ Good: Custom hook
const { repositories, loading } = useRepositories();

// ❌ Bad: Fetch in component
const [repositories, setRepositories] = useState();
useEffect(() => {
  fetch('...').then(...);
}, []);
```

### 2. Organize GraphQL Code

```javascript
// ✅ Good: Separate files
graphql/
  queries.js
  mutations.js
  fragments.js

// ❌ Bad: Inline queries
const Component = () => {
  const { data } = useQuery(gql`query { ... }`);
};
```

### 3. Use Storage Abstraction

```javascript
// ✅ Good: Storage class
const authStorage = new AuthStorage();
await authStorage.setAccessToken(token);

// ❌ Bad: Direct AsyncStorage
await AsyncStorage.setItem('token', token);
```

### 4. Use Context for Dependency Injection

```javascript
// ✅ Good: Context hook
const authStorage = useAuthStorage();

// ❌ Bad: Prop drilling
const Component = ({ authStorage }) => { ... };
```

### 5. Environment Variables

```javascript
// ✅ Good: Environment variable
const { apolloUri } = Constants.expoConfig.extra;

// ❌ Bad: Hardcoded URL
uri: 'http://192.168.1.33:4000/graphql'
```

### 6. Error Handling

```javascript
// ✅ Good: Try-catch
try {
  const { data } = await signIn(values);
} catch (e) {
  console.error(e);
}

// ❌ Bad: No error handling
const { data } = await signIn(values);
```

## Common Patterns

### Fetch with Loading State

```javascript
const useData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('...');
      const json = await response.json();
      setData(json);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error, refetch: fetchData };
};
```

### GraphQL Query Hook

```javascript
const useRepositories = () => {
  const { data, error, loading, refetch } = useQuery(GET_REPOSITORIES, {
    fetchPolicy: 'cache-and-network',
  });

  return {
    repositories: data?.repositories,
    loading,
    error,
    refetch,
  };
};
```

### Authentication Flow

```javascript
// Sign in
const signIn = async ({ username, password }) => {
  const { data } = await mutate({
    variables: { credentials: { username, password } },
  });
  await authStorage.setAccessToken(data.authenticate.accessToken);
  await apolloClient.resetStore();
};

// Sign out
const signOut = async () => {
  await authStorage.removeAccessToken();
  await apolloClient.resetStore();
};
```

## Exercises

### Exercise 10.11: Fetching repositories with Apollo Client

Replace the Fetch API implementation in the `useRepositories` hook with a GraphQL query using Apollo Client. Test the query in Apollo Sandbox first, then implement it in the code.

**Key Points:**
- Install Apollo Client and configure Metro
- Create GraphQL queries and fragments
- Set up Apollo Client with ApolloProvider
- Use `useQuery` hook with `cache-and-network` policy
- Extract repositories from query result

### Exercise 10.12: Environment variables

Use environment variables for the Apollo Server URL instead of hardcoded values. Convert `app.json` to `app.config.js` and use `.env` file for configuration.

**Key Points:**
- Convert `app.json` to `app.config.js`
- Install and configure dotenv
- Create `.env` file with `APOLLO_URI`
- Access via `Constants.expoConfig.extra`
- Never access `process.env` outside `app.config.js`

### Exercise 10.13: The sign in form mutation

Implement the `useSignIn` hook that sends the `authenticate` mutation. The hook should return a tuple `[signIn, result]` where `signIn` is a function that runs the mutation.

**Key Points:**
- Create `AUTHENTICATE` mutation
- Implement `useSignIn` hook with `useMutation`
- Return tuple with signIn function and result
- Use in SignIn component's onSubmit
- Log access token on success

### Exercise 10.14: Storing the access token step1

Create `AuthStorage` class for storing access tokens using AsyncStorage. Implement `getAccessToken`, `setAccessToken`, and `removeAccessToken` methods.

**Key Points:**
- Install AsyncStorage
- Create AuthStorage class with namespace
- Implement all three methods
- Use JSON.stringify/parse for values
- Test all methods work correctly

### Exercise 10.15: Storing the access token step2

Enhance `useSignIn` hook to store access token and reset Apollo cache. Set up React Context for dependency injection. Update Apollo Client to send Authorization header.

**Key Points:**
- Create AuthStorageContext
- Create useAuthStorage hook
- Provide context in App component
- Enhance Apollo Client with setContext
- Store token and reset cache after sign in
- Navigate to repositories list

### Exercise 10.16: Sign out

Implement sign out functionality using the `me` query to check authentication status. Show "Sign out" tab when authenticated, "Sign in" when not. Remove token and reset cache on sign out.

**Key Points:**
- Create `ME` query
- Create `useSignOut` hook
- Use `me` query in AppBar
- Conditionally render tabs
- Remove token before resetting cache
- Verify `me` query updates after sign out

**Note:** This is the last exercise in this section. Push your code to GitHub and mark all finished exercises in the exercise submission system. Exercises in this section should be submitted to part 3 in the exercise submission system.
