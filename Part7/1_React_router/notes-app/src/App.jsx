import { useState, useEffect } from 'react'
import { Routes, Route, Link, useMatch, Navigate } from 'react-router-dom'
import Note from './pages/Note'
import Notes from './pages/Notes'
import Users from './pages/Users'
import Login from './pages/Login'
import noteService from './services/notes'

const App = () => {
  const [notes, setNotes] = useState([])
  const [user, setUser] = useState(null)

  useEffect(() => {
    noteService.getAll().then(notes => setNotes(notes))
  }, [])

  const match = useMatch('/notes/:id')
  const note = match
    ? notes.find(n => n.id === Number(match.params.id))
    : null

  return (
    <div>
      <div>
        <Link to="/">home</Link>
        <Link to="/notes">notes</Link>
        <Link to="/users">users</Link>
        {user
          ? <em>{user} logged in</em>
          : <Link to="/login">login</Link>
        }
      </div>

      <Routes>
        <Route path="/notes/:id" element={<Note note={note} />} />
        <Route path="/notes" element={<Notes notes={notes} />} />
        <Route
          path="/users"
          element={user ? <Users /> : <Navigate replace to="/login" />}
        />
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route path="/" element={<div><h2>Home</h2></div>} />
      </Routes>
    </div>
  )
}

export default App
