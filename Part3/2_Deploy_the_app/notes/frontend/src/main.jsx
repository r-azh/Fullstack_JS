import { createRoot } from 'react-dom/client'
import App from './App'

// import axios from 'axios'

// const promise = axios.get('http://localhost:3002/notes')
// console.log(promise)
// promise.then(response => {
//   console.log(response)
// })

// const promise2 = axios.get('http://localhost:3002/foobar')
// console.log(promise2)


//Storing the promise object in a variable is generally unnecessary, 
// and it's instead common to chain the then method call to the axios method call, so that it follows it directly
// axios
//   .get('http://localhost:3002/notes')
//   .then(response => {
//     const notes = response.data
//     console.log(notes)
//     createRoot(document.getElementById('root')).render(
//       <App notes={notes} />
//     )
//   })

// const notes = [
//   {
//     id: 1,
//     content: 'HTML is easy',
//     important: true
//   },
//   { 
//     id: 2,
//     content: 'Browser can execute only JavaScript',
//     important: false
//   },
//   { 
//     id: 3,
//     content: 'GET and POST are the most important HTTP methods.',
//     important: true
//   }
// ]

createRoot(document.getElementById('root')).render(
    // <App notes={notes} />
    <App />
)
