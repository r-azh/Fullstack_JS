# Testing the Backend - Summary

## Refactoring to Async/Await

The course emphasizes refactoring from promise chains (`.then()/.catch()`) to async/await syntax for better readability and error handling.

### Before: Promise Chains

```js
// controllers/notes.js
notesRouter.get('/', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

notesRouter.post('/', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))
})
```

### After: Async/Await

```js
// controllers/notes.js
notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes)
})

notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false
  })

  try {
    const savedNote = await note.save()
    response.json(savedNote)
  } catch (error) {
    next(error)
  }
})
```

**Benefits of async/await:**
- More readable code
- Easier error handling with try/catch
- Better stack traces
- Less nesting

### Important: Async in Loops

When working with async operations in loops, be careful with `.forEach()` - it doesn't wait for async operations:

```js
// ❌ BAD - forEach doesn't wait for async
beforeEach(async () => {
  await Note.deleteMany({})
  
  initialNotes.forEach(async (note) => {
    let noteObject = new Note(note)
    await noteObject.save()  // This won't be awaited!
  })
})
```

**Solutions:**

```js
// ✅ GOOD - Use for...of loop
beforeEach(async () => {
  await Note.deleteMany({})
  
  for (let note of initialNotes) {
    let noteObject = new Note(note)
    await noteObject.save()
  }
})
```

```js
// ✅ GOOD - Use Promise.all for parallel execution
beforeEach(async () => {
  await Note.deleteMany({})
  
  const noteObjects = initialNotes.map(note => new Note(note))
  const promiseArray = noteObjects.map(note => note.save())
  await Promise.all(promiseArray)
})
```

## Test Environment Configuration

### Setting Up Test Environment

Use `NODE_ENV=test` to distinguish test environment from development/production.

#### Config Module

```js
// utils/config.js
require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

module.exports = {
  MONGODB_URI,
  PORT
}
```

#### Package.json Scripts

```json
// package.json
{
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js",
    "test": "NODE_ENV=test node --test",
    "test:watch": "NODE_ENV=test node --test --watch"
  }
}
```

**Cross-platform compatibility:**

```bash
npm install --save-dev cross-env
```

```json
// package.json
{
  "scripts": {
    "test": "cross-env NODE_ENV=test node --test"
  }
}
```

### Environment Variables

Create a `.env` file with separate database URIs:

```env
# .env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/notesApp?retryWrites=true&w=majority
TEST_MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/notesAppTest?retryWrites=true&w=majority
PORT=3001
```

## Database Setup in Tests

### Test Helper Functions

Create helper functions to manage test data:

```js
// tests/test_helper.js
const Note = require('../models/note')

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true
  }
]

const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()

  return note._id.toString()
}

module.exports = {
  initialNotes,
  notesInDb,
  nonExistingId
}
```

### beforeEach Hook

Reset database state before each test:

```js
// tests/note_api.test.js
const { test, beforeEach, after } = require('node:test')
const Note = require('../models/note')
const { initialNotes } = require('./test_helper')

beforeEach(async () => {
  await Note.deleteMany({})
  
  for (let note of initialNotes) {
    let noteObject = new Note(note)
    await noteObject.save()
  }
})
```

### after Hook

Close database connection after all tests:

```js
// tests/note_api.test.js
const mongoose = require('mongoose')

after(async () => {
  await mongoose.connection.close()
})
```

## Comprehensive Integration Tests

### Testing GET Endpoints

```js
// tests/note_api.test.js
const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Note = require('../models/note')
const { initialNotes, notesInDb } = require('./test_helper')

beforeEach(async () => {
  await Note.deleteMany({})
  
  for (let note of initialNotes) {
    let noteObject = new Note(note)
    await noteObject.save()
  }
})

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
  const response = await api.get('/api/notes')
  assert.strictEqual(response.body.length, initialNotes.length)
})

test('a specific note is within the returned notes', async () => {
  const response = await api.get('/api/notes')
  const contents = response.body.map(r => r.content)
  assert(contents.includes('Browser can execute only JavaScript'))
})

test('a specific note can be viewed', async () => {
  const notesAtStart = await notesInDb()
  const noteToView = notesAtStart[0]

  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultNote.body, noteToView)
})

test('fails with statuscode 404 if note does not exist', async () => {
  const validNonexistingId = await nonExistingId()

  await api
    .get(`/api/notes/${validNonexistingId}`)
    .expect(404)
})

test('fails with statuscode 400 id is invalid', async () => {
  const invalidId = '5a3d5da59070081a82a3445'

  await api
    .get(`/api/notes/${invalidId}`)
    .expect(400)
})

after(async () => {
  await mongoose.connection.close()
})
```

### Testing POST Endpoints

```js
// tests/note_api.test.js
test('a valid note can be added', async () => {
  const newNote = {
    content: 'async/await simplifies making async calls',
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const notesAtEnd = await notesInDb()
  assert.strictEqual(notesAtEnd.length, initialNotes.length + 1)

  const contents = notesAtEnd.map(n => n.content)
  assert(contents.includes('async/await simplifies making async calls'))
})

test('note without content is not added', async () => {
  const newNote = {
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  const notesAtEnd = await notesInDb()
  assert.strictEqual(notesAtEnd.length, initialNotes.length)
})

test('note with missing important field defaults to false', async () => {
  const newNote = {
    content: 'Note without important field'
  }

  const response = await api
    .post('/api/notes')
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.important, false)
})
```

### Testing DELETE Endpoints

```js
// tests/note_api.test.js
test('a note can be deleted', async () => {
  const notesAtStart = await notesInDb()
  const noteToDelete = notesAtStart[0]

  await api
    .delete(`/api/notes/${noteToDelete.id}`)
    .expect(204)

  const notesAtEnd = await notesInDb()
  assert.strictEqual(notesAtEnd.length, initialNotes.length - 1)

  const contents = notesAtEnd.map(r => r.content)
  assert(!contents.includes(noteToDelete.content))
})

test('fails with statuscode 404 if note does not exist', async () => {
  const validNonexistingId = await nonExistingId()

  await api
    .delete(`/api/notes/${validNonexistingId}`)
    .expect(404)
})
```

### Testing PUT Endpoints

```js
// tests/note_api.test.js
test('a note can be updated', async () => {
  const notesAtStart = await notesInDb()
  const noteToUpdate = notesAtStart[0]

  const updatedNote = {
    content: 'Updated content',
    important: true
  }

  const result = await api
    .put(`/api/notes/${noteToUpdate.id}`)
    .send(updatedNote)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.strictEqual(result.body.content, 'Updated content')
  assert.strictEqual(result.body.important, true)

  const notesAtEnd = await notesInDb()
  const updated = notesAtEnd.find(n => n.id === noteToUpdate.id)
  assert.strictEqual(updated.content, 'Updated content')
})

test('fails with statuscode 404 if note does not exist', async () => {
  const validNonexistingId = await nonExistingId()

  const updatedNote = {
    content: 'Updated content',
    important: true
  }

  await api
    .put(`/api/notes/${validNonexistingId}`)
    .send(updatedNote)
    .expect(404)
})
```

## Controller Implementation with Async/Await

### Complete Controller Example

```js
// controllers/notes.js
const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', async (request, response) => {
  const notes = await Note.find({})
  response.json(notes)
})

notesRouter.get('/:id', async (request, response, next) => {
  try {
    const note = await Note.findById(request.params.id)
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

notesRouter.post('/', async (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false
  })

  try {
    const savedNote = await note.save()
    response.status(201).json(savedNote)
  } catch (error) {
    next(error)
  }
})

notesRouter.delete('/:id', async (request, response, next) => {
  try {
    await Note.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

notesRouter.put('/:id', async (request, response, next) => {
  const { content, important } = request.body

  try {
    const updatedNote = await Note.findByIdAndUpdate(
      request.params.id,
      { content, important },
      { new: true, runValidators: true, context: 'query' }
    )
    
    if (updatedNote) {
      response.json(updatedNote)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

module.exports = notesRouter
```

**Key points:**
- `{ new: true }` returns the updated document instead of the original
- `runValidators: true` ensures Mongoose validators run on update
- `context: 'query'` is needed for some validators to work properly

## Error Handling in Tests

### Testing Error Responses

```js
// tests/note_api.test.js
test('fails with statuscode 400 if content is too short', async () => {
  const newNote = {
    content: 'ab',
    important: true
  }

  const response = await api
    .post('/api/notes')
    .send(newNote)
    .expect(400)

  assert(response.body.error.includes('shorter than the minimum'))
})

test('fails with statuscode 400 if id is malformatted', async () => {
  const invalidId = 'not-a-valid-id'

  await api
    .get(`/api/notes/${invalidId}`)
    .expect(400)
})
```

## Best Practices

### 1. Test Independence

Each test should be independent and not rely on the state from previous tests. Use `beforeEach` to reset state.

### 2. Descriptive Test Names

```js
// ✅ GOOD
test('returns 404 when trying to delete non-existent note', async () => {
  // ...
})

// ❌ BAD
test('delete test', async () => {
  // ...
})
```

### 3. Test One Thing at a Time

Each test should verify one specific behavior.

### 4. Use Helper Functions

Extract common operations into helper functions:

```js
// tests/test_helper.js
const notesInDb = async () => {
  const notes = await Note.find({})
  return notes.map(note => note.toJSON())
}

const nonExistingId = async () => {
  const note = new Note({ content: 'willremovethissoon' })
  await note.save()
  await note.deleteOne()
  return note._id.toString()
}
```

### 5. Clean Up Resources

Always close database connections in `after` hooks to prevent hanging test processes.

### 6. Test Edge Cases

- Empty arrays
- Missing required fields
- Invalid IDs
- Non-existent resources
- Boundary values

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
node --test tests/note_api.test.js

# Run with verbose output
NODE_ENV=test node --test --reporter=verbose
```

## Common Issues and Solutions

### Issue: Tests Hang

**Problem:** Tests don't exit after completion.

**Solution:** Close database connection in `after` hook:

```js
after(async () => {
  await mongoose.connection.close()
})
```

### Issue: Tests Interfere with Each Other

**Problem:** One test affects the outcome of another.

**Solution:** Reset database state in `beforeEach`:

```js
beforeEach(async () => {
  await Note.deleteMany({})
  // ... set up initial state
})
```

### Issue: Async Operations Not Awaited

**Problem:** Tests pass but don't actually test async operations.

**Solution:** Always use `await` with async operations and use `async` test functions:

```js
test('async operation', async () => {
  const result = await someAsyncOperation()
  assert.strictEqual(result, expectedValue)
})
```

## Exercises

See `/Part4/excercise/Readme.md` for detailed exercises including:
- Exercises 4.8-4.12: Blog list tests
- Exercises 4.13-4.14: Blog list expansion (delete and update)
