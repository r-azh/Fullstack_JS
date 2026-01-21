import { useState, useEffect } from 'react'
import { Routes, Route, Link, useMatch, Navigate } from 'react-router-dom'
import { Container, Alert, Navbar, Nav } from 'react-bootstrap'
import Note from './pages/Note'
import Notes from './pages/Notes'
import Users from './pages/Users'
import Login from './pages/Login'
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

  const padding = {
    padding: 5
  }

  return (
    <Container>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#" as="span">
              <Link style={padding} to="/">home</Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <Link style={padding} to="/notes">notes</Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              <Link style={padding} to="/users">users</Link>
            </Nav.Link>
            <Nav.Link href="#" as="span">
              {user
                ? <em style={padding}>{user} logged in</em>
                : <Link style={padding} to="/login">login</Link>
              }
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {message && (
        <Alert variant="success">
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
