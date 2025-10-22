import { useState } from 'react'

function App() {
  const [persons, setPersons] = useState([{name: 'Arto Hellas'}])
  const [newName, setNewName] = useState('')

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()
    // prevent empty entries  
    if (newName === '') return

    console.log(persons)
    // check if the name already exists
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to the phonebook`)
      return
    }
    const personObject = {
      name: newName
    }
    setPersons(persons.concat(personObject))
    setNewName('')
  }

  return (
    <div>
      <h1>Phonebook</h1>
        <form>
          <div>
            Name:
            <input
              value={newName}
              onChange={handleNameChange}
            />
          </div>
          <div>
            <button type="submit" onClick={addPerson}>add</button>
          </div>
        </form>
      <h2>Numbers</h2>
      <div>
        {persons.map(person=> 
        <li key={person.name}>{person.name}</li>)
        }
      </div>
    </div>
  )
}

export default App
