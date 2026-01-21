import useField from '../hooks/useField'

const LoginForm = () => {
  const username = useField('text')
  const password = useField('password')

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('username:', username.value)
    console.log('password:', password.value)
    username.reset()
    password.reset()
  }

  // Destructure to exclude reset when spreading (avoids warning)
  const { reset: resetUsername, ...usernameProps } = username
  const { reset: resetPassword, ...passwordProps } = password

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <input {...usernameProps} />
      </div>
      <div>
        <input {...passwordProps} />
      </div>
      <button type="submit">login</button>
    </form>
  )
}

export default LoginForm
