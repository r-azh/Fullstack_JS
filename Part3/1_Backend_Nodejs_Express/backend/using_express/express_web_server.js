const express = require('express')
const { requestLogger, unknownEndpoint } = require('./middleware')

const app = express()

app.use(express.json())

app.use(requestLogger)


let notes = [
  { id: 1, content: 'HTML is easy', important: true },
  { id: 2, content: 'Browser can execute only JavaScript', important: false },
  { id: 3, content: 'GET and POST are the most important methods of HTTP protocol', important: true }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})


app.get('/api/notes', (request, response) => {
  response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  console.log(id)
  const note = notes.find(note => note.id === Number(id))
  console.log('note', note)
  if (note) {
    response.json(note)
  } else {
    // end method for responding to the request without sending any data.
    // response.status(404).end()
    response.status(404).send('Note not found')
  }
})

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter(note => note.id !== Number(id))
  console.log('notes', notes)
  response.status(204).end()
})


const generateId = () => {
  const maxId = notes.length > 0
  //? Math.max(...notes.map(n => Number(n.id))) // if the id was string
  ? Math.max(...notes.map(n => n.id)) 
  : 0
  return maxId + 1
}


app.post('/api/notes', (request, response) => {
  
  const body = request.body
  if (!body.content) {
    // Notice that calling return is crucial because otherwise the code will execute to the very end and the malformed note gets saved to the application.
    return response.status(400).json({
      error: 'content missing'
    })
  }
  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId()
  }

  console.log(note)
  notes = notes.concat(note)
  response.json(note)
})  

// This middleware will be used for catching requests made to non-existent routes. 
app.use(unknownEndpoint)


const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
