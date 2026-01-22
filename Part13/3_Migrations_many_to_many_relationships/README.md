# Migrations, Many-to-Many Relationships

This section covers database migrations, many-to-many relationships, connection tables, eager vs lazy fetching, model scopes, and instance/class methods in Sequelize.

## Overview

Learn to use migrations for database schema changes, implement many-to-many relationships using connection tables, and explore advanced Sequelize features.

**Key Topics:**
- Database migrations
- Admin users and user disabling
- Many-to-many relationships
- Connection tables
- Eager vs lazy fetching
- Model scopes
- Instance and class methods
- Server-side sessions

## Database Migrations

### Why Migrations?
- Version control for schema
- Trackable changes
- Rollback capability
- Production-safe
- Team collaboration

### Migration Structure
```js
module.exports = {
  up: async ({ context: queryInterface }) => {
    // Apply changes
  },
  down: async ({ context: queryInterface }) => {
    // Undo changes
  },
}
```

### Running Migrations
```js
const { Umzug, SequelizeStorage } = require('umzug')

const migrator = new Umzug({
  migrations: { glob: 'migrations/*.js' },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
})
```

## Many-to-Many Relationships

### Connection Table
```js
await queryInterface.createTable('memberships', {
  user_id: {
    type: DataTypes.INTEGER,
    references: { model: 'users', key: 'id' },
  },
  team_id: {
    type: DataTypes.INTEGER,
    references: { model: 'teams', key: 'id' },
  },
})
```

### Defining Relationships
```js
User.belongsToMany(Team, { through: Membership })
Team.belongsToMany(User, { through: Membership })
```

### Querying with Joins
```js
const users = await User.findAll({
  include: {
    model: Team,
    through: { attributes: [] }
  }
})
```

### Using Aliases
```js
User.belongsToMany(Note, { through: UserNotes, as: 'marked_notes' })

const user = await User.findByPk(1, {
  include: {
    model: Note,
    as: 'marked_notes'
  }
})
```

## Eager vs Lazy Fetch

### Eager Fetch
```js
const user = await User.findByPk(1, {
  include: { model: Team }
})
// Teams already loaded
```

### Lazy Fetch
```js
const user = await User.findByPk(1)
const teams = await user.getTeams() // Loaded on demand
```

## Model Scopes

### Default Scope
```js
User.init({
  // ...
}, {
  defaultScope: {
    where: { disabled: false }
  }
})
```

### Named Scopes
```js
scopes: {
  admin: { where: { admin: true } },
  name(value) {
    return { where: { name: { [Op.iLike]: value } } }
  }
}
```

## Instance and Class Methods

### Instance Method
```js
class User extends Model {
  async number_of_notes() {
    return (await this.getNotes()).length
  }
}
```

### Class Method
```js
class User extends Model {
  static async with_notes(limit) {
    return await User.findAll({
      // complex query
    })
  }
}
```

## Exercises

- 13.17: Initialize database with migrations
- 13.18: Add year field to blogs
- 13.19: Reading list migration
- 13.20: Reading list API
- 13.21: Reading list with read status
- 13.22: Mark blog as read
- 13.23: Filter reading list by read status
- 13.24: Server-side sessions

## Resources

- [Sequelize Migrations](https://sequelize.org/docs/v6/other-topics/migrations/)
- [Sequelize Associations](https://sequelize.org/docs/v6/core-concepts/assocs/)
- [Umzug Documentation](https://github.com/sequelize/umzug)
