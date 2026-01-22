// Runtime error example - TypeScript doesn't prevent all runtime errors
interface ApiResponse {
  name: string
  age: number
}

// TypeScript thinks this is correct
function processUser(data: ApiResponse) {
  console.log(data.name.toUpperCase())
  console.log(data.age * 2)
}

// But at runtime, API might return invalid data
// This would cause a runtime error even though TypeScript compiled successfully
const apiData = {
  name: null, // ❌ Runtime error: null.toUpperCase()
  age: "30"   // Wrong type, but TypeScript doesn't check at runtime
}

// TypeScript allows this (if we cast or ignore types)
// But it will crash at runtime
// processUser(apiData as ApiResponse) // Would crash!

// Solution: Validate external data
function isValidApiResponse(data: unknown): data is ApiResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'name' in data &&
    'age' in data &&
    typeof (data as { name: unknown }).name === 'string' &&
    typeof (data as { age: unknown }).age === 'number'
  )
}

const safeData = { name: "John", age: 30 }
if (isValidApiResponse(safeData)) {
  processUser(safeData) // Safe to use
}
