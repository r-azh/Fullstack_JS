# First Steps with TypeScript - Summary

This section covers setting up TypeScript projects, writing your first TypeScript code, working with types, and integrating TypeScript with Express.

## Setting Up TypeScript

### Installation

**Global Installation:**
```bash
npm install --location=global ts-node typescript
```

**Local Installation:**
```bash
npm install --save-dev ts-node typescript
```

### ts-node

**What is ts-node?**
- Compiles and executes TypeScript files immediately
- No separate compilation step needed
- Great for development

**Usage:**
```bash
# Direct usage
ts-node file.ts

# Via npm script
npm run ts-node file.ts

# With options
npm run ts-node file.ts -- -s --someoption
```

**Note:** When using through npm scripts, prefix options with `--`.

### TypeScript Playground

Online playground for trying TypeScript:
- <https://www.typescriptlang.org/play>
- Instant compilation
- See JavaScript output
- Test different configurations

### tsconfig.json

**Basic Configuration:**
```json
{
  "compilerOptions": {
    "noImplicitAny": false
  }
}
```

**Strict Configuration:**
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noImplicitAny": true,
    "esModuleInterop": true,
    "moduleResolution": "node"
  }
}
```

**Key Options:**
- `target`: JavaScript version to compile to
- `strict`: Enable all strict type checking
- `noImplicitAny`: Require types for all variables
- `noUnusedLocals`: Error on unused local variables
- `noUnusedParameters`: Error on unused parameters
- `esModuleInterop`: Enable ES module interoperability

## Type Annotations

### Basic Types

**Primitive Types:**
- `number`: Numbers (integers and floats)
- `string`: Text strings
- `boolean`: true/false
- `null`: Null value
- `undefined`: Undefined value

**Example:**
```typescript
// src/multiplier.ts
const multiplicator = (a: number, b: number, printText: string) => {
  console.log(printText, a * b);
}

multiplicator(2, 4, 'Multiplied numbers 2 and 4, the result is:');
```

**Benefits:**
- Catches type errors at compile time
- Prevents runtime errors like `NaN`
- Better IDE support

### Return Type Annotations

```typescript
const calculator = (a: number, b: number, op: Operation): number => {
  // function body
}
```

**Syntax:**
- `: type` after parameter list
- Specifies what function returns
- Helps catch return type errors

## Creating Custom Types

### Type Aliases

**Union Types:**
```typescript
// src/calculator.ts
type Operation = 'multiply' | 'add' | 'divide';
```

**Key Points:**
- `type` keyword defines type alias
- `|` creates union type
- String literal types for exact values
- Can combine multiple types

**Usage:**
```typescript
const calculator = (a: number, b: number, op: Operation): number => {
  // op can only be 'multiply', 'add', or 'divide'
}
```

### Interfaces

**Object Shapes:**
```typescript
// src/multiplier.ts
interface MultiplyValues {
  value1: number;
  value2: number;
}
```

**Usage:**
```typescript
const parseArguments = (args: string[]): MultiplyValues => {
  return {
    value1: Number(args[2]),
    value2: Number(args[3])
  }
}
```

**Key Points:**
- `interface` defines object structure
- Properties with types
- Can be extended
- Alternative to `type` for objects

### Type vs Interface

**Type:**
- Union types
- Intersections
- Primitives
- More flexible

**Interface:**
- Object shapes
- Can be extended
- Declaration merging
- More traditional

## Type Narrowing

### What is Type Narrowing?

Process of reducing a type to a more specific type.

**Example:**
```typescript
// src/errorHandling.ts
try {
  console.log(calculator(1, 5, 'divide'));
} catch (error: unknown) {
  let errorMessage = 'Something went wrong: '
  
  // Type narrowing with instanceof
  if (error instanceof Error) {
    errorMessage += error.message;
  }
  
  console.log(errorMessage);
}
```

**Key Points:**
- `unknown` is type-safe `any`
- Need to narrow before using
- `instanceof` is type guard
- Other guards: `typeof`, custom guards

### Type Guards

**instanceof:**
```typescript
if (error instanceof Error) {
  // TypeScript knows error is Error here
  console.log(error.message);
}
```

**typeof:**
```typescript
if (typeof value === 'string') {
  // TypeScript knows value is string here
  console.log(value.toUpperCase());
}
```

**Custom Guards:**
```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string';
}
```

## Command Line Arguments

### Accessing Arguments

```typescript
// src/multiplier.ts
const a: number = Number(process.argv[2]);
const b: number = Number(process.argv[3]);
```

**Problem:**
- `Number('lol')` returns `NaN`
- `NaN` is type `number`
- TypeScript can't prevent this

**Solution:**
- Validate input
- Check for `NaN`
- Throw errors for invalid input

### Argument Parsing

```typescript
// src/multiplier.ts
interface MultiplyValues {
  value1: number;
  value2: number;
}

const parseArguments = (args: string[]): MultiplyValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      value1: Number(args[2]),
      value2: Number(args[3])
    }
  } else {
    throw new Error('Provided values were not numbers!');
  }
}
```

**Key Points:**
- Validate argument count
- Validate argument types
- Return typed object
- Throw descriptive errors

### require.main === module

**Purpose:**
- Check if module is run directly
- Avoid running code when imported

**Example:**
```typescript
// src/bmiCalculator.ts
if (require.main === module) {
  // Only run if executed directly
  const { value1, value2 } = parseArguments(process.argv);
  calculateBmi(value1, value2);
}
```

**Benefits:**
- Code can be imported without side effects
- Command-line parsing only when needed
- Better module design

## @types Packages

### What are @types Packages?

Type definitions for JavaScript packages:
- Community-maintained
- Published to npm
- Prefixed with `@types/`

### Installing Types

```bash
# Common examples
npm install --save-dev @types/node
npm install --save-dev @types/express
npm install --save-dev @types/react
npm install --save-dev @types/lodash
```

**Key Points:**
- Always in `devDependencies`
- Not needed in production
- Automatically used by TypeScript
- No need to import types

### @types/node

**Purpose:**
- Type definitions for Node.js
- Includes `process`, `Buffer`, etc.
- Required for Node.js projects

**Installation:**
```bash
npm install --save-dev @types/node
```

**Note:** `ts-node` v10+ includes `@types/node` as peer dependency. npm 7+ installs peer dependencies automatically.

## Express with TypeScript

### Installation

```bash
npm install express
npm install --save-dev @types/express
```

### Basic Express App

```typescript
// src/index.ts
import express from 'express';

const app = express();

app.get('/ping', (_req, res) => {
  res.send('pong');
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Key Points:**
- Use `import` instead of `require`
- Types automatically available
- Prefix unused params with `_`
- TypeScript knows Express types

### Request and Response Types

**Express Types:**
- `Request`: HTTP request object
- `Response`: HTTP response object
- Automatically typed by `@types/express`

**Example:**
```typescript
app.get('/ping', (req: express.Request, res: express.Response) => {
  res.send('pong');
});
```

**Shorthand:**
```typescript
app.get('/ping', (_req, res) => {
  // Types inferred automatically
  res.send('pong');
});
```

### Query Parameters

```typescript
// src/index.ts
app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);
  
  if (isNaN(height) || isNaN(weight)) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }
  
  const bmi = calculateBmi(height, weight);
  return res.json({ height, weight, bmi });
});
```

### Request Body

```typescript
// src/index.ts
app.use(express.json());

app.post('/calculate', (req, res) => {
  const { value1, value2, op } = req.body;
  // ...
});
```

**Problem:**
- `req.body` is typed as `any`
- No type safety
- Need validation

## The Horrors of `any`

### What is `any`?

**Definition:**
- "Wild card" type
- Stands for "whatever" type
- Disables type checking
- Can be implicit or explicit

**Example:**
```typescript
// Implicit any
const value = req.body.value1; // type: any

// Explicit any
const value: any = req.body.value1;
```

### Problems with `any`

1. **No Type Safety:**
```typescript
const value: any = "hello";
const result = value * 5; // No error, but wrong!
```

2. **Loses IntelliSense:**
- No autocomplete
- No type hints
- No error detection

3. **Runtime Errors:**
- Errors only at runtime
- Defeats purpose of TypeScript

### Preventing `any`

**ESLint Configuration:**
```javascript
// eslint.config.mjs
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from "@stylistic/eslint-plugin";

export default tseslint.config({
  files: ['**/*.ts'],
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  plugins: {
    "@stylistic": stylistic,
  },
  rules: {
    '@stylistic/semi': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-argument': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      { 'argsIgnorePattern': '^_' }
    ],
  },
});
```

**Key Rules:**
- `no-explicit-any`: Prevents explicit `any`
- `no-unsafe-assignment`: Prevents unsafe assignments
- `no-unsafe-argument`: Prevents unsafe function arguments

### Handling `any` from External Sources

**Problem:**
- `req.body` is `any`
- `req.query` is `any`
- Need validation

**Solution 1: Disable ESLint (Temporary)**
```typescript
app.post('/calculate', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { value1, value2, op } = req.body;
  
  // Validate data
  if (!value1 || isNaN(Number(value1))) {
    return res.status(400).send({ error: 'Invalid value1' });
  }
  
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const result = calculator(Number(value1), Number(value2), op);
  return res.send({ result });
});
```

**Solution 2: Type Assertion**
```typescript
import { Operation } from './calculator';

app.post('/calculate', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { value1, value2, op } = req.body;
  
  // Validate data first!
  if (typeof op !== 'string' || !['multiply', 'add', 'divide'].includes(op)) {
    return res.status(400).send({ error: 'Invalid operation' });
  }
  
  const result = calculator(
    Number(value1),
    Number(value2),
    op as Operation // Type assertion
  );
  
  return res.send({ result });
});
```

**Warning:**
- Type assertions bypass type checking
- Must validate data first
- Can cause runtime errors if wrong

## Type Assertions

### What are Type Assertions?

Tell TypeScript compiler what type a value has.

**Syntax:**
```typescript
const value = someValue as Type;
// or
const value = <Type>someValue;
```

**Example:**
```typescript
// src/index.ts
import { Operation } from './calculator';

app.post('/calculate', (req, res) => {
  const { op } = req.body;
  
  // After validation
  const operation = op as Operation;
  const result = calculator(Number(value1), Number(value2), operation);
});
```

**Risks:**
- Bypasses type checking
- Can cause runtime errors
- Must validate before asserting

**Best Practice:**
1. Validate data first
2. Then use type assertion
3. Or use type narrowing (better)

## Array Syntax

### Two Ways to Type Arrays

**Bracket Syntax:**
```typescript
let values: number[];
```

**Generic Syntax:**
```typescript
let values: Array<number>;
```

**Convention:**
- Simple arrays: use `[]` syntax
- Complex arrays: use `<>` syntax
- Follow ESLint `array-simple` rule

## Development Tools

### ts-node-dev

**Purpose:**
- Auto-reloading for TypeScript
- Alternative to nodemon
- Development only

**Installation:**
```bash
npm install --save-dev ts-node-dev
```

**Usage:**
```json
{
  "scripts": {
    "dev": "ts-node-dev index.ts"
  }
}
```

**Benefits:**
- No manual restart
- Fast recompilation
- Watch mode

## Module System

### ES Modules

**Import:**
```typescript
import { functionName } from './module';
import defaultExport from './module';
```

**Export:**
```typescript
export const functionName = () => { };
export default defaultExport;
```

**Key Points:**
- Files with `import`/`export` are modules
- Modules have separate scope
- No global variable conflicts

### CommonJS

**Require:**
```typescript
const module = require('./module');
```

**Export:**
```typescript
module.exports = something;
```

**Note:** TypeScript prefers ES modules, but supports both.

## Best Practices

### 1. Always Validate External Data

```typescript
// ✅ Good: Validate first
if (typeof value === 'number' && !isNaN(value)) {
  // Use value
}

// ❌ Bad: Use without validation
const result = calculator(value1, value2, op);
```

### 2. Use Type Guards

```typescript
// ✅ Good: Type guard
if (error instanceof Error) {
  console.log(error.message);
}

// ❌ Bad: Type assertion without check
console.log((error as Error).message);
```

### 3. Avoid `any`

```typescript
// ✅ Good: Specific type
function process(data: { value: number }) { }

// ❌ Bad: any
function process(data: any) { }
```

### 4. Prefix Unused Parameters

```typescript
// ✅ Good: Prefix with underscore
app.get('/ping', (_req, res) => {
  res.send('pong');
});

// ❌ Bad: Unused parameter error
app.get('/ping', (req, res) => {
  res.send('pong');
});
```

### 5. Use Semicolons

This part uses semicolons:
```typescript
const value = 5;
function add(a: number, b: number): number {
  return a + b;
}
```

## Common Patterns

### Error Handling Pattern

```typescript
try {
  const result = calculator(1, 5, 'divide');
  console.log(result);
} catch (error: unknown) {
  let errorMessage = 'Something went wrong: ';
  if (error instanceof Error) {
    errorMessage += error.message;
  }
  console.log(errorMessage);
}
```

### Argument Parsing Pattern

```typescript
interface Values {
  value1: number;
  value2: number;
}

const parseArguments = (args: string[]): Values => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');
  
  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      value1: Number(args[2]),
      value2: Number(args[3])
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};
```

### Express Endpoint Pattern

```typescript
app.post('/endpoint', (req, res) => {
  // Validate input
  if (!req.body.value) {
    return res.status(400).json({ error: 'Missing value' });
  }
  
  // Process
  const result = process(req.body.value);
  
  // Return
  return res.json({ result });
});
```

## Exercises

The exercises (9.1-9.7) involve:
- BMI calculator
- Exercise calculator
- Command-line arguments
- Express endpoints
- ESLint configuration
