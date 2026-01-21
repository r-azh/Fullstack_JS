# Token Authentication - Summary

## Introduction

Users must be able to log into our application, and when a user is logged in, their user information must automatically be attached to any new notes they create.

We will implement support for token-based authentication to the backend.

## Principles of Token-Based Authentication

The flow of token-based authentication:

1. User logs in using a login form (frontend)
2. Frontend sends username and password to `/api/login` as HTTP POST
3. If credentials are correct, server generates a digitally signed token
4. Backend responds with status 200 and returns the token
5. Browser saves the token (e.g., in React state)
6. When user creates a note, React sends the token with the request
7. Server uses the token to identify the user

## Installing jsonwebtoken

Install the jsonwebtoken library for generating JSON web tokens:

```bash
npm install jsonwebtoken
```

## Login Functionality

### Login Controller

Create a login router in a new file:

```js
// controllers/login.js
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, process.env.SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter
```

**Key points:**
- Find user by username from the database
- Compare provided password with stored password hash using `bcrypt.compare()`
- Return 401 if user not found or password incorrect
- Create token using `jwt.sign()` with user info and SECRET
- Return token, username, and name on success

### Finding User

```js
// controllers/login.js
const user = await User.findOne({ username })
```

Searches for a user in the database by username.

### Verifying Password

```js
// controllers/login.js
const passwordCorrect = user === null
  ? false
  : await bcrypt.compare(password, user.passwordHash)
```

**Important:** Since passwords are stored as hashes, we use `bcrypt.compare()` to verify:
- First parameter: plain text password from request
- Second parameter: hashed password from database
- Returns `true` if passwords match, `false` otherwise

### Handling Invalid Credentials

```js
// controllers/login.js
if (!(user && passwordCorrect)) {
  return response.status(401).json({
    error: 'invalid username or password'
  })
}
```

Returns 401 Unauthorized with an error message if:
- User is not found (`user === null`)
- Password is incorrect (`passwordCorrect === false`)

**Security note:** Don't reveal whether username or password is wrong - use a generic message.

### Creating the Token

```js
// controllers/login.js
const userForToken = {
  username: user.username,
  id: user._id,
}

const token = jwt.sign(userForToken, process.env.SECRET)
```

**Key points:**
- Token contains username and user ID
- Signed using `SECRET` from environment variables
- Digital signature prevents token falsification
- Token can be verified later without database lookup

### Environment Variable

Add `SECRET` to your `.env` file:

```env
# .env
SECRET=your-secret-key-here-make-it-long-and-random
MONGODB_URI=mongodb+srv://...
PORT=3001
```

**Important:** Use a long, random string for SECRET. Never commit it to version control!

### Registering the Login Router

Add the login router to the main app:

```js
// app.js
const express = require('express')
const cors = require('cors')
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')

const app = express()

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
```

### Testing Login

Send a POST request to `/api/login`:

```json
{
  "username": "root",
  "password": "salainen"
}
```

**Success response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "root",
  "name": "Superuser"
}
```

**Error response (401):**
```json
{
  "error": "invalid username or password"
}
```

## Limiting Creating New Notes to Logged-In Users

### Authorization Header

We use the `Authorization` header to send the token. The format is:

```
Authorization: Bearer <token>
```

For example:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

The `Bearer` scheme indicates token-based authentication.

### Helper Function to Extract Token

```js
// controllers/notes.js
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}
```

**Key points:**
- Gets the `Authorization` header from the request
- Checks if it starts with `Bearer `
- Returns the token (without "Bearer " prefix) or `null`

### Protected Note Creation

Update the note creation route to require a valid token:

```js
// controllers/notes.js
const jwt = require('jsonwebtoken')
const Note = require('../models/note')
const User = require('../models/user')

const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}

notesRouter.post('/', async (request, response) => {
  const body = request.body
  
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  
  const user = await User.findById(decodedToken.id)
  if (!user) {
    return response.status(400).json({ error: 'UserId missing or not valid' })
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
- Extract token from Authorization header
- Verify token using `jwt.verify()` with SECRET
- Check that decoded token contains user ID
- Find user by ID from decoded token
- Create note and link it to the authenticated user

### Verifying the Token

```js
// controllers/notes.js
const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
```

**Key points:**
- `jwt.verify()` verifies the token signature and decodes it
- Returns the object that was used to create the token
- Throws `JsonWebTokenError` if token is invalid
- Throws `TokenExpiredError` if token has expired

### Error Handling for JWT

Extend the error handler to handle JWT errors:

```js
// utils/middleware.js
const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  }
  next(error)
}

module.exports = {
  errorHandler,
  // ... other middleware
}
```

**Key points:**
- `JsonWebTokenError` occurs when token is invalid or malformed
- Return 401 Unauthorized with appropriate error message

## Token Expiration

### Setting Token Expiration

Add expiration time to tokens for better security:

```js
// controllers/login.js
const userForToken = {
  username: user.username,
  id: user._id,
}

// token expires in 60*60 seconds, that is, in one hour
const token = jwt.sign(
  userForToken,
  process.env.SECRET,
  { expiresIn: 60*60 }
)

response
  .status(200)
  .send({ token, username: user.username, name: user.name })
```

**Key points:**
- `expiresIn` option sets token expiration time
- Can be specified in seconds (number) or string format (e.g., "1h", "7d")
- After expiration, token becomes invalid
- Client must re-login to get a new token

### Handling Expired Tokens

Extend error handler to handle expired tokens:

```js
// utils/middleware.js
const errorHandler = (error, request, response, next) => {
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  } else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'invalid token' })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' })
  }
  next(error)
}

module.exports = {
  errorHandler,
  // ... other middleware
}
```

**Key points:**
- `TokenExpiredError` occurs when token has passed its expiration time
- Return 401 Unauthorized with "token expired" message
- Client should prompt user to re-login

## Middleware for Token Extraction

### Token Extractor Middleware

Instead of using a helper function in each route, create reusable middleware:

```js
// utils/middleware.js
const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }
  next()
}

module.exports = {
  tokenExtractor,
  // ... other middleware
}
```

### Using Token Extractor Middleware

Register the middleware in app.js:

```js
// app.js
const middleware = require('./utils/middleware')

app.use(middleware.tokenExtractor)
app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
```

Now routes can access the token via `request.token`:

```js
// controllers/notes.js
notesRouter.post('/', async (request, response) => {
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // ...
})
```

## User Extractor Middleware

### Creating User Extractor

Create middleware that extracts and verifies the user from the token:

```js
// utils/middleware.js
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const userExtractor = async (request, response, next) => {
  const authorization = request.get('authorization')
  
  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.replace('Bearer ', '')
    
    try {
      const decodedToken = jwt.verify(token, process.env.SECRET)
      
      if (decodedToken.id) {
        const user = await User.findById(decodedToken.id)
        request.user = user
      }
    } catch (error) {
      // Token invalid or expired - request.user will be undefined
    }
  }
  
  next()
}

module.exports = {
  userExtractor,
  // ... other middleware
}
```

### Using User Extractor

Register middleware for specific routes:

```js
// app.js
app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
```

Or use it for individual routes:

```js
// controllers/blogs.js
blogsRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'token invalid' })
  }
  // ... create blog with user
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'token invalid' })
  }
  // ... delete blog if user is creator
})
```

## Authorization: Restricting Operations

### Restricting Delete Operations

Only allow users to delete their own notes/blogs:

```js
// controllers/notes.js
notesRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  if (!user) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const note = await Note.findById(request.params.id)
  
  if (!note) {
    return response.status(404).json({ error: 'note not found' })
  }

  // Compare IDs - note.user is an ObjectId, convert to string
  if (note.user.toString() !== user._id.toString()) {
    return response.status(403).json({ error: 'not authorized to delete this note' })
  }

  await Note.findByIdAndDelete(request.params.id)
  response.status(204).end()
})
```

**Important:** When comparing IDs:
- `note.user` is a Mongoose ObjectId object
- `user._id` is also an ObjectId object
- Convert both to strings for comparison: `.toString()`

### Status Codes for Authorization

- **401 Unauthorized**: No token or invalid token
- **403 Forbidden**: Valid token but user doesn't have permission
- **404 Not Found**: Resource doesn't exist

## Problems of Token-Based Authentication

### Issue: Token Revocation

Once a token is issued, the API trusts it until expiration. If access needs to be revoked, the token remains valid until it expires.

**Solutions:**

1. **Short expiration times** (easier)
   - Tokens expire quickly (e.g., 1 hour)
   - Users must re-login frequently
   - Compromise between security and user experience

2. **Server-side sessions** (more complex)
   - Store token info in database
   - Check token validity on each request
   - Can revoke tokens immediately
   - Slower (database lookup on each request)
   - Often use Redis for better performance

### Server-Side Sessions

With server-side sessions:
- Token is often just a random string (not JWT)
- Server stores session data in database/Redis
- Each request checks session validity
- Can revoke access immediately
- More complex to implement

## Security Considerations

### HTTPS Required

**Always use HTTPS in production!**
- Tokens, usernames, and passwords must be transmitted over HTTPS
- Prevents man-in-the-middle attacks
- Fly.io and similar platforms provide HTTPS automatically

### Token Storage

**Frontend considerations:**
- Store tokens securely (not in localStorage if XSS is a concern)
- Consider httpOnly cookies for better security
- Clear tokens on logout

### Secret Management

- Use a long, random SECRET
- Never commit SECRET to version control
- Use different SECRETs for development and production
- Rotate SECRETs periodically

## Testing Authentication

### Testing Login

```js
// tests/login_api.test.js
const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const api = supertest(app)
const User = require('../models/user')

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()
})

test('login succeeds with correct credentials', async () => {
  const loginData = {
    username: 'root',
    password: 'sekret'
  }

  const response = await api
    .post('/api/login')
    .send(loginData)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  assert(response.body.token)
  assert.strictEqual(response.body.username, 'root')
})

test('login fails with incorrect password', async () => {
  const loginData = {
    username: 'root',
    password: 'wrong'
  }

  await api
    .post('/api/login')
    .send(loginData)
    .expect(401)
    .expect('Content-Type', /application\/json/)
})

after(async () => {
  await mongoose.connection.close()
})
```

### Testing Protected Routes

```js
// tests/note_api.test.js
test('creating a note requires authentication', async () => {
  const newNote = {
    content: 'This note requires a token',
    important: true
  }

  await api
    .post('/api/notes')
    .send(newNote)
    .expect(401)
    .expect('Content-Type', /application\/json/)
})

test('creating a note with valid token succeeds', async () => {
  // First, login to get a token
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })

  const token = loginResponse.body.token

  const newNote = {
    content: 'This note has a valid token',
    important: true
  }

  await api
    .post('/api/notes')
    .set('Authorization', `Bearer ${token}`)
    .send(newNote)
    .expect(201)
    .expect('Content-Type', /application\/json/)
})
```

## Best Practices

### 1. Use Middleware for Token Extraction

Don't repeat token extraction code in every route - use middleware.

### 2. Handle All JWT Errors

Handle both `JsonWebTokenError` and `TokenExpiredError` in error middleware.

### 3. Set Appropriate Expiration Times

Balance security (shorter) with user experience (longer).

### 4. Never Expose Secrets

Keep SECRET in environment variables, never in code.

### 5. Use HTTPS in Production

Always use HTTPS for authentication endpoints.

### 6. Validate User Existence

After decoding token, verify user still exists in database.

### 7. Clear Error Messages

Don't reveal whether username or password is wrong.

## Common Issues

### Issue: "secretOrPrivateKey must have a value"

**Problem:** SECRET environment variable is not set.

**Solution:** Add SECRET to `.env` file and restart server.

### Issue: Token Always Invalid

**Problem:** Using different SECRET for signing and verifying.

**Solution:** Ensure same SECRET is used in both login and protected routes.

### Issue: ID Comparison Fails

**Problem:** Comparing ObjectId with string directly.

**Solution:** Convert both to strings:
```js
if (note.user.toString() === user._id.toString()) {
  // ...
}
```

### Issue: Token Not Found in Request

**Problem:** Authorization header not sent or middleware not registered.

**Solution:** 
- Check that frontend sends `Authorization: Bearer <token>`
- Verify middleware is registered before routes

## Exercises

See `/Part4/excercise/Readme.md` for detailed exercises including:
- Exercise 4.18: Blog List Expansion, step 6
- Exercise 4.19: Blog List Expansion, step 7
- Exercise 4.20*: Blog List Expansion, step 8
- Exercise 4.21*: Blog List Expansion, step 9
- Exercise 4.22*: Blog List Expansion, step 10
- Exercise 4.23*: Blog List Expansion, step 11
