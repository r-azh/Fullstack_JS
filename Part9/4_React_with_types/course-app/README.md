# Course App

A TypeScript React application demonstrating discriminated unions and type narrowing.

## Features

- Type-safe React components
- Discriminated unions for course parts
- Exhaustive type checking with `assertNever`
- Type narrowing with switch cases

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
npm run build
```

## Key Concepts

- **Discriminated Unions**: Using `kind` field to distinguish between types
- **Type Narrowing**: Switch cases narrow types automatically
- **Exhaustive Checking**: `assertNever` ensures all cases handled
- **Interface Extension**: Base interfaces reduce duplication
