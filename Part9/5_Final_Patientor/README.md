# Patientor - Grande Finale

A complete TypeScript application combining backend and frontend for managing patient medical records.

## Features

- Patient management
- Medical entry tracking
- Multiple entry types (HealthCheck, Hospital, OccupationalHealthcare)
- Diagnosis code integration
- Type-safe API communication
- Discriminated unions for entries
- Exhaustive type checking

## Project Structure

```
patientor/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types.ts
│   │   └── utils.ts
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── services/
    │   └── types.ts
    └── package.json
```

## Key Concepts

- **Discriminated Unions**: Entry types with `type` field
- **UnionOmit**: Custom utility for omitting from unions
- **Exhaustive Type Checking**: `assertNever` for completeness
- **Function Props**: Typing React.Dispatch and async functions
- **Indexed Access Types**: `Diagnosis['code']`

## Entry Types

- **HealthCheck**: Basic health check with rating
- **Hospital**: Hospital visit with discharge info
- **OccupationalHealthcare**: Work-related with employer and sick leave

## Setup

1. Backend:
```bash
cd backend
npm install
npm run dev
```

2. Frontend:
```bash
cd frontend
npm install
npm run dev
```

## Exercises

This project is built through exercises 9.21-9.30, covering:
- Patient detail endpoints
- Entry type definitions
- Frontend patient pages
- Entry creation
- Form improvements
