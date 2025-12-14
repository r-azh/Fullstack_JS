import { useState, useEffect } from 'react'
import Note from './components/Note'
import axios from 'axios'
import notesService from './services/notes'
import './index.css'
import Notification from './components/Notification'
import Footer from './components/Footer'



function App() {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState(
    'a new note...'
  ) 
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  //Effect hook to fetch the notes from the server
  useEffect(() => {
    console.log('effect')
    notesService
    .getAll()
    .then(initialNotes => {
      console.log('promise fulfilled')
      setNotes(initialNotes)
    })
  }, [])

  console.log('render ', notes.length, ' notes')

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
      // id: String(notes.length + 1),
    }

    notesService
      .create(noteObject)
      .then(createdNote => {
        console.log('note created in server')
        console.log(createdNote)
        //creates a new copy of the array with the new item added to the end
        setNotes(notes.concat(createdNote))
        setNewNote('')
    })
  }

  const toggleImportanceOf = (id) => {
    // console.log('importance of ' + id + ' needs to be toggled')
    const note = notes.find(n => n.id === id)
    //create a new object that is an exact copy of the old note, apart from the important property that has the value flipped
    const changedNote = { ...note, important: !note.important }

    notesService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id === id ? returnedNote : note))
      })
      .catch(error => {
        setErrorMessage(
          `the note '${note.content}' was already deleted from server`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }
  const notesToShow = showAll ? notes : notes.filter((note) => note.important)
  console.log('notesToShow', notesToShow)
  
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all' }
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
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
      <Footer />
    </div>
  )
}

export default App
