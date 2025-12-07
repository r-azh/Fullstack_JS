# Deploying app to internet
Using the notes fronend from part2-5 and note backend from part3-1


Running frontend app:
```sh
cd /Users/rezvan.aj/Repository/My/learn/Fullstack_JS/Part3/2_Deploy_the_app/notes/frontend
# npm install
npm run dev
```

Running backend:
```js
cd /Users/rezvan.aj/Repository/My/learn/Fullstack_JS/Part3/2_Deploy_the_app/notes/backend
// npm install
npm run dev
```

Let's change the attribute baseUrl in the frontend notes app at src/services/notes.js like so:
```js
const baseUrl = 'http://localhost:3001/api/notes'
```
we will get CORS error in frontend!

## Same origin policy and CORS



The issue lies with a thing called same origin policy. A URL's origin is defined by the combination of protocol (AKA scheme), hostname, and port.
```
http://example.com:80/index.html
  
protocol: http
host: example.com
port: 80
```
When you visit a website (e.g. http://example.com), the browser issues a request to the server on which the website (example.com) is hosted. The response sent by the server is an HTML file that may contain one or more references to external assets/resources hosted either on the same server that example.com is hosted on or a different website. When the browser sees reference(s) to a URL in the source HTML, it issues a request. If the request is issued using the URL that the source HTML was fetched from, then the browser processes the response without any issues. However, if the resource is fetched using a URL that doesn't share the same origin(scheme, host, port) as the source HTML, the browser will have to check the Access-Control-Allow-origin response header. If it contains * on the URL of the source HTML, the browser will process the response, otherwise the browser will refuse to process it and throws an error.

The same-origin policy is a security mechanism implemented by browsers in order to prevent session hijacking among other security vulnerabilities.

In order to enable legitimate cross-origin requests (requests to URLs that don't share the same origin) W3C came up with a mechanism called CORS(Cross-Origin Resource Sharing). According to Wikipedia:

    Cross-origin resource sharing (CORS) is a mechanism that allows restricted resources (e.g. fonts) on a web page to be requested from another domain outside the domain from which the first resource was served. A web page may freely embed cross-origin images, stylesheets, scripts, iframes, and videos. Certain "cross-domain" requests, notably Ajax requests, are forbidden by default by the same-origin security policy.

The problem is that, by default, the JavaScript code of an application that runs in a browser can only communicate with a server in the same origin. Because our server is in localhost port 3001, while our frontend is in localhost port 5173, they do not have the same origin.

Keep in mind, that same-origin policy and CORS are not specific to React or Node. They are universal principles regarding the safe operation of web applications.

We can allow requests from other origins by using Node's cors middleware.

In your backend repository, install cors with the command
```sh
npm install cors
```

take the middleware to use and allow for requests from all origins:
```js
const cors = require('cors')

app.use(cors())
```

Note: When you are enabling cors, you should think about how you want to configure it. In the case of our application, since the backend is not expected to be visible to the public in the production environment, it may make more sense to only enable cors from a specific origin (e.g. the front end).

Now most of the features in the frontend work! The functionality for changing the importance of notes has not yet been implemented on the backend so naturally that does not yet work in the frontend. We shall fix that later.

You can read more about CORS from Mozilla's page.

# Application to the Internet

Now that the whole stack is ready, let's move our application to Internet.

There is an ever-growing number of services that can be used to host an app on the internet. The developer-friendly services like PaaS (i.e. Platform as a Service) take care of installing the execution environment (eg. Node.js) and could also provide various services such as databases.

For a decade, Heroku was dominating the PaaS scene. Unfortunately the free tier Heroku ended at 27th November 2022. This is very unfortunate for many developers, especially students. Heroku is still very much a viable option if you are willing to spend some money. They also have a student program that provides some free credits.

We are now introducing two services [Fly.io](https://fly.io/) and [Render](https://render.com/). Fly.io offers more flexibility as a service, but it has also recently become paid. Render offers some free compute time, so if you want to complete the course without costs, choose Render. Setting up Render might also be easier in some cases, as Render does not require any installations on your own machine.

There are also some other free hosting options that work well for this course, at least for all parts other than part 11 (CI/CD) which might have one tricky exercise for other platforms.

Some course participants have also used the following services:

    Replit
    CodeSandBox

If you know easy-to-use and free services for hosting NodeJS, please let us know!

For both Fly.io and Render, we need to change the definition of the port our application uses at the bottom of the index.js file in the backend like so:
```js
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
```
Now we are using the port defined in the environment variable PORT or port 3001 if the environment variable PORT is undefined. It is possible to configure the application port based on the environment variable both in Fly.io and in Render.


## [Using Render for hosting](https://fullstackopen.com/en/part3/deploying_app_to_internet#application-to-the-internet)



## Frontend production build

So far we have been running React code in development mode. In development mode the application is configured to give clear error messages, immediately render code changes to the browser, and so on.

When the application is deployed, we must create a [production build](https://vite.dev/guide/build.html) or a version of the application that is optimized for production.

A production build for applications created with Vite can be created with the [command](https://vite.dev/guide/build.html) 
```sh
npm run build.
```

Let's run this command from the root of the notes frontend project that we developed in Part 2.

This creates a directory called dist which contains the only HTML file of our application (index.html) and the directory assets. Minified version of our application's JavaScript code will be generated in the dist directory. Even though the application code is in multiple files, all of the JavaScript will be minified into one file. All of the code from all of the application's dependencies will also be minified into this single file.

The minified code is not very readable.


## Serving static files from the backend



One option for deploying the frontend is to copy the production build (the dist directory) to the root of the backend directory and configure the backend to show the frontend's main page (the file dist/index.html) as its main page.

We begin by copying the production build of the frontend to the root of the backend. 
```sh
cp -r dist ../backend
```

To make Express show static content, the page index.html and the JavaScript, etc., it fetches, we need a built-in middleware from Express called [static](http://expressjs.com/en/starter/static-files.html).

When we add the following amidst the declarations of middlewares
```js
app.use(express.static('dist'))
```
whenever Express gets an HTTP GET request it will first check if the dist directory contains a file corresponding to the request's address. If a correct file is found, Express will return it.

Now HTTP GET requests to the address www.serversaddress.com/index.html or www.serversaddress.com will show the React frontend. GET requests to the address www.serversaddress.com/api/notes will be handled by the backend code.

Because of our situation, both the frontend and the backend are at the same address, we can declare baseUrl as a relative URL. This means we can leave out the part declaring the server in frontend.

```js
import axios from 'axios'

const baseUrl = '/api/notes'

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

// ...
```

After the change, we have to create a new production build of the frontend and copy it to the root of the backend directory.
