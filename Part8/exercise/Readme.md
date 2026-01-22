# [Exercises 8.1.-8.7.](https://fullstackopen.com/en/part8/graph_ql_server#exercises-8-1-8-7)

Through the exercises, we will implement a GraphQL backend for a small library. Start with this file. Remember to `npm init` and to install dependencies!

## 8.1: The number of books and authors

Implement queries `bookCount` and `authorCount` which return the number of books and the number of authors.

The query

```graphql
query {
  bookCount
  authorCount
}
```

should return

```json
{
  "data": {
    "bookCount": 7,
    "authorCount": 5
  }
}
```

**Details:**
- Create `bookCount` query in schema
- Create `authorCount` query in schema
- Implement resolvers for both queries
- Return length of books and authors arrays
- Test queries in Apollo Studio Explorer

## 8.2: All books

Implement query `allBooks`, which returns the details of all books.

In the end, the user should be able to do the following query:

```graphql
query {
  allBooks { 
    title 
    author
    published 
    genres
  }
}
```

**Details:**
- Create `allBooks` query in schema
- Return type should be `[Book!]!`
- Implement resolver to return all books
- Test query with different field selections
- Verify all book fields are accessible

## 8.3: All authors

Implement query `allAuthors`, which returns the details of all authors. The response should include a field `bookCount` containing the number of books the author has written.

For example the query

```graphql
query {
  allAuthors {
    name
    bookCount
  }
}
```

should return

```json
{
  "data": {
    "allAuthors": [
      {
        "name": "Robert Martin",
        "bookCount": 2
      },
      {
        "name": "Martin Fowler",
        "bookCount": 1
      },
      {
        "name": "Fyodor Dostoevsky",
        "bookCount": 2
      },
      {
        "name": "Joshua Kerievsky",
        "bookCount": 1
      },
      {
        "name": "Sandi Metz",
        "bookCount": 1
      }
    ]
  }
}
```

**Details:**
- Create `allAuthors` query in schema
- Add `bookCount` field to Author type
- Implement resolver for `allAuthors`
- Implement resolver for `bookCount` field
- Calculate book count by filtering books by author name
- Test query with different field selections

## 8.4: Books of an author

Modify the `allBooks` query so that a user can give an optional parameter `author`. The response should include only books written by that author.

For example query

```graphql
query {
  allBooks(author: "Robert Martin") {
    title
  }
}
```

should return

```json
{
  "data": {
    "allBooks": [
      {
        "title": "Clean Code"
      },
      {
        "title": "Agile software development"
      }
    ]
  }
}
```

**Details:**
- Add optional `author` parameter to `allBooks` query
- Update resolver to filter books by author when parameter provided
- Return all books if no author parameter
- Test with and without author parameter
- Verify filtering works correctly

## 8.5: Books by genre

Modify the query `allBooks` so that a user can give an optional parameter `genre`. The response should include only books of that genre.

For example query

```graphql
query {
  allBooks(genre: "refactoring") {
    title
    author
  }
}
```

should return

```json
{
  "data": {
    "allBooks": [
      {
        "title": "Clean Code",
        "author": "Robert Martin"
      },
      {
        "title": "Refactoring, edition 2",
        "author": "Martin Fowler"
      },
      {
        "title": "Refactoring to patterns",
        "author": "Joshua Kerievsky"
      },
      {
        "title": "Practical Object-Oriented Design, An Agile Primer Using Ruby",
        "author": "Sandi Metz"
      }
    ]
  }
}
```

The query must work when both optional parameters are given:

```graphql
query {
  allBooks(author: "Robert Martin", genre: "refactoring") {
    title
    author
  }
}
```

**Details:**
- Add optional `genre` parameter to `allBooks` query
- Update resolver to filter books by genre when parameter provided
- Combine author and genre filters when both provided
- Return all books if no parameters
- Test with genre only, author only, and both parameters
- Verify filtering logic works correctly

## 8.6: Adding a book

Implement mutation `addBook`, which can be used like this:

```graphql
mutation {
  addBook(
    title: "NoSQL Distilled",
    author: "Martin Fowler",
    published: 2012,
    genres: ["database", "nosql"]
  ) {
    title,
    author
  }
}
```

The mutation works even if the author is not already saved to the server:

```graphql
mutation {
  addBook(
    title: "Pimeyden tango",
    author: "Reijo Mäki",
    published: 1997,
    genres: ["crime"]
  ) {
    title,
    author
  }
}
```

If the author is not yet saved to the server, a new author is added to the system. The birth years of authors are not saved to the server yet, so the query

```graphql
query {
  allAuthors {
    name
    born
    bookCount
  }
}
```

returns

```json
{
  "data": {
    "allAuthors": [
      // ...
      {
        "name": "Reijo Mäki",
        "born": null,
        "bookCount": 1
      }
    ]
  }
}
```

**Details:**
- Create `addBook` mutation in schema
- Define parameters: title, author, published, genres
- Return type should be `Book`
- Implement resolver to add book to books array
- Check if author exists, create if not
- Generate unique ID for new book
- Return the created book
- Test mutation with existing and new authors
- Verify author is created when needed

## 8.7: Updating the birth year of an author

Implement mutation `editAuthor`, which can be used to set a birth year for an author. The mutation is used like so:

```graphql
mutation {
  editAuthor(name: "Reijo Mäki", setBornTo: 1958) {
    name
    born
  }
}
```

If the correct author is found, the operation returns the edited author:

```json
{
  "data": {
    "editAuthor": {
      "name": "Reijo Mäki",
      "born": 1958
    }
  }
}
```

If the author is not in the system, `null` is returned:

```json
{
  "data": {
    "editAuthor": null
  }
}
```

**Details:**
- Create `editAuthor` mutation in schema
- Define parameters: name (required), setBornTo (required Int)
- Return type should be `Author` (nullable)
- Implement resolver to find author by name
- Update author's born field if found
- Return null if author not found
- Test mutation with existing and non-existing authors
- Verify born field is updated correctly

# [Exercises 8.8.-8.12.: React and GraphQL](https://fullstackopen.com/en/part8/react_and_graph_ql#exercises-8-8-8-12)

Through these exercises, we'll implement a frontend for the GraphQL library.

Take this project as a start for your application.

**Note** if you want, you can also use React router to implement the application's navigation!

## 8.8: Authors view

Implement an Authors view to show the details of all authors on a page.

**Details:**
- Create Authors component
- Use `useQuery` to fetch all authors
- Display author name and book count
- Show birth year if available
- Handle loading and error states
- Add route if using React Router
- Style appropriately

**Example Query:**
```graphql
query {
  allAuthors {
    name
    bookCount
    born
  }
}
```

## 8.9: Books view

Implement a Books view that shows the details of all books except their genres.

**Details:**
- Create Books component
- Use `useQuery` to fetch all books
- Display book title, author, and published year
- Do NOT display genres
- Handle loading and error states
- Add route if using React Router
- Style appropriately

**Example Query:**
```graphql
query {
  allBooks {
    title
    author
    published
  }
}
```

## 8.10: Adding a book

Implement a possibility to add new books to your application.

**Details:**
- Create AddBook component with form
- Form fields: title, author, published (year), genres (array)
- Use `useMutation` for `addBook` mutation
- Update Authors and Books views after adding book
- Use `refetchQueries` to update both views
- Handle errors (e.g., invalid input)
- Show success notification
- Clear form after successful submission

**Example Mutation:**
```graphql
mutation {
  addBook(
    title: "NoSQL Distilled"
    author: "Martin Fowler"
    published: 2012
    genres: ["database", "nosql"]
  ) {
    title
    author
  }
}
```

**Important:**
- Make sure Authors and Books views are kept up to date after adding
- Check developer console for errors
- Use Apollo Client Devtools for debugging

## 8.11: Authors birth year

Implement a possibility to set authors birth year. You can create a new view for setting the birth year, or place it on the Authors view.

**Details:**
- Create form to set author birth year
- Form fields: author name, birth year
- Use `useMutation` for `editAuthor` mutation
- Update Authors view after setting birth year
- Use `refetchQueries` to update Authors view
- Handle errors (e.g., author not found)
- Show success/error notifications
- Clear form after successful submission

**Example Mutation:**
```graphql
mutation {
  editAuthor(name: "Reijo Mäki", setBornTo: 1958) {
    name
    born
  }
}
```

**Important:**
- Make sure Authors view is kept up to date after setting birth year
- Handle case when author is not found (returns null)

## 8.12: Authors birth year advanced

Make the birth year form such that the birth year can be set via a dropdown only for an existing author. You can use, for example, the select element or a separate library like react-select.

**Details:**
- Modify birth year form to use dropdown/select
- Populate dropdown with existing authors
- User selects author from dropdown
- Enter birth year in input field
- Submit to update author's birth year
- Can use native `<select>` element or `react-select` library
- Ensure only existing authors can be selected
- Update Authors view after submission

**Example with select element:**
```jsx
<select value={selectedAuthor} onChange={...}>
  <option value="">Select author</option>
  {authors.map(author => (
    <option key={author.id} value={author.name}>
      {author.name}
    </option>
  ))}
</select>
```

**Alternative with react-select:**
```bash
npm install react-select
```

```jsx
import Select from 'react-select'

<Select
  options={authors.map(a => ({ value: a.name, label: a.name }))}
  onChange={(option) => setSelectedAuthor(option.value)}
/>
```

# [Exercises 8.13.-8.16.: Database and User Administration](https://fullstackopen.com/en/part8/database_and_user_administration#exercises-8-13-8-16)

The following exercises are quite likely to break your frontend. Do not worry about it yet; the frontend shall be fixed and expanded in the next chapter.

## 8.13: Database, part 1

Refactor the library application code into multiple files in the same way as at the beginning of this chapter. Proceed in small steps and keep the application working at all times. You can, for example, use the frontend to verify that all features still work after the refactoring.

Then modify the application so that it stores the data in a database. You can find the _mongoose schema_ for books and authors from here.

Let's change the book graphql schema a little

```graphql
type Book {
  title: String!
  published: Int!
  author: Author!
  genres: [String!]!
  id: ID!
}
```

so that instead of just the author's name, the book object contains all the details of the author.

You can assume that the user will not try to add faulty books or authors, so you don't have to care about validation errors.

The following things do _not_ have to work just yet:

* _allBooks_ query with parameters
* _bookCount_ field of an author object
* _author_ field of a book
* _editAuthor_ mutation

**Note**: despite the fact that author is now an _object_ within a book, the schema for adding a book can remain same, only the _name_ of the author is given as a parameter

```graphql
type Mutation {
  addBook(
    title: String!
    author: String!
    published: Int!
    genres: [String!]!
  ): Book!
  editAuthor(name: String!, setBornTo: Int!): Author
}
```

**Details:**
- Refactor backend into separate modules:
  - `index.js` - main entry point
  - `server.js` - Apollo Server setup
  - `schema.js` - GraphQL schema
  - `resolvers.js` - GraphQL resolvers
  - `db.js` - database connection
  - `models/` - Mongoose models
- Install Mongoose and dotenv
- Create Mongoose schemas for Book and Author
- Update Book type to include Author object (not just name)
- Update resolvers to use MongoDB
- Keep addBook mutation simple (only author name as parameter)
- Test that basic queries still work
- Don't worry about validation errors yet

## 8.14: Database, part 2

Complete the program so that all queries (to get _allBooks_ working with the parameter _author_ and _bookCount_ field of an author object is not required) and mutations work.

Regarding the _genre_ parameter of the all books query, the situation is a bit more challenging. The solution is simple, but finding it can be a headache. You might benefit from this.

**Details:**
- Implement `allBooks` query with `author` parameter
- Implement `author` field resolver for Book type
- Implement `editAuthor` mutation
- Implement genre filtering in `allBooks` query
- Use MongoDB queries for filtering:
  - `$in` operator for genre array matching
  - Find author by name for author filtering
- Test all queries and mutations
- Ensure data consistency

**Hint for genre filtering:**
- Use MongoDB's `$in` operator to check if any genre in the book's genres array matches the filter
- Example: `Book.find({ genres: { $in: [args.genre] } })`

## 8.15: Database, part 3

Complete the program so that database validation errors (e.g. book title or author name being too short) are handled sensibly. This means that they cause GraphQLError with a suitable error message to be thrown.

**Details:**
- Add validation to Mongoose schemas:
  - Book: title (required, minlength), published (required)
  - Author: name (required, minlength), born (optional)
- Wrap save operations in try-catch blocks
- Throw GraphQLError with appropriate error messages
- Include error code in extensions (BAD_USER_INPUT)
- Test with invalid data:
  - Too short book title
  - Too short author name
  - Missing required fields
- Ensure error messages are user-friendly

**Example error handling:**
```js
try {
  await book.save()
} catch (error) {
  throw new GraphQLError(`Saving book failed: ${error.message}`, {
    extensions: {
      code: 'BAD_USER_INPUT',
      error
    }
  })
}
```

## 8.16: User and logging in

Add user management to your application. Expand the schema like so:

```graphql
type User {
  username: String!
  favoriteGenre: String!
  id: ID!
}

type Token {
  value: String!
}

type Query {
  // ..
  me: User
}

type Mutation {
  // ...
  createUser(
    username: String!
    favoriteGenre: String!
  ): User
  login(
    username: String!
    password: String!
  ): Token
}
```

Create resolvers for query _me_ and the new mutations _createUser_ and _login_. Like in the course material, you can assume all users have the same hardcoded password.

Make the mutations _addBook_ and _editAuthor_ possible only if the request includes a valid token.

(Don't worry about fixing the frontend for the moment.)

**Details:**
- Create User Mongoose model with:
  - username (required, minlength: 3)
  - favoriteGenre (required)
- Install jsonwebtoken
- Create User schema in GraphQL
- Create Token type in GraphQL
- Implement `createUser` mutation:
  - Create new user with username and favoriteGenre
  - Handle validation errors
- Implement `login` mutation:
  - Find user by username
  - Check password (hardcoded "secret")
  - Return JWT token
- Implement `me` query:
  - Return current user from context
- Set up context in server.js:
  - Extract Authorization header
  - Verify JWT token
  - Find user and add to context
- Protect `addBook` mutation:
  - Check if user is authenticated
  - Throw UNAUTHENTICATED error if not
- Protect `editAuthor` mutation:
  - Check if user is authenticated
  - Throw UNAUTHENTICATED error if not
- Add JWT_SECRET to .env file
- Test authentication flow:
  - Create user
  - Login to get token
  - Use token in Authorization header
  - Test protected mutations

**Note:** The frontend will be fixed in the next chapter, so don't worry if it breaks now.

# [Exercises 8.17.-8.22.: Login and Updating the Cache](https://fullstackopen.com/en/part8/login_and_updating_the_cache#exercises-8-17-8-22)

## 8.17: Listing books

After the backend changes, the list of books does not work anymore. Fix it.

**Details:**
- Check what changed in the backend schema
- Update frontend queries to match new schema
- Book type now has `author: Author!` instead of `author: String!`
- Update components that display books
- Ensure book list displays correctly
- Test that all book fields are accessible

**Common Issues:**
- Author field is now an object, not a string
- Need to query author fields explicitly
- May need to update query structure

## 8.18: Log in

Adding new books and changing the birth year of an author do not work because they require a user to be logged in.

Implement login functionality and fix the mutations.

It is not necessary yet to handle validation errors.

You can decide how the login looks on the user interface. One possible solution is to make the login form into a separate view which can be accessed through a navigation menu.

When a user is logged in, the navigation changes to show the functionalities which can only be done by a logged-in user.

**Details:**
- Create LOGIN mutation in queries.js
- Create LoginForm component:
  - Username and password inputs
  - useMutation hook with LOGIN
  - onCompleted callback to store token
  - onError callback for error handling
- Update App component:
  - Add token state (from localStorage)
  - Conditional rendering based on token
  - Show login form if no token
  - Show main app if token exists
- Configure Apollo Client:
  - Import setContext from @apollo/client/link/context
  - Create authLink to add Authorization header
  - Concatenate authLink with httpLink
- Add logout functionality:
  - Logout button
  - Clear token from state
  - Clear localStorage
  - Reset Apollo cache
- Test login flow:
  - Login with valid credentials
  - Token stored and used
  - Protected mutations work
  - Logout clears everything

**Optional:**
- Add navigation menu
- Separate login view
- Better UI/UX for login

## 8.19: Books by genre, part 1

Complete your application to filter the book list by genre. Your solution might look something like this:

In this exercise, the filtering can be done using just React.

**Details:**
- Add genre filter state
- Create genre buttons (all genres + specific genres)
- Filter books in component based on selected genre
- Update UI to show filtered books
- No GraphQL query changes needed
- Filtering happens client-side

**Implementation:**
- Extract all unique genres from books
- Create buttons for each genre + "all"
- Use useState for selected genre
- Filter books array based on selection
- Display filtered results

## 8.20: Books by genre, part 2

Implement a view which shows all the books based on the logged-in user's favourite genre.

**Details:**
- Query current user (me query)
- Get user's favoriteGenre
- Filter books by favoriteGenre
- Display books in separate view or section
- Update when user changes favoriteGenre
- Handle case when user has no favoriteGenre

**Implementation:**
- Use ME query to get current user
- Extract favoriteGenre from user
- Filter books by favoriteGenre
- Create separate component or section
- Show message if no books in favorite genre

## 8.21: Books by genre with GraphQL

In the previous two exercises, the filtering could have been done using just React. To complete this exercise, you should redo the filtering of the books based on a selected genre (that was done in exercise 8.19) using a GraphQL query to the server. If you already did so then you do not have to do anything.

This and the next exercise are quite **challenging**, like they should be this late in the course. It may help you to complete the easier exercises in the next part before doing 8.21 and 8.22.

**Details:**
- Update allBooks query to accept genre parameter
- Use genre parameter in GraphQL query
- Filter happens on server side
- Update frontend to pass genre to query
- Use variables in useQuery
- Remove client-side filtering
- Test with different genres

**Implementation:**
- Modify allBooks query in backend (if not already done)
- Update frontend query to include genre variable
- Pass genre as variable to useQuery
- Server handles filtering
- More efficient than client-side filtering

## 8.22: Up-to-date cache and book recommendations

If you did the previous exercise, that is, fetch the books in a genre with GraphQL, ensure somehow that the books view is kept up to date. So when a new book is added, the books view is updated **at least** when a genre selection button is pressed.

_When new genre selection is not done, the view does not have to be updated._

**Details:**
- Understand cache update strategies
- When new book added, cache needs updating
- Update cache when genre button pressed
- Use refetchQueries or update callback
- Ensure books list shows new books
- Test adding book and changing genre

# [Exercises 8.23.-8.26.: Fragments and Subscriptions](https://fullstackopen.com/en/part8/fragments_and_subscriptions#exercises-8-23-8-26)

## 8.23: Subscriptions - server

Do a backend implementation for subscription `bookAdded`, which returns the details of all new books to its subscribers.

**Details:**
- Add `bookAdded` subscription to GraphQL schema
- Install required packages:
  - `graphql-ws` and `ws` for WebSocket support
  - `graphql-subscriptions` for PubSub
  - `@graphql-tools/schema` for schema creation
- Update server.js to use Express middleware:
  - Replace `startStandaloneServer` with `expressMiddleware`
  - Set up WebSocket server
  - Configure Apollo Server with WebSocket support
- Create PubSub instance in resolvers
- Add subscription resolver:
  - `bookAdded` subscription
  - Returns asyncIterableIterator
- Update `addBook` mutation:
  - Publish event when book added
  - Use `pubsub.publish('BOOK_ADDED', { bookAdded: book })`
- Test subscription in Apollo Studio Explorer
- Verify subscription works when books are added

**Example Schema:**
```graphql
type Subscription {
  bookAdded: Book!
}
```

**Example Resolver:**
```js
Subscription: {
  bookAdded: {
    subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED')
  }
}
```

## 8.24: Subscriptions - client, part 1

Start using subscriptions in the client, and subscribe to `bookAdded`. When new books are added, notify the user. Any method works. For example, you can use the window.alert function.

**Details:**
- Install `graphql-ws` in frontend
- Update Apollo Client configuration:
  - Import `GraphQLWsLink` and `getMainDefinition`
  - Create WebSocket link
  - Use `ApolloLink.split` to route operations
  - Subscriptions → WebSocket, others → HTTP
- Define `BOOK_ADDED` subscription in queries.js
- Use `useSubscription` hook in component
- Show notification when book added:
  - Use `window.alert` or custom notification
  - Display book title or details
- Test by adding book in Apollo Studio
- Verify notification appears

**Example Subscription:**
```graphql
subscription {
  bookAdded {
    title
    author
    published
  }
}
```

**Example Usage:**
```js
useSubscription(BOOK_ADDED, {
  onData: ({ data }) => {
    window.alert(`New book added: ${data.data.bookAdded.title}`)
  }
})
```

## 8.25: Subscriptions - client, part 2

Keep the application's book view updated when the server notifies about new books (you can ignore the author view!). You can test your implementation by opening the app in two browser tabs and adding a new book in one tab. Adding the new book should update the view in both tabs.

**Details:**
- Update cache when subscription receives data
- Create helper function to add book to cache:
  - Check if book already exists
  - Prevent duplicates
  - Add to cache if not exists
- Use helper in subscription `onData` callback
- Update book list view automatically
- Test with multiple browser tabs:
  - Open app in two tabs
  - Add book in one tab
  - Verify both tabs update
- Ensure no duplicate books appear
- Handle edge cases (empty cache, etc.)

**Implementation:**
```js
// utils/apolloCache.js
export const addBookToCache = (cache, bookToAdd) => {
  cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
    const bookExists = allBooks.some(book => book.id === bookToAdd.id)
    if (bookExists) {
      return { allBooks }
    }
    return {
      allBooks: allBooks.concat(bookToAdd)
    }
  })
}
```

## 8.26: n+1

Solve the n+1 problem of the following query using any method you like.

```graphql
query {
  allAuthors {
    name 
    bookCount
  }
}
```

**Details:**
- Identify the n+1 problem:
  - Query fetches all authors (1 query)
  - Each author's bookCount triggers separate query (n queries)
  - Total: 1 + n queries
- Choose solution method:
  - **Option 1**: Populate in query
  - **Option 2**: Store bookCount in database
  - **Option 3**: Use DataLoader
  - **Option 4**: Aggregate query
- Implement chosen solution
- Verify solution works:
  - Check database queries (add logging)
  - Ensure correct bookCount values
  - Test with multiple authors
- Document the approach used

**Solution Options:**

**Option 1: Populate in Query**
```js
allAuthors: async () => {
  return Author.find({}).populate('books')
}
```
Then calculate bookCount in resolver:
```js
Author: {
  bookCount: (root) => root.books.length
}
```

**Option 2: Aggregate Query**
```js
allAuthors: async () => {
  const authors = await Author.find({})
  const bookCounts = await Book.aggregate([
    { $group: { _id: '$author', count: { $sum: 1 } } }
  ])
  // Map counts to authors
}
```

**Option 3: DataLoader**
```js
const bookCountLoader = new DataLoader(async (authorIds) => {
  const counts = await Book.aggregate([
    { $match: { author: { $in: authorIds } } },
    { $group: { _id: '$author', count: { $sum: 1 } } }
  ])
  return authorIds.map(id => 
    counts.find(c => c._id.toString() === id)?.count || 0
  )
})
```

**Option 4: Store in Database**
Add `bookCount` field to Author schema and update when books added/removed.


**Implementation Options:**
1. **refetchQueries**: Refetch allBooks when addBook mutation completes
2. **update callback**: Manually update cache for allBooks query
3. **Combination**: Update cache and refetch on genre change

**Key Points:**
- Cache must be updated after mutations
- Genre change triggers refetch/update
- Books view shows latest data
- No stale data in cache
