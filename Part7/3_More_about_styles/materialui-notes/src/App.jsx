import { useState, useEffect } from 'react'
import { Routes, Route, useMatch, Navigate } from 'react-router-dom'
import { Container, Alert, AppBar, Toolbar, Button } from '@mui/material'
import Note from './pages/Note'
import Notes from './pages/Notes'
import Users from './pages/Users'
import Login from './pages/Login'
import { Link } from 'react-router-dom'
import noteService from './services/notes'

const App = () => {
  const [notes, setNotes] = useState([])
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    noteService.getAll().then(notes => setNotes(notes))
  }, [])

  const match = useMatch('/notes/:id')
  const note = match
    ? notes.find(n => n.id === Number(match.params.id))
    : null

  const login = (user) => {
    setUser(user)
    setMessage(`welcome ${user}`)
    setTimeout(() => {
      setMessage(null)
    }, 10000)
  }

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">
            home
          </Button>
          <Button color="inherit" component={Link} to="/notes">
            notes
          </Button>
          <Button color="inherit" component={Link} to="/users">
            users
          </Button>
          {user
            ? <em>{user} logged in</em>
            : <Button color="inherit" component={Link} to="/login">
                login
              </Button>
          }
        </Toolbar>
      </AppBar>

      {message && (
        <Alert severity="success">
          {message}
        </Alert>
      )}

      <Routes>
        <Route path="/notes/:id" element={<Note note={note} />} />
        <Route path="/notes" element={<Notes notes={notes} />} />
        <Route
          path="/users"
          element={user ? <Users /> : <Navigate replace to="/login" />}
        />
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="/" element={<div><h2>Home</h2></div>} />
      </Routes>
    </Container>
  )
}

export default App
