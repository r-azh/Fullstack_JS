import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

const Login = ({ onLogin }) => {
  const navigate = useNavigate()

  const onSubmit = (event) => {
    event.preventDefault()
    onLogin(event.target.username.value)
    navigate('/')
  }

  return (
    <div>
      <h2>login</h2>
      <form onSubmit={onSubmit}>
        <div>
          <TextField label="username" name="username" />
        </div>
        <div>
          <TextField label="password" type="password" name="password" />
        </div>
        <div>
          <Button variant="contained" color="primary" type="submit">
            login
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Login
