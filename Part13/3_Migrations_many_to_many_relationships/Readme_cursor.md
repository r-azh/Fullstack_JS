# Migrations, Many-to-Many Relationships - Summary

This section covers database migrations, many-to-many relationships, connection tables, eager vs lazy fetching, model scopes, and instance/class methods in Sequelize.

## Overview

We'll learn to use migrations for database schema changes, implement many-to-many relationships using connection tables, and explore advanced Sequelize features like scopes and custom methods.

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

**Problems with `sync()`:**
- Not suitable for production
- Can't track changes over time
- No version control for schema
- Can't rollback changes
- May lose data

**Benefits of Migrations:**
- Version control for schema
- Trackable changes
- Rollback capability
- Production-safe
- Team collaboration

### Migration Structure

**Basic Migration File:**
```js
const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    // Changes to apply
  },
  down: async ({ context: queryInterface }) => {
    // How to undo changes
  },
}
```

**Key Points:**
- `up`: Apply migration
- `down`: Rollback migration
- `queryInterface`: Database operations
- Must be reversible

### Initial Migration

**File: `migrations/20211209_00_initialize_notes_and_users.js`**
```js
const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('notes', {
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
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    })
    
    await queryInterface.createTable('users', {
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
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    })
    
    await queryInterface.addColumn('notes', 'user_id', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'users', key: 'id' },
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('notes')
    await queryInterface.dropTable('users')
  },
}
```

**Important:**
- Use snake_case for table/column names
- Include timestamps manually
- Add foreign keys after tables created
- Drop in reverse order

### Running Migrations

**Using Umzug:**

**Install:**
```bash
npm install umzug
```

**File: `util/db.js`**
```js
const Sequelize = require('sequelize')
const { DATABASE_URL } = require('./config')
const { Umzug, SequelizeStorage } = require('umzug')

const sequelize = new Sequelize(DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
})

const migrationConf = {
  migrations: {
    glob: 'migrations/*.js',
  },
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  context: sequelize.getQueryInterface(),
  logger: console,
}

const runMigrations = async () => {
  const migrator = new Umzug(migrationConf)
  const migrations = await migrator.up()
  console.log('Migrations up to date', {
    files: migrations.map((mig) => mig.name),
  })
}

const rollbackMigration = async () => {
  await sequelize.authenticate()
  const migrator = new Umzug(migrationConf)
  await migrator.down()
}

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()
    console.log('connected to the database')
  } catch (err) {
    console.log('failed to connect to the database')
    console.log(err)
    return process.exit(1)
  }

  return null
}

module.exports = { connectToDatabase, sequelize, rollbackMigration }
```

**File: `util/rollback.js`**
```js
const { rollbackMigration } = require('./db')

rollbackMigration()
```

**package.json:**
```json
{
  "scripts": {
    "migration:down": "node util/rollback.js"
  }
}
```

**How It Works:**
- Migrations run automatically on startup
- Sequelize tracks completed migrations
- Only new migrations run
- Can rollback with `npm run migration:down`

### Migration Naming

**Convention:**
- Format: `YYYYMMDD_HHMM_description.js`
- Example: `20211209_00_initialize_notes_and_users.js`
- Ensures chronological order
- Alphabetical sorting works

**Important:**
- Never rename existing migrations
- Always add new migrations
- Keep migrations immutable

### Adding Columns

**File: `migrations/20211209_01_admin_and_disabled_to_users.js`**
```js
const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.addColumn('users', 'admin', {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    })
    await queryInterface.addColumn('users', 'disabled', {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn('users', 'admin')
    await queryInterface.removeColumn('users', 'disabled')
  },
}
```

**Update Model:**
```js
User.init({
  // ... existing fields ...
  admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  disabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user'
})
```

**Important:**
- Remove `sync()` calls from models
- Migrations handle schema changes
- Models reflect current schema

## Admin Users and User Disabling

### Preventing Disabled Users from Logging In

**File: `controllers/login.js`**
```js
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

  if (user.disabled) {
    return response.status(401).json({
      error: 'account disabled, please contact admin'
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
```

### Admin Middleware

**File: `util/middleware.js`**
```js
const jwt = require('jsonwebtoken')
const { SECRET } = require('./config.js')
const User = require('../models/user')

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

const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (!user.admin) {
    return res.status(401).json({ error: 'operation not allowed' })
  }
  next()
}

module.exports = { tokenExtractor, isAdmin }
```

### Admin Route

**File: `controllers/users.js`**
```js
const { tokenExtractor, isAdmin } = require('../util/middleware')

router.put('/:username', tokenExtractor, isAdmin, async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })

  if (user) {
    user.disabled = req.body.disabled
    await user.save()
    res.json(user)
  } else {
    res.status(404).end()
  }
})
```

**Key Points:**
- Multiple middleware can be chained
- `tokenExtractor` must come first
- `isAdmin` checks admin status
- Admin can enable/disable users

## Many-to-Many Relationships

### What is Many-to-Many?

**Definition:**
- One user can belong to many teams
- One team can have many users
- Requires connection table

**Example:**
- User "Matti" belongs to "Toska" and "Mosa Climbers"
- Team "Toska" has users "Matti" and "Kalle"

### Connection Table

**Migration: `migrations/20211209_02_add_teams_and_memberships.js`**
```js
const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.createTable('teams', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
      },
    })
    
    await queryInterface.createTable('memberships', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      team_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'teams', key: 'id' },
      },
    })
  },
  down: async ({ context: queryInterface }) => {
    await queryInterface.dropTable('memberships')
    await queryInterface.dropTable('teams')
  },
}
```

**Key Points:**
- Connection table: `memberships`
- Foreign keys to both tables
- Can have additional fields (e.g., role, joined_at)

### Models

**File: `models/team.js`**
```js
const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Team extends Model {}

Team.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'team'
})

module.exports = Team
```

**File: `models/membership.js`**
```js
const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Membership extends Model {}

Membership.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  teamId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'teams', key: 'id' },
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'membership'
})

module.exports = Membership
```

**Important:**
- Migration uses snake_case: `user_id`, `team_id`
- Model uses camelCase: `userId`, `teamId`
- Sequelize handles conversion

### Defining Relationships

**File: `models/index.js`**
```js
const Note = require('./note')
const User = require('./user')
const Team = require('./team')
const Membership = require('./membership')

Note.belongsTo(User)
User.hasMany(Note)

User.belongsToMany(Team, { through: Membership })
Team.belongsToMany(User, { through: Membership })

module.exports = {
  Note,
  User,
  Team,
  Membership
}
```

**Key Points:**
- `belongsToMany`: Many-to-many relationship
- `through`: Connection table model
- Must define on both sides
- Creates `teams` property on User
- Creates `users` property on Team

### Querying with Joins

**Include Teams:**
```js
const users = await User.findAll({
  include: [
    {
      model: Note,
      attributes: { exclude: ['userId'] }
    },
    {
      model: Team,
      attributes: ['name', 'id'],
      through: {
        attributes: []
      }
    }
  ]
})
```

**Key Points:**
- `through: { attributes: [] }`: Exclude join table fields
- Multiple includes in array
- Can nest includes

### Using Aliases

**Problem:**
- User has `notes` (created notes)
- User also has `marked_notes` (marked notes)
- Same relationship name conflicts

**Solution: Use Aliases**

**File: `models/index.js`**
```js
User.belongsToMany(Note, { through: UserNotes, as: 'marked_notes' })
Note.belongsToMany(User, { through: UserNotes, as: 'users_marked' })
```

**Query with Alias:**
```js
const user = await User.findByPk(req.params.id, {
  include: [
    {
      model: Note,
      attributes: { exclude: ['userId'] }
    },
    {
      model: Note,
      as: 'marked_notes',
      attributes: { exclude: ['userId'] },
      through: {
        attributes: []
      },
      include: {
        model: User,
        attributes: ['name']
      }
    }
  ]
})
```

**Key Points:**
- `as`: Alias name
- Use alias in `include`
- Can nest includes with aliases

## Eager vs Lazy Fetch

### Eager Fetch

**Definition:**
- Load related data immediately
- Single query with JOIN
- All data fetched at once

**Example:**
```js
const user = await User.findByPk(1, {
  include: {
    model: Team
  }
})
// Teams already loaded
user.teams.forEach(team => {
  console.log(team.name)
})
```

**SQL:**
```sql
SELECT * FROM users
LEFT JOIN memberships ON users.id = memberships.user_id
LEFT JOIN teams ON memberships.team_id = teams.id
WHERE users.id = 1;
```

### Lazy Fetch

**Definition:**
- Load related data on demand
- Separate query when needed
- More efficient if not always needed

**Example:**
```js
const user = await User.findByPk(1)

// Teams not loaded yet
let teams = undefined
if (req.query.teams) {
  teams = await user.getTeams({
    attributes: ['name'],
    joinTableAttributes: []
  })
}

res.json({ ...user.toJSON(), teams })
```

**Key Points:**
- `getTeams()`: Auto-generated method
- Only loads if needed
- Conditional loading
- Better performance

**Available Methods:**
- `getTeams()`: Get all teams
- `addTeam(team)`: Add team
- `removeTeam(team)`: Remove team
- `setTeams(teams)`: Replace all teams
- `hasTeam(team)`: Check membership

## Model Scopes

### Default Scope

**Definition:**
- Automatically applied to all queries
- Filters results by default
- Can be overridden

**Example:**
```js
User.init({
  // ... fields ...
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user',
  defaultScope: {
    where: {
      disabled: false
    }
  }
})
```

**Effect:**
- `User.findAll()` only returns non-disabled users
- Applied automatically
- Can override with `unscoped()`

### Named Scopes

**Definition:**
- Reusable query filters
- Can be chained
- Can accept parameters

**Example:**
```js
User.init({
  // ... fields ...
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'user',
  defaultScope: {
    where: {
      disabled: false
    }
  },
  scopes: {
    admin: {
      where: {
        admin: true
      }
    },
    disabled: {
      where: {
        disabled: true
      }
    },
    name(value) {
      return {
        where: {
          name: {
            [Op.iLike]: value
          }
        }
      }
    }
  }
})
```

**Usage:**
```js
// All admins
const adminUsers = await User.scope('admin').findAll()

// All disabled users
const disabledUsers = await User.scope('disabled').findAll()

// Users with "jami" in name
const jamiUsers = await User.scope({ method: ['name', '%jami%'] }).findAll()

// Chain scopes
const adminJamiUsers = await User.scope('admin', { method: ['name', '%jami%'] }).findAll()

// Override default scope
const allUsers = await User.unscoped().findAll()
```

## Instance and Class Methods

### Instance Methods

**Definition:**
- Called on model instances
- Access instance data with `this`
- Can be async

**Example:**
```js
class User extends Model {
  async number_of_notes() {
    return (await this.getNotes()).length
  }
}

User.init({
  // ... fields ...
})

// Usage
const user = await User.findByPk(1)
const count = await user.number_of_notes()
console.log(`User has ${count} notes`)
```

**Key Points:**
- `this` refers to instance
- Can call other instance methods
- Can access relationships

### Class Methods

**Definition:**
- Called on model class
- Static methods
- Can use aggregation

**Example:**
```js
const { Model, DataTypes, Op } = require('sequelize')
const Note = require('./note')
const { sequelize } = require('../util/db')

class User extends Model {
  static async with_notes(limit) {
    return await User.findAll({
      attributes: {
        include: [
          [sequelize.fn("COUNT", sequelize.col("notes.id")), "note_count"]
        ]
      },
      include: [
        {
          model: Note,
          attributes: []
        }
      ],
      group: ['user.id'],
      having: sequelize.literal(`COUNT(notes.id) > ${limit}`)
    })
  }
}

User.init({
  // ... fields ...
})

// Usage
const users = await User.with_notes(2)
users.forEach(u => {
  console.log(u.name, u.note_count)
})
```

**Key Points:**
- `static`: Class method
- Called on model, not instance
- Can use complex queries
- Can use aggregation

## Server-Side Sessions

### Problem with Tokens

**Issue:**
- Tokens don't expire
- Can't revoke access immediately
- User can use token even if disabled

**Solution:**
- Store sessions in database
- Check session on each request
- Can revoke immediately

### Session Table

**Migration:**
```js
await queryInterface.createTable('sessions', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
})
```

### Session Model

**File: `models/session.js`**
```js
const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Session extends Model {}

Session.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  token: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true
  },
}, {
  sequelize,
  underscored: true,
  timestamps: false,
  modelName: 'session'
})

module.exports = Session
```

### Login with Session

**File: `controllers/login.js`**
```js
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

  if (user.disabled) {
    return response.status(401).json({
      error: 'account disabled, please contact admin'
    })
  }

  const userForToken = {
    username: user.username,
    id: user.id,
  }

  const token = jwt.sign(userForToken, SECRET)

  // Create session
  await Session.create({
    userId: user.id,
    token: token
  })

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})
```

### Session Middleware

**File: `util/middleware.js`**
```js
const Session = require('../models/session')

const sessionValidator = async (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    const token = authorization.substring(7)
    
    const session = await Session.findOne({
      where: { token }
    })
    
    if (!session) {
      return res.status(401).json({ error: 'session expired' })
    }
    
    const user = await User.findByPk(session.userId)
    
    if (user.disabled) {
      return res.status(401).json({ error: 'account disabled' })
    }
    
    req.decodedToken = { id: user.id, username: user.username }
    next()
  } else {
    return res.status(401).json({ error: 'token missing' })
  }
}
```

### Logout

**File: `controllers/logout.js`**
```js
const router = require('express').Router()
const Session = require('../models/session')
const { tokenExtractor } = require('../util/middleware')

router.delete('/', tokenExtractor, async (req, res) => {
  const authorization = req.get('authorization')
  const token = authorization.substring(7)
  
  await Session.destroy({
    where: { token }
  })
  
  res.status(204).end()
})

module.exports = router
```

## Best Practices

### 1. Always Use Migrations

```js
// ✅ Good: Use migrations
await queryInterface.createTable('users', { ... })

// ❌ Bad: Use sync in production
User.sync({ alter: true })
```

### 2. Name Migrations Chronologically

```js
// ✅ Good: Date-based naming
20211209_00_initialize_tables.js
20211209_01_add_admin_field.js

// ❌ Bad: Random names
add_users.js
fix_bugs.js
```

### 3. Make Migrations Reversible

```js
// ✅ Good: Both up and down
module.exports = {
  up: async ({ context: queryInterface }) => { ... },
  down: async ({ context: queryInterface }) => { ... }
}

// ❌ Bad: Only up
module.exports = {
  up: async ({ context: queryInterface }) => { ... }
}
```

### 4. Use Snake Case in Migrations

```js
// ✅ Good: Snake case
await queryInterface.addColumn('users', 'user_id', { ... })

// ❌ Bad: Camel case
await queryInterface.addColumn('users', 'userId', { ... })
```

### 5. Use Through for Connection Tables

```js
// ✅ Good: Explicit through
User.belongsToMany(Team, { through: Membership })

// ❌ Bad: Implicit (Sequelize creates table)
User.belongsToMany(Team)
```

### 6. Exclude Join Table Attributes

```js
// ✅ Good: Exclude join table
include: {
  model: Team,
  through: { attributes: [] }
}

// ❌ Bad: Include join table
include: {
  model: Team
}
```

### 7. Use Aliases for Multiple Relationships

```js
// ✅ Good: Use aliases
User.belongsToMany(Note, { through: UserNotes, as: 'marked_notes' })

// ❌ Bad: Same name conflicts
User.belongsToMany(Note, { through: UserNotes })
```

## Common Issues and Solutions

### Issue: Migration Fails

**Problem:**
- Migration can't run
- Tables already exist

**Solution:**
- Check migration order
- Verify table names
- Use `IF NOT EXISTS` if needed
- Check foreign key constraints

### Issue: Can't Rollback

**Problem:**
- Rollback fails
- Data inconsistency

**Solution:**
- Ensure `down` function is correct
- Check foreign key constraints
- Drop in reverse order
- Test rollback before deploying

### Issue: Join Table Attributes Appear

**Problem:**
- Join table fields in results
- Unwanted data

**Solution:**
- Use `through: { attributes: [] }`
- Exclude join table fields

### Issue: Alias Not Working

**Problem:**
- Alias not recognized
- Query fails

**Solution:**
- Check alias spelling
- Use `as` in both directions
- Use alias in `include`

## Exercises

The exercises (13.17-13.24) involve:
- Creating initial migrations
- Adding timestamps
- Adding fields via migrations
- Many-to-many relationships
- Reading lists
- Server-side sessions
- Advanced querying
