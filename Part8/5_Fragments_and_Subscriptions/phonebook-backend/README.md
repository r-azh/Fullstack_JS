# Phonebook GraphQL Backend with Subscriptions

A GraphQL backend using Apollo Server with Express, WebSockets, and subscriptions.

## Features

- GraphQL subscriptions for real-time updates
- WebSocket support
- Express middleware integration
- PubSub for publish-subscribe pattern
- User authentication
- MongoDB integration

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```
MONGODB_URI=mongodb://localhost:27017/phonebook
PORT=4000
JWT_SECRET=your-secret-key-here
```

3. Make sure MongoDB is running

4. Start the server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

## Key Concepts

### Subscriptions
- Real-time updates via WebSockets
- PubSub pattern for event publishing
- Automatic client notifications
- Efficient bidirectional communication

### Express Integration
- Apollo Server as Express middleware
- HTTP for queries/mutations
- WebSocket for subscriptions
- Proper server shutdown handling

### Dependencies
- `express`: HTTP server
- `graphql-ws`: WebSocket server
- `graphql-subscriptions`: PubSub functionality
- `@graphql-tools/schema`: Schema creation
