# Using Relational Databases with Sequelize

This section introduces relational databases and Sequelize ORM, covering the transition from MongoDB to PostgreSQL, setting up databases, creating models, and performing basic CRUD operations.

## Overview

Learn to use PostgreSQL with Sequelize ORM in Node.js applications, building a backend similar to sections 3-5 but using relational databases instead of MongoDB.

**Key Topics:**
- Relational vs document databases
- PostgreSQL setup
- Sequelize ORM
- Models and schemas
- CRUD operations
- Error handling

## Relational vs Document Databases

### Document Databases (MongoDB)
- Schemaless
- Flexible structure
- Schema in code only
- No database validation

### Relational Databases (PostgreSQL)
- Schema-based
- Database enforces structure
- Strong data integrity
- Type checking

## PostgreSQL Setup

### Fly.io
```bash
fly launch
flyctl proxy 5432 -a <app-name>-db
DATABASE_URL=postgres://postgres:password@127.0.0.1:5432/postgres
```

### Heroku
```bash
heroku create
heroku addons:create heroku-postgresql:hobby-dev -a <app-name>
heroku config -a <app-name>
```

### Docker
```bash
docker run -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 postgres
DATABASE_URL=postgres://postgres:mysecretpassword@localhost:5432/postgres
```

## Sequelize Models

### Creating a Model
```js
const { Model, DataTypes } = require('sequelize')

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
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'note'
})
```

## CRUD Operations

### Create
```js
const note = await Note.create(req.body)
```

### Read
```js
const notes = await Note.findAll()
const note = await Note.findByPk(id)
```

### Update
```js
note.important = req.body.important
await note.save()
```

### Delete
```js
await note.destroy()
```

## Database Synchronization

```js
Note.sync() // Creates table if it doesn't exist
```

## Exercises

- 13.1: Database setup
- 13.2: Create blogs table
- 13.3: Command-line interface
- 13.4: Web application

## Resources

- [Sequelize Documentation](https://sequelize.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [SQL Tutorial](https://sqlbolt.com/)
