import ReactDOM from 'react-dom/client'

import App from './App'

// Renders app component contents into the div-element,
//  defined in the file index.html, having the id value 'root'.
// By default, the file index.html doesn't contain any HTML markup that is visible to us in the browser
ReactDOM.createRoot(document.getElementById('root')).render(<App />)
