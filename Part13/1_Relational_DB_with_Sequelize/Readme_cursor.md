# Using Relational Databases with Sequelize - Summary

This section introduces relational databases and Sequelize ORM, covering the transition from MongoDB to PostgreSQL, setting up databases, creating models, and performing basic CRUD operations.

## Overview

We'll explore Node.js applications using relational databases, building a backend for a notes application similar to sections 3-5, but using PostgreSQL instead of MongoDB.

**Key Topics:**
- Relational vs document databases
- PostgreSQL setup
- Sequelize ORM
- Models and schemas
- CRUD operations
- Error handling

**Prerequisites:**
- Knowledge of relational databases and SQL
- Understanding of MongoDB from previous sections
- Basic Docker knowledge (for local setup)

## Relational vs Document Databases

### Document Databases (MongoDB)

**Characteristics:**
- Schemaless
- Schema exists only in code
- Flexible structure
- No database-level validation

**Example Structure:**
```js
// Notes collection
[
  {
    "_id": "600c0e410d10256466898a6c",
    "content": "HTML is easy",
    "date": "2021-01-23T11:53:37.292+00:00",
    "important": false
  }
]

// Users collection
[
  {
    "_id": "600c0e410d10256466883a6a",
    "username": "mluukkai",
    "name": "Matti Luukkainen",
    "passwordHash": "$2b$10$...",
    "notes": [
      "600c0edde86c7264ace9bb78",
      "600c0e410d10256466898a6c"
    ]
  }
]
```

**Advantages:**
- Flexibility: no schema definition needed
- Faster development in some cases
- Easier schema modifications
- Less upfront planning

**Disadvantages:**
- Error-prone: no database validation
- No mandatory field enforcement
- No referential integrity
- Schema only in code (can drift)

### Relational Databases (PostgreSQL)

**Characteristics:**
- Schema-based
- Database enforces structure
- Strong data integrity
- Referential integrity

**Advantages:**
- Data integrity enforced
- Mandatory fields validated
- Type checking
- Referential integrity
- Better for complex relationships

**Disadvantages:**
- Requires schema definition
- Less flexible
- More upfront planning
- Schema changes require migrations

**Why Use Relational:**
- Better data integrity
- Stronger validation
- Better for complex relationships
- Industry standard for many applications

## PostgreSQL Setup

### Option 1: Fly.io

**Create Application:**
```bash
fly launch
```

**Create Database:**
```bash
# Creates Postgres database
# Password shown only once - save it!
```

**Connect String:**
```bash
DATABASE_URL=postgres://postgres:password@127.0.0.1:5432/postgres
```

**Tunnel to Database:**
```bash
flyctl proxy 5432 -a <app-name>-db
# Keep this running!
```

**Access psql:**
```bash
flyctl postgres connect -a <app-name>-db
```

### Option 2: Heroku

**Create Application:**
```bash
heroku create
```

**Add Database:**
```bash
heroku addons:create heroku-postgresql:hobby-dev -a <app-name>
```

**Get Connection String:**
```bash
heroku config -a <app-name>
# Returns DATABASE_URL
```

**Access psql:**
```bash
heroku run psql -h <host> -p 5432 -U <username> <dbname> -a <app-name>
```

**Connection String:**
```bash
DATABASE_URL=postgres://username:password@host:5432/dbname
```

**SSL Required:**
```js
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});
```

### Option 3: Docker

**Start Postgres:**
```bash
docker run -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 postgres
```

**Connect String:**
```bash
DATABASE_URL=postgres://postgres:mysecretpassword@localhost:5432/postgres
```

**Access psql:**
```bash
# Find container ID
docker ps

# Connect
docker exec -it <container-id> psql -U postgres postgres
```

**Persist Data:**
```bash
# Use volume for persistence
docker run -e POSTGRES_PASSWORD=mysecretpassword \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  postgres
```

## Using psql Console

### Basic Commands

**List Tables:**
```sql
\d
```

**Describe Table:**
```sql
\d notes
```

**Create Table:**
```sql
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    content text NOT NULL,
    important boolean,
    date time
);
```

**Explanation:**
- `SERIAL`: Auto-incrementing integer
- `PRIMARY KEY`: Unique, not null
- `NOT NULL`: Mandatory field
- `text`: Text type
- `boolean`: Boolean type
- `time`: Time type

**Insert Data:**
```sql
INSERT INTO notes (content, important) 
VALUES ('Relational databases rule the world', true);

INSERT INTO notes (content, important) 
VALUES ('MongoDB is webscale', false);
```

**Query Data:**
```sql
SELECT * FROM notes;
```

**Validation Examples:**
```sql
-- Fails: missing mandatory field
INSERT INTO notes (important) VALUES (true);
-- ERROR: null value in column "content" violates not-null constraint

-- Fails: wrong type
INSERT INTO notes (content, important) 
VALUES ('test', 1);
-- ERROR: column "important" is of type boolean but expression is of type integer

-- Fails: column doesn't exist
INSERT INTO notes (content, important, value) 
VALUES ('test', true, 10);
-- ERROR: column "value" of relation "notes" does not exist
```

## Node Application Setup

### Installation

**Dependencies:**
```bash
npm install express dotenv pg sequelize
```

**Development Dependencies:**
```bash
npm install --save-dev nodemon
```

**Package.json Scripts:**
```json
{
  "scripts": {
    "dev": "nodemon index.js",
    "start": "node index.js"
  }
}
```

### Environment Variables

**File: `.env`**
```bash
DATABASE_URL=postgres://postgres:password@localhost:5432/postgres
PORT=3001
```

**File: `.gitignore`**
```
node_modules
.env
```

### Basic Connection

**File: `index.js`**
```js
require('dotenv').config()
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL)

const main = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()
```

**Run:**
```bash
node index.js
# Connection has been established successfully.
```

### Direct SQL Queries

**File: `index.js`**
```js
require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

const main = async () => {
  try {
    await sequelize.authenticate()
    const notes = await sequelize.query("SELECT * FROM notes", { 
      type: QueryTypes.SELECT 
    })
    console.log(notes)
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

main()
```

**Output:**
```js
[
  {
    id: 1,
    content: 'Relational databases rule the world',
    important: true,
    date: null
  },
  {
    id: 2,
    content: 'MongoDB is webscale',
    important: false,
    date: null
  }
]
```

## Sequelize Models

### What is a Model?

**Definition:**
- JavaScript class representing a database table
- Maps to table structure
- Provides methods for database operations
- No need to write SQL directly

### Creating a Model

**File: `models/note.js`**
```js
const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/database')

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
    type: DataTypes.BOOLEAN
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

**Model Configuration:**
- `sequelize`: Database connection instance
- `underscored: true`: Converts camelCase to snake_case
  - `creationYear` → `creation_year` in database
- `timestamps: false`: No `created_at`/`updated_at` columns
- `modelName: 'note'`: Lowercase model name

**Naming Convention:**
- Model: `Note` (singular, PascalCase)
- Table: `notes` (plural, lowercase, snake_case)
- Column: `creation_year` (snake_case in DB, camelCase in code)

### Using Models in Application

**File: `index.js`**
```js
require('dotenv').config()
const { Sequelize } = require('sequelize')
const express = require('express')
const Note = require('./models/note')

const app = express()

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

// Initialize model
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
    type: DataTypes.BOOLEAN
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

// Sync database (creates table if not exists)
Note.sync()

app.use(express.json())

app.get('/api/notes', async (req, res) => {
  const notes = await Note.findAll()
  res.json(notes)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```

## CRUD Operations

### Create (POST)

**Method 1: Using `create`**
```js
app.post('/api/notes', async (req, res) => {
  try {
    const note = await Note.create(req.body)
    return res.json(note)
  } catch(error) {
    return res.status(400).json({ error })
  }
})
```

**Method 2: Using `build` and `save`**
```js
app.post('/api/notes', async (req, res) => {
  try {
    const note = Note.build(req.body)
    // Can modify before saving
    note.important = true
    await note.save()
    return res.json(note)
  } catch(error) {
    return res.status(400).json({ error })
  }
})
```

**Validation Error:**
```js
// If content is missing:
SequelizeValidationError: notNull Violation: Note.content cannot be null
```

### Read (GET)

**Get All:**
```js
app.get('/api/notes', async (req, res) => {
  const notes = await Note.findAll()
  res.json(notes)
})
```

**Get by ID:**
```js
app.get('/api/notes/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)
  if (note) {
    res.json(note)
  } else {
    res.status(404).end()
  }
})
```

**SQL Generated:**
```sql
-- findAll()
SELECT "id", "content", "important", "date" 
FROM "notes" AS "note";

-- findByPk(1)
SELECT "id", "content", "important", "date" 
FROM "notes" AS "note" 
WHERE "note"."id" = '1';
```

### Update (PUT)

**Update Note:**
```js
app.put('/api/notes/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)
  if (note) {
    note.important = req.body.important
    await note.save()
    res.json(note)
  } else {
    res.status(404).end()
  }
})
```

**Process:**
1. Find note by ID
2. Modify properties
3. Call `save()` to persist changes

### Delete (DELETE)

**Delete Note:**
```js
app.delete('/api/notes/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)
  if (note) {
    await note.destroy()
    res.status(204).end()
  } else {
    res.status(404).end()
  }
})
```

## Database Synchronization

### Automatic Table Creation

**Problem:**
- Application assumes table exists
- Manual table creation required
- Schema not in code repository

**Solution: `sync()` Method**

**File: `index.js`**
```js
// After model definition
Note.sync()
```

**What It Does:**
- Creates table if it doesn't exist
- Uses `CREATE TABLE IF NOT EXISTS`
- Schema defined in model
- No manual SQL needed

**SQL Generated:**
```sql
CREATE TABLE IF NOT EXISTS "notes" (
  "id" SERIAL,
  "content" TEXT NOT NULL,
  "important" BOOLEAN,
  "date" TIMESTAMP WITH TIME ZONE,
  PRIMARY KEY ("id")
);
```

**Important:**
- `sync()` only creates tables
- Doesn't modify existing tables
- Doesn't handle migrations
- Use migrations for production

## Debugging and Logging

### Printing Model Objects

**Problem:**
```js
const note = await Note.findByPk(1)
console.log(note)
// Prints lots of Sequelize internals
```

**Output:**
```js
note {
  dataValues: { id: 1, content: '...', important: true },
  _previousDataValues: { ... },
  _changed: Set(0) {},
  _options: { ... },
  isNewRecord: false
}
```

### Solution 1: `toJSON()`

**Single Object:**
```js
const note = await Note.findByPk(1)
console.log(note.toJSON())
// { id: 1, content: '...', important: true, date: ... }
```

**Array of Objects:**
```js
const notes = await Note.findAll()
console.log(notes.map(n => n.toJSON()))
// [{ id: 1, ... }, { id: 2, ... }]
```

### Solution 2: `JSON.stringify()`

**Single Object:**
```js
const note = await Note.findByPk(1)
console.log(JSON.stringify(note, null, 2))
```

**Array of Objects:**
```js
const notes = await Note.findAll()
console.log(JSON.stringify(notes, null, 2))
```

**Formatted Output:**
```json
[
  {
    "id": 1,
    "content": "MongoDB is webscale",
    "important": false,
    "date": "2021-10-09T13:52:58.693Z"
  },
  {
    "id": 2,
    "content": "Relational databases rule the world",
    "important": true,
    "date": "2021-10-09T13:53:10.710Z"
  }
]
```

## Error Handling

### Validation Errors

**Example:**
```js
app.post('/api/notes', async (req, res) => {
  try {
    const note = await Note.create(req.body)
    return res.json(note)
  } catch(error) {
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: 'Validation failed',
        details: error.errors 
      })
    }
    return res.status(500).json({ error: 'Internal server error' })
  }
})
```

### Not Found Errors

**Example:**
```js
app.get('/api/notes/:id', async (req, res) => {
  const note = await Note.findByPk(req.params.id)
  if (note) {
    res.json(note)
  } else {
    res.status(404).json({ error: 'Note not found' })
  }
})
```

## Best Practices

### 1. Use Models, Not Raw SQL

```js
// ✅ Good: Use Sequelize methods
const notes = await Note.findAll()

// ❌ Bad: Raw SQL (unless necessary)
const notes = await sequelize.query("SELECT * FROM notes", ...)
```

### 2. Handle Errors Properly

```js
// ✅ Good: Try-catch with specific error handling
try {
  const note = await Note.create(req.body)
  res.json(note)
} catch(error) {
  if (error.name === 'SequelizeValidationError') {
    res.status(400).json({ error: 'Validation failed' })
  } else {
    res.status(500).json({ error: 'Server error' })
  }
}

// ❌ Bad: No error handling
const note = await Note.create(req.body)
res.json(note)
```

### 3. Use `sync()` for Development Only

```js
// ✅ Good: Development
if (process.env.NODE_ENV !== 'production') {
  Note.sync()
}

// ❌ Bad: Production (use migrations instead)
Note.sync()
```

### 4. Validate Input

```js
// ✅ Good: Model validates
const note = await Note.create({
  content: req.body.content,
  important: req.body.important || false
})

// ❌ Bad: No validation
const note = await Note.create(req.body)
```

### 5. Use Environment Variables

```js
// ✅ Good: Environment variables
const sequelize = new Sequelize(process.env.DATABASE_URL)

// ❌ Bad: Hardcoded credentials
const sequelize = new Sequelize('postgres://user:pass@host/db')
```

## Common Issues and Solutions

### Issue: Connection Refused

**Problem:**
- Can't connect to database
- Connection timeout

**Solutions:**
- Check DATABASE_URL is correct
- Verify database is running
- Check firewall/network settings
- For Fly.io: Ensure tunnel is running
- For Heroku: Check SSL settings

### Issue: Table Doesn't Exist

**Problem:**
- `relation "notes" does not exist`

**Solution:**
- Run `Note.sync()` to create table
- Or create table manually with SQL
- Check model name matches table name

### Issue: SSL Required

**Problem:**
- Heroku requires SSL connection

**Solution:**
```js
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});
```

### Issue: Validation Errors

**Problem:**
- `notNull Violation`
- `ValidationError`

**Solution:**
- Check model definition
- Ensure required fields are provided
- Verify data types match

## Exercises

The exercises (13.1-13.4) involve:
- Setting up PostgreSQL database
- Creating database tables
- Building blog application backend
- Implementing CRUD operations
- Error handling
