# [Part1-1 Excercises](https://fullstackopen.com/en/part1/introduction_to_react#exercises-1-1-1-2)

## 1.1 : Course Information, step 1

Use Vite to initialize a new application. 

```shell
# npm 7+, extra double-dash is needed:
npm create vite@latest course_information -- --template react
```

Modify main.jsx to match the code:
```js
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
```

and App.jsx as:
```js
const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <h1>{course}</h1>
      <p>
        {part1} {exercises1}
      </p>
      <p>
        {part2} {exercises2}
      </p>
      <p>
        {part3} {exercises3}
      </p>
      <p>Number of exercises {exercises1 + exercises2 + exercises3}</p>
    </div>
  )
}

export default App
```

and remove the extra files App.css and index.css, also remove the directory assets.

```shell
cd /Users/rezvan.aj/Repository/My/learn/Fullstack_JS/Part1/excercise/course_information
npm run dev
```

Unfortunately, the entire application is in the same component. Refactor the code so that it consists of three new components: Header, Content, and Total. All data still resides in the App component, which passes the necessary data to each component using props. Header takes care of rendering the name of the course, Content renders the parts and their number of exercises and Total renders the total number of exercises.

Define the new components in the file App.jsx.

The App component's body will approximately be as follows:
```js
const App = () => {
  // const-definitions

  return (
    <div>
      <Header course={course} />
      <Content ... />
      <Total ... />
    </div>
  )
}
```


### WARNING Don't try to program all the components concurrently, because that will almost certainly break down the whole app. Proceed in small steps, first make e.g. the component Header and only when it works for sure, you could proceed to the next component.

Careful, small-step progress may seem slow, but it is actually by far the fastest way to progress. Famous software developer Robert "Uncle Bob" Martin has stated

    "The only way to go fast, is to go well"

that is, according to Martin, careful progress with small steps is even the only way to be fast



## 1.2: Course Information, step 2
Refactor the Content component so that it does not render any names of parts or their number of exercises by itself. Instead, it only renders three Part components of which each renders the name and number of exercises of one part.
```js
const Content = ... {
  return (
    <div>
      <Part .../>
      <Part .../>
      <Part .../>
    </div>
  )
}
```


# [Part 1-2 Excercises](https://fullstackopen.com/en/part1/java_script#exercises-1-3-1-5)

## 1.3: Course Information step 3
Modify the variable definitions of the App component as follows and also refactor the application so that it still works:
```js
const App = () => {
  const course = 'Half Stack application development'
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 14
  }

  return (
    <div>
      ...
    </div>
  )
}
```

## 1.4: Course Information step 4
Place the objects into an array. Modify the variable definitions of App into the following form and modify the other parts of the application accordingly:
```js
const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]

  return (
    <div>
      ...
    </div>
  )
}
```
No need to iterate for now however, do not pass different objects as separate props from the App component to the components Content and Total. Instead, pass them directly as an array:
```js
const App = () => {
  // const definitions

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}
```

## 1.5: Course Information step 5

Let's take the changes one step further. Change the course and its parts into a single JavaScript object. Fix everything that breaks.
```js
const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      ...
    </div>
  )
}
```

## 1.6: unicafe step 1

Your task is to implement a web application for collecting customer feedback. There are only three options for feedback: good, neutral, and bad.

The application must display the total number of collected feedback for each category.

```shell
npm create vite@latest unicaf -- --template react
```

# 1.7: unicafe step 2

Expand your application so that it shows more statistics about the gathered feedback: the total number of collected feedback, the average score (the feedback values are: good 1, neutral 0, bad -1) and the percentage of positive feedback.

# 1.8: unicafe step 3

Refactor your application so that displaying the statistics is extracted into its own Statistics component. The state of the application should remain in the App root component.

Remember that components should not be defined inside other components:

1.9: unicafe step 4

Change your application to display statistics only once feedback has been gathered.

1.10: unicafe step 5

Let's continue refactoring the application. Extract the following two components:

    Button handles the functionality of each feedback submission button.
    StatisticLine for displaying a single statistic, e.g. the average score.

To be clear: the StatisticLine component always displays a single statistic, meaning that the application uses multiple components for rendering all of the statistics:

The application's state should still be kept in the root App component.
