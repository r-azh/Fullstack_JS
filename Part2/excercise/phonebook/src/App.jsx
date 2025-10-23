import { useState, useEffect } from 'react'
import { PersonForm, Persons } from './components/Persons.jsx'
import Filter from './components/Filter.jsx'
import axios from 'axios'


function App() {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')
  const [personsToShow, setPersonsToShow] = useState([])

  const getPersonsHook = () => {
    console.log('effect hook to fetch persons from the server')
    axios
    .get('http://localhost:3001/persons')
    .then(response => {
      console.log('axios get promise fulfilled')
      setPersons(response.data)
      setPersonsToShow(response.data)
    })
  }
  useEffect(getPersonsHook, [])

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
    axios.post('http://localhost:3001/persons', personObject)
    .then(response => {
      console.log(response.data)
      setPersons(persons.concat(personObject))
      setNewName('')
    })
    .catch(error => {
      console.log(error)
    })
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
