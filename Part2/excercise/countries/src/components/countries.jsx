const Country = ({ country }) => {
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
    </div>
  )
}

const Countries = ({ countries }) => {
  console.log(countries.length + " countries received")
  if (countries.length > 10) {
    return <div>Too many countries, specify another filter</div>
  }
  if (countries.length === 1) {
    return <Country country={countries[0]} />
  }
  return (
    <div>
      {countries.map(country => (
        <div key={country.name.common}>{country.name.common}</div>
      ))}
    </div>
  )
}

export default Countries
