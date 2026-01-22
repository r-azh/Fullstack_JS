# Rate Repository App - Testing and Extending

A React Native application for rating GitHub repositories with comprehensive testing and extended features.

## Features

- Comprehensive test suite with Jest and React Native Testing Library
- Single repository view with reviews
- Review creation form
- User sign up
- Repository sorting and filtering
- User reviews view
- Review actions (view, delete)
- Infinite scrolling for reviews

## Testing

### Setup

**Install dependencies:**
```bash
npm install --save-dev jest jest-expo eslint-plugin-jest react-test-renderer@18.2.0 @testing-library/react-native @testing-library/jest-native --legacy-peer-deps
```

**Run tests:**
```bash
npm test
```

### Test Structure

Tests are organized in `src/__tests__/` directory:
- `components/` - Component tests
- `utils/` - Utility tests
- `hooks/` - Hook tests

### Example Tests

- `RepositoryList.test.js` - Tests repository list rendering
- `SignIn.test.js` - Tests sign in form submission
- `Greeting.test.js` - Basic component test example
- `Form.test.js` - Form event testing example

## Extended Features

### Single Repository View

- Display repository details
- Show repository reviews
- Open repository in GitHub
- Infinite scrolling for reviews

### Review Management

- Create reviews for repositories
- View user's own reviews
- Delete reviews with confirmation
- Navigate to reviewed repositories

### Repository List Enhancements

- Sort by: latest, highest rated, lowest rated
- Filter by search keyword
- Debounced search input
- Infinite scrolling

## Key Concepts

### Testing

- **Jest** - Testing framework
- **React Native Testing Library** - Component testing
- **jest-native** - React Native matchers
- **Pure components** - Easier to test
- **Mock functions** - Test callbacks

### Pagination

- **Cursor-based pagination** - Stable pagination
- **Relay specification** - Standard format
- **Infinite scrolling** - Load more on scroll
- **Apollo cache policies** - Automatic merging

### Form Handling

- **Formik** - Form state management
- **Yup** - Schema validation
- **Password confirmation** - Custom validation
- **Async submission** - Handle mutations

## Project Structure

```
src/
├── __tests__/          # Test files
│   ├── components/
│   ├── utils/
│   └── hooks/
├── components/         # React components
├── hooks/             # Custom hooks
├── utils/             # Utilities
├── contexts/          # React contexts
└── graphql/           # GraphQL queries/mutations
```

## Development

1. **Start server:**
   - Set up rate-repository-api
   - Start on port 4000

2. **Start app:**
   ```bash
   npm start
   ```

3. **Run tests:**
   ```bash
   npm test
   ```

4. **Lint code:**
   ```bash
   npm run lint
   ```

## Testing Best Practices

1. **Test pure components** - Extract rendering logic
2. **Use testID** - Reliable element queries
3. **Mock dependencies** - Isolate components
4. **Test user interactions** - Use fireEvent
5. **Handle async** - Use waitFor for async operations
