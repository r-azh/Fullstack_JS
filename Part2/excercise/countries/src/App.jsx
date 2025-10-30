import { useState, useEffect } from 'react'
import countriesService from './services/countries.js'
import {Countries, Country} from './components/countries.jsx'

function App() {
  const [searchCountry, setSearchCountry] = useState('')
  const [countries, setCountries] = useState([])
  const [countriesToShow, setCountriesToShow] = useState([])

  useEffect(() => {
    console.log('effect hook to fetch countries from the server')
    countriesService.getAll()
    .then(initialCountries => {
      console.log('promise fulfilled')
      setCountries(initialCountries)
      setCountriesToShow(initialCountries)
    })
  }, [])

  const handleSearchCountryChange = (event) => {
    setSearchCountry(event.target.value)
    console.log('searchCountry ->', event.target.value)
    const searchCountryLower = event.target.value.toLowerCase()
    setCountriesToShow(
      countries.filter(country => country.name.common.toLowerCase().includes(searchCountryLower))
    )
  }

  const showCountryHandler = (country) => {
    console.log('showCountryHandler ->', country)
    setCountriesToShow([country])
  }

  return (
    <div>
      <label>Find countries </label>
      <input 
      type="text"
      value={searchCountry}
      onChange={handleSearchCountryChange}
      placeholder="countries"
      />
      <Countries countries={countriesToShow} showCountryHandler={showCountryHandler} />
    </div>
  )
}

export default App
