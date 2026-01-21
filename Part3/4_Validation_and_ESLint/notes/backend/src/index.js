const express = require('express')
const { requestLogger, unknownEndpoint, errorHandler } = require('./middleware')

const app = express()
const cors = require('cors')

require('dotenv').config()
const PORT = process.env.PORT

const Note = require('./models/note')

app.use(cors())

app.use(express.static('dist'))

app.use(express.json())

app.use(requestLogger)

// const mongoose = require('mongoose')

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
// const password = process.argv[2]
// console.log(password)
// const databaseName = 'notesApp'
// const url = `mongodb+srv://fullstack:${password}@cluster0.oshkocc.mongodb.net/${databaseName}?retryWrites=true&w=majority&appName=Cluster0`

// mongoose.set('strictQuery',false)
// mongoose.connect(url, { family: 4 })

// const noteSchema = new mongoose.Schema({
//   content: String,
//   important: Boolean,
// })
// Even though the _id property of Mongoose objects looks like a string, it is in fact an object. The toJSON method we defined transforms it into a string just to be safe. 
// noteSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString()
//     delete returnedObject._id
//     delete returnedObject.__v
//   }
// })

// const Note = mongoose.model('Note', noteSchema)


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})


app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response, next) => {
  const id = request.params.id
  console.log(id)
  const note = Note.findById(id)
    .then(note => {
      if (note) {
        console.log('note', note)
        response.json(note)
      } else {
        console.log('note not found')
        response.status(404).end()
      }
    })
    .catch(error => {
      // console.log(error)
      // response.status(500).end()
      // response.status(400).send({ error: 'malformatted id' })
      next(error)
  })
})

app.delete('/api/notes/:id', (request, response, next) => { 
  const id = request.params.id
  console.log('id', id)
  // const note = Note.findById(id)
  //   .then(note => {
  //     if (note) {
  //       console.log('note', note)
  //       response.json(note)
  //     } else {
  //       console.log('note not found')
  //       response.status(404).end()
  //     }
  //   })
  //   .catch(error => {
  //     // console.log(error)
  //     // response.status(500).end()
  //     // response.status(400).send({ error: 'malformatted id' })
  //     next(error)
  // })
  // notes = Note.FindById(id).then(note => {
    // note.deleteOne().then(response.status(204).end())
  Note.findByIdAndDelete(request.params.id)
    .then(result => {
      console.log('result', result)
      response.status(204).end()
    })
    .catch(error => 
      {
        console.log('error', error)
        next(error)
      })
})

app.post('/api/notes', (request, response, next) => {
  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false
  })

  console.log(note)
  note.save().then(savedNote => {
    response.json(savedNote)
  })
  .catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
  const { content, important } = request.body
  const id = request.params.id
  Note.findById(id)
    .then(note => {
      if (!note) {
        return response.status(404).end()
      }
      note.content = content
      note.important = important
      return note.save().then((updatedNote) => {
        response.json(updatedNote)
      })
    })
    .catch(error => next(error))  
})

// This middleware will be used for catching requests made to non-existent routes. 
app.use(unknownEndpoint)

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)


// const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
