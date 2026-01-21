# Validation and ESLint - Summary

## Validation with Mongoose

Instead of manually checking data in route handlers, we can use Mongoose's built-in validation functionality to define constraints at the schema level.

### Adding Validation Rules to Schema

Define validation rules for each field in the schema:

```js
// models/note.js
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true
  },
  important: Boolean
})
```

- `minLength: 5` - requires content to be at least 5 characters
- `required: true` - field cannot be missing
- Built-in validators: `minLength`, `required`, etc.
- Custom validators can be created if needed

### Handling Validation Errors

Update the route handler to pass validation errors to error handler middleware:

```js
// index.js
app.post('/api/notes', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})
```

### Expanding Error Handler

Add validation error handling to the error handler middleware:

```js
// index.js
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
```

Mongoose returns default error messages when validation fails.

## Deploying Database Backend to Production

### Setting Environment Variables

Environment variables in `.env` are only used in development. For production (Fly.io/Render), set the database URL in the hosting service.

**Fly.io:**
```bash
fly secrets set MONGODB_URI='mongodb+srv://fullstack:thepasswordishere@cluster0.a5qfl.mongodb.net/noteApp?retryWrites=true&w=majority'
```

**Render:**
Set `MONGODB_URI` in the dashboard environment variables.

### Important Notes

- Keep browser console open during development
- Monitor server logs continuously (`fly logs` for Fly.io)
- Whitelist Fly.io app's IP address in MongoDB Atlas (or allow all IPs)
- If database URL is undefined, check that environment variables are set correctly

## ESLint Setup

ESLint is a static analysis tool for JavaScript that detects errors and enforces code style.

### Installation

Install ESLint as a development dependency:

```bash
npm install --save-dev eslint
```

### Configuration File

After this we can initialize a default ESlint configuration with the command:

```shell
npx eslint --init
```
The configuration will be saved in the generated eslint.config.mjs file.
Otherwise create `eslint.config.mjs` in the backend root:

```js
// eslint.config.mjs
import globals from 'globals'
import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin'

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
      ecmaVersion: 'latest',
    },
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 'off',
    },
  },
  {
    ignores: ['dist/**'],
  },
]
```

### Installing Required Packages

```bash
npm install --save-dev @eslint/js
npm install --save-dev globals
npm install --save-dev @stylistic/eslint-plugin 
```
@stylistic/eslint-plugin defines a set of code style-related rules

### Configuration Details

- `files: ['**/*.js']` - applies to all JavaScript files
- `sourceType: 'commonjs'` - for Node.js CommonJS modules
- `globals.node` - includes Node.js global variables (process, etc.)
- `ecmaVersion: 'latest'` - supports latest JavaScript features
- `js.configs.recommended` - enables ESLint's recommended rules
- `ignores: ['dist/**']` - excludes dist directory from linting

We want to make use of ESLint's recommended settings along with our own. The @eslint/js package we installed earlier provides us with predefined configurations for ESLint. We'll import it and enable it in the configuration file:
```js
import globals from 'globals'

import js from '@eslint/js'
// ...

export default [

  js.configs.recommended,
  {
    // ...
  },
]
```

### Style Rules

- Indentation: 2 spaces
- Line breaks: Unix style (`\n`)
- Quotes: Single quotes
- Semicolons: None
- Equality: Triple equals (`===`)
- No trailing spaces
- Object curly spacing: Always
- Arrow function spacing: Before and after arrow

## Running ESLint

### Command Line

Check a specific file:
```bash
npx eslint index.js
```

### NPM Script

It is recommended to create a separate npm script for linting:

Add to `package.json`:

```json
// package.json
{
  "scripts": {
    "lint": "eslint ."
  }
}
```

Run with:
```bash
npm run lint
```

Files in the dist directory also get checked when the command is run. We do not want this to happen, and we can accomplish this by adding an object with the ignores property that specifies an array of directories and files we want to ignore.

```js
// eslint.config.mjs
export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    // ...
  },

  { 
    ignores: ['dist/**'], 
  },
]
```

### VS Code Plugin

Install the ESLint plugin for VS Code to see errors in real-time with red underlines.

### Adding more style rules


ESlint has a vast array of rules that are easy to take into use by editing the eslint.config.mjs file.

Let's add the eqeqeq rule that warns us if equality is checked with anything but the triple equals operator. The rule is added under the rules field in the configuration file.

```js
export default [
  // ...
  rules: {
    // ...
   eqeqeq: 'error',  
},
  // ...
]
```
While we're at it, let's make a few other changes to the rules.

Let's prevent unnecessary trailing spaces at the ends of lines, require that there is always a space before and after curly braces, and also demand a consistent use of whitespaces in the function parameters of arrow functions.
```js
export default [
  // ...
  rules: {
    // ...
    eqeqeq: 'error',
    'no-trailing-spaces': 'error',
    'object-curly-spacing': ['error', 'always'],
    'arrow-spacing': ['error', { before: true, after: true }],  
},
]
```
Our default configuration takes a bunch of predefined rules into use from:
```js
// ...

export default [
  js.configs.recommended,
  // ...
]
```
This includes a rule that warns about console.log commands which we don't want to use. Disabling a rule can be accomplished by defining its "value" as 0 or off in the configuration file. Let's do this for the no-console rule in the meantime.
```js
[
  {
    // ...
    rules: {
      // ...
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 'off',    
},
  },
]
```

whole changes so far:
```js
// eslint.config.mjs
import globals from 'globals'
import js from '@eslint/js'
import stylisticJs from '@stylistic/eslint-plugin'

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: { ...globals.node },
      ecmaVersion: 'latest',
    },
    plugins: {
      '@stylistic/js': stylisticJs,
    },
    rules: {
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'unix'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'never'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 'off',
    },
  },
  {
    ignores: ['dist/**'],
  },
]
```
NB when you make changes to the eslint.config.mjs file, it is recommended to run the linter from the command line. This will verify that the configuration file is correctly formatted


## Exercises

### 3.19*: Phonebook database, step 7
- Expand validation: name must be at least 3 characters long
- Display error messages in frontend when validation fails
- Use `.catch()` block to handle validation errors
- **Note:** On update operations, mongoose validators are off by default - read documentation to enable them

### 3.20*: Phonebook database, step 8
- Add phone number validation:
  - Length: 8 or more characters
  - Format: Two parts separated by `-`
  - First part: 2-3 numbers
  - Second part: Numbers only
  - Examples: `09-1234556`, `040-22334455` (valid)
  - Examples: `1234556`, `1-22334455`, `10-22-334455` (invalid)
- Use custom validator for format validation
- Return appropriate status code and error message

### 3.21: Deploying the database backend to production
- Create new production build of frontend
- Copy to backend directory
- Verify locally at `http://localhost:3001/`
- Push to Fly.io/Render and verify
- **Note:** Do NOT deploy frontend directly - only backend repository is deployed

### 3.22: Lint configuration
- Add ESLint to application
- Fix all warnings
