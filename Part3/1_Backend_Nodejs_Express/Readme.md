# [Node.js and Express](https://fullstackopen.com/en/part3/node_js_and_express#simple-web-server)

Our goal is to implement a backend that will work with the notes application from part 2. However, let's start with the basics by implementing a classic "hello world" application.

Notice that the applications and exercises in this part are not all React applications, and we will not use the create vite@latest -- --template react utility for initializing the project for this application.

We had already mentioned npm back in part 2, which is a tool used for managing JavaScript packages.

Create new backend project by:
```shell
npm init
```

Let's make a small change to the scripts object by adding a new script command.
```json
{
  // ...
  "scripts": {
    "start": "node index.js",    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ...
}
```

Next, let's create the first version of our application by adding an index.js file to the root of the project with the following code:
```js
console.log('hello world')
```
We can run the program directly with Node from the command line:

```shell
node index.js
```
Or we can run it as an npm script:
```shell
npm start
```
The start npm script works because we defined it in the package.json file above
Even though the execution of the project works when it is started by calling node index.js from the command line, it's customary for npm projects to execute such tasks as npm scripts.

By default, the package.json file also defines another commonly used npm script called npm test. 

## Simple web server

Let's change the application into a web server by editing the index.js file as follows:

```js
const http = require('http')

const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('Hello World')
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
```
Once the application is running, the following message is printed in the console:

Server running on port 3001

We can open our humble application in the browser by visiting the address http://localhost:3001

The server works the same way regardless of the latter part of the URL. Also the address http://localhost:3001/foo/bar will display the same content.


## Express

Implementing our server code directly with Node's built-in http web server is possible. However, it is cumbersome, especially once the application grows in size.

Many libraries have been developed to ease server-side development with Node, by offering a more pleasing interface to work with the built-in http module. These libraries aim to provide a better abstraction for general use cases we usually require to build a backend server. By far the most popular library intended for this purpose is Express.

Let's take Express into use by defining it as a project dependency with the command:
```shell
npm install express
```

The source code for the dependency is installed in the node_modules directory located at the root of the project. In addition to Express, you can find a great number of other dependencies in the directory:
These are the dependencies of the Express library and the dependencies of all of its dependencies, and so forth. These are called the transitive dependencies of our project.

We can update the dependencies of the project with the command:
```
npm update
```
 if we start working on the project on another computer, we can install all up-to-date dependencies of the project defined in package.json by running this next command in the project's root directory:
 
```npm install```

### Interactive Node:
Interactive node-repl. You can start the interactive node-repl by typing in node in the command line.


If we change the application's code, we first need to stop the application from the console (ctrl + c) and then restart it for the changes to take effect.
You can make the server track our changes by starting it with the --watch option:
```sh
node --watch index.js
```
Now, changes to the application's code will cause the server to restart automatically. Note that although the server restarts automatically, you still need to refresh the browser. 

Add a dev command:
Let's define a custom npm script in the package.json file to start the development server:
```json
{
  // ..
  "scripts": {
    "start": "node index.js",

    "dev": "node --watch index.js",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  // ..
}
```
Then we can run it with 
```sh
npm run dev
# Unlike when running the start or test scripts, the command must include run. 
# npm start
# npm test
```

## REST
Representational State Transfer, aka REST, was introduced in 2000 in Roy Fielding's dissertation. REST is an architectural style meant for building scalable web applications.

This way of interpreting REST falls under the second level of RESTful maturity in the Richardson Maturity Model. According to the definition provided by Roy Fielding, we have not defined a REST API. In fact, a large majority of the world's purported "REST" APIs do not meet Fielding's original criteria outlined in his dissertation.

In some places (see e.g. [Richardson, Ruby: RESTful Web Services](http://shop.oreilly.com/product/9780596529260.do)) you will see our model for a straightforward CRUD API, being referred to as an example of [resource-oriented architecture](https://en.wikipedia.org/wiki/Resource-oriented_architecture) instead of REST. 


We can define parameters for routes in Express by using the colon syntax:
```js
app.get('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const note = notes.find(note => note.id === id)
  response.json(note)
})
```

The if-condition leverages the fact that all JavaScript objects are truthy, meaning that they evaluate to true in a comparison operation. However, undefined is falsy meaning that it will evaluate to false.

## Postman
Let's install the Postman desktop client from [here](https://www.postman.com/downloads/) and try it out:

```sh
curl -v -X DELETE http://localhost:3001/api/notes/1
```

## The Visual Studio Code REST client

If you use Visual Studio Code, you can use the VS Code REST client plugin instead of Postman.

Once the plugin is installed, using it is very simple. We make a directory at the root of the application named requests. We save all the REST client requests in the directory as files that end with the .rest extension.

Let's create a new get_all_notes.rest file and define the request that fetches all notes.
By clicking the Send Request text, the REST client will execute the HTTP request and the response from the server is opened in the editor.
(Formatting)[https://github.com/Huachao/vscode-restclient/blob/master/README.md#usage]

You can also add multiple requests in the same file using `###` separators



    Important sidenote

    Sometimes when you're debugging, you may want to find out what headers have been set in the HTTP request. One way of accomplishing this is through the get method of the request object, that can be used for getting the value of a single header. The request object also has the headers property, that contains all of the headers of a specific request.

    Problems can occur with the VS REST client if you accidentally add an empty line between the top row and the row specifying the HTTP headers. In this situation, the REST client interprets this to mean that all headers are left empty, which leads to the backend server not knowing that the data it has received is in the JSON format.

    You will be able to spot this missing Content-Type header if at some point in your code you print all of the request headers with the `console.log(request.headers)` command.

## The WebStorm HTTP Client

If you use IntelliJ WebStorm instead, you can use a similar procedure with its built-in HTTP Client. Create a new file with extension .rest and the editor will display your options to create and run your requests. You can learn more about it by following this guide.

## Create a note

To access the data ind the body of request easily, we need the help of the Express json-parser that we can use with the command app.use(express.json()).

```js
const express = require('express')
const app = express()


app.use(express.json())

//...


app.post('/api/notes', (request, response) => {
  const note = request.body
  console.log(note)
  response.json(note)
})
```

Without the json-parser, the body property would be undefined. The json-parser takes the JSON data of a request, transforms it into a JavaScript object and then attaches it to the body property of the request object before the route handler is called.


NOTE: When programming the backend, keep the console running the application visible at all times. The development server will restart if changes are made to the code, so by monitoring the console, you will immediately notice if there is an error in the application's code

A potential cause for issues is an incorrectly set Content-Type header in requests. This can happen with Postman if the type of body is not defined correctly


You can find the code for our current application in its entirety in the part3-1 branch of this [GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-1).
If you clone the project, run the `npm install` command before starting the application with `npm start` or `npm run dev`.


## [Exercises 3.1.-3.6.](https://fullstackopen.com/en/part3/node_js_and_express#exercises-3-1-3-6)

3.1: Phonebook backend step 1

3.2: Phonebook backend step 2

3.3: Phonebook backend step 3

3.4: Phonebook backend step 4

3.5: Phonebook backend step 5

3.6: Phonebook backend step 6

## About HTTP request types

The HTTP standard talks about two properties related to request types, safety and idempotency.

The HTTP GET request should be safe:

    In particular, the convention has been established that the GET and HEAD methods SHOULD NOT have the significance of taking an action other than retrieval. These methods ought to be considered "safe".

Safety means that the executing request must not cause any side effects on the server. By side effects, we mean that the state of the database must not change as a result of the request, and the response must only return data that already exists on the server.

All HTTP requests except POST should be idempotent:

    Methods can also have the property of "idempotence" in that (aside from error or expiration issues) the side-effects of N > 0 identical requests is the same as for a single request. The methods GET, HEAD, PUT and DELETE share this property

POST is the only HTTP request type that is neither safe nor idempotent. If we send 5 different HTTP POST requests to /api/notes with a body of {content: "many same", important: true}, the resulting 5 notes on the server will all have the same content.

## Middleware

The Express json-parser used earlier is a middleware.

Middleware are functions that can be used for handling request and response objects.

The json-parser we used earlier takes the raw data from the requests that are stored in the request object, parses it into a JavaScript object and assigns it to the request object as a new property body.

In practice, you can use several middlewares at the same time. When you have more than one, they're executed one by one in the order that they were listed in the application code.

Middleware is a function that receives three parameters:
```js
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
```
At the end of the function body, the next function that was passed as a parameter is called. The next function yields control to the next middleware.

Middleware is used like this:

```js
app.use(requestLogger)
```

Remember, middleware functions are called in the order that they're encountered by the JavaScript engine. Notice that json-parser is listed before requestLogger , because otherwise request.body will not be initialized when the logger is executed!

Middleware functions have to be used before routes when we want them to be executed by the route event handlers. Sometimes, we want to use middleware functions after routes. We do this when the middleware functions are only called if no route handler processes the HTTP request.

Let's add the following middleware after our routes. This middleware will be used for catching requests made to non-existent routes. For these requests, the middleware will return an error message in the JSON format.

```js
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
```

You can find the code for our current application in its entirety in the part3-2 branch of this [GitHub repository](https://github.com/fullstack-hy2020/part3-notes-backend/tree/part3-2).

## [Exercises 3.7.-3.8 ](https://fullstackopen.com/en/part3/node_js_and_express#exercises-3-7-3-8)

3.7: Phonebook backend step 7

3.8*: Phonebook backend step 8
