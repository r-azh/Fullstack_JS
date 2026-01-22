// Code-level documentation example
interface User {
  id: number
  name: string
  email: string
}

function getUserById(id: number): User | null {
  // Implementation would go here
  // For now, return null
  return null
}

// From function signature, we know:
// - Takes a number (id)
// - Returns User or null
// - No need to read implementation to understand contract

const user = getUserById(1)
if (user) {
  console.log(user.name) // TypeScript knows user is User here
  console.log(user.email)
}
