
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

const Person = ({person}) => {
  return (
    <li>
      {person.name} {person.number}
    </li>
  )
}

const Persons = ({persons}) => {
  return (
    <div>
        {persons.map(person => <Person key={person.name} person={person} />)}
    </div>
  )
}

export {PersonForm, Persons }
