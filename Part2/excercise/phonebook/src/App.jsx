import { useState, useEffect } from 'react'
import { PersonForm, Persons } from './components/Persons.jsx'
import Filter from './components/Filter.jsx'
import axios from 'axios'
import personsService from './services/persons.js'


function App() {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchName, setSearchName] = useState('')
  const [personsToShow, setPersonsToShow] = useState([])

  const getPersonsHook = () => {
    console.log('effect hook to fetch persons from the server')
    personsService.getAll()
    .then(initialPersons => {
      console.log('axios get promise fulfilled')
      setPersons(initialPersons)
      setPersonsToShow(initialPersons)
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
    const existingPerson = persons.find(person => person.name === newName)
    // if (persons.some(person => person.name === newName)) {
    if (existingPerson) {
      if (existingPerson.number === newNumber) {
        alert(`${newName} is already added to the phonebook`)
        return
      } else {
        updatePerson(existingPerson.id, { ...existingPerson, number: newNumber })
        return
      }
    }
    const personObject = {
      name: newName,
      number: newNumber
    }
    personsService.create(personObject)
    .then(createdPerson => {
      console.log(createdPerson)
      setPersons(persons.concat(createdPerson))
      setPersonsToShow(personsToShow.concat(createdPerson))
      setNewName('')
      setNewNumber('')
    })
  }

  const removePerson = (id) => {
    if (window.confirm(
      `Delete ${persons.find(person => person.id === id).name}?`
    )) {
      console.log('removing person with id', id)
      personsService.remove(id)
      .then(response => {
        console.log('remove response', response)
        setPersons(persons.filter(person => person.id !== id))
        setPersonsToShow(personsToShow.filter(person => person.id !== id))
      })
    } 
  }

  const updatePerson = (id, newObject) => {
    if (window.confirm(
      `${newObject.name} is already added to the phonebook, replace the old number with the new one?`
    )) {
      personsService.update(id, newObject)
      .then(updatePerson => {
        console.log('update response', updatePerson)
        setPersons(persons.map(person => person.id === id ? updatePerson : person))
        setPersonsToShow(personsToShow.map(person => person.id === id ? updatePerson : person))
      })
    }
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
      <Persons persons={personsToShow} removePerson={removePerson} />
    </div>
  )
}

export default App
