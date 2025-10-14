import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(
  document.getElementById('root')
).render(
  <App />
)

// 1.
// let counter = 1


// ReactDOM.createRoot(
//   document.getElementById('root')
// ).render(
//   <App counter={counter} />
// )

// counter += 1  // This won't affect the counter in the App component because the component won't re-render.

 // 2.
//  We can get the component to re-render by calling the render method a second time, e.g. in the following way:
// const root = ReactDOM.createRoot(
//   document.getElementById('root')
// )

// const refresh = () => {
//   root.render(
//     <App counter={counter} />
//   )
// }
// refresh()
// counter += 1
// refresh()
// counter += 1
// refresh()

//3.
//// not recommended way to re-render components
// setInterval(() => {
//   refresh()
//   counter += 1
// }, 1000)
