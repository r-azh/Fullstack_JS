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
