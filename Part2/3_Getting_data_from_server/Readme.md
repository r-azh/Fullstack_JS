# Getting data from server

We will now take a step in that direction by familiarizing ourselves with how the code executing in the browser communicates with the backend.

Let's use a tool meant to be used during software development called [JSON Server](https://github.com/typicode/json-server) to act as our server.

Create a file named db.json in the root directory of the previous notes project with the following data

You can start the JSON Server without a separate installation by running the following npx command in the root directory of the application:
```js
cd Fullstack_JS/Part2/3_Getting_data_from_server/notes 

npx json-server --port 3001 db.json
```
The JSON Server starts running on port 3000 by default, but we will now define an alternate port 3001. Let's navigate to the address http://localhost:3001/notes in the browser. We can see that JSON Server serves the notes we previously wrote to the file in JSON format


Going forward, the idea will be to save the notes to the server, which in this case means saving them to the json-server. The React code fetches the notes from the server and renders them to the screen. Whenever a new note is added to the application, the React code also sends it to the server to make the new note persist in "memory".

json-server stores all the data in the db.json file, which resides on the server. In the real world, data would be stored in some kind of database. However, json-server is a handy tool that enables the use of server-side functionality in the development phase without the need to program any of it.

## The browser as a runtime environment

Our first task is fetching the already existing notes to our React application from the address http://localhost:3001/notes.

In the [part0 example project](https://fullstackopen.com/en/part0/fundamentals_of_web_apps#running-application-logic-on-the-browser), we already learned a way to fetch data from a server using JavaScript. The code in the example was fetching the data using [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest), otherwise known as an HTTP request made using an XHR object. This is a technique introduced in 1999, which every browser has supported for a good while now.

The use of XHR is no longer recommended, and browsers already widely support the [fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch) method, which is based on so-called [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), instead of the event-driven model used by XHR.


As a reminder from part0 (which one should remember to not use without a pressing reason), data was fetched using XHR in the following way:

```js
const xhttp = new XMLHttpRequest()

xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    const data = JSON.parse(this.responseText)
    // handle the response that is saved in variable data
  }
}

xhttp.open('GET', '/data.json', true)
xhttp.send()
```
Right at the beginning, we register an event handler to the xhttp object representing the HTTP request, which will be called by the JavaScript runtime whenever the state of the xhttp object changes. If the change in state means that the response to the request has arrived, then the data is handled accordingly.

It is worth noting that the code in the event handler is defined before the request is sent to the server. Despite this, the code within the event handler will be executed at a later point in time. Therefore, the code does not execute synchronously "from top to bottom", but does so asynchronously. JavaScript calls the event handler that was registered for the request at some point.

A synchronous way of making requests that's common in `Java programming`, for instance, would play out as follows (NB, this is not actually working Java code):

```js
HTTPRequest request = new HTTPRequest();

String url = "https://studies.cs.helsinki.fi/exampleapp/data.json";
List<Note> notes = request.get(url);

notes.forEach(m => {
  System.out.println(m.content);
});
```
In Java, the code executes line by line and stops to wait for the HTTP request, which means waiting for the command request.get(...) to finish. The data returned by the command, in this case the notes, are then stored in a variable, and we begin manipulating the data in the desired manner.


In contrast, JavaScript engines, or runtime environments follow the [asynchronous model](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Execution_model). In principle, this requires all [IO operations](https://en.wikipedia.org/wiki/Input/output) (with some exceptions) to be executed as non-blocking. This means that code execution continues immediately after calling an IO function, without waiting for it to return.

When an asynchronous operation is completed, or, more specifically, at some point after its completion, the JavaScript engine calls the event handlers registered to the operation.

Currently, JavaScript engines are single-threaded, which means that they cannot execute code in parallel. As a result, it is a requirement in practice to use a non-blocking model for executing IO operations. Otherwise, the browser would "freeze" during, for instance, the fetching of data from a server.

Another consequence of this single-threaded nature of JavaScript engines is that if some code execution takes up a lot of time, the browser will get stuck for the duration of the execution. If we added the following code at the top of our application:

```js
setTimeout(() => {
  console.log('loop..')
  let i = 0
  while (i < 50000000000) {
    i++
  }
  console.log('end')
}, 5000)
```
everything would work normally for 5 seconds. However, when the function defined as the parameter for setTimeout is run, the browser will be stuck for the duration of the execution of the long loop. Even the browser tab cannot be closed during the execution of the loop, at least not in Chrome.

For the browser to remain responsive, i.e., to be able to continuously react to user operations with sufficient speed, the code logic needs to be such that no single computation can take too long.

There is a host of additional material on the subject to be found on the internet. One particularly clear presentation of the topic is the keynote by Philip Roberts called [What the heck is the event loop anyway](https://www.youtube.com/watch?v=8aGhZQkoFbQ)?

In today's browsers, it is possible to run parallelized code with the help of so-called [web workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers). The event loop of an individual browser window is, however, still only handled by a [single thread](https://medium.com/techtrument/multithreading-javascript-46156179cf9a).

### fetch
The fetch() method of the Window interface starts the process of fetching a resource from the network, returning a promise that is fulfilled once the response is available.

The promise resolves to the Response object representing the response to your request.

A fetch() promise only rejects when the request fails, for example, because of a badly-formed request URL or a network error. A fetch() promise does not reject if the server responds with HTTP status codes that indicate errors (404, 504, etc.). Instead, a then() handler must check the Response.ok and/or Response.status properties.

The fetch() method is controlled by the connect-src directive of Content Security Policy rather than the directive of the resources it's retrieving.
```js
//syntax
fetch(resource)
fetch(resource, options)
```

## npm
Let's get back to the topic of fetching data from the server.
That being said, we will be using the [axios](https://github.com/axios/axios) library instead for communication between the browser and server. It functions like fetch but is somewhat more pleasant to use. Another good reason to use Axios is that it helps us get familiar with adding external libraries, or npm packages, to React projects.

Nowadays, practically all JavaScript projects are defined using the node package manager, aka npm. The projects created using Vite also follow the [npm](https://docs.npmjs.com/about-npm) format. A clear indicator that a project uses npm is the package.json file located at the root of the project:
```json
{
  "name": "part2-notes-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@eslint/js": "^9.17.0",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "@vitejs/plugin-react": "^4.3.4",
    "eslint": "^9.17.0",
    "eslint-plugin-react": "^7.37.2",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.16",
    "globals": "^15.14.0",
    "vite": "^6.0.5"
  }
}
```
dependencies part is of most interest to us as it defines what dependencies, or external libraries, the project has.

We now want to use axios. Theoretically, we could define the library directly in the package.json file, but it is better to install it from the command line.
```shell
npm install axios
```
NB npm-commands should always be run in the project root directory, which is where the package.json file can be found.

In addition to adding axios to the dependencies, the npm install command also downloaded the library code. As with other dependencies, the code can be found in the node_modules directory located in the root. As one might have noticed, node_modules contains a fair amount of interesting stuff.

Let's make another addition. Install json-server as a development dependency (only used during development) by executing the command:
```shell
npm install json-server --save-dev
```
and add a small addition to the scripts part of the package.json file:
```json
{
  // ... 
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview",

    "server": "json-server -p 3001 db.json"
  },
}
```
After adding the above line you can run the server using this command
```shell
npm run server
```

NB The previously started json-server must be terminated before starting a new one; otherwise, there will be trouble:

As we can see, the application is not able to bind itself to the port. The reason being that port 3001 is already occupied by the previously started json-server.

We used the command npm install twice, but with slight differences:
```shell
npm install axios
npm install json-server --save-dev
```
There is a fine difference in the parameters. axios is installed as a runtime dependency of the application because the execution of the program requires the existence of the library. On the other hand, json-server was installed as a development dependency (--save-dev), since the program itself doesn't require it. It is used for assistance during software development. There will be more on different dependencies in the next part of the course.

## Axios and promisses

Now we are ready to use Axios. Going forward, json-server is assumed to be running on port 3001.

NB: To run json-server and your react app simultaneously, you may need to use two terminal windows. One to keep json-server running and the other to run our React application.

The library can be brought into use the same way other libraries, i.e., by using an appropriate import statement.

Add the following to the file main.jsx:
```js
import axios from 'axios'

const promise = axios.get('http://localhost:3001/notes')
console.log(promise)

const promise2 = axios.get('http://localhost:3001/foobar')
console.log(promise2)
```
Axios' method get returns a promise.

The documentation on Mozilla's site states the following about promises:

    A Promise is an object representing the eventual completion or failure of an asynchronous operation.

In other words, a promise is an object that represents an asynchronous operation. A promise can have three distinct states:

    The promise is pending: It means that the asynchronous operation corresponding to the promise has not yet finished and the final value is not available yet.
    The promise is fulfilled: It means that the operation has been completed and the final value is available, which generally is a successful operation.
    The promise is rejected: It means that an error prevented the final value from being determined, which generally represents a failed operation.

There are many details related to promises, but understanding these three states is sufficient for us for now. If you want, you can read more about promises in [Mozilla's documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).

The first promise in our example is fulfilled, representing a successful axios.get('http://localhost:3001/notes') request. The second one, however, is rejected, and the console tells us the reason. It looks like we were trying to make an HTTP GET request to a non-existent address.

If, and when, we want to access the result of the operation represented by the promise, we must register an event handler to the promise. This is achieved using the method then:
 
```js
const promise = axios.get('http://localhost:3001/notes')

promise.then(response => {
  console.log(response)
})
```
The JavaScript runtime environment calls the callback function registered by the then method providing it with a response object as a parameter. The response object contains all the essential data related to the response of an HTTP GET request, which would include the returned data, status code, and headers.

Storing the promise object in a variable is generally unnecessary, and it's instead common to chain the then method call to the axios method call, so that it follows it directly
A more readable way to format chained method calls is to place each call on its own line:
```js
axios
    .get('http://localhost:3001/notes')
    .then(response => {
    const notes = response.data
    console.log(notes)
  })
```
The callback function now takes the data contained within the response, stores it in a variable, and prints the notes to the console.

The data returned by the server is plain text, basically just one long string. The axios library is still able to parse the data into a JavaScript array, since the server has specified that the data format is application/json; charset=utf-8 (see the previous image) using the content-type header.

We can finally begin using the data fetched from the server.

Let's try and request the notes from our local server and render them, initially as the App component. Please note that this approach has many issues, as we're rendering the entire App component only when we successfully retrieve a response:
```js
import ReactDOM from 'react-dom/client'
import axios from 'axios'
import App from './App'

axios.get('http://localhost:3001/notes').then(response => {
  const notes = response.data
  ReactDOM.createRoot(document.getElementById('root')).render(<App notes={notes} />)
})
```

This method could be acceptable in some circumstances, but it's somewhat problematic. Let's instead move the fetching of the data into the App component.

What's not immediately obvious, however, is where the command axios.get should be placed within the component.

## Effect-hooks

We have already used [state hooks](https://react.dev/learn/state-a-components-memory) that were introduced along with React version 16.8.0, which provide state to React components defined as functions - the so-called functional components. Version 16.8.0 also introduces [effect hooks](https://react.dev/reference/react/hooks#effect-hooks) as a new feature. As per the official docs:

    Effects let a component connect to and synchronize with external systems. This includes dealing with network, browser DOM, animations, widgets written using a different UI library, and other non-React code.

As such, effect hooks are precisely the right tool to use when fetching data from a server.

Let's remove the fetching of data from main.jsx. Since we're going to be retrieving the notes from the server, there is no longer a need to pass data as props to the App component. So main.jsx can be simplified to:

```js
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
```
The App component changes as follows:

```js
import { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Note'


const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)


  useEffect(() => {
    console.log('effect')
    axios
      .get('http://localhost:3001/notes')
      .then(response => {
        console.log('promise fulfilled')
        setNotes(response.data)
      })
  }, [])
  console.log('render', notes.length, 'notes')

  // ...
}
```
At this point render 0 notes is printed, meaning data hasn't been fetched from the server yet.


As always, a call to a state-updating function triggers the re-rendering of the component. 

```js
useEffect(hook, [])
```
Now we can see more clearly that the function useEffect takes two parameters. The first is a function, the effect itself. According to the documentation:

    By default, effects run after every completed render, but you can choose to fire it only when certain values have changed.

So by default, the effect is always run after the component has been rendered. In our case, however, we only want to execute the effect along with the first render.

The second parameter of useEffect is used to specify how often the effect is run. If the second parameter is an empty array [], then the effect is only run along with the first render of the component.

There are many possible use cases for an effect hook other than fetching data from the server.

The code above is equivalent to:
```js
useEffect(() => {
  console.log('effect')

  const eventHandler = response => {
    console.log('promise fulfilled')
    setNotes(response.data)
  }

  const promise = axios.get('http://localhost:3001/notes')
  promise.then(eventHandler)
}, [])
```

## The development runtime environment
[image](https://fullstackopen.com/static/0e3766361ce9d08f0c4fdd39152cf493/5a190/18e.png)

The JavaScript code making up our React application is run in the browser. The browser gets the JavaScript from the React dev server, which is the application that runs after running the command npm run dev. The dev-server transforms the JavaScript into a format understood by the browser. Among other things, it stitches together JavaScript from different files into one file. We'll discuss the dev-server in more detail in part 7 of the course.

The React application running in the browser fetches the JSON formatted data from json-server running on port 3001 on the machine. The server we query the data from - json-server - gets its data from the file db.json.

At this point in development, all the parts of the application happen to reside on the software developer's machine, otherwise known as localhost. The situation changes when the application is deployed to the internet. We will do this in part 3.

## Excercise 2.11

2.11: The Phonebook Step 6
