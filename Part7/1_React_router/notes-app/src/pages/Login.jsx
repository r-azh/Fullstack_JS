import { useNavigate } from 'react-router-dom'

const Login = ({ onLogin }) => {
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    onLogin(event.target.username.value)
    navigate('/')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input name="username" />
        <button type="submit">login</button>
      </div>
    </form>
  )
}

export default Login
