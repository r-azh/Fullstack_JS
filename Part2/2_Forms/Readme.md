# Forms
Let's continue expanding our application by allowing users to add new notes. You can find the code for our current application [here](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-1).

## Saving the notes in the component state
To get our page to update when new notes are added it's best to store the notes in the App component's state. Let's import the useState function and use it to define a piece of state that gets initialized with the initial notes array passed in the props.

We have added the addNote function as an event handler to the form element that will be called when the form is submitted, by clicking the submit button.
```js
const addNote = (event) => {
  event.preventDefault()
  console.log('button clicked', event.target)
}
```
The event parameter is the event that triggers the call to the event handler function:

The event handler immediately calls the event.preventDefault() method, which prevents the default action of submitting a form. The default action would, among other things, cause the page to reload.

The target of the event stored in event.target is logged to the console
The target in this case is the form that we have defined in our component.

## Controlled component
How do we access the data contained in the form's input element?
There are many ways to accomplish this; the first method we will take a look at is through the use of so-called [controlled components](https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable).

Let's add a new piece of state called newNote for storing the user-submitted input and let's set it as the input element's value attribute:
```js
const App = (props) => {
  const [notes, setNotes] = useState(props.notes)

  const [newNote, setNewNote] = useState(
    'a new note...'
  ) 

  const addNote = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
  }

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map(note => 
          <Note key={note.id} note={note} />
        )}
      </ul>
      <form onSubmit={addNote}>

        <input value={newNote} />
        <button type="submit">save</button>
      </form>   
    </div>
  )
}
```
Since we assigned a piece of the App component's state as the value attribute of the input element, the App component now controls the behavior of the input element.

To enable editing of the input element, we have to register an event handler that synchronizes the changes made to the input with the component's state:

```js
  const handleNoteChange = (event) => {    console.log(event.target.value)    setNewNote(event.target.value)  }
  ...

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange}        />
        <button type="submit">save</button>
      </form>   

```
The target property of the event object now corresponds to the controlled input element, and event.target.value refers to the input value of that element.

Note that we did not need to call the event.preventDefault() method like we did in the onSubmit event handler. This is because no default action occurs on an input change, unlike a form submission.


You can directly view how the state changes from the React Devtools tab

```js
setNotes(notes.concat(noteObject))
```
The method does not mutate the original notes array, but rather creates a new copy of the array with the new item added to the end. This is important since we must never mutate state directly in React!

You can find the code for our current application in its entirety in the part2-2 branch of [this GitHub repository](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-2).

## Filtering Displayed Elements


Let's add some new functionality to our application that allows us to only view the important notes.

Let's add a piece of state to the App component that keeps track of which notes should be displayed:

```js
  const [showAll, setShowAll] = useState(true)
  ...
  const notesToShow = showAll    ? notes    : notes.filter(note => note.important === true)
```

[conditional operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator)
```js
const result = condition ? val1 : val2
```
the result variable will be set to the value of val1 if condition is true. If condition is false, the result variable will be set to the value ofval2.


### [Comparision](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)

We showed the comparison operator first to emphasize an important detail: in JavaScript val1 == val2 does not always work as expected. When performing comparisons, it's therefore safer to exclusively use val1 === val2. You can read more about the topic here.


You can find the code for our current application in its entirety in the part2-3 branch of [this GitHub repository](https://github.com/fullstack-hy2020/part2-notes-frontend/tree/part2-3).

## Exercises 2.6.-2.10.

2.6: The Phonebook Step 1

2.7: The Phonebook Step 2

2.8: The Phonebook Step 3

2.9*: The Phonebook Step 4

2.10: The Phonebook Step 5
