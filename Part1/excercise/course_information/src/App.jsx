const Header = ({ course }) => {
  return <h1>{course}</h1>
}

const Part = ({ part, exercises }) => {
  return <p>{part} {exercises}</p>
}

const Content = ({ parts, exercises }) => {
  // return <p>{part} {exercises}</p>
  return (
    <div>
      <Part part={parts[0]} exercises={exercises[0]}/>
      <Part part={parts[1]} exercises={exercises[1]}/>
      <Part part={parts[2]} exercises={exercises[2]}/>
    </div>
  )
}

const Total = ({ exercises }) => {
  return <p>Number of exercises {exercises}</p>
}

const App = () => {
  const course = 'Half Stack application development'
  const parts = ['Fundamentals of React', 'Using props to pass data', 'State of a component']
  const exercises = [10, 7, 14]

  return (
      <div>
        <Header course={course}/>
        <Content parts={parts} exercises={exercises}/>
        <Total exercises={exercises[0] + exercises[1] + exercises[2]}/>
      </div>
  )
}

export default App
