const animals = [
    {name: 'Fluffykins', species: 'rabbit'},
    {name: 'Caro', species: 'dog'},
    {name: 'Hamilton', species: 'dog'},
    {name: 'Harold', species: 'fish'},
    {name: 'Ursula', species: 'cat'},
    {name: 'Jimmy', species: 'fish'},
]

console.log('------ 1 ------')

let dogs = []

// normal way to filter dogs
for (let i=0; i<animals.length; i++){
    if (animals[i].species === 'dog'){
        dogs.push(animals[i])
    }
}
console.log('dogs', dogs)

// ---- using filter ----
console.log('---- using filter ----')
const isDog = function(animal){
    return animal.species === 'dog'
}
dogs = animals.filter(isDog)
// or
//  dogs = animals.filter(animal => animal.species === 'dog')
console.log('dogs', dogs)

const isNotDog = function(animal){
    return animal.species !== 'dog'
}
let otherAnimals = []
otherAnimals = animals.filter(isNotDog)
console.log('other animals', otherAnimals)

console.log('------ 2 ------')
// normal way to extract values
let names = []
for(let i=0; i<animals.length; i++){
    names.push(animals[i].name)
}
console.log('names', names)

console.log('---- using map ----')
// const getName = function(animal) {return animal.name}
// names = animals.map(getName)

names = animals.map(animal => animal.name)
console.log('names', names)

console.log('------ 3 ------')

const orders = [
    {amount: 250},
    {amount: 400},
    {amount: 100},
    {amount: 325},
]
let totalAmount = 0
for(let i=0; i<orders.length; i++){
    totalAmount += orders[i].amount
}
console.log('totalAmount', totalAmount)

console.log('---- using reduce ----')
const add = function(sum, order) {
    return sum + order.amount
}
totalAmount = orders.reduce(add, 0)
console.log('totalAmount', totalAmount)

totalAmount = orders.reduce((sum, order) => sum + order.amount, 0)
console.log('totalAmount', totalAmount)
