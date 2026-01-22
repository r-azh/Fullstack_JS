// Type inference example
const add = (a: number, b: number) => {
  // Return type inferred as number
  return a + b
}

// Type inferred as string
const message = "Hello, TypeScript"

// Type inferred as number[]
const numbers = [1, 2, 3, 4, 5]

// Explicit type annotation
const explicit: number = 42

console.log(add(10, 20))
console.log(message)
console.log(numbers)
console.log(explicit)
