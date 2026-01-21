import { useState, useEffect } from 'react'
import { Routes, Route, Link, useMatch, Navigate } from 'react-router-dom'
import styled from 'styled-components'
import Note from './pages/Note'
import Notes from './pages/Notes'
import Users from './pages/Users'
import Login from './pages/Login'
import noteService from './services/notes'

const Page = styled.div`
  padding: 1em;
  background: papayawhip;
`

const Navigation = styled.div`
  background: BurlyWood;
  padding: 1em;
`

const Footer = styled.div`
  background: Chocolate;
  padding: 1em;
  margin-top: 1em;
`

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

  const padding = {
    padding: 5
  }

  return (
    <Page>
      <Navigation>
        <Link style={padding} to="/">home</Link>
        <Link style={padding} to="/notes">notes</Link>
        <Link style={padding} to="/users">users</Link>
        {user
          ? <em>{user} logged in</em>
          : <Link style={padding} to="/login">login</Link>
        }
      </Navigation>

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

      <Footer>
        <em>Note app, Department of Computer Science 2022</em>
      </Footer>
    </Page>
  )
}

export default App
