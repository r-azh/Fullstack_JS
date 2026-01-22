# Background and Introduction - Summary

This section introduces TypeScript, a typed superset of JavaScript designed for large-scale application development.

## What is TypeScript?

TypeScript is a programming language created by Microsoft for large-scale JavaScript development.

**Real-world Examples:**
- Microsoft Azure Management Portal: 1.2 million lines of code
- Visual Studio Code: 300,000 lines of code

**Purpose:**
- Better development-time tooling
- Static code analysis
- Compile-time type checking
- Code-level documentation

## Main Principle

### TypeScript is a Typed Superset of JavaScript

**Key Points:**
- All JavaScript code is valid TypeScript
- Adds type annotations and additional features
- Compiles to plain JavaScript
- Can target ECMAScript 3 or newer

**Example:**
```js
// Valid JavaScript - also valid TypeScript
const greeting = "Hello, World!"
console.log(greeting)
```

## Three Parts of TypeScript

### 1. The Language

**Components:**
- Syntax
- Keywords
- Type annotations

**What Programmers Use:**
- Write TypeScript code
- Add type annotations
- Use TypeScript syntax

### 2. The Compiler

**Responsibilities:**
- Type information erasure (removes types at compile time)
- Code transformations
- Transpiles TypeScript to JavaScript
- Static code analysis
- Emits warnings and errors

**Compilation Process:**
```
TypeScript Code → Compiler → JavaScript Code
(with types)              (types removed)
```

**Note:** TypeScript uses "compiling" but technically it's "transpiling" (transforming human-readable code to human-readable code).

### 3. The Language Service

**Purpose:**
- Collects type information from source code
- Provides type information to development tools

**Benefits:**
- IntelliSense (autocomplete)
- Type hints
- Refactoring suggestions
- Real-time error checking

## TypeScript Key Language Features

### Type Annotations

Type annotations record the intended contract of functions or variables.

**Example:**
```typescript
// src/birthdayGreeter.ts
const birthdayGreeter = (name: string, age: number): string => {
  return `Happy birthday ${name}, you are now ${age} years old!`
}

const birthdayHero = "Jane User"
const age = 22

console.log(birthdayGreeter(birthdayHero, age))
```

**Syntax:**
- Parameter types: `name: string`
- Return type: `: string`
- Variable types: `const age: number = 22`

**Benefits:**
- Documents function contracts
- Catches type errors at compile time
- Provides IntelliSense support

### Keywords

**Definition:**
- Specially reserved words with designated meaning
- Cannot be used as identifiers
- Part of language syntax

**TypeScript Keywords:**
- Inherited from JavaScript: `if`, `else`, `for`, `while`, `function`, `class`, etc.
- TypeScript-specific: `type`, `enum`, `interface`, `void`, `null`, `instanceof`, etc.

**Common TypeScript Keywords:**
- `type`: Define type aliases
- `interface`: Define object shapes
- `enum`: Define enumerations
- `void`: No return value
- `any`: Any type
- `unknown`: Type-safe any
- `never`: Never returns
- `as`: Type assertion

### Structural Typing

TypeScript uses structural typing (duck typing).

**Definition:**
Two elements are compatible if:
- Each feature in first element's type
- Has corresponding identical feature in second element's type

**Example:**
```typescript
// src/structuralTyping.ts
interface Person {
  name: string
  age: number
}

interface Employee {
  name: string
  age: number
  salary: number
}

const greet = (person: Person) => {
  console.log(`Hello, ${person.name}`)
}

const employee: Employee = {
  name: "John",
  age: 30,
  salary: 50000
}

// Employee is compatible with Person
greet(employee) // ✅ Works!
```

**Key Point:**
- TypeScript checks structure, not name
- If shapes match, types are compatible
- More flexible than nominal typing

### Type Inference

TypeScript compiler can infer types when not explicitly specified.

**When Inference Happens:**
- Variable initialization
- Member initialization
- Parameter default values
- Function return types

**Example:**
```typescript
// src/typeInference.ts
// Type inferred as number
const add = (a: number, b: number) => {
  return a + b // Return type inferred as number
}

// Type inferred as string
const message = "Hello, TypeScript"

// Type inferred as number[]
const numbers = [1, 2, 3, 4, 5]

// Explicit type annotation
const explicit: number = 42
```

**Inference Process:**
1. Compiler analyzes code
2. Determines types from usage
3. Checks compatibility
4. Reports errors if incompatible

**Benefits:**
- Less verbose code
- Still type-safe
- Easier to write

### Type Erasure

**Definition:**
TypeScript removes all type information during compilation.

**Example:**

**Input (TypeScript):**
```typescript
let x: SomeType
let name: string = "John"
let age: number = 30
```

**Output (JavaScript):**
```javascript
let x
let name = "John"
let age = 30
```

**Key Points:**
- No type information at runtime
- Types exist only at compile time
- Cannot use reflection for types
- Runtime behavior is pure JavaScript

**Implications:**
- Cannot check types at runtime
- Type guards needed for runtime checks
- External data needs validation

## Why Use TypeScript?

### 1. Type Checking and Static Code Analysis

**Benefits:**
- Catch errors at compile time
- Reduce runtime errors
- Fewer unit tests needed (for type checking)
- Warns about:
  - Wrong type usage
  - Misspelled variables/functions
  - Variables used beyond scope
  - Unused variables

**Example:**
```typescript
// src/typeChecking.ts
function calculateArea(width: number, height: number): number {
  return width * height
}

// ✅ Correct usage
const area1 = calculateArea(10, 20)

// ❌ Compile error: wrong type
const area2 = calculateArea("10", 20)

// ❌ Compile error: wrong number of arguments
const area3 = calculateArea(10)
```

### 2. Code-Level Documentation

**Benefits:**
- Type annotations document code
- Function signatures show contracts
- Always up to date (unlike comments)
- Easier for new developers
- Helpful when returning to old code

**Example:**
```typescript
// src/documentation.ts
interface User {
  id: number
  name: string
  email: string
}

function getUserById(id: number): User | null {
  // Implementation
}

// From function signature, we know:
// - Takes a number
// - Returns User or null
// - No need to read implementation
```

**Comparison:**
- **TypeScript**: Types are part of code, always in sync
- **JSDoc**: Separate documentation, can get out of sync, more verbose

### 3. Better IntelliSense

**Benefits:**
- IDEs know exact types
- Autocomplete suggestions
- Property hints
- Refactoring suggestions
- Error detection while typing

**Example:**
```typescript
// src/intellisense.ts
interface Product {
  id: number
  name: string
  price: number
  description: string
}

const product: Product = {
  id: 1,
  name: "Laptop",
  price: 999,
  description: "High-performance laptop"
}

// IDE knows product has: id, name, price, description
// Autocomplete suggests these properties
console.log(product.name) // IDE suggests: id, name, price, description
```

### 4. Easier Refactoring

**Benefits:**
- Static analysis finds all usages
- IntelliSense suggests refactoring
- Type errors catch breaking changes
- Safer code modifications

**Example:**
```typescript
// Before refactoring
interface User {
  firstName: string
  lastName: string
}

// After refactoring
interface User {
  fullName: string // Changed from firstName + lastName
}

// TypeScript shows all places that need updating
```

### 5. Early JavaScript Features

**Benefits:**
- Use latest JavaScript features
- Configure target version
- Transpile to older JavaScript
- Better browser compatibility

## What TypeScript Doesn't Fix

### 1. No Runtime Type Checking

**Problem:**
- Types removed at compile time
- Runtime errors still possible
- External data not validated

**Example:**
```typescript
// src/runtimeError.ts
interface ApiResponse {
  name: string
  age: number
}

// TypeScript thinks this is correct
function processUser(data: ApiResponse) {
  console.log(data.name.toUpperCase())
}

// But at runtime, API might return:
const apiData = {
  name: null, // ❌ Runtime error!
  age: "30"   // Wrong type
}

processUser(apiData) // Crashes at runtime
```

**Solution:**
- Validate external data
- Use type guards
- Runtime type checking libraries

### 2. Incomplete Type Declarations

**Problem:**
- External libraries may have:
  - Missing type declarations
  - Invalid type declarations
  - Outdated types

**Common Causes:**
- Library not written in TypeScript
- Manually added types (poor quality)
- Types not maintained

**Solutions:**
- Check DefinitelyTyped (@types packages)
- Create own type declarations
- Use `any` as last resort

**Example:**
```bash
# Install types for a library
npm install --save-dev @types/express
npm install --save-dev @types/node
```

### 3. Type Inference Limitations

**Problem:**
- Type inference not perfect
- Sometimes needs help
- Complex types may confuse compiler

**Solutions:**
- Add explicit type annotations
- Use type assertions (carefully)
- Use type guards
- Simplify complex types

**Example:**
```typescript
// Type inference might fail
const data = getData() // Type: any or unknown

// Help the compiler
const data: User = getData() as User

// Or use type guard
if (isUser(data)) {
  // TypeScript knows data is User here
}
```

### 4. Mysterious Type Errors

**Problem:**
- Complex types produce long error messages
- Hard to understand
- Difficult to debug

**Solution:**
- Read error messages from the end
- Most useful information at the end
- Simplify types
- Use type aliases

**Example:**
```typescript
// Complex error message
// Error: Type 'string' is not assignable to type 'number'.
//   Type 'string' is not assignable to type 'number'.
//   Property 'length' is missing in type 'number' but required in type 'string'.

// Start reading from the end:
// "Property 'length' is missing" - this is the actual issue
```

## TypeScript vs JavaScript

| Feature | JavaScript | TypeScript |
|---------|-----------|------------|
| **Type Checking** | Runtime only | Compile time |
| **Type Annotations** | No | Yes |
| **IntelliSense** | Limited | Excellent |
| **Refactoring** | Manual | Automated |
| **Error Detection** | Runtime | Compile time |
| **Documentation** | Comments/JSDoc | Types in code |
| **Compilation** | None | Required |
| **Learning Curve** | Lower | Higher |

## Getting Started

### Installation

```bash
# Global installation
npm install -g typescript

# Local installation
npm install --save-dev typescript

# Check version
tsc --version
```

### Basic Setup

**1. Create tsconfig.json:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true
  }
}
```

**2. Compile TypeScript:**
```bash
tsc                    # Compile all .ts files
tsc src/index.ts       # Compile specific file
tsc --watch            # Watch mode
```

**3. Run JavaScript:**
```bash
node dist/index.js
```

## Best Practices

### 1. Use Type Annotations

```typescript
// ✅ Good: Explicit types
function add(a: number, b: number): number {
  return a + b
}

// ⚠️ OK: Type inference
function add(a: number, b: number) {
  return a + b // Inferred as number
}

// ❌ Bad: No types
function add(a, b) {
  return a + b
}
```

### 2. Avoid `any`

```typescript
// ❌ Bad: Loses type safety
function process(data: any) {
  return data.value
}

// ✅ Good: Use specific types
function process(data: { value: string }) {
  return data.value
}

// ✅ Good: Use unknown for truly unknown types
function process(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value
  }
}
```

### 3. Use Interfaces for Objects

```typescript
// ✅ Good: Interface for object shape
interface User {
  id: number
  name: string
  email: string
}

// ✅ Good: Type alias for unions/primitives
type Status = 'active' | 'inactive' | 'pending'
```

### 4. Enable Strict Mode

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

## Common Patterns

### Type Guards

```typescript
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

if (isString(data)) {
  // TypeScript knows data is string here
  console.log(data.toUpperCase())
}
```

### Type Assertions

```typescript
const data = getData() as User
// or
const data = <User>getData()
```

### Optional Properties

```typescript
interface User {
  id: number
  name: string
  email?: string // Optional
}
```

### Union Types

```typescript
type Status = 'loading' | 'success' | 'error'
type ID = string | number
```

## Exercises

This section is introductory and doesn't have specific exercises. The exercises start in the next section where you'll begin writing TypeScript code.
