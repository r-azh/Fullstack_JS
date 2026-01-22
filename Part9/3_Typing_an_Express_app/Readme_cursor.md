# Typing an Express App - Summary

This section covers building a production-ready TypeScript Express application with proper type safety, validation, and best practices.

## Project Setup

### Using Official TypeScript Compiler

**Why not ts-node?**
- ts-node is for development only
- Production needs compiled JavaScript
- Official compiler creates production builds
- Better for real projects

### Initialization

**1. Install TypeScript:**
```bash
npm install typescript --save-dev
```

**2. Add tsc script:**
```json
{
  "scripts": {
    "tsc": "tsc"
  }
}
```

**3. Initialize tsconfig.json:**
```bash
npm run tsc -- --init
```

**Note:** The `--` separates npm arguments from tsc arguments.

### tsconfig.json Configuration

```json
{
  "compilerOptions": {
    "target": "ES6",
    "outDir": "./build/",
    "module": "commonjs",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "esModuleInterop": true,
    "resolveJsonModule": true
  }
}
```

**Key Options:**
- `target`: ECMAScript version (ES6)
- `outDir`: Output directory for compiled JS
- `module`: Module system (commonjs)
- `strict`: Enable all strict checks
- `resolveJsonModule`: Import JSON files

### Development Setup

**Install dependencies:**
```bash
npm install express
npm install --save-dev eslint @eslint/js typescript-eslint @stylistic/eslint-plugin @types/express @types/eslint__js ts-node-dev
```

**Scripts:**
```json
{
  "scripts": {
    "tsc": "tsc",
    "dev": "ts-node-dev index.ts",
    "lint": "eslint .",
    "start": "node build/index.js"
  }
}
```

## Project Structure

### Directory Organization

```
project/
├── src/
│   ├── routes/        # Route handlers
│   ├── services/      # Business logic
│   ├── utils/         # Utility functions
│   └── types.ts       # Type definitions
├── data/              # Data files
├── build/             # Compiled JavaScript
├── tsconfig.json
├── package.json
└── eslint.config.mjs
```

**Benefits:**
- Clear separation of concerns
- Easy to navigate
- Scalable structure

## Type Definitions

### Basic Types

```typescript
// src/types.ts
export type Weather = 'sunny' | 'rainy' | 'cloudy' | 'windy' | 'stormy';
export type Visibility = 'great' | 'good' | 'ok' | 'poor';
```

**String Literal Types:**
- Exact string values
- Union of allowed values
- Type-safe constants

### Interfaces

```typescript
// src/types.ts
export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment: string;
}
```

**Key Points:**
- Defines object shape
- Properties with types
- Can be extended
- Optional properties with `?`

### Optional Properties

```typescript
export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string; // Optional
}
```

## Utility Types

### Pick

Select specific fields from a type:

```typescript
// src/types.ts
type PublicDiaryEntry = Pick<DiaryEntry, 'id' | 'date' | 'weather' | 'visibility'>;
```

**Usage:**
```typescript
const getPublicEntries = (): PublicDiaryEntry[] => {
  return diaries.map(({ id, date, weather, visibility }) => ({
    id,
    date,
    weather,
    visibility
  }));
};
```

### Omit

Exclude specific fields from a type:

```typescript
// src/types.ts
export type NonSensitiveDiaryEntry = Omit<DiaryEntry, 'comment'>;
export type NewDiaryEntry = Omit<DiaryEntry, 'id'>;
```

**Usage:**
```typescript
const getNonSensitiveEntries = (): NonSensitiveDiaryEntry[] => {
  return diaries.map(({ id, date, weather, visibility }) => ({
    id,
    date,
    weather,
    visibility
  }));
};
```

**Benefits:**
- Type-safe field exclusion
- Reusable type definitions
- Clear intent

## Enums

### What are Enums?

Enums allow using actual values at runtime, not just compile time.

**Type Alias (Before):**
```typescript
export type Weather = 'sunny' | 'rainy' | 'cloudy' | 'windy' | 'stormy';
```

**Enum (After):**
```typescript
// src/types.ts
export enum Weather {
  Sunny = 'sunny',
  Rainy = 'rainy',
  Cloudy = 'cloudy',
  Stormy = 'stormy',
  Windy = 'windy',
}
```

**Benefits:**
- Runtime values available
- Can validate against enum
- Single source of truth
- Better type guards

### Using Enums

```typescript
// Type guard with enum
const isWeather = (param: string): param is Weather => {
  return Object.values(Weather).map(v => v.toString()).includes(param);
};

// Usage
if (isWeather(value)) {
  // TypeScript knows value is Weather
}
```

## Type Guards

### What are Type Guards?

Functions that narrow types using type predicates.

**Basic Type Guard:**
```typescript
// src/utils.ts
const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};
```

**Key Points:**
- Returns boolean
- Type predicate: `text is string`
- TypeScript narrows type after check

### Using Type Guards

```typescript
const parseComment = (comment: unknown): string => {
  if (!comment || !isString(comment)) {
    throw new Error('Incorrect or missing comment');
  }
  // TypeScript knows comment is string here
  return comment;
};
```

### Multiple Type Guards

```typescript
// Check if value is object
if (!object || typeof object !== 'object') {
  throw new Error('Incorrect or missing data');
}

// Check if object has required fields
if ('comment' in object && 'date' in object && 'weather' in object) {
  // TypeScript knows object has these fields
}
```

## Request Validation

### Manual Validation

**Step 1: Type Guard Functions**
```typescript
// src/utils.ts
const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isWeather = (param: string): param is Weather => {
  return Object.values(Weather).map(v => v.toString()).includes(param);
};
```

**Step 2: Parser Functions**
```typescript
const parseComment = (comment: unknown): string => {
  if (!isString(comment)) {
    throw new Error('Incorrect or missing comment');
  }
  return comment;
};

const parseDate = (date: unknown): string => {
  if (!isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};

const parseWeather = (weather: unknown): Weather => {
  if (!isString(weather) || !isWeather(weather)) {
    throw new Error('Incorrect or missing weather: ' + weather);
  }
  return weather;
};
```

**Step 3: Main Validator**
```typescript
export const toNewDiaryEntry = (object: unknown): NewDiaryEntry => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if ('comment' in object && 'date' in object && 'weather' in object && 'visibility' in object) {
    const newEntry: NewDiaryEntry = {
      weather: parseWeather(object.weather),
      visibility: parseVisibility(object.visibility),
      date: parseDate(object.date),
      comment: parseComment(object.comment)
    };

    return newEntry;
  }

  throw new Error('Incorrect data: some fields are missing');
};
```

### Using Zod

**Installation:**
```bash
npm install zod
```

**Basic Usage:**
```typescript
import { z } from 'zod';

// Parse single field
const comment = z.string().parse(object.comment);

// Parse with validation
const date = z.string().date().parse(object.date);

// Optional field
const comment = z.string().optional().parse(object.comment);
```

**Schema Definition:**
```typescript
// src/utils.ts
import { z } from 'zod';
import { Weather, Visibility } from '../types';

const newEntrySchema = z.object({
  weather: z.nativeEnum(Weather),
  visibility: z.nativeEnum(Visibility),
  date: z.string().date(),
  comment: z.string().optional()
});

export const toNewDiaryEntry = (object: unknown): NewDiaryEntry => {
  return newEntrySchema.parse(object);
};
```

**Type Inference:**
```typescript
// Infer type from schema
export type NewDiaryEntry = z.infer<typeof newEntrySchema>;
```

**Error Handling:**
```typescript
import { z } from 'zod';

router.post('/', (req, res) => {
  try {
    const newDiaryEntry = toNewDiaryEntry(req.body);
    const addedEntry = diaryService.addDiary(newDiaryEntry);
    res.json(addedEntry);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).send({ error: error.issues });
    } else {
      res.status(400).send({ error: 'unknown error' });
    }
  }
});
```

## Express Types

### Request and Response Types

**Basic Types:**
```typescript
import { Request, Response } from 'express';

router.get('/', (_req: Request, res: Response) => {
  res.send('Hello');
});
```

**Generic Types:**
```typescript
// Request<Params, ResBody, ReqBody, Query>
router.post('/', (
  req: Request<unknown, unknown, NewDiaryEntry>,
  res: Response<DiaryEntry>
) => {
  const newEntry = req.body; // Type: NewDiaryEntry
  const addedEntry = diaryService.addDiary(newEntry);
  res.json(addedEntry); // Response type: DiaryEntry
});
```

**Type Parameters:**
1. `Params`: Route parameters (`/api/diaries/:id`)
2. `ResBody`: Response body type
3. `ReqBody`: Request body type
4. `Query`: Query parameters type

## Middleware for Validation

### Validation Middleware

```typescript
// src/routes/diaries.ts
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { NewEntrySchema } from '../utils';

const newDiaryParser = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    NewEntrySchema.parse(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};
```

**Usage:**
```typescript
router.post(
  '/',
  newDiaryParser,
  (req: Request<unknown, unknown, NewDiaryEntry>, res: Response<DiaryEntry>) => {
    // req.body is guaranteed to be NewDiaryEntry
    const addedEntry = diaryService.addDiary(req.body);
    res.json(addedEntry);
  }
);
```

### Error Handling Middleware

```typescript
// src/routes/diaries.ts
const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

router.use(errorMiddleware);
```

## Data Handling

### Importing JSON

**tsconfig.json:**
```json
{
  "compilerOptions": {
    "resolveJsonModule": true
  }
}
```

**Import:**
```typescript
import diaryData from '../../data/entries.json';
```

**Type Assertion:**
```typescript
import { DiaryEntry } from '../types';
const diaries: DiaryEntry[] = diaryData as DiaryEntry[];
```

### Converting JSON to TypeScript

**Better Approach:**
```typescript
// data/entries.ts
import { DiaryEntry } from "../src/types";

const diaryEntries: DiaryEntry[] = [
  {
    id: 1,
    date: "2017-01-01",
    weather: "rainy",
    visibility: "poor",
    comment: "Pretty scary flight"
  },
  // ...
];

export default diaryEntries;
```

**Benefits:**
- Type checking at compile time
- No type assertions needed
- Better IDE support

## Service Layer

### Service Pattern

Separate business logic from route handlers:

```typescript
// src/services/diaryService.ts
import diaries from '../../data/entries';
import { NonSensitiveDiaryEntry, DiaryEntry, NewDiaryEntry } from '../types';

const getEntries = (): DiaryEntry[] => {
  return diaries;
};

const getNonSensitiveEntries = (): NonSensitiveDiaryEntry[] => {
  return diaries.map(({ id, date, weather, visibility }) => ({
    id,
    date,
    weather,
    visibility
  }));
};

const findById = (id: number): DiaryEntry | undefined => {
  const entry = diaries.find(d => d.id === id);
  return entry;
};

const addDiary = (entry: NewDiaryEntry): DiaryEntry => {
  const newDiaryEntry = {
    id: Math.max(...diaries.map(d => d.id)) + 1,
    ...entry
  };

  diaries.push(newDiaryEntry);
  return newDiaryEntry;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  findById,
  addDiary
};
```

**Benefits:**
- Separation of concerns
- Reusable business logic
- Easier to test
- Cleaner route handlers

## Route Handlers

### Basic Route

```typescript
// src/routes/diaries.ts
import express from 'express';
import diaryService from '../services/diaryService';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(diaryService.getNonSensitiveEntries());
});

export default router;
```

### Route with Parameters

```typescript
router.get('/:id', (req, res) => {
  const diary = diaryService.findById(Number(req.params.id));

  if (diary) {
    res.send(diary);
  } else {
    res.sendStatus(404);
  }
});
```

### Route with Validation

```typescript
router.post(
  '/',
  newDiaryParser,
  (req: Request<unknown, unknown, NewDiaryEntry>, res: Response<DiaryEntry>) => {
    const addedEntry = diaryService.addDiary(req.body);
    res.json(addedEntry);
  }
);
```

## Handling Undefined

### Problem

```typescript
const findById = (id: number): DiaryEntry => {
  const entry = diaries.find(d => d.id === id);
  return entry; // Error: entry might be undefined
};
```

### Solution

```typescript
const findById = (id: number): DiaryEntry | undefined => {
  const entry = diaries.find(d => d.id === id);
  return entry;
};
```

**Usage:**
```typescript
router.get('/:id', (req, res) => {
  const diary = diaryService.findById(Number(req.params.id));

  if (diary) {
    res.send(diary);
  } else {
    res.sendStatus(404);
  }
});
```

## Best Practices

### 1. Always Validate External Data

```typescript
// ✅ Good: Validate before use
const newEntry = toNewDiaryEntry(req.body);
const addedEntry = diaryService.addDiary(newEntry);

// ❌ Bad: Use without validation
const addedEntry = diaryService.addDiary(req.body);
```

### 2. Use Utility Types

```typescript
// ✅ Good: Use Omit for new entries
export type NewDiaryEntry = Omit<DiaryEntry, 'id'>;

// ❌ Bad: Duplicate type definition
export interface NewDiaryEntry {
  date: string;
  weather: Weather;
  // ...
}
```

### 3. Use Enums for Fixed Values

```typescript
// ✅ Good: Enum for runtime values
export enum Weather {
  Sunny = 'sunny',
  Rainy = 'rainy',
}

// ⚠️ OK: Type alias (no runtime values)
export type Weather = 'sunny' | 'rainy';
```

### 4. Type Request/Response

```typescript
// ✅ Good: Type generic parameters
router.post('/', (
  req: Request<unknown, unknown, NewDiaryEntry>,
  res: Response<DiaryEntry>
) => {
  // req.body is typed
});

// ❌ Bad: No types
router.post('/', (req, res) => {
  // req.body is any
});
```

### 5. Use Middleware for Validation

```typescript
// ✅ Good: Validation middleware
router.post('/', newDiaryParser, (req, res) => {
  // req.body guaranteed to be valid
});

// ⚠️ OK: Validation in handler
router.post('/', (req, res) => {
  const newEntry = toNewDiaryEntry(req.body);
  // ...
});
```

## Common Patterns

### Validation Pattern

```typescript
// 1. Type guard
const isString = (text: unknown): text is string => {
  return typeof text === 'string';
};

// 2. Parser
const parseString = (value: unknown): string => {
  if (!isString(value)) {
    throw new Error('Invalid string');
  }
  return value;
};

// 3. Main validator
const validate = (object: unknown): Type => {
  if (!object || typeof object !== 'object') {
    throw new Error('Invalid data');
  }
  // Validate and parse fields
  return { /* parsed object */ };
};
```

### Service Pattern

```typescript
// Service handles business logic
const service = {
  getAll: (): Type[] => { /* ... */ },
  getById: (id: number): Type | undefined => { /* ... */ },
  create: (data: NewType): Type => { /* ... */ }
};

// Route handler uses service
router.get('/', (_req, res) => {
  res.json(service.getAll());
});
```

### Error Handling Pattern

```typescript
router.post('/', (req, res) => {
  try {
    const validated = validator(req.body);
    const result = service.create(validated);
    res.json(result);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Unknown error' });
    }
  }
});
```

## Exercises

The exercises (9.8-9.14) involve:
- Setting up Patientor backend
- Creating type definitions
- Implementing endpoints
- Adding validation with Zod
