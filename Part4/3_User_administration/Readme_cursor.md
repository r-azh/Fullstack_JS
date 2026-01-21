# User Administration - Summary

## Introduction

We want to add user authentication and authorization to our application. Users should be stored in the database and every note should be linked to the user who created it. Deleting and editing a note should only be allowed for the user who created it.

## Database Relationships

### One-to-Many Relationship

There is a one-to-many relationship between the user (_User_) and notes (_Note_):

```
User (1) ──< (many) Note
```

In document databases like MongoDB, we can model this relationship in several ways:

1. **Store user reference in notes** (most common)
2. **Store note references in user** (also common)
3. **Store both** (bidirectional references)
4. **Nest notes in user** (less common, tightly coupled)

### Reference Across Collections

In MongoDB, we use ObjectIds to reference documents in other collections, similar to foreign keys in relational databases.

**Example structure:**

```js
// users collection
[
  {
    username: 'mluukkai',
    _id: 123456,
  },
  {
    username: 'hellas',
    _id: 141414,
  },
]

// notes collection
[
  {
    content: 'HTML is easy',
    important: false,
    _id: 221212,
    user: 123456,  // Reference to user
  },
  {
    content: 'The most important operations of HTTP protocol are GET and POST',
    important: true,
    _id: 221255,
    user: 123456,  // Reference to user
  },
]
```

**Note:** Document databases don't support true join queries like relational databases. Mongoose's `populate` method simulates joins by making multiple queries.

## User Model Schema

### Basic User Schema

```js
// models/user.js
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
```

**Key points:**
- `notes` field is an array of ObjectIds that reference Note documents
- `ref: 'Note'` tells Mongoose which model to reference
- `toJSON` transformation removes `_id`, `__v`, and `passwordHash` from responses
- Password hash is stored, not the plain text password

### User Schema with Uniqueness

To ensure usernames are unique, add a unique index:

```js
// models/user.js
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true  // this ensures the uniqueness of username
  },
  name: String,
  passwordHash: String,
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
})
```

**Important:** If there are already documents in the database that violate the uniqueness condition, the index will not be created. Make sure the database is clean before adding the unique index!

## Note Model Schema with User Reference

Update the note schema to include a reference to the user who created it:

```js
// models/note.js
const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    minlength: 5
  },
  important: Boolean,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
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

**Key points:**
- `user` field references a User document
- `ref: 'User'` tells Mongoose which model to reference
- References are stored in both documents (bidirectional)

## Creating Users

### Installing bcrypt

We need bcrypt to hash passwords securely:

```bash
npm install bcrypt
```

### User Controller

Create a router for user operations:

```js
// controllers/users.js
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

module.exports = usersRouter
```

**Key points:**
- Password is hashed using `bcrypt.hash()` with 10 salt rounds
- Plain text password is never stored in the database
- Only the password hash is stored in `passwordHash` field

### Registering the Router

Add the users router to the main app:

```js
// app.js
const express = require('express')
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const middleware = require('./utils/middleware')

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
```

### Creating Users via API

Send a POST request to `/api/users`:

```json
{
  "username": "root",
  "name": "Superuser",
  "password": "salainen"
}
```

## User Validation and Error Handling

### Uniqueness Error Handling

When a username already exists, MongoDB returns a `MongoServerError` with code `E11000`. We need to handle this in the error handler:

```js
// utils/middleware.js
const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  }
  next(error)
}

module.exports = {
  errorHandler,
  // ... other middleware
}
```

**Key points:**
- `MongoServerError` is different from `ValidationError`
- Check for `E11000 duplicate key error` in the error message
- Return appropriate status code (400) and error message

### Additional Validations

You can add more validations to the user schema:

```js
// models/user.js
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3
  },
  name: String,
  passwordHash: {
    type: String,
    required: true
  },
  notes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Note'
    }
  ],
})
```

## Relating Notes to Users

### Updating Note Creation

Modify the note creation route to link notes to users:

```js
// controllers/notes.js
const notesRouter = require('express').Router()
const Note = require('../models/note')
const User = require('../models/user')

notesRouter.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findById(body.userId)
  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    user: user._id
  })

  const savedNote = await note.save()
  user.notes = user.notes.concat(savedNote._id)
  await user.save()

  response.status(201).json(savedNote)
})

module.exports = notesRouter
```

**Key points:**
- Verify that the user exists before creating the note
- Store the user's `_id` in the note's `user` field
- Update the user's `notes` array with the new note's `_id`
- Save both the note and the user

### Request Format

When creating a note, include the `userId`:

```json
{
  "content": "This is a new note",
  "important": true,
  "userId": "507f1f77bcf86cd799439011"
}
```

## Populating References

Mongoose's `populate()` method allows us to replace ObjectId references with the actual documents.

### Populating Notes in Users

When fetching users, populate their notes:

```js
// controllers/users.js
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('notes', { content: 1, important: 1 })

  response.json(users)
})
```

**Key points:**
- `populate('notes')` replaces note ObjectIds with note documents
- Second parameter `{ content: 1, important: 1 }` selects which fields to include
- Only `_id`, `content`, and `important` fields are included in populated notes

### Populating User in Notes

When fetching notes, populate the user information:

```js
// controllers/notes.js
notesRouter.get('/', async (request, response) => {
  const notes = await Note
    .find({})
    .populate('user', { username: 1, name: 1 })

  response.json(notes)
})
```

**Key points:**
- `populate('user')` replaces user ObjectId with user document
- Second parameter selects which user fields to include
- Only `_id`, `username`, and `name` are included

### How Populate Works

1. Mongoose makes the initial query (e.g., `User.find({})`)
2. It extracts all ObjectIds from the specified field (e.g., `notes`)
3. It makes a second query to the referenced collection (e.g., `Note.find({ _id: { $in: [...] } })`)
4. It replaces the ObjectIds with the fetched documents

**Important:** Populate is not a true join - it makes multiple queries. The database state can change between queries, so there's no transactional guarantee.

## Testing User Creation

### Test Helper Functions

Add helper functions for user testing:

```js
// tests/test_helper.js
const User = require('../models/user')
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

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

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
  nonExistingId,
  notesInDb,
  usersInDb,
}
```

### User Creation Tests

```js
// tests/user_api.test.js
const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')
const helper = require('./test_helper')

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})
```

## Best Practices

### 1. Never Store Plain Text Passwords

Always hash passwords using bcrypt or similar libraries before storing them in the database.

### 2. Don't Expose Password Hashes

Remove `passwordHash` from JSON responses using the `toJSON` transformation.

### 3. Validate Input

- Check that required fields are present
- Validate field lengths (e.g., username >= 3 characters)
- Validate password strength (optional but recommended)

### 4. Handle Uniqueness Errors

MongoDB uniqueness violations return `MongoServerError`, not `ValidationError`. Handle them appropriately in error middleware.

### 5. Use Populate Selectively

Only populate fields you need to avoid transferring unnecessary data.

### 6. Maintain Bidirectional References

When creating a note, update both:
- The note's `user` field
- The user's `notes` array

### 7. Clean Database Before Adding Unique Indexes

If you add a unique index to an existing collection, make sure there are no duplicate values first.

## Common Issues

### Issue: Unique Index Not Created

**Problem:** Adding `unique: true` to schema doesn't create index if duplicates exist.

**Solution:** Clean the database first, then add the unique constraint:

```bash
# Remove duplicate users
# Then restart the application
```

### Issue: Populate Returns Empty Array

**Problem:** `populate()` doesn't work even though references exist.

**Solution:** Check that:
- The `ref` field in the schema matches the model name exactly
- The ObjectIds in the array are valid
- The referenced documents exist in the database

### Issue: Password Hash in Response

**Problem:** Password hash is visible in API responses.

**Solution:** Use `toJSON` transformation to remove `passwordHash`:

```js
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.passwordHash
  }
})
```

## Exercises

See `/Part4/excercise/Readme.md` for detailed exercises including:
- Exercise 4.15: User administration
- Exercise 4.16*: User administration, continued
- Exercise 4.17: Blog list expansion, step 3
