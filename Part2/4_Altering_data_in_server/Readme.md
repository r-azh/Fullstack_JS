# Altering data in server

The [json-server package](https://github.com/typicode/json-server) claims to be a so-called REST or RESTful API in its documentation:

    Get a full fake REST API with zero coding in less than 30 seconds (seriously)

The json-server does not exactly match the description provided by the textbook definition of a REST API, but neither do most other APIs claiming to be RESTful.

## REST

## Sending Data to the Server


Let's make the following changes to the event handler responsible for creating a new note:
```js
const addNote = event => {
  event.preventDefault()
  const noteObject = {
    content: newNote,
    important: Math.random() < 0.5,
  }


  axios
    .post('http://localhost:3001/notes', noteObject)
    .then(response => {
      console.log(response)
    })
}
```
We create a new object for the note but omit the id property since it's better to let the server generate ids for our resources.

The newly created note resource is stored in the value of the data property of the response object.

Quite often it is useful to inspect HTTP requests in the Network tab of Chrome developer tools, which was used heavily at the beginning of part 0.


Since the data we sent in the POST request was a JavaScript object, axios automatically knew to set the appropriate application/json value for the Content-Type header.

It's beneficial to inspect the state of the backend server, e.g. through the browser:

The code for the current state of our application can be found in the part2-5 branch on [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-5).


## Changing the Importance of Notes
We make the following changes to the Note component:
```js
const Note = ({ note, toggleImportance }) => {
  const label = note.important
    ? 'make not important' : 'make important'

  return (
    <li>
      {note.content} 
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}
```
We add a button to the component and assign its event handler as the toggleImportance function passed in the component's props.

The App component defines an initial version of the toggleImportanceOf event handler function and passes it to every Note component:

```js
const App = () => {
  const [notes, setNotes] = useState([]) 
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)

  // ...


  const toggleImportanceOf = (id) => {
    console.log('importance of ' + id + ' needs to be toggled')
  }

  // ...

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>      
      <ul>
        {notesToShow.map(note => 
          <Note
            key={note.id}
            note={note} 

            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>
      // ...
    </div>
  )
}
```
The template string syntax added in ES6 can be used to write similar strings in a much nicer way:
```js
console.log(`importance of ${id} needs to be toggled`)
```

We can now use the "dollar-bracket"-syntax to add parts to the string that will evaluate JavaScript expressions, e.g. the value of a variable. Note that we use backticks in template strings instead of quotation marks used in regular JavaScript strings.

Individual notes stored in the json-server backend can be modified in two different ways by making HTTP requests to the note's unique URL. We can either replace the entire note with an HTTP PUT request or only change some of the note's properties with an HTTP PATCH request.

The final form of the event handler function is the following:

```js
const toggleImportanceOf = id => {
  const url = `http://localhost:3001/notes/${id}`
  const note = notes.find(n => n.id === id)
  const changedNote = { ...note, important: !note.important }

  axios.put(url, changedNote).then(response => {
    setNotes(notes.map(note => note.id === id ? response.data : note))
  })
}
```

The code for creating the new object that uses the object spread syntax may seem a bit strange at first:
```js
const changedNote = { ...note, important: !note.important }
```
In practice, { ...note } creates a new object with copies of all the properties from the note object. When we add properties inside the curly braces after the spread object, e.g. { ...note, important: true }, then the value of the important property of the new object will be true. In our example, the important property gets the negation of its previous value in the original object.

There are a few things to point out. Why did we make a copy of the note object we wanted to modify when the following code also appears to work?
```js
const note = notes.find(n => n.id === id)
note.important = !note.important

axios.put(url, note).then(response => {
  // ...
```

This is not recommended because the variable note is a reference to an item in the notes array in the component's state, and as we recall we must never mutate state directly in React.

It's also worth noting that the new object changedNote is only a so-called shallow copy, meaning that the values of the new object are the same as the values of the old object. If the values of the old object were objects themselves, then the copied values in the new object would reference the same objects that were in the old object.

The map method creates a new array by mapping every item from the old array into an item in the new array. In our example, the new array is created conditionally so that if note.id === id is true; the note object returned by the server is added to the array. If the condition is false, then we simply copy the item from the old array into the new array instead.

This map trick may seem a bit strange at first, but it's worth spending some time wrapping your head around it. 

## Extracting Communication with the Backend into a Separate Module



The App component has become somewhat bloated after adding the code for communicating with the backend server. In the spirit of the single responsibility principle, we deem it wise to extract this communication into its own module.

Let's create a src/services directory and add a file there called notes.js
```js
import axios from 'axios'
const baseUrl = 'http://localhost:3001/notes'

const getAll = () => {
  return axios.get(baseUrl)
}

const create = newObject => {
  return axios.post(baseUrl, newObject)
}

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject)
}

export default { 
  getAll: getAll, 
  create: create, 
  update: update 
}
```
or implement like this:
```js
import axios from 'axios'
const baseUrl = 'http://localhost:3001/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newObject => {
  const request = axios.post(baseUrl, newObject)
  return request.then(response => response.data)
}

const update = (id, newObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newObject)
  return request.then(response => response.data)
}

export default { 
  getAll: getAll, 
  create: create, 
  update: update 
}
```
and use like this in app.jsx
```jsx
const App = () => {
  // ...

  useEffect(() => {
    noteService
      .getAll()

      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
      .update(id, changedNote)

      .then(returnedNote => {
        setNotes(notes.map(note => note.id === id ? returnedNote : note))
      })
  }

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5
    }

    noteService
      .create(noteObject)

      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  // ...
}
```

This is all quite complicated and attempting to explain it may just make it harder to understand. The internet is full of material discussing the topic, such as [this](https://javascript.info/promise-chaining) one.

The "Async and performance" book from the [You do not know JS book series](https://github.com/getify/You-Dont-Know-JS/tree/1st-ed) explains the [topic](https://github.com/getify/You-Dont-Know-JS/blob/1st-ed/async%20%26%20performance/ch3.md) well, but the explanation is many pages long.

Promises are central to modern JavaScript development and it is highly recommended to invest a reasonable amount of time into understanding them.


## Cleaner Syntax for Defining Object Literals
In notes.js
```js
{ 
  getAll: getAll, 
  create: create, 
  update: update 
}
```
The labels to the left of the colon in the object definition are the keys of the object, whereas the ones to the right of it are variables that are defined inside the module.

Since the names of the keys and the assigned variables are the same, we can write the object definition with a more compact syntax:

```js
{ 
  getAll, 
  create, 
  update 
}
```

In defining the object using this shorter notation, we make use of a new feature that was introduced to JavaScript through ES6, enabling a slightly more compact way of defining objects using variables.

To demonstrate this feature, let's consider a situation where we have the following values assigned to variables:
```js
const name = 'Leevi'
const age = 0
```
In older versions of JavaScript we had to define an object like this:
```js
const person = {
  name: name,
  age: age
}
```

However, since both the property fields and the variable names in the object are the same, it's enough to simply write the following in ES6 JavaScript:
```js
const person = { name, age }
```
The result is identical for both expressions. They both create an object with a name property with the value Leevi and an age property with the value 0.


## Promises and Errors

We had previously mentioned that a promise can be in one of three different states. When an axios HTTP request fails, the associated promise is rejected. Our current code does not handle this rejection in any way.

The rejection of a promise is [handled](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) by providing the then method with a second callback function, which is called in the situation where the promise is rejected.

The more common way of adding a handler for rejected promises is to use the [catch](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch) method.

In practice, the error handler for rejected promises is defined like this:
```js
axios
  .get('http://example.com/probably_will_fail')
  .then(response => {
    console.log('success!')
  })
  .catch(error => {
    console.log('fail')
  })
```

If the request fails, the event handler registered with the catch method gets called.

The catch method is often utilized by placing it deeper within the promise chain.

When multiple .then methods are chained together, we are in fact creating a [promise chain](https://javascript.info/promise-chaining):
```js
axios
  .get('http://...')
  .then(response => response.data)
  .then(data => {
    // ...
  })
```
The catch method can be used to define a handler function at the end of a promise chain, which is called once any promise in the chain throws an error and the promise becomes rejected.
```js
axios
  .get('http://...')
  .then(response => response.data)
  .then(data => {
    // ...
  })
  .catch(error => {
    console.log('fail')
  })
```
Let's take advantage of this feature. We will place our application's error handler in the App component:
```js
const toggleImportanceOf = id => {
  const note = notes.find(n => n.id === id)
  const changedNote = { ...note, important: !note.important }

  noteService
    .update(id, changedNote).then(returnedNote => {
      setNotes(notes.map(note => note.id === id ? returnedNote : note))
    })
    .catch(error => {
        alert(
            `the note '${note.content}' was already deleted from server`
            )
        setNotes(notes.filter(n => n.id !== id))
    })}
```
The error message is displayed to the user with the trusty old [alert](https://developer.mozilla.org/en-US/docs/Web/API/Window/alert) dialog popup, and the deleted note gets filtered out from the state.

Removing an already deleted note from the application's state is done with the array [filter](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) method, which returns a new array comprising only the items from the list for which the function that was passed as a parameter returns true for:
```js
notes.filter(n => n.id !== id)
```
It's probably not a good idea to use alert in more serious React applications. We will soon learn a more advanced way of displaying messages and notifications to users. There are situations, however, where a simple, battle-tested method like alert can function as a starting point. A more advanced method could always be added in later, given that there's time and energy for it.

The code for the current state of our application can be found in the part2-6 branch on [GitHub](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-6).

## Full stack developer's oath

To cope with the increasing complexity we should extend the web developer's oath to a Full stack developer's oath, which reminds us to make sure that the communication between frontend and backend happens as expected.

So here is the updated oath:

Full stack development is extremely hard, that is why I will use all the possible means to make it easier

    I will have my browser developer console open all the time
    
    I will use the network tab of the browser dev tools to ensure that frontend and backend are communicating as I expect
    
    I will constantly keep an eye on the state of the server to make sure that the data sent there by the frontend is saved there as I expect
    
    I will progress with small steps
    
    I will write lots of console.log statements to make sure I understand how the code behaves and to help pinpoint problems
    
    If my code does not work, I will not write more code. Instead, I start deleting the code until it works or just return to a state when everything was still working
    
    When I ask for help in the course Discord channel or elsewhere I formulate my questions properly, see here how to ask for help

## Exercises 2.12.-2.15.

2.12: The Phonebook step 7

2.13: The Phonebook step 8

2.14: The Phonebook step 9

2.15*: The Phonebook step 10
