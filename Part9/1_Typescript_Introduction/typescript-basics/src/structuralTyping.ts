// Structural typing example
interface Person {
  name: string
  age: number
}

interface Employee {
  name: string
  age: number
  salary: number
}

const greet = (person: Person) => {
  console.log(`Hello, ${person.name}`)
}

const employee: Employee = {
  name: "John",
  age: 30,
  salary: 50000
}

// Employee is compatible with Person (structural typing)
greet(employee) // ✅ Works!

const person: Person = {
  name: "Jane",
  age: 25
}

greet(person) // ✅ Also works!
