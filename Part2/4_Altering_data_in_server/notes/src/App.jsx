import { useState, useEffect } from 'react'
import Note from './components/Note'
import axios from 'axios'

function App() {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState(
    'a new note...'
  ) 
  const [showAll, setShowAll] = useState(true)
  const notesToShow = showAll ? notes: notes.filter(
    note => note.important // === true is optional, because boolean values are truthy or falsy
  )

  //Effect hook to fetch the notes from the server
  // useEffect(() => {
  //   console.log('effect')
  //   axios.get('http://localhost:3002/notes')
  //   .then(response => {
  //     console.log('promise fulfilled')
  //     setNotes(response.data)
  //   })
  // }, [])

  // or 

  const hook = () => {
    console.log('effect')
    axios
    .get('http://localhost:3002/notes')
    .then(response => {
      console.log('promise fulfilled')
      setNotes(response.data)
    })
  }
  useEffect(hook, [])

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

    axios
    .post('http://localhost:3002/notes', noteObject)
    .then(response => {
      console.log('note created in server')
      console.log(response)
      //creates a new copy of the array with the new item added to the end
      setNotes(notes.concat(response.data))
      setNewNote('')
    })
  }
  const toggleImportanceOf = (id) => {
    console.log('importance of ' + id + ' needs to be toggled')

    const url = `http://localhost:3002/notes/${id}`
    const note = notes.find(n => n.id === id)
    //create a new object that is an exact copy of the old note, apart from the important property that has the value flipped
    const changedNote = { ...note, important: !note.important }

    axios.put(url, changedNote).then(response => {
      setNotes(notes.map(note => note.id === id ? response.data : note))
    })
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
          <Note
           key={note.id}
           note={note} 
           toggleImportance={() => toggleImportanceOf(note.id)}
          />
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
