import useField from '../hooks/useField'

const NoteForm = ({ createNote }) => {
  const content = useField('text')
  const author = useField('text')
  const info = useField('text')

  const handleSubmit = (event) => {
    event.preventDefault()
    createNote({
      content: content.value,
      author: author.value,
      info: info.value
    })
    content.reset()
    author.reset()
    info.reset()
  }

  // Destructure to exclude reset when spreading
  const { reset: resetContent, ...contentProps } = content
  const { reset: resetAuthor, ...authorProps } = author
  const { reset: resetInfo, ...infoProps } = info

  return (
    <div>
      <h2>create a new note</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...contentProps} />
        </div>
        <div>
          author
          <input {...authorProps} />
        </div>
        <div>
          url for more info
          <input {...infoProps} />
        </div>
        <button>create</button>
      </form>
    </div>
  )
}

export default NoteForm
