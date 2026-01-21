import { useState } from 'react'
import useResource from './hooks/useResource'
import NoteForm from './components/NoteForm'

const App = () => {
  const [notes, noteService] = useResource('http://localhost:3001/notes')
  const [persons, personService] = useResource('http://localhost:3001/persons')

  return (
    <div>
      <h2>notes</h2>
      <NoteForm createNote={noteService.create} />
      {notes.map(n => <p key={n.id}>{n.content}</p>)}

      <h2>persons</h2>
      {persons.map(p => <p key={p.id}>{p.name}</p>)}
    </div>
  )
}

export default App
