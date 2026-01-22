# Part 13 Exercises

This file contains exercises for Part 13: Using Relational Databases with Sequelize as they are covered in the course material.

# [Exercises 13.1-13.4: Using Relational Databases with Sequelize](https://fullstackopen.com/en/part13/using_relational_databases_with_sequelize#exercises-13-1-13-3)

## 13.1: Database setup

Set up a PostgreSQL database for your blog application.

**Details:**
- Create GitHub repository:
  - Initialize git repository
  - Create GitHub repository
  - Connect local repo to GitHub
  - Push initial code
- Choose database option:
  - **Option 1: Fly.io**
    - Run `fly launch` in project directory
    - Create Postgres database
    - **Save the password** (shown only once!)
    - Set up tunnel: `flyctl proxy 5432 -a <app-name>-db`
    - Keep tunnel running while using database
  - **Option 2: Heroku**
    - Run `heroku create`
    - Add database: `heroku addons:create heroku-postgresql:hobby-dev -a <app-name>`
    - Get connection string: `heroku config -a <app-name>`
  - **Option 3: Docker**
    - Run: `docker run -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 postgres`
    - Connection string: `postgres://postgres:mysecretpassword@localhost:5432/postgres`
- Set up environment variables:
  - Create `.env` file
  - Add `DATABASE_URL` with connection string
  - Add `PORT=3001` (or your preferred port)
  - Add `.env` to `.gitignore`
- Test connection:
  - Create `index.js` with basic connection test
  - Run: `node index.js`
  - Should see: "Connection has been established successfully."
- Verify:
  - Connection works
  - Can access database
  - Environment variables set correctly

## 13.2: Create blogs table

Create the blogs table using SQL commands.

**Details:**
- Connect to database:
  - **Fly.io:** `flyctl postgres connect -a <app-name>-db`
  - **Heroku:** `heroku run psql -h <host> -p 5432 -U <username> <dbname> -a <app-name>`
  - **Docker:** `docker exec -it <container-id> psql -U postgres postgres`
- Create table:
  ```sql
  CREATE TABLE blogs (
      id SERIAL PRIMARY KEY,
      author text,
      url text NOT NULL,
      title text NOT NULL,
      likes integer DEFAULT 0
  );
  ```
- Verify table:
  ```sql
  \d blogs
  ```
  - Should show table structure
- Insert sample data:
  ```sql
  INSERT INTO blogs (author, url, title, likes) 
  VALUES ('Dan Abramov', 'https://example.com/let-vs-const', 'On let vs const', 0);
  
  INSERT INTO blogs (author, url, title, likes) 
  VALUES ('Laurenz Albe', 'https://example.com/gaps-sequences', 'Gaps in sequences in PostgreSQL', 0);
  ```
- Verify data:
  ```sql
  SELECT * FROM blogs;
  ```
  - Should show 2 rows
- Save SQL commands:
  - Create `commands.sql` file at root
  - Include CREATE TABLE statement
  - Include INSERT statements
  - Commit to repository
- Verify:
  - Table created successfully
  - At least 2 blogs inserted
  - `commands.sql` file saved

## 13.3: Command-line interface

Create a CLI script to print blogs from the database.

**Details:**
- Create `cli.js` file:
  - Connect to database
  - Query all blogs
  - Print in specified format
- Format:
  ```
  <author>: '<title>', <likes> likes
  ```
- Example output:
  ```
  Dan Abramov: 'On let vs const', 0 likes
  Laurenz Albe: 'Gaps in sequences in PostgreSQL', 0 likes
  ```
- Implementation:
  ```js
  require('dotenv').config()
  const { Sequelize, Model, DataTypes } = require('sequelize')
  
  const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
  });
  
  class Blog extends Model {}
  
  Blog.init({
    // ... model definition ...
  }, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog'
  })
  
  const main = async () => {
    try {
      await sequelize.authenticate()
      const blogs = await Blog.findAll()
      
      blogs.forEach(blog => {
        const author = blog.author || 'Unknown'
        const title = blog.title
        const likes = blog.likes || 0
        console.log(`${author}: '${title}', ${likes} likes`)
      })
      
      sequelize.close()
    } catch (error) {
      console.error('Unable to connect to the database:', error)
    }
  }
  
  main()
  ```
- Run:
  ```bash
  node cli.js
  ```
- Expected output:
  ```
  Executing (default): SELECT * FROM blogs
  Dan Abramov: 'On let vs const', 0 likes
  Laurenz Albe: 'Gaps in sequences in PostgreSQL', 0 likes
  ```
- Verify:
  - Script runs without errors
  - Output matches expected format
  - All blogs are printed

## 13.4: Web application

Transform application into a web application with REST API endpoints.

**Details:**
- Create Express application:
  - Set up Express server
  - Use `express.json()` middleware
  - Define Blog model
  - Use `Blog.sync()` to create table
- Implement endpoints:
  - **GET /api/blogs**
    - List all blogs
    - Return JSON array
  - **POST /api/blogs**
    - Add new blog
    - Validate required fields (url, title)
    - Return created blog
    - Handle validation errors
  - **DELETE /api/blogs/:id**
    - Delete blog by ID
    - Return 204 if successful
    - Return 404 if not found
- Implementation:
  ```js
  require('dotenv').config()
  const express = require('express')
  const { Sequelize, Model, DataTypes } = require('sequelize')
  
  const app = express()
  
  const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
  });
  
  class Blog extends Model {}
  
  Blog.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    author: {
      type: DataTypes.TEXT
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    likes: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  }, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'blog'
  })
  
  Blog.sync()
  
  app.use(express.json())
  
  // GET all blogs
  app.get('/api/blogs', async (req, res) => {
    const blogs = await Blog.findAll()
    res.json(blogs)
  })
  
  // POST new blog
  app.post('/api/blogs', async (req, res) => {
    try {
      const blog = await Blog.create(req.body)
      return res.json(blog)
    } catch(error) {
      return res.status(400).json({ error })
    }
  })
  
  // DELETE blog
  app.delete('/api/blogs/:id', async (req, res) => {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
      await blog.destroy()
      res.status(204).end()
    } else {
      res.status(404).end()
    }
  })
  
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
  ```
- Test endpoints:
  - **GET:** `curl http://localhost:3001/api/blogs`
  - **POST:** `curl -X POST http://localhost:3001/api/blogs -H "Content-Type: application/json" -d '{"author":"Test Author","url":"https://example.com","title":"Test Blog"}'`
  - **DELETE:** `curl -X DELETE http://localhost:3001/api/blogs/1`
- Error handling:
  - Missing required fields should return 400
  - Invalid ID should return 404
  - Validation errors should be handled
- Verify:
  - All endpoints work
  - GET returns all blogs
  - POST creates new blog
  - DELETE removes blog
  - Error handling works correctly
  - Compatible with frontend from section 5 (except error handling)

# [Exercises 13.5-13.16: Join Tables and Queries](https://fullstackopen.com/en/part13/join_tables_and_queries#exercises-13-5-13-7)

## 13.5: Application structure

Restructure your application to follow a clear organization pattern.

**Details:**
- Create directory structure:
  ```
  index.js
  util/
    config.js
    db.js
  models/
    index.js
    blog.js
  controllers/
    blogs.js
  ```
- Move code to appropriate files:
  - **util/config.js:** Environment variables
  - **util/db.js:** Database connection
  - **models/blog.js:** Blog model definition
  - **models/index.js:** Model relationships and exports
  - **controllers/blogs.js:** Route handlers
  - **index.js:** Application setup and startup
- Benefits:
  - Clear separation of concerns
  - Easier to maintain
  - Better organization
- Verify:
  - Application still works
  - All routes functional
  - Code is well organized

## 13.6: Update blog likes

Implement support for updating the number of likes on a blog.

**Details:**
- Add PUT endpoint:
  - Route: `PUT /api/blogs/:id`
  - Updates likes count
  - Request body: `{ likes: 3 }`
- Implementation:
  ```js
  router.put('/:id', blogFinder, async (req, res) => {
    if (req.blog) {
      req.blog.likes = req.body.likes
      await req.blog.save()
      res.json(req.blog)
    } else {
      res.status(404).end()
    }
  })
  ```
- Test:
  ```bash
  curl -X PUT http://localhost:3001/api/blogs/1 \
    -H "Content-Type: application/json" \
    -d '{"likes": 5}'
  ```
- Verify:
  - Likes count updates correctly
  - Returns updated blog
  - Handles non-existent blog (404)

## 13.7: Error handling middleware

Centralize error handling in middleware.

**Details:**
- Install express-async-errors:
  ```bash
  npm install express-async-errors
  ```
- Add to index.js:
  ```js
  require('express-async-errors')
  ```
- Create error handler middleware:
  ```js
  const errorHandler = (error, req, res, next) => {
    console.error(error)
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        error: error.errors.map(e => e.message) 
      })
    }
    
    res.status(500).json({ error: 'Internal server error' })
  }
  
  app.use(errorHandler)
  ```
- Error situations:
  - Creating blog with invalid data
  - Updating likes with invalid data
- Verify:
  - Validation errors return 400
  - Error messages are descriptive
  - Other errors return 500

## 13.8: User management

Add support for users to the application.

**Details:**
- Create User model:
  - Fields: id, name, username
  - name: string, must not be empty
  - username: string, must not be empty
  - **Important:** Enable timestamps (created_at, updated_at)
- Model definition:
  ```js
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    }
  }, {
    sequelize,
    underscored: true,
    timestamps: true,  // Enable timestamps
    modelName: 'user'
  })
  ```
- Implement routes:
  - **POST /api/users:** Create new user
  - **GET /api/users:** List all users
  - **PUT /api/users/:username:** Change username (parameter is username, not id)
- Password:
  - All users can have same password: "secret"
  - Or implement proper password hashing (as in part 4)
- Verify:
  - Timestamps work when creating user
  - Timestamps work when updating username
  - All routes functional

## 13.9: Username validation

Add validation to ensure username is a valid email address.

**Details:**
- Add validation to User model:
  ```js
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  }
  ```
- Update error handler:
  ```js
  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({ 
      error: error.errors.map(e => e.message) 
    })
  }
  ```
- Error message format:
  ```json
  {
    "error": [
      "Validation isEmail on username failed"
    ]
  }
  ```
- Test:
  ```bash
  # Should fail
  curl -X POST http://localhost:3001/api/users \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","username":"notanemail"}'
  
  # Should succeed
  curl -X POST http://localhost:3001/api/users \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","username":"test@example.com"}'
  ```
- Verify:
  - Invalid email rejected
  - Error message is descriptive
  - Valid email accepted

## 13.10: Blog ownership

Link blogs to the user who created them.

**Details:**
- Implement login endpoint:
  - Route: `POST /api/login`
  - Returns JWT token
  - Same as notes app
- Define relationship:
  ```js
  User.hasMany(Blog)
  Blog.belongsTo(User)
  ```
- Update blog creation:
  - Require authentication token
  - Extract user from token
  - Associate blog with user
- Implementation:
  ```js
  router.post('/', tokenExtractor, async (req, res) => {
    try {
      const user = await User.findByPk(req.decodedToken.id)
      const blog = await Blog.create({
        ...req.body,
        userId: user.id
      })
      res.json(blog)
    } catch(error) {
      return res.status(400).json({ error })
    }
  })
  ```
- Verify:
  - Only authenticated users can create blogs
  - Blog is linked to creator
  - Foreign key created in database

## 13.11: Delete blog authorization

Make deletion of blogs only possible for the creator.

**Details:**
- Update delete route:
  - Check if user is the creator
  - Return 403 if not creator
  - Only delete if user matches
- Implementation:
  ```js
  router.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
    if (req.blog) {
      if (req.blog.userId !== req.decodedToken.id) {
        return res.status(403).json({ 
          error: 'only the creator can delete a blog' 
        })
      }
      await req.blog.destroy()
      res.status(204).end()
    } else {
      res.status(404).end()
    }
  })
  ```
- Test:
  ```bash
  # Login as user1, create blog, get token1
  # Login as user2, get token2
  # Try to delete blog with token2 - should fail (403)
  # Delete with token1 - should succeed (204)
  ```
- Verify:
  - Only creator can delete
  - Other users get 403
  - Non-existent blog returns 404

## 13.12: Join queries

Modify routes to show relationships.

**Details:**
- Update GET /api/blogs:
  - Include user information
  - Show user name
  - Exclude userId field
- Implementation:
  ```js
  router.get('/', async (req, res) => {
    const blogs = await Blog.findAll({
      attributes: { exclude: ['userId'] },
      include: {
        model: User,
        attributes: ['name']
      }
    })
    res.json(blogs)
  })
  ```
- Update GET /api/users:
  - Include blogs
  - Exclude userId from blogs
- Implementation:
  ```js
  router.get('/', async (req, res) => {
    const users = await User.findAll({
      include: {
        model: Blog,
        attributes: { exclude: ['userId'] }
      }
    })
    res.json(users)
  })
  ```
- Verify:
  - Blogs show creator name
  - Users show their blogs
  - No userId fields exposed

## 13.13: Filter blogs by keyword

Implement filtering by keyword in blog titles.

**Details:**
- Add search functionality:
  - Route: `GET /api/blogs?search=react`
  - Case-insensitive search in title
  - Returns matching blogs
- Implementation:
  ```js
  const { Op } = require('sequelize')
  
  router.get('/', async (req, res) => {
    const where = {}
    
    if (req.query.search) {
      where.title = {
        [Op.iLike]: `%${req.query.search}%`
      }
    }
    
    const blogs = await Blog.findAll({
      where
    })
    
    res.json(blogs)
  })
  ```
- Test:
  ```bash
  # Search for "react"
  curl "http://localhost:3001/api/blogs?search=react"
  
  # Get all blogs
  curl "http://localhost:3001/api/blogs"
  ```
- Verify:
  - Search works case-insensitively
  - Returns only matching blogs
  - No search returns all blogs

## 13.14: Search in title or author

Expand search to include both title and author fields.

**Details:**
- Update search logic:
  - Search in title OR author
  - Case-insensitive
  - Use Op.or
- Implementation:
  ```js
  const { Op } = require('sequelize')
  
  if (req.query.search) {
    where[Op.or] = [
      { title: { [Op.iLike]: `%${req.query.search}%` } },
      { author: { [Op.iLike]: `%${req.query.search}%` } }
    ]
  }
  ```
- Test:
  ```bash
  # Search for "jami" (in author or title)
  curl "http://localhost:3001/api/blogs?search=jami"
  ```
- Verify:
  - Finds blogs with keyword in title
  - Finds blogs with keyword in author
  - Case-insensitive matching

## 13.15: Order blogs by likes

Modify blogs route to return blogs ordered by likes (descending).

**Details:**
- Add ordering:
  - Order by likes DESC
  - Highest likes first
- Implementation:
  ```js
  const blogs = await Blog.findAll({
    order: [['likes', 'DESC']]
  })
  ```
- Test:
  ```bash
  curl "http://localhost:3001/api/blogs"
  # Should return blogs with highest likes first
  ```
- Verify:
  - Blogs ordered by likes (descending)
  - Highest likes appear first
  - Works with search filter

## 13.16: Author statistics

Create route that returns statistics for each author.

**Details:**
- Create new route:
  - Route: `GET /api/authors`
  - Returns: author, articles count, total likes
- Implementation:
  ```js
  const { fn, col } = require('sequelize')
  
  router.get('/', async (req, res) => {
    const authors = await Blog.findAll({
      attributes: [
        'author',
        [fn('COUNT', col('id')), 'articles'],
        [fn('SUM', col('likes')), 'likes']
      ],
      group: ['author'],
      order: [[fn('SUM', col('likes')), 'DESC']]
    })
    
    res.json(authors)
  })
  ```
- Expected output:
  ```json
  [
    {
      "author": "Jami Kousa",
      "articles": "3",
      "likes": "10"
    },
    {
      "author": "Dan Abramov",
      "articles": "1",
      "likes": "4"
    }
  ]
  ```
- Bonus: Order by likes (descending)
- Verify:
  - Returns correct counts
  - Returns correct sums
  - Ordered by likes (if bonus implemented)
  - Uses database-level aggregation

# [Exercises 13.17-13.24: Migrations, Many-to-Many Relationships](https://fullstackopen.com/en/part13/migrations_many_to_many_relationships#exercises-13-17-13-18)

## 13.17: Initialize database with migrations

Delete all tables and create initial migration with timestamps.

**Details:**
- Delete all tables:
  - Drop tables manually or via migration rollback
  - Clear migrations table if needed
- Create initial migration:
  - File: `migrations/YYYYMMDD_HHMM_initialize_blogs_and_users.js`
  - Create `blogs` table
  - Create `users` table
  - Add foreign key `user_id` to blogs
  - **Important:** Add `created_at` and `updated_at` timestamps to both tables
- Migration structure:
  ```js
  const { DataTypes } = require('sequelize')
  
  module.exports = {
    up: async ({ context: queryInterface }) => {
      await queryInterface.createTable('blogs', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        author: {
          type: DataTypes.TEXT
        },
        url: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        title: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        likes: {
          type: DataTypes.INTEGER,
          defaultValue: 0
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
      
      await queryInterface.addColumn('blogs', 'user_id', {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      })
    },
    down: async ({ context: queryInterface }) => {
      await queryInterface.dropTable('blogs')
      await queryInterface.dropTable('users')
    },
  }
  ```
- Remove sync calls:
  - Remove `Blog.sync()` from models/index.js
  - Remove `User.sync()` from models/index.js
  - Migrations handle schema changes
- Set up Umzug:
  - Install: `npm install umzug`
  - Configure in `util/db.js`
  - Run migrations on startup
- Verify:
  - Tables created with timestamps
  - Foreign key created
  - No sync calls in code
  - Migrations run successfully

## 13.18: Add year field to blogs

Add year field to blogs table via migration.

**Details:**
- Create migration:
  - File: `migrations/YYYYMMDD_HHMM_add_year_to_blogs.js`
  - Add `year` column to blogs table
  - Type: INTEGER
  - Validation: >= 1991 and <= current year
- Migration:
  ```js
  const { DataTypes } = require('sequelize')
  
  module.exports = {
    up: async ({ context: queryInterface }) => {
      await queryInterface.addColumn('blogs', 'year', {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
          min: 1991,
          max: new Date().getFullYear()
        }
      })
    },
    down: async ({ context: queryInterface }) => {
      await queryInterface.removeColumn('blogs', 'year')
    },
  }
  ```
- Update Blog model:
  ```js
  year: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1991,
      max: new Date().getFullYear()
    }
  }
  ```
- Error handling:
  - Return appropriate error if year invalid
  - Error message should be descriptive
- Test:
  ```bash
  # Should fail
  curl -X POST http://localhost:3001/api/blogs \
    -H "Content-Type: application/json" \
    -d '{"title":"Test","url":"https://example.com","year":1990}'
  
  # Should succeed
  curl -X POST http://localhost:3001/api/blogs \
    -H "Content-Type: application/json" \
    -d '{"title":"Test","url":"https://example.com","year":2020}'
  ```
- Verify:
  - Year column added
  - Validation works
  - Error messages are clear
  - Can create blogs with valid year

## 13.19: Reading list migration

Create migration for reading list (many-to-many relationship).

**Details:**
- Create migration:
  - File: `migrations/YYYYMMDD_HHMM_add_reading_lists.js`
  - Create `reading_lists` table
  - Fields: id, user_id, blog_id, read (boolean, default false)
  - Foreign keys to users and blogs
- Migration:
  ```js
  const { DataTypes } = require('sequelize')
  
  module.exports = {
    up: async ({ context: queryInterface }) => {
      await queryInterface.createTable('reading_lists', {
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
        blog_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'blogs', key: 'id' },
        },
        read: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        },
      })
    },
    down: async ({ context: queryInterface }) => {
      await queryInterface.dropTable('reading_lists')
    },
  }
  ```
- Create ReadingList model:
  ```js
  class ReadingList extends Model {}
  
  ReadingList.init({
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
    blogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'blogs', key: 'id' },
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
  }, {
    sequelize,
    underscored: true,
    timestamps: false,
    modelName: 'reading_list'
  })
  ```
- Define relationships:
  ```js
  User.belongsToMany(Blog, { through: ReadingList, as: 'readings' })
  Blog.belongsToMany(User, { through: ReadingList, as: 'users_reading' })
  ```
- Verify:
  - Table created
  - Foreign keys work
  - Can insert test data manually

## 13.20: Reading list API

Implement API endpoints for reading list.

**Details:**
- Create POST endpoint:
  - Route: `POST /api/readinglists`
  - Body: `{ "blogId": 10, "userId": 3 }`
  - Creates reading list entry
- Implementation:
  ```js
  router.post('/', async (req, res) => {
    try {
      const readingList = await ReadingList.create({
        blogId: req.body.blogId,
        userId: req.body.userId,
        read: false
      })
      res.json(readingList)
    } catch(error) {
      return res.status(400).json({ error })
    }
  })
  ```
- Update GET /api/users/:id:
  - Include reading list
  - Use alias 'readings'
  - Format:
    ```js
    {
      name: "Matti Luukkainen",
      username: "mluukkai@iki.fi",
      readings: [
        {
          id: 3,
          url: "https://google.com",
          title: "Clean React",
          author: "Dan Abramov",
          likes: 34,
          year: null,
        }
      ]
    }
    ```
- Implementation:
  ```js
  router.get('/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id, {
      include: {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId'] },
        through: {
          attributes: []
        }
      }
    })
    
    if (user) {
      res.json({
        name: user.name,
        username: user.username,
        readings: user.readings
      })
    } else {
      res.status(404).end()
    }
  })
  ```
- Verify:
  - Can add blogs to reading list
  - Reading list appears in user data
  - Format matches specification

## 13.21: Reading list with read status

Show read status and join table id in reading list.

**Details:**
- Update GET /api/users/:id:
  - Include read status
  - Include join table id
  - Format:
    ```js
    {
      name: "Matti Luukkainen",
      username: "mluukkai@iki.fi",
      readings: [
        {
          id: 3,
          url: "https://google.com",
          title: "Clean React",
          author: "Dan Abramov",
          likes: 34,
          year: null,
          readinglists: [
            {
              read: false,
              id: 2
            }
          ]
        }
      ]
    }
    ```
- Implementation:
  ```js
  router.get('/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id, {
      include: {
        model: Blog,
        as: 'readings',
        attributes: { exclude: ['userId'] },
        through: {
          attributes: ['read', 'id']
        }
      }
    })
    
    if (user) {
      res.json({
        name: user.name,
        username: user.username,
        readings: user.readings
      })
    } else {
      res.status(404).end()
    }
  })
  ```
- Note:
  - `readinglists` array always contains one object
  - Join table entry connects blog to user
- Verify:
  - Read status shown
  - Join table id shown
  - Format matches specification

## 13.22: Mark blog as read

Implement endpoint to mark blog as read.

**Details:**
- Create PUT endpoint:
  - Route: `PUT /api/readinglists/:id`
  - Body: `{ "read": true }`
  - Updates read status
  - Only user can mark their own blogs
- Implementation:
  ```js
  router.put('/:id', tokenExtractor, async (req, res) => {
    const readingList = await ReadingList.findByPk(req.params.id)
    
    if (!readingList) {
      return res.status(404).end()
    }
    
    if (readingList.userId !== req.decodedToken.id) {
      return res.status(403).json({ 
        error: 'only the owner can mark as read' 
      })
    }
    
    readingList.read = req.body.read
    await readingList.save()
    res.json(readingList)
  })
  ```
- Authorization:
  - Check token
  - Verify user owns reading list entry
  - Return 403 if not owner
- Test:
  ```bash
  # Login, get token
  # Create reading list entry
  # Mark as read
  curl -X PUT http://localhost:3001/api/readinglists/1 \
    -H "Authorization: Bearer <token>" \
    -H "Content-Type: application/json" \
    -d '{"read": true}'
  ```
- Verify:
  - Can mark own blogs as read
  - Cannot mark others' blogs
  - Read status updates correctly

## 13.23: Filter reading list by read status

Add query parameter to filter reading list.

**Details:**
- Update GET /api/users/:id:
  - Query parameter: `?read=true` or `?read=false`
  - Filter reading list by read status
  - No parameter: return all
- Implementation:
  ```js
  router.get('/:id', async (req, res) => {
    const includeOptions = {
      model: Blog,
      as: 'readings',
      attributes: { exclude: ['userId'] },
      through: {
        attributes: ['read', 'id']
      }
    }
    
    if (req.query.read !== undefined) {
      includeOptions.through.where = {
        read: req.query.read === 'true'
      }
    }
    
    const user = await User.findByPk(req.params.id, {
      include: includeOptions
    })
    
    if (user) {
      res.json({
        name: user.name,
        username: user.username,
        readings: user.readings
      })
    } else {
      res.status(404).end()
    }
  })
  ```
- Test:
  ```bash
  # All readings
  curl "http://localhost:3001/api/users/1"
  
  # Only read
  curl "http://localhost:3001/api/users/1?read=true"
  
  # Only unread
  curl "http://localhost:3001/api/users/1?read=false"
  ```
- Verify:
  - All readings returned if no parameter
  - Only read if `?read=true`
  - Only unread if `?read=false`

## 13.24: Server-side sessions

Implement server-side sessions to revoke access immediately.

**Details:**
- Create sessions table:
  - Migration: `migrations/YYYYMMDD_HHMM_add_sessions.js`
  - Fields: id, user_id, token
  - Foreign key to users
- Migration:
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
- Create Session model
- Update login:
  - Create session when user logs in
  - Store token in session table
- Create session validator middleware:
  - Check if session exists
  - Check if user is disabled
  - Attach user to request
- Create logout endpoint:
  - Route: `DELETE /api/logout`
  - Delete session from database
  - Requires authentication
- Update all protected routes:
  - Use session validator instead of token extractor
  - Check session on every request
- Implementation:
  ```js
  // Login
  router.post('/', async (req, res) => {
    // ... login logic ...
    const token = jwt.sign(userForToken, SECRET)
    
    await Session.create({
      userId: user.id,
      token: token
    })
    
    res.status(200).send({ token, username: user.username, name: user.name })
  })
  
  // Session validator
  const sessionValidator = async (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
      const token = authorization.substring(7)
      
      const session = await Session.findOne({ where: { token } })
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
  
  // Logout
  router.delete('/', sessionValidator, async (req, res) => {
    const authorization = req.get('authorization')
    const token = authorization.substring(7)
    
    await Session.destroy({ where: { token } })
    res.status(204).end()
  })
  ```
- Verify:
  - Session created on login
  - Session checked on protected routes
  - Logout deletes session
  - Disabled users can't use tokens
  - Expired tokens don't work
