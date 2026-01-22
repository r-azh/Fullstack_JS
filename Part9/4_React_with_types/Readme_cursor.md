# React with Types - Summary

This section covers using TypeScript with React to create type-safe React applications.

## Why TypeScript with React?

TypeScript helps catch errors early:
- Trying to pass an extra/unwanted prop to a component
- Forgetting to pass a required prop to a component
- Passing a prop with the wrong type to a component

These errors are caught in the editor, not during testing.

## Vite with TypeScript

### Creating a TypeScript React App

```bash
npm create vite@latest my-app-name -- --template react-ts
```

**Key Differences:**
- `.jsx` files become `.tsx` files
- Type annotations added
- `tsconfig.json` file included

### tsconfig.json for React

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

**Key Options:**
- `lib`: Type definitions for browser environments
- `jsx`: How to handle JSX (react-jsx for React 17+)
- `noEmit`: Don't emit files (Vite handles bundling)

### Non-null Assertion

```tsx
// src/main.tsx
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

**Why `!`?**
- `getElementById` can return `null`
- `createRoot` doesn't accept `null`
- `!` asserts the value is not null
- Safe here because we control the HTML

## React Components with TypeScript

### Basic Component

**JavaScript with PropTypes:**
```jsx
import PropTypes from "prop-types";

const Welcome = props => {
  return <h1>Hello, {props.name}</h1>;
};

Welcome.propTypes = {
  name: PropTypes.string
};
```

**TypeScript (No PropTypes needed):**
```tsx
interface WelcomeProps {
  name: string;
}

const Welcome = (props: WelcomeProps): JSX.Element => {
  return <h1>Hello, {props.name}</h1>;
};
```

**Key Points:**
- Interface defines prop types
- No need for PropTypes package
- Return type `JSX.Element` (optional, inferred)

### Simplified Syntax

**With destructuring:**
```tsx
interface WelcomeProps {
  name: string;
}

const Welcome = ({ name }: WelcomeProps) => {
  return <h1>Hello, {name}</h1>;
};
```

**Inline types:**
```tsx
const Welcome = ({ name }: { name: string }) => (
  <h1>Hello, {name}</h1>
);
```

**Return type inference:**
```tsx
// Return type is inferred, no need to specify
const Welcome = (props: WelcomeProps) => {
  return <h1>Hello, {props.name}</h1>;
};
```

## Deeper Type Usage

### Problem: Different Course Parts

```tsx
const courseParts = [
  {
    name: "Fundamentals",
    exerciseCount: 10,
    description: "This is an awesome course part"
  },
  {
    name: "Using props to pass data",
    exerciseCount: 7,
    groupProjectCount: 3
  },
  {
    name: "Basics of type Narrowing",
    exerciseCount: 7,
    description: "How to go from unknown to string"
  },
  {
    name: "Deeper type usage",
    exerciseCount: 14,
    description: "Confusing description",
    backgroundMaterial: "https://type-level-typescript.com/template-literal-types"
  },
];
```

**Challenge:**
- Different parts have different attributes
- Need type safety for all variations
- Want to catch missing attributes

### Solution: Discriminated Unions

**Step 1: Define Individual Types**
```tsx
interface CoursePartBasic {
  name: string;
  exerciseCount: number;
  description: string;
  kind: "basic"
}

interface CoursePartGroup {
  name: string;
  exerciseCount: number;
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground {
  name: string;
  exerciseCount: number;
  description: string;
  backgroundMaterial: string;
  kind: "background"
}
```

**Step 2: Create Union Type**
```tsx
type CoursePart = CoursePartBasic | CoursePartGroup | CoursePartBackground;
```

**Step 3: Use in Component**
```tsx
const courseParts: CoursePart[] = [
  {
    name: "Fundamentals",
    exerciseCount: 10,
    description: "This is an awesome course part",
    kind: "basic"
  },
  // ...
];
```

**Benefits:**
- TypeScript knows which attributes exist
- Catches missing required attributes
- Prevents extra attributes

### Reducing Duplication

**Base Interface:**
```tsx
interface CoursePartBase {
  name: string;
  exerciseCount: number;
}
```

**Extended Interfaces:**
```tsx
interface CoursePartBasic extends CoursePartBase {
  description: string;
  kind: "basic"
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group"
}

interface CoursePartBackground extends CoursePartBase {
  description: string;
  backgroundMaterial: string;
  kind: "background"
}
```

**Shared Attributes:**
```tsx
interface CoursePartWithDescription extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartWithDescription {
  kind: "basic"
}

interface CoursePartBackground extends CoursePartWithDescription {
  backgroundMaterial: string;
  kind: "background"
}
```

## Type Narrowing

### The Problem

When accessing a union type, TypeScript only allows operations valid for ALL members:

```tsx
courseParts.forEach(part => {
  // Can only access: name, exerciseCount, kind
  // Cannot access: description, groupProjectCount, etc.
  console.log(part.name); // ✅ OK
  console.log(part.description); // ❌ Error
});
```

### Solution: Discriminated Union with Switch

**Switch Case Narrowing:**
```tsx
const Part = ({ part }: { part: CoursePart }) => {
  switch (part.kind) {
    case "basic":
      return (
        <div>
          <h3>{part.name} {part.exerciseCount}</h3>
          <p>{part.description}</p>
        </div>
      );
    case "group":
      return (
        <div>
          <h3>{part.name} {part.exerciseCount}</h3>
          <p>project exercises {part.groupProjectCount}</p>
        </div>
      );
    case "background":
      return (
        <div>
          <h3>{part.name} {part.exerciseCount}</h3>
          <p>{part.description}</p>
          <p>submit to {part.backgroundMaterial}</p>
        </div>
      );
  }
};
```

**How It Works:**
- TypeScript narrows type based on `kind` value
- In each case, knows exact type
- Can access type-specific attributes

### If Statement Narrowing

```tsx
courseParts.forEach(part => {
  if (part.kind === 'background') {
    console.log('see the following:', part.backgroundMaterial);
  }
  // Cannot access part.backgroundMaterial here!
});
```

## Exhaustive Type Checking

### The Problem

Adding a new type might not be handled everywhere:

```tsx
switch (part.kind) {
  case "basic":
    // ...
    break;
  case "group":
    // ...
    break;
  default:
    // New types go here, might be forgotten
    break;
}
```

### Solution: assertNever Function

**Helper Function:**
```tsx
/**
 * Helper function for exhaustive type checking
 */
const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};
```

**Usage:**
```tsx
const Part = ({ part }: { part: CoursePart }) => {
  switch (part.kind) {
    case "basic":
      // ...
      break;
    case "group":
      // ...
      break;
    case "background":
      // ...
      break;
    default:
      return assertNever(part); // TypeScript error if new type added
  }
};
```

**Benefits:**
- TypeScript error if new type not handled
- Compile-time safety
- Prevents runtime errors

## React State with TypeScript

### useState Hook

**String State:**
```tsx
const [newNote, setNewNote] = useState('');
```

TypeScript infers: `[string, React.Dispatch<React.SetStateAction<string>>]`

**Array State (Problem):**
```tsx
const [notes, setNotes] = useState([]);
```

TypeScript infers: `[never[], React.Dispatch<React.SetStateAction<never[]>>]`

**Array State (Solution):**
```tsx
interface Note {
  id: string;
  content: string;
}

const [notes, setNotes] = useState<Note[]>([]);
```

TypeScript now knows: `[Note[], React.Dispatch<React.SetStateAction<Note[]>>]`

### useState is Generic

```tsx
useState<Note[]>(initialState: Note[] | (() => Note[])):
  [Note[], React.Dispatch<React.SetStateAction<Note[]>>]
```

**Key Points:**
- `useState` is a generic function
- Type parameter specifies state type
- Initial state can be value or function
- TypeScript infers when possible

### Using Typed State

```tsx
interface Note {
  id: string;
  content: string;
}

const App = () => {
  const [notes, setNotes] = useState<Note[]>([
    { id: '1', content: 'testing' }
  ]);
  const [newNote, setNewNote] = useState('');

  return (
    <div>
      <ul>
        {notes.map(note =>
          <li key={note.id}>{note.content}</li>
        )}
      </ul>
    </div>
  );
};
```

## Event Handlers

### Form Events

**Problem:**
```tsx
const noteCreation = (event) => {
  event.preventDefault();
  // Error: Parameter 'event' implicitly has an 'any' type
};
```

**Solution:**
```tsx
const noteCreation = (event: React.SyntheticEvent) => {
  event.preventDefault();
  const noteToAdd = {
    content: newNote,
    id: String(notes.length + 1)
  };
  setNotes(notes.concat(noteToAdd));
  setNewNote('');
};
```

**More Specific Types:**
```tsx
// Form submission
const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
};

// Input change
const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setValue(event.target.value);
};

// Button click
const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  // ...
};
```

## Communicating with Server

### Axios with TypeScript

**Problem:**
```tsx
useEffect(() => {
  axios.get('http://localhost:3001/notes').then(response => {
    console.log(response.data); // Type: any
  });
}, []);
```

**Solution: Type Parameter**
```tsx
useEffect(() => {
  axios.get<Note[]>('http://localhost:3001/notes').then(response => {
    console.log(response.data); // Type: Note[]
    setNotes(response.data);
  });
}, []);
```

**Key Points:**
- `axios.get` is a generic function
- Type parameter specifies response data type
- Default type is `any` (unsafe)
- Type parameter is like type assertion

### Type Safety Warning

**⚠️ Important:**
```tsx
// This is NOT runtime validation!
axios.get<Note[]>('http://localhost:3001/notes')
```

The type parameter doesn't validate at runtime. It's like:
```tsx
setNotes(response.data as Note[]); // Not safe!
```

**Best Practice:**
- Only use if absolutely sure backend is correct
- For robust systems, parse/validate response
- Consider using Zod for runtime validation

### POST Requests

```tsx
const noteCreation = (event: React.SyntheticEvent) => {
  event.preventDefault();
  axios.post<Note>('http://localhost:3001/notes', { content: newNote })
    .then(response => {
      setNotes(notes.concat(response.data));
    });
  setNewNote('');
};
```

**Type Parameter:**
- `axios.post<Note>` - Response type
- Request body type inferred from second parameter

## Service Layer Pattern

### Extract API Calls

**types.ts:**
```tsx
export interface Note {
  id: string;
  content: string;
}

export type NewNote = Omit<Note, 'id'>;
```

**noteService.ts:**
```tsx
import axios from 'axios';
import { Note, NewNote } from "./types";

const baseUrl = 'http://localhost:3001/notes';

export const getAllNotes = () => {
  return axios
    .get<Note[]>(baseUrl)
    .then(response => response.data);
};

export const createNote = (object: NewNote) => {
  return axios
    .post<Note>(baseUrl, object)
    .then(response => response.data);
};
```

**App.tsx:**
```tsx
import { useState, useEffect } from "react";
import { Note } from "./types";
import { getAllNotes, createNote } from './noteService';

const App = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    getAllNotes().then(data => {
      setNotes(data);
    });
  }, []);

  const noteCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();
    createNote({ content: newNote }).then(data => {
      setNotes(notes.concat(data));
    });
    setNewNote('');
  };

  return (
    <div>
      <form onSubmit={noteCreation}>
        <input
          value={newNote}
          onChange={(event) => setNewNote(event.target.value)}
        />
        <button type='submit'>add</button>
      </form>
      <ul>
        {notes.map(note =>
          <li key={note.id}>{note.content}</li>
        )}
      </ul>
    </div>
  );
};
```

**Benefits:**
- Separation of concerns
- Reusable API functions
- Cleaner component code
- Easier to test

## Interface vs Type Alias

### Interface

```tsx
interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
}
```

### Type Alias

```tsx
type DiaryEntry = {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment?: string;
};
```

### Differences

**Interface:**
- Can be merged (declaration merging)
- Better for object shapes
- Recommended by TypeScript docs

**Type Alias:**
- Cannot be merged
- More flexible (unions, intersections, etc.)
- Better for complex types

**Recommendation:**
- Use `interface` for object shapes
- Use `type` for unions, intersections, utilities

## Best Practices

### 1. Always Type Props

```tsx
// ✅ Good
interface ButtonProps {
  label: string;
  onClick: () => void;
}

const Button = ({ label, onClick }: ButtonProps) => {
  // ...
};

// ❌ Bad
const Button = ({ label, onClick }) => {
  // ...
};
```

### 2. Use Discriminated Unions for Variants

```tsx
// ✅ Good
interface Success {
  status: "success";
  data: string;
}

interface Error {
  status: "error";
  message: string;
}

type Result = Success | Error;

// ❌ Bad
interface Result {
  status: string;
  data?: string;
  message?: string;
}
```

### 3. Type useState When Needed

```tsx
// ✅ Good
const [items, setItems] = useState<Item[]>([]);

// ❌ Bad
const [items, setItems] = useState([]);
```

### 4. Use Specific Event Types

```tsx
// ✅ Good
const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  setValue(event.target.value);
};

// ❌ Bad
const handleChange = (event: any) => {
  setValue(event.target.value);
};
```

### 5. Extract Types to Separate Files

```tsx
// ✅ Good: types.ts
export interface Note {
  id: string;
  content: string;
}

// ❌ Bad: Inline in component
const App = () => {
  interface Note {
    id: string;
    content: string;
  }
  // ...
};
```

### 6. Use Exhaustive Type Checking

```tsx
// ✅ Good
switch (value.kind) {
  case "a":
    // ...
    break;
  case "b":
    // ...
    break;
  default:
    return assertNever(value);
}

// ❌ Bad
switch (value.kind) {
  case "a":
    // ...
    break;
  default:
    // Might forget new cases
    break;
}
```

## Common Patterns

### Component with Props

```tsx
interface ComponentProps {
  title: string;
  count: number;
  optional?: string;
}

const Component = ({ title, count, optional }: ComponentProps) => {
  return (
    <div>
      <h1>{title}</h1>
      <p>Count: {count}</p>
      {optional && <p>{optional}</p>}
    </div>
  );
};
```

### Form Handling

```tsx
const Form = () => {
  const [value, setValue] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle submission
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={value} onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
};
```

### API Integration

```tsx
interface ApiData {
  id: string;
  name: string;
}

const Component = () => {
  const [data, setData] = useState<ApiData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get<ApiData[]>('/api/data')
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {data.map(item => (
        <li key={item.id}>{item.name}</li>
      ))}
    </ul>
  );
};
```

## Exercises

The exercises (9.15-9.20) involve:
- Creating TypeScript React apps
- Typing components and props
- Using discriminated unions
- Type narrowing with switch cases
- Exhaustive type checking
- State management with TypeScript
- API integration with typed Axios
- Form handling with proper types
