# Flight Diary Backend

A TypeScript Express backend for managing flight diary entries.

## Features

- Type-safe Express endpoints
- Request validation with Zod
- Utility types (Pick, Omit)
- Enums for fixed values
- Service layer pattern
- Production build support

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run tsc
npm start
```

4. Run linter:
```bash
npm run lint
```

## Project Structure

```
flight-diary/
├── src/
│   ├── routes/        # Route handlers
│   ├── services/      # Business logic
│   ├── utils/         # Validation utilities
│   ├── types.ts       # Type definitions
│   └── index.ts       # Entry point
├── data/              # Data files
└── build/             # Compiled JavaScript
```

## Endpoints

- `GET /ping` - Health check
- `GET /api/diaries` - Get all diary entries (without comments)
- `GET /api/diaries/:id` - Get specific diary entry
- `POST /api/diaries` - Add new diary entry

## Key Concepts

- Type definitions with interfaces and enums
- Utility types for type manipulation
- Type guards for validation
- Zod for schema validation
- Middleware for request validation
- Service layer pattern
