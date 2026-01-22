# Join Tables and Queries - Summary

This section covers application structuring, user management, table relationships, join queries, token-based authentication, and advanced querying with Sequelize.

## Overview

We'll restructure the application into a proper MVC-like architecture, add user management, establish relationships between tables, perform join queries, and implement advanced filtering and searching.

**Key Topics:**
- Application structuring
- User management
- Foreign keys and relationships
- Join queries
- Token-based authentication
- Advanced queries (filtering, searching, ordering, grouping)

## Application Structuring

### Directory Structure

**Recommended Structure:**
```
index.js
util/
  config.js
  db.js
models/
  index.js
  note.js
  user.js
controllers/
  notes.js
  users.js
  login.js
```

### File Responsibilities

**util/config.js:**
- Handles environment variables
- Centralizes configuration

**util/db.js:**
- Database connection setup
- Sequelize instance
- Connection function

**models/:**
- Model definitions
- Table schemas
- Model relationships

**controllers/:**
- Route handlers
- Request/response logic
- Business logic

**index.js:**
- Application setup
- Middleware configuration
- Route registration
- Server startup

### Example Structure

**File: `util/config.js`**
```js
require('dotenv').config()

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 3001,
  SECRET: process.env.SECRET
}
```

**File: `util/db.js`**
```js
const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
})

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    console.log('connected to the database')
  } catch (err) {
    console.log('failed to connect to the database')
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize }
```

**File: `models/note.js`**
```js
const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Note extends Model {}

Note.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  important: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'note'
})

module.exports = Note
```

**File: `models/index.js`**
```js
const Note = require('./note')
const User = require('./user')

// Define relationships
User.hasMany(Note)
Note.belongsTo(User)

// Sync tables
Note.sync({ alter: true })
User.sync({ alter: true })

module.exports = {
  Note,
  User
}
```

**File: `controllers/notes.js`**
```js
const router = require('express').Router()
const { Note } = require('../models')

// Middleware to find note
const noteFinder = async (req, res, next) => {
  req.note = await Note.findByPk(req.params.id)
  next()
}

router.get('/', async (req, res) => {
  const notes = await Note.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    }
  })
  res.json(notes)
})

router.post('/', tokenExtractor, async (req, res) => {
  try {
    const user = await User.findByPk(req.decodedToken.id)
    const note = await Note.create({
      ...req.body,
      userId: user.id,
      date: new Date()
    })
    res.json(note)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

router.get('/:id', noteFinder, async (req, res) => {
  if (req.note) {
    res.json(req.note)
  } else {
    res.status(404).end()
  }
})

router.delete('/:id', noteFinder, async (req, res) => {
  if (req.note) {
    await req.note.destroy()
  }
  res.status(204).end()
})

router.put('/:id', noteFinder, async (req, res) => {
  if (req.note) {
    req.note.important = req.body.important
    await req.note.save()
    res.json(req.note)
  } else {
    res.status(404).end()
  }
})

module.exports = router
```

**File: `index.js`**
```js
const express = require('express')
const app = express()

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.use(express.json())

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

const start = async () => {
  await connectToDatabase()
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

start()
```

### Benefits of Structuring

**Organization:**
- Clear separation of concerns
- Easy to find code
- Better maintainability

**Reusability:**
- Models can be imported anywhere
- Controllers are modular
- Utils are shared

**Scalability:**
- Easy to add new features
- Simple to test
- Better collaboration

## User Management

### User Model

**File: `models/user.js`**
```js
const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user'
})

module.exports = User
```

**Key Points:**
- `username` is unique
- `id` is separate primary key (not username)
- No password field (simplified for learning)

### User Routes

**File: `controllers/users.js`**
```js
const router = require('express').Router()
const { User } = require('../models')

router.get('/', async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Note,
      attributes: { exclude: ['userId'] }
    }
  })
  res.json(users)
})

router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body)
    res.json(user)
  } catch(error) {
    return res.status(400).json({ error })
  }
})

router.get('/:id', async (req, res) => {
  const user = await User.findByPk(req.params.id)
  if (user) {
    res.json(user)
  } else {
    res.status(404).end()
  }
})

module.exports = router
```

### Login

**File: `controllers/login.js`**
```js
const jwt = require('jsonwebtoken')
const router = require('express').Router()

const { SECRET } = require('../util/config')
const User = require('../models/user')

router.post('/', async (request, response) => {
  const body = request.body

  const user = await User.findOne({
    where: {
      username: body.username
    }
  })

  const passwordCorrect = body.password === 'secret'

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = router
```

**Key Points:**
- Uses `findOne` with `where` clause
- Simple password check (all users: "secret")
- Returns JWT token
- Token contains username and id

**SQL Generated:**
```sql
SELECT "id", "username", "name"
FROM "users" AS "User"
WHERE "User"."username" = 'mluukkai';
```

## Table Relationships

### One-to-Many Relationship

**Definition:**
- One user has many notes
- Each note belongs to one user

**File: `models/index.js`**
```js
const Note = require('./note')
const User = require('./user')

User.hasMany(Note)
Note.belongsTo(User)

Note.sync({ alter: true })
User.sync({ alter: true })

module.exports = {
  Note,
  User
}
```

**What It Does:**
- Creates foreign key `user_id` in `notes` table
- References `users.id`
- Enables join queries
- Adds `userId` attribute to Note model

**Database Schema:**
```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL
);

-- Notes table (with foreign key)
CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  important BOOLEAN NOT NULL,
  date TIMESTAMP WITH TIME ZONE,
  user_id INTEGER REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL
);
```

### Foreign Key Behavior

**ON UPDATE CASCADE:**
- If user id changes, note's user_id updates

**ON DELETE SET NULL:**
- If user deleted, note's user_id becomes NULL
- Note is not deleted

**Alternative: ON DELETE CASCADE**
- If user deleted, all their notes are deleted

### Using Relationships

**Creating Note with User:**
```js
const user = await User.findByPk(req.decodedToken.id)
const note = await Note.create({
  ...req.body,
  userId: user.id,
  date: new Date()
})
```

**Using build:**
```js
const user = await User.findByPk(req.decodedToken.id)
const note = Note.build({ ...req.body, date: new Date() })
note.userId = user.id
await note.save()
```

**Key Point:**
- Sequelize automatically creates `userId` attribute
- No need to define in model (unless you want to)
- Can be defined explicitly if needed

## Join Queries

### Basic Join

**Include Related Model:**
```js
const users = await User.findAll({
  include: {
    model: Note
  }
})
```

**SQL Generated:**
```sql
SELECT "User"."id", "User"."username", "User"."name",
       "Notes"."id" AS "Notes.id",
       "Notes"."content" AS "Notes.content",
       "Notes"."important" AS "Notes.important",
       "Notes"."date" AS "Notes.date",
       "Notes"."user_id" AS "Notes.UserId"
FROM "users" AS "User"
LEFT OUTER JOIN "notes" AS "Notes"
ON "User"."id" = "Notes"."user_id";
```

**Result:**
```js
[
  {
    id: 1,
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    Notes: [
      { id: 1, content: '...', important: true },
      { id: 2, content: '...', important: false }
    ]
  }
]
```

### Selecting Specific Fields

**Exclude Fields:**
```js
const notes = await Note.findAll({
  attributes: { exclude: ['userId'] },
  include: {
    model: User,
    attributes: ['name']
  }
})
```

**Result:**
```js
[
  {
    id: 1,
    content: '...',
    important: true,
    date: '...',
    user: {
      name: 'Matti Luukkainen'
    }
  }
]
```

**Key Points:**
- `attributes: { exclude: [...] }` removes fields
- `attributes: [...]` selects only specified fields
- Reduces data transfer
- Improves security

### Reverse Join

**Users with Notes:**
```js
const users = await User.findAll({
  include: {
    model: Note,
    attributes: { exclude: ['userId'] }
  }
})
```

**Result:**
```js
[
  {
    id: 1,
    username: 'mluukkai',
    name: 'Matti Luukkainen',
    Notes: [
      { id: 1, content: '...', important: true, date: '...' }
    ]
  }
]
```

## Token-Based Authentication

### Token Extractor Middleware

**File: `middleware.js`**
```js
const jwt = require('jsonwebtoken')
const { SECRET } = require('./util/config')
const User = require('./models/user')

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch {
      return res.status(401).json({ error: 'token invalid' })
    }
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
  next()
}

module.exports = { tokenExtractor }
```

**Usage:**
```js
router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const note = await Note.create({
    ...req.body,
    userId: user.id,
    date: new Date()
  })
  res.json(note)
})
```

**Process:**
1. Extract token from Authorization header
2. Verify token with SECRET
3. Decode token to get user info
4. Attach to `req.decodedToken`
5. Use in route handler

## Advanced Queries

### Filtering

**Filter by Boolean:**
```js
router.get('/', async (req, res) => {
  const notes = await Note.findAll({
    where: {
      important: req.query.important === "true"
    }
  })
  res.json(notes)
})
```

**SQL:**
```sql
SELECT * FROM "notes"
WHERE "notes"."important" = true;
```

**Problem:**
- Doesn't work if query param missing
- Returns nothing instead of all

**Solution: Conditional Where:**
```js
const where = {}

if (req.query.important) {
  where.important = req.query.important === "true"
}

const notes = await Note.findAll({
  where
})
```

### Using Sequelize Operators

**Op.in:**
```js
const { Op } = require('sequelize')

let important = {
  [Op.in]: [true, false]
}

if (req.query.important) {
  important = req.query.important === "true"
}

const notes = await Note.findAll({
  where: {
    important
  }
})
```

**SQL:**
```sql
SELECT * FROM "notes"
WHERE "notes"."important" IN (true, false);
```

**Available Operators:**
- `Op.eq`: Equal
- `Op.ne`: Not equal
- `Op.gt`: Greater than
- `Op.lt`: Less than
- `Op.gte`: Greater than or equal
- `Op.lte`: Less than or equal
- `Op.in`: In array
- `Op.substring`: LIKE '%value%'
- `Op.iLike`: Case-insensitive LIKE
- `Op.or`: OR condition
- `Op.and`: AND condition

### Searching

**Substring Search:**
```js
const { Op } = require('sequelize')

const where = {}

if (req.query.search) {
  where.content = {
    [Op.substring]: req.query.search
  }
}

const notes = await Note.findAll({
  where
})
```

**SQL:**
```sql
SELECT * FROM "notes"
WHERE "notes"."content" LIKE '%database%';
```

**Case-Insensitive Search:**
```js
where.content = {
  [Op.iLike]: `%${req.query.search}%`
}
```

**Multiple Fields:**
```js
const { Op } = require('sequelize')

const where = {}

if (req.query.search) {
  where[Op.or] = [
    { title: { [Op.iLike]: `%${req.query.search}%` } },
    { author: { [Op.iLike]: `%${req.query.search}%` } }
  ]
}
```

**SQL:**
```sql
SELECT * FROM "blogs"
WHERE ("blogs"."title" ILIKE '%jami%'
   OR "blogs"."author" ILIKE '%jami%');
```

### Ordering

**Order by Field:**
```js
const blogs = await Blog.findAll({
  order: [['likes', 'DESC']]
})
```

**SQL:**
```sql
SELECT * FROM "blogs"
ORDER BY "blogs"."likes" DESC;
```

**Multiple Fields:**
```js
order: [
  ['likes', 'DESC'],
  ['title', 'ASC']
]
```

**SQL:**
```sql
SELECT * FROM "blogs"
ORDER BY "blogs"."likes" DESC, "blogs"."title" ASC;
```

### Grouping and Aggregation

**Count Blogs by Author:**
```js
const { sequelize } = require('./util/db')
const { fn, col } = require('sequelize')

const authors = await Blog.findAll({
  attributes: [
    'author',
    [fn('COUNT', col('id')), 'articles'],
    [fn('SUM', col('likes')), 'likes']
  ],
  group: ['author']
})
```

**SQL:**
```sql
SELECT "author",
       COUNT("id") AS "articles",
       SUM("likes") AS "likes"
FROM "blogs"
GROUP BY "author";
```

**Result:**
```js
[
  {
    author: 'Jami Kousa',
    articles: '3',
    likes: '10'
  },
  {
    author: 'Dan Abramov',
    articles: '1',
    likes: '4'
  }
]
```

**Order by Aggregation:**
```js
const authors = await Blog.findAll({
  attributes: [
    'author',
    [fn('COUNT', col('id')), 'articles'],
    [fn('SUM', col('likes')), 'likes']
  ],
  group: ['author'],
  order: [[fn('SUM', col('likes')), 'DESC']]
})
```

**SQL:**
```sql
SELECT "author",
       COUNT("id") AS "articles",
       SUM("likes") AS "likes"
FROM "blogs"
GROUP BY "author"
ORDER BY SUM("likes") DESC;
```

**Available Functions:**
- `fn('COUNT', col('field'))`: Count rows
- `fn('SUM', col('field'))`: Sum values
- `fn('AVG', col('field'))`: Average values
- `fn('MAX', col('field'))`: Maximum value
- `fn('MIN', col('field'))`: Minimum value

## Best Practices

### 1. Structure Applications Properly

```js
// ✅ Good: Organized structure
models/
  index.js
  note.js
  user.js
controllers/
  notes.js
  users.js
util/
  config.js
  db.js

// ❌ Bad: Everything in one file
index.js (500+ lines)
```

### 2. Use Middleware for Repetitive Code

```js
// ✅ Good: Middleware
const noteFinder = async (req, res, next) => {
  req.note = await Note.findByPk(req.params.id)
  next()
}

router.get('/:id', noteFinder, async (req, res) => {
  if (req.note) {
    res.json(req.note)
  }
})

// ❌ Bad: Repetitive code
router.get('/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)
  if (note) {
    res.json(note)
  }
})
```

### 3. Select Only Needed Fields

```js
// ✅ Good: Exclude unnecessary fields
const notes = await Note.findAll({
  attributes: { exclude: ['userId'] },
  include: {
    model: User,
    attributes: ['name']
  }
})

// ❌ Bad: Return everything
const notes = await Note.findAll({
  include: {
    model: User
  }
})
```

### 4. Build Where Conditions Dynamically

```js
// ✅ Good: Only add conditions if needed
const where = {}

if (req.query.important) {
  where.important = req.query.important === "true"
}

if (req.query.search) {
  where.content = {
    [Op.substring]: req.query.search
  }
}

// ❌ Bad: Always include conditions
const notes = await Note.findAll({
  where: {
    important: { [Op.in]: [true, false] },
    content: { [Op.substring]: req.query.search || '' }
  }
})
```

### 5. Use Relationships Instead of Manual Joins

```js
// ✅ Good: Use Sequelize relationships
User.hasMany(Note)
Note.belongsTo(User)

const users = await User.findAll({
  include: { model: Note }
})

// ❌ Bad: Manual joins
const users = await sequelize.query(`
  SELECT * FROM users
  LEFT JOIN notes ON users.id = notes.user_id
`)
```

## Common Issues and Solutions

### Issue: Foreign Key Not Created

**Problem:**
- `user_id` column doesn't exist
- Can't create notes with userId

**Solution:**
- Define relationships in `models/index.js`:
  ```js
  User.hasMany(Note)
  Note.belongsTo(User)
  ```
- Use `sync({ alter: true })` to update schema

### Issue: Include Not Working

**Problem:**
- `include` returns empty array
- Related data not loaded

**Solution:**
- Check relationships are defined
- Verify model names match
- Check foreign key exists in database

### Issue: Query Too Slow

**Problem:**
- Queries take too long
- Too much data returned

**Solution:**
- Use `attributes` to select only needed fields
- Add indexes to frequently queried columns
- Use `where` conditions to filter early

### Issue: Token Not Working

**Problem:**
- Token extraction fails
- Authentication errors

**Solution:**
- Check SECRET matches
- Verify token format (Bearer token)
- Ensure middleware runs before route handler

## Exercises

The exercises (13.5-13.16) involve:
- Restructuring application
- Implementing user management
- Adding authentication
- Creating relationships
- Implementing join queries
- Advanced filtering and searching
- Ordering and grouping
