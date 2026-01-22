// IntelliSense example
interface Product {
  id: number
  name: string
  price: number
  description: string
}

const product: Product = {
  id: 1,
  name: "Laptop",
  price: 999,
  description: "High-performance laptop"
}

// IDE knows product has: id, name, price, description
// Autocomplete suggests these properties
console.log(product.name)
console.log(product.price)
console.log(product.description)

// ❌ Would cause compile error: property doesn't exist
// console.log(product.invalidProperty)
