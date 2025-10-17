# React + Vite
Let's start by making a simple React application as well as getting to know the core concepts of React.
The easiest way to get started by far is by using a tool called [Vite](https://vite.dev/).

## 1
Let's create an application called introdemo, navigate to its directory and install the libraries:

```shell
# npm 6.x (outdated, but still used by some):
npm create vite@latest introdemo --template react

# npm 7+, extra double-dash is needed:
npm create vite@latest introdemo -- --template react
```

### result
    App will be accessible in http://localhost:5173/

## 2
Maybe already installed above?
```shell
cd introdemo
npm install
```

# 3 run

```shell
npm run dev
```
### result
    App will be accessible in http://localhost:5173/

Vite starts the application by default on port 5173. If it is not free, Vite uses the next free port number.


# 4 clean up
Remove extra code from App.jsx and main.jsx as instructed (https://fullstackopen.com/en/part1/introduction_to_react)

The files App.css and index.css, and the directory assets may be deleted as they are not needed in our application right now.

# 5 React components

Components are one of the core concepts of React. They are the foundation upon which you build user interfaces (UI). React lets you combine your markup, CSS, and JavaScript into custom “components”, reusable UI elements for your app. 
Technically the component is defined as a JavaScript function. 

# 6 index.html

By default, the file index.html doesn't contain any HTML markup that is visible to us in the browser:

The index.html can also be seen in `sources` panel in browser console.

# JS function
## [Normal functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions)
In JavaScript, functions are first-class objects, because they can be passed to other functions, returned from functions, and assigned to variables and properties. They can also have properties and methods just like any other object. What distinguishes them from other objects is that functions can be called.
By default, if a function's execution doesn't end at a return statement, or if the return keyword doesn't have an expression after it, then the return value is undefined.

Arguments are always passed by value and never passed by reference. This means that if a function reassigns a parameter, the value won't change outside the function. More precisely, object arguments are passed by sharing, which means if the object's properties are mutated, the change will impact the outside of the function. 

The this keyword refers to the object that the function is accessed on — it does not refer to the currently executing function, so you must refer to the function value by name, even within the function body.

### Defining functions

Broadly speaking, JavaScript has four kinds of functions:

    Regular function: can return anything; always runs to completion after invocation
    Generator function: returns a Generator object; can be paused and resumed with the yield operator
    Async function: returns a Promise; can be paused and resumed with the await operator
    Async generator function: returns an AsyncGenerator object; both the await and yield operators can be used

For every kind of function, there are multiple ways to define it:

#### [Declaration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function)

    function, function*, async function, async function*

```js
// Declaration
function multiply(x, y) {
  return x * y;
} // No need for semicolon here
```

#### [Expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/function)

    function, function*, async function, async function*

```js
// Expression; the function is anonymous but assigned to a variable
const multiply = function (x, y) {
  return x * y;
};
// Expression; the function has its own name
const multiply = function funcName(x, y) {
  return x * y;
};
```

#### [Constructor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/Function)

    Function(), GeneratorFunction(), AsyncFunction(), AsyncGeneratorFunction()

```js
const sum = new Function("a", "b", "return a + b");

// Constructor
const multiply = new Function("x", "y", "return x * y");
```

```js
// Method
const obj = {
  multiply(x, y) {
    return x * y;
  },
};
```

In addition, there are special syntaxes for defining arrow functions and methods, which provide more precise semantics for their usage. Classes are conceptually not functions (because they throw an error when called without new), but they also inherit from `Function.prototype` and have typeof `MyClass === "function"`

## [Arrow function expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)



An arrow function expression is a compact alternative to a traditional function expression, with some semantic differences and deliberate limitations in usage:

    Arrow functions don't have their own bindings to this, arguments, or super, and should not be used as methods.
    Arrow functions cannot be used as constructors. Calling them with new throws a TypeError. They also don't have access to the new.target keyword.
    Arrow functions cannot use yield within their body and cannot be created as generator functions.


```js
// Arrow function
const multiply = (x, y) => x * y;


const materials = ["Hydrogen", "Helium", "Lithium", "Beryllium"];

console.log(materials.map((material) => material.length));
// Expected output: Array [8, 6, 7, 9]
```

Different forms:    
```js
() => expression

param => expression

(param) => expression

(param1, paramN) => expression

() => {
  statements
}

param => {
  statements
}

(param1, paramN) => {
  statements
}
```

The following is a function (which does not receive any parameters)
```js
() => (
  <div>
    <p>Hello world</p>
  </div>
)
```
[Rest parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters), [default parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters), and [destructuring within params](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring) are supported, and always require parentheses:

```js
// Rest parameters: The rest parameter syntax allows a function to accept an indefinite number of arguments as an array (...arg)
(a, b, ...r) => expression

// Default function parameters allow named parameters to be initialized with default values if no value or undefined is passed.
(a = 400, b = 20, c) => expression

// Destructuring: The destructuring syntax is a JavaScript syntax that makes it possible to unpack values from arrays, or properties from objects, into distinct variables.
([a, b] = [10, 20]) => expression
({ a, b } = { a: 10, b: 20 }) => expression

// Rest parameters + destructured 
(...[, b, c]) => b + c

```


## [Destructring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring)
The destructuring syntax is a JavaScript syntax that makes it possible to unpack values from arrays, or properties from objects, into distinct variables. It can be used in locations that receive data (such as the left-hand side of an assignment or anywhere that creates new identifier bindings).

Syntax:
```js
const [a, b] = array;
const [a, , b] = array;
const [a = aDefault, b] = array;
const [a, b, ...rest] = array;
const [a, , b, ...rest] = array;
const [a, b, ...{ pop, push }] = array;
const [a, b, ...[c, d]] = array;

const { a, b } = obj;
const { a: a1, b: b1 } = obj;
const { a: a1 = aDefault, b = bDefault } = obj;
const { a, b, ...rest } = obj;
const { a: a1, b: b1, ...rest } = obj;
const { [key]: a } = obj;

let a, b, a1, b1, c, d, rest, pop, push;
[a, b] = array;
[a, , b] = array;
[a = aDefault, b] = array;
[a, b, ...rest] = array;
[a, , b, ...rest] = array;
[a, b, ...{ pop, push }] = array;
[a, b, ...[c, d]] = array;

({ a, b } = obj); // parentheses are required
({ a: a1, b: b1 } = obj);
({ a: a1 = aDefault, b = bDefault } = obj);
({ a, b, ...rest } = obj);
({ a: a1, b: b1, ...rest } = obj);
```

## props: passing data to components

```js
const Hello = (props) => {  return (
    <div>
      <p>Hello {props.name}</p>
    </div>
  )
}
```

# Notes

#### Use console.log() for debugging
After correcting the error, you should clear the console error messages by pressing 🚫 and then reload the page content and make sure that no error messages are displayed.

#### First letter of React component names must be capitalized otherwise react will use the HTML element with the same name instead of the custom React element. 

#### Note that the content of a React component (usually) needs to contain one root element. If we, for example, try to define the component App without the outermost div-element it will give error.
Using a root element is not the only working option. An array of components is also a valid solution:

```js
const App = () => {
  return [
    <h1>Greetings</h1>,
    <Hello name='Maya' age={26 + 10} />,
    <Footer />
  ]
}
```

Because the root element is stipulated(needed), we have "extra" div elements in the DOM tree. This can be avoided by using [fragments](https://react.dev/reference/react/Fragment), i.e. by wrapping the elements to be returned by the component with an empty element:
```js
const App = () => {
  const name = 'Peter'
  const age = 10

  return (
    <>
      <h1>Greetings</h1>
      <Hello name='Maya' age={26 + 10} />
      <Hello name={name} age={age} />
      <Footer />
    </>
  )
}
```


#### In React, the individual things rendered in braces must be primitive values, such as numbers or strings otherwise it gives error `Objects are not valid as a React child`


A small additional note to the previous one. React also allows arrays to be rendered if the array contains values ​​that are eligible for rendering (such as numbers or strings). 


# [Excercises](https://fullstackopen.com/en/part1/introduction_to_react#exercises-1-1-1-2)

1.1: Course Information, step 1

1.2: Course Information, step 2
