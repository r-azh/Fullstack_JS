# Testing and Extending Our Application - Summary

This section covers testing React Native applications with Jest and React Native Testing Library, extending the application with new features, implementing cursor-based pagination, infinite scrolling, and exploring additional resources.

## Testing React Native Applications

### Jest Setup

**Installation:**
```bash
npm install --save-dev jest jest-expo eslint-plugin-jest
```

**Jest Configuration (package.json):**
```json
{
  "scripts": {
    "test": "jest"
  },
  "jest": {
    "preset": "jest-expo",
    "transform": {
      "^.+\\.jsx?$": "babel-jest"
    },
    "transformIgnorePatterns": [
      "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-router-native)"
    ]
  }
}
```

**Key Points:**
- `preset: "jest-expo"` - Expo's Jest configuration
- `transform` - Use Babel for .js and .jsx files
- `transformIgnorePatterns` - Don't transform certain node_modules

### ESLint Configuration

**File: `.eslintrc.json`**
```json
{
  "plugins": ["react", "react-native"],
  "settings": {
    "react": {
      "version": "detect"
    }
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jest/recommended"
  ],
  "parser": "@babel/eslint-parser",
  "env": {
    "react-native/react-native": true
  },
  "rules": {
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off"
  }
}
```

**Key Points:**
- Add `plugin:jest/recommended` to extends
- Enables Jest-specific linting rules

### Example Test

**File: `src/__tests__/example.test.js`**
```javascript
describe('Example', () => {
  it('works', () => {
    expect(1).toBe(1);
  });
});
```

**Run Tests:**
```bash
npm test
```

## Organizing Tests

### Approach 1: Centralized __tests__ Directory

**Structure:**
```
src/
  __tests__/
    components/
      AppBar.test.js
      RepositoryList.test.js
    utils/
      authStorage.test.js
    hooks/
      useRepositories.test.js
```

**Benefits:**
- All tests in one place
- Easy to find
- Mirrors source structure

### Approach 2: Tests Near Implementation

**Structure:**
```
src/
  components/
    AppBar/
      AppBar.test.jsx
      index.jsx
  utils/
    authStorage.js
    authStorage.test.js
```

**Benefits:**
- Tests close to code
- Easy to maintain
- Clear relationship

**Jest File Patterns:**
- Files in `__tests__` directory
- Files with `.test.js` or `.test.jsx` suffix
- Files with `.spec.js` or `.spec.jsx` suffix

## Testing Components

### React Native Testing Library

**Installation:**
```bash
npm install --save-dev --legacy-peer-deps react-test-renderer@18.2.0 @testing-library/react-native @testing-library/jest-native
```

**Important:**
- Match `react-test-renderer` version with React version
- Use `--legacy-peer-deps` if needed
- Check React version: `npm list react --depth=0`

### Setup File

**File: `setupTests.js` (root directory)**
```javascript
import '@testing-library/jest-native/extend-expect';
```

**Jest Configuration:**
```json
{
  "jest": {
    "preset": "jest-expo",
    "setupFilesAfterEnv": ["<rootDir>/setupTests.js"]
  }
}
```

**Key Points:**
- Extends Jest's `expect` with React Native matchers
- `setupFilesAfterEnv` runs after test environment setup

### Basic Component Test

**File: `src/__tests__/components/Greeting.test.js`**
```javascript
import { Text, View } from 'react-native';
import { render, screen } from '@testing-library/react-native';

const Greeting = ({ name }) => {
  return (
    <View>
      <Text>Hello {name}!</Text>
    </View>
  );
};

describe('Greeting', () => {
  it('renders a greeting message based on the name prop', () => {
    render(<Greeting name="Kalle" />);

    screen.debug();

    expect(screen.getByText('Hello Kalle!')).toBeDefined();
  });
});
```

**Key Concepts:**
- `render()` - Renders component
- `screen` - Object for queries
- `getByText()` - Query by text content
- `toBeDefined()` - Jest matcher
- `screen.debug()` - Print rendered tree

### Testing Events

**File: `src/__tests__/components/Form.test.js`**
```javascript
import { useState } from 'react';
import { Text, TextInput, Pressable, View } from 'react-native';
import { render, fireEvent, screen } from '@testing-library/react-native';

const Form = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = () => {
    onSubmit({ username, password });
  };

  return (
    <View>
      <TextInput
        value={username}
        onChangeText={(text) => setUsername(text)}
        placeholder="Username"
      />
      <TextInput
        value={password}
        onChangeText={(text) => setPassword(text)}
        placeholder="Password"
      />
      <Pressable onPress={handleSubmit}>
        <Text>Submit</Text>
      </Pressable>
    </View>
  );
};

describe('Form', () => {
  it('calls function provided by onSubmit prop after pressing the submit button', () => {
    const onSubmit = jest.fn();
    render(<Form onSubmit={onSubmit} />);

    fireEvent.changeText(screen.getByPlaceholderText('Username'), 'kalle');
    fireEvent.changeText(screen.getByPlaceholderText('Password'), 'password');
    fireEvent.press(screen.getByText('Submit'));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toEqual({
      username: 'kalle',
      password: 'password',
    });
  });
});
```

**Key Concepts:**
- `fireEvent.changeText()` - Simulate text input
- `fireEvent.press()` - Simulate button press
- `jest.fn()` - Mock function
- `toHaveBeenCalledTimes()` - Assert call count
- `mock.calls[0][0]` - First argument of first call

**Available Events:**
- `fireEvent.press()` - Button press
- `fireEvent.changeText()` - Text input change
- `fireEvent.scroll()` - Scroll event
- And more...

**Available Queries:**
- `getByText()` - Find by text
- `getByPlaceholderText()` - Find by placeholder
- `getByTestId()` - Find by testID
- `getAllByText()` - Find all by text
- And more...

## Handling Dependencies in Tests

### Pure Components

**Easy to Test:**
- No side effects
- No network requests
- No native APIs
- Predictable output

**Example:**
```javascript
const Greeting = ({ name }) => {
  return <Text>Hello {name}!</Text>;
};
```

### Components with Side Effects

**Problem:**
- GraphQL queries
- AsyncStorage
- Network requests
- Native APIs

**Solution: Extract Pure Code**

**File: `src/components/RepositoryList.jsx`**
```javascript
export const RepositoryListContainer = ({ repositories }) => {
  const repositoryNodes = repositories
    ? repositories.edges.map((edge) => edge.node)
    : [];

  return (
    <FlatList
      data={repositoryNodes}
      renderItem={({ item }) => <RepositoryItem item={item} />}
      keyExtractor={item => item.id}
    />
  );
};

const RepositoryList = () => {
  const { repositories } = useRepositories();

  return <RepositoryListContainer repositories={repositories} />;
};

export default RepositoryList;
```

**Benefits:**
- Test `RepositoryListContainer` with mock data
- `RepositoryList` is simple wrapper
- Separation of concerns
- Easier to test

### Testing Strategy

1. **Test Pure Components:**
   - Test `RepositoryListContainer` with mock data
   - Verify rendering logic

2. **Test Hooks Separately:**
   - Test `useRepositories` hook
   - Mock Apollo Client responses

3. **Test Integration:**
   - Test full flow if needed
   - Use Apollo Client mocking

## Extending the Application

### Single Repository View

**Features:**
- Display repository details
- Open repository in GitHub
- Route with repository ID parameter

**File: `src/components/SingleRepository.jsx`**
```javascript
import { useParams, useNavigate } from 'react-router-native';
import { useQuery } from '@apollo/client/react';
import { GET_REPOSITORY } from '../graphql/queries';
import * as Linking from 'expo-linking';
import RepositoryItem from './RepositoryItem';

const SingleRepository = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading } = useQuery(GET_REPOSITORY, {
    variables: { id },
    fetchPolicy: 'cache-and-network',
  });

  if (loading) {
    return <Text>Loading...</Text>;
  }

  const handleOpenGitHub = () => {
    Linking.openURL(data.repository.url);
  };

  return (
    <View>
      <RepositoryItem item={data.repository} showGitHubButton />
      <Pressable onPress={handleOpenGitHub}>
        <Text>Open in GitHub</Text>
      </Pressable>
    </View>
  );
};
```

**Key Points:**
- Use `useParams()` for route parameters
- Use `Linking.openURL()` for external URLs
- Reuse `RepositoryItem` component
- Use `fetchPolicy: 'cache-and-network'`

### Repository Reviews List

**Features:**
- Display repository reviews
- Format dates with date-fns
- Use FlatList with ListHeaderComponent

**File: `src/components/SingleRepository.jsx`**
```javascript
import { format } from 'date-fns';
import { FlatList, View } from 'react-native';

const ReviewItem = ({ review }) => {
  return (
    <View>
      <View style={styles.ratingContainer}>
        <Text>{review.rating}</Text>
      </View>
      <Text>{review.user.username}</Text>
      <Text>{format(new Date(review.createdAt), 'dd.MM.yyyy')}</Text>
      <Text>{review.text}</Text>
    </View>
  );
};

const SingleRepository = () => {
  // ... repository query

  const reviews = data?.repository.reviews
    ? data.repository.reviews.edges.map(edge => edge.node)
    : [];

  return (
    <FlatList
      data={reviews}
      renderItem={({ item }) => <ReviewItem review={item} />}
      keyExtractor={({ id }) => id}
      ListHeaderComponent={() => (
        <RepositoryInfo repository={data.repository} />
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
};
```

**Key Points:**
- Use `date-fns` for date formatting
- `ListHeaderComponent` for repository info
- `ItemSeparatorComponent` for spacing
- Extract reviews from edges

### Review Form

**Features:**
- Create review mutation
- Form validation with Yup
- Redirect after success

**File: `src/components/CreateReview.jsx`**
```javascript
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useMutation } from '@apollo/client/react';
import { CREATE_REVIEW } from '../graphql/mutations';
import { useNavigate } from 'react-router-native';

const validationSchema = yup.object().shape({
  ownerName: yup.string().required('Repository owner is required'),
  repositoryName: yup.string().required('Repository name is required'),
  rating: yup
    .number()
    .required('Rating is required')
    .min(0, 'Rating must be between 0 and 100')
    .max(100, 'Rating must be between 0 and 100'),
  text: yup.string(),
});

const CreateReview = () => {
  const [mutate] = useMutation(CREATE_REVIEW);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      ownerName: '',
      repositoryName: '',
      rating: '',
      text: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const { data } = await mutate({
          variables: {
            review: {
              repositoryName: values.repositoryName,
              ownerName: values.ownerName,
              rating: parseInt(values.rating),
              text: values.text,
            },
          },
        });

        navigate(`/repository/${data.createReview.repositoryId}`);
      } catch (e) {
        console.log(e);
      }
    },
  });

  return (
    <View>
      {/* Form fields */}
    </View>
  );
};
```

**Key Points:**
- Use `multiline` prop for text area
- Validate with Yup schema
- Use `createReview` mutation
- Navigate to repository after success
- Use `cache-and-network` for repository query

### Sign Up Form

**Features:**
- Create user mutation
- Password confirmation validation
- Auto sign-in after registration

**File: `src/components/SignUp.jsx`**
```javascript
import * as yup from 'yup';
import { useMutation } from '@apollo/client/react';
import { CREATE_USER } from '../graphql/mutations';
import useSignIn from '../hooks/useSignIn';

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .required('Username is required')
    .min(5, 'Username must be between 5 and 30 characters')
    .max(30, 'Username must be between 5 and 30 characters'),
  password: yup
    .string()
    .required('Password is required')
    .min(5, 'Password must be between 5 and 50 characters')
    .max(50, 'Password must be between 5 and 50 characters'),
  passwordConfirmation: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Password confirmation is required'),
});

const SignUp = () => {
  const [createUser] = useMutation(CREATE_USER);
  const [signIn] = useSignIn();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirmation: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await createUser({
          variables: {
            user: {
              username: values.username,
              password: values.password,
            },
          },
        });

        await signIn({
          username: values.username,
          password: values.password,
        });

        navigate('/');
      } catch (e) {
        console.log(e);
      }
    },
  });

  return (
    <View>
      {/* Form fields */}
    </View>
  );
};
```

**Key Points:**
- Use `oneOf` and `ref` for password confirmation
- Create user, then sign in
- Navigate to repositories list

### Sorting Repositories

**Features:**
- Order by creation date (default)
- Order by highest rating
- Order by lowest rating

**File: `src/components/RepositoryList.jsx`**
```javascript
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';

const RepositoryList = () => {
  const [sortBy, setSortBy] = useState('latest');

  const getSortVariables = () => {
    switch (sortBy) {
      case 'latest':
        return { orderBy: 'CREATED_AT', orderDirection: 'DESC' };
      case 'highest':
        return { orderBy: 'RATING_AVERAGE', orderDirection: 'DESC' };
      case 'lowest':
        return { orderBy: 'RATING_AVERAGE', orderDirection: 'ASC' };
      default:
        return { orderBy: 'CREATED_AT', orderDirection: 'DESC' };
    }
  };

  const { repositories } = useRepositories({
    first: 8,
    ...getSortVariables(),
  });

  return (
    <View>
      <Picker
        selectedValue={sortBy}
        onValueChange={(itemValue) => setSortBy(itemValue)}
      >
        <Picker.Item label="Latest repositories" value="latest" />
        <Picker.Item label="Highest rated repositories" value="highest" />
        <Picker.Item label="Lowest rated repositories" value="lowest" />
      </Picker>
      <RepositoryListContainer repositories={repositories} />
    </View>
  );
};
```

**Key Points:**
- Use `orderBy` and `orderDirection` arguments
- State for selected sort option
- Pass variables to `useRepositories` hook

### Filtering Repositories

**Features:**
- Search by keyword
- Debounce input
- Filter as user types

**File: `src/components/RepositoryList.jsx`**
```javascript
import { useState } from 'react';
import { useDebounce } from 'use-debounce';
import { TextInput } from 'react-native';

export class RepositoryListContainer extends React.Component {
  renderHeader = () => {
    const { searchKeyword, onSearchChange } = this.props;

    return (
      <TextInput
        value={searchKeyword}
        onChangeText={onSearchChange}
        placeholder="Search repositories"
      />
    );
  };

  render() {
    const { repositories } = this.props;

    return (
      <FlatList
        data={repositoryNodes}
        ListHeaderComponent={this.renderHeader}
        // ...
      />
    );
  }
}

const RepositoryList = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [debouncedSearchKeyword] = useDebounce(searchKeyword, 500);

  const { repositories } = useRepositories({
    first: 8,
    searchKeyword: debouncedSearchKeyword,
  });

  return (
    <RepositoryListContainer
      repositories={repositories}
      searchKeyword={searchKeyword}
      onSearchChange={setSearchKeyword}
    />
  );
};
```

**Key Points:**
- Use `use-debounce` library
- Debounce delay: 500ms
- Class component for stable header
- `ListHeaderComponent` unmounts on each render (function component issue)

### User Reviews View

**Features:**
- Display user's reviews
- Use `me` query with `include` directive
- Conditional field fetching

**File: `src/graphql/queries.js`**
```javascript
export const GET_CURRENT_USER = gql`
  query getCurrentUser($includeReviews: Boolean = false) {
    me {
      id
      username
      reviews @include(if: $includeReviews) {
        edges {
          node {
            id
            text
            rating
            createdAt
            repository {
              id
              fullName
            }
          }
        }
      }
    }
  }
`;
```

**File: `src/components/MyReviews.jsx`**
```javascript
import { useQuery } from '@apollo/client/react';
import { GET_CURRENT_USER } from '../graphql/queries';

const MyReviews = () => {
  const { data, loading } = useQuery(GET_CURRENT_USER, {
    variables: { includeReviews: true },
  });

  const reviews = data?.me.reviews
    ? data.me.reviews.edges.map(edge => edge.node)
    : [];

  return (
    <FlatList
      data={reviews}
      renderItem={({ item }) => <ReviewItem review={item} />}
      keyExtractor={({ id }) => id}
    />
  );
};
```

**Key Points:**
- Use `@include` directive
- Default `includeReviews: false`
- Fetch reviews only when needed

### Review Actions

**Features:**
- View repository button
- Delete review button
- Confirmation alert

**File: `src/components/MyReviews.jsx`**
```javascript
import { Alert } from 'react-native';
import { useMutation } from '@apollo/client/react';
import { DELETE_REVIEW } from '../graphql/mutations';

const ReviewItem = ({ review, onViewRepository, onDelete }) => {
  const handleDelete = () => {
    Alert.alert(
      'Delete review',
      'Are you sure you want to delete this review?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: onDelete,
        },
      ]
    );
  };

  return (
    <View>
      {/* Review content */}
      <Pressable onPress={() => onViewRepository(review.repository.id)}>
        <Text>View repository</Text>
      </Pressable>
      <Pressable onPress={handleDelete}>
        <Text>Delete review</Text>
      </Pressable>
    </View>
  );
};

const MyReviews = () => {
  const { data, refetch } = useQuery(GET_CURRENT_USER, {
    variables: { includeReviews: true },
  });
  const [deleteReview] = useMutation(DELETE_REVIEW);

  const handleDelete = async (id) => {
    try {
      await deleteReview({ variables: { id } });
      refetch();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <FlatList
      data={reviews}
      renderItem={({ item }) => (
        <ReviewItem
          review={item}
          onViewRepository={navigate}
          onDelete={() => handleDelete(item.id)}
        />
      )}
    />
  );
};
```

**Key Points:**
- Use `Alert.alert()` for confirmation
- Call `refetch()` after deletion
- Navigate to repository view

## Cursor-Based Pagination

### Understanding Cursors

**Query Example:**
```javascript
{
  repositories(first: 2) {
    totalCount
    edges {
      node {
        id
        fullName
        createdAt
      }
      cursor
    }
    pageInfo {
      endCursor
      startCursor
      hasNextPage
    }
  }
}
```

**Response:**
```javascript
{
  "data": {
    "repositories": {
      "totalCount": 10,
      "edges": [
        {
          "node": {
            "id": "zeit.next.js",
            "fullName": "zeit/next.js"
          },
          "cursor": "WyJ6ZWl0Lm5leHQuanMiLDE1ODk1NDM5OTc1NTdd"
        }
      ],
      "pageInfo": {
        "endCursor": "WyJ6ZWl0LnN3ciIsMTU4OTU0MzkzMzg2N10=",
        "hasNextPage": true
      }
    }
  }
}
```

**Key Concepts:**
- `cursor` - Base64 encoded item identifier
- `endCursor` - Cursor of last item
- `hasNextPage` - More items available
- `after` - Fetch items after cursor

**Fetch Next Page:**
```javascript
{
  repositories(first: 2, after: "WyJ6ZWl0LnN3ciIsMTU4OTU0MzkzMzg2N10=") {
    // ...
  }
}
```

**Benefits:**
- Stable pagination
- Works with dynamic data
- No duplicate items
- Based on Relay specification

## Infinite Scrolling

### Implementation

**1. Detect End of List**

**File: `src/components/RepositoryList.jsx`**
```javascript
export const RepositoryListContainer = ({
  repositories,
  onEndReach,
}) => {
  const repositoryNodes = repositories
    ? repositories.edges.map((edge) => edge.node)
    : [];

  return (
    <FlatList
      data={repositoryNodes}
      onEndReached={onEndReach}
      onEndReachedThreshold={0.5}
      // ...
    />
  );
};
```

**Key Points:**
- `onEndReached` - Called when end reached
- `onEndReachedThreshold` - How early to trigger (0.5 = 50% from end)

**2. Configure Apollo Cache**

**File: `src/utils/apolloClient.js`**
```javascript
import { relayStylePagination } from '@apollo/client/utilities';

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        repositories: relayStylePagination(),
      },
    },
    Repository: {
      fields: {
        reviews: relayStylePagination(),
      },
    },
  },
});
```

**Key Points:**
- `relayStylePagination()` - Handles Relay pagination
- Automatically merges pages
- Works with `fetchMore`

**3. Implement fetchMore**

**File: `src/hooks/useRepositories.js`**
```javascript
const useRepositories = (variables) => {
  const { data, loading, fetchMore, ...result } = useQuery(GET_REPOSITORIES, {
    variables: {
      first: 8,
      ...variables,
    },
    fetchPolicy: 'cache-and-network',
  });

  const handleFetchMore = () => {
    const canFetchMore = !loading && data?.repositories.pageInfo.hasNextPage;

    if (!canFetchMore) {
      return;
    }

    fetchMore({
      variables: {
        after: data.repositories.pageInfo.endCursor,
        ...variables,
      },
    });
  };

  return {
    repositories: data?.repositories,
    fetchMore: handleFetchMore,
    loading,
    ...result,
  };
};
```

**Key Points:**
- Check `hasNextPage` before fetching
- Check `loading` to prevent duplicate requests
- Pass `after` cursor to `fetchMore`
- Merge existing variables

**4. Connect to Component**

**File: `src/components/RepositoryList.jsx`**
```javascript
const RepositoryList = () => {
  const { repositories, fetchMore } = useRepositories({
    first: 8,
  });

  const onEndReach = () => {
    fetchMore();
  };

  return (
    <RepositoryListContainer
      repositories={repositories}
      onEndReach={onEndReach}
    />
  );
};
```

**Key Points:**
- Call `fetchMore` in `onEndReach`
- Apollo automatically merges results
- List updates automatically

### Query Requirements

**Must Include:**
- `pageInfo` with `hasNextPage` and `endCursor`
- `cursor` in edges
- `first` and `after` arguments

**Example Query:**
```javascript
const GET_REPOSITORIES = gql`
  query getRepositories($first: Int, $after: String) {
    repositories(first: $first, after: $after) {
      edges {
        node {
          id
          fullName
        }
        cursor
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;
```

## Additional Resources

### React Native Paper

**Description:**
Material Design components for React Native

**Installation:**
```bash
npm install react-native-paper
```

**Benefits:**
- Production-ready components
- Material Design guidelines
- Customizable themes
- Easy Expo setup

### Styled-components

**Description:**
CSS-in-JS library for React Native

**Installation:**
```bash
npm install styled-components
```

**Example:**
```javascript
import styled from 'styled-components/native';

const FancyText = styled.Text`
  color: grey;
  font-size: 14px;

  ${({ isBlue }) =>
    isBlue &&
    css`
      color: blue;
    `}
`;
```

**Benefits:**
- CSS-like syntax
- Runtime style variations
- Full theming support
- Component-based styling

### React-spring

**Description:**
Spring-physics based animation library

**Installation:**
```bash
npm install react-spring
```

**Benefits:**
- Smooth animations
- Physics-based
- Flexible API
- React Native support

### React Navigation

**Description:**
Routing and navigation for React Native

**Installation:**
```bash
npm install @react-navigation/native
```

**Benefits:**
- Native gestures
- Native animations
- Deep linking
- Tab/stack navigation

## Best Practices

### 1. Test Pure Components

```javascript
// ✅ Good: Test pure component
const RepositoryListContainer = ({ repositories }) => {
  // Pure rendering logic
};

// ❌ Bad: Test component with side effects
const RepositoryList = () => {
  const { repositories } = useRepositories(); // Side effect
};
```

### 2. Use testID for Testing

```javascript
// ✅ Good: Add testID
<View testID="repositoryItem">
  {/* Content */}
</View>

// ❌ Bad: Query by text only
<View>
  <Text>Repository Name</Text>
</View>
```

### 3. Mock Dependencies

```javascript
// ✅ Good: Mock hook
jest.mock('../hooks/useRepositories', () => ({
  __esModule: true,
  default: () => ({
    repositories: mockRepositories,
  }),
}));

// ❌ Bad: Use real API calls in tests
```

### 4. Extract Pure Code

```javascript
// ✅ Good: Separate pure and impure
export const RepositoryListContainer = ({ repositories }) => {
  // Pure
};

const RepositoryList = () => {
  const { repositories } = useRepositories();
  return <RepositoryListContainer repositories={repositories} />;
};

// ❌ Bad: Everything in one component
```

### 5. Use Debouncing for Search

```javascript
// ✅ Good: Debounce search
const [debouncedKeyword] = useDebounce(keyword, 500);

// ❌ Bad: Search on every keystroke
```

### 6. Class Components for Stable Headers

```javascript
// ✅ Good: Class component for stable header
export class RepositoryListContainer extends React.Component {
  renderHeader = () => {
    return <TextInput />;
  };
}

// ❌ Bad: Function component (unmounts on each render)
```

## Exercises

The exercises (10.17-10.27) involve:
- Testing repository list component
- Testing sign in form
- Implementing single repository view
- Adding repository reviews
- Creating review form
- Implementing sign up form
- Sorting repositories
- Filtering repositories
- User reviews view
- Review actions
- Infinite scrolling for reviews
