import useCounter from '../hooks/useCounter'

const Counter = () => {
  const { value, increase, decrease, zero } = useCounter()

  return (
    <div>
      <div>{value}</div>
      <button onClick={increase}>+</button>
      <button onClick={decrease}>-</button>
      <button onClick={zero}>0</button>
    </div>
  )
}

export default Counter
