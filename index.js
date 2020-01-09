const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(cors())


let persons = [
    {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
    },
    {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
    },
    {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
    },
    {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
    }
]

const getRandomId = () => {
    min = Math.ceil(5)
    max = Math.floor(1000000)

    return Math.floor(Math.random() * (max - min)) + min;
}

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/', (request, response) => {
    response.redirect('/info')
}
)

app.get('/info', (request, response) => {
    response.send(`<div><p>Phonebook has info for ${persons.length} people </p> <p>${Date()} </p>  </div>`)
}
)

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    person ? response.json(person)
        : response.status(404).end()
}
)


app.post('/api/persons/', (request, response) => {

    const body = request.body

    if(!body.name || !body.number){
        return response.status(400).json({
            error: 'name and number required'
        })
    }
    const duplicate = persons.find(person => person.name === body.name) 
    if(duplicate){
        return response.status(400).json({
            error: 'name must be unique'
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: getRandomId(),

    }

    persons = persons.concat(person)

    response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
}
)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})