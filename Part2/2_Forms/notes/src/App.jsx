import { useState } from 'react'
import Note from './components/Note'

function App(props) {
  const [notes, setNotes] = useState(props.notes)

  const [newNote, setNewNote] = useState(
    'a new note...'
  ) 

  const [showAll, setShowAll] = useState(true)
  const notesToShow = showAll ? notes: notes.filter(
    note => note.important // === true is optional, because boolean values are truthy or falsy
  )

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  //The event parameter is the event that triggers the call to the event handler function:
  const addNote = (event) => {
    // prevents the default action of submitting a form. The default action would, among other things, cause the page to reload.
    event.preventDefault()
    console.log('button clicked', event.target)
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
      id: String(notes.length + 1),
    }
    //creates a new copy of the array with the new item added to the end
    setNotes(notes.concat(noteObject))
    setNewNote('')
  }
  
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
          <Note key={note.id} note={note} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input 
          type="text"
          placeholder="Add a new note"
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default App
