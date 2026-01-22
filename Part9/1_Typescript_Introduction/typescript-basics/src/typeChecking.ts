// Type checking example
function calculateArea(width: number, height: number): number {
  return width * height
}

// ✅ Correct usage
const area1 = calculateArea(10, 20)
console.log(area1)

// ❌ Would cause compile error: wrong type
// const area2 = calculateArea("10", 20)

// ❌ Would cause compile error: wrong number of arguments
// const area3 = calculateArea(10)
