# Join Tables and Queries

This section covers application structuring, user management, table relationships, join queries, token-based authentication, and advanced querying with Sequelize.

## Overview

Learn to structure applications properly, establish relationships between tables, perform join queries, and implement advanced filtering, searching, and aggregation.

**Key Topics:**
- Application structuring
- User management
- Foreign keys and relationships
- Join queries
- Token-based authentication
- Advanced queries (filtering, searching, ordering, grouping)

## Application Structure

### Directory Structure
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

## Table Relationships

### One-to-Many
```js
User.hasMany(Note)
Note.belongsTo(User)
```

Creates foreign key `user_id` in notes table.

## Join Queries

### Basic Join
```js
const users = await User.findAll({
  include: {
    model: Note
  }
})
```

### Select Specific Fields
```js
const notes = await Note.findAll({
  attributes: { exclude: ['userId'] },
  include: {
    model: User,
    attributes: ['name']
  }
})
```

## Advanced Queries

### Filtering
```js
const where = {}
if (req.query.important) {
  where.important = req.query.important === "true"
}
```

### Searching
```js
const { Op } = require('sequelize')
where.content = {
  [Op.substring]: req.query.search
}
```

### Ordering
```js
order: [['likes', 'DESC']]
```

### Grouping and Aggregation
```js
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

## Exercises

- 13.5: Application structure
- 13.6: Update blog likes
- 13.7: Error handling middleware
- 13.8: User management
- 13.9: Username validation
- 13.10: Blog ownership
- 13.11: Delete blog authorization
- 13.12: Join queries
- 13.13: Filter blogs by keyword
- 13.14: Search in title or author
- 13.15: Order blogs by likes
- 13.16: Author statistics

## Resources

- [Sequelize Associations](https://sequelize.org/docs/v6/core-concepts/assocs/)
- [Sequelize Querying](https://sequelize.org/docs/v6/core-concepts/model-querying-basics/)
