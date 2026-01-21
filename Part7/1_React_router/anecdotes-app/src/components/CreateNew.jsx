import { useNavigate } from 'react-router-dom'

const CreateNew = ({ addNew }) => {
  const navigate = useNavigate()

  const onSubmit = (e) => {
    e.preventDefault()
    const content = e.target.content.value
    const author = e.target.author.value
    const info = e.target.info.value
    addNew({ content, author, info, votes: 0 })
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={onSubmit}>
        <div>
          content
          <input name="content" />
        </div>
        <div>
          author
          <input name="author" />
        </div>
        <div>
          url for more info
          <input name="info" />
        </div>
        <button>create</button>
      </form>
    </div>
  )
}

export default CreateNew
