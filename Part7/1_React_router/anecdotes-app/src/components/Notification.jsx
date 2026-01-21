const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }

  return (
    <div style={{
      border: 'solid',
      padding: 10,
      borderWidth: 1,
      marginBottom: 10
    }}>
      {notification}
    </div>
  )
}

export default Notification
