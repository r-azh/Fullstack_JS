# [Exercises 6.1.-6.2.](https://fullstackopen.com/en/part6/flux_architecture_and_redux#exercises-6-1-6-2)

Let's make a simplified version of the unicafe exercise from part 1. Let's handle the state management with Redux.

You can take the code from this repository <https://github.com/fullstack-hy2020/unicafe-redux> for the base of your project.

_Start by removing the git configuration of the cloned repository, and by installing dependencies_

```bash
cd unicafe-redux   // go to the directory of cloned repository
rm -rf .git
npm install
```

## 6.1: Unicafe Revisited, step 1

Before implementing the functionality of the UI, let's implement the functionality required by the store.

We have to save the number of each kind of feedback to the store, so the form of the state in the store is:

```js
{
  good: 5,
  ok: 4,
  bad: 2
}
```

The project has the following base for a reducer:

```js
// src/reducers/reducer.js
const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

const counterReducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case 'GOOD':
      return state
    case 'OK':
      return state
    case 'BAD':
      return state
    case 'RESET':
      return state
    default:
      return state
  }
}

export default counterReducer
```

and a base for its tests

```js
// src/reducers/reducer.test.js
import deepFreeze from 'deep-freeze'
import { describe, expect, test } from 'vitest'
import counterReducer from './reducer'

describe('unicafe reducer', () => {
  const initialState = {
    good: 0,
    ok: 0,
    bad: 0
  }

  test('should return a proper initial state when called with undefined state', () => {
    const action = {
      type: 'DO_NOTHING'
    }

    const newState = counterReducer(undefined, action)
    expect(newState).toEqual(initialState)
  })

  test('good is incremented', () => {
    const action = {
      type: 'GOOD'
    }
    const state = initialState

    deepFreeze(state)
    const newState = counterReducer(state, action)
    expect(newState).toEqual({
      good: 1,
      ok: 0,
      bad: 0
    })
  })
})
```

**Implement the reducer and its tests.**

The provided first test should pass without any changes. Redux expects that the reducer returns the original state when it is called with a first parameter - which represents the previous _state_ - with the value _undefined_.

Start by expanding the reducer so that both tests pass. After that, add the remaining tests for the different actions of the reducer and implement the corresponding functionality in the reducer.

In the tests, make sure that the reducer is an _immutable function_ with the _deep-freeze_ library. A good model for the reducer is the redux-notes example above.

**Details:**
- Implement reducer for feedback counter
- State shape: `{ good: 5, ok: 4, bad: 2 }`
- Actions: `GOOD`, `OK`, `BAD`, `RESET`
- Write tests using deep-freeze
- Ensure reducer is immutable

## 6.2: Unicafe Revisited, step 2

Now implement the actual functionality of the application.

Your application can have a modest appearance, nothing else is needed but buttons and the number of reviews for each type:

**Details:**
- Implement UI for feedback application
- Buttons for good, ok, bad
- Display counts for each type
- Reset button

# [Exercises 6.3.-6.8.](https://fullstackopen.com/en/part6/flux_architecture_and_redux#exercises-6-3-6-8)

Let's make a new version of the anecdote voting application from part 1. Take the project from this repository <https://github.com/fullstack-hy2020/redux-anecdotes> as the base of your solution.

If you clone the project into an existing git repository, _remove the git configuration of the cloned application:_

```bash
cd redux-anecdotes  // go to the cloned repository
rm -rf .git
```

The application can be started as usual, but you have to install the dependencies first:

```bash
npm install
npm run dev
```

After completing these exercises, your application should look like this:

## 6.3: Anecdotes, step 1

Implement the functionality for voting anecdotes. The number of votes must be saved to a Redux store.

**Details:**
- Implement voting functionality
- Votes saved to Redux store
- Clone redux-anecdotes repository

## 6.4: Anecdotes, step 2

Implement the functionality for adding new anecdotes.

You can keep the form uncontrolled like we did earlier.

**Details:**
- Implement adding new anecdotes
- Use uncontrolled form

## 6.5: Anecdotes, step 3

Make sure that the anecdotes are ordered by the number of votes.

**Details:**
- Order anecdotes by number of votes
- Most votes first

## 6.6: Anecdotes, step 4

If you haven't done so already, separate the creation of action-objects to action creator-functions and place them in the _src/reducers/anecdoteReducer.js_ file, so do what we have been doing since the chapter action creators.

**Details:**
- Separate action creators into functions
- Place in `src/reducers/anecdoteReducer.js`

## 6.7: Anecdotes, step 5

Separate the creation of new anecdotes into a component called _AnecdoteForm_. Move all logic for creating a new anecdote into this new component.

**Details:**
- Separate new anecdote creation into `AnecdoteForm` component
- Move all creation logic to this component

## 6.8: Anecdotes, step 6

Separate the rendering of the anecdote list into a component called _AnecdoteList_. Move all logic related to voting for an anecdote to this new component.

**Details:**
- Separate anecdote list into `AnecdoteList` component
- Move voting logic to this component
- App should only render `AnecdoteForm` and `AnecdoteList`

Now the _App_ component should look like this:

```js
// src/App.jsx
import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'

const App = () => {
  return (
    <div>
      <h2>Anecdotes</h2>
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App
```

# [Exercise 6.9.](https://fullstackopen.com/en/part6/many_reducers#exercise-6-9)

## 6.9: Anecdotes, step 7

Implement filtering for the anecdotes that are displayed to the user.

Store the state of the filter in the redux store. It is recommended to create a new reducer, action creators, and a combined reducer for the store using the _combineReducers_ function.

Create a new _Filter_ component for displaying the filter. You can use the following code as a template for the component:

**Details:**
- Implement filtering for anecdotes
- Store filter state in Redux store
- Create new reducer, action creators, and combined reducer
- Create Filter component with input field
- Filter anecdotes based on input

```js
// src/components/Filter.jsx
const Filter = () => {
  const handleChange = (event) => {
    // input-field value is in variable event.target.value
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default Filter
```

# [Exercises 6.10.-6.13.](https://fullstackopen.com/en/part6/many_reducers#exercises-6-10-6-13)

Let's continue working on the anecdote application using Redux that we started in exercise 6.3.

## 6.10: Anecdotes, step 8

Install Redux Toolkit for the project. Move the Redux store creation into the file _store.js_ and use Redux Toolkit's _configureStore_ to create the store.

Change the definition of the _filter reducer and action creators_ to use the Redux Toolkit's _createSlice_ function.

Also, start using Redux DevTools to debug the application's state easier.

**Details:**
- Install Redux Toolkit
- Move store creation to `store.js`
- Use `configureStore` instead of `createStore`
- Change filter reducer to use `createSlice`
- Start using Redux DevTools

## 6.11: Anecdotes, step 9

Change also the definition of the _anecdote reducer and action creators_ to use the Redux Toolkit's _createSlice_ function.

**Details:**
- Change anecdote reducer to use `createSlice`
- Update action creators
- Update tests if needed

## 6.12: Anecdotes, step 10

The application has a ready-made body for the _Notification_ component:

```js
// src/components/Notification.jsx
const Notification = () => {
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

  return (
    <div style={style}>
      render here notification...
    </div>
  )
}

export default Notification
```

Extend the component so that it renders the message stored in the Redux store. Create a separate reducer for the new functionality by using the Redux Toolkit's _createSlice_ function.

The application does not have to use the _Notification_ component intelligently at this point in the exercises. It is enough for the application to display the initial value set for the message in the _notificationReducer_.

**Details:**
- Extend Notification component to render message from Redux store
- Create notificationReducer using `createSlice`
- Store initial message in reducer
- Component doesn't need to be smart yet, just display initial value

## 6.13: Anecdotes, step 11

Extend the application so that it uses the _Notification_ component to display a message for five seconds when the user votes for an anecdote or creates a new anecdote:

It's recommended to create separate action creators for setting and removing notifications.

**Details:**
- Use Notification component to display message for 5 seconds
- Show message when voting for anecdote
- Show message when creating new anecdote
- Create action creators for setting and removing notifications
- Use setTimeout to remove notification after 5 seconds

# [Exercises 6.14.-6.15.](https://fullstackopen.com/en/part6/communicating_with_server_in_a_redux_application#exercises-6-14-6-15)

## 6.14: Anecdotes and the Backend, step 1

When the application launches, fetch the anecdotes from the backend implemented using json-server. Use the Fetch API to make the HTTP request.

As the initial backend data, you can use, e.g. this.

**Details:**
- Fetch anecdotes from json-server on app launch
- Use Fetch API for HTTP requests
- Initialize Redux store with server data

## 6.15: Anecdotes and the Backend, step 2

Modify the creation of new anecdotes, so that the anecdotes are stored in the backend. Utilize the Fetch API in your implementation once again.

**Details:**
- Modify anecdote creation to save to backend
- Use Fetch API for POST requests
- Update reducer to use server-returned data

# [Exercises 6.16.-6.19.](https://fullstackopen.com/en/part6/communicating_with_server_in_a_redux_application#exercises-6-16-6-19)

## 6.16: Anecdotes and the Backend, step 3

Modify the initialization of the Redux store to happen using asynchronous action creators, which are made possible by the Redux Thunk library.

**Details:**
- Use Redux Thunk for async actions
- Create `initializeAnecdotes` async action creator
- Move server communication out of components

## 6.17: Anecdotes and the Backend, step 4

Also modify the creation of a new anecdote to happen using asynchronous action creators, made possible by the Redux Thunk library.

**Details:**
- Create `appendAnecdote` async action creator
- Move anecdote creation logic to reducer
- Update component to use async action

## 6.18: Anecdotes and the Backend, step 5

Voting does not yet save changes to the backend. Fix the situation with the help of the Redux Thunk library and the Fetch API.

**Details:**
- Implement voting that saves to backend
- Create `updateAnecdote` service method
- Create async action creator for voting
- Use PUT/PATCH request to update backend

## 6.19: Anecdotes and the Backend, step 6

The creation of notifications is still a bit tedious since one has to do two actions and use the _setTimeout_ function:

```js
// src/components/AnecdoteList.jsx or similar
dispatch(setNotification(`new anecdote '${content}'`))
setTimeout(() => {
  dispatch(clearNotification())
}, 5000)
```

Make an action creator, which enables one to provide the notification as follows:

```js
// src/reducers/notificationReducer.js
dispatch(setNotification(`you voted '${anecdote.content}'`, 10))
```

The first parameter is the text to be rendered and the second parameter is the time to display the notification given in seconds.

Implement the use of this improved notification in your application.

**Details:**
- Improve notification action creator
- Accept message and timeout as parameters
- Automatically clear notification after timeout
- Replace manual `setTimeout` calls

# [Exercises 6.20.-6.22.](https://fullstackopen.com/en/part6/react_query_use_reducer_and_the_context#exercises-6-20-6-22)

Now let's make a new version of the anecdote application that uses the React Query library. Take this project as your starting point. The project has a ready-installed JSON Server, the operation of which has been slightly modified (Review the _server.js_ file for more details. Make sure you're connecting to the correct _PORT_). Start the server with _npm run server_.

Use the Fetch API to make requests.

NOTE: Part 6 was updated on 12th of October 2025 to use the Fetch API, which is introduced in part 6c. If you started working through this part before that date, you may still use Axios in the exercises if you prefer.

## 6.20: Anecdotes and React Query, step 1

Implement retrieving anecdotes from the server using React Query.

The application should work in such a way that if there are problems communicating with the server, only an error page will be displayed:

You can find here info how to detect the possible errors.

You can simulate a problem with the server by e.g. turning off the JSON Server. Please note that in a problem situation, the query is first in the state _isLoading_ for a while, because if a request fails, React Query tries the request a few times before it states that the request is not successful. You can optionally specify that no retries are made:

```js
// src/App.jsx
const result = useQuery(
  {
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: false
  }
)
```

or that the request is retried e.g. only once:

```js
// src/App.jsx
const result = useQuery(
  {
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1
  }
)
```

**Details:**
- Implement retrieving anecdotes using React Query
- Display error page if server communication fails
- Handle loading and error states
- Configure retry behavior

## 6.21: Anecdotes and React Query, step 2

Implement adding new anecdotes to the server using React Query. The application should render a new anecdote by default. Note that the content of the anecdote must be at least 5 characters long, otherwise the server will reject the POST request. You don't have to worry about error handling now.

**Details:**
- Implement adding new anecdotes using React Query
- Use mutations for POST requests
- Invalidate queries after successful mutation
- Note: Server requires content >= 5 characters

## 6.22: Anecdotes and React Query, step 3

Implement voting for anecdotes using again the React Query. The application should automatically render the increased number of votes for the voted anecdote.

**Details:**
- Implement voting using React Query
- Use mutations for PUT requests
- Automatically update vote count
- Invalidate queries after voting

# [Exercises 6.23.-6.24.](https://fullstackopen.com/en/part6/react_query_use_reducer_and_the_context#exercises-6-23-6-24)

## 6.23: Anecdotes and Context, step 1

The application has a _Notification_ component for displaying notifications to the user.

Implement the application's notification state management using the useReducer hook and context. The notification should tell the user when a new anecdote is created or an anecdote is voted on:

The notification is displayed for five seconds.

**Details:**
- Implement notification state with useReducer
- Create NotificationContext
- Display notifications for 5 seconds
- Show notification when creating or voting

## 6.24: Anecdotes and Context, step 2

As stated in exercise 6.21, the server requires that the content of the anecdote to be added is at least 5 characters long. Now implement error handling for the insertion. In practice, it is sufficient to display a notification to the user in case of a failed POST request:

The error condition should be handled in the callback function registered for it, see here how to register a function.

This was the last exercise for this part of the course and it's time to push your code to GitHub and mark all of your completed exercises to the exercise submission system.

**Details:**
- Add error handling for POST requests
- Display error notification if content < 5 characters
- Handle mutation errors in onError callback
- Show user-friendly error messages
