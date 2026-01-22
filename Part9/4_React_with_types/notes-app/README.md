# Notes App

A TypeScript React application demonstrating state management and API integration with typed Axios.

## Features

- Typed React state with `useState`
- Typed event handlers
- API integration with typed Axios
- Service layer pattern

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start JSON server (in separate terminal):
```bash
npx json-server --port 3001 --watch db.json
```

3. Start development server:
```bash
npm run dev
```

## Key Concepts

- **Typed useState**: `useState<Note[]>([])` for array state
- **Event Types**: `React.SyntheticEvent`, `React.ChangeEvent`
- **Axios Types**: `axios.get<Note[]>()` for typed responses
- **Service Layer**: Separating API calls from components
