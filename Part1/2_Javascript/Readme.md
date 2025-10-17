# [JavaScript](https://fullstackopen.com/en/part1/java_script)
The official name of the JavaScript standard is ECMAScript
Browsers do not yet support all of JavaScript's newest features. Due to this fact, a lot of code run in browsers has been transpiled from a newer version of JavaScript to an older, more compatible version.
Today, the most popular way to do transpiling is by using Babel. Transpilation is automatically configured in React applications created with Vite.(part 7)

## Node.js
Node.js is a JavaScript runtime environment based on Google's Chrome V8 JavaScript engine and works practically anywhere - from servers to mobile phones. Let's practice writing some JavaScript using Node. The latest versions of Node already understand the latest versions of JavaScript, so the code does not need to be transpiled.

The code is written into files ending with .js that are run by issuing the command node name_of_file.js

It is also possible to write JavaScript code into the Node.js console, which is opened by typing node in the command line, as well as into the browser's developer tool console. The newest revisions of Chrome handle the newer features of JavaScript pretty well without transpiling the code. Alternatively, you can use a tool like JS Bin.


### Variables
`const` does not define a variable but a constant for which the value can no longer be changed. 
although a variable declared with const cannot be reassigned to a different value, the contents of the object it references can still be modified. This is because the const declaration ensures the immutability of the reference itself, not the data it points to.(for example array is an Object)

`let` defines a normal variable. The variable's `data type` can change during execution.
`var` the old way of defining variables. [JavaScript Variables - Should You Use let, var or const?](https://medium.com/craft-academy/javascript-variables-should-you-use-let-var-or-const-394f7645c88f) on Medium or [Keyword: var vs. let on JS Tips](http://www.jstips.co/en/javascript/keyword-var-vs-let/) for more information. [also](https://youtu.be/sjyJBL5fkp8)
During this course the use of var is ill-advised and you should stick with using const and let!

```js
const x = 1
let y = 5

console.log(x, y)   // 1 5 are printed
y += 10
console.log(x, y)   // 1 15 are printed
y = 'sometext'
console.log(x, y)   // 1 sometext are printed
x = 4               // causes an error
```

### Arrays
```js
const t = [1, -1, 3]

// Add a new item to array
t.push(5)

console.log(t.length) // 4 is printed
console.log(t[1])     // -1 is printed

// Iterates through arrey
// forEach receives a function defined using the arrow syntax as a parameter.
//forEach calls the function for each of the items in the array, always passing the individual item as an argument. The function as the argument of forEach may also receive [other arguments](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach).
t.forEach(value => {
  console.log(value)  // numbers 1, -1, 3, 5 are printed, each on its own line
})                    
```

When using React, techniques from functional programming are often used. One characteristic of the functional programming paradigm is the use of immutable data structures. In React code, it is preferable to use the method concat, which creates a new array with the added item. This ensures the original array remains unchanged.
```js
const t = [1, -1, 3]

// This does not add a new item to the old array but returns a new array which, besides containing the items of the old array, also contains the new item.
const t2 = t.concat(5)  // creates new array

console.log(t)  // [1, -1, 3] is printed
console.log(t2) // [1, -1, 3, 5] is printed
```

#### [map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
Based on the old array, map creates a new array, for which the function given as a parameter is used to create the items. 
```js
const t = [1, 2, 3]

const m1 = t.map(value => value * 2)
console.log(m1)   // [2, 4, 6] is printed

const m2 = t.map(value => '<li>' + value + '</li>')
console.log(m2)  
// [ '<li>1</li>', '<li>2</li>', '<li>3</li>' ] is printed
```


#### [Destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring)
Individual items of an array are easy to assign to variables with the help of the destructuring assignment.
```js
const t = [1, 2, 3, 4, 5]

const [first, second, ...rest] = t

console.log(first, second)  // 1 2 is printed
console.log(rest)          // [3, 4, 5] is printed
```

## Objects
There are a few different ways of defining objects in JavaScript:

### object literals
Which happens by listing its properties within braces:
```js
const object1 = {
  name: 'Arto Hellas',
  age: 35,
  education: 'PhD',
}

const object2 = {
  name: 'Full Stack web application development',
  level: 'intermediate studies',
  size: 5,
}

const object3 = {
  name: {
    first: 'Dan',
    last: 'Abramov',
  },
  grades: [2, 3, 5, 3],
  department: 'Stanford University',
}

//The properties of an object are referenced by using the "dot" notation, or by using brackets:
console.log(object1.name)         // Arto Hellas is printed
const fieldName = 'age'
console.log(object1[fieldName])    // 35 is printed

// You can also add properties to an object on the fly by either using dot notation or brackets:
object1.address = 'Helsinki'
object1['secret number'] = 12341 //This has to be done by using brackets because when using dot notation, `secret number` is not a valid property name because of the space character.
```
Naturally, objects in JavaScript can also have methods. However, during this course, we do not need to define any objects with methods of their own.
Objects can also be defined using so-called constructor functions. Despite this similarity, JavaScript does not have classes in the same sense as object-oriented programming languages. There has been, however, the addition of the class syntax starting from version ES6, which in some cases helps structure object-oriented classes.

## Functions
```js
// Arrow function
const sum = (p1, p2) => {
  console.log(p1)
  console.log(p2)
  return p1 + p2
}

const result = sum(1, 5)
console.log(result)

// If there is just a single parameter, we can exclude the parentheses from the definition:
const square = p => {
  console.log(p)
  return p * p
}

//If the function only contains a single expression then the braces are not needed.
const square = p => p * p

```

## [Excercises](https://fullstackopen.com/en/part1/java_script#exercises-1-3-1-5)

1.3: Course Information step 3

1.4: Course Information step 4

1.5: Course Information step 5


## Object methods and "this"
Because this course uses a version of React containing React Hooks we do not need to define objects with methods.

Arrow functions and functions defined using the function keyword vary substantially when it comes to how they behave with respect to the keyword this, which refers to the object itself.

We can assign methods to an object by defining properties that are functions:
```js
const arto = {
  name: 'Arto Hellas',
  age: 35,
  education: 'PhD',

  greet: function() {
    console.log('hello, my name is ' + this.name)
  },
}

arto.greet()  // "hello, my name is Arto Hellas" gets printed
```
Methods can be assigned to objects even after the creation of the object:
```js
const arto = {
  name: 'Arto Hellas',
  age: 35,
  education: 'PhD',
  greet: function() {
    console.log('hello, my name is ' + this.name)
  },

 doAddition: function(a, b) { console.log(a + b)  },
}


arto.growOlder = function() {
  this.age += 1
}

console.log(arto.age)   // 35 is printed
arto.growOlder()
console.log(arto.age)   // 36 is printed


arto.doAddition(1, 4)        // 5 is printed

const referenceToAddition = arto.doAddition
referenceToAddition(10, 15)   // 25 is printed
```
If we try to do the same call by reference as above with the method greet we run into an issue:
```js
arto.greet()       // "hello, my name is Arto Hellas" gets printed

const referenceToGreet = arto.greet
referenceToGreet() // prints "hello, my name is undefined"
```
When calling the method through a reference, the method loses knowledge of what the original this was. 
Contrary to other languages, in JavaScript the value of this is defined based on how the method is called. When calling the method through a reference, the value of this becomes the so-called global object and the end result is often not what the software developer had originally intended.

Losing track of this when writing JavaScript code brings forth a few potential issues. Situations often arise where React or Node (or more specifically the JavaScript engine of the web browser) needs to call some method in an object that the developer has defined. However, in this course, we avoid these issues by using "this-less" JavaScript.

One situation leading to the "disappearance" of this arises when we set a timeout to call the greet function on the arto object, using the setTimeout function.

```js
const arto = {
  name: 'Arto Hellas',
  greet: function() {
    console.log('hello, my name is ' + this.name)
  },
}


setTimeout(arto.greet, 1000)
```
As mentioned, the value of this in JavaScript is defined based on how the method is being called. When setTimeout is calling the method, it is the JavaScript engine that actually calls the method and, at that point, this refers to the global object.

There are several mechanisms by which the original this can be preserved. One of these is using a method called bind:

```js
setTimeout(arto.greet.bind(arto), 1000)
```
Calling arto.greet.bind(arto) creates a new function where this is bound to point to Arto, independent of where and how the method is being called.

Using arrow functions it is possible to solve some of the problems related to this. They should not, however, be used as methods for objects because then this does not work at all. We will come back later to the behavior of this in relation to arrow functions.

[screencast series Understand JavaScript's this Keyword in Depth](https://egghead.io/courses/understand-javascript-s-this-keyword-in-depth) by egghead.io is highly recommended!

## [Classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes)

As mentioned previously, there is no class mechanism in JavaScript like the ones in object-oriented programming languages. There are, however, features to make "simulating" object-oriented classes possible.

Let's take a quick look at the class syntax that was introduced into JavaScript with ES6, which substantially simplifies the definition of classes (or class-like things) in JavaScript.
```js
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
  greet() {
    console.log('hello, my name is ' + this.name)
  }
}

const adam = new Person('Adam Ondra', 29)
adam.greet()

const janja = new Person('Janja Garnbret', 23)
janja.greet()
```
When it comes to syntax and behaviour, JavaScript classes and the instances created from them are very reminiscent of how classes and objects work in Java. At their core, however, they are still plain JavaScript objects built on prototypal inheritance. The type of any such class instance is still Object, because JavaScript fundamentally defines only a limited set of types: Boolean, Null, Undefined, Number, String, Symbol, BigInt, and Object.
The ES6 class syntax is used a lot in "old" React and also in Node.js, hence an understanding of it is beneficial even in this course. However, since we are using the new Hooks feature of React throughout this course, we have no concrete use for JavaScript's class syntax.

## [JavaScript learning materials](https://fullstackopen.com/en/part1/java_script#java-script-materials)
