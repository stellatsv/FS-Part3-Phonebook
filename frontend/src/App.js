import { useState, useEffect } from 'react'
import dbService from './dbService.js'
import './index.css'
const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [filterPersons, setNewFilterPersons] = useState(persons)
  const [addPhoneMessage, setAddPhoneMessage] = useState('')

  const hook = () => {       
    dbService.getAll().then(returnedPersons => {    
      setPersons(returnedPersons)   
      setNewFilterPersons(returnedPersons) 
    })
  }

  useEffect(hook, [])
  console.log('render', persons.length, 'persons')

  const addNumber = (event) => {
    let names = persons.map(person => person.name);
    console.log("values", names)
    if (names.includes(newName)) {
      alert(`${newName} is already added to phonebook`)      
    } else {
      event.preventDefault()
      var newEntry = {name: newName, number: newNumber}
      dbService.create(newEntry).then(newPerson => {
        setPersons(persons.concat(newPerson))  
        const filtered = (persons.concat(newPerson)).filter(person => 
          person.name.toUpperCase().includes(
            newFilter.toUpperCase()))
        console.log("filtered", filtered)
        setNewFilterPersons(filtered)
        setNewName('')
        setNewNumber('')
        setAddPhoneMessage(`Added ${newName}`)
      })              
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
    if (event.target.value !== '') {
      var filter = event.target.value
      console.log(filter)
      setNewFilter(filter)
      const filtered = persons.filter(person => 
        person.name.toUpperCase().includes(
          filter.toUpperCase()))
      setNewFilterPersons(filtered)
    } else {
      setNewFilterPersons(persons)
      setNewFilter('')
    }
    
  }

  const deleteEntry = (event) => {
    const selectedIndex = event.target.getAttribute('indexkey')
    const personToDelete = persons.find(person => person.id === parseInt(selectedIndex,10))
    const personName = personToDelete.name
    if (window.confirm(`Delete ${personName}?`)) {
      const remainingPersons = persons.filter(person => person.id !== selectedIndex)
      dbService.deletePerson(selectedIndex).then(() => {
        setPersons(remainingPersons)
        const filtered = remainingPersons.filter(person => 
          person.name.toUpperCase().includes(
            newFilter.toUpperCase()))
        setNewFilterPersons(filtered)
      })
    }   
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={addPhoneMessage} />
      <h3>Add a new</h3>
      <PersonForm addNumber={addNumber} newName={newName} handleNameChange = {handleNameChange}
        newNumber={newNumber} handleNumberChange={handleNumberChange}
        />
      <h2>Numbers</h2>
      <Filter newFilter={newFilter} handleFilter={handleFilter}/>
      <Persons filterPersons={filterPersons} deleteEntry={deleteEntry}/>
    </div>
  )
}
const Filter = (props) => {
  return (<form>
    <div>
      filter shown with: <input value={props.newFilter}
      onChange={props.handleFilter}/>
    </div>
  </form>)
}

const Notification = ({ message }) => {
  if (message === null || message==='') {
    return null
  }

  return (
    <div className='error'>
      {message}
    </div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addNumber}>
        <div>
          name: <input value={props.newName}
          onChange={props.handleNameChange}/>
        </div>
        <div>
          number: <input value={props.newNumber}
          onChange={props.handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
    </form>
  )
}

const Persons = (props) => {
  return (<ul>
    { props.filterPersons.map(person => 
      <li>  
          <Number name={person.name} number={person.number} onSubmit={props.deleteEntry} index={person.id}/> 
       
      </li>
    )}
  </ul>)
}

const Number = (props) => {
  return (
    <div>
    <form onSubmit={props.onSubmit} value={props.key} indexkey={props.index}>
      {props.name} {props.number}
      <input type="submit" value="Delete"/>
      </form>
    </div>
  )
}

export default App