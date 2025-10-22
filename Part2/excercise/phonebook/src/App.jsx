import { useState } from 'react'
import { PersonForm, Persons } from './components/Persons.jsx'
import Filter from './components/Filter.jsx'

function App() {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')
  const [personsToShow, setPersonsToShow] = useState(persons)

  const handleNameChange = (event) => {
    console.log('newName ->', event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log('newNumber ->', event.target.value)
    setNewNumber(event.target.value)
  }

  const handleSearchNameChange = (event) => {
    console.log('searchName ->', event.target.value)
    setSearchName(event.target.value)
    const searchNameLower = event.target.value.toLowerCase()
    setPersonsToShow(
      persons.filter(person => person.name.toLowerCase().includes(searchNameLower))
    )
  }

  const addPerson = (event) => {
    event.preventDefault()
    // prevent empty entries  
    if (newName === '' || newNumber === '') return

    console.log(persons)
    // check if the name already exists
    if (persons.some(person => person.name === newName)) {
      alert(`${newName} is already added to the phonebook`)
      return
    }
    const personObject = {
      name: newName,
      number: newNumber
    }
    setPersons(persons.concat(personObject))
    setNewName('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter value={searchName} onChange={handleSearchNameChange} />
      
      <h3>add a new</h3>
        <PersonForm
         nameValue={newName}
         numberValue={newNumber}
         nameOnChange={handleNameChange}
         numberOnChange={handleNumberChange} 
         submitOnClick={addPerson}
        />

      <h3>Numbers</h3>
      <Persons persons={personsToShow} />
    </div>
  )
}

export default App
