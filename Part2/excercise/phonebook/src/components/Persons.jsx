
const PersonForm = ({nameValue, numberValue, nameOnChange, numberOnChange, submitOnClick}) => {
  return (
    <form>
      <div>
        Name:
        <input
          value={nameValue}
          onChange={nameOnChange}
        />
      </div>
      <div>
        Number:
        <input
          value={numberValue}
          onChange={numberOnChange}
        />
      </div>
      <div>
        <button type="submit" onClick={submitOnClick}>add</button>
      </div>
    </form>
  )
}

const Person = ({person, removePerson}) => {
  return (
    <li>
      {person.name} {person.number}
      <button onClick={() => removePerson(person.id)}>delete</button>
    </li>
  )
}

const Persons = ({persons, removePerson}) => {
  return (
    <div>
        {persons.map(person => <Person key={person.name} person={person} removePerson={removePerson} />)}
    </div>
  )
}

export {PersonForm, Persons }
