# Express Project with TypeScript

An Express application demonstrating TypeScript integration.

## Features

- TypeScript with Express
- Type-safe endpoints
- ESLint configuration
- Auto-reloading with ts-node-dev

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Start production server:
```bash
npm start
```

4. Run linter:
```bash
npm run lint
```

## Endpoints

- `GET /ping` - Returns 'pong'
- `POST /calculate` - Calculates with two numbers and operation

## Key Concepts

- Type annotations for Express
- Handling `any` types from `req.body`
- Type assertions
- ESLint rules for TypeScript
