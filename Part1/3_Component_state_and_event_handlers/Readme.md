# Component state, event handlers

## Component helper functions
In JavaScript, defining functions within functions is a common and efficient practice.
The parameter for function within function does not need to be explicitly passed as a parameter to the internal function because the function can directly access all the props provided to the component.

To recap, the two function definitions shown below are equivalent:
```js
const bornYear = () => new Date().getFullYear() - age

const bornYear = () => {
  return new Date().getFullYear() - age
}
```

### Destructuring
```js
const Hello = (props) => {
  const { name, age } = props

  return (
    <div> <p>Hello {name}, you are {age} years old</p> </div>
  )
}
```
We can take destructuring a step further (inside the parameters):
```js
const Hello = ({ name, age }) => {
    
  return (
    <div> <p>Hello {name}, you are {age} years old</p> </div>
  )
}
```


## Page re-rendering
Up to this point, our applications have been static — their appearance remains unchanged after the initial rendering. But what if we wanted to create a counter that increases in value, either over time or when a button is clicked?

in App.jsx:
```js
const App = (props) => {
  const {counter} = props  //<- defined with {} around var name
  return (
    <div>{counter}</div>
  )
}

export default App
```

in main.jsx:
```js
import ReactDOM from 'react-dom/client'

import App from './App'

let counter = 1

ReactDOM.createRoot(
  document.getElementById('root')
  ).render(       // This component renders the value to the screen.
  <App counter={counter} />   // <- name is not props! and can be anything
)
```
This component renders the value to the screen.
If we increase the value of counter by adding 
`counter +=1` in app.jsx the component won't re-render. 

We can get the component to re-render by calling the render method a second time, e.g. in the following way:

```js
let counter = 1

const root = ReactDOM.createRoot(document.getElementById('root'))

const refresh = () => {
  root.render(
    <App counter={counter} />
  )
}

refresh()
counter += 1
refresh()
counter += 1
refresh()
```

Now the component renders three times, first with the value 1, then 2, and finally 3. However, values 1 and 2 are displayed on the screen for such a short amount of time that they can't be noticed.

We can implement slightly more interesting functionality by re-rendering and incrementing the counter every second by using setInterval:

```js
setInterval(() => {
  refresh()
  counter += 1
}, 1000)
```
Making repeated calls to the render method is not the recommended way to re-render components. Next, we'll introduce a better way of accomplishing this effect.


## Stateful component

All of our components up till now have been simple in the sense that they have not contained any state that could change during the lifecycle of the component.

Next, let's add state to our application's App component with the help of React's [state hook](https://react.dev/learn/state-a-components-memory).

We will change the application as follows. main.jsx goes back to:
```js
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

and App.jsx changes to the following:
```js
import { useState } from 'react'

const App = () => {

  const [ counter, setCounter ] = useState(0) // adds state to the component and renders it initialized with the value zero.
  // The variable setCounter is assigned a function that will be used to modify the state.


  setTimeout(
    () => setCounter(counter + 1), //a function to increment the counter state
    1000 //a timeout of one second
  )
  
  return (
    <div>{counter}</div>
  )
}

export default App
```
The [setTimeout() method](https://developer.mozilla.org/en-US/docs/Web/API/Window/setTimeout) of the Window interface sets a timer which executes a function or specified piece of code once the timer expires.

When the state modifying function setCounter is called, React re-renders the component which means that the function body of the component function gets re-executed.
The second time the component function is executed it calls the useState function and returns the new value of the state: 1

Every time the setCounter modifies the state it causes the component to re-render. The value of the state will be incremented again after one second, and this will continue to repeat for as long as the application is running.


# Event handling
A user's interaction with the different elements of a web page can cause a collection of various kinds of events to be triggered.

Let's change the application so that increasing the counter happens when a user clicks a button, which is implemented with the button element.


In React, [registering an event handler function](https://react.dev/learn/responding-to-events) to the click event happens like this:
```js
const App = () => {
  const [ counter, setCounter ] = useState(0)


  const handleClick = () => {
    console.log('clicked')
  }

  return (
    <div>
      <div>{counter}</div>

      <button onClick={handleClick}>
        plus
      </button>
    </div>
  )
}
```
An event handler is a function (call) but we can't define it like this:
```js
<button onClick={setCounter(counter + 1)}>  // ERROR
```
Usually defining event handlers within JSX-templates is not a good idea.


## Passing state - to child components
It's recommended to write React components that are small and reusable across the application and even across projects.
One best practice in React is to lift the state up in the component hierarchy. The documentation says:

    Often, several components need to reflect the same changing data. We recommend lifting the shared state up to their closest common ancestor.

The event handler is passed to the Button component through the onClick prop. When creating your own components, you can theoretically choose the prop name freely.

React's own official tutorial suggests: "In React, it’s conventional to use onSomething names for props which take functions which handle events and handleSomething for the actual function definitions which handle those events."


## Changes in state cause re-rendering

When the application starts, the code in App is executed. This code uses a useState hook to create the application state, setting an initial value of the variable counter. This component contains the Display component - which displays the counter's value, 0 - and three Button components. The buttons all have event handlers, which are used to change the state of the counter.

When one of the buttons is clicked, the event handler is executed. The event handler changes the state of the App component with the setCounter function. Calling a function that changes the state causes the component to re-render.


### Do not ever try to guess what your code does. It is just better to use console.log and see with your own eyes what it does.
