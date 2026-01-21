import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const Button = styled.button`
  background: Bisque;
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid Chocolate;
  border-radius: 3px;
`

const Input = styled.input`
  margin: 0.25em;
`

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
          username:
          <Input name="username" />
        </div>
        <div>
          password:
          <Input type="password" name="password" />
        </div>
        <Button type="submit">login</Button>
      </form>
    </div>
  )
}

export default Login
