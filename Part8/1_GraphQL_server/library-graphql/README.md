# Library GraphQL Server

A GraphQL server implementation for a library application with books and authors.

## Features

- Query book and author counts
- Get all books with optional filtering by author and genre
- Get all authors with book count
- Add new books (creates author if doesn't exist)
- Update author birth year

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

### Get counts
```graphql
query {
  bookCount
  authorCount
}
```

### Get all books
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

### Get all authors
```graphql
query {
  allAuthors {
    name
    bookCount
    born
  }
}
```

### Filter books by author
```graphql
query {
  allBooks(author: "Robert Martin") {
    title
  }
}
```

### Filter books by genre
```graphql
query {
  allBooks(genre: "refactoring") {
    title
    author
  }
}
```

### Filter by both author and genre
```graphql
query {
  allBooks(author: "Robert Martin", genre: "refactoring") {
    title
    author
  }
}
```

### Add book
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

### Edit author birth year
```graphql
mutation {
  editAuthor(name: "Reijo Mäki", setBornTo: 1958) {
    name
    born
  }
}
```

## Exercises

This server implements exercises 8.1-8.7 from the Full Stack Open course:
- 8.1: bookCount and authorCount queries
- 8.2: allBooks query
- 8.3: allAuthors query with bookCount
- 8.4: allBooks with author filter
- 8.5: allBooks with genre filter
- 8.6: addBook mutation
- 8.7: editAuthor mutation
