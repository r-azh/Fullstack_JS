import Weather from './weather'
import getWeather from '../services/weather'

const Country = ({ country , weather }) => {
    console.log(country)
  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>Capital: {country.capital}</div>
      <div>Area: {country.area}</div>
      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages).map(language => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={country.name.common} />
      <Weather weather={weather} />
    </div>
  )
}

const CountryShortView = ({ country, showCountryHandler }) => {
  return (
    <div>
      {country.name.common + " "} 
      <button onClick={() => showCountryHandler(country)}>Show</button>
    </div>
  )
}

const Countries = ({ countries, showCountryHandler }) => {
  console.log(countries.length + " countries received")
  if (countries.length > 10) {
    return <div>Too many countries, specify another filter</div>
  }
  if (countries.length === 1) {
    console.log('countries[0].capital ->', countries[0].capital)
    const weather = getWeather({city: countries[0].capital[0]})
    return <Country country={countries[0]} weather={weather} />
  }
  return (
    <div>
      {countries.map(country => (
        <CountryShortView key={country.name.common} country={country} showCountryHandler={showCountryHandler} />
      ))}
    </div>
  )
}

export {Countries, Country}
