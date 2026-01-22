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
