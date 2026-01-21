# Structure of Backend Application & Introduction to Testing - Summary

## Project Structure Refactoring

The goal is to reorganize the backend into well-defined modules to separate concerns and support better testing.

### Directory Structure

After refactoring, the backend should have this structure:

```
notes/
  backend/
    ├── controllers/
    │   └── notes.js
    ├── dist/
    │   └── ...
    ├── models/
    │   └── note.js
    ├── tests/
    │   └── ...
    ├── utils/
    │   ├── config.js
    │   ├── logger.js
    │   └── middleware.js
    ├── app.js
    ├── index.js
    ├── package.json
    └── package-lock.json
```

### Separating App and Server

**Key Concept**: Separate the Express application setup from the server startup to enable testing without running an HTTP server.

#### app.js - Express Application Setup

```js
// app.js
const express = require('express')
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const config = require('./utils/config')
const logger = require('./utils/logger')

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
```

#### index.js - Server Startup

```js
// index.js
const app = require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})
```

### Controllers - Route Handlers

Extract route handlers into a separate controllers directory:

```js
// controllers/notes.js
const notesRouter = require('express').Router()
const Note = require('../models/note')

notesRouter.get('/', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

notesRouter.get('/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {
      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
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

notesRouter.delete('/:id', (request, response, next) => {
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

notesRouter.put('/:id', (request, response, next) => {
  const { content, important } = request.body

  Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

module.exports = notesRouter
```

### Utils - Configuration

Centralize configuration management:

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

### Utils - Logger

Create a centralized logger that can be silenced during tests:

```js
// utils/logger.js
const info = (...params) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...params)
  }
}

const error = (...params) => {
  console.error(...params)
}

module.exports = {
  info, error
}
```

### Utils - Middleware

Extract middleware functions:

```js
// utils/middleware.js
const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}
```

### Models - Database Schema

The model remains in the models directory:

```js
// models/note.js
const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    minLength: 5,
    required: true
  },
  important: Boolean
})

noteSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Note', noteSchema)
```

**Note**: The `toJSON` transformation ensures that `_id` is converted to `id` and `__v` is removed, which simplifies testing and API responses.

## Introduction to Testing

### Testing Types

1. **Unit Testing**: Testing small, isolated functions (e.g., `reverse(string)`, `average(array)`)
2. **Integration Testing**: Testing the backend via HTTP API, including database interactions

The course emphasizes integration tests for REST APIs since the logic is often simple enough that unit tests beyond basic utilities aren't immediately necessary.

### Testing Environment Setup

Use `NODE_ENV` to distinguish between development, test, and production environments.

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

**Note**: Use `cross-env` for cross-platform compatibility:

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

### Testing Tools

1. **node:test**: Built-in Node.js test runner (no need to install)
2. **assert**: Built-in assertion library
3. **supertest**: Library for making HTTP requests to Express app without running server

#### Installing Supertest

```bash
npm install --save-dev supertest
```

### Unit Testing Example

#### Helper Function

```js
// utils/for_testing.js
const reverse = (string) => {
  return string
    .split('')
    .reverse()
    .join('')
}

const average = (array) => {
  const reducer = (sum, item) => {
    return sum + item
  }

  return array.length === 0
    ? 0
    : array.reduce(reducer, 0) / array.length
}

module.exports = {
  reverse,
  average,
}
```

#### Unit Test

```js
// tests/reverse.test.js
const { test } = require('node:test')
const assert = require('node:assert')
const { reverse } = require('../utils/for_testing')

test('reverse of a', () => {
  const result = reverse('a')
  assert.strictEqual(result, 'a')
})

test('reverse of react', () => {
  const result = reverse('react')
  assert.strictEqual(result, 'tcaer')
})

test('reverse of releveler', () => {
  const result = reverse('releveler')
  assert.strictEqual(result, 'releveler')
})
```

```js
// tests/average.test.js
const { test } = require('node:test')
const assert = require('node:assert')
const { average } = require('../utils/for_testing')

test('average of [1, 2, 3]', () => {
  const result = average([1, 2, 3])
  assert.strictEqual(result, 2)
})

test('average of empty array', () => {
  const result = average([])
  assert.strictEqual(result, 0)
})
```

### Integration Testing

#### Test Setup

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

#### Integration Test Example

```js
// tests/note_api.test.js
const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Note = require('../models/note')
const { initialNotes, notesInDb, nonExistingId } = require('./test_helper')

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

test('a specific note can be viewed', async () => {
  const notesAtStart = await notesInDb()
  const noteToView = notesAtStart[0]

  const resultNote = await api
    .get(`/api/notes/${noteToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert.deepStrictEqual(resultNote.body, noteToView)
})

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

### Key Testing Concepts

1. **beforeEach**: Runs before each test to set up a clean database state
2. **after**: Runs after all tests to close database connections
3. **supertest**: Makes HTTP requests to the Express app without starting a server
4. **Test Database**: Use a separate `TEST_MONGODB_URI` for tests
5. **Deterministic Tests**: Each test should start with a known database state

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
node --test tests/reverse.test.js
```

## Benefits of This Structure

1. **Separation of Concerns**: Controllers, models, and utilities are clearly separated
2. **Testability**: App can be tested without starting HTTP server
3. **Maintainability**: Code is organized and easier to navigate
4. **Scalability**: Easy to add new routes, models, or utilities
5. **Environment Management**: Different configurations for test, dev, and production

## Exercises

See `/Part4/excercise/Readme.md` for detailed exercises.
