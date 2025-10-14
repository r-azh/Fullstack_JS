// A component that gets the props object as an argument
const Hello = (props) => {
  const now = new Date()
  console.log(now)

  return (
    <div>
      <p>Hello World, it is {now.toLocaleDateString()}</p>
      <p>Hello {props.name}, you are {props.age} years old</p>
      <br/>
    </div>
  )
}

const Footer = () => {
  return (
    <footer>
      <br/>
      <p>greeting app created by <a href='https://github.com/mluukkai'>mluukkai</a></p>
    </footer>
  )
}

//  defines a React component with the name App
// Because the function consists of only a single expression we have used a shorthand:
const App = () => {
  
  const a = 10
  const b = 20

  const name = 'Peter'
  const age = 10

  const friends = [
    { name: 'Peter II', age: 4 },
    { name: 'Maya II', age: 10 },
  ]

  const friends_names = ['Peter III', 'Maya III']

  return (
  console.log("Hello from App function"),
  <>
    <h1>Greetings</h1>
    <Hello />
    <Hello name='Maya' age={26 + 10} />
    <Hello name={name} age={age} />

    <p>{a} + {b} = {a + b}</p>
    <p>{friends[0].name} {friends[0].age}</p>
    <p>{friends[1].name} {friends[1].age}</p>
    <p>{friends_names}</p>
    <Footer />
  </>
  )
}

export default App
