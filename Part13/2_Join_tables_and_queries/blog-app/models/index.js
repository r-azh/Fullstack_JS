const Blog = require('./blog')
const User = require('./user')

// Define relationships
User.hasMany(Blog)
Blog.belongsTo(User)

// Sync tables
Blog.sync({ alter: true })
User.sync({ alter: true })

module.exports = {
  Blog,
  User
}
