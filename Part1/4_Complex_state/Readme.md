# More complex state, debugging

## Complex state

If our application requires a more complex state, in most cases, the easiest and best way to accomplish this is by using the useState function multiple times to create separate "pieces" of state.

```js
const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)

  return (
    <div>
      {left}
      <button onClick={() => setLeft(left + 1)}>
        left
      </button>
      <button onClick={() => setRight(right + 1)}>
        right
      </button>
      {right}
    </div>
  )
}
```

The component's state or a piece of its state can be of any type. We could implement the same functionality by saving the click count of both the left and right buttons into a single object:
```js
const [clicks, setClicks] = useState({
    left: 0, right: 0
  })

const handleLeftClick = () => {
  const newClicks = { 
    left: clicks.left + 1, 
    right: clicks.right 
  }
  setClicks(newClicks)
}
...
```


We can define the new state object a bit more neatly by using the object spread syntax that was added to the language specification in the summer of 2018:
```js
const handleLeftClick = () => {
  const newClicks = { 
    ...clicks, 
    left: clicks.left + 1 
  }
  setClicks(newClicks)
}
//or
const handleLeftClick = () =>
  setClicks({ ...clicks, left: clicks.left + 1 })
```
The above code creates a copy of the clicks object where the value of the left property is increased by one.

Some readers might be wondering why we didn't just update the state directly, like this:
```js
// forbidden syntax
const handleLeftClick = () => {
  clicks.left++
  setClicks(clicks)
}
```
The application appears to work. However, it is forbidden in React to mutate state directly, since [it can result in unexpected side effects](https://stackoverflow.com/questions/37755997/why-cant-i-directly-modify-a-components-state-really/40309023#40309023). Changing state has to always be done by setting the state to a new object. If properties from the previous state object are not changed, they need to simply be copied, which is done by copying those properties into a new object and setting that as the new state.

### State object structure
Storing all of the state in a single state object is a bad choice for this particular application; there's no apparent benefit and the resulting application is a lot more complex. In this case, storing the click counters into separate pieces of state is a far more suitable choice.

There are situations where it can be beneficial to store a piece of application state in a more complex data structure. The official React documentation contains some helpful guidance on the topic.
https://react.dev/learn/choosing-the-state-structure

## Handling arrays
```js
[allClicks, setAll] = useState([])

const handleLeftClick = () => {    setAll(allClicks.concat('L'))    setLeft(left + 1)  }
const handleRightClick = () => {    setAll(allClicks.concat('R'))    setRight(right + 1)  }
```
Adding the new item to the array is accomplished with the concat method, which does not mutate the existing array but rather returns a new copy of the array with the item added to it. However, don't use push for this. As mentioned previously, the state of React components, like allClicks, must not be mutated directly. Even if mutating state appears to work in some cases, it can lead to problems that are very hard to debug.


## Update of the state is asynchronous

If the state doesn't update right away it's because a state update in React happens asynchronously, i.e. not immediately but "at some point" before the component is rendered again.
We can fix it by using following instead of 
`setLeft(left + 1)` and `setTotal(left + right)`
```js
const App = () => {
  // ...
  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    const updatedLeft = left + 1
    setLeft(updatedLeft)
    setTotal(updatedLeft + right) 
  }

  // ...
}
```

## Conditional rendering
    Conditional rendering
    Old React
    Debugging React applications
    Rules of Hooks
    Event Handling Revisited
    A function that returns a function
    Passing Event Handlers to Child Components
    Do Not Define Components Within Components
    Useful Reading
    Web programmers oath
    Utilization of Large language models
    Exercises 1.6.-1.14.

d
A more complex state, debugging React apps
Complex state

In our previous example, the application state was simple as it was comprised of a single integer. What if our application requires a more complex state?

In most cases, the easiest and best way to accomplish this is by using the useState function multiple times to create separate "pieces" of state.

In the following code we create two pieces of state for the application named left and right that both get the initial value of 0:

const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)

  return (
    <div>
      {left}
      <button onClick={() => setLeft(left + 1)}>
        left
      </button>
      <button onClick={() => setRight(right + 1)}>
        right
      </button>
      {right}
    </div>
  )
}

The component gets access to the functions setLeft and setRight that it can use to update the two pieces of state.

The component's state or a piece of its state can be of any type. We could implement the same functionality by saving the click count of both the left and right buttons into a single object:

{
  left: 0,
  right: 0
}

In this case, the application would look like this:

const App = () => {
  const [clicks, setClicks] = useState({
    left: 0, right: 0
  })

  const handleLeftClick = () => {
    const newClicks = { 
      left: clicks.left + 1, 
      right: clicks.right 
    }
    setClicks(newClicks)
  }

  const handleRightClick = () => {
    const newClicks = { 
      left: clicks.left, 
      right: clicks.right + 1 
    }
    setClicks(newClicks)
  }

  return (
    <div>
      {clicks.left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {clicks.right}
    </div>
  )
}

Now the component only has a single piece of state and the event handlers have to take care of changing the entire application state.

The event handler looks a bit messy. When the left button is clicked, the following function is called:

const handleLeftClick = () => {
  const newClicks = { 
    left: clicks.left + 1, 
    right: clicks.right 
  }
  setClicks(newClicks)
}

The following object is set as the new state of the application:

{
  left: clicks.left + 1,
  right: clicks.right
}

The new value of the left property is now the same as the value of left + 1 from the previous state, and the value of the right property is the same as the value of the right property from the previous state.

We can define the new state object a bit more neatly by using the object spread syntax that was added to the language specification in the summer of 2018:

const handleLeftClick = () => {
  const newClicks = { 
    ...clicks, 
    left: clicks.left + 1 
  }
  setClicks(newClicks)
}

const handleRightClick = () => {
  const newClicks = { 
    ...clicks, 
    right: clicks.right + 1 
  }
  setClicks(newClicks)
}

The syntax may seem a bit strange at first. In practice { ...clicks } creates a new object that has copies of all of the properties of the clicks object. When we specify a particular property - e.g. right in { ...clicks, right: 1 }, the value of the right property in the new object will be 1.

In the example above, this:

{ ...clicks, right: clicks.right + 1 }

creates a copy of the clicks object where the value of the right property is increased by one.

Assigning the object to a variable in the event handlers is not necessary and we can simplify the functions to the following form:

const handleLeftClick = () =>
  setClicks({ ...clicks, left: clicks.left + 1 })

const handleRightClick = () =>
  setClicks({ ...clicks, right: clicks.right + 1 })

Some readers might be wondering why we didn't just update the state directly, like this:

const handleLeftClick = () => {
  clicks.left++
  setClicks(clicks)
}

The application appears to work. However, it is forbidden in React to mutate state directly, since it can result in unexpected side effects. Changing state has to always be done by setting the state to a new object. If properties from the previous state object are not changed, they need to simply be copied, which is done by copying those properties into a new object and setting that as the new state.

Storing all of the state in a single state object is a bad choice for this particular application; there's no apparent benefit and the resulting application is a lot more complex. In this case, storing the click counters into separate pieces of state is a far more suitable choice.

There are situations where it can be beneficial to store a piece of application state in a more complex data structure. The official React documentation contains some helpful guidance on the topic.
Handling arrays

Let's add a piece of state to our application containing an array allClicks that remembers every click that has occurred in the application.

const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])
  const handleLeftClick = () => {    setAll(allClicks.concat('L'))    setLeft(left + 1)  }
  const handleRightClick = () => {    setAll(allClicks.concat('R'))    setRight(right + 1)  }
  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <p>{allClicks.join(' ')}</p>    </div>
  )
}

Every click is stored in a separate piece of state called allClicks that is initialized as an empty array:

const [allClicks, setAll] = useState([])

When the left button is clicked, we add the letter L to the allClicks array:

const handleLeftClick = () => {
  setAll(allClicks.concat('L'))
  setLeft(left + 1)
}

The piece of state stored in allClicks is now set to be an array that contains all of the items of the previous state array plus the letter L. Adding the new item to the array is accomplished with the concat method, which does not mutate the existing array but rather returns a new copy of the array with the item added to it.

As mentioned previously, it's also possible in JavaScript to add items to an array with the push method. If we add the item by pushing it to the allClicks array and then updating the state, the application would still appear to work:

const handleLeftClick = () => {
  allClicks.push('L')
  setAll(allClicks)
  setLeft(left + 1)
}

However, don't do this. As mentioned previously, the state of React components, like allClicks, must not be mutated directly. Even if mutating state appears to work in some cases, it can lead to problems that are very hard to debug.

Let's take a closer look at how the clicking is rendered to the page:

const App = () => {
  // ...

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <p>{allClicks.join(' ')}</p>    </div>
  )
}

We call the join method on the allClicks array, that joins all the items into a single string, separated by the string passed as the function parameter, which in our case is an empty space.
Update of the state is asynchronous

Let's expand the application so that it keeps track of the total number of button presses in the state total, whose value is always updated when the buttons are pressed:

const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])
  const [total, setTotal] = useState(0)
  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    setLeft(left + 1)
    setTotal(left + right)  }

  const handleRightClick = () => {
    setAll(allClicks.concat('R'))
    setRight(right + 1)
    setTotal(left + right)  }

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <p>{allClicks.join(' ')}</p>
      <p>total {total}</p>    </div>
  )
}

The solution does not quite work:
browser showing 2 left|right 1, RLL total 2

The total number of button presses is consistently one less than the actual amount of presses, for some reason.

Let us add couple of console.log statements to the event handler:

const App = () => {
  // ...
  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    console.log('left before', left)    setLeft(left + 1)
    console.log('left after', left)    setTotal(left + right) 
  }

  // ...
}

The console reveals the problem
devtools console showing left before 4 and left after 4

Even though a new value was set for left by calling setLeft(left + 1), the old value persists despite the update. As a result, the attempt to count button presses produces a result that is too small:

setTotal(left + right) 

The reason for this is that a state update in React happens asynchronously, i.e. not immediately but "at some point" before the component is rendered again.

We can fix the app as follows:

const App = () => {
  // ...
  const handleLeftClick = () => {
    setAll(allClicks.concat('L'))
    const updatedLeft = left + 1
    setLeft(updatedLeft)
    setTotal(updatedLeft + right) 
  }

  // ...
}

So now the number of button presses is definitely based on the correct number of left button presses.

We can also handle asynchronous updates for the right button:

const App = () => {
  // ...
  const handleRightClick = () => {
    setAll(allClicks.concat('R'));
    const updatedRight = right + 1;
    setRight(updatedRight);
    setTotal(left + updatedRight);
  };

  // ...
}

Conditional rendering

Let's modify our application so that the rendering of the clicking history is handled by a new History component:

const History = (props) => {  if (props.allClicks.length === 0) {    return (      <div>        the app is used by pressing the buttons      </div>    )  }  return (    <div>      button press history: {props.allClicks.join(' ')}    </div>  )}
const App = () => {
  // ...

  return (
    <div>
      {left}
      <button onClick={handleLeftClick}>left</button>
      <button onClick={handleRightClick}>right</button>
      {right}
      <History allClicks={allClicks} />    </div>
  )
}

Now the behavior of the component depends on whether or not any buttons have been clicked. If not, meaning that the allClicks array is empty, the component renders a div element with some instructions instead:

<div>the app is used by pressing the buttons</div>

And in all other cases, the component renders the clicking history:

<div>
  button press history: {props.allClicks.join(' ')}
</div>

The History component renders completely different React elements depending on the state of the application. This is called (conditional rendering)[https://react.dev/learn/conditional-rendering].

React also offers many other ways of doing conditional rendering. 


## Old React state using class

In this course, we use the state hook to add state to our React components, which is part of the newer versions of React and is available from version 16.8.0 onwards. Before the addition of hooks, there was no way to add state to functional components. Components that required state had to be defined as class components, using the JavaScript class syntax.

## Debugging React applications
1- Logging: Use console.log

NB When you use console.log for debugging, don't combine objects in a Java-like fashion by using the plus operator:
```js
console.log('props value is ' + props)
```
If you do that, you will end up with a rather uninformative log message:
```
props value is [object Object]
```
Instead, separate the things you want to log to the console with a comma:
```js
console.log('props value is', props)
```
In this way, the separated items will all be available in the browser console for further inspection.

2- Debugger: You can pause the execution of your application code in the Chrome developer console's debugger, by writing the command `debugger` anywhere in your code.
The debugger also enables us to execute our code line by line with the controls found on the right-hand side of the Sources tab.

You can also access the debugger without the debugger command by adding breakpoints in the Sources tab. Inspecting the values of the component's variables can be done in the Scope-section:

3- [React developer tools extension ](https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?pli=1): It is highly recommended to add the React developer tools extension to Chrome. It adds a new Components tab to the developer tools. The new developer tools tab can be used to inspect the different React elements in the application, along with their state and props:
[Chrome DevTools guide video](https://developer.chrome.com/docs/devtools/javascript)


## Rules of Hooks
There are a few limitations and [rules](https://react.dev/warnings/invalid-hook-call-warning#breaking-rules-of-hooks) that we have to follow to ensure that our application uses hooks-based state functions correctly.

Functions whose names start with use are called Hooks in React.
Don’t call Hooks inside `loops`, `conditions`, or `nested functions`. Instead, always use Hooks at the top level of your React function, before any early returns. You can only call Hooks while React is rendering a function component:

    ✅ Call them at the top level in the body of a function component.
    ✅ Call them at the top level in the body of a custom Hook.

```js
function Counter() {
  // ✅ Good: top-level in a function component
  const [count, setCount] = useState(0);
  // ...
}

function useWindowWidth() {
  // ✅ Good: top-level in a custom Hook
  const [width, setWidth] = useState(window.innerWidth);
  // ...
}
```

It’s not supported to call Hooks (functions starting with use) in any other cases, for example:

    🔴 Do not call Hooks inside conditions or loops.
    🔴 Do not call Hooks after a conditional return statement.
    🔴 Do not call Hooks in event handlers.
    🔴 Do not call Hooks in class components.
    🔴 Do not call Hooks inside functions passed to useMemo, useReducer, or useEffect.

If you break these rules, you might see this error.

```js
function Bad({ cond }) {
  if (cond) {
    // 🔴 Bad: inside a condition (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  for (let i = 0; i < 10; i++) {
    // 🔴 Bad: inside a loop (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad({ cond }) {
  if (cond) {
    return;
  }
  // 🔴 Bad: after a conditional return (to fix, move it before the return!)
  const theme = useContext(ThemeContext);
  // ...
}

function Bad() {
  function handleClick() {
    // 🔴 Bad: inside an event handler (to fix, move it outside!)
    const theme = useContext(ThemeContext);
  }
  // ...
}

function Bad() {
  const style = useMemo(() => {
    // 🔴 Bad: inside useMemo (to fix, move it outside!)
    const theme = useContext(ThemeContext);
    return createStyle(theme);
  });
  // ...
}

class Bad extends React.Component {
  render() {
    // 🔴 Bad: inside a class component (to fix, write a function component instead of a class!)
    useEffect(() => {})
    // ...
  }
}
```

The useState function (as well as the useEffect function introduced later on in the course) must not be called from inside of a loop, a conditional expression, or any place that is not a function defining a component. This must be done to ensure that the hooks are always called in the same order, and if this isn't the case the application will behave erratically.

To recap, hooks may only be called from the inside of a function body that defines a React component:

```js
const App = () => {
  // these are ok
  const [age, setAge] = useState(0)
  const [name, setName] = useState('Juha Tauriainen')

  if ( age > 10 ) {
    // this does not work!
    const [foobar, setFoobar] = useState(null)
  }

  for ( let i = 0; i < age; i++ ) {
    // also this is not good
    const [rightWay, setRightWay] = useState(false)
  }

  const notGood = () => {
    // and this is also illegal
    const [x, setX] = useState(-1000)
  }

  return (
    //...
  )
}
```

## Event Handling Revisited
Event handlers must always be a function or a reference to a function. The button will not work if the event handler is set to a variable of any other type.

We must never mutate state directly in React.

In case of the following:
```js
// wrong
<button onClick={console.log('clicked the button')}>
  button
</button>
```

The message gets printed to the console once when the component is rendered but nothing happens when we click the button. Why does this not work even when our event handler contains a function console.log?

The issue here is that our event handler is defined as a function call which means that the event handler is assigned the returned value from the function, which in the case of console.log is undefined.

The console.log function call gets executed when the component is rendered and for this reason, it gets printed once to the console.

The following attempt is flawed as well:
```js
// wrong  -> infinite loop
<button onClick={setValue(0)}>button</button>
```
We have once again tried to set a function call as the event handler. This does not work. This particular attempt also causes another problem. When the component is rendered the function setValue(0) gets executed which in turn causes the component to be re-rendered. Re-rendering in turn calls setValue(0) again, resulting in an infinite recursion.

```js
// correct
<button onClick={() => console.log('clicked the button')}>
  button
</button>

<button onClick={() => setValue(0)}>button</button>
```
Now the event handler is a function defined with the arrow function syntax () => console.log('clicked the button'). When the component gets rendered, no function gets called and only the reference to the arrow function is set to the event handler. Calling the function happens only once the button is clicked.

Defining event handlers directly in the attribute of the button is not necessarily the best possible idea.


## A function that returns a function
Another way to define an event handler is to use a function that returns a function.

```js
const App = () => {
  const [value, setValue] = useState(10)


  const hello = (who) => {
    const handler = () => {
      console.log('hello', who)
    }
    return handler
  }

  return (
    <div>
      {value}

      <button onClick={hello('world')}>button</button>
      <button onClick={hello('react')}>button</button>
      <button onClick={hello('function')}>button</button>
    </div>
  )
}
```
The event handler is now set to a function call: hello()
It works because The return value of the function is another function that is assigned to the handler variable.


Functions returning functions can be utilized in defining generic functionality that can be customized with parameters. The hello function that creates the event handlers can be thought of as a factory that produces customized event handlers meant for greeting users.

We can write hello as following:
```js
const hello = (who) => {
  return () => {
    console.log('hello', who)
  }
}
```
Since our hello function is composed of a single return command, we can omit the curly braces and use the more compact syntax for arrow functions:
```js
const hello = (who) =>
  () => {
    console.log('hello', who)
  }
```
or
```js
const hello = (who) => () => {
  console.log('hello', who)
}
```

Using functions that return functions is not required to achieve this functionality. Let's return the setToValue function which is responsible for updating state into a normal function:

```js
const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = (newValue) => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  return (
    <div>
      {value}
      <button onClick={() => setToValue(1000)}>
        thousand
      </button>
      <button onClick={() => setToValue(0)}>
        reset
      </button>
      <button onClick={() => setToValue(value + 1)}>
        increment
      </button>
    </div>
  )
}
```
We can now define the event handler as a function that calls the setToValue function with an appropriate parameter. The event handler for resetting the application state would be:
```js
<button onClick={() => setToValue(0)}>reset</button>
```
Choosing between the two presented ways of defining your event handlers is mostly a matter of taste.


## Passing Event Handlers to Child Components
Using the Button component (child component) is simple, although we have to make sure that we use the correct attribute names when passing props to the component (onClick and text).
```js
const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)
//...
const App = (props) => {
  // ...
  return (
    <div>
      {value}

      <Button onClick={() => setToValue(1000)} text="thousand" />
      <Button onClick={() => setToValue(0)} text="reset" />
      <Button onClick={() => setToValue(value + 1)} text="increment" />
    </div>
  )
}
```

## Do Not Define Components Within Components
If we define a component inside another like `Display` below:
```js
// This is the right place to define a component
const Button = (props) => (
  <button onClick={props.onClick}>
    {props.text}
  </button>
)

const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = newValue => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  // Do not define components inside another component

  const Display = props => <div>{props.value}</div>

  return (
    <div>
      <Display value={value} />
    </div>
  )
}
```
The application still appears to work, but don't implement components like this! Never define components inside of other components. The method provides no benefits and leads to many unpleasant problems. The biggest problems are because React treats a component defined inside of another component as a new component in every render. This makes it impossible for React to optimize the component.

Move the Display component function to its correct place, which is outside of the App component function.

## [Useful Reading](https://fullstackopen.com/en/part1/a_more_complex_state_debugging_react_apps#useful-reading)


## Web programmers oath

    - I will have my browser developer console open all the time
    - I progress with small steps
    - I will write lots of console.log statements to make sure I understand how the code behaves and to help pinpointing problems
    - If my code does not work, I will not write more code. Instead I will start deleting the code until it works or just return to a state when everything was still working
    - When I ask for help in the course Discord channel or elsewhere I formulate my questions properly, see here how to ask for help

## [Utilization of Large language models](https://fullstackopen.com/en/part1/a_more_complex_state_debugging_react_apps#utilization-of-large-language-models)
Large language models such as ChatGPT, Claude and GitHub Copilot have proven to be very useful in software development.

Personally, I mainly use GitHub Copilot, which is now natively integrated into Visual Studio Code As a reminder, if you're a university student, you can access Copilot pro for free through the GitHub Student Developer Pack.

Perhaps the biggest problem with language models is hallucination, they sometimes generate completely convincing-looking answers, which, however, are completely wrong. When programming, of course, the hallucinated code is often caught quickly if the code does not work. More problematic situations are those where the code generated by the language model seems to work, but it contains more difficult to detect bugs or e.g. security vulnerabilities.

Another problem in applying language models to software development is that it is difficult for language models to "understand" larger projects, and e.g. to generate functionality that would require changes to several files. Language models are also currently unable to generalize code, i.e. if the code has, for example, existing functions or components that the language model could use with minor changes for the requested functionality, the language model will not bend to this. The result of this can be that the code base deteriorates, as the language models generate a lot of repetition in the code, see more e.g. here.

When using language models, the responsibility always stays with the programmer.

The rapid development of language models puts the student of programming in a challenging position: is it worth and is it even necessary to learn programming in a detailed level, when you can get almost everything ready-made from language models?

At this point, it is worth remembering the old wisdom of Brian Kerningham, co-author of The C Programming Language:

In other words, since debugging is twice as difficult as programming, it is not worth programming such code that you can only barely understand. How can debugging be even possible in a situation where programming is outsourced to a language model and the software developer does not understand the debugged code at all?

So far, the development of language models and artificial intelligence is still at the stage where they are not self-sufficient, and the most difficult problems are left for humans to solve. Because of this, even novice software developers must learn to program really well just in case. It may be that, despite the development of language models, even more in-depth knowledge is needed. Artificial intelligence does the easy things, but a human is needed to sort out the most complicated messes caused by AI. GitHub Copilot is a very well-named product, it's Copilot, a second pilot who helps the main pilot in an aircraft. The programmer is still the main pilot, the captain, and bears the ultimate responsibility.

It may be in your own interest that you turn off Copilot by default when you do this course and rely on it only in a real emergency.


## [Excercises](https://fullstackopen.com/en/part1/a_more_complex_state_debugging_react_apps#exercises-1-6-1-14)

1.6: unicafe step 1

1.7: unicafe step 2

1.8: unicafe step 3

1.9: unicafe step 4

1.10: unicafe step 5

1.11*: unicafe step 6

1.12*: anecdotes step 1

1.13*: anecdotes step 2

1.14*: anecdotes step 3
