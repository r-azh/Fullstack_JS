# [Exercises 4.1.-4.2.](https://fullstackopen.com/en/part4/structure_of_backend_application_introduction_to_testing#exercises-4-1-4-2)

## 4.1: Blog list, step 1

Implement a Node application that returns a hardcoded list of blog posts. For now, the application will only need to return the JSON list of blog posts. For example, the list can look like the following:

```js
[
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/01/09/TypeWars.html",
    likes: 2,
    __v: 0
  }
]
```

The application should work with the following command:

```bash
npm start
```

The application must also provide an npm script called `npm run dev` that will run the application and restart the server whenever changes are made to the application code.

## 4.2: Blog list, step 2

Refactor the application into separate modules as shown earlier in this part of the course material.

**NB:** refactor your application in baby steps and verify that the application works after every change you make. If you try to take a "shortcut" by refactoring many things at once, then **Murphy's law** will kick in and it is almost certain that something will break in your application. The "shortcut" will end up taking more time than moving forward in small steps.

After refactoring, the structure of your project should be roughly the following:

```
├── index.js
├── app.js
├── controllers
│   └── blogs.js
├── models
│   └── blog.js
├── package.json
└── utils
    ├── config.js
    ├── logger.js
    └── middleware.js
```

# [Exercises 4.3.-4.7.](https://fullstackopen.com/en/part4/structure_of_backend_application_introduction_to_testing#exercises-4-3-4-7)

## 4.3: Helper functions and unit tests, step 1

Create a simple dummy function that receives an array of blog posts as a parameter and always returns the value 1. The contents of the `list_helper.js` file at this point should be the following:

```js
const dummy = (blogs) => {
  // ...
}

module.exports = {
  dummy
}
```

Verify that your test configuration works with the following test:

```js
const { test } = require('node:test')
const assert = require('node:assert')
const { dummy } = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = dummy(blogs)
  assert.strictEqual(result, 1)
})
```

Once the test passes, commit your code and push it to GitHub if you're using version control.

## 4.4: Helper functions and unit tests, step 2

Define a new `totalLikes` function that receives a list of blog posts as a parameter. The function returns the total sum of likes in all of the blog posts in the list.

Write appropriate tests for the function into a new test file. You can decide the test cases and their amount by yourself, but at least test an empty list and a list with one blog. It is recommended to add the tests to the same file where the `dummy` function tests are.

## 4.5*: Helper functions and unit tests, step 3

Define a new `favoriteBlog` function that receives a list of blogs as a parameter. The function finds out which blog has the most likes. If there are many top favorites, it is enough to return one of them.

The value returned by the function could be in the following format:

```js
{
  title: "Canonical string reduction",
  author: "Edsger W. Dijkstra",
  likes: 12
}
```

**NB** when you are comparing objects, the `toStrictEqual` method is probably what you want to use, since the `toBe` tries to verify that the two values are the same value, and not just that they contain the same properties.

Write the tests for this exercise into a new test file.

## 4.6*: Helper functions and unit tests, step 4

This and the next exercise are a bit more challenging. Finishing these two exercises is not required to advance in the course material, so it may be a good idea to return to these once you're done going through the material for this part in full.

Finishing this exercise can be done without the use of additional libraries. However, this exercise is a great opportunity to define and use a helper function that you're sure will be useful later.

Implement the `mostBlogs` function that finds the author who has the largest amount of blogs. The return value should also specify how many blogs the author has:

```js
{
  author: "Robert C. Martin",
  blogs: 3
}
```

If there are many top bloggers, then it is enough to return any one of them.

## 4.7*: Helper functions and unit tests, step 5

Implement the `mostLikes` function that receives an array of blogs as a parameter. The function returns the author, whose blog posts have the largest amount of likes. The return value should also specify the total number of likes that the author has received:

```js
{
  author: "Edsger W. Dijkstra",
  likes: 17
}
```

If there are many top bloggers, then it is enough to show any one of them.

# [Exercises 4.8.-4.12.](https://fullstackopen.com/en/part4/testing_the_backend#exercises-4-8-4-12)

## 4.8: Blog list tests, step 1

Use the supertest package for writing a test that makes an HTTP GET request to the `/api/blogs` url. Verify that the blog list application returns the correct amount of blog posts in the JSON format.

Once the test passes, refactor the route handler to use the async/await syntax instead of promises.

Notice that you will have to make similar changes to the code that were made in the material, like defining the test environment so that you can write tests that use their own separate database.

**NB:** When running the tests, you may run into the following warning:

```
Jest has detected the following open handles potentially keeping Jest from exiting
```

The issue is likely caused by the fact that the database connection remains open after the tests are done. You can fix the issue by adding the necessary code to close the database connection in the teardown phase of the tests.

## 4.9: Blog list tests, step 2

Write a test that verifies that the unique identifier property of the blog posts is named `id`, not `_id`. Even though the database itself uses `_id`, the frontend expects the unique identifier to be named `id`.

Make the required changes to the code so that it passes the test. The `toJSON` method discussed in part 3 is an appropriate place for defining the `id` parameter.

## 4.10: Blog list tests, step 3

Write a test that verifies that making an HTTP POST request to the `/api/blogs` url successfully creates a new blog post. At the very least, verify that the total number of blogs in the system is increased by one. You can also verify that the content of the blog post is saved correctly to the database.

Once the test passes, refactor the operation to use async/await instead of promises.

## 4.11: Blog list tests, step 4

Write a test that verifies that if the `likes` property is missing from the request, it will default to the value 0. Do not test the other properties of the created blogs yet.

Make the required changes to the code so that it passes the test.

## 4.12: Blog list tests, step 5

Write tests related to creating new blogs via the `/api/blogs` endpoint, that verify that if the `title` or `url` properties are missing from the request data, the backend responds to the request with the status code `400 Bad Request`.

Make the required changes to the code so that it passes the test.

# [Exercises 4.13.-4.14.](https://fullstackopen.com/en/part4/testing_the_backend#exercises-4-13-4-14)

## 4.13: Blog list expansions, step 1

Implement functionality for deleting a single blog post resource.

Use the async/await syntax. Follow RESTful conventions when defining the HTTP API.

Implement tests for the functionality.

## 4.14: Blog list expansions, step 2

Implement functionality for updating the information of an individual blog post.

Use async/await.

The application mostly needs to update the number of likes for a blog post. You can implement this functionality the same way that we implemented updating notes in part 3.

Implement tests for the functionality.

# [Exercises 4.15.-4.17.](https://fullstackopen.com/en/part4/user_administration#exercises-4-15-4-17)

## 4.15: User administration

Implement a way to create new users by doing an HTTP POST request to address `api/users`. Users have `username`, `password` and `name`.

Keep in mind that you should not store the password in clear text. Use the `bcrypt` library like we did in part 4 chapter Creating new users.

**NB** Some Windows users have had problems with `bcrypt`. If you run into problems, remove the library with command

```bash
npm uninstall bcrypt
```

and install [bcryptjs](https://www.npmjs.com/package/bcryptjs) instead.

Implement a way to see the details of all users by doing a suitable HTTP request.

List of users can for example, look as follows:

```json
[
  {
    "username": "hellas",
    "name": "Arto Hellas",
    "id": "..."
  },
  {
    "username": "mluukkai",
    "name": "Matti Luukkainen",
    "id": "..."
  }
]
```

**Notice** Do not store the password hashes in the returned JSON.

## 4.16*: User administration, continued

Add a feature which adds the following restrictions to creating new users: Both username and password must be given and both must be at least 3 characters long. The username must be unique.

The operation must respond with a suitable status code and some kind of an error message if invalid user is created.

**NB** Do not test password restrictions with Mongoose validations. It is not a good idea because the password is not going to be stored in the database, we are storing the hash of the password. The password validation should be done in the controller as we did in part 3 before using the Mongoose validator.

Also, implement tests that ensure invalid users are not created and that an invalid add user operation returns a suitable status code and error message.

## 4.17: Blog list expansion, step 3

Expand blogs so that each blog contains information on the creator of the blog.

Modify adding new blogs so that when a new blog is created, _any_ user from the database is designated as its creator (for example the one found first). Implement this according to part 4 chapter populate. Which user is designated as the creator does not matter just yet. The functionality is finished in exercise 4.19.

Modify listing all blogs so that the creator's user information is displayed with the blog.

Modify listing all users so that each user's blogs are displayed in their user information.

# [Exercises 4.18.-4.23.](https://fullstackopen.com/en/part4/token_authentication#exercises-4-15-4-23)

## 4.18: Blog List Expansion, step 6

Implement token-based authentication according to part 4 chapter Token authentication.

## 4.19: Blog List Expansion, step 7

Modify adding new blogs so that it is only possible if a valid token is sent with the HTTP POST request. The user identified by the token is designated as the creator of the blog.

## 4.20*: Blog List Expansion, step 8

This example from part 4 shows taking the token from the header with the _getTokenFrom_ helper function in _controllers/blogs.js_.

If you used the same solution, refactor taking the token to a middleware. The middleware should take the token from the _Authorization_ header and assign it to the _token_ field of the _request_ object.

In other words, if you register this middleware in the _app.js_ file before all routes

```js
app.use(middleware.tokenExtractor)
```

Routes can access the token with _request.token_:

```js
blogsRouter.post('/', async (request, response) => {
  // ..
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  // ..
})
```

Remember that a normal middleware function is a function with three parameters, that at the end calls the last parameter _next_ to move the control to the next middleware:

```js
const tokenExtractor = (request, response, next) => {
  // code that extracts the token

  next()
}
```

## 4.21*: Blog List Expansion, step 9

Change the delete blog operation so that a blog can be deleted only by the user who added it. Therefore, deleting a blog is possible only if the token sent with the request is the same as that of the blog's creator.

If deleting a blog is attempted without a token or by an invalid user, the operation should return a suitable status code.

Note that if you fetch a blog from the database,

```js
const blog = await Blog.findById(...)
```

the field _blog.user_ does not contain a string, but an object. So if you want to compare the ID of the object fetched from the database and a string ID, a normal comparison operation does not work. The ID fetched from the database must be parsed into a string first.

```js
if ( blog.user.toString() === userid.toString() ) ...
```

## 4.22*: Blog List Expansion, step 10

Both the new blog creation and blog deletion need to find out the identity of the user who is doing the operation. The middleware _tokenExtractor_ that we did in exercise 4.20 helps but still both the handlers of _post_ and _delete_ operations need to find out who the user holding a specific token is.

Now create a new middleware called userExtractor that identifies the user related to the request and attaches it to the request object. After registering the middleware, the post and delete handlers should be able to access the user directly by referencing request.user:

```js
blogsRouter.post('/', userExtractor, async (request, response) => {
  // get user from request object
  const user = request.user
  // ..
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  // get user from request object
  const user = request.user
  // ..
})
```

Note that in this case, the userExtractor middleware has been registered with individual routes, so it is only executed in certain cases. So instead of using _userExtractor_ with all the routes,

```js
// use the middleware in all routes
app.use(middleware.userExtractor)
app.use('/api/blogs', blogsRouter)  
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
```

we could register it to be only executed with path _/api/blogs_ routes:

```js
// use the middleware only in /api/blogs routes
app.use('/api/blogs', middleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
```

This is done by chaining multiple middleware functions as parameters to the _use_ function. In the same way, middleware can also be registered only for individual routes:

```js
router.post('/', userExtractor, async (request, response) => {
  // ...
})
```

Make sure that fetching all blogs with a GET request still works without a token.

## 4.23*: Blog List Expansion, step 11

After adding token-based authentication the tests for adding a new blog broke down. Fix them. Also, write a new test to ensure adding a blog fails with the proper status code _401 Unauthorized_ if a token is not provided.

This is the last exercise for this part of the course and it's time to push your code to GitHub and mark all of your finished exercises to the exercise submission system.
