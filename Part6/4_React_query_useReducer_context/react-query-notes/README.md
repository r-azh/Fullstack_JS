# React Query Notes Application

A notes application demonstrating React Query (TanStack Query) for server state management.

## Features

- Fetch notes from json-server backend
- Create new notes
- Toggle note importance
- Automatic cache invalidation
- Loading and error states
- Optimistic updates support

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the json-server backend:
```bash
npm run server
```

3. Start the development server (in another terminal):
```bash
npm run dev
```

## Key Concepts

1. **React Query**: Server state management library
2. **useQuery**: Hook for fetching data
3. **useMutation**: Hook for creating/updating/deleting data
4. **Query Invalidation**: Refetching data after mutations
5. **Cache Management**: Automatic caching and refetching

## Project Structure

```
src/
  ├── main.jsx                    # App entry with QueryClientProvider
  ├── App.jsx                     # Main component with queries and mutations
  └── requests.js                 # API service layer (Fetch API)
db.json                          # json-server database
```

## React Query Benefits

- No need for useState/useEffect for API calls
- Automatic caching and refetching
- Loading and error states built-in
- Optimistic updates support
- Background refetching
- Request deduplication
