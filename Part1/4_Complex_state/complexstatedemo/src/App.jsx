import { useState } from 'react'


const History = (props) => {
  if (props.allClicks.length === 0) {
    return (
      <div>the app is used by pressing the buttons</div>
    )
  }
  return (
    <div>button press history: {props.allClicks.join(' ')}</div>
  )
}

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const App = () => {
  const [left, setLeft] = useState(0)
  const [right, setRight] = useState(0)
  const [allClicks, setAll] = useState([])
  const [total, setTotal] = useState(0)

  const [clicks, setClicks] = useState({
    left: 0, right: 0
  })
  const [value, setValue] = useState(10)


  const handleLeftClick = () => {
    // const newClicks = {
    //   left: clicks.left + 1,
    //   right: clicks.right
    // }
    // setClicks(newClicks)
    setClicks({ ...clicks, left: clicks.left + 1 })
    setAll(allClicks.concat('L'))
    console.log('left before', left)
    // setLeft(left + 1) // Even though a new value was set for left by calling setLeft(left + 1), the old value persists despite the update.
    // therefore total has wrong value.  
    const updatedLeft = left + 1
    setLeft(updatedLeft)
    console.log('left after', left)
    
    // setTotal(left + right)  // async update issue
    setTotal(updatedLeft + right)
  }

  const handleRightClick = () => {
    // const newClicks = {
    //   left: clicks.left,
    //   right: clicks.right + 1
    // }
    // setClicks(newClicks)
    setClicks({ ...clicks, right: clicks.right + 1 })
    
    setAll(allClicks.concat('R'))
    // setRight(right + 1) // async update issue
    const updatedRight = right + 1
    setRight(updatedRight)
    console.log('right after', right)
    // setTotal(left + right)  // async update issue
    setTotal(updatedRight + left)
  }

  // function that returns a function
  const setToValue1 = (newValue) => () => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  // or 
  const setToValue2 = (newValue) => {
    console.log('value now', newValue)
    setValue(newValue)
  }

  return (
    <div>
      <div>
      {clicks.left}
      <Button onClick={handleLeftClick} text='left' />
      <Button onClick={handleRightClick} text='right'/>
      {clicks.right}
      {/* <p>all clicks: {allClicks.join(' ')}</p> */}
      <p>total: {total}</p>
      <History allClicks={allClicks} />
      </div>
      <br />
      <div>
        {value}
        <br />
        <Button onClick={setToValue1(1000)} text='thousand' />
        <Button onClick={setToValue1(0)} text='reset' />
        <Button onClick={setToValue1(value + 1)} text='increment' />
      </div>
      <br />
      <div>
        {value}
        <br />
        <Button onClick={() => setToValue2(1000)} text='thousand' />
        <Button onClick={() => setToValue2(0)} text='reset' />
        <Button onClick={() => setToValue2(value + 1)} text='increment' />
      </div>
    </div>
  )
}

export default App
