# Validation and ESLint

There are usually constraints that we want to apply to the data that is stored in our application's database. Our application shouldn't accept notes that have a missing or empty content property. The validity of the note is checked in the route handler:
```js
app.post('/api/notes', (request, response) => {
  const body = request.body
  if (!body.content) {    return response.status(400).json({ error: 'content missing' })  }
  // ...
})
```
If the note does not have the content property, we respond to the request with the status code 400 bad request.

One smarter way of validating the format of the data before it is stored in the database is to use the [validation](https://mongoosejs.com/docs/validation.html) functionality available in Mongoose.

We can define specific validation rules for each field in the schema:
```js
const noteSchema = new mongoose.Schema({
  content: {    type: String,    minLength: 5,    required: true  },  important: Boolean
})
```
The content field is now required to be at least five characters long and it is set as required, meaning that it can not be missing. We have not added any constraints to the important field, so its definition in the schema has not changed.

The minLength and required validators are [built-in](https://mongoosejs.com/docs/validation.html#built-in-validators) and provided by Mongoose. The Mongoose [custom validator](https://mongoosejs.com/docs/validation.html#custom-validators) functionality allows us to create new validators if none of the built-in ones cover our needs.

If we try to store an object in the database that breaks one of the constraints, the operation will throw an exception. Let's change our handler for creating a new note so that it passes any potential exceptions to the error handler middleware:
```js
app.post('/api/notes', (request, response, next) => {  const body = request.body

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save()
    .then(savedNote => {
      response.json(savedNote)
    })
    .catch(error => next(error))})
```
Let's expand the error handler to deal with these validation errors:
```js
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {    return response.status(400).json({ error: error.message })  }

  next(error)
}
```
When validating an object fails, we return the following default error message from Mongoose

## Deploying the database backend to production

The application should work almost as-is in Fly.io/Render. We do not have to generate a new production build of the frontend since changes thus far were only on our backend.

The environment variables defined in dotenv will only be used when the backend is not in production mode, i.e. Fly.io or Render.

For production, we have to set the database URL in the service that is hosting our app.

When the app is being developed, it is more than likely that something fails. Eg. when I deployed my app for the first time with the database, not a single note was seen:

The browser console has to be open all the time!

It is also vital to follow continuously the server logs. 

When using Render, the database url is given by defining the proper env in the dashboard:

In render change the root directory from:
```
Part3/2_Deploy_the_app/notes/backend/
```
to
```
Part3/3_Saving_data_to_MongoDB/notes/backend/
```
