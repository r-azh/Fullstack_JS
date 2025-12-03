// console.log('hello world')

let notes = [
    {    id: "1",    content: "HTML is easy",    important: true  },
    {    id: "2",    content: "Browser can execute only JavaScript",    important: false  },
    {    id: "3",    content: "GET and POST are the most important methods of HTTP protocol",    important: true  }
]

//In the first row, the application imports Node's built-in web server module.
//  This is practically what we have already been doing in our browser-side code, but with a slightly different syntax:
const http = require('http')

//The code uses the createServer method of the http module to create a new web server.
//  An event handler is registered to the server that is called every time an 
// HTTP request is made to the server's address http://localhost:3001.
const app = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
//   response.end('Hello World')
//JSON.stringify(notes) method is necessary because the response.end() method
//  expects a string or a buffer to send as the response body.
  response.end(JSON.stringify(notes))
})

// Bind the http server assigned to the app variable, to listen to 
// HTTP requests sent to port 3001:
const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
