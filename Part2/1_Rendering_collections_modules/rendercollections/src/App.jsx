import { useState } from 'react'
import Note from './components/Note'

// const Note = ({note}) => {
//   return (
//     <li>
//       {note.content}
//     </li>
//   )
// }


// const App = (props) => {
// or
// const App = ({notes}) => {
//   const {notes} = props
// or using destructuring
const App = ({notes}) => {

  const ids = notes.map(note => note.id)
  console.log('ids', ids)
  
  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {/* <li>{notes[0].content}</li>
        <li>{notes[1].content}</li>
        <li>{notes[2].content}</li> */}

        {/* or using map */}
        {notes.map(note => 
          // <li key={note.id}>
          //   {note.content}
          // </li>
          // Note that the key attribute must now be defined for the Note components,
          //  and not for the li tags like before.
          <Note key={note.id} note={note} />
        )}


        {/* Anti-pattern: using the index as the key */}
        {/* {notes.map((note, i)=> 
          <li key={i}>
            {note.content}
          </li>
        )} */}
      </ul>
    </div>
  )
}

export default App
