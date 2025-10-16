import { useState } from 'react'

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const Statistics = ({good, neutral, bad, total, average, positivePercentage}) => {
  if (total === 0) {
    return (
      <div>
        <p>No feedback given</p>
      </div>
    )
  }
  return (
    <div>
      <p>Good: {good}</p>
      <p>Neutral: {neutral}</p>
      <p>Bad: {bad}</p>
      <p>All: {total}</p>
      <p>Average: {average}</p>
      <p>Positive Percentage: {positivePercentage} %</p>
    </div>
  )
}

function App() {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [total, setTotal] = useState(0)
  const [average, setAverage] = useState(0)
  const [positivePercentage, setPositivePercentage] = useState(0)

  const calculateAverage = ({good, bad, total}) => {
    console.log('good', good)
    console.log('bad', bad)
    console.log('total', total)
    return ((good + (bad * -1)) / total)
  }

  const handleGoodClick = () => {
    const newGood = good + 1
    setGood(newGood)
    const newTotal = newGood + neutral + bad
    setTotal(newTotal)
    setAverage(calculateAverage({good: newGood, bad: bad, total: newTotal}))
    setPositivePercentage((newGood / newTotal) * 100)
  }
  const handleNeutralClick = () => {
    const newNeutral = neutral + 1
    setNeutral(newNeutral)
    const newTotal = good + newNeutral + bad
    setTotal(newTotal)
    setAverage(calculateAverage({good: good, bad: newNeutral, total: newTotal}))
    setPositivePercentage((good / newTotal) * 100)
  }
  const handleBadClick = () => {
    const newBad = bad + 1
    setBad(newBad)
    const newTotal = good + neutral + newBad
    setTotal(newTotal)
    setAverage(calculateAverage({good: good, bad: newBad, total: newTotal}))
    setPositivePercentage((good / newTotal) * 100)

  }

  return (
    <>
      <div>
        <h1>Give Feedback</h1>
        <Button onClick={handleGoodClick} text='Good' />
        <Button onClick={handleNeutralClick} text='Neutral' />
        <Button onClick={handleBadClick} text='Bad' />
        <h1>Statistics</h1>
        <Statistics good={good} neutral={neutral} bad={bad} total={total} average={average} positivePercentage={positivePercentage} />
      </div>
    </>
  )
}

export default App
