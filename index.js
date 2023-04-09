const http = require('http')

const express = require('express')
const app = express()

var morgan = require('morgan')
morgan.token('body', req => {
    return JSON.stringify(req.body)
})
app.use(morgan(':method :url :body'))

const cors = require('cors')
app.use(cors())

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
  
const unknownEndpoint = (request, response) => {
response.status(404).send({ error: 'unknown endpoint' })
}

app.use(express.json())
app.use(requestLogger)

let persons = 
[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {    
        response.json(person)  
    } else {    response.status(404).end()  }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    response.status(204).end()
})

const generateId = () => {
    return Math.floor(Math.random() * 100)
 }

const isFound = (name) => persons.some(person => {
    if (person.name === name) {
      return true;
    }

    return false;
});

app.post('/api/persons', (request, response) => {  
   
    const body = request.body
    console.log(body)
    if (!body.name) {
      return response.status(400).json({ 
        error: 'The name is missing' 
      })
    }

    if (!body.number) {
        return response.status(400).json({ 
          error: 'The number is missing' 
        })
    }
  
    if (isFound(body.name)) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }

    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
})



app.get('/info', (request, response) => {
    const time = Date().toLocaleString()
    const count = persons.length
    
    response.send(`<p>Phonebook has info for ${count} people. </p>
    <p>${time}</p>`)
        
})

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})