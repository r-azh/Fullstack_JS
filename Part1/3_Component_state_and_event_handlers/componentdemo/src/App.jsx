import { useState } from 'react'

// const Hello = (props) => {
//   const name = props.name
//   const age = props.age
// or const { name, age } = props
// Destructuring the props object
const Hello = ({name, age}) => {
  console.log(name, age)

  const bornYear = () => new Date().getFullYear() - age
  console.log(bornYear())

  return (
    <div>
      <p>
        Hello {name}, you are {age} years old
      </p>
      <p>So you were probably born in {bornYear()}</p>
    </div>
  )
}


// const App = (props) => {
//   const user = {
//     name: 'Arto Hellas',
//     age: 35,
//   }

//   const {counter} = props

//   return (
//     <div>
//       <h1>Greetings</h1>
//       <Hello {...user} />
//       <p>Counter: {counter}</p>
//     </div>
//   )
// }

// const Display = (props) => {
//   // console.log(props)
//   return <div>Counter: {props.counter}</div>
// }

// Destructuring
// const Display = ({counter}) => {
//   console.log(counter)
//   return <div>Counter: {counter}</div>
// } 

// Destructuring + compact form
const Display = ({counter}) => <div>Counter: {counter}</div>


// const Button = (props) => {
//   return (
//   <button onClick={props.onClick}>
//     {props.text}
//     </button>
//   )
// }
// Destructuring + compact form
const Button = ({ onClick, text }) => <button onClick={onClick}>{text}</button>


const App = () => {
  const [counter, setCounter] = useState(0) // adds state to the component and renders it initialized with the value zero.
  // The variable setCounter is assigned a function that will be used to modify the state.

  // setTimeout(
  //   () => setCounter(counter + 1), //a function to increment the counter state
  //   1000 //a timeout of one second
  //   )
  console.log('rendering with counter value', counter)

  const increaseByOne = () => {
    console.log('increasing, value before', counter)
    setCounter(counter + 1)
  }

  const setToZero = () => {
    console.log('resetting to zero, value before', counter)
    setCounter(0)
  }

  const decreaseByOne = () => {
    console.log('decreasing, value before', counter)
    setCounter(counter - 1)
  }
  
  return (
    <div>
      <Display counter={counter} />
      {/* Usually defining event handlers within JSX-templates is not a good idea. */}
      {/* <button onClick={() => setCounter(counter + 1)}> */}
      {/* <button onClick={increaseByOne}>
        plus
      </button> */}
      <Button onClick={increaseByOne} text='plus' />
      <Button onClick={setToZero} text='zero' />
      <Button onClick={decreaseByOne} text='minus'/>
    </div>
  )
}

export default App
