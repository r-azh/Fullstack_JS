import { useNavigate } from 'react-router-dom'

const Note = ({ note }) => {
  const navigate = useNavigate()

  if (!note) {
    return null
  }

  return (
    <div>
      <h2>{note.content}</h2>
      <div>{note.user}</div>
      <div><strong>{note.important ? 'important' : ''}</strong></div>
      <button onClick={() => navigate('/notes')}>back</button>
    </div>
  )
}

export default Note
